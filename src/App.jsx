import { useEffect, useState } from "react";
import Onboarding from "./Onboarding.jsx";
import Intro from "./Intro.jsx";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";
import Home from "./Home.jsx";
import Profile from "./Profile.jsx";
import Leaves from "./Leaves.jsx";
import Expenses from "./Expenses.jsx";
import Tasks from "./Tasks.jsx";
import CreateTask from "./CreateTask.jsx";
import BurnoutStats from "./BurnoutStats.jsx";
import TaskDetails from "./TaskDetails.jsx";
import SubmitExpense from "./SubmitExpense.jsx";
import SubmitLeave from "./SubmitLeave.jsx";
import ClockIn from "./ClockIn.jsx";
import Camera from "./Camera.jsx";
import Details from "./Details.jsx";
import SelfieReview, { stamp } from "./SelfieReview.jsx";
import ClockInArea from "./ClockInArea.jsx";
import WorkProfile from "./WorkProfile.jsx";
import PersonalData from "./PersonalData.jsx";
import OfficeAssets from "./OfficeAssets.jsx";
import PayrollTax from "./PayrollTax.jsx";
import PayrollDetail from "./PayrollDetail.jsx";
import ChangePassword from "./ChangePassword.jsx";
import Messages from "./Messages.jsx";
import Chat from "./Chat.jsx";
import Notifications from "./Notifications.jsx";

// Placeholder achievements. Replace with data from your API (an empty list shows the Contact card instead).
const ACHIEVEMENTS = [
  { title: "Probation Slayer", glyph: "diamond", base: "#4cc24a", light: "#c9f5c3" },
  { title: "Junior Of The Month", glyph: "star", base: "#7d86ee", light: "#d6d9fb" },
  { title: "Employee Of The Year", glyph: "sparkle", base: "#ff9d2e", light: "#ffe0b3" },
  { title: "Top Performer", glyph: "gem", base: "#ff4d86", light: "#ffc2d6" },
];

// Placeholder schedule and tasks. Replace with data from your API.
const MEETINGS = [
  { title: "Townhall Meeting", time: "01:30 AM - 02:00 AM", people: 3, extra: 3 },
  { title: "Dashboard Report", time: "01:30 AM - 02:00 AM", people: 3, extra: 0 },
];
const TASKS = [
  { title: "Wiring Dashboard Analytics", status: "In Progress", priority: "High", progress: 88, due: "27 April", comments: 2 },
];

// Placeholder attendance history. Replace with data from your API.
const SAMPLE_DETAIL = { lat: "45.43534", long: "97897.576", stamp: "11/10/24 09:00AM GMT +07:00", notes: "", breakTotal: "01:00:00", breakRange: "12:00 AM — 01:00 PM", photo: null };

const HISTORY_RAW = [
  { date: "27 September 2024", total: "08:00:00", inTime: "09:00 AM", outTime: "05:00 PM", breakTotal: "01:00:00", breakRange: "12:00 AM — 01:00 PM", notes: "", lat: "45.43534", long: "97897.576", stamp: "11/10/24 09:00AM GMT +07:00" },
  { date: "26 September 2024", total: "08:00:00", inTime: "09:00 AM", outTime: "05:00 PM", breakTotal: "01:00:00", breakRange: "12:00 AM — 01:00 PM", notes: "", lat: "45.43534", long: "97897.576", stamp: "11/10/24 09:00AM GMT +07:00" },
  { date: "25 September 2024", total: "08:00:00", inTime: "09:00 AM", outTime: "05:00 PM", breakTotal: "01:00:00", breakRange: "12:00 AM — 01:00 PM", notes: "", lat: "45.43534", long: "97897.576", stamp: "11/10/24 09:00AM GMT +07:00" },
];

const HISTORY = HISTORY_RAW.map((d) => ({ ...SAMPLE_DETAIL, ...d }));

