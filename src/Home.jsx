import WelcomeSheet from "./WelcomeSheet.jsx";
import TabBar from "./TabBar.jsx";
import { TaskArt } from "./Art.jsx";
import { Stack, TaskItem } from "./TaskCard.jsx";
import meetingFaces1 from "./assets/stack-1.png";
import meetingFaces2 from "./assets/stack-2.png";
import taskFaces from "./assets/stack-3.png";

// Face stacks cropped from the design. Replace with your people's avatars.
const MEETING_FACES = [meetingFaces1, meetingFaces2];

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const Ic = ({ children, fill }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...S} {...(fill ? { fill: "currentColor", stroke: "none" } : {})} aria-hidden="true">{children}</svg>
);

const Chat = () => <Ic><rect x="3.5" y="4" width="17" height="13" rx="4" fill="currentColor" stroke="none" /><path d="M8 20v-3h4" fill="currentColor" stroke="none" /><path d="M8.5 9.5h7M8.5 12.5h4" stroke="#ece8fb" /></Ic>;
const Bell = () => <Ic><path d="M6 17v-6a6 6 0 1 1 12 0v6l1.5 2h-15z" fill="currentColor" stroke="none" /><path d="M10 21h4" /></Ic>;

const Video = () => <Ic fill><rect x="3" y="6" width="12.5" height="12" rx="3.2" /><path d="m16.5 10.5 4.5-2.5v8l-4.5-2.5z" /></Ic>;
const Clock = () => <Ic><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Ic>;

const Count = ({ n }) => <span className="count">{n}</span>;

function MeetingItem({ title, time, people, extra, faces, onJoin }) {
  return (
    <article className="item">
      <div className="item-top">
        <span className="chip-ic"><Video /></span>
        <h4>{title}</h4>
        <span className="time"><Clock />{time}</span>
      </div>
      <div className="item-bot">
        <Stack count={people} extra={extra} image={faces} />
        <button type="button" className="join" onClick={onJoin}>Join Meet</button>
      </div>
    </article>
  );
}


const nameFromEmail = (email) => {
  const local = email?.split("@")[0];
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : "Tonald Drump";
};

function Camera() {
  return (
    <svg className="cam" viewBox="0 0 120 80" aria-hidden="true">
      <path d="M22 12c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9z" fill="#fff" opacity=".85" />
      <path d="M10 52c.6 3.2 1.8 4.4 5 5-3.2.6-4.4 1.8-5 5-.6-3.2-1.8-4.4-5-5 3.2-.6 4.4-1.8 5-5z" fill="#fff" opacity=".8" />
      <circle cx="58" cy="10" r="1.8" fill="#fff" opacity=".8" /><circle cx="46" cy="40" r="1.5" fill="#fff" opacity=".8" />
      <g transform="rotate(-14 80 40)">
        <rect x="52" y="26" width="58" height="26" rx="9" fill="#f4f4f8" />
        <rect x="52" y="26" width="58" height="9" rx="4.5" fill="#fff" />
        <circle cx="67" cy="40" r="8.5" fill="#2a2f45" /><circle cx="67" cy="40" r="4.5" fill="#4b5578" /><circle cx="65" cy="38" r="1.5" fill="#fff" />
        <rect x="96" y="52" width="8" height="12" rx="2" fill="#dcdce6" />
        <rect x="90" y="62" width="22" height="7" rx="3.5" fill="#e9e9f1" />
      </g>
    </svg>
  );
}

function MeetingArt() {
  return (
    <div className="m-art" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i}>
          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="#a99cf6" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="9" r="3.2" /><path d="M6 19c.6-3.2 3-4.8 6-4.8s5.4 1.6 6 4.8" /></svg>
        </span>
      ))}
    </div>
  );
}


export default function Home({ email, profile, meetings = [], tasks = [], showWelcome = false, onWelcomeClose, onSetupProfile, onProfile, onMessages, onNotifications, onNavigate }) {
  const close = () => onWelcomeClose?.();

  return (
    <main className="app home">
      <header className="profile">
        <button type="button" className="avatar" onClick={onProfile} aria-label="Open my profile">
          {profile?.photo ? <img src={profile.photo} alt="" /> : <><i /><i /><b /></>}
        </button>
        <div className="who">
          <p className="name">
            {profile?.name || nameFromEmail(email)}
            <svg className="verified" viewBox="0 0 24 24" width="1.15em" height="1.15em" aria-label="Verified">
              <path d="m12 1.5 2.4 1.8 3-.2 1.1 2.8 2.6 1.5-.7 2.9 1.3 2.7-1.9 2.4-.2 3-2.9.9-1.8 2.5L12 20.5l-2.9 1.5-1.8-2.5-2.9-.9-.2-3L2.3 12.4l1.3-2.7-.7-2.9 2.6-1.5 1.1-2.8 3 .2z" fill="#7c5cfa" transform="translate(0 .5) scale(.96)" />
              <path d="m8 12.2 2.8 2.8 5.2-5.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
          <p className={profile?.position ? "role" : "mail"}>{profile?.position || email || "Tonald@work.com"}</p>
        </div>
        <button className="icon-btn" type="button" aria-label="Messages" onClick={onMessages}><Chat /></button>
        <button className="icon-btn" type="button" aria-label="Notifications" onClick={onNotifications}><Bell /></button>
      </header>

      <div className="h-body">
        <section className="banner">
          <div>
            <h2>My Work Summary</h2>
            <p>Today task &amp; presence activity</p>
          </div>
          <Camera />
        </section>

        <section className="h-card">
          <h3>Today Meeting{meetings.length > 0 && <Count n={meetings.length} />}</h3>
          <p className="muted">Your schedule for the day</p>
          {meetings.length ? (
            <div className="list">
              {meetings.map((m, i) => <MeetingItem key={m.title} faces={MEETING_FACES[i % MEETING_FACES.length]} {...m} onJoin={() => console.log("Join", m.title)} />)}
            </div>
          ) : (
            <div className="empty">
              <MeetingArt />
              <b>No Meeting Available</b>
              <p>It looks like you don’t have any meetings scheduled at the moment. This space will be updated as new meetings are added!</p>
            </div>
          )}
        </section>

        <section className="h-card">
          <h3>Today Task{tasks.length > 0 && <Count n={tasks.length} />}</h3>
          <p className="muted">The tasks assigned to you for today</p>
          {tasks.length ? (
            <div className="list">
              {tasks.map((t) => <TaskItem key={t.title} avatars={taskFaces} {...t} />)}
            </div>
          ) : (
            <div className="empty">
              <TaskArt />
              <b>No Tasks Assigned</b>
              <p>It looks like you don’t have any tasks assigned to you right now. Don’t worry, this space will be updated as new tasks become available.</p>
            </div>
          )}
        </section>
      </div>

      <TabBar active="home" onNavigate={onNavigate} />

      {showWelcome && <WelcomeSheet onSetup={() => { close(); onSetupProfile?.(); }} onExplore={close} />}
    </main>
  );
}
