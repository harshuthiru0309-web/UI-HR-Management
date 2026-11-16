import { useState } from "react";
import TabBar from "./TabBar.jsx";
import { SuitcaseArt } from "./Art.jsx";

function Suitcase() {
  const bands = ["#ff4d4d", "#ff9a3d", "#ffd84a", "#3fcf7a", "#4aa8ff", "#8a63ff"];
  return (
    <svg className="wings card-art" viewBox="0 0 130 100" aria-hidden="true">
      <path d="M12 54c.7 3.4 2 4.7 5.2 5.4-3.2.7-4.5 2-5.2 5.4-.7-3.4-2-4.7-5.2-5.4C10 58.7 11.3 57.4 12 54z" fill="#fff" opacity=".85" />
      <circle cx="110" cy="10" r="1.6" fill="#fff" opacity=".8" /><circle cx="30" cy="86" r="1.6" fill="#fff" opacity=".8" />
      <g transform="rotate(16 60 50)">
        <g transform="rotate(-10 100 60) translate(0 6)">
          {bands.map((c, i) => <rect key={c} x="64" y={42 + i * 4.6} width="70" height="4.7" fill={c} />)}
        </g>
        <rect x="40" y="14" width="6" height="14" rx="3" fill="#3d4059" />
        <rect x="64" y="14" width="6" height="14" rx="3" fill="#3d4059" />
        <rect x="38" y="8" width="34" height="8" rx="4" fill="#3d4059" />
        <rect x="30" y="24" width="50" height="68" rx="9" fill="#fff" />
        <rect x="30" y="24" width="50" height="68" rx="9" fill="none" stroke="#e3e0f2" strokeWidth="2" />
        {[40, 52, 64, 76].map((y) => <rect key={y} x="34" y={y} width="42" height="3.5" rx="1.7" fill="#e3e0f2" />)}
        <circle cx="42" cy="95" r="3" fill="#3d4059" /><circle cx="68" cy="95" r="3" fill="#3d4059" />
      </g>
    </svg>
  );
}

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <path d="M12 3c.8 4.6 3.2 7.2 8 8.2-4.8 1-7.2 3.6-8 9.8-.8-6.2-3.2-8.8-8-9.8C8.8 10.2 11.2 7.6 12 3z" />
    <path d="M18.5 3.5c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2z" />
  </svg>
);

const ReceiptIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v15.5l-2.5-1.5-2.5 1.5-2.5-1.5-2.5 1.5L7 19 4.5 20.5V5A1.5 1.5 0 0 1 6 3.5z" /><path d="M8.5 9.5h7M8.5 13.5h7" />
  </svg>
);

const StatusIcon = ({ ok }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill={ok ? "#22b573" : "#f0524f"} />
    <path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EMPTY = {
  heading: "Leave Submitted",
  title: "No Leave Submitted!",
  text: "Ready to catch some fresh air? Click “Submit Leave” and take that well-deserved break!",
};

const FILTERS = [["review", "Review"], ["approved", "Approved"], ["rejected", "Rejected"]];

export default function Leaves({ leaves = [], summary = { available: 0, used: 0 }, period = "1 Jan 2024 - 30 Dec 2024", onNavigate, onSubmit }) {
  const [filter, setFilter] = useState("review");
  const by = (s) => leaves.filter((l) => l.state === s);
  const visible = by(filter);

  return (
    <main className="app tasks expenses leaves-page">
      <header className="c-head">
        <div>
          <h1>Leave Summary</h1>
          <p>Submit Leave</p>
        </div>
        <Suitcase />
      </header>

      <div className="c-body">
        <section className="c-card">
          <h2>Total Leave</h2>
          <p className="period">Period {period}</p>
          <div className="tiles">
            <div className="tile"><span><i className="dot" style={{ background: "#22b573" }} /> Available</span><b>{summary.available}</b></div>
            <div className="tile"><span><i className="dot" style={{ background: "#7c5cfa" }} /> Leave Used</span><b>{summary.used}</b></div>
          </div>
        </section>

        <div className="filters" role="tablist" aria-label="Filter leave requests">
          {FILTERS.map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={filter === key} className={filter === key ? "on" : ""} onClick={() => setFilter(key)}>
              {label} {by(key).length > 0 && <span className="n">{by(key).length}</span>}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <section className="c-card wp-empty exp-empty" role="tabpanel">
            <h2>{EMPTY.heading}</h2>
            <p className="period muted">Leave information</p>
            <div className="empty">
              <SuitcaseArt />
              <b>{EMPTY.title}</b>
              <p>{EMPTY.text}</p>
            </div>
          </section>
        ) : (
        <div className="t-list" role="tabpanel">
          {visible.length ? (
            visible.map((l) => (
              <section key={l.id} className="c-card day">
                <h2 className="date-h"><span className="rc">{l.state === "review" ? <SparkleIcon /> : <ReceiptIcon />}</span>{l.requested}</h2>
                <div className="exp-box">
                  <div><small>Leave Date</small><b>{l.range}</b></div>
                  <div><small>Total Leave</small><b>{l.days} {l.days === 1 ? "Day" : "Days"}</b></div>
                </div>
                {(l.state === "approved" || l.state === "rejected") && (
                  <div className={`exp-foot ${l.state}`}>
                    <span className="status">
                      <StatusIcon ok={l.state === "approved"} />
                      {l.state === "approved" ? "Approved" : "Rejected"} at {l.decidedAt}
                    </span>
                    <span className="by">By <i aria-hidden="true" />{l.by}</span>
                  </div>
                )}
              </section>
            ))
          ) : (
            <p className="none">No leave requests in this list yet.</p>
          )}
        </div>
        )}
      </div>

      <div className="create-bar">
        <button type="button" className="btn primary" onClick={onSubmit}>Submit Leave</button>
      </div>
      <TabBar active="more" onNavigate={onNavigate} />
    </main>
  );
}
