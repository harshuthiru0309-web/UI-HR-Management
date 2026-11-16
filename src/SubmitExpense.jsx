import { useEffect, useRef, useState } from "react";
import OptionSheet from "./OptionSheet.jsx";
import ConfirmSheet from "./ConfirmSheet.jsx";
import ResultSheet from "./ResultSheet.jsx";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const Ic = ({ children }) => <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} aria-hidden="true">{children}</svg>;
const CategoryIcon = () => <Ic><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="currentColor" stroke="none" /><path d="M8 10h6M8 14h4" stroke="#fff" /><circle cx="17.5" cy="6.5" r="2.8" fill="#ff5a4f" stroke="#fff" strokeWidth="1.2" /></Ic>;
const CalendarIcon = () => <Ic><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></Ic>;
const WalletIcon = () => <Ic><rect x="2.5" y="5" width="19" height="14" rx="3.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="2.6" fill="#fff" stroke="none" /><circle cx="6.5" cy="12" r="1" fill="#fff" stroke="none" /><circle cx="17.5" cy="12" r="1" fill="#fff" stroke="none" /></Ic>;
const ClipIcon = () => <Ic><path d="M14.5 7.5 8.5 13.5a2.1 2.1 0 0 0 3 3l6-6a3.8 3.8 0 0 0-5.4-5.4l-6.2 6.2a5.5 5.5 0 0 0 7.8 7.8l5.4-5.4" /></Ic>;
const Chevron = () => <Ic><path d="m6 9 6 6 6-6" /></Ic>;

const CATEGORIES = [
  "Business Trip",
  "Office Supplies",
  "Meals and Entertainment",
  "Professional Development",
  "Home Office Expenses",
  "Mileage Reimbursement",
  "Miscellaneous Expenses",
];
const OK_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;

const formatDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

