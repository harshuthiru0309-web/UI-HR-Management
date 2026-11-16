import { useState } from "react";
import ResultSheet from "./ResultSheet.jsx";

const pad = (n) => String(n).padStart(2, "0");

export const stamp = (d = new Date()) => {
  const h = d.getHours() % 12 || 12;
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)} ${pad(h)}:${pad(d.getMinutes())}${d.getHours() < 12 ? "AM" : "PM"} GMT ${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
};

export default function SelfieReview({ photo, lat, long, takenAt, onBack, onRetake, onConfirm, onDone }) {
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="app wp review">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Selfie To Clock In</h1>
      </header>

      <div className="wp-body">
        <section className="wp-card sr-card">
          <figure className="shot">
            <img src={photo} alt="Your clock-in selfie" />
            <figcaption>
              <span>Lat : {lat}</span>
              <span>Long : {long}</span>
              <span>{stamp(takenAt)}</span>
            </figcaption>
            <button type="button" className="btn primary retake" onClick={onRetake}>
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 11a8 8 0 0 0-14-4.5L4 9m0-5v5h5M4 13a8 8 0 0 0 14 4.5L20 15m0 5v-5h-5" />
              </svg>
              Retake Photo
            </button>
          </figure>

          <div className="field notes">
            <label htmlFor="notes">Clock In Notes (Optional)</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Clock-in Notes" rows={5} maxLength={500} />
          </div>
        </section>
      </div>

      <div className="wp-bar">
        <button type="button" className="btn primary" onClick={() => { onConfirm?.(notes.trim()); setDone(true); }}>Clock In</button>
      </div>

      {done && (
        <ResultSheet
          title="Clock-In Successful!"
          text="You’re all set! Your clock-in was successful. Head over to your dashboard to see your assigned tasks."
          action="Go To Clock In Page"
          onAction={onDone}
        />
      )}
    </main>
  );
}
