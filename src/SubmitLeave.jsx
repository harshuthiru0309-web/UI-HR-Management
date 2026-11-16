import { useEffect, useRef, useState } from "react";
import OptionSheet from "./OptionSheet.jsx";
import ConfirmSheet from "./ConfirmSheet.jsx";
import ResultSheet from "./ResultSheet.jsx";
import TabBar from "./TabBar.jsx";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const Ic = ({ children }) => <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} aria-hidden="true">{children}</svg>;
const CategoryIcon = () => <Ic><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="currentColor" stroke="none" /><path d="M8 10h6M8 14h4" stroke="#fff" /><circle cx="17.5" cy="6.5" r="2.8" fill="#ff5a4f" stroke="#fff" strokeWidth="1.2" /></Ic>;
const CalendarIcon = () => <Ic><rect x="3.5" y="5" width="17" height="15" rx="3.5" fill="currentColor" stroke="none" /><path d="M8 3v4M16 3v4" /><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01" stroke="#fff" strokeWidth="2.2" /></Ic>;
const MemberIcon = () => <Ic><path d="M12 2.5 20 7v10l-8 4.5L4 17V7z" fill="currentColor" stroke="none" /><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none" /><path d="M7.5 16.5c.8-2.4 2.5-3.3 4.5-3.3s3.7.9 4.5 3.3z" fill="#fff" stroke="none" /></Ic>;
const Chevron = () => <Ic><path d="m6 9 6 6 6-6" /></Ic>;

// Placeholder options. Replace with real data from your API.
const CATEGORIES = [
  "Sick Leave",
  "Annual Leave/Vacation Leave",
  "Maternity/Paternity Leave",
  "Bereavement Leave",
  "Personal Leave",
  "Jury Duty Leave",
  "Compassionate Leave",
];
const MEMBERS = [
  "Jeane - UX Writer",
  "Alpheas - UI Designer",
  "John - UX Designer",
  "Alicia - Jr Product Manager",
  "Claudia - UI Designer",
  "Option 4",
  "Option 5",
];

