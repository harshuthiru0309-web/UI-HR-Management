const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const Ic = ({ children, fill }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} {...(fill ? { fill: "currentColor", stroke: "none" } : {})} aria-hidden="true">{children}</svg>
);

export const Bolt = () => <Ic fill><path d="M13 2.5 5 13.5h5.5L9.5 21.5l8-11H12z" /></Ic>;
const Flag = () => <Ic fill><path d="M6 3.5v17M6 4.5h11l-2.2 4 2.2 4H6z" stroke="currentColor" strokeWidth="1.8" /></Ic>;
const CalSm = () => <Ic><rect x="4" y="5" width="16" height="15" rx="3.5" /><path d="M8 3v4M16 3v4M4 10h16" /></Ic>;
const CommentIc = () => <Ic><path d="M5 5.5h14a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2h-6l-4 3.5V17H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z" /></Ic>;

const TONES = ["linear-gradient(135deg,#ffc2d6,#f58fb0)", "linear-gradient(135deg,#bfe9c4,#7fcf9a)", "linear-gradient(135deg,#bcd7ff,#8aa8f5)", "linear-gradient(135deg,#ffe2a8,#f5b86a)"];

export function Stack({ count = 3, extra = 0, image }) {
  return (
    <span className="stack" aria-hidden="true">
      {image
        ? <img className="stack-img" src={image} alt="" />
        : Array.from({ length: count }, (_, i) => <i key={i} style={{ background: TONES[i % TONES.length] }} />)}
      {extra > 0 && <em>+{extra}</em>}
    </span>
  );
}

const PRIORITY = { High: "red", Medium: "amber", Low: "green" };

export function TaskItem({ title, status, priority, progress, due, comments, people = 3, avatars, onOpen }) {
  return (
    <article
      className={`item${onOpen ? " tap" : ""}`}
      {...(onOpen ? { role: "button", tabIndex: 0, "aria-label": `Open task: ${title}`, onClick: onOpen, onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } } } : {})}
    >
      <div className="item-top">
        <span className="chip-ic"><Bolt /></span>
        <h4>{title}</h4>
      </div>
      <div className="tags">
        {status === "Done" ? (
          <span className="tag ok">
            <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#22b573" /><path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {status}
          </span>
        ) : (
          <span className="tag grey"><i />{status}</span>
        )}
        <span className={`tag ${PRIORITY[priority] || "red"}`}><Flag />{priority}</span>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" aria-label="Task progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="item-bot">
        <Stack count={people} image={avatars} />
        <span className="pills">
          <span className="pill"><CalSm />{due}</span>
          <span className="pill"><CommentIc />{comments}</span>
        </span>
      </div>
    </article>
  );
}
