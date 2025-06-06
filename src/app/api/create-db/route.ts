import { NextRequest, NextResponse } from 'next/server';

// Helper to generate a random db name
function randomDbName() {
  return 'db_' + Math.random().toString(36).substring(2, 10);
}

// Helper to get region from IP
async function getRegionFromIp(ip: string | null): Promise<'AWS_EU_CENTRAL_1' | 'AWS_US_WEST_2'> {
  try {
    if (!ip) return 'AWS_US_WEST_2';
    // Use ipapi.co for geolocation
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!geoRes.ok) return 'AWS_US_WEST_2';
    const geo = await geoRes.json();
    console.log('Geo lookup result:', geo);
    // geo.continent_code === 'EU' for Europe
    if (geo && geo.continent_code === 'EU') {
      return 'AWS_EU_CENTRAL_1';
    }
    return 'AWS_US_WEST_2';
  } catch (err) {
    console.error('Geo lookup error:', err);
    return 'AWS_US_WEST_2';
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.NILE_API_KEY;
    const workspace = process.env.NILE_WORKSPACE;
    if (!apiKey || !workspace) {
      console.error('Missing Nile API credentials');
      return NextResponse.json({ error: 'Missing Nile API credentials in environment' }, { status: 500 });
    }

    // Get client IP address
    let ip = req.headers.get('x-forwarded-for') || null;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim(); // take first if multiple
    console.log('Client IP:', ip);
    // If running locally, ipapi.co will return your server's IP

    // Pick region based on IP
    const apiRegion = await getRegionFromIp(ip);
    console.log('Selected region:', apiRegion);

    // 1. Create a new database
    const dbName = randomDbName();
    console.log('Creating DB:', dbName);
    const createDbRes = await fetch(`https://global.thenile.dev/workspaces/${workspace}/databases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ databaseName: dbName, region: apiRegion }),
    });
    if (!createDbRes.ok) {
      const err = await createDbRes.text();
      console.error('Error creating database:', err);
      return NextResponse.json({ error: 'Error creating database: ' + err }, { status: 500 });
    }
    const dbJson = await createDbRes.json();
    console.log('Database created:', dbJson);

    // 2. Create credentials for the new database
    const credRes = await fetch(`https://global.thenile.dev/workspaces/${workspace}/databases/${dbName}/credentials`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (!credRes.ok) {
      const err = await credRes.text();
      console.error('Error creating credentials:', err);
      return NextResponse.json({ error: 'Error creating credentials: ' + err }, { status: 500 });
    }
    const cred = await credRes.json();
    console.log('Credentials created:', cred);
    // Fix region for hostname
    const region = cred.database.region.replace(/^aws[-_]/i, '').replace(/_/g, '-').toLowerCase();
    const connStr = `postgres://${cred.id}:${cred.password}@${region}.db.thenile.dev:5432/${cred.database.name}`;
    console.log('Connection string:', connStr);
    return NextResponse.json({ uri: connStr });
  } catch (e: any) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
} 