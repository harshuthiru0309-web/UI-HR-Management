import { useRef, useState } from "react";
import UpdateSheet from "./UpdateSheet.jsx";
import UpdatedSheet from "./UpdatedSheet.jsx";
import { Ic, Field, PhotoUpload, PersonIcon, CalendarIcon, PositionIcon, Chevron, POSITIONS, formatDate } from "./WorkProfile.jsx";

const ShieldIcon = () => <Ic><path d="M12 3 19 6v5.5c0 4.3-3 7.7-7 9.5-4-1.8-7-5.2-7-9.5V6z" /><path d="m9 12 2.2 2.2L15 10.4" /></Ic>;

// Placeholder location data. Replace with your API.
const PLACES = {
  Indonesia: {
    "DKI Jakarta": ["Jakarta Selatan", "Jakarta Pusat", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"],
    "West Java": ["Bandung", "Bekasi", "Bogor", "Depok"],
    "East Java": ["Surabaya", "Malang", "Sidoarjo"],
  },
  Malaysia: { Selangor: ["Shah Alam", "Petaling Jaya"], "Kuala Lumpur": ["Kuala Lumpur"] },
  Singapore: { Singapore: ["Singapore"] },
};
const first = (o) => Object.keys(o)[0];

function Select({ id, label, icon, value, onChange, options, name }) {
  return (
    <Field label={label} id={id} icon={icon}>
      <select id={id} name={name} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="trail"><Chevron /></span>
    </Field>
  );
}

export default function PersonalData({ profile, onBack, onVisitProfile }) {
  const [fn0, ...rest] = (profile?.name || "").split(" ");
  const [photo, setPhoto] = useState(profile?.photo || "");
  const [dob, setDob] = useState(profile?.dob || "");
  const [position, setPosition] = useState(profile?.position || "");
  const [country, setCountry] = useState(profile?.country || "Indonesia");
  const [state, setState] = useState(profile?.state || "DKI Jakarta");
  const [city, setCity] = useState(profile?.city || "Jakarta Selatan");
  const dobRef = useRef(null);
  const pending = useRef(null);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const states = PLACES[country] || {};
  const cities = states[state] || [];

  const pickCountry = (c) => { const st = first(PLACES[c]); setCountry(c); setState(st); setCity(PLACES[c][st][0]); };
  const pickState = (st) => { setState(st); setCity(states[st][0]); };

  const submit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const firstName = String(f.firstName).trim();
    const lastName = String(f.lastName).trim();
    pending.current = {
      ...profile,
      firstName, lastName, name: `${firstName} ${lastName}`.trim(),
      dob, position, country, state, city, photo,
      address: String(f.address).trim(),
    };
    setConfirm(true);
  };

  const update = () => {
    console.log("Update personal data", pending.current); // replace with your API call
    setConfirm(false);
    setDone(true);
  };

  return (
    <main className="app wp pd">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Personal Data</h1>
      </header>

      <form id="pd-form" className="wp-body" onSubmit={submit}>
        <section className="wp-card">
          <h2>My Personal Data</h2>
          <p className="wp-sub">Details about my personal data</p>

          <PhotoUpload initial={photo} onChange={setPhoto} />

          <Field label="First Name" id="pd-first" icon={<PersonIcon />}>
            <input id="pd-first" name="firstName" defaultValue={profile?.firstName || fn0 || ""} placeholder="First Name" autoComplete="given-name" required />
          </Field>
          <Field label="Last Name" id="pd-last" icon={<PersonIcon />}>
            <input id="pd-last" name="lastName" defaultValue={profile?.lastName || rest.join(" ")} placeholder="Last Name" autoComplete="family-name" required />
          </Field>

          <Field label="Date of Birth" id="pd-dob" icon={<CalendarIcon />}>
            <div className="dob" onClick={() => dobRef.current?.showPicker?.()}>
              <span className={`fake-ph${dob ? " val" : ""}`}>{dob ? formatDate(dob) : "Date of Birth"}</span>
              <input ref={dobRef} id="pd-dob" name="dob" type="date" value={dob} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDob(e.target.value)} autoComplete="bday" required />
            </div>
            <span className="trail"><Chevron /></span>
          </Field>

          <Field label="Position" id="pd-position" icon={<PositionIcon />}>
            <select id="pd-position" name="position" value={position} onChange={(e) => setPosition(e.target.value)} className={position ? "" : "empty"} required>
              <option value="" disabled>Select Position</option>
              {[...new Set([position, ...POSITIONS].filter(Boolean))].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <span className="trail"><Chevron /></span>
          </Field>
        </section>

        <section className="wp-card">
          <h2>Address</h2>
          <p className="wp-sub">Your current domicile</p>

          <Select id="pd-country" name="country" label="Country" icon={<ShieldIcon />} value={country} onChange={pickCountry} options={Object.keys(PLACES)} />
          <Select id="pd-state" name="state" label="State" icon={<ShieldIcon />} value={state} onChange={pickState} options={Object.keys(states)} />
          <Select id="pd-city" name="city" label="City" icon={<ShieldIcon />} value={city} onChange={setCity} options={cities} />

          <div className="field wp-field">
            <label htmlFor="pd-address">Full Address</label>
            <textarea id="pd-address" name="address" className="ta" rows={5} defaultValue={profile?.address || ""} placeholder="Enter Full Address" autoComplete="street-address" required />
          </div>
        </section>
      </form>

      <div className="wp-bar">
        <button type="submit" form="pd-form" className="btn primary">Update</button>
      </div>

      {done && <UpdatedSheet onVisit={() => onVisitProfile?.(pending.current)} />}
      {confirm && <UpdateSheet onConfirm={update} onCancel={() => setConfirm(false)} />}
    </main>
  );
}
