import { useEffect, useRef } from "react";

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" />
  </svg>
);

export default function ClockoutSheet({ today, overtime, onConfirm, onCancel }) {
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
        className="sheet verify welcome"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="co-title"
        aria-describedby="co-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mail-badge" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="50%">
            <circle cx="24" cy="24" r="17" fill="#fff" />
            <path d="M24 14v10.5l6.5 4" fill="none" stroke="#7c5cfa" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 id="co-title">Confirm Clockout</h2>
        <p id="co-text" className="verify-text">
          Once you clock out, you won’t be able to edit this time. Please double-check your hours before proceeding.
        </p>

        <div className="tiles co-tiles">
          <div className="tile"><span><ClockIcon /> Today</span><b>{today} Hrs</b></div>
          <div className="tile"><span><ClockIcon /> Overtime</span><b>{overtime} Hrs</b></div>
        </div>

        <div className="sheet-actions welcome-actions">
          <button ref={first} type="button" className="btn primary" onClick={onConfirm}>Yes, Clock Out</button>
          <button type="button" className="btn outline" onClick={onCancel}>No, Let me check</button>
        </div>
      </section>
    </div>
  );
}
