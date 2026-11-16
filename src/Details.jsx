import { useState } from "react";
import ResultSheet from "./ResultSheet.jsx";

const CalIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="3.5" /><path d="M8 3v4M16 3v4M4 10h16M8.5 14h.01M12 14h.01M8.5 17h.01" />
  </svg>
);

export default function Details({ day, onBack }) {
  const [done, setDone] = useState(false);
  if (!day) return null;

  const exportPdf = () => {
    window.print(); // opens the browser print dialog; choose "Save as PDF"
    setDone(true);
  };

  return (
    <main className="app wp details">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Details</h1>
      </header>

      <div className="wp-body">
        <section className="wp-card sr-card" id="print-area">
          <h2 className="date-h"><span className="rc"><CalIcon /></span>{day.date}</h2>

          <div className="dbox">
            <p className="dl">Selfie Clock In</p>
            <figure className="shot square">
              {day.photo ? <img src={day.photo} alt="Clock-in selfie" /> : <span className="no-photo" aria-hidden="true" />}
              <figcaption>
                <span>Lat : {day.lat}</span>
                <span>Long : {day.long}</span>
                <span>{day.stamp}</span>
              </figcaption>
            </figure>

            <p className="dl">Clock-In Notes</p>
            <p className="dnotes">{day.notes || "—"}</p>

            <dl className="dgrid">
              <div><dt>Total Hours</dt><dd>{day.total} hrs</dd></div>
              <div><dt>Clock in &amp; Out</dt><dd>{day.inTime} — {day.outTime}</dd></div>
              <div><dt>Break</dt><dd>{day.breakTotal} hrs</dd></div>
              <div><dt>Take A Break &amp; Back To Work</dt><dd>{day.breakRange}</dd></div>
            </dl>
          </div>
        </section>
      </div>

      <div className="wp-bar">
        <button type="button" className="btn primary" onClick={exportPdf}>Export As PDF</button>
      </div>

      {done && (
        <ResultSheet
          icon="download"
          title="Export As PDF Successful!"
          text="Your clock-in data has been exported as a PDF. You can now download it."
          action="Close Message"
          onAction={() => setDone(false)}
        />
      )}
    </main>
  );
}
