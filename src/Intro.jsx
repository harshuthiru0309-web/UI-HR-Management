import { useEffect, useRef, useState } from "react";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
const Ic = ({ children, ...p }) => <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} aria-hidden="true" {...p}>{children}</svg>;

const VideoIcon = () => <Ic><rect x="3" y="6" width="12" height="12" rx="3" fill="currentColor" stroke="none" /><path d="m15 11 5-3v8l-5-3" fill="currentColor" stroke="none" /></Ic>;
const ClockIcon = () => <Ic><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ic>;
const BoltIcon = () => <Ic><path d="M13 3 6 13h5l-1 8 7-10h-5z" fill="currentColor" stroke="none" /></Ic>;
const FlagIcon = () => <Ic><path d="M6 21V4M6 5h11l-2.5 4L17 13H6" fill="currentColor" /></Ic>;
const CalIcon = () => <Ic><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></Ic>;
const ChatIcon = () => <Ic><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></Ic>;

const Avatars = ({ extra }) => (
  <span className="iv-avatars" aria-hidden="true">
    <i /><i /><i />
    {extra ? <em>+{extra}</em> : null}
  </span>
);


const FACES = {
  smile: "M-3 1.2Q0 4.6 3 1.2",
  flat: "M-2.8 2.4H2.8",
  frown: "M-3 3.4Q0 .4 3 3.4",
};

function Face({ x, y, color, mood }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="6.4" fill={color} stroke="#fff" strokeWidth="1.2" />
      <circle cx="-2.2" cy="-1.6" r=".9" fill="#1f2937" />
      <circle cx="2.2" cy="-1.6" r=".9" fill="#1f2937" />
      <path d={FACES[mood]} fill="none" stroke="#1f2937" strokeWidth=".9" strokeLinecap="round" />
    </g>
  );
}

const PERIOD = [[30, 65], [66, 59], [104, 53], [142, 43.6], [180, 47.2]];

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sept"];

