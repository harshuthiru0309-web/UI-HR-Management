const LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

// Placeholder payroll data (newest first). Replace with your API.
const mk = (paidOn) => ({
  paidOn, periodStart: paidOn.slice(0, 8) + "01", hours: "40:00:00",
  periodHours: "40:00", overtimeHours: "00:00",
  basic: 700, tax: 70, reimbursement: 70, bonus: 100, overtime: 0,
});
const DEMO = ["2024-09-30", "2024-08-30", "2024-07-30", "2024-06-30", "2024-05-30", "2024-04-30"].map(mk);

export const total = (p) => p.basic - p.tax + p.reimbursement + p.bonus + p.overtime;

const parts = (iso) => { const [y, m, d] = iso.split("-").map(Number); return { y, m: m - 1, d }; };
const monthTitle = (iso) => { const { y, m } = parts(iso); return `${LONG[m]} ${y}`; };
export const paidDate = (iso) => { const { y, m, d } = parts(iso); return `${d} ${SHORT[m]} ${y}`; };
const money = (n) => `$${Number(n).toLocaleString("en-US")}`;
export const usd = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PayrollTax({ items = DEMO, onBack, onSelect }) {
  return (
    <main className="app wp pd pr">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Payroll and Tax</h1>
      </header>

      <div className="wp-body">
        {items.map((p) => (
          <section
            className="wp-card pr-card"
            key={p.paidOn}
            role="button"
            tabIndex={0}
            aria-label={`${monthTitle(p.paidOn)}, view payroll details`}
            onClick={() => onSelect?.(p)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(p); } }}
          >
            <h2>{monthTitle(p.paidOn)}</h2>
            <dl className="pr-box">
              <div><dt>Total Hours</dt><dd>{p.hours} hrs</dd></div>
              <div><dt>Received</dt><dd>{money(p.received ?? total(p))}</dd></div>
              <div><dt>Paid On</dt><dd>{paidDate(p.paidOn)}</dd></div>
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
