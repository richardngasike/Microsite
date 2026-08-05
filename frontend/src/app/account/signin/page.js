"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import styles from "../auth.module.css";

export default function SignInPage() {
  const { login } = useAuth();

  const [form, setForm]         = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState("");
  const [status, setStatus]     = useState("idle"); // idle | sending
  const [showPass, setShowPass] = useState(false);

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    // Clear field error as user types
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                               e.email    = "Enter a valid email address.";
    if (!form.password)        e.password = "Password is required.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setStatus("sending");
    setServerError("");

    try {
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Surface the exact message from Django (e.g. "Invalid credentials.")
        setServerError(data?.error || "Sign in failed. Please try again.");
        setStatus("idle");
        return;
      }

      // Success — store token and user via AuthContext, then redirect
      login(data.token, { name: data.name || form.email, email: form.email });
      window.location.href = "/";
    } catch {
      setServerError("Could not reach the server. Check your connection.");
      setStatus("idle");
    }
  };

  const onKeyDown = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Branding */}
        <div className={styles.cardBrand}>
          <img src="/images/UNAIDS_EN.png" alt="UNAIDS" className={styles.brandLogo} />
        </div>

        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Access country profiles, sustainability roadmaps and resources.
        </p>

        {/* Email */}
        <label className={`${styles.field} ${errors.email ? styles.fieldError : ""}`}>
          <span>Email address <em className={styles.req}>*</em></span>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            onKeyDown={onKeyDown}
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby={errors.email ? "email-err" : undefined}
          />
          {errors.email && (
            <span id="email-err" className={styles.fieldMsg}>{errors.email}</span>
          )}
        </label>

        {/* Password */}
        <label className={`${styles.field} ${errors.password ? styles.fieldError : ""}`}>
          <span>Password <em className={styles.req}>*</em></span>
          <div className={styles.passwordWrap}>
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              onKeyDown={onKeyDown}
              autoComplete="current-password"
              placeholder="Your password"
              aria-describedby={errors.password ? "pass-err" : undefined}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span id="pass-err" className={styles.fieldMsg}>{errors.password}</span>
          )}
        </label>

        {/* Server-level error */}
        {serverError && (
          <div className={styles.serverError} role="alert">
            {serverError}
          </div>
        )}

        <button
          className={styles.submit}
          onClick={submit}
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <span className={styles.spinner} aria-label="Signing in…" />
          ) : (
            "Sign in"
          )}
        </button>

        <p className={styles.switch}>
          Don't have an account?{" "}
          <Link href="/account/create">Create one</Link>
        </p>
      </div>
    </div>
  );
}