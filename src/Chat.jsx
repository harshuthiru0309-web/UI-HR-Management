import { useEffect, useRef, useState } from "react";
import teamPhoto from "./assets/team-photo.jpg";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const Clip = () => <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} aria-hidden="true"><path d="m20 11-8 8a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 17a2 2 0 0 1-3-3l7.5-7.5" /></svg>;
const Cam = () => <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path d="M9 4.5h6l1.3 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h2.700z" fill="currentColor" /><circle cx="12" cy="13" r="3.2" fill="#f1f1f7" /></svg>;
const Mic = () => <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" /><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const Send = () => <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path d="M3.5 11.200 19.800 4.200c.8-.3 1.5.4 1.200 1.200l-7 16.3c-.4.900-1.700.8-1.900-.2l-1.400-6.5-6.5-1.400c-1-.2-1.100-1.5-.2-1.900z" fill="currentColor" /></svg>;


// Photo cropped from your design. Messages can carry any image URL in `image`.
const TEAM_PHOTO = teamPhoto;

// Placeholder conversation. Replace with your API.
const THREADS = {
  1: [
    { from: "them", text: "Hey Tonald, we have to attend our daily stand up", time: "09.10" },
    { from: "me", text: "Sure, when will daily stand up starts?", time: "09.12" },
    { from: "them", text: "It’s around 11.00, in the meeting room", time: "09.13" },
    { from: "them", text: "btw, don’t forget bring the sunday report ya", time: "09.13" },
    { from: "them", text: "See you there!", time: "09.13" },
    { from: "me", text: "Okay Alicia, I'll make sure to attend the daily stand up and make sure everything goes well, and bring the sunday report to you, see you there at 11.00 Alicia!", time: "09.14" },
  ],
  2: [
    { from: "them", text: "Hey Tonald, send me picture of our teamwork for IG post", time: "09.10" },
    { from: "me", text: "Sure, wait, i’ll send you", time: "09.12" },
    { from: "me", image: TEAM_PHOTO, time: "09.12" },
    { from: "them", text: "Thanks Tonald!", time: "09.13" },
    { from: "me", text: "you’re welcome jess!", time: "09.14" },
  ],
};

THREADS[2] = [
  { from: "them", text: "Hey Tonald, send me picture of our teamwork for IG post", time: "09.10" },
  { from: "me", text: "Sure, wait, i’ll send you", time: "09.12" },
  { from: "me", image: "scene" },
  { from: "them", text: "Thanks Tonald!", time: "09.13" },
  { from: "me", text: "you’re welcome jess!", time: "09.14" },
];

// Stand-in picture for the demo thread (swap for a real URL).
function TeamScene() {
  return (
    <svg className="cht-img" viewBox="0 0 234 234" role="img" aria-label="Team working together around a table" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="ch-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9cfc4" /><stop offset="1" stopColor="#efe9e1" /></linearGradient></defs>
      <rect width="234" height="234" fill="url(#ch-wall)" />
      <rect x="170" y="0" width="64" height="120" fill="#f6f1ea" /><rect x="176" y="0" width="4" height="120" fill="#c9bfb3" /><rect x="205" y="0" width="4" height="120" fill="#c9bfb3" />
      <path d="M0 196 62 168h172v66H0z" fill="#e6d6c2" /><path d="M0 196 62 168h172v6H66z" fill="#f3e8d8" />
      <path d="M0 0h96l-8 150H0z" fill="#241f24" opacity=".55" />
      <ellipse cx="70" cy="64" rx="19" ry="22" fill="#f0c9a6" /><path d="M48 62c0-26 14-34 28-34s24 12 22 36c-6-10-12-14-24-14s-20 4-26 12z" fill="#e8c58a" />
      <path d="M36 150c0-34 10-54 36-54s34 18 34 54z" fill="#f4eee8" />
      <ellipse cx="124" cy="66" rx="17" ry="20" fill="#d9a07a" /><path d="M106 60c2-20 12-26 22-26s18 8 16 26c-8-8-14-10-20-10s-12 4-18 10z" fill="#2c211d" />
      <path d="M94 160c0-36 8-58 32-58s34 20 34 58z" fill="#b6b8cf" /><path d="M110 112l8 40M142 112l-8 40" stroke="#8d90ad" strokeWidth="3" />
      <ellipse cx="184" cy="84" rx="17" ry="20" fill="#f2cfae" /><path d="M164 84c-2-22 10-34 22-34s22 12 18 34c-4-12-10-16-20-16s-16 6-20 16z" fill="#7a4a2a" />
      <path d="M156 178c0-36 8-52 28-52s32 18 32 52z" fill="#e9e2ea" /><circle cx="172" cy="150" r="3" fill="#b996c9" /><circle cx="190" cy="160" r="3" fill="#b996c9" /><circle cx="200" cy="144" r="3" fill="#b996c9" />
      <path d="M174 196h58l-6 12h-48z" fill="#c8cacf" />
    </svg>
  );
}

