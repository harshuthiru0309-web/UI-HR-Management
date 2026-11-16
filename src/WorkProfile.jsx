import { useRef, useState } from "react";
import UpdateSheet from "./UpdateSheet.jsx";
import UpdatedSheet from "./UpdatedSheet.jsx";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
export const Ic = ({ children }) => <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} aria-hidden="true">{children}</svg>;

export const PersonIcon = () => <Ic><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c.8-4 3.8-5.8 7.5-5.8s6.7 1.8 7.5 5.8" /></Ic>;
export const CalendarIcon = () => <Ic><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></Ic>;
export const PositionIcon = () => <Ic><rect x="3" y="5" width="18" height="14" rx="3.5" /><path d="M7 10h10M7 14h6" /></Ic>;
export const Chevron = () => <Ic><path d="m6 9 6 6 6-6" /></Ic>;
const ImageIcon = () => <Ic><rect x="3.5" y="4.5" width="17" height="15" rx="3.5" /><circle cx="9" cy="10" r="1.6" /><path d="m4 17 5-4.5 3.5 3L15 13l5 4.5" /></Ic>;
const ReplaceIcon = () => <Ic><path d="M20 11a8 8 0 0 0-14-4.5L4 9m0-5v5h5M4 13a8 8 0 0 0 14 4.5L20 15m0 5v-5h-5" /></Ic>;
const UploadIcon = () => <Ic><path d="M12 15V4m0 0L8 8m4-4 4 4M5 14v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3" /></Ic>;

export const POSITIONS = ["Junior Full Stack Developer", "Software Engineer", "Product Designer", "Product Manager", "QA Engineer", "Data Analyst", "HR Specialist"];
export const formatDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};
const MAX_BYTES = 5 * 1024 * 1024;

export function Field({ label, id, icon, children }) {
  return (
    <div className="field wp-field">
      <label htmlFor={id}>{label}</label>
      <div className="control">
        <span className="lead">{icon}</span>
        {children}
      </div>
    </div>
  );
}

export function PhotoUpload({ onChange, onError, initial = "" }) {
  const input = useRef(null);
  const [preview, setPreview] = useState(initial);
  const owned = useRef(new Set()); // only revoke object URLs created here
  const [error, setError] = useState("");

  const fail = (msg) => { setError(msg); onError?.(msg); };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) return fail("Use a .jpeg or .png image.");
    if (file.size > MAX_BYTES) return fail("The image must be smaller than 5MB.");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width < 800 || img.height < 800) {
        URL.revokeObjectURL(url);
        return fail("The image must be at least 800×800px.");
      }
      setError("");
      owned.current.add(url);
      setPreview((old) => { if (old && owned.current.has(old)) { URL.revokeObjectURL(old); owned.current.delete(old); } return url; });
      onChange?.(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); fail("That file couldn’t be read as an image."); };
    img.src = url;
  };

  return (
    <div className="upload">
      <div className={`drop${preview ? " filled" : ""}`}>
        {preview ? <img src={preview} alt="Profile preview" /> : <span className="ph-icon"><ImageIcon /></span>}
        <button type="button" className="up-btn" onClick={() => input.current?.click()} aria-label={preview ? "Replace photo" : "Upload photo"}>
          {preview ? <ReplaceIcon /> : <UploadIcon />}
        </button>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png" hidden onChange={onFile} />
      <p className="up-title">Upload Photo</p>
      <p className="up-hint">Format should be in .jpeg .png atleast<br />800×800px and less than 5MB</p>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}

export default function WorkProfile({ firstName = "Tonald", lastName = "Drump", onBack, onVisitProfile }) {
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState("");
  const dobRef = useRef(null);
  const pending = useRef(null);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [photo, setPhoto] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    pending.current = {
      ...f,
      photo,
      name: `${f.firstName || firstName} ${f.lastName || lastName}`.trim(),
      address: [f.street, f.city, f.zip].filter(Boolean).join(", "),
    };
    setConfirm(true);
  };

  const update = () => {
    console.log("Update profile", pending.current); // replace with your API call
    setConfirm(false);
    setDone(true);
  };

  return (
    <main className="app wp">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>My Work Profile</h1>
      </header>

      <form id="wp-form" className="wp-body" onSubmit={submit}>
        <section className="wp-card">
          <h2>Personal Data Information</h2>
          <p className="wp-sub">Your personal data information</p>

          <PhotoUpload onChange={setPhoto} />

          <Field label="First Name" id="firstName" icon={<PersonIcon />}>
            <input id="firstName" name="firstName" placeholder={firstName} autoComplete="given-name" />
          </Field>
          <Field label="Last Name" id="lastName" icon={<PersonIcon />}>
            <input id="lastName" name="lastName" placeholder={lastName} autoComplete="family-name" />
          </Field>

          <Field label="Date of Birth" id="dob" icon={<CalendarIcon />}>
            <div className="dob" onClick={() => dobRef.current?.showPicker?.()}>
              <span className={`fake-ph${dob ? " val" : ""}`}>{dob ? formatDate(dob) : "Date of Birth"}</span>
              <input
                ref={dobRef}
                id="dob"
                name="dob"
                type="date"
                value={dob}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDob(e.target.value)}
                autoComplete="bday"
              />
            </div>
            <span className="trail"><Chevron /></span>
          </Field>

          <Field label="Position" id="position" icon={<PositionIcon />}>
            <select id="position" name="position" value={position} onChange={(e) => setPosition(e.target.value)} className={position ? "" : "empty"}>
              <option value="" disabled>Select Position</option>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <span className="trail"><Chevron /></span>
          </Field>
        </section>

        <section className="wp-card">
          <h2>Address</h2>
          <p className="wp-sub">Your current domicile</p>
          <div className="field wp-field">
            <label htmlFor="street">Street Address</label>
            <div className="control"><input id="street" name="street" placeholder="Enter Street Address" autoComplete="street-address" /></div>
          </div>
          <div className="field wp-field">
            <label htmlFor="city">City</label>
            <div className="control"><input id="city" name="city" placeholder="Enter City" autoComplete="address-level2" /></div>
          </div>
          <div className="field wp-field">
            <label htmlFor="zip">Postal Code</label>
            <div className="control"><input id="zip" name="zip" inputMode="numeric" placeholder="Enter Postal Code" autoComplete="postal-code" /></div>
          </div>
        </section>
      </form>

      <div className="wp-bar">
        <button type="submit" form="wp-form" className="btn primary">Update Profile</button>
      </div>

      {done && <UpdatedSheet onVisit={() => onVisitProfile?.(pending.current)} />}
      {confirm && <UpdateSheet onConfirm={update} onCancel={() => setConfirm(false)} />}
    </main>
  );
}