const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const short = (iso) => parse(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const withYear = (iso) => parse(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000) + 1;

function PickField({ id, label, icon, value, placeholder, onOpen }) {
  return (
    <div className="field wp-field">
      <label htmlFor={id}>{label}</label>
      <button type="button" id={id} className="control pick" onClick={onOpen} aria-haspopup="dialog">
        <span className="lead">{icon}</span>
        <span className="pick-val">{value || placeholder}</span>
        <span className="trail"><Chevron /></span>
      </button>
    </div>
  );
}

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function DurationSheet({ value, onSelect, onCancel }) {
  const todayIso = iso(new Date());
  const start = value?.from ? parse(value.from) : new Date();
  const [month, setMonth] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const [from, setFrom] = useState(value?.from || "");
  const [to, setTo] = useState(value?.to || "");
  const first = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onCancel]);

  const y = month.getFullYear();
  const m = month.getMonth();
  const offset = new Date(y, m, 1).getDay();
  const cells = Array.from({ length: 42 }, (_, i) => new Date(y, m, i - offset + 1));
  const atCurrentMonth = y === new Date().getFullYear() && m === new Date().getMonth();

  const pickDay = (d) => {
    const v = iso(d);
    if (v < todayIso) return;
    if (!from || to) { setFrom(v); setTo(""); }
    else if (v < from) { setFrom(v); }
    else { setTo(v); }
  };

  const ready = from && to;
  const days = ready ? daysBetween(from, to) : 0;

  return (
    <div className="scrim blur" onClick={onCancel}>
      <section className="sheet picker cal-sheet" role="dialog" aria-modal="true" aria-labelledby="dur-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="dur-title">Leave Duration</h2>
        <p className="pick-sub">Select Leave Duration</p>

        <div className="cal-nav">
          <button ref={first} type="button" onClick={() => setMonth(new Date(y, m - 1, 1))} disabled={atCurrentMonth} aria-label="Previous month">
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          </button>
          <b aria-live="polite">{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</b>
          <button type="button" onClick={() => setMonth(new Date(y, m + 1, 1))} aria-label="Next month">
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          </button>
        </div>

        <div className="cal-grid" role="grid" aria-label="Choose leave dates">
          {WEEKDAYS.map((w) => <span key={w} className="wd" role="columnheader">{w}</span>)}
          {cells.map((d) => {
            const v = iso(d);
            const out = d.getMonth() !== m;
            const past = v < todayIso;
            const isStart = v === from;
            const isEnd = v === to;
            const mid = from && to && v > from && v < to;
            const cls = ["d", out ? "out" : "", past ? "past" : "", isStart ? "start" : "", isEnd ? "end" : "", mid ? "mid" : "", isStart && isEnd ? "solo" : ""].filter(Boolean).join(" ");
            return (
              <button key={v} type="button" role="gridcell" className={cls} disabled={out || past} aria-selected={isStart || isEnd || mid} aria-label={d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} onClick={() => pickDay(d)}>
                <span>{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        <div className="cal-actions">
          <button type="button" className="btn primary" disabled={!ready} onClick={() => onSelect({ from, to, days })}>Submit Date</button>
          <button type="button" className="btn outline" onClick={onCancel}>Cancel</button>
        </div>
      </section>
    </div>
  );
}

export default function SubmitLeave({ onBack, onSubmit, onViewHistory, onNavigate }) {
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(null);
  const [delegate, setDelegate] = useState("");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [sheet, setSheet] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const ready = category && duration && delegate && phone.trim().length >= 6;

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    setConfirm(true);
  };
  const proceed = () => {
    setConfirm(false);
    onSubmit?.({ category, duration, delegate, phone: phone.trim(), description: desc.trim() });
    setDone(true);
  };

  return (
    <main className="app wp sleave">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Submit Leave</h1>
      </header>

      <form id="leave-form" className="wp-body" onSubmit={submit}>
        <section className="wp-card">
          <h2>Fill Leave Information</h2>
          <p className="wp-sub">Information about leave details</p>

          <PickField id="lcat" label="Leave Category" icon={<CategoryIcon />} value={category} placeholder="Select Category" onOpen={() => setSheet("category")} />
          <PickField id="ldur" label="Leave Duration" icon={<CalendarIcon />} value={duration ? `${withYear(duration.from)} - ${withYear(duration.to)}` : ""} placeholder="Select Duration" onOpen={() => setSheet("duration")} />
          <PickField id="ldel" label="Task Delegation" icon={<MemberIcon />} value={delegate} placeholder="Select Member" onOpen={() => setSheet("delegate")} />

          <div className="field wp-field">
            <label htmlFor="lphone">Emergency Contact During Leave Period</label>
            <div className="control">
              <span className="country">INA <Chevron /></span>
              <input id="lphone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s]/g, ""))} placeholder="+62 821 2100 2100" />
            </div>
          </div>

          <div className="field wp-field">
            <label htmlFor="ldesc">Leave Description</label>
            <textarea id="ldesc" className="ta" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter Leave Description" rows={4} maxLength={1000} />
          </div>
        </section>
      </form>

      {sheet === "category" && <OptionSheet title="Leave Category" subtitle="Select Leave category" options={CATEGORIES} value={category} onSelect={(v) => { setCategory(v); setSheet(null); }} onCancel={() => setSheet(null)} />}
      {sheet === "delegate" && <OptionSheet title="Select Task Delegation" subtitle="Select Leave category" options={MEMBERS} value={delegate} onSelect={(v) => { setDelegate(v); setSheet(null); }} onCancel={() => setSheet(null)} />}
      {sheet === "duration" && <DurationSheet value={duration} onSelect={(v) => { setDuration(v); setSheet(null); }} onCancel={() => setSheet(null)} />}

      {confirm && (
        <ConfirmSheet
          icon="layers"
          title="Submit Leave"
          text="Double-check your leave details to ensure everything is correct. Do you want to proceed?"
          yes="Yes, Submit"
          no="No, Let me check"
          onYes={proceed}
          onNo={() => setConfirm(false)}
        />
      )}

      {done && (
        <ResultSheet
          icon="layers"
          title="Leave Submitted!"
          text={"Your leave request has been sent for review!\nWait for HR to review your request."}
          action="View Expense History"
          onAction={() => onViewHistory?.()}
        />
      )}

      <div className="create-bar">
        <button type="submit" form="leave-form" className="btn primary" disabled={!ready}>Submit Now</button>
      </div>
      <TabBar active="more" onNavigate={onNavigate} />
    </main>
  );
}
