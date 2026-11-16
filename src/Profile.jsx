const I = ({ children }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">{children}</svg>
);
const f = "#7c5cfa";

const ICONS = {
  person: <I><circle cx="12" cy="7.5" r="4" fill={f} /><path d="M4 21c.6-4.6 4-6.6 8-6.6s7.4 2 8 6.6z" fill={f} /></I>,
  folder: <I><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2.5h6.5A2.5 2.5 0 0 1 21 9v9.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5z" fill={f} /></I>,
  payroll: <I><rect x="2.5" y="5" width="19" height="14" rx="3.5" fill={f} /><circle cx="12" cy="12" r="2.6" fill="#f4f5fa" /><circle cx="6.6" cy="12" r="1" fill="#f4f5fa" /><circle cx="17.4" cy="12" r="1" fill="#f4f5fa" /></I>,
  crown: <I><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.6 11H4.6z" fill={f} /></I>,
  gear: <I><path fill={f} fillRule="evenodd" d="M10.3 2.5h3.4l.5 2.4 1.7.7 2.1-1.3 2.4 2.4-1.3 2.1.7 1.7 2.4.5v3.4l-2.4.5-.7 1.7 1.3 2.1-2.4 2.4-2.1-1.3-1.7.7-.5 2.4h-3.4l-.5-2.4-1.7-.7-2.1 1.3-2.4-2.4 1.3-2.1-.7-1.7-2.4-.5v-3.4l2.4-.5.7-1.7-1.3-2.1 2.4-2.4 2.1 1.3 1.7-.7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></I>,
  code: <I><rect x="3" y="3" width="18" height="18" rx="4.5" fill={f} /><path d="m10 9-3 3 3 3M14 9l3 3-3 3" fill="none" stroke="#f4f5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></I>,
  faq: <I><rect x="3" y="3" width="18" height="18" rx="4.5" fill={f} /><path d="M7.5 9.5h9M7.5 13h9M7.5 16.2h5" stroke="#f4f5fa" strokeWidth="1.8" strokeLinecap="round" /></I>,
  logout: <I><rect x="7" y="3" width="14" height="18" rx="4" fill="#ef5a52" /><path d="M13 12H2.5m0 0 3-3m-3 3 3 3" fill="none" stroke="#ef5a52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></I>,
};

ICONS.mail = <I><rect x="3" y="5" width="18" height="14" rx="3.5" fill={f} /><path d="m7 10 5 3.5L17 10" fill="none" stroke="#f4f5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></I>;
ICONS.shield = <I><path d="M12 2.5 20 5.5v5.8c0 4.6-3.3 8.2-8 10.2-4.7-2-8-5.6-8-10.2V5.5z" fill={f} /><path d="m8.5 12 2.7 2.7 4.5-4.8" fill="none" stroke="#f4f5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></I>;

const Chevron = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 5 7 7-7 7" />
  </svg>
);

const GLYPHS = {
  diamond: "M24 14 33 26 24 38 15 26z",
  star: "m24 13.5 3.3 7.3 7.9.8-5.9 5.3 1.7 7.8-7-4-7 4 1.7-7.8-5.9-5.3 7.9-.8z",
  sparkle: "M24 12.5c1.2 7.8 3.8 10.700 11.5 11.5-7.700 1-10.3 3.700-11.5 11.5-1.2-7.8-3.8-10.5-11.5-11.5 7.700-.8 10.3-3.700 11.5-11.5z",
  gem: "M16 18.5h16l4.5 6.5L24 37 11.5 25z",
};

function Badge({ title, glyph, base, light }) {
  return (
    <li className="badge-item">
      <svg viewBox="0 0 48 52" aria-hidden="true">
        <polygon points="24,2.5 43.500,13.5 43.500,38.5 24,49.5 4.5,38.5 4.5,13.5" fill={light} stroke={base} strokeOpacity=".55" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="24,8 38.8,16.3 38.8,35.7 24,44 9.2,35.7 9.2,16.3" fill={base} fillOpacity=".55" stroke="#fff" strokeOpacity=".7" strokeWidth="1" strokeLinejoin="round" />
        <path d={GLYPHS[glyph]} fill="#fff" fillOpacity=".92" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span>{title}</span>
    </li>
  );
}