export function PeriodChart({ months = false }) {
  const line = PERIOD.map((p) => p.join(",")).join(" ");
  const area = `${PERIOD[0][0]},110 ${line} 214,43.6 214,110`;
  return (
    <svg className="iv-chart" viewBox={`0 0 230 ${months ? 124 : 112}`} focusable="false">
      <defs>
        <linearGradient id="ivfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c5cfa" stopOpacity=".38" />
          <stop offset="1" stopColor="#7c5cfa" stopOpacity=".04" />
        </linearGradient>
      </defs>
      {["60", "50", "40", "30", "20"].map((h, i) => (
        <g key={h}>
          <line x1="26" x2="230" y1={10 + i * 24} y2={10 + i * 24} stroke="#d9d6ec" strokeDasharray="2 3" strokeWidth=".6" />
          <text x="0" y={12 + i * 24} className="iv-ax">{h} hrs</text>
        </g>
      ))}
      <polygon points={area} fill="url(#ivfill)" />
      <polyline points={`${line} 214,43.6`} fill="none" stroke="#7c5cfa" strokeWidth="1" />
      {PERIOD.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.3" fill="#fff" stroke="#7c5cfa" strokeWidth="1" />)}
      <text x="142" y="35" textAnchor="middle" className="iv-peak">46 hrs</text>
      {months && MONTHS.map((m, i) => (
        <text key={m} x={PERIOD[i][0]} y="120" textAnchor="middle" className={`iv-xl${m === "Aug" ? " on" : ""}`}>{m}</text>
      ))}
    </svg>
  );
}

const SPRINTS = [
  { n: 1, v: 98, color: "#22b573", mood: "smile" },
  { n: 2, v: 103, color: "#fbbf24", mood: "flat" },
  { n: 3, v: 102, color: "#22b573", mood: "smile" },
  { n: 4, v: 126, color: "#ef4444", mood: "frown", on: true },
  { n: 5, v: 125, color: "#fb923c", mood: "frown" },
];
const yOf = (v) => 124 - (v - 80) * 2.2;

function LevelChart() {
  return (
    <svg className="iv-chart" viewBox="0 0 230 142" focusable="false">
      {[120, 110, 100, 90, 80].map((h, i) => (
        <g key={h}>
          <line x1="26" x2="230" y1={36 + i * 22} y2={36 + i * 22} stroke="#d9d6ec" strokeDasharray="2 3" strokeWidth=".6" />
          <text x="2" y={38 + i * 22} className="iv-ax">{h}</text>
        </g>
      ))}
      {SPRINTS.map((p, i) => {
        const cx = 56 + i * 38;
        const top = yOf(p.v);
        return (
          <g key={p.n}>
            <rect x={cx - 6} y={top} width="12" height={124 - top} rx="3" fill={p.on ? "#7c5cfa" : "#ececf1"} />
            <Face x={cx} y={top - 10} color={p.color} mood={p.mood} />
            <text x={cx} y="138" textAnchor="middle" className={`iv-xl${p.on ? " on" : ""}`}>Sprint {p.n}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function TaskCard({ className }) {
  return (
    <div className={`iv-card ${className}`}>
        <div className="iv-head"><b>Today Task</b><span className="iv-cnt">1</span></div>
        <p className="iv-sub">The tasks assigned to you for today</p>
        <div className="iv-item iv-ti">
          <div className="iv-trow"><span className="iv-ico round"><BoltIcon /></span><span className="iv-t">Wiring Dashboard Analytics</span></div>
          <div className="iv-chips">
            <span className="iv-chip grey"><i /> In Progress</span>
            <span className="iv-chip red"><FlagIcon /> High</span>
          </div>
          <div className="iv-bar"><span /></div>
          <div className="iv-foot">
            <Avatars />
            <span className="iv-pills">
              <span className="iv-pill"><CalIcon /> 27 April</span>
              <span className="iv-pill"><ChatIcon /> 2</span>
            </span>
          </div>
        </div>
      </div>
  );
}

const GLYPHS = {
  diamond: "M24 14 33 26 24 38 15 26z",
  star: "m24 13.5 3.3 7.3 7.9.8-5.9 5.3 1.7 7.8-7-4-7 4 1.7-7.8-5.9-5.3 7.9-.8z",
  sparkle: "M24 12.5c1.2 7.8 3.8 10.7 11.5 11.5-7.7 1-10.3 3.7-11.5 11.5-1.2-7.8-3.8-10.5-11.5-11.5 7.7-.8 10.3-3.7 11.5-11.5z",
  gem: "M16 18.5h16l4.5 6.5L24 37 11.5 25z",
  crown: "M14 34 12.5 20l7 6 4.5-9.5 4.5 9.5 7-6L34 34z",
};
const BADGES = [
  { title: "Probation Slayer", glyph: "diamond", base: "#4cc24a", light: "#c9f5c3" },
  { title: "Rising Junior", glyph: "star", base: "#7d86ee", light: "#d6d9fb" },
  { title: "Employee Of The Month", glyph: "sparkle", base: "#ff9d2e", light: "#ffe0b3" },
  { title: "Top Performer", glyph: "gem", base: "#ff4d86", light: "#ffc2d6" },
  { title: "Leader Of The Year", glyph: "crown", base: "#f4655d", light: "#ffc9c4" },
];

function HexBadge({ title, glyph, base, light }) {
  return (
    <li className="iv-badge">
      <svg viewBox="0 0 48 52" aria-hidden="true">
        <polygon points="24,2.5 43.5,13.5 43.5,38.5 24,49.5 4.5,38.5 4.5,13.5" fill={light} stroke={base} strokeOpacity=".55" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="24,8 38.8,16.3 38.8,35.7 24,44 9.2,35.7 9.2,16.3" fill={base} fillOpacity=".6" stroke="#fff" strokeOpacity=".7" strokeWidth="1" strokeLinejoin="round" />
        <path d={GLYPHS[glyph]} fill="#fff" fillOpacity=".92" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span>{title}</span>
    </li>
  );
}

const SLIDES = [
  {
    title: "Welcome to Workmate!",
    text: "Make Smart Decisions! Set clear timelines for projects and celebrate your achievements!",
    art: () => (
      <>
        <div className="iv-card iv-meet">
          <div className="iv-head"><b>Today Meeting</b><span className="iv-cnt">2</span></div>
          <p className="iv-sub">Your schedule for the day</p>
          <div className="iv-item iv-mi">
            <div className="iv-l1"><span className="iv-ico"><VideoIcon /></span><span className="iv-t">Townhall Meeting</span></div>
            <div className="iv-r1"><span className="iv-time"><ClockIcon /> 01:30 AM - 02:00 AM</span></div>
            <div className="iv-l2"><Avatars extra={3} /></div>
            <div className="iv-r2"><span className="iv-join">Join Meet</span></div>
          </div>
          <div className="iv-item iv-ghost"><span className="iv-ico"><VideoIcon /></span></div>
        </div>

        <TaskCard className="iv-task" />
      </>
    ),
  },
  {
    title: "Manage Stress Effectively",
    text: "Stay Balanced! Track your workload and maintain a healthy stress level with ease.",
    art: () => (
      <>
            <div className="iv-card iv-period">
              <b className="iv-h">Working Period</b>
              <p className="iv-sub">Average your working period</p>
              <PeriodChart />
            </div>
            <div className="iv-card iv-level">
              <b className="iv-h">Working Level</b>
              <p className="iv-sub">Your story point so far</p>
              <LevelChart />
            </div>
          </>
    ),
  },
  {
    title: "Plan for Success",
    text: "Your Journey Starts Here! Earn achievement badges as you conquer your tasks. Let\u2019s get started!",
    art: () => (
      <>
        <div className="iv-card iv-ach">
          <b className="iv-h">Achievement</b>
          <p className="iv-sub">Your achievement so far</p>
          <ul className="iv-badges">{BADGES.map((b) => <HexBadge key={b.title} {...b} />)}</ul>
        </div>
        <TaskCard className="iv-task iv-task3" />
      </>
    ),
  },
];

// One dot per slide. Next on the last slide calls onNext (sign-in screen).
export default function Intro({ total = SLIDES.length, onNext, onSkip }) {
  const [page, setPage] = useState(0);
  const next = useRef(null);
  useEffect(() => { next.current?.focus({ preventScroll: true }); }, [page]);

  const slide = SLIDES[page];
  const go = () => (page < SLIDES.length - 1 ? setPage(page + 1) : onNext?.());

  return (
    <main className="app intro">
      <section className="iv-hero" aria-hidden="true">
        <div className="iv-art" key={page}>{slide.art()}</div>
      </section>

      <section className="iv-content">
        <div aria-live="polite" key={`t${page}`} className="iv-copy">
          <h1>{slide.title}</h1>
          <p className="iv-text">{slide.text}</p>
        </div>
        <div className="iv-pager" role="img" aria-label={`Page ${page + 1} of ${total}`}>
          {Array.from({ length: total }, (_, i) => <i key={i} className={i === page ? "on" : ""} />)}
        </div>
        <div className="iv-actions">
          <button ref={next} type="button" className="btn primary" onClick={go}>Next</button>
          <button type="button" className="btn outline" onClick={onSkip}>Skip</button>
        </div>
      </section>
    </main>
  );
}
