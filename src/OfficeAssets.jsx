import { Ic, Field, CalendarIcon, Chevron, formatDate } from "./WorkProfile.jsx";

const TerminalIcon = () => <Ic><rect x="3" y="4.5" width="18" height="15" rx="3.5" /><path d="m8 10 3 2.5L8 15M13 15h3.5" /></Ic>;
const ListCheckIcon = () => <Ic><rect x="3" y="4" width="18" height="16" rx="3.5" /><path d="m7 9 1.4 1.4L10.8 8M7 15l1.4 1.4 2.4-2.4M13.5 9h3.5M13.5 15H17" /></Ic>;
const WarrantyIcon = () => <Ic><path d="M12 2.8 19.5 7v10L12 21.2 4.5 17V7z" /><circle cx="12" cy="12" r="2.6" /></Ic>;
const TagIcon = () => <Ic><path d="m4 15 9.5-9.5a2.1 2.1 0 0 1 3 0l2 2a2.1 2.1 0 0 1 0 3L9 20H4z" /><path d="m11.5 8 4.5 4.5M9 20h11" /></Ic>;

// Stand-in illustration for the asset photo. Pass `image` (a URL) to show a real photo instead.
function LaptopScene() {
  return (
    <svg className="oa-photo" viewBox="0 0 334 300" role="img" aria-label="Laptop on a wooden desk" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="oa-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ebe6e0" /><stop offset="1" stopColor="#f3efea" /></linearGradient>
        <linearGradient id="oa-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d3b08a" /><stop offset="1" stopColor="#c19a70" /></linearGradient>
      </defs>
      <rect width="334" height="300" fill="url(#oa-wall)" />
      <rect y="168" width="334" height="132" fill="url(#oa-desk)" />
      <rect y="258" width="334" height="3" fill="#a98358" opacity=".5" />
      <rect x="0" y="262" width="150" height="38" fill="#c9a37a" /><rect x="154" y="262" width="180" height="38" fill="#c9a37a" />
      <path d="M8 168v-44l24-12v56zM36 168v-34l24-8v42z" fill="#d9b978" /><path d="M8 124l24-12 24 14-20 8z" fill="#ead29a" />
      <path d="M306 168l16-14 8 10-12 12z" fill="none" stroke="#c9a14f" strokeWidth="2" />
      <rect x="85" y="86" width="164" height="104" rx="5" fill="#cfd0d4" />
      <rect x="89" y="90" width="156" height="96" rx="2" fill="#16171a" />
      <path d="M62 196h210l-9 20H71z" fill="#c4c5ca" />
      <path d="M62 196h210l-3 6H65z" fill="#e1e2e5" />
      <rect x="92" y="203" width="150" height="9" rx="1.5" fill="#222326" />
      <rect x="140" y="214" width="54" height="9" rx="2" fill="#b6b7bc" />
      <ellipse cx="167" cy="232" rx="120" ry="6" fill="#000" opacity=".12" />
    </svg>
  );
}

const DEMO = { name: "Laptop Macbook Air M1 2020", brand: "Apple", warranty: "Off", buyingDate: "2020-09-12", receivedOn: "2020-09-14", image: "" };

export default function OfficeAssets({ asset = DEMO, onBack }) {
  const rows = [
    ["Assets Name", <TerminalIcon />, asset.name],
    ["Brand", <ListCheckIcon />, asset.brand],
    ["Warranty Status", <WarrantyIcon />, asset.warranty],
    ["Buying Date", <TagIcon />, asset.buyingDate ? formatDate(asset.buyingDate) : ""],
    ["Received On", <CalendarIcon />, asset.receivedOn ? formatDate(asset.receivedOn) : "", true],
  ];

  return (
    <main className="app wp pd oa">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Office Assets</h1>
      </header>

      <div className="wp-body">
        <section className="wp-card">
          <h2>Assets Information</h2>
          <p className="wp-sub">Your office assets information</p>

          {asset.image ? <img className="oa-photo" src={asset.image} alt={asset.name} /> : <LaptopScene />}

          {rows.map(([label, icon, value, chevron], i) => (
            <Field key={label} label={label} id={`oa-${i}`} icon={icon}>
              <input id={`oa-${i}`} value={value} readOnly />
              {chevron && <span className="trail"><Chevron /></span>}
            </Field>
          ))}
        </section>
      </div>
    </main>
  );
}
