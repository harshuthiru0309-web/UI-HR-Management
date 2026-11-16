import { useEffect, useRef } from "react";

export default function UpdatedSheet({ onVisit }) {
  const btn = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    btn.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="scrim blur">
      <section
        className="sheet verify welcome layers"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="updated-title"
        aria-describedby="updated-text"
      >
        <div className="mail-badge" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="50%">
            <circle cx="24" cy="15" r="8" fill="#fff" />
            <path d="M8.5 41c1.2-9 7-12.5 15.5-12.5S38.3 32 39.5 41z" fill="#fff" />
          </svg>
        </div>

        <h2 id="updated-title">Profile Updated!</h2>
        <p id="updated-text" className="verify-text">
          Your profile has been successfully updated. We’re excited to see you take this step!
        </p>

        <div className="sheet-actions welcome-actions">
          <button ref={btn} type="button" className="btn primary" onClick={onVisit}>View My Profile</button>
        </div>
      </section>
    </div>
  );
}
