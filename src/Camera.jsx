import { useEffect, useRef, useState } from "react";

const Bolt = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M13.5 2.5 5.5 13.5h5.5L9.5 21.5l8-11H12z" /></svg>
);
const Close = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
);

export default function Camera({ onCapture, onClose }) {
  const video = useRef(null);
  const stream = useRef(null);
  const fallback = useRef(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
        if (!live) return s.getTracks().forEach((t) => t.stop());
        stream.current = s;
        if (video.current) video.current.srcObject = s;
      } catch {
        setError("We couldn’t open the camera. Allow camera access, or choose a photo instead.");
      }
    })();
    return () => {
      live = false;
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggleFlash = async () => {
    const next = !flash;
    setFlash(next);
    try {
      // Only some devices expose a torch on the active camera; ignore the rest.
      await stream.current?.getVideoTracks()[0]?.applyConstraints({ advanced: [{ torch: next }] });
    } catch { /* not supported */ }
  };

  const snap = () => {
    const v = video.current;
    if (!v?.videoWidth) return;
    const sw = v.videoWidth / zoom;
    const sh = v.videoHeight / zoom;
    const c = document.createElement("canvas");
    c.width = sw;
    c.height = sh;
    c.getContext("2d").drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, sw, sh);
    c.toBlob((blob) => blob && onCapture?.(new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" })), "image/jpeg", 0.92);
  };

  return (
    <main className="app cam-page">
      <header className="cam-top">
        <button type="button" className="cam-round ghost" onClick={toggleFlash} aria-label="Flash" aria-pressed={flash}><Bolt /></button>
        <h1>Camera</h1>
        <button type="button" className="cam-x" onClick={onClose} aria-label="Close camera"><Close /></button>
      </header>

      <section className="cam-view">
        <video ref={video} autoPlay playsInline muted style={{ transform: `scaleX(-1) scale(${zoom})` }} />
        {error && (
          <div className="cam-error" role="alert">
            <p>{error}</p>
            <input ref={fallback} type="file" accept="image/*" capture="user" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onCapture?.(f); }} />
            <button type="button" className="btn primary" onClick={() => fallback.current?.click()}>Choose a photo</button>
          </div>
        )}

        <div className="cam-controls">
          <button type="button" className="cam-round" onClick={() => setZoom((z) => (z === 1 ? 2 : 1))} aria-label={`Zoom ${zoom === 1 ? "2x" : "1x"}`}>{zoom === 1 ? "2x" : "1x"}</button>
          <button type="button" className="shutter" onClick={snap} aria-label="Take photo" disabled={!!error}><span /></button>
          <button type="button" className="cam-round" onClick={toggleFlash} aria-label="Flash" aria-pressed={flash}><Bolt /></button>
        </div>
      </section>
    </main>
  );
}