const TASK_LIST = [
  { title: "Wiring Dashboard Analytics", state: "progress", priority: "High", progress: 100, due: "27 Sept", comments: 2 },
  { title: "API Dashboard Analytics Integration", state: "progress", priority: "High", progress: 100, due: "27 Sept", comments: 2 },
  { title: "Create On Boarding Screen", state: "todo", priority: "High", progress: 50, due: "27 Sept", comments: 2, people: 1, createdAt: "27 Sept 2024", member: "Alice - Sr Front End Developer", difficulty: "Very Easy (Less Than a Day)", commentList: [{ author: "Jason", role: "Product Manager", at: "28 Sept 2024 5:53 AM", text: "Dude, how long it will take? any blocker? need the update asap" }, { author: "Alice", role: "Sr Front End Developer", at: "29 Sept 2024 5:53 AM", text: "@Jason still testing, will be push at 04:00 PM" }], description: "Create on boarding page based on pic, pixel perfect, with the user story of i want to know what kind of apps is this so i need to view onboarding screen to leverage my knowledge so that i know what kind of apps is this" },
  { title: "Write Sprint Retrospective", state: "todo", priority: "Low", progress: 0, due: "30 April", comments: 1 },
  { title: "Fix Login Redirect Bug", state: "todo", priority: "High", progress: 0, due: "28 April", comments: 3 },
  { title: "Update Release Notes", state: "todo", priority: "Low", progress: 0, due: "30 April", comments: 0 },
  { title: "Review Pull Requests", state: "todo", priority: "Medium", progress: 0, due: "28 April", comments: 4 },
  { title: "Slicing Dashboard Analytics", state: "done", priority: "High", progress: 100, due: "27 Sept", comments: 2 },
];
const EXPENSES = [
  { id: 1, state: "review", date: "27 September 2024", type: "E-Learning", total: 55 },
  { id: 2, state: "review", date: "24 September 2024", type: "E-Learning", total: 55 },
  { id: 3, state: "review", date: "21 September 2024", type: "Transport", total: 345 },
  { id: 4, state: "approved", date: "18 September 2024", type: "E-Learning", total: 55, decidedAt: "19 Sept 2024", by: "Elaine" },
  { id: 5, state: "approved", date: "14 September 2024", type: "E-Learning", total: 55, decidedAt: "19 Sept 2024", by: "Elaine" },
  { id: 6, state: "rejected", date: "27 September 2024", type: "Business Trip", total: 100, decidedAt: "28 Sept 2024", by: "Elaine" },
  { id: 7, state: "rejected", date: "24 September 2024", type: "Business Trip", total: 100, decidedAt: "28 Sept 2024", by: "Elaine" },
];
const LEAVES = [
  { id: 1, state: "review", requested: "10 November 2024", range: "11 Nov - 13 Nov", days: 2 },
  { id: 2, state: "approved", requested: "18 September 2024", range: "20 Sept - 22 Sept", days: 2, decidedAt: "19 Sept 2024", by: "Elaine" },
  { id: 3, state: "rejected", requested: "21 September 2024", range: "10 Nov - 17 Nov", days: 7, decidedAt: "22 Sept 2024", by: "Elaine" },
];
// Try { level: "Good", extra: 4, pct: 25 } for the green variant.
const BURNOUT = { sprint: "Sprint 20", level: "Poor", extra: 8, pct: 85 };