function Faces() {
  const card = (x, rot, bg, children, z = 0) => (
    <g transform={`translate(${x} 0) rotate(${rot} 40 80)`} style={{ zIndex: z }}>
      <rect width="80" height="84" rx="12" fill={bg} />
      {children}
    </g>
  );
  return (
    <svg className="faces" viewBox="0 0 240 70" aria-hidden="true">
      <g transform="translate(0 -14)">
        {card(8, -8, "#f4c98c", <>
          <path d="M18 44c0-22 10-30 22-30s22 8 22 30z" fill="#3b2a2a" />
          <circle cx="40" cy="42" r="15" fill="#ffe0c2" /><circle cx="34" cy="42" r="1.8" fill="#3b2a2a" /><circle cx="46" cy="42" r="1.8" fill="#3b2a2a" />
          <path d="M36 48q4 3 8 0" stroke="#c46a5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>)}
        {card(156, 8, "#fbe9c8", <>
          <circle cx="40" cy="40" r="19" fill="#f08a3c" />
          <circle cx="40" cy="44" r="14" fill="#ffe0c2" />
          <circle cx="34" cy="44" r="4.5" fill="none" stroke="#7a4a2a" strokeWidth="1.5" /><circle cx="46" cy="44" r="4.5" fill="none" stroke="#7a4a2a" strokeWidth="1.5" />
        </>)}
        {card(80, 0, "#f58fb0", <>
          <path d="M14 34h52l-6-12H20z" fill="#9a5a2a" /><rect x="22" y="14" width="36" height="14" rx="5" fill="#b9732f" />
          <path d="m40 6 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill="#ffd54a" />
          <circle cx="40" cy="46" r="15" fill="#ffe0c2" /><circle cx="34" cy="46" r="1.8" fill="#3b2a2a" /><circle cx="46" cy="46" r="1.8" fill="#3b2a2a" />
          <path d="M36 52q4 3 8 0" stroke="#c46a5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>, 2)}
      </g>
    </svg>
  );
}

export default function SubmitExpense({ onBack, onSubmit, onViewHistory }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [picker, setPicker] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const pending = useRef(null);
  const [progress, setProgress] = useState(null); // null when no upload is running
  const [preview, setPreview] = useState("");
  const timer = useRef(null);
  const previewUrl = useRef("");

  useEffect(() => () => { clearInterval(timer.current); if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); }, []);

  const setPrev = (url) => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = url;
    setPreview(url);
  };
  const input = useRef(null);
  const dateRef = useRef(null);

  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) return setFileError("Use a .pdf, .jpeg or .png file.");
    if (f.size > MAX_BYTES) return setFileError("The file must be smaller than 5MB.");
    setFileError("");
    startUpload(f);
  };

  // Stand-in for a real upload. Replace the interval with your API call and report its progress.
  const startUpload = (f) => {
    clearInterval(timer.current);
    setFile(null);
    setPrev("");
    setProgress(0);
    let p = 0;
    timer.current = setInterval(() => {
      p = Math.min(100, p + 6 + Math.random() * 10);
      setProgress(Math.round(p));
      if (p >= 100) {
        clearInterval(timer.current);
        setPrev(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
        setFile(f);
        setProgress(null);
      }
    }, 140);
  };

  const clearFile = () => {
    clearInterval(timer.current);
    setProgress(null);
    setFile(null);
    setPrev("");
    setFileError("");
  };

  const uploading = progress !== null;
  const ready = category && date && Number(amount) > 0 && !uploading;

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    pending.current = { category, date, amount: Number(amount), description: desc.trim(), file };
    setConfirm(true);
  };

  return (
    <main className="app wp sexp">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Submit Expense</h1>
      </header>

      <form id="exp-form" className="wp-body" onSubmit={submit}>
        <section className="promo">
          <h2>Ensure All Document Well Prepared</h2>
          <p>1000+ Expenses already approved</p>
          <Faces />
        </section>

        <section className="wp-card">
          <h2>Fill Claim Information</h2>
          <p className="wp-sub">Information about claim details</p>

          <div className="claim-wrap">
            {uploading ? (
              <div className="claim busy" role="status" aria-live="polite">
                <span className="ring2" aria-hidden="true">
                  <svg viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="#e3dcfb" strokeWidth="3.5" />
                    <circle cx="30" cy="30" r="26" fill="none" stroke="#7c5cfa" strokeWidth="3.5" strokeLinecap="round" pathLength="100" strokeDasharray={`${progress} 100`} transform="rotate(-90 30 30)" />
                  </svg>
                  <b>{progress}%</b>
                </span>
                <small>Uploading File...</small>
              </div>
            ) : (
              <button type="button" className={`claim${file ? " has" : ""}${preview ? " img" : ""}`} onClick={() => input.current?.click()} aria-label={file ? `Replace document ${file.name}` : "Upload claim document"}>
                {preview && <img src={preview} alt="Claim document preview" />}
                {!preview && <span className="clip"><ClipIcon /></span>}
                {preview ? null : file ? (
                  <>
                    <b>{file.name}</b>
                    <small>Tap to replace the document</small>
                  </>
                ) : (
                  <>
                    <b>Upload Claim Document</b>
                    <small>Format should be in .pdf .jpeg .png less than 5MB</small>
                  </>
                )}
              </button>
            )}
            {(uploading || file) && (
              <button type="button" className="rm claim-rm" onClick={clearFile} aria-label={uploading ? "Cancel upload" : "Remove document"}>
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
              </button>
            )}
          </div>
          <input ref={input} type="file" accept=".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png" hidden onChange={pick} />
          {fileError && <p className="error" role="alert">{fileError}</p>}

          <div className="field wp-field">
            <label htmlFor="category">Expense Category</label>
            <button type="button" id="category" className="control pick" onClick={() => setPicker(true)} aria-haspopup="dialog">
              <span className="lead"><CategoryIcon /></span>
              <span className={`pick-val${category ? "" : " ph"}`}>{category || "Select Category"}</span>
              <span className="trail"><Chevron /></span>
            </button>
          </div>

          <div className="field wp-field">
            <label htmlFor="tdate">Transaction Date</label>
            <div className="control">
              <span className="lead"><CalendarIcon /></span>
              <div className="dob" onClick={() => dateRef.current?.showPicker?.()}>
                <span className={`fake-ph${date ? " val" : ""}`}>{date ? formatDate(date) : "Enter Transaction Date"}</span>
                <input ref={dateRef} id="tdate" type="date" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
              </div>
              <span className="trail"><Chevron /></span>
            </div>
          </div>

          <div className="field wp-field">
            <label htmlFor="amount">Expense Amount ($USD)</label>
            <div className="control">
              <span className="lead"><WalletIcon /></span>
              <input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))} placeholder="Enter Amount" />
            </div>
          </div>

          <div className="field wp-field">
            <label htmlFor="edesc">Expense Description</label>
            <textarea id="edesc" className="ta" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter Expense Description" rows={4} maxLength={1000} />
          </div>
        </section>
      </form>

      {confirm && (
        <ConfirmSheet
          icon="receipt"
          center
          title="Ready to Submit?"
          text="Double-check your expense details to ensure everything is correct. Do you want to proceed?"
          yes="Yes, Submit"
          no="No, Let me check"
          onYes={() => { setConfirm(false); onSubmit?.(pending.current); setDone(true); }}
          onNo={() => setConfirm(false)}
        />
      )}

      {done && (
        <ResultSheet
          icon="receipt"
          center
          title="Expense Submitted!"
          text="Your expense report is in! You’ll receive your reimbursement with your payroll."
          action="View Expense History"
          onAction={onViewHistory}
        />
      )}

      {picker && (
        <OptionSheet
          title="Expense Category"
          subtitle="Select Expense Category"
          options={CATEGORIES}
          value={category}
          onSelect={(v) => { setCategory(v); setPicker(false); }}
          onCancel={() => setPicker(false)}
        />
      )}

      <div className="wp-bar">
        <button type="submit" form="exp-form" className="btn primary" disabled={!ready}>Submit Expense</button>
      </div>
    </main>
  );
}
