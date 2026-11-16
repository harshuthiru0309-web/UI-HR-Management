import { useState } from "react";
import TabBar from "./TabBar.jsx";
import { TaskItem } from "./TaskCard.jsx";
import { TaskArt } from "./Art.jsx";

const Glyph = ({ bg, children }) => (
  <span className="glyph" style={{ background: bg }}>
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
  </span>
);

function Clipboard() {
  return (
    <svg className="wings" viewBox="0 0 110 90" aria-hidden="true">
      <path d="M22 8c.8 4 2.4 5.6 6.5 6.5-4.1.9-5.7 2.5-6.5 6.5-.8-4-2.4-5.6-6.5-6.5C19.6 13.6 21.2 12 22 8z" fill="#fff" opacity=".85" />
      <path d="M96 56c.6 3 1.8 4.2 4.8 4.8-3 .6-4.2 1.8-4.8 4.8-.6-3-1.8-4.2-4.8-4.8 3-.6 4.2-1.8 4.8-4.8z" fill="#fff" opacity=".8" />
      <circle cx="14" cy="60" r="1.6" fill="#fff" opacity=".8" />
      <g transform="rotate(14 60 50)">
        <rect x="34" y="16" width="52" height="66" rx="6" fill="#ede8ff" />
        <rect x="38" y="22" width="44" height="56" rx="3" fill="#fff" />
        <rect x="46" y="9" width="28" height="14" rx="4" fill="#f4b740" />
        <circle cx="60" cy="14" r="3" fill="#fff" />
        <rect x="44" y="34" width="32" height="3.5" rx="1.7" fill="#a99cf6" />
        <rect x="44" y="43" width="26" height="3.5" rx="1.7" fill="#c9bdfb" />
        <rect x="44" y="52" width="30" height="3.5" rx="1.7" fill="#c9bdfb" />
        <rect x="44" y="61" width="20" height="3.5" rx="1.7" fill="#c9bdfb" />
      </g>
    </svg>
  );
}

const FILTERS = [["todo", "To Do"], ["progress", "In Progress"], ["done", "Finish"]];
const FILTERS_EMPTY = [["all", "All"], ["progress", "In Progress"], ["done", "Finish"]]; // shown when there are no tasks
const STATUS = { todo: "To Do", progress: "In Progress", done: "Done" };

export default function Tasks({ tasks = [], burnout, onNavigate, onCreate, onOpenBurnout, onOpenTask }) {
  const [filter, setFilter] = useState(tasks.length ? "todo" : "all");

  const count = (s) => tasks.filter((t) => t.state === s).length;
  const counts = { all: tasks.length, todo: count("todo"), progress: count("progress"), done: count("done") };
  const visible = tasks.filter((t) => filter === "all" || t.state === filter);

  return (
    <main className="app tasks">
      <header className="c-head">
        <div>
          <h1>Challenges Awaiting</h1>
          <p>Let’s tackle your to do list</p>
        </div>
        <Clipboard />
      </header>

      <div className="c-body">
        <section className="c-card">
          <h2>Summary of Your Work</h2>
          <p className="period">Your current task progress</p>
          <div className="tiles three">
            <div className="tile"><span><Glyph bg="#7c5cfa"><path d="m9.5 9-3 3 3 3M14.5 9l3 3-3 3" /></Glyph> To Do</span><b>{count("todo")}</b></div>
            <div className="tile"><span><Glyph bg="#ff9500"><circle cx="12" cy="12" r="6.5" /><path d="M12 9v3l2 1" /></Glyph> In Progress</span><b>{count("progress")}</b></div>
            <div className="tile"><span><Glyph bg="#22b573"><path d="m7.5 12.5 3 3 6-6.5" /></Glyph> Done</span><b>{count("done")}</b></div>
          </div>
        </section>

        {burnout && (
          <section
            className="c-card burnout tap"
            role="button"
            tabIndex={0}
            aria-label="Open burnout stats"
            onClick={onOpenBurnout}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenBurnout?.(); } }}
          >
            {(() => { const good = burnout.level === "Good"; return (<>
            <h2>{burnout.sprint ? `${burnout.sprint} - ` : ""}Burnout Stats <span className={`level${good ? " good" : ""}`}>{burnout.level}</span></h2>
            <p className="period">
              {burnout.extra > 0 ? (
                <>You’ve completed <b>{burnout.extra} more tasks than usual</b>, maintain your task with your supervisor</>
              ) : (
                "You’ve maintained your tasks at the right pace! Keep it up!"
              )}
            </p>
            <div className="meter">
              <span className={`face${good ? " good" : ""}`} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="1em" height="1em">
                  <circle cx="8.5" cy="10" r="1.2" fill={good ? "#0b4d2c" : "#7a2e12"} /><circle cx="15.5" cy="10" r="1.2" fill={good ? "#0b4d2c" : "#7a2e12"} />
                  <path d={good ? "M8 14c1.2 1.8 2.4 2.6 4 2.6s2.8-.8 4-2.6" : "M8 17c1.2-1.8 2.4-2.6 4-2.6s2.8.8 4 2.6"} fill="none" stroke={good ? "#0b4d2c" : "#7a2e12"} strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <div className={`bar2${good ? " good" : ""}`} role="progressbar" aria-valuenow={burnout.pct} aria-valuemin="0" aria-valuemax="100" aria-label="Burnout level"><span style={{ width: `${burnout.pct}%` }} /></div>
            </div>
            </>); })()}
          </section>
        )}

        <div className="filters" role="tablist" aria-label="Filter tasks">
          {(tasks.length ? FILTERS : FILTERS_EMPTY).map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={filter === key} className={filter === key ? "on" : ""} onClick={() => setFilter(key)}>
              {label} {counts[key] > 0 && <span className="n">{counts[key]}</span>}
            </button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <section className="c-card wp-empty">
            <h2>Today Task</h2>
            <p className="period muted">The tasks assigned to you for today</p>
            <div className="empty">
              <TaskArt />
              <b>No Tasks Assigned</b>
              <p>It looks like you don’t have any tasks assigned to you right now. Don’t worry, this space will be updated as new tasks become available.</p>
            </div>
          </section>
        ) : (
          <div className="t-list" role="tabpanel">
            {visible.length ? (
              visible.map((t) => <TaskItem key={t.title} {...t} status={STATUS[t.state]} onOpen={() => onOpenTask?.(t)} />)
            ) : (
              <p className="none">No tasks in this list yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="create-bar">
        <button type="button" className="btn primary" onClick={onCreate}>Create Task</button>
      </div>
      <TabBar active="tasks" onNavigate={onNavigate} />
    </main>
  );
}
