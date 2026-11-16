import { useEffect, useRef, useState } from "react";
import OptionSheet from "./OptionSheet.jsx";
import ConfirmSheet from "./ConfirmSheet.jsx";
import ResultSheet from "./ResultSheet.jsx";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const Ic = ({ children }) => <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} aria-hidden="true">{children}</svg>;

const UploadIcon = () => <Ic><path d="M12 15V4m0 0L8 8m4-4 4 4M5 14v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3" /></Ic>;
const TitleIcon = () => <Ic><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="currentColor" stroke="none" /><path d="M8 10h6M8 14h4" stroke="#fff" /><circle cx="17.5" cy="6.5" r="2.8" fill="#ff5a4f" stroke="#fff" strokeWidth="1.2" /></Ic>;
const MemberIcon = () => <Ic><path d="M12 2.5 20 7v10l-8 4.5L4 17V7z" fill="currentColor" stroke="none" /><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none" /><path d="M7.5 16.5c.8-2.4 2.5-3.3 4.5-3.3s3.7.9 4.5 3.3z" fill="#fff" stroke="none" /></Ic>;
const PriorityIcon = () => <Ic><path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z" fill="currentColor" /><path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" /></Ic>;
const DifficultyIcon = () => <Ic><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="5.6" stroke="#fff" /><circle cx="12" cy="12" r="2.2" fill="#fff" stroke="none" /></Ic>;
const Chevron = () => <Ic><path d="m6 9 6 6 6-6" /></Ic>;

const MEMBERS = [
  "Ivankov - Sr Front End Developer",
  "Brahm - Mid Front End Developer",
  "Alice - Sr Front End Developer",
  "Jeane - Jr Front End Developer",
  "Claudia - Jr Front End Developer",
];
const PRIORITIES = ["Low", "Medium", "High"];
const DIFFICULTIES = [
  "Very Easy (Less Than a Day)",
  "Easy (A Day)",
  "Moderate (3 Days)",
  "Intermediate (5 Days)",
  "Advanced (1 Week)",
];
const PICKERS = {
  member: { title: "Assign To", subtitle: "Who will finish this task", options: MEMBERS, value: (v) => v.member, set: (f) => f.setMember },
  priority: { title: "Priority", subtitle: "Select the priority", options: PRIORITIES, value: (v) => v.priority, set: (f) => f.setPriority },
  difficulty: { title: "Difficulty", subtitle: "Select the difficulty", options: DIFFICULTIES, value: (v) => v.difficulty, set: (f) => f.setDifficulty },
};
const OK_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;

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

const RING = "M50 1H92A7 7 0 0 1 99 8V92A7 7 0 0 1 92 99H8A7 7 0 0 1 1 92V8A7 7 0 0 1 8 1Z";

function Ring({ progress }) {
  const path = useRef(null);
  const [pt, setPt] = useState({ x: 50, y: 1 });

  useEffect(() => {
    const p = path.current;
    if (p) setPt(p.getPointAtLength((progress / 100) * p.getTotalLength()));
  }, [progress]);

  return (
    <svg className="ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={RING} fill="none" stroke="#e1dbfa" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path ref={path} d={RING} pathLength="100" fill="none" stroke="#7c5cfa" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray={`${progress} 100`} strokeLinecap="round" />
      <circle cx={pt.x} cy={pt.y} r="2" fill="#7c5cfa" />
    </svg>
  );
}

function Slot({ item, index, onPick, onRemove }) {
  const input = useRef(null);
  const uploading = item && item.progress < 100;
  return (
    <div className="slot-wrap">
      <button type="button" className={`slot${item ? " has" : ""}${uploading ? " busy" : ""}`} disabled={uploading} onClick={() => input.current?.click()} aria-label={uploading ? `Uploading attachment ${index + 1}, ${Math.round(item.progress)} percent` : item ? `Replace attachment ${index + 1}: ${item.file.name}` : `Add attachment ${index + 1}`}>
        {uploading ? (
          <>
            <Ring progress={item.progress} />
            <span className="pct"><b>{Math.round(item.progress)}%</b><small>Uploading...</small></span>
          </>
        ) : item ? (
          item.url ? <img src={item.url} alt="" /> : <span className="fname"><b>PDF</b>{item.file.name}</span>
        ) : (
          <span className="up"><UploadIcon /></span>
        )}
      </button>
      {item && !uploading && (
        <button type="button" className="rm" onClick={() => onRemove(index)} aria-label={`Remove attachment ${index + 1}`}>
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
        </button>
      )}
      <input ref={input} type="file" accept=".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onPick(index, f); }} />
    </div>
  );
}