function Achievements({ items }) {
  return (
    <section className="achv" aria-labelledby="g-achv">
      <h2 id="g-achv">Achievement</h2>
      <ul>
        {items.map((b) => <Badge key={b.title} {...b} />)}
      </ul>
    </section>
  );
}

function Group({ title, items }) {
  return (
    <section className="group" aria-labelledby={`g-${title}`}>
      <h2 id={`g-${title}`}>{title}</h2>
      <ul>
        {items.map(({ label, icon, onClick }) => (
          <li key={label}>
            {onClick ? (
              <button type="button" onClick={onClick}>
                <span className="mi">{ICONS[icon]}</span>
                <span className="ml">{label}</span>
                <span className="mc"><Chevron /></span>
              </button>
            ) : (
              <div className="info-row">
                <span className="mi">{ICONS[icon]}</span>
                <span className="ml">{label}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Profile({ profile, achievements = [], email = "Tonald@work.com", onBack, onWorkProfile, onOfficeAssets, onPayroll, onChangePassword, onLogout }) {
  const done = !!profile;
  const name = profile?.name || "Tonald Drump";
  const contact = [{ label: email, icon: "mail" }, ...(profile?.address ? [{ label: profile.address, icon: "shield" }] : [])];
  const todo = (what) => () => console.log("Open", what); // replace with navigation

  return (
    <main className="app profile-page">
      <header className="ph">
        <button type="button" className="back" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>My Profile</h1>
      </header>

      <div className="pbody">
        <div className={`pavatar${profile?.photo ? " has-photo" : ""}`} aria-hidden="true">
          {profile?.photo ? (
            <img src={profile.photo} alt="" />
          ) : (
            <span>
              <i /><i />
              <b />
            </span>
          )}
        </div>

        <p className="pname">
          {name}
          <svg viewBox="0 0 24 24" width="1.15em" height="1.15em" aria-label="Verified">
            <path d="m12 1.5 2.4 1.8 3-.2 1.1 2.8 2.6 1.5-.7 2.9 1.3 2.7-1.9 2.4-.2 3-2.9.9-1.8 2.5L12 20.5l-2.9 1.5-1.8-2.5-2.9-.9-.2-3L2.3 12.4l1.3-2.7-.7-2.9 2.6-1.5 1.1-2.8 3 .2z" fill="#7c5cfa" transform="translate(0 .5) scale(.96)" />
            <path d="m8 12.2 2.8 2.8 5.2-5.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
        {done ? (
          profile.position && <p className="ppos">{profile.position}</p>
        ) : (
          <p className="pmail">{email}</p>
        )}

        {achievements.length ? <Achievements items={achievements} /> : done && <Group title="CONTACT" items={contact} />}
        <Group
          title="ACCOUNT"
          items={[
            { label: done ? "Personal Data" : "My Work Profile", icon: "person", onClick: onWorkProfile },
            { label: "Office Assets", icon: "folder", onClick: onOfficeAssets || todo("office assets") },
            { label: "Payroll & Tax", icon: "payroll", onClick: onPayroll || todo("payroll") },
            ...(done ? [] : [{ label: "Roles", icon: "crown", onClick: todo("roles") }]),
          ]}
        />
        <Group
          title="SETTINGS"
          items={[
            { label: "Change Password", icon: "gear", onClick: onChangePassword || todo("change password") },
            { label: "Versioning", icon: "code", onClick: todo("versioning") },
            { label: "FAQ and Help", icon: "faq", onClick: todo("faq") },
            { label: "Logout", icon: "logout", onClick: onLogout },
          ]}
        />
      </div>
    </main>
  );
}
