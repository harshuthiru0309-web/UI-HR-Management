import { useState } from "react";

// Placeholder data. Replace with real values from your API.
const LEVELS = [
  { label: "Sprint 1", v: 95 },
  { label: "Sprint 2", v: 101 },
  { label: "Sprint 3", v: 95 },
  { label: "Sprint 4", v: 113 },
  { label: "Sprint 5", v: 108 },
];
const PERIOD = [
  { label: "May", v: 40 },
  { label: "Jun", v: 40 },
  { label: "Jul", v: 40 },
  { label: "Aug", v: 46 },
  { label: "Sept", v: 40 },
];

const maxIndex = (list) => list.reduce((best, d, i) => (d.v > list[best].v ? i : best), 0);
const activate = (fn) => (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };

function LevelChart({ data }) {
  const [sel, setSel] = useState(maxIndex(data));
  const x0 = 40, x1 = 336, top = 20, base = 170, min = 80, max = 120;
  const col = (x1 - x0) / data.length;
  const y = (v) => base - ((v - min) / (max - min)) * (base - top);

  return (
    <svg className="chart" viewBox="0 0 340 205" role="img" aria-label="Story points per sprint">
      {[120, 110, 100, 90, 80].map((v) => (
        <g key={v}>
          <text x="0" y={y(v) + 3.5} className="ax">{v}</text>
          <line x1={x0} x2={x1} y1={y(v)} y2={y(v)} stroke="#dedbf0" strokeDasharray="3 4" strokeWidth="1" />
        </g>
      ))}
      {data.map((d, i) => {
        const cx = x0 + (i + 0.5) * col;
        const on = i === sel;
        return (
          <g key={d.label} role="button" tabIndex={0} aria-pressed={on} aria-label={`${d.label}: ${d.v} story points`} className="hit" onClick={() => setSel(i)} onKeyDown={activate(() => setSel(i))}>
            <rect x={cx - col / 2} y={top - 12} width={col} height={base - top + 40} fill="transparent" />
            <rect x={cx - 10} y={y(d.v)} width="20" height={base - y(d.v)} rx="5" fill={on ? "#7c5cfa" : "#ececf1"} />
            {on && <text x={cx} y={y(d.v) - 7} textAnchor="middle" className="val">{d.v}</text>}
            <text x={cx} y="196" textAnchor="middle" className={on ? "lbl on" : "lbl"}>{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PeriodChart({ data }) {
  const [sel, setSel] = useState(maxIndex(data));
  const x0 = 44, x1 = 336, top = 20, base = 180, min = 20, max = 60;
  const col = (x1 - x0) / data.length;
  const y = (v) => base - ((v - min) / (max - min)) * (base - top);
  const pts = data.map((d, i) => [x0 + (i + 0.5) * col, y(d.v)]);
  const line = [[x0, pts[0][1]], ...pts, [x1, pts[pts.length - 1][1]]].map((p) => p.join(",")).join(" ");

  return (
    <svg className="chart" viewBox="0 0 340 215" role="img" aria-label="Average working hours per month">
      <defs>
        <linearGradient id="bsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c5cfa" stopOpacity=".38" />
          <stop offset="1" stopColor="#7c5cfa" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[60, 50, 40, 30, 20].map((v) => (
        <g key={v}>
          <text x="0" y={y(v) + 3.5} className="ax">{v} hrs</text>
          <line x1={x0} x2={x1} y1={y(v)} y2={y(v)} stroke="#dedbf0" strokeDasharray="3 4" strokeWidth="1" />
        </g>
      ))}
      <polygon points={`${x0},${base} ${line} ${x1},${base}`} fill="url(#bsFill)" />
      <polyline points={line} fill="none" stroke="#7c5cfa" strokeWidth="1.2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [cx, cy] = pts[i];
        const on = i === sel;
        return (
          <g key={d.label} role="button" tabIndex={0} aria-pressed={on} aria-label={`${d.label}: ${d.v} hours`} className="hit" onClick={() => setSel(i)} onKeyDown={activate(() => setSel(i))}>
            <rect x={cx - col / 2} y={top - 12} width={col} height={base - top + 40} fill="transparent" />
            <circle cx={cx} cy={cy} r="3.6" fill="#fff" stroke="#7c5cfa" strokeWidth="1.6" />
            {on && <text x={cx} y={cy - 9} textAnchor="middle" className="val">{d.v} hrs</text>}
            <text x={cx} y="205" textAnchor="middle" className={on ? "lbl on" : "lbl"}>{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function BurnoutStats({ level = "Good", onBack, levels = LEVELS, period = PERIOD }) {
  const good = level === "Good";
  return (
    <main className="app wp bstats">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Burnout Stats</h1>
      </header>

      <div className="wp-body">
        <section className="wp-card bs-card burnout">
          <h2>Burnout Stats <span className={`level${good ? " good" : ""}`}>{level}</span></h2>
          <p className="wp-sub">{good ? "You’ve maintained your tasks at the right pace! Keep it up!" : "You’re carrying a heavy load. Talk to your supervisor about your tasks."}</p>
          <div className="meter">
            <span className={`face${good ? " good" : ""}`} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="1em" height="1em">
                <circle cx="8.5" cy="10" r="1.2" fill={good ? "#0b4d2c" : "#7a2e12"} /><circle cx="15.5" cy="10" r="1.2" fill={good ? "#0b4d2c" : "#7a2e12"} />
                <path d={good ? "M8 14c1.2 1.8 2.4 2.6 4 2.6s2.8-.8 4-2.6" : "M8 17c1.2-1.8 2.4-2.6 4-2.6s2.8.8 4 2.6"} fill="none" stroke={good ? "#0b4d2c" : "#7a2e12"} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <div className={`bar2${good ? " good" : ""}`}><span style={{ width: good ? "25%" : "85%" }} /></div>
          </div>
        </section>

        <section className="wp-card bs-card">
          <h2>Working Level</h2>
          <p className="wp-sub">Your story point so far</p>
          <hr />
          <LevelChart data={levels} />
        </section>

        <section className="wp-card bs-card">
          <h2>Working Period</h2>
          <p className="wp-sub">Average your working period</p>
          <hr />
          <PeriodChart data={period} />
        </section>
      </div>
    </main>
  );
}
