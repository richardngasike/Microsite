"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import { API_URL } from "@/lib/api";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Get in touch"
        lead="Questions about the initiative, the process, or how to develop a country roadmap? Send us a message."
      />
      <div className={`container ${styles.wrap}`}>
        <div className={styles.grid}>
          <div className={styles.form}>
            {status === "sent" ? (
              <div className={styles.success}>
                <h2>Message sent</h2>
                <p>Thank you — we will get back to you by email.</p>
                <button className={styles.reset} onClick={() => setStatus("idle")}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                <Field label="Full name" required>
                  <input value={form.name} onChange={update("name")} />
                </Field>
                <Field label="Email" required>
                  <input type="email" value={form.email} onChange={update("email")} />
                </Field>
                <Field label="Subject">
                  <input value={form.subject} onChange={update("subject")} />
                </Field>
                <Field label="Message" required>
                  <textarea rows={6} value={form.message} onChange={update("message")} />
                </Field>

                {status === "error" && (
                  <p className={styles.error}>
                    Please complete the required fields and try again.
                  </p>
                )}

                <button
                  className={styles.submit}
                  onClick={submit}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </>
            )}
          </div>

          <aside className={styles.aside}>
            <h2 className={styles.asideTitle}>Other ways to reach us</h2>
            <p className={styles.asideText}>
              For general enquiries about the HIV Response Sustainability
              initiative, email the UNAIDS team.
            </p>
            <a href="mailto:sustainability@unaids.org" className={styles.email}>
              sustainability@unaids.org
            </a>
            <p className={styles.asideNote}>
              Prefer answers first? Check the{" "}
              <a href="/faqs">frequently asked questions</a>.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({ label, required, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label} {required && <em className={styles.req}>*</em>}
      </span>
      {children}
    </label>
  );
}
