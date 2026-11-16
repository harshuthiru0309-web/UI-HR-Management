import { useEffect, useRef } from "react";

export default function ConfirmSheet({ title, text, yes, no, onYes, onNo, icon = "task", center = false }) {
  const first = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e) => e.key === "Escape" && onNo();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onNo]);

  return (
    <div className="scrim blur" onClick={onNo}>
      <section
        className={`sheet verify welcome${icon === "layers" ? " layers" : ""}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mail-badge" aria-hidden="true">
          {icon === "layers" ? (
            <svg viewBox="0 0 48 48" width="50%" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M24 6 41 15l-17 9-17-9z" fill="#fff" stroke="#fff" strokeWidth="3" />
              <path d="m7 23 17 9 17-9" stroke="#fff" strokeWidth="3.2" />
              <path d="m7 31 17 9 17-9" stroke="#fff" strokeWidth="3.2" />
            </svg>
          ) : icon === "receipt" ? (
            <svg viewBox="0 0 48 48" width="50%">
              <path d="M10 6h28a2 2 0 0 1 2 2v34l-5-3.5-5 3.5-5-3.5-5 3.5-5-3.5L8 42V8a2 2 0 0 1 2-2z" fill="#fff" />
              <path d="M16 18h16M16 26h10" stroke="#7c5cfa" strokeWidth="3.4" strokeLinecap="round" />
            </svg>
          ) : (
          <svg viewBox="0 0 48 48" width="50%">
              <rect x="8" y="9" width="32" height="34" rx="8" fill="#fff" />
              <rect x="15" y="4" width="4.5" height="10" rx="2.2" fill="#fff" stroke="#7c5cfa" strokeWidth="1.6" />
              <rect x="28.5" y="4" width="4.5" height="10" rx="2.2" fill="#fff" stroke="#7c5cfa" strokeWidth="1.6" />
              <path d="M16 24h16M16 31h9" stroke="#7c5cfa" strokeWidth="3.4" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-text" className={`verify-text${center ? " center" : ""}`}>{text}</p>

        <div className="sheet-actions welcome-actions">
          <button ref={first} type="button" className="btn primary" onClick={onYes}>{yes}</button>
          <button type="button" className="btn outline" onClick={onNo}>{no}</button>
        </div>
      </section>
    </div>
  );
}
