import { useEffect, useRef, useState } from "react";
import Onboarding from "./Onboarding.jsx";
import VerifySheet from "./VerifySheet.jsx";
import { MailIcon, LockIcon, EyeIcon, Chevron } from "./SignUp.jsx";

const HexPerson = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path d="M12 2.5 20 7v10l-8 4.5L4 17V7z" fill="currentColor" />
    <circle cx="12" cy="10" r="2.6" fill="#fff" />
    <path d="M7.5 16.5c.8-2.4 2.5-3.3 4.5-3.3s3.7.9 4.5 3.3z" fill="#fff" />
  </svg>
);
const HexPersonLine = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.8 19.5 7v10L12 21.2 4.5 17V7z" />
    <circle cx="12" cy="10.2" r="2.4" />
    <path d="M7.8 16.4c.9-2 2.4-2.9 4.2-2.9s3.3.9 4.2 2.9" />
  </svg>
);
const MailSolid = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" fill="currentColor" />
    <path d="m6.5 9.5 5.5 4 5.5-4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path d="M6.6 3.5 9 3l1.8 4.3-1.9 1.5a11 11 0 0 0 5.3 5.3l1.5-1.9L20 14l-.5 2.4a2.6 2.6 0 0 1-2.6 2.1A13.9 13.9 0 0 1 3.5 6.1a2.6 2.6 0 0 1 3.1-2.6z" fill="currentColor" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9.2" /><path d="M12 7.5v5.5" /><circle cx="12" cy="16.4" r=".6" fill="currentColor" />
  </svg>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const METHODS = {
  employee: { label: "Sign in With Employee ID", Icon: HexPerson },
  email: { label: "Sign in With Email", Icon: MailSolid },
  phone: { label: "Sign in With Phone", Icon: PhoneIcon },
};

