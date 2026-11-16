import { useEffect, useRef, useState } from "react";

const LENGTH = 6;
const COOLDOWN = 30;

export default function VerifySheet({ email, phone, variant = "email", footer, scrimClass = "", onSubmit, onResend, onClose }) {
  const isPhone = variant === "phone";
  const isReset = variant === "reset";
  const modern = isPhone || isReset; // shares the new badge / left-aligned layout
  const [kb, setKb] = useState(0); // on-screen keyboard height (iOS reports it via visualViewport)
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    refs.current[0]?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => { const h = Math.round(window.innerHeight - vv.height - vv.offsetTop); setKb(h > 80 ? h : 0); };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const fill = (start, chars) => {
    const next = [...digits];
    chars.slice(0, LENGTH - start).forEach((c, i) => (next[start + i] = c));
    setDigits(next);
    setError("");
    refs.current[Math.min(start + chars.length, LENGTH - 1)]?.focus();
  };

  const onChange = (i, e) => {
    const chars = e.target.value.replace(/\D/g, "").split("");
    if (chars.length) fill(i, chars);
    else setDigits((d) => d.map((v, k) => (k === i ? "" : v)));
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e) => {
    const chars = e.clipboardData.getData("text").replace(/\D/g, "").split("");
    if (!chars.length) return;
    e.preventDefault();
    fill(0, chars);
  };

  const submit = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < LENGTH) return setError(`Enter all ${LENGTH} digits of the code.`);
    onSubmit(code);
  };

  const resend = (e) => {
    e.preventDefault();
    if (wait > 0) return;
    onResend?.();
    setWait(COOLDOWN);
  };

  return (
    <div className={`scrim blur ${scrimClass}`} onClick={onClose} style={{ "--kb": `${kb}px` }}>
      <form
        className={`sheet verify${modern ? " welcome layers" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="mail-badge" aria-hidden="true">
          {isReset ? (
            <svg viewBox="0 0 48 48" width="50%">
              <path d="M24 5.5 38.5 11v10.5c0 9.2-6.2 16.2-14.5 20.5C15.7 37.7 9.5 30.7 9.5 21.5V11z" fill="#fff" />
              <circle cx="24" cy="21.5" r="3.7" fill="#7c5cfa" />
              <rect x="22.5" y="23" width="3" height="8" rx="1.5" fill="#7c5cfa" />
            </svg>
          ) : isPhone ? (
            <svg viewBox="0 0 48 48" width="50%">
              <path d="M13.5 7.5 19 6.5l3.6 8.6-3.8 3a22 22 0 0 0 10.6 10.6l3-3.8 8.6 3.6-1 5.5a5.2 5.2 0 0 1-5.2 4.2A28 28 0 0 1 9.3 12.7a5.2 5.2 0 0 1 4.2-5.2z" fill="#fff" />
            </svg>
          ) : (
            <>
              <svg viewBox="0 0 48 48" width="52%">
                <rect x="5" y="9" width="38" height="30" rx="9" fill="#fff" />
                <path d="m14 21 10 7 10-7" fill="none" stroke="#7c5cfa" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <i />
            </>
          )}
        </div>

        <h2 id="verify-title">{isReset ? "Forgot Password" : isPhone ? "Sign In Phone Number" : "Email Verification Sent!"}</h2>
        <p className="verify-text">
          {isReset ? (
            <>A reset code has been sent to <b>{email}</b>, check your email to continue the password reset process.</>
          ) : isPhone ? (
            <>Sign in code has been sent to <b>{phone}</b>, check your inbox to continue the sign in process.</>
          ) : (
            <>A verification code will be sent to the email {email || "your email"} for your account verification process.</>
          )}
        </p>

        <div className="otp" role="group" aria-label="Verification code">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={LENGTH}
              placeholder="0"
              aria-label={`Digit ${i + 1}`}
              aria-invalid={!!error}
              onChange={(e) => onChange(i, e)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={onPaste}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        <p className="resend">
          Haven’t received the {isPhone ? "sign in" : "verification"} code?{" "}
          {wait > 0 ? <span className="wait">Resend in {wait}s</span> : <a href="#resend" onClick={resend}>Resend it.</a>}
        </p>

        <button type="submit" className="btn primary">Submit</button>
        {footer && <p className="verify-foot">{footer}</p>}
      </form>
    </div>
  );
}
