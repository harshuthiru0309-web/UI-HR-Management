import { useState } from "react";
import TermsSheet from "./TermsSheet.jsx";
import VerifySheet from "./VerifySheet.jsx";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...stroke} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3.5" /><path d="m7 10 5 3.5L17 10" />
  </svg>
);
export const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...stroke} aria-hidden="true">
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M9.5 13a2.5 2.5 0 0 1 5 0v2.5M12 11v5M9.5 15.5v-1" />
  </svg>
);
export const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...stroke} aria-hidden="true">
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
    {off && <path d="M4 20 20 4" />}
  </svg>
);
export const Chevron = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...stroke} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

function Field({ label, id, icon, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="control">
        {icon && <span className="lead">{icon}</span>}
        {children}
      </div>
    </div>
  );
}

function PasswordField({ id, label, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} id={id} icon={<LockIcon />}>
      <input id={id} name={id} type={show ? "text" : "password"} placeholder={placeholder} autoComplete={autoComplete} required />
      <button type="button" className="toggle" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
        <EyeIcon off={!show} />
      </button>
    </Field>
  );
}

export default function SignUp({ onSignIn, onVerified }) {
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(null);
  const openTerms = (e) => { e.preventDefault(); setShowTerms(true); };

  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (data.password !== data.confirm) return setError("Passwords don’t match. Re-enter both and try again.");
    if (!agree) return setError("Accept the terms & conditions and privacy policy to continue.");
    setError("");
    console.log("Sign up", data); // replace with your API call
    setVerifyEmail(data.email);
  };

  return (
    <main className="app signup">
      <header className="brand">
        <div className="logo" aria-hidden="true">
          <svg viewBox="0 0 40 32" width="55%" fill="#fff">
            <path d="M4 3h7v26H4zM15 3h4v26h-4zM21 3h4v26h-4zM29 3h7v26h-7z" />
            <path d="M11 8l4 6-4 6z" fill="#7c5cfa" />
          </svg>
        </div>
        <h1>Work Mate</h1>
        <p>Register Using Your Credentials</p>
      </header>

      <form className="form" onSubmit={submit} noValidate={false}>
        <Field label="Email" id="email" icon={<MailIcon />}>
          <input id="email" name="email" type="email" placeholder="Enter Your Email" autoComplete="email" required />
        </Field>

        <Field label="Phone Number" id="phone">
          <span className="country">
            INA <Chevron />
          </span>
          <input id="phone" name="phone" type="tel" inputMode="tel" placeholder="+62 0000 0000 0000" autoComplete="tel" required />
        </Field>

        <Field label="Company ID" id="company" icon={<MailIcon />}>
          <input id="company" name="company" type="text" placeholder="Enter Company ID" required />
        </Field>

        <PasswordField id="password" label="Password" placeholder="My Password" autoComplete="new-password" />
        <PasswordField id="confirm" label="Confirm Password" placeholder="Confirm My Password" autoComplete="new-password" />

        <label className="agree">
          <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setError(""); }} />
          <span className="box" aria-hidden="true" />
          <span>
            I agree with <a href="#terms" onClick={openTerms}>terms &amp; conditions</a> and <a href="#privacy" onClick={openTerms}>privacy policy</a>
          </span>
        </label>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn primary submit" type="submit">Sign Up</button>
      </form>

      <p className="switch">
        Already have an account? <a href="#signin" onClick={(e) => { e.preventDefault(); onSignIn?.(); }}>Sign in here</a>
      </p>

      {verifyEmail && (
        <VerifySheet
          email={verifyEmail}
          onClose={() => setVerifyEmail(null)}
          onResend={() => console.log("Resend code to", verifyEmail)} // replace with your API call
          onSubmit={(code) => { console.log("Verify", code); /* replace with your API call */ onVerified?.(verifyEmail); }}
        />
      )}

      {showTerms && (
        <TermsSheet
          onAgree={() => { setAgree(true); setError(""); setShowTerms(false); }}
          onDecline={() => { setAgree(false); setShowTerms(false); }}
        />
      )}
    </main>
  );
}
