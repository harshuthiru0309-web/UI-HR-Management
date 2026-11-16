import { useEffect, useRef } from "react";

export default function WelcomeSheet({ onSetup, onExplore }) {
  const first = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e) => e.key === "Escape" && onExplore();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onExplore]);

  return (
    <div className="scrim blur" onClick={onExplore}>
      <section
        className="sheet verify welcome"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mail-badge" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="50%">
            <path d="M24 4.5 40 13.7v18.6L24 41.5 8 32.3V13.7z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="24" cy="20" r="4.6" fill="#7c5cfa" />
            <path d="M15.5 33c1.2-4.6 4.6-6.4 8.5-6.4s7.3 1.8 8.5 6.4z" fill="#7c5cfa" />
          </svg>
        </div>

        <h2 id="welcome-title">Welcome To Work Mate!</h2>
        <p className="verify-text">
          To enhance your user experience, please set up your profile first. This will help us tailor the app to your needs and ensure you get the most out of our features!
        </p>

        <div className="sheet-actions welcome-actions">
          <button ref={first} type="button" className="btn primary" onClick={onSetup}>Set Up My Profile</button>
          <button type="button" className="btn outline" onClick={onExplore}>Explore The App First</button>
        </div>
      </section>
    </div>
  );
}