const pad2 = (n) => String(n).padStart(2, "0");
const hmsOf = (ms) => { const s = Math.floor(ms / 1000); return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}`; };
const timeOf = (t) => new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const dayOf = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Placeholder location. Replace with real geolocation.
const LOCATION = { lat: "45.43534", long: "97897.576" };

const routeFromHash = () => (window.location.hash.replace("#", "") || "intro");

export default function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(null);
  const [payItem, setPayItem] = useState(null);
  const [chatWith, setChatWith] = useState(null);
  const [welcomeSeen, setWelcomeSeen] = useState(false);
  const [clockedSince, setClockedSince] = useState(null);
  const [session, setSession] = useState(null);
  const [created, setCreated] = useState([]);
  const [task, setTask] = useState(null);
  const [claims, setClaims] = useState([]);
  const [leaveReqs, setLeaveReqs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [pendingNotes, setPendingNotes] = useState("");
  const [breakSpan, setBreakSpan] = useState({ first: null, last: null });
  const [detail, setDetail] = useState(null);
  const [breakAt, setBreakAt] = useState(null);
  const [breakMs, setBreakMs] = useState(0);
  const [selfie, setSelfie] = useState(null);
  const setShot = (file) => setSelfie((old) => {
    if (old) URL.revokeObjectURL(old.url);
    return file ? { file, url: URL.createObjectURL(file), takenAt: new Date() } : null;
  });

  useEffect(() => {
    const onChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const go = (r) => { window.location.hash = r; };
  const onTab = (key) => { if (key === "home") go("home"); if (key === "clock") go("clockin"); if (key === "tasks") go("tasks"); if (key === "pay") go("expenses"); if (key === "more") go("leaves"); };

  if (route === "notifications") return <Notifications onBack={() => go("home")} onOpen={(n) => go({ task: "tasks", expense: "expenses", meeting: "home" }[n.kind] || "home")} />;
  if (route === "chat" && chatWith) return <Chat chat={chatWith} onBack={() => go("messages")} />;
  if (route === "messages" || route === "chat") return <Messages onBack={() => go("home")} onOpen={(c) => { setChatWith(c); go("chat"); }} />;
  if (route === "change-password") return <ChangePassword onBack={() => go("profile")} onSubmit={(d) => { console.log("Change password"); /* replace with your API call; return { errors: { current: "Wrong password" } } to show an error */ }} onDone={() => go("profile")} />;
  if (route === "payroll-detail" && payItem) return <PayrollDetail item={payItem} onBack={() => go("payroll")} />;
  if (route === "payroll" || route === "payroll-detail") return <PayrollTax onBack={() => go("profile")} onSelect={(p) => { setPayItem(p); go("payroll-detail"); }} />;
  if (route === "office-assets") return <OfficeAssets onBack={() => go("profile")} />;
  if (route === "work-profile") {
    const visit = (data) => { setProfile(data); go("profile"); };
    return profile
      ? <PersonalData profile={profile} onBack={() => go("profile")} onVisitProfile={visit} />
      : <WorkProfile onBack={() => go("profile")} onVisitProfile={visit} />;
  }
  if (route === "profile") return <Profile email={email || undefined} profile={profile} achievements={profile ? ACHIEVEMENTS : []} onBack={() => go("home")} onWorkProfile={() => go("work-profile")} onOfficeAssets={() => go("office-assets")} onPayroll={() => go("payroll")} onChangePassword={() => go("change-password")} onLogout={() => { setEmail(""); setProfile(null); setWelcomeSeen(false); setSession(null); setClockedSince(null); setMeta(null); setDetail(null); go("welcome"); }} />;
  if (route === "leaves") return <Leaves leaves={[...leaveReqs, ...(profile ? LEAVES : [])]} summary={{ available: 20, used: 2 }} onNavigate={onTab} onSubmit={() => go("submit-leave")} />;
  if (route === "expenses") return <Expenses expenses={[...claims, ...(profile ? EXPENSES : [])]} summary={profile ? { total: 1010 + claims.reduce((n, c) => n + c.total, 0), review: 455 + claims.reduce((n, c) => n + c.total, 0), approved: 555 } : undefined} onNavigate={onTab} onSubmit={() => go("submit-expense")} />;
  if (route === "submit-leave") {
    return (
      <SubmitLeave
        onBack={() => go("leaves")}
        onNavigate={onTab}
        onSubmit={(l) => {
          console.log("Submit leave", l); // replace with your API call
          const f = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
          setLeaveReqs((r) => [{ id: Date.now(), state: "review", requested: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), range: `${f(l.duration.from)} - ${f(l.duration.to)}`, days: l.duration.days }, ...r]);
        }}
        onViewHistory={() => go("leaves")}
      />
    );
  }
  if (route === "submit-expense") {
    return (
      <SubmitExpense
        onBack={() => go("expenses")}
        onViewHistory={() => go("expenses")}
        onSubmit={(c) => {
          console.log("Submit expense", c); // replace with your API call
          setClaims((l) => [{ id: Date.now(), state: "review", date: new Date(c.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), type: c.category, total: c.amount }, ...l]);
        }}
      />
    );
  }
  if (route === "task-detail" && task) return <TaskDetails task={task} me={{ name: profile?.name || "You", role: profile?.position }} onBack={() => go("tasks")} onNavigate={onTab} />;
  if (route === "burnout") return <BurnoutStats level={profile ? BURNOUT.level : "Good"} onBack={() => go("tasks")} />;
  if (route === "create-task") {
    return (
      <CreateTask
        onBack={() => go("tasks")}
        onViewTasks={() => go("tasks")}
        onCreate={(t) => {
          console.log("Create task", t); // replace with your API call
          setCreated((c) => [{ title: t.title, state: "todo", description: t.description, member: t.member, difficulty: t.difficulty, createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), images: t.files.filter((f) => f.type.startsWith("image/")).map((f) => URL.createObjectURL(f)), priority: t.priority || "Medium", progress: 0, people: 1, due: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }), comments: 0 }, ...c]);
        }}
      />
    );
  }
  if (route === "tasks") return <Tasks tasks={[...created, ...(profile ? TASK_LIST : [])]} burnout={profile ? BURNOUT : { level: "Good", pct: 100 }} onNavigate={onTab} onCreate={() => go("create-task")} onOpenBurnout={() => go("burnout")} onOpenTask={(t) => { setTask(t); go("task-detail"); }} />;
  if (route === "attendance-detail" && detail) return <Details day={detail} onBack={() => go("clockin")} />;
  if (route === "selfie-review" && selfie) {
    return (
      <SelfieReview
        photo={selfie.url}
        takenAt={selfie.takenAt}
        {...LOCATION}
        onBack={() => go("clockin-area")}
        onRetake={() => go("selfie")}
        onConfirm={(notes) => {
          console.log("Clock in", { selfie: selfie.file, notes, ...LOCATION, at: selfie.takenAt }); // replace with your API call
          setPendingNotes(notes);
        }}
        onDone={() => {
          setMeta({ photo: selfie.url, notes: pendingNotes, takenAt: selfie.takenAt });
          setSelfie(null); // keep the photo URL alive for the details page
          setClockedSince(Date.now()); setBreakAt(null); setBreakMs(0); setBreakSpan({ first: null, last: null });
          go("clockin");
        }}
      />
    );
  }
  if (route === "selfie") {
    return (
      <Camera
        onClose={() => go("clockin-area")}
        onCapture={(file) => { setShot(file); go("selfie-review"); }}
      />
    );
  }
  if (route === "clockin-area") {
    return (
      <ClockInArea
        {...LOCATION}
        name={profile?.name}
        photo={profile?.photo}
        onBack={() => go("clockin")}
        onOpenCamera={() => go("selfie")}
      />
    );
  }
  if (route === "clockin") {
    return (
      <ClockIn
        history={[...(session ? [session.entry] : []), ...(profile ? HISTORY : [])]}
        onOpenDay={(d) => { setDetail(d); go("attendance-detail"); }}
        finished={session ? session.workedMs : null}
        periodHours={profile ? "32:00" : "00:00"}
        since={clockedSince}
        onClockIn={() => { setSession(null); go("clockin-area"); }}
        breakAt={breakAt}
        breakMs={breakMs}
        onClockOut={(info) => {
          const outAt = Date.now();
          const total = breakMs + (breakAt ? outAt - breakAt : 0);
          const last = breakAt ? outAt : breakSpan.last;
          const workedMs = info?.workedMs ?? 0;
          setSession({
            workedMs, inAt: clockedSince, outAt,
            entry: {
              date: dayOf(outAt), total: hmsOf(workedMs), inTime: timeOf(clockedSince), outTime: timeOf(outAt),
              photo: meta?.photo || null, notes: meta?.notes || "", ...LOCATION,
              stamp: meta?.takenAt ? stamp(meta.takenAt) : stamp(new Date(clockedSince)),
              breakTotal: hmsOf(total),
              breakRange: breakSpan.first ? `${timeOf(breakSpan.first)} — ${timeOf(last)}` : "—",
            },
          });
          setClockedSince(null); setBreakAt(null); setBreakMs(0);
        }}
        onBreak={() => { const t = Date.now(); setBreakAt(t); setBreakSpan((s) => ({ ...s, first: s.first ?? t })); }}
        onResume={() => { const t = Date.now(); setBreakMs((m) => m + t - breakAt); setBreakAt(null); setBreakSpan((s) => ({ ...s, last: t })); }}
        onNavigate={onTab}
      />
    );
  }
  if (route === "home") return <Home email={email} profile={profile} showWelcome={!welcomeSeen} onWelcomeClose={() => setWelcomeSeen(true)} meetings={profile ? MEETINGS : []} tasks={profile ? TASKS : []} onSetupProfile={() => go("profile")} onMessages={() => go("messages")} onNotifications={() => go("notifications")} onProfile={() => go("profile")} onNavigate={onTab} />;
  if (route === "signup") {
    return (
      <SignUp
        onSignIn={() => go("signin")}
        onVerified={(e) => { setEmail(e); go("home"); }}
      />
    );
  }
  if (route === "signin") {
    return (
      <SignIn
        onClose={() => go("welcome")}
        onSignUp={() => go("signup")}
        onSignIn={(d) => { console.log("Sign in", d.method); /* replace with your API call; return { errors: { email: "Email doesn’t registered to any account" } } (or password / employeeId / phone) to show the error state */ if (d.email) setEmail(d.email); go("home"); }}
        onReset={(d) => console.log("Password reset code entered for", d.email)} // the new-password screen is not designed yet
        
        
      />
    );
  }
  if (route === "intro") return <Intro onNext={() => go("welcome")} onSkip={() => go("welcome")} />;
  return <Onboarding onSignIn={() => go("signin")} onSignUp={() => go("signup")} />;
}
