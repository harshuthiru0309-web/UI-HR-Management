import { TaskCard, PeriodChart } from "./Intro.jsx";

export default function Onboarding({ onSignIn, onSignUp, backdrop = false }) {
  const Root = backdrop ? "div" : "main";
  const extra = backdrop ? { "aria-hidden": "true", inert: "" } : {};
  return (
    <Root className="app intro" {...extra}>
      <section className="iv-hero" aria-hidden="true">
        <div className="iv-art">
          <TaskCard className="ob-task" />
          <div className="iv-card ob-period">
            <b className="iv-h">Working Period</b>
            <p className="iv-sub">Average your working period</p>
            <PeriodChart months />
          </div>
        </div>
      </section>

      <section className="iv-content">
        <div className="iv-copy">
          <h1>Navigate Your Work Journey Efficient &amp; Easy</h1>
          <p className="iv-text">Increase your work management &amp; career development radically</p>
        </div>
        <div className="iv-actions solo">
          <button className="btn primary" type="button" onClick={onSignIn}>Sign In</button>
          <button className="btn outline" type="button" onClick={onSignUp}>Sign Up</button>
        </div>
      </section>
    </Root>
  );
}
