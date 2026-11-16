// Placeholder conversations. Replace with your API.
const CHATS = [
  { id: 1, name: "Alicia Rochefort", text: "Hey Tonald, we have to attend our daily stand up meeting at 10.00 AM", time: "09.10", unread: 1, look: { bg: "#f6a0c4", skin: "#ffd9b8", hair: "#f4b43c" } },
  { id: 2, name: "Jessica Tan", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#ff9f6a", skin: "#ffd9b8", hair: "#2fbf9b" } },
  { id: 3, name: "Lolita Xue", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#ffb877", skin: "#ffe0c8", hair: "#3b2f4a" } },
  { id: 4, name: "Eaj Prakk", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#f6a0c4", skin: "#ffd9b8", hair: "#e7e1d6" } },
  { id: 5, name: "Jason", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#ffcf6e", skin: "#ffd9b8", hair: "#f08aa8" } },
  { id: 6, name: "Kimberly", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#aab4f5", skin: "#ffd9b8", hair: "#ff6fa5" } },
  { id: 7, name: "Wang", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#e9c9f7", skin: "#b9805a", hair: "#4fb8c9" } },
  { id: 8, name: "James", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#bdeee6", skin: "#ffd0b0", hair: "#ff9a62" } },
  { id: 9, name: "Bella", text: "Ey Tonald, let’s do the design sprint at friday 10.00 AM", time: "09.10", look: { bg: "#ffeedd", skin: "#fff1e6", hair: "#f2f2f2" } },
];

function Face({ bg, skin, hair }) {
  return (
    <svg viewBox="0 0 48 48" className="mg-face" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill={bg} />
      <path d="M8 48c1.5-9 8-13 16-13s14.5 4 16 13z" fill={hair} opacity=".55" />
      <circle cx="24" cy="23" r="10.5" fill={skin} />
      <path d="M13 22c0-8 5-12 11-12s11 4 11 12c-3-4-7-5-11-5s-8 1-11 5z" fill={hair} />
      <circle cx="20" cy="24" r="1.1" fill="#2b2140" />
      <circle cx="28" cy="24" r="1.1" fill="#2b2140" />
      <path d="M21 28.5q3 2.5 6 0" fill="none" stroke="#2b2140" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export default function Messages({ chats = CHATS, onBack, onOpen }) {
  return (
    <main className="app wp msgs">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Messages</h1>
      </header>

      <ul className="mg-list">
        {chats.map((c) => (
          <li key={c.id}>
            <button type="button" className="mg-row" onClick={() => onOpen?.(c)} aria-label={`${c.name}${c.unread ? `, ${c.unread} unread` : ""}`}>
              {c.photo ? <img className="mg-face" src={c.photo} alt="" /> : <Face {...c.look} />}
              <span className="mg-main">
                <b>{c.name}</b>
                <span>{c.text}</span>
              </span>
              <span className="mg-meta">
                <time>{c.time}</time>
                {c.unread ? <i className="mg-badge">{c.unread}</i> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
