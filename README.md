# Instant Postgres Database

[Live Demo → instanile.vercel.app](https://instanile.vercel.app/)

Create a free, instant Postgres database with one click. Powered by [Nile](https://thenile.dev).

---

## ✨ Features

- One-click creation of a real, isolated Postgres database
- Copyable connection string (URI) for instant use
- Region auto-selection (EU/US) based on user location
- Beautiful, modern UI inspired by thenile.dev
- Deployable to Vercel in seconds

---

## 🚀 Try It Live

[https://instanile.vercel.app/](https://instanile.vercel.app/)

---

## 🛠️ Running Locally

1. **Clone the repo:**

   ```sh
   git clone https://github.com/yourusername/instanile.git
   cd instanile/instanile-web
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   - Copy `.env.local.example` to `.env.local` (or create it):

     ```sh
     cp .env.local.example .env.local
     ```

   - Add your Nile API credentials:

     ```env
     NILE_API_KEY=your_nile_api_key
     NILE_WORKSPACE=your_workspace_slug
     ```

4. **Run the dev server:**

   ```sh
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deploy Your Own (Vercel)

1. **Push your code to GitHub** (or GitLab/Bitbucket).
2. **Go to [vercel.com](https://vercel.com/)** and import your repo.
3. **Set environment variables** in the Vercel dashboard:
   - `NILE_API_KEY`
   - `NILE_WORKSPACE`
4. **Deploy!**

---

## 📝 Environment Variables

- `NILE_API_KEY` — Your Nile API key (get it from the Nile console)
- `NILE_WORKSPACE` — Your Nile workspace slug

---

## 🐘 Credits

- Built with [Next.js](https://nextjs.org/)
- Database magic by [Nile](https://thenile.dev)
- UI inspired by [thenile.dev](https://thenile.dev)

---

## License

MIT
