import { useState } from "react";
import { Ic } from "./WorkProfile.jsx";
import ResultSheet from "./ResultSheet.jsx";
import { payrollPdf, downloadBytes } from "./pdf.js";
import { paidDate, total, usd } from "./PayrollTax.jsx";

const ClockIcon = () => <Ic><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="M12 7.5V12l3 2" stroke="#fff" /></Ic>;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function PayrollDetail({ item, onBack }) {
  const [saved, setSaved] = useState(false);
  const rows = [
    ["Basic Salary", usd(item.basic)],
    ["Tax", `${usd(item.tax)}-`, "neg"],
    ["Reimbursement", `${usd(item.reimbursement)}+`, "pos"],
    ["Bonus", `${usd(item.bonus)}+`, "pos"],
    ["Overtime", usd(item.overtime)],
  ];

  const save = () => {
    const [y, m] = item.paidOn.split("-").map(Number);
    try {
      const bytes = payrollPdf({
        title: "Payroll and Tax",
        month: `${MONTHS[m - 1]} ${y}`,
        period: `${paidDate(item.periodStart)} - ${paidDate(item.paidOn)}`,
        hours: { overtime: item.overtimeHours, period: item.periodHours },
        rows,
        total: usd(total(item)),
      });
      downloadBytes(bytes, `payroll-${item.paidOn}.pdf`);
      setSaved(true);
    } catch (err) {
      console.error("Could not create the PDF", err);
      window.print(); // fall back to the browser's print dialog
    }
  };

  return (
    <main className="app wp pd pr prd">
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>Payroll and Tax</h1>
      </header>

      <div className="wp-body">
        <section className="wp-card prd-card">
          <h2>Total Working Hour</h2>
          <p className="wp-sub">Paid Period {paidDate(item.periodStart)} - {paidDate(item.paidOn)}</p>
          <div className="prd-tiles">
            <div className="prd-tile"><span><ClockIcon /> Overtime</span><b>{item.overtimeHours} Hrs</b></div>
            <div className="prd-tile"><span><ClockIcon /> This Pay Period</span><b>{item.periodHours} Hrs</b></div>
          </div>
        </section>

        <section className="wp-card prd-card prd-details">
          <h2>Payroll Details</h2>
          <p className="wp-sub">Details about payroll</p>
          <dl className="prd-rows">
            {rows.map(([k, v, tone]) => (
              <div key={k}><dt>{k}</dt><dd className={tone}>{v}</dd></div>
            ))}
          </dl>
          <dl className="prd-total"><div><dt>Total Salary</dt><dd>{usd(total(item))}</dd></div></dl>
        </section>
      </div>

      <div className="wp-bar">
        <button type="button" className="btn primary" onClick={save}>Save As PDF</button>
      </div>

      {saved && (
        <ResultSheet
          icon="download"
          title="Payroll Saved!"
          text="Your payroll has been successfully saved. You can check it on your device storage."
          action="Close Message"
          onAction={() => setSaved(false)}
        />
      )}
    </main>
  );
}
