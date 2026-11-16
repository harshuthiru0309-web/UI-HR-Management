const S = { strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const Svg = ({ children }) => <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">{children}</svg>;
const o = { fill: "none", stroke: "currentColor", ...S };

const ICONS = {
  home: (on) => <Svg>{on
    ? <path fill="currentColor" d="M12 2.8 3.5 9.3V19a2 2 0 0 0 2 2h3.5v-6h6v6h3.5a2 2 0 0 0 2-2V9.3z" />
    : <path {...o} d="M12 3.5 4.5 9.3V19a1.5 1.5 0 0 0 1.5 1.5h3.5v-5.5h5v5.5H18a1.5 1.5 0 0 0 1.5-1.5V9.3z" />}</Svg>,
  clock: (on) => <Svg>
    <rect x="4" y="5" width="16" height="15" rx="4" {...(on ? { fill: "currentColor" } : o)} />
    <path d="M8 3v4M16 3v4" {...o} />
    {on ? <path d="M9 12.5h.01M12 12.5h.01M15 12.5h.01M9 16h.01M12 16h.01" stroke="#1f2123" strokeWidth="2" strokeLinecap="round" /> : <path d="M9 13.5l2 2 4-4" {...o} />}
  </Svg>,
  tasks: (on) => <Svg><rect x="4.5" y="3.5" width="15" height="17" rx="4" {...(on ? { fill: "currentColor" } : o)} /><path d="M8.5 9h7M8.5 13h7M8.5 16.5h4" {...(on ? { fill: "none", stroke: "#1f2123", strokeWidth: 1.7, strokeLinecap: "round" } : o)} /></Svg>,
  pay: (on) => <Svg><path d="M6 3.5h12v17l-2.5-1.5L13 20.5 10.5 19 8 20.5 6 19z" {...(on ? { fill: "currentColor" } : o)} /><path d="M9 8.5h6M9 12h6M9 15.5h3" {...(on ? { fill: "none", stroke: "#1f2123", strokeWidth: 1.7, strokeLinecap: "round" } : o)} /></Svg>,
  more: (on) => <Svg><path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z" {...(on ? { fill: "currentColor", stroke: "currentColor", strokeWidth: 1.7, strokeLinejoin: "round" } : o)} /><path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" {...o} /></Svg>,
};

const TABS = [
  ["home", "Home"],
  ["clock", "Clock in"],
  ["tasks", "Tasks"],
  ["pay", "Payslips"],
  ["more", "More"],
];

export default function TabBar({ active, onNavigate }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className={`tab${active === key ? " on" : ""}`}
          aria-label={label}
          aria-current={active === key ? "page" : undefined}
          onClick={() => onNavigate?.(key)}
        >
          {ICONS[key](active === key)}
        </button>
      ))}
    </nav>
  );
}
