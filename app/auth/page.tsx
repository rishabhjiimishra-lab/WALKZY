"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const accounts = [
  ["customer@demo.walkzy", "CustomerDemo123!", "Customer"],
  ["walker@demo.walkzy", "WalkerDemo123!", "Walker"],
  ["merchant@demo.walkzy", "MerchantDemo123!", "Merchant"],
  ["admin@demo.walkzy", "AdminDemo123!", "Admin"]
];

export default function AuthPage() {
  return <Suspense fallback={<main className="auth-page"><div className="auth-card"><a className="brand" href="/">WALKZY</a><p className="muted">Loading sign-in…</p></div></main>}><AuthForm /></Suspense>;
}

function AuthForm() {
  const search = useSearchParams();
  const [email, setEmail] = useState("customer@demo.walkzy");
  const [password, setPassword] = useState("CustomerDemo123!");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Unable to sign in");
      setBusy(false);
      return;
    }
    window.location.assign(search.get("next") || result.redirect);
  }

  return <main className="auth-page"><div className="auth-card"><a className="brand" href="/">WALKZY</a><div className="eyebrow">Secure demo access</div><h1>Welcome back.</h1><p className="muted">Choose a demo role or enter its credentials to continue.</p><form onSubmit={submit}><label>Email<input value={email} onChange={event => setEmail(event.target.value)} type="email" required /></label><label>Password<input value={password} onChange={event => setPassword(event.target.value)} type="password" required /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form><div className="demo-list"><b>Demo accounts</b>{accounts.map(([account, secret, label]) => <button className="demo-account" key={account} type="button" onClick={() => { setEmail(account); setPassword(secret); }}>{label}<span>{account}</span></button>)}</div></div></main>;
}
