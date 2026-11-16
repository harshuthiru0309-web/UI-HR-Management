import { useEffect, useRef } from "react";

export default function ResultSheet({ title, text, action, onAction, center = false, icon = "person" }) {
  const btn = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    btn.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="scrim blur">
      <section className={`sheet verify welcome${["layers", "download", "bolt"].includes(icon) ? " layers" : ""}`} role="alertdialog" aria-modal="true" aria-labelledby="result-title" aria-describedby="result-text">
        <div className="mail-badge" aria-hidden="true">
          {icon === "bolt" ? (
            <svg viewBox="0 0 48 48" width="50%" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round">
              <path d="M27.5 6 13 26.5h9.5L19.5 42 35 20.5h-9.8z" />
            </svg>
          ) : icon === "download" ? (
            <svg viewBox="0 0 48 48" width="50%" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 27h28a14 14 0 0 1-28 0z" fill="#fff" />
              <path d="M24 8v16" stroke="#fff" strokeWidth="3.6" />
              <path d="M24 27v9" stroke="#7c5cfa" strokeWidth="3.6" />
              <path d="m18 30 6 6 6-6" stroke="#7c5cfa" strokeWidth="3.6" />
              <path d="m18.5 19 5.5 5.5 5.5-5.5" stroke="#fff" strokeWidth="3.6" />
            </svg>
          ) : icon === "layers" ? (
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
          ) : icon === "task" ? (
            <svg viewBox="0 0 48 48" width="50%">
              <rect x="8" y="9" width="32" height="34" rx="8" fill="#fff" />
              <rect x="15" y="4" width="4.5" height="10" rx="2.2" fill="#fff" stroke="#7c5cfa" strokeWidth="1.6" />
              <rect x="28.5" y="4" width="4.5" height="10" rx="2.2" fill="#fff" stroke="#7c5cfa" strokeWidth="1.6" />
              <path d="M16 24h16M16 31h9" stroke="#7c5cfa" strokeWidth="3.4" strokeLinecap="round" />
            </svg>
          ) : icon === "download" ? (
            <svg viewBox="0 0 48 48" width="50%">
              <rect x="5" y="22" width="38" height="20" rx="7" fill="#fff" />
              <path d="M24 5v19m-8-7.5 8 8 8-8" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 10v16m-6-5.5 6 6 6-6" fill="none" stroke="#7c5cfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : icon === "clock" ? (
            <svg viewBox="0 0 48 48" width="50%">
              <circle cx="24" cy="24" r="17" fill="#fff" />
              <path d="M24 14v10.5l6.5 4" fill="none" stroke="#7c5cfa" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 48 48" width="50%">
              <circle cx="24" cy="15" r="8" fill="#fff" />
              <path d="M8.5 41c1.2-9 7-12.5 15.5-12.5S38.3 32 39.5 41z" fill="#fff" />
            </svg>
          )}
        </div>
        <h2 id="result-title">{title}</h2>
        <p id="result-text" className={`verify-text${center ? " center" : ""}`}>{text}</p>
        <div className="sheet-actions welcome-actions">
          <button ref={btn} type="button" className="btn primary" onClick={onAction}>{action}</button>
        </div>
      </section>
    </div>
  );
}
