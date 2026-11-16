import { useState } from "react";
import TabBar from "./TabBar.jsx";

const STATUS = { todo: "To Do", progress: "In Progress", done: "Done" };

const Flag = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M6 3.5v17M6 4.5h11l-2.2 4 2.2 4H6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Send = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z" /></svg>
);

const TONES = [
  "linear-gradient(135deg,#ffd29a,#ffe39a)",
  "linear-gradient(135deg,#ffb0c8,#f58fb0)",
  "linear-gradient(135deg,#bcd7ff,#8aa8f5)",
  "linear-gradient(135deg,#bfe9c4,#7fcf9a)",
];
const tone = (name = "") => TONES[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % TONES.length];

const stamp = () => {
  const d = new Date();
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} ${time}`;
};

const withMentions = (text) =>
  text.split(/(@\w+)/g).map((part, i) => (part.startsWith("@") ? <span key={i} className="mention">{part}</span> : part));

const PRIORITY_CLASS = { High: "red", Medium: "amber", Low: "green" };

export default function TaskDetails({ task, me = { name: "You" }, onBack, onNavigate }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [comments, setComments] = useState(task?.commentList || []);
  if (!task) return null;

  const images = task.images || [];
  const [name, role] = (task.member || "").split(" - ");
  const others = images.map((src, i) => ({ src, i })).filter((x) => x.i !== idx);

  const send = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setComments((c) => [...c, { author: me.name, role: me.role, at: stamp(), text: t }]); // replace with your API call
    setText("");
  };

  return (
    <main className="app wp tdetail">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Task Details</h1>
      </header>

      <div className="wp-body">
        <section className="wp-card td-card">
          <div className="td-top">
            <div>
              <h2>{task.title}</h2>
              <p className="td-created">Created {task.createdAt || "—"}</p>
            </div>
            {task.state === "done" ? (
              <span className="status-pill ok"><svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#22b573" /><path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>{STATUS.done}</span>
            ) : (
              <span className="status-pill"><i />{STATUS[task.state] || "In Progress"}</span>
            )}
          </div>

          <div className="td-media">
            {images.length ? <img src={images[idx]} alt={`Attachment ${idx + 1} of ${images.length}`} /> : <span className="no-img" aria-hidden="true" />}
            {images.length > 1 && (
              <div className="dots" role="tablist" aria-label="Attachments">
                {images.map((_, i) => (
                  <button key={i} type="button" role="tab" aria-selected={i === idx} aria-label={`Attachment ${i + 1}`} className={i === idx ? "on" : ""} onClick={() => setIdx(i)} />
                ))}
              </div>
            )}
          </div>

          {others.length > 0 && (
            <div className="thumbs">
              {others.map(({ src, i }) => (
                <button key={i} type="button" onClick={() => setIdx(i)} aria-label={`Show attachment ${i + 1}`}><img src={src} alt="" /></button>
              ))}
            </div>
          )}

          <div className="td-desc">
            <b>Description</b>
            <p>{task.description || "No description provided."}</p>
          </div>

          <div className="td-meta">
            <div>
              <b>Priority</b>
              <span className={`tag ${PRIORITY_CLASS[task.priority] || "red"} big`}><Flag />{task.priority}</span>
            </div>
            <div>
              <b>Difficulty</b>
              <span className="diff">
                <i aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="1em" height="1em"><circle cx="8.5" cy="10" r="1.2" fill="#0b4d2c" /><circle cx="15.5" cy="10" r="1.2" fill="#0b4d2c" /><path d="M8 14c1.2 1.8 2.4 2.6 4 2.6s2.8-.8 4-2.6" fill="none" stroke="#0b4d2c" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </i>
                {task.difficulty || "—"}
              </span>
            </div>
          </div>

          <hr />

          <div className="td-assignee">
            <b>Assignee</b>
            <div className="who2">
              <span className="av" aria-hidden="true" />
              <div>
                <p className="n2">{name || "Unassigned"}</p>
                {role && <p className="r2">{role}</p>}
              </div>
            </div>
          </div>

          <div className="td-comments">
            <b>Comment Section</b>
            {comments.length > 0 && (
              <ul>
                {comments.map((c, i) => (
                  <li key={i}>
                    <span className="av" style={{ background: tone(c.author) }} aria-hidden="true" />
                    <div className="cm">
                      <div className="cm-top"><b>{c.author}</b><time>{c.at}</time></div>
                      {c.role && <p className="r2">{c.role}</p>}
                      <p className="cm-text">{withMentions(c.text)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={send}>
              <span className="av me" style={{ background: tone(me.name) }} aria-hidden="true" />
              <div className="cbox">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." aria-label="Write a comment" maxLength={500} />
                <button type="submit" className={text.trim() ? "on" : ""} disabled={!text.trim()} aria-label="Send comment"><Send /></button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <TabBar active="tasks" onNavigate={onNavigate} />
    </main>
  );
}