// Fake upload so the UI can be seen working. Pass `upload(file, onProgress)` to use your real API instead.
const simulateUpload = (file, onProgress) =>
  new Promise((resolve) => {
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 14);
      onProgress(p);
      if (p >= 100) { clearInterval(t); resolve(); }
    }, 180);
  });

export default function CreateTask({ onBack, onCreate, onViewTasks, upload = simulateUpload }) {
  const [slots, setSlots] = useState([null, null, null]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [member, setMember] = useState("");
  const [priority, setPriority] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [picker, setPicker] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const pending = useRef(null);
  const urls = useRef([]);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const pick = (i, file) => {
    if (!OK_TYPES.includes(file.type)) return setError("Use a .pdf, .jpeg or .png file.");
    if (file.size > MAX_BYTES) return setError("Each file must be smaller than 5MB.");
    setError("");
    const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    if (url) urls.current.push(url);
    setSlots((s) => s.map((x, k) => (k === i ? { file, url, progress: 0 } : x)));
    const set = (progress) => setSlots((s) => s.map((x, k) => (k === i && x?.file === file ? { ...x, progress } : x)));
    Promise.resolve(upload(file, set))
      .then(() => set(100))
      .catch(() => { setSlots((s) => s.map((x, k) => (k === i && x?.file === file ? null : x))); setError("Upload failed. Try that file again."); });
  };

  const uploading = slots.some((x) => x && x.progress < 100);
  const remove = (i) => {
    setError("");
    setSlots((all) => all.map((x, k) => (k === i ? null : x)));
  };

  const ready = title.trim() && member && !uploading; // priority and difficulty are optional

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    pending.current = { title: title.trim(), description: desc.trim(), member, priority, difficulty, files: slots.filter(Boolean).map((s) => s.file) };
    setConfirm(true);
  };

  return (
    <main className="app wp create">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Create New Task</h1>
      </header>

      <form id="task-form" className="wp-body" onSubmit={submit}>
        <section className="wp-card">
          <h2>Attachment</h2>
          <p className="wp-sub">Format should be in .pdf .jpeg .png less than 5MB</p>
          <div className="slots">
            {slots.map((s, i) => <Slot key={i} item={s} index={i} onPick={pick} onRemove={remove} />)}
          </div>
          {error && <p className="error" role="alert">{error}</p>}

          <div className="field wp-field">
            <label htmlFor="title">Task Title</label>
            <div className="control">
              <span className="lead"><TitleIcon /></span>
              <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Task Title" maxLength={100} />
            </div>
          </div>

          <div className="field wp-field">
            <label htmlFor="desc">Task Description</label>
            <textarea id="desc" className="ta" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter Task Description" rows={4} maxLength={1000} />
          </div>

          <PickField id="member" label="Assign To" icon={<MemberIcon />} value={member} placeholder="Select Member" onOpen={() => setPicker("member")} />
          <PickField id="priority" label="Priority" icon={<PriorityIcon />} value={priority} placeholder="Select Priority" onOpen={() => setPicker("priority")} />
          <PickField id="difficulty" label="Difficulty" icon={<DifficultyIcon />} value={difficulty} placeholder="Select Difficulty" onOpen={() => setPicker("difficulty")} />
        </section>
      </form>

      {confirm && (
        <ConfirmSheet
          title="Create New Task"
          text="Double-check your task details to ensure everything is correct. Do you want to proceed?"
          yes="Yes, Proceed Now"
          no="No, Let me check"
          onYes={() => {
            setConfirm(false);
            onCreate?.(pending.current);
            setSlots([null, null, null]); setTitle(""); setDesc(""); setMember(""); setPriority(""); setDifficulty(""); setError("");
            setDone(true);
          }}
          onNo={() => setConfirm(false)}
        />
      )}

      {done && (
        <ResultSheet
          icon="task"
          title="Task Has Been Created!"
          text="Congratulations! Task has been created! view your task in the task management"
          action="View Task Management"
          onAction={onViewTasks}
        />
      )}

      {picker && (
        <OptionSheet
          key={picker}
          title={PICKERS[picker].title}
          subtitle={PICKERS[picker].subtitle}
          options={PICKERS[picker].options}
          value={PICKERS[picker].value({ member, priority, difficulty })}
          onSelect={(v) => { PICKERS[picker].set({ setMember, setPriority, setDifficulty })(v); setPicker(null); }}
          onCancel={() => setPicker(null)}
        />
      )}

      <div className="wp-bar">
        <button type="submit" form="task-form" className="btn primary" disabled={!ready}>Create Task</button>
      </div>
    </main>
  );
}
