import { useState } from "react";
import { LockIcon, EyeIcon } from "./SignUp.jsx";
import ResultSheet from "./ResultSheet.jsx";

const FIELDS = [
  { key: "current", label: "Current Password", auto: "current-password" },
  { key: "next", label: "New Password", auto: "new-password" },
  { key: "confirm", label: "Confirm New Password", auto: "new-password" },
];

export default function ChangePassword({ onBack, onSubmit, onDone }) {
  const [show, setShow] = useState({});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const clear = (k) => () => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));

  const submit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const v = {};
    if (!f.current) v.current = "Enter your current password";
    if (!f.next) v.next = "Enter a new password";
    else if (f.next.length < 8) v.next = "Password must be at least 8 characters";
    else if (f.next === f.current) v.next = "New password must be different from the current one";
    if (!f.confirm) v.confirm = "Confirm your new password";
    else if (f.confirm !== f.next) v.confirm = "Passwords don\u2019t match";
    setErrors(v);
    const first = FIELDS.find(({ key }) => v[key]);
    if (first) return document.getElementById(`cp-${first.key}`)?.focus();

    setBusy(true);
    try {
      // onSubmit may return (or resolve to) { errors: { current: "Wrong password" } }
      const res = await onSubmit?.({ currentPassword: f.current, newPassword: f.next });
      if (res?.errors) setErrors(res.errors);
      else setDone(true);
    } finally { setBusy(false); }
  };

  return (
    <main className="app wp pd cp">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Change Password</h1>
      </header>

      <form id="cp-form" className="wp-body" onSubmit={submit} noValidate>
        <section className="wp-card">
          <h2>Change Password Form</h2>
          <p className="wp-sub">Fill information to change your password</p>

          {FIELDS.map(({ key, label, auto }) => (
            <div className="field wp-field" key={key}>
              <label htmlFor={`cp-${key}`}>{label}</label>
              <div className={`control${errors[key] ? " err" : ""}`}>
                <span className="lead"><LockIcon /></span>
                <input
                  id={`cp-${key}`} name={key} type={show[key] ? "text" : "password"} placeholder="My Password" autoComplete={auto}
                  aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `cp-${key}-err` : undefined} onInput={clear(key)}
                />
                <button type="button" className="toggle" onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))} aria-label={`${show[key] ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={!!show[key]}>
                  <EyeIcon off={!show[key]} />
                </button>
              </div>
              {errors[key] && <p className="cp-err" id={`cp-${key}-err`} role="alert">{errors[key]}</p>}
            </div>
          ))}
        </section>
      </form>

      {done && (
        <ResultSheet
          icon="bolt"
          title="Password Updated!"
          text="Congratulations! you have been updated your password successfully! you can now access your account with your new password"
          action="Yes, Update Password"
          onAction={() => onDone?.()}
        />
      )}

      <div className="wp-bar">
        <button type="submit" form="cp-form" className="btn primary" disabled={busy} aria-busy={busy}>Update Password</button>
      </div>
    </main>
  );
}
