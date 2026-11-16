import { useEffect, useRef } from "react";

const SECTIONS = [
  ["Terms and Conditions:", null],
  ["Acceptance:", "By using the Re-Dus app, you agree to comply with all applicable terms and conditions."],
  ["Usage:", "This app is for personal use only and may not be used for commercial purposes without permission."],
  ["Account:", "You are responsible for the security of your account and all activities that occur within it."],
  ["Content:", "You must not upload content that violates copyright, privacy, or applicable laws."],
  ["Changes:", "We reserve the right to change the terms and conditions at any time and will notify you of these changes through the app or via email."],
  ["Privacy Policy:", null],
  ["Data Collection:", "We collect personal data such as name, email, and location to process transactions and improve our services."],
  ["Data Usage:", "Your data is used for internal purposes such as account management, usage analysis, and service offerings."],
  ["Security:", "We protect your data with appropriate security measures to prevent unauthorized access."],
  ["Data Sharing:", "We do not share your personal data with third parties without your consent, except as required by law."],
  ["Your Rights:", "You can access, update, or delete your personal data at any time through the app settings or by contacting us."],
];

export default function TermsSheet({ onAgree, onDecline }) {
  const agreeRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    agreeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onDecline();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onDecline]);

  return (
    <div className="scrim" onClick={onDecline}>
      <section
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="terms-title">Terms &amp; Conditions and Privacy Policy</h2>

        <div className="terms" tabIndex={0}>
          {SECTIONS.map(([head, body]) => (
            <p key={head}>{body ? <><span>{head}</span> {body}</> : head}</p>
          ))}
        </div>

        <div className="sheet-actions">
          <button ref={agreeRef} type="button" className="btn primary" onClick={onAgree}>I Agree</button>
          <button type="button" className="btn outline" onClick={onDecline}>Decline</button>
        </div>
      </section>
    </div>
  );
}
