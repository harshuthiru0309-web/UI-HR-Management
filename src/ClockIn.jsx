import { useEffect, useState } from "react";
import TabBar from "./TabBar.jsx";
import { TaskArt, Wings } from "./Art.jsx";
import ClockoutSheet from "./ClockoutSheet.jsx";
import ResultSheet from "./ResultSheet.jsx";

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" />
  </svg>
);


const CalIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="3.5" /><path d="M8 3v4M16 3v4M4 10h16M8.5 14h.01M12 14h.01M8.5 17h.01" />
  </svg>
);

const pad = (n) => String(n).padStart(2, "0");
const hms = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};
const WORKDAY = 8 * 3600 * 1000;
const fmt = (ms) => {
  const m = Math.floor(ms / 60000);
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

export default function ClockIn({ history = [], payPeriod = "1 Sept 2024 - 30 Sept 2024", periodHours = "32:00", since = null, finished = null, breakAt = null, breakMs = 0, onClockIn, onClockOut, onBreak, onResume, onOpenDay, onNavigate }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => { setNow(Date.now()); }, [since, breakAt, breakMs]);

  useEffect(() => {
    if (!since || breakAt) return;
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, [since, breakAt]);

  const [stage, setStage] = useState(null); // null | "confirm" | "done"
  const worked = since ? Math.max(0, (breakAt ?? now) - since - breakMs) : 0;
  const today = finished != null ? fmt(finished) : since ? fmt(Math.max(0, (breakAt ?? now) - since - breakMs)) : "00:00";

  return (
    <main className="app clock">
      <header className="c-head">
        <div>
          <h1>Let’s Clock-In!</h1>
          <p>Don’t miss your clock in schedule</p>
        </div>
        <Wings />
      </header>

      <div className="c-body">
        <section className="c-card summary">
          <h2>Total Working Hour</h2>
          <p className="period">Paid Period {payPeriod}</p>
          <div className="tiles">
            <div className="tile">
              <span><ClockIcon /> Today</span>
              <b aria-live="polite">{today} Hrs</b>
            </div>
            <div className="tile">
              <span><ClockIcon /> This Pay Period</span>
              <b>{periodHours} Hrs</b>
            </div>
          </div>
          {since ? (
            <div className="btn-row">
              {breakAt ? (
                <button type="button" className="btn primary" onClick={onResume}>Back To Work</button>
              ) : (
                <button type="button" className="btn outline" onClick={onBreak}>Take A Break</button>
              )}
              <button type="button" className="btn dark" onClick={() => { setNow(Date.now()); setStage("confirm"); }}>Clock Out</button>
            </div>
          ) : finished != null ? (
            <button type="button" className="btn primary spent" disabled>Clocked Out</button>
          ) : (
            <button type="button" className="btn primary" onClick={onClockIn}>Clock In Now</button>
          )}
        </section>

        {history.length === 0 && (
          <section className="c-card wp-empty">
            <h2>Working Period</h2>
            <p className="period muted">Your working time in this paid period</p>
            <div className="empty">
              <TaskArt />
              <b>No Working Time Available</b>
              <p>It looks like you don’t have any working time in this period. Don’t worry, this space will be updated as new working time submitted.</p>
            </div>
          </section>
        )}

        {history.map((d) => (
          <section key={d.date} className="c-card day tap" role="button" tabIndex={0} aria-label={`Details for ${d.date}`} onClick={() => onOpenDay?.(d)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpenDay?.(d))}>
            <h2 className="date-h"><span className="rc"><CalIcon /></span>{d.date}</h2>
            <dl className="log">
              <div><dt>Total Hours</dt><dd>{d.total} hrs</dd></div>
              <div><dt>Clock in &amp; Out</dt><dd>{d.inTime} <span aria-label="to">—</span> {d.outTime}</dd></div>
            </dl>
          </section>
        ))}
      </div>

      <TabBar active="clock" onNavigate={onNavigate} />

      {stage === "confirm" && (
        <ClockoutSheet
          today={hms(worked)}
          overtime={hms(Math.max(0, worked - WORKDAY))}
          onConfirm={() => setStage("done")}
          onCancel={() => setStage(null)}
        />
      )}
      {stage === "done" && (
        <ResultSheet
          icon="clock"
          title="Clockout Successful!"
          text="You’ve officially clocked out for the day. Thank you for your hard work! Time to relax and enjoy your break."
          action="Close Message"
          onAction={() => { setStage(null); onClockOut?.(); }}
        />
      )}
    </main>
  );
}
