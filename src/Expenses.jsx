import { useState } from "react";
import TabBar from "./TabBar.jsx";
import { DocArt } from "./Art.jsx";

const money = (n) => `$${n.toLocaleString("en-US")}`;
const sum = (list) => list.reduce((s, e) => s + e.total, 0);

function Card() {
  const bands = ["#ff4d4d", "#ff9a3d", "#ffd84a", "#3fcf7a", "#4aa8ff", "#8a63ff"];
  return (
    <svg className="wings card-art" viewBox="0 0 130 90" aria-hidden="true">
      <path d="M20 12c.8 4 2.4 5.6 6.5 6.5-4.1.9-5.7 2.5-6.5 6.5-.8-4-2.4-5.6-6.5-6.5C17.6 17.6 19.2 16 20 12z" fill="#fff" opacity=".85" />
      <circle cx="12" cy="70" r="1.6" fill="#fff" opacity=".8" /><circle cx="118" cy="8" r="1.6" fill="#fff" opacity=".8" />
      <g transform="rotate(-24 70 45)">
        {bands.map((c, i) => <rect key={c} x="86" y={26 + i * 4.5} width="60" height="4.6" fill={c} />)}
        <rect x="26" y="22" width="68" height="46" rx="6" fill="#4b4e66" />
        <rect x="26" y="32" width="68" height="8" fill="#2d2f43" />
        <rect x="32" y="26" width="26" height="3" rx="1.5" fill="#fff" opacity=".7" />
        <rect x="32" y="46" width="16" height="11" rx="2.5" fill="#d9dbe6" />
        <rect x="52" y="48" width="12" height="3" rx="1.5" fill="#9aa0b8" /><rect x="52" y="54" width="22" height="3" rx="1.5" fill="#9aa0b8" />
      </g>
    </svg>
  );
}

const TagIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path d="M3 8.5a2 2 0 0 1 .6-1.4L8 2.8a2 2 0 0 1 2.8 0l10.4 10.4a2 2 0 0 1 0 2.8L16 21.2a2 2 0 0 1-2.8 0L3.6 11.4A2 2 0 0 1 3 10z" fill="#7c5cfa" transform="translate(0 1) scale(.92)" />
    <circle cx="8" cy="8" r="1.5" fill="#fff" />
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
  review: { sub: "Expense submitted", title: "No Expense Submitted", word: "submitted" },
  approved: { sub: "Expense Approved", title: "No Expense Approved", word: "approved" },
  rejected: { sub: "Expense Rejected", title: "No Expense Rejected", word: "rejected" },
};

const FILTERS = [["review", "Review"], ["approved", "Approved"], ["rejected", "Rejected"]];

export default function Expenses({ expenses = [], summary, period = "1 Jan 2024 - 30 Dec 2024", onNavigate, onSubmit }) {
  const [filter, setFilter] = useState("review");

  const by = (s) => expenses.filter((e) => e.state === s);
  const review = sum(by("review"));
  const approved = sum(by("approved"));
  const visible = by(filter);
  const totals = summary || { total: review + approved, review, approved };

  return (
    <main className="app tasks expenses">
      <header className="c-head">
        <div>
          <h1>Expense Summary</h1>
          <p>Claim your expenses here.</p>
        </div>
        <Card />
      </header>

      <div className="c-body">
        <section className="c-card">
          <h2>Total Expense</h2>
          <p className="period">Period {period}</p>
          <div className="tiles three">
            <div className="tile"><span><i className="ic"><TagIcon /></i> Total</span><b>{money(totals.total)}</b></div>
            <div className="tile"><span><i className="dot" style={{ background: "#ff9500" }} /> Review</span><b>{money(totals.review)}</b></div>
            <div className="tile"><span><i className="dot" style={{ background: "#22b573" }} /> Approved</span><b>{money(totals.approved)}</b></div>
          </div>
        </section>

        <div className="filters" role="tablist" aria-label="Filter expenses">
          {FILTERS.map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={filter === key} className={filter === key ? "on" : ""} onClick={() => setFilter(key)}>
              {label} {by(key).length > 0 && <span className="n">{by(key).length}</span>}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <section className="c-card wp-empty exp-empty" role="tabpanel">
            <h2>Expense</h2>
            <p className="period muted">{EMPTY[filter].sub}</p>
            <div className="empty">
              <DocArt />
              <b>{EMPTY[filter].title}</b>
              <p>It looks like you don’t have any expense {EMPTY[filter].word}. Don’t worry, this space will be updated as new expense {EMPTY[filter].word}.</p>
            </div>
          </section>
        ) : (
        <div className="t-list" role="tabpanel">
          {visible.length ? (
            visible.map((e) => (
              <section key={e.id} className="c-card day">
                <h2 className="date-h"><span className="rc"><ReceiptIcon /></span>{e.date}</h2>
                <div className="exp-box">
                  <div><small>Type</small><b>{e.type}</b></div>
                  <div><small>Total Expense</small><b>{money(e.total)}</b></div>
                </div>
                {(e.state === "approved" || e.state === "rejected") && (
                  <div className={`exp-foot ${e.state}`}>
                    <span className="status">
                      <StatusIcon ok={e.state === "approved"} />
                      {e.state === "approved" ? "Approved" : "Rejected"} at {e.decidedAt}
                    </span>
                    <span className="by">By <i aria-hidden="true" />{e.by}</span>
                  </div>
                )}
              </section>
            ))
          ) : (
            <p className="none">No expenses in this list yet.</p>
          )}
        </div>
        )}
      </div>

      <div className="create-bar">
        <button type="button" className="btn primary" onClick={onSubmit}>Submit Expense</button>
      </div>
      <TabBar active="pay" onNavigate={onNavigate} />
    </main>
  );
}
