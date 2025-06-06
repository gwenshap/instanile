"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateDb = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    setUri(null);
    try {
      const res = await fetch("/api/create-db", { method: "POST" });
      const data = await res.json();
      if (data.uri) {
        setUri(data.uri);
      } else {
        setError(data.error || "No URI returned");
      }
    } catch {
      setError("Failed to create database");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (uri) {
      navigator.clipboard.writeText(uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <div className={styles.title}>Instant Postgres Database</div>
        <button
          className={styles.nileBtn}
          onClick={handleCreateDb}
          disabled={loading}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={styles.spinner} /> Creating...
            </span>
          ) : (
            "Create Database"
          )}
        </button>
        {error && <div style={{ color: "#ef4444", marginBottom: 8, textAlign: "center" }}>{error}</div>}
        {uri && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <span className={styles.codeBlock}>{uri}</span>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
        <div style={{ fontSize: 13, color: "#888", marginTop: 18, textAlign: "center" }}>
          You&apos;ll get a Postgres URI you can use instantly.<br />
          <span style={{ fontSize: 12 }}>Powered by <a href="https://thenile.dev" target="_blank" rel="noopener noreferrer" style={{ color: "#06b6d4", textDecoration: "none" }}>Nile</a></span>
        </div>
      </div>
    </div>
  );
}
