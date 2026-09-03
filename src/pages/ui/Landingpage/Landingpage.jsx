import { NavLink } from "react-router";
import "./Landing.css";
import { LiaBullseyeSolid } from "react-icons/lia";
export const Landingpage=()=>{
   return (
    <div className="trackit">
      <header className="navbar">
        <div className="navbar-inner">
          <div className="logo"><LiaBullseyeSolid />TrackIt</div>
          <nav className="nav-actions">
            <NavLink to="login" className="nav-link">Login</NavLink>
            <NavLink to="signup" className="btn btn-primary">Get Started</NavLink>
          </nav>
        </div>
      </header>
 
      <section className="hero">
        <h1 className="hero-title">
          Organize Your Work.
          <br />
          Track Your Progress.
        </h1>
        <p className="hero-subtitle">
          Manage personal tasks and team projects in one simple workspace.
        </p>
        <NavLink to="signup" className="btn btn-primary btn-large">
          Get Started
        </NavLink>
      </section>
 
      <section className="features">
        <h2 className="features-title">Why TrackIt?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-name">Personal Tasks</h3>
            <p className="feature-desc">
              Manage your own daily tasks and stay on top of what matters.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-name">Projects</h3>
            <p className="feature-desc">
              Organize work into projects and track progress from start to finish.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-name">Teams</h3>
            <p className="feature-desc">
              Work together and assign tasks to keep everyone aligned.
            </p>
          </div>
        </div>
      </section>
 
      <section className="closing-cta">
        <h2 className="closing-title">Everything in one place.</h2>
        <p className="closing-subtitle">Simple. Organized. Trackable.</p>
        <NavLink to="signup" className="btn btn-primary btn-large">
          Get Started
        </NavLink>
      </section>
 
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">TrackIt</span>
          <span className="footer-copy">© 2026 TrackIt</span>
        </div>
      </footer>
    </div>
  );

}