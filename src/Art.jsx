export function TaskArt() {
  const lines = (x, y, n, w = 22) => Array.from({ length: n }, (_, i) => <rect key={i} x={x} y={y + i * 5} width={w} height="2" rx="1" fill="#a99cf6" />);
  return (
    <svg className="t-art" viewBox="0 0 130 80" aria-hidden="true">
      <g transform="rotate(7 100 45)"><rect x="82" y="12" width="40" height="60" rx="3" fill="#e9e5fc" />{lines(88, 26, 6, 28)}</g>
      <g transform="rotate(-4 28 45)"><rect x="6" y="22" width="44" height="42" rx="3" fill="#e9e5fc" /><rect x="10" y="27" width="16" height="12" rx="1.5" fill="#cbc1fa" />{lines(12, 46, 3, 30)}</g>
      <rect x="40" y="6" width="46" height="68" rx="3" fill="#f6f4ff" stroke="#e5e0fb" /><path d="M72 6h14v14z" fill="#dcd5fb" />{lines(47, 26, 8, 30)}
    </svg>
  );
}

export function DocArt() {
  return (
    <svg className="t-art doc-art" viewBox="0 0 80 90" aria-hidden="true">
      <defs>
        <linearGradient id="docfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efebfd" />
          <stop offset="1" stopColor="#f8f6ff" />
        </linearGradient>
      </defs>
      <path d="M8 4h50l14 14v68H8z" fill="url(#docfade)" />
      <path d="M58 4v14h14z" fill="#e2dcfb" />
      {[26, 34, 42, 50, 58, 66].map((y) => <rect key={y} x="18" y={y} width="44" height="2.6" rx="1.3" fill="#b3a6f7" />)}
    </svg>
  );
}

export function SuitcaseArt() {
  return (
    <svg className="t-art suit-art" viewBox="0 0 64 104" aria-hidden="true">
      <rect x="13" y="0" width="38" height="6" fill="#c9c2f8" />
      <rect x="17" y="6" width="7" height="36" fill="#dcd7fb" />
      <rect x="40" y="6" width="7" height="36" fill="#dcd7fb" />
      <rect x="0" y="40" width="64" height="64" rx="3" fill="#d5d0fa" />
      {[10, 23, 36, 49].map((x) => <rect key={x} x={x} y="40" width="5" height="64" fill="#cbc4f8" />)}
    </svg>
  );
}

export function Wings() {
  return (
    <svg className="wings" viewBox="0 0 110 80" aria-hidden="true">
      <path d="M62 4c1 5 3 7 8 8-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-8z" fill="#fff" opacity=".85" />
      <path d="M100 6c.7 3 2 4 5 5-3 .7-4.3 2-5 5-.7-3-2-4.3-5-5 3-.7 4.3-2 5-5z" fill="#fff" opacity=".85" />
      <circle cx="12" cy="30" r="1.6" fill="#fff" opacity=".8" /><circle cx="26" cy="70" r="1.6" fill="#fff" opacity=".8" />
      <path d="M30 34c-12-8-24-4-28 4 8 0 14 2 18 8-8-1-14 2-16 8 8-1 14 0 20 6z" fill="#fff" />
      <path d="M78 34c12-8 24-4 28 4-8 0-14 2-18 8 8-1 14 2 16 8-8-1-14 0-20 6z" fill="#fff" />
      <circle cx="54" cy="50" r="22" fill="#f4f1ff" stroke="#fff" strokeWidth="3" />
      <circle cx="54" cy="50" r="17" fill="#fff" stroke="#c9bdfb" strokeWidth="2" />
      <path d="M54 38v12l8 5" fill="none" stroke="#7c5cfa" strokeWidth="3" strokeLinecap="round" />
      <rect x="49" y="24" width="10" height="5" rx="2" fill="#c9bdfb" />
    </svg>
  );
}