export default function SignIn({ onSignIn, onSignUp, onReset, onClose }) {
  const [method, setMethod] = useState("email"); // "email" | "phone" | "employee"
  const [reset, setReset] = useState(null);       // { email } while the reset-code sheet is open
  const [otp, setOtp] = useState(null);           // { phone, remember } while the code sheet is open
  const [show, setShow] = useState(false);       // password visible?
  const [showId, setShowId] = useState(true);      // employee ID visible?
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});     // { email, password, employeeId, phone } -> message
  const [busy, setBusy] = useState(false);
  const first = useRef(null);
  const sheet = useRef(null);
  const [kb, setKb] = useState(0);        // on-screen keyboard height (iOS reports it through visualViewport)
  const [typing, setTyping] = useState(false);
  const TEXT = "input:not([type=checkbox])";
  const coarse = () => window.matchMedia?.("(pointer: coarse)").matches;

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => { const h = Math.round(window.innerHeight - vv.height - vv.offsetTop); setKb(h > 80 ? h : 0); };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  const onFocus = (e) => {
    if (coarse() && e.target.matches(TEXT)) setTyping(true);
    e.target.matches?.(TEXT) && e.target.scrollIntoView?.({ block: "nearest" });
  };
  const onBlur = () => setTimeout(() => {
    const a = document.activeElement;
    if (!(sheet.current?.contains(a) && a.matches(TEXT))) setTyping(false);
  }, 0);
  const keyboard = kb > 0 || typing;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const clear = (k) => () => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  const switchTo = (k) => { setErrors({}); setMethod(k); };

  const submit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const v = {};
    if (method === "email" && !EMAIL_RE.test(String(f.email).trim())) v.email = "Enter a valid email address";
    if (method === "employee" && !String(f.employeeId).trim()) v.employeeId = "Enter your employee ID";
    if (method === "phone" && String(f.phone).replace(/\D/g, "").length < 6) v.phone = "Enter a valid phone number";
    if (method !== "phone" && !f.password) v.password = "Enter your password";
    setErrors(v);
    if (Object.keys(v).length) {
      const ids = { email: "si-email", employeeId: "si-eid", phone: "si-phone", password: "si-pass" };
      return document.getElementById(ids[Object.keys(v)[0]])?.focus();
    }

    if (method === "phone") return setOtp({ phone: String(f.phone).replace(/\s+/g, ""), remember });
    const payload = method === "employee"
      ? { method, employeeId: String(f.employeeId).trim(), password: f.password, remember }
      : { method, email: String(f.email).trim(), password: f.password, remember };
    setBusy(true);
    try {
      // onSignIn may return (or resolve to) { errors: { email: "…" } } to show server-side errors
      const res = await onSignIn?.(payload);
      if (res?.errors) setErrors(res.errors);
    } finally { setBusy(false); }
  };

  const forgot = () => {
    const email = document.getElementById("si-email")?.value.trim() || "";
    if (method === "email" && EMAIL_RE.test(email)) return setReset({ email });
    if (method !== "email") setMethod("email");
    setErrors({ email: "Enter your email address to reset your password" });
    setTimeout(() => document.getElementById("si-email")?.focus(), 0);
  };

  if (reset) {
    return (
      <>
        <Onboarding backdrop />
        <VerifySheet
          variant="reset"
          email={reset.email}
          scrimClass="si"
          onClose={() => setReset(null)}
          onResend={() => console.log("Resend reset code to", reset.email)} // call your API here
          onSubmit={(code) => { onReset?.({ email: reset.email, code }); setReset(null); }}
        />
      </>
    );
  }

  if (otp) {
    return (
      <>
        <Onboarding backdrop />
        <VerifySheet
          variant="phone"
          phone={otp.phone}
          scrimClass="si"
          onClose={() => setOtp(null)}
          onResend={() => console.log("Resend sign-in code to", otp.phone)} // call your API here
          onSubmit={(code) => onSignIn?.({ method: "phone", phone: otp.phone, code, remember: otp.remember })}
          footer={<>Sign in with different method <a href="#method" onClick={(e) => { e.preventDefault(); setOtp(null); }}>Here.</a></>}
        />
      </>
    );
  }

  return (
    <>
      <Onboarding backdrop />
      <div className="scrim si" onClick={onClose} style={{ "--kb": `${kb}px` }}>
        <section ref={sheet} className={`sheet signin${keyboard ? " kb" : ""}`} onFocus={onFocus} onBlur={onBlur} role="dialog" aria-modal="true" aria-labelledby="si-title" onClick={(e) => e.stopPropagation()}>
          <h2 id="si-title">Sign In</h2>
          <p className="si-sub">Sign in to my account</p>

          <form className="si-form" key={method} onSubmit={submit} noValidate>
            {method === "phone" ? (
              <div className="field">
                <label htmlFor="si-phone">Phone Number</label>
                <div className={`control${errors.phone ? " err" : ""}`}>
                  <span className="country">INA <Chevron /></span>
                  <input id="si-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+62 821 0000 0000" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "si-phone-err" : undefined} onInput={clear("phone")} onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9+\s]/g, ""); }} />
                  {errors.phone && <span className="err-ic" aria-hidden="true"><AlertIcon /></span>}
                </div>
                {errors.phone && <p className="si-err" id="si-phone-err" role="alert">{errors.phone}</p>}
              </div>
            ) : method === "employee" ? (
              <>
                <div className="field">
                  <label htmlFor="si-eid">Employee ID</label>
                  <div className={`control${errors.employeeId ? " err" : ""}`}>
                    <span className="lead"><HexPersonLine /></span>
                    <input ref={first} id="si-eid" name="employeeId" type={showId ? "text" : "password"} placeholder="My Employee ID" autoComplete="username" autoCapitalize="off" spellCheck="false" aria-invalid={!!errors.employeeId} aria-describedby={errors.employeeId ? "si-employeeId-err" : undefined} onInput={clear("employeeId")} />
                    {errors.employeeId ? <span className="err-ic" aria-hidden="true"><AlertIcon /></span> : (
                      <button type="button" className="toggle" onClick={() => setShowId((v) => !v)} aria-label={showId ? "Hide employee ID" : "Show employee ID"} aria-pressed={showId}>
                        <EyeIcon off={!showId} />
                      </button>
                    )}
                  </div>
                  {errors.employeeId && <p className="si-err" id="si-employeeId-err" role="alert">{errors.employeeId}</p>}
                </div>
                <div className="field">
                  <label htmlFor="si-pass">Password</label>
                  <div className={`control${errors.password ? " err" : ""}`}>
                    <span className="lead"><LockIcon /></span>
                    <input id="si-pass" name="password" type={show ? "text" : "password"} placeholder="My Password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "si-password-err" : undefined} onInput={clear("password")} />
                    <button type="button" className="toggle" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
                      <EyeIcon off={!show} />
                    </button>
                  </div>
                  {errors.password && <p className="si-err" id="si-password-err" role="alert">{errors.password}</p>}
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="si-email">Email</label>
                  <div className={`control${errors.email ? " err" : ""}`}>
                    <span className="lead"><MailIcon /></span>
                    <input ref={first} id="si-email" name="email" type="email" placeholder="My Email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "si-email-err" : undefined} onInput={clear("email")} />
                    {errors.email && <span className="err-ic" aria-hidden="true"><AlertIcon /></span>}
                  </div>
                  {errors.email && <p className="si-err" id="si-email-err" role="alert">{errors.email}</p>}
                </div>
                <div className="field">
                  <label htmlFor="si-pass">Password</label>
                  <div className={`control${errors.password ? " err" : ""}`}>
                    <span className="lead"><LockIcon /></span>
                    <input id="si-pass" name="password" type={show ? "text" : "password"} placeholder="My Password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "si-password-err" : undefined} onInput={clear("password")} />
                    <button type="button" className="toggle" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
                      <EyeIcon off={!show} />
                    </button>
                  </div>
                  {errors.password && <p className="si-err" id="si-password-err" role="alert">{errors.password}</p>}
                </div>
              </>
            )}

            <div className="si-row">
              <label className="agree">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span className="box" aria-hidden="true" />
                <span>Remember Me</span>
              </label>
              <button type="button" className="si-link" onClick={forgot}>Forgot Password</button>
            </div>

            <button type="submit" className="btn primary si-submit" disabled={busy} aria-busy={busy}>Sign In</button>
          </form>

          <div className="si-or" role="separator"><span>OR</span></div>

          <div className="si-alts">
            {Object.entries(METHODS).filter(([k]) => k !== method).map(([k, { label, Icon }]) => (
              <button key={k} type="button" className="btn outline si-alt" onClick={() => switchTo(k)}><Icon /> {label}</button>
            ))}
          </div>

          <p className="si-foot">
            Don’t have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); onSignUp?.(); }}>Sign Up Here</a>
          </p>
        </section>
      </div>
    </>
  );
}
