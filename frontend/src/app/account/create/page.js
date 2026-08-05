"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import styles from "../auth.module.css";

// Password strength rules — each checked independently so the user sees live
// feedback as they type.
const RULES = [
  { id: "len",   label: "At least 8 characters",      test: (p) => p.length >= 8         },
  { id: "upper", label: "One uppercase letter",        test: (p) => /[A-Z]/.test(p)       },
  { id: "num",   label: "One number",                  test: (p) => /[0-9]/.test(p)       },
];

export default function CreateAccountPage() {
  const { login } = useAuth();

  const [form, setForm]         = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState("");
  const [status, setStatus]     = useState("idle"); // idle | sending | done
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name    = "Full name is required.";
    if (!form.email.trim())    e.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                               e.email   = "Enter a valid email address.";
    if (!form.password)        e.password = "Password is required.";
    else if (RULES.some((r) => !r.test(form.password)))
                               e.password = "Password does not meet the requirements.";
    if (form.password !== form.confirm)
                               e.confirm  = "Passwords do not match.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setStatus("sending");
    setServerError("");

    try {
      const res = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data?.error || "Registration failed. Please try again.");
        setStatus("idle");
        return;
      }

      // Auto sign-in after successful registration
      const loginRes = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        login(loginData.token, { name: form.name, email: form.email });
        window.location.href = "/";
      } else {
        // Registration worked but auto-login failed — send to sign-in
        window.location.href = "/account/signin";
      }
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

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>
          Join to access country profiles, roadmaps and all resources.
        </p>

        {/* Full name */}
        <label className={`${styles.field} ${errors.name ? styles.fieldError : ""}`}>
          <span>Full name <em className={styles.req}>*</em></span>
          <input
            value={form.name}
            onChange={update("name")}
            onKeyDown={onKeyDown}
            autoComplete="name"
            placeholder="Richard Ngasike"
          />
          {errors.name && <span className={styles.fieldMsg}>{errors.name}</span>}
        </label>

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
          />
          {errors.email && <span className={styles.fieldMsg}>{errors.email}</span>}
        </label>

        {/* Password + strength checker */}
        <label className={`${styles.field} ${errors.password ? styles.fieldError : ""}`}>
          <span>Password <em className={styles.req}>*</em></span>
          <div className={styles.passwordWrap}>
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              onKeyDown={onKeyDown}
              autoComplete="new-password"
              placeholder="Create a password"
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
          {errors.password && <span className={styles.fieldMsg}>{errors.password}</span>}

          {/* Live strength feedback — show when field has content or is focused */}
          {(passFocused || form.password.length > 0) && (
            <ul className={styles.rules} aria-label="Password requirements">
              {RULES.map((r) => {
                const ok = r.test(form.password);
                return (
                  <li key={r.id} className={ok ? styles.rulePassed : styles.ruleFailed}>
                    {ok
                      ? <FiCheck size={13} aria-hidden="true" />
                      : <FiX    size={13} aria-hidden="true" />
                    }
                    {r.label}
                  </li>
                );
              })}
            </ul>
          )}
        </label>

        {/* Confirm password */}
        <label className={`${styles.field} ${errors.confirm ? styles.fieldError : ""}`}>
          <span>Confirm password <em className={styles.req}>*</em></span>
          <div className={styles.passwordWrap}>
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={update("confirm")}
              onKeyDown={onKeyDown}
              autoComplete="new-password"
              placeholder="Repeat your password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.confirm && <span className={styles.fieldMsg}>{errors.confirm}</span>}
        </label>

        {/* Server error */}
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
            <span className={styles.spinner} aria-label="Creating account…" />
          ) : (
            "Create account"
          )}
        </button>

        <p className={styles.switch}>
          Already have an account?{" "}
          <Link href="/account/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}