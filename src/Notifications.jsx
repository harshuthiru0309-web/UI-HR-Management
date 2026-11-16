// Placeholder notifications. Replace with your API.
const ITEMS = [
  { id: 1, kind: "task", title: "New Task Assigned to You!", time: "09.10", text: "You have new task for this sprint from Alicia, you can check your task “Create Onboarding Screen” by tap here" },
  { id: 2, kind: "expense", title: "Expense has been approved!", time: "09.10", text: "Your expense has been been approved by jessica, view expense report here" },
  { id: 3, kind: "meeting", title: "You have invited in meeting!", time: "09.10", text: "You have been invited to a meeting. Tap to find the meeting details" },
];

const Doc = () => (
  <svg viewBox="0 0 40 48" className="nt-art" aria-hidden="true">
    <path d="M3 4a3 3 0 0 1 3-3h20l11 11v32a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="#e4defc" />
    <path d="M26 1v8a3 3 0 0 0 3 3h8z" fill="#c9bdf8" />
    {[18, 23, 28, 33, 38].map((y) => <rect key={y} x="9" y={y} width="22" height="2" rx="1" fill="#b3a2f4" />)}
    <rect x="9" y="12" width="12" height="2" rx="1" fill="#b3a2f4" />
  </svg>
);

const Person = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} fill="#8f78f0"><circle cx="0" cy="-2.2" r="1.8" /><path d="M-3.2 3.2a3.2 3.2 0 0 1 6.4 0z" /></g>
);
const Meeting = () => (
  <svg viewBox="0 0 48 40" className="nt-art wide" aria-hidden="true">
    <rect x="2" y="3" width="44" height="34" rx="4" fill="#e4defc" />
    {[10, 24, 38].flatMap((x) => [14, 28].map((y) => <Person key={`${x}-${y}`} x={x} y={y} />))}
  </svg>
);

const ART = { task: Doc, expense: Doc, meeting: Meeting };

export default function Notifications({ items = ITEMS, onBack, onOpen }) {
  return (
    <main className="app wp msgs nt">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Messages</h1>
      </header>

      <ul className="mg-list">
        {items.map((n) => {
          const Art = ART[n.kind] || Doc;
          return (
            <li key={n.id}>
              <button type="button" className="mg-row nt-row" onClick={() => onOpen?.(n)}>
                <span className="nt-tile"><Art /></span>
                <span className="nt-main">
                  <span className="nt-top"><b>{n.title}</b><time>{n.time}</time></span>
                  <span className="nt-text">{n.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
