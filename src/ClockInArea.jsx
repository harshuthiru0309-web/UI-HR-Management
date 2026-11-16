import { Wings } from "./Art.jsx";

function MapArt() {
  return (
    <svg className="map" viewBox="0 0 390 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="390" height="420" fill="#ececef" />
      {/* blocks */}
      <g fill="#e1e1e6">
        <rect x="-10" y="40" width="70" height="90" rx="4" /><rect x="296" y="70" width="110" height="80" rx="4" />
        <rect x="20" y="250" width="120" height="70" rx="4" /><rect x="250" y="230" width="140" height="90" rx="4" />
        <rect x="170" y="330" width="90" height="60" rx="4" />
      </g>
      <path d="M232 80c20-30 60-20 70 10s-10 60-40 70-40-10-30-80z" fill="#dfe8df" />
      <path d="M0 330c80-30 140-10 200-40s120-10 190-40" fill="none" stroke="#dfe3ea" strokeWidth="18" />
      {/* roads */}
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M-10 120 400 60" strokeWidth="9" /><path d="M-10 300 400 360" strokeWidth="10" />
        <path d="M60 -10 100 430" strokeWidth="8" /><path d="M200 -10 230 430" strokeWidth="7" />
        <path d="M330 -10 300 430" strokeWidth="9" /><path d="M-10 200 400 230" strokeWidth="6" />
        <path d="M140 140 190 330" strokeWidth="5" /><path d="M260 20 350 300" strokeWidth="5" />
      </g>
      <g fontFamily="Roboto, system-ui, sans-serif" fill="#7a7a86" fontSize="15" fontWeight="500">
        <text x="82" y="42" transform="rotate(8 82 42)">Jalan Veteran</text>
        <text x="208" y="96">Masjid Istiqlal</text>
        <text x="48" y="388">Jalan Kebon Sirih</text>
        <text x="-6" y="132" fontSize="13" transform="rotate(-8 -6 132)">m Taman</text>
        <text x="-6" y="154" fontSize="13">asasti</text>
      </g>
    </svg>
  );
}

const shield = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path d="M12 2.5 20 5.5v5.8c0 4.6-3.3 8.2-8 10.2-4.7-2-8-5.6-8-10.2V5.5z" fill="#7c5cfa" />
    <path d="m8.5 12 2.7 2.7 4.5-4.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ClockInArea({
  name = "Tonald Drump",
  photo,
  inArea = true,
  lat = "45.43534",
  long = "97897.576",
  clockIn = "09:00",
  clockOut = "05:00",
  onBack,
  onOpenCamera,
}) {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="app area">
      <section className="map-wrap">
        <MapArt />
        <div className="fence" aria-hidden="true">
          <span className="pin">{photo ? <img src={photo} alt="" /> : <i />}</span>
        </div>
        <header className="area-head">
          <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          </button>
          <h1>Clock In Area</h1>
        </header>
      </section>

      <div className="area-sheet">
        <section className={`area-banner${inArea ? "" : " out"}`} role="status">
          <div>
            <h2>{inArea ? "You are in the clock-in area!" : "You are outside the clock-in area"}</h2>
            <p>{inArea ? "Now you can press clock in in this area" : "Move closer to the office to clock in"}</p>
          </div>
          <Wings />
        </section>

        <h3 className="cap">MY PROFILE</h3>
        <section className="me">
          <div className="me-photo">{photo ? <img src={photo} alt="" /> : <i />}</div>
          <div>
            <p className="me-name">
              {name}
              <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-label="Verified">
                <path d="m12 1.5 2.4 1.8 3-.2 1.1 2.8 2.6 1.5-.7 2.9 1.3 2.7-1.9 2.4-.2 3-2.9.9-1.8 2.5L12 20.5l-2.9 1.5-1.8-2.5-2.9-.9-.2-3L2.3 12.4l1.3-2.7-.7-2.9 2.6-1.5 1.1-2.8 3 .2z" fill="#7c5cfa" transform="translate(0 .5) scale(.96)" />
                <path d="m8 12.2 2.8 2.8 5.2-5.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
            <p className="me-date">{today}</p>
            <p className="me-loc"><span>{shield}</span> Lat {lat} Long {long}</p>
          </div>
        </section>

        <h3 className="cap">SCHEDULE</h3>
        <div className="sched">
          <div><small>CLOCK IN</small><b>{clockIn}</b></div>
          <div><small>CLOCK OUT</small><b>{clockOut}</b></div>
        </div>
      </div>

      <div className="create-bar solo">
        <button type="button" className="btn primary" disabled={!inArea} onClick={onOpenCamera}>Selfie To Clock In</button>
      </div>
    </main>
  );
}
