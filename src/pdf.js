// Minimal single-page PDF writer (Helvetica, ASCII text only) – no dependencies.
const esc = (s) => String(s).replace(/[^\x20-\x7e]/g, "?").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const W = { ".": 278, ",": 278, "+": 584, "-": 333, " ": 278 };
const width = (s, size) => [...String(s)].reduce((n, c) => n + (W[c] ?? 556), 0) * size / 1000;
const rgb = ([r, g, b]) => `${r} ${g} ${b}`;

export function payrollPdf({ title, period, month, hours, rows, total }) {
  const ink = [0.07, 0.09, 0.15], muted = [0.42, 0.44, 0.52], rule = [0.88, 0.89, 0.93];
  const RED = [1, 0.35, 0.31], GREEN = [0.07, 0.72, 0.42];
  const out = [];
  const text = (x, y, size, bold, str, c = ink) => out.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${rgb(c)} rg ${x.toFixed(1)} ${y.toFixed(1)} Td (${esc(str)}) Tj ET`);
  const right = (xr, y, size, bold, str, c) => text(xr - width(str, size), y, size, bold, str, c);
  const line = (y, c = rule) => out.push(`${rgb(c)} RG 0.8 w 50 ${y} m 545 ${y} l S`);

  let y = 780;
  text(50, y, 22, true, title); y -= 22;
  text(50, y, 12, false, month, muted); y -= 34;

  text(50, y, 14, true, "Total Working Hour"); y -= 18;
  text(50, y, 10.5, false, `Paid Period ${period}`, muted); y -= 26;
  text(50, y, 11, false, "Overtime", muted); text(300, y, 11, false, "This Pay Period", muted); y -= 22;
  text(50, y, 18, true, `${hours.overtime} Hrs`); text(300, y, 18, true, `${hours.period} Hrs`); y -= 36;

  text(50, y, 14, true, "Payroll Details"); y -= 18;
  text(50, y, 10.5, false, "Details about payroll", muted); y -= 14;
  line(y); y -= 26;
  for (const [label, value, tone] of rows) {
    text(50, y, 12, false, label);
    right(545, y, 12, true, value, tone === "neg" ? RED : tone === "pos" ? GREEN : ink);
    y -= 28;
  }
  line(y + 10); y -= 18;
  text(50, y, 16, true, "Total Salary"); right(545, y, 16, true, total);

  const content = out.join("\n");
  const objs = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 4 0 R/F2 5 0 R>>>>/Contents 6 0 R>>",
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>",
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>",
    `<</Length ${content.length}>>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = objs.map((o, i) => { const at = pdf.length; pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; return at; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => { pdf += `${String(o).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

export function downloadBytes(bytes, name, type = "application/pdf") {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