const now = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`; };

export default function Chat({ chat, onBack }) {
  const [messages, setMessages] = useState(() => THREADS[chat?.id] || [{ from: "them", text: chat?.text || "", time: chat?.time || "" }]);
  const [text, setText] = useState("");
  const [kb, setKb] = useState(0);
  const list = useRef(null);
  const fileRef = useRef(null);
  const camRef = useRef(null);
  const file = useRef(null);

  // keep the composer above the on-screen keyboard (iOS reports it through visualViewport)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => { const h = Math.round(window.innerHeight - vv.height - vv.offsetTop); setKb(h > 80 ? h : 0); };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }); }, [messages, kb]);

  const pick = (capture) => {
    if (!file.current) return;
    if (capture) file.current.setAttribute("capture", "environment"); else file.current.removeAttribute("capture");
    file.current.click();
  };
  const onFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !f.type.startsWith("image/")) return;
    setMessages((m) => [...m, { from: "me", image: URL.createObjectURL(f), time: now() }]); // upload it with your API
  };

  const sendImages = (e) => {
    const files = [...(e.target.files || [])].filter((f) => f.type.startsWith("image/"));
    e.target.value = "";
    if (!files.length) return;
    const t = now();
    // replace the object URLs with uploaded URLs from your API
    setMessages((m) => [...m, ...files.map((f) => ({ from: "me", image: URL.createObjectURL(f), time: t }))]);
  };

  const send = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "me", text: t, time: now() }]); // replace with your API / socket call
    setText("");
  };

  return (
    <main className="app chat" style={{ "--kb": `${kb}px` }}>
      <header className="wp-head">
        <button type="button" className="back soft" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <h1>{chat?.name || "Chat"}</h1>
      </header>

      <div className="cht-list" ref={list} role="log" aria-live="polite" aria-label={`Conversation with ${chat?.name || "contact"}`}>
        {messages.map((m, i) => (
          <div key={i} className={`cht-msg ${m.from}${m.image ? " pic" : ""}${messages[i - 1] && messages[i - 1].from !== m.from ? " gap" : ""}`}>
            {m.image ? (m.image === "scene" ? <TeamScene /> : <img className="cht-img" src={m.image} alt="Shared picture" />) : (
              <>
                <p>{m.text}</p>
                <time>{m.time}</time>
              </>
            )}
          </div>
        ))}
      </div>

      <form className="cht-bar" onSubmit={send}>
        <input ref={file} type="file" accept="image/*" hidden onChange={onFile} />
        <div className="cht-field">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." aria-label="Type a message" enterKeyHint="send" autoComplete="off" />
          <button type="button" aria-label="Attach file" onClick={() => pick(false)}><Clip /></button>
          <button type="button" aria-label="Open camera" onClick={() => pick(true)}><Cam /></button>
        </div>
        {text.trim()
          ? <button type="submit" className="cht-round" aria-label="Send message"><Send /></button>
          : <button type="button" className="cht-round" aria-label="Record voice message" onClick={() => console.log("Record")}><Mic /></button>}
      </form>
    </main>
  );
}
