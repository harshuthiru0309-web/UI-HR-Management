import { useEffect, useRef, useState } from "react";

export default function OptionSheet({ title, subtitle, options, value, onSelect, onCancel }) {
  const [draft, setDraft] = useState(value || "");
  const first = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  return (
    <div className="scrim blur" onClick={onCancel}>
      <section className="sheet picker" role="dialog" aria-modal="true" aria-labelledby="pick-title" onClick={(e) => e.stopPropagation()}>
        <div className="pick-head">
          <h2 id="pick-title">{title}</h2>
          {subtitle && <p className="pick-sub">{subtitle}</p>}
        </div>

        <div className="opts" role="radiogroup" aria-labelledby="pick-title">
          {options.map((o, i) => (
            <button
              key={o}
              ref={i === 0 ? first : null}
              type="button"
              role="radio"
              aria-checked={draft === o}
              className={`opt${draft === o ? " on" : ""}`}
              onClick={() => setDraft(o)}
            >
              <span>{o}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="pick-actions">
          <button type="button" className="btn outline" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn primary" disabled={!draft} onClick={() => onSelect(draft)}>Select</button>
        </div>
      </section>
    </div>
  );
}
