import { useEffect, useRef } from "react";

export default function UpdateSheet({ onConfirm, onCancel }) {
  const first = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  return (
    <div className="scrim blur" onClick={onCancel}>
      <section
        className="sheet verify welcome layers"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="update-title"
        aria-describedby="update-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mail-badge" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="50%">
            <circle cx="24" cy="15" r="8" fill="#fff" />
            <path d="M8.5 41c1.2-9 7-12.5 15.5-12.5S38.3 32 39.5 41z" fill="#fff" />
          </svg>
        </div>

        <h2 id="update-title">Update Profile</h2>
        <p id="update-text" className="verify-text">
          Are you sure you want to update your profile? This will help us improve your experience and provide personalized features.
        </p>

        <div className="sheet-actions welcome-actions">
          <button ref={first} type="button" className="btn primary" onClick={onConfirm}>Yes, Update Profile</button>
          <button type="button" className="btn outline" onClick={onCancel}>No, Let me check</button>
        </div>
      </section>
    </div>
  );
}
