import "./landingpage.css";
import { GrInProgress } from "react-icons/gr";
import { useState } from "react";
import Signupin from "../auth/Signupin";
import {
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiFilePlus,
  FiList,
  FiUserPlus,
  FiTrendingUp,
  FiArrowRight,
  FiCheck,
  FiSearch,
  FiClock,
  FiShield,
  FiZap,
  FiMenu,
  FiX,
  FiChevronDown,
  FiActivity,
} from "react-icons/fi";
import { FaPlay, FaStar } from "react-icons/fa";

const Landingpage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showcaseTab, setShowcaseTab] = useState("tasks");
  const [activeFaq, setActiveFaq] = useState(null);

  const [previewTasks, setPreviewTasks] = useState([
    {
      id: 1,
      text: "Design landing page",
      completed: true,
      tag: "high",
      tagText: "High",
    },
    {
      id: 2,
      text: "Build authentication API",
      completed: true,
      tag: "medium",
      tagText: "Medium",
    },
    {
      id: 3,
      text: "Create project dashboard",
      completed: false,
      tag: "medium",
      tagText: "Medium",
    },
    {
      id: 4,
      text: "Test and deploy",
      completed: false,
      tag: "low",
      tagText: "Low",
    },
  ]);

  const [showcaseTasks, setShowcaseTasks] = useState([
    {
      id: 1,
      text: "Design UI components",
      due: "Mar 10",
      tag: "high",
      completed: true,
    },
    {
      id: 2,
      text: "Build backend API",
      due: "Mar 12",
      tag: "medium",
      completed: true,
    },
    {
      id: 3,
      text: "Integrate frontend & backend",
      due: "Mar 15",
      tag: "medium",
      completed: false,
    },
    {
      id: 4,
      text: "Testing and deployment",
      due: "Mar 18",
      tag: "low",
      completed: false,
    },
  ]);

  const togglePreviewTask = (id) => {
    setPreviewTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const toggleShowcaseTask = (id) => {
    setShowcaseTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const completedCount = previewTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round(
    (completedCount / previewTasks.length) * 100,
  );
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * progressPercent) / 100;

  const faqs = [
    {
      q: "Is TrackIt free to use for individual students?",
      a: "Yes, TrackIt is 100% free for individual use. You get unlimited personal tasks, up to 3 collaborative projects, and real-time synchronization.",
    },
    {
      q: "How does real-time team collaboration work?",
      a: "Changes appear instantly without page refreshes. When a teammate checks off a task, leaves an update, or assigns a deliverable, everyone on the project sees it live.",
    },
    {
      q: "Can I migrate my existing tasks or export my data?",
      a: "You can import from CSV or popular task tools in a few clicks, and export your project logs and task lists anytime in JSON or CSV format.",
    },
    {
      q: "Does TrackIt work on mobile browsers?",
      a: "TrackIt is fully responsive and optimized for mobile devices and tablets, allowing you to update progress on the go without installing extra apps.",
    },
  ];

  return (
    <div className="landingpage">
      <header className="landing-header">
        <div className="landing-menu">
          <a href="#" className="logo">
            <div className="logo-icon-wrap">
              <GrInProgress />
            </div>
            TrackIt
          </a>

          <nav>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#showcase">Overview</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-right">
            <button className="btn-login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button className="get-started" onClick={() => setShowSignup(true)}>
              Get started free <FiArrowRight />
            </button>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
              How it works
            </a>
            <a href="#showcase" onClick={() => setMobileMenuOpen(false)}>
              Overview
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <div className="mobile-actions">
              <button
                className="btn-login"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogin(true);
                }}
              >
                Log in
              </button>
              <button
                className="get-started"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowSignup(true);
                }}
              >
                Get started free <FiArrowRight />
              </button>
            </div>
          </div>
        )}
      </header>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Signupin
              showLogin={true}
              setShowLogin={setShowLogin}
              showSignup={showSignup}
              setShowSignup={setShowSignup}
            />
          </div>
        </div>
      )}

      {showSignup && (
        <div className="modal-overlay" onClick={() => setShowSignup(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Signupin
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              showSignup={true}
              setShowSignup={setShowSignup}
            />
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="badge-pulse" />
            Organize · Collaborate · Achieve
          </div>
          <h1>
            Get Things Done, <span className="highlight">Together.</span>
          </h1>
          <p>
            TrackIt helps students and modern teams manage everyday tasks,
            collaborate seamlessly on milestones, and stay ahead of deadlines.
          </p>

          <div className="hero-actions">
            <button className="get-started" onClick={() => setShowSignup(true)}>
              Get Started Free <FiArrowRight />
            </button>
            <button className="watch-demo">
              <span className="play-icon-bubble">
                <FaPlay />
              </span>
              Watch Demo
            </button>
          </div>

          <div className="hero-social">
            <div className="avatars">
              <span className="avatar avatar-blue">
                AL
              </span>
              <span className="avatar avatar-yellow">
                NK
              </span>
              <span className="avatar avatar-purple">
                SR
              </span>
              <span className="avatar avatar-coral">
                TA
              </span>
            </div>
            <div className="hero-social-info">
              <div className="rating-stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <span>4.9/5</span>
              </div>
              <p>Trusted by 2,000+ students and teams</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="floating-pill">
            <FiTrendingUp /> +32% Productivity
          </div>

          <div className="preview-card">
            <div className="preview-sidebar">
              <div>
                <div className="preview-logo">
                  <GrInProgress /> TrackIt
                </div>
                <ul>
                  <li className="active">Dashboard</li>
                  <li>My Tasks</li>
                  <li>Projects</li>
                  <li>Team</li>
                  <li>Analytics</li>
                </ul>
              </div>
              <div className="sidebar-upgrade-card">
                <p>Collaborating with 5+ peers?</p>
                <button onClick={() => setShowSignup(true)}>
                  Upgrade Team
                </button>
              </div>
            </div>

            <div className="preview-main">
              <div className="preview-topbar">
                <div className="search-box-wrap">
                  <FiSearch />
                  <input placeholder="Search tasks, sprints..." disabled />
                </div>
                <div className="preview-user-badge">
                  <span className="preview-user-avatar">N</span>
                  <span className="preview-user">Nithesh</span>
                </div>
              </div>

              <h3>Good morning, Nithesh! 👋</h3>
              <p>Here is your current team milestone status for today.</p>

              <div className="preview-stats">
                <div className="stat">
                  <strong>12</strong>
                  <span>Total Tasks</span>
                </div>
                <div className="stat">
                  <strong>{completedCount}</strong>
                  <span>Completed</span>
                </div>
                <div className="stat">
                  <strong>{previewTasks.length - completedCount}</strong>
                  <span>Pending</span>
                </div>
                <div className="stat">
                  <strong>3</strong>
                  <span>Projects</span>
                </div>
              </div>

              <div className="preview-panels">
                <div className="preview-tasks">
                  <div className="panel-head">
                    <span>Today Tasks</span>
                    <span className="interactive-hint">Click to toggle</span>
                  </div>
                  <ul>
                    {previewTasks.map((task) => (
                      <li
                        key={task.id}
                        className={`preview-task-item ${task.completed ? "is-completed" : ""}`}
                        onClick={() => togglePreviewTask(task.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            togglePreviewTask(task.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={task.completed}
                      >
                        <span
                          className={`check-box-icon ${task.completed ? "checked" : "unchecked"}`}
                        >
                          {task.completed && <FiCheck />}
                        </span>
                        <span className="task-text">{task.text}</span>
                        <span className={`tag ${task.tag}`}>
                          {task.tagText}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="preview-progress">
                  <span>Sprint Velocity</span>
                  <div className="progress-circle-wrap">
                    <svg className="progress-svg" viewBox="0 0 90 90">
                      <circle
                        className="progress-bg-circle"
                        cx="45"
                        cy="45"
                        r={radius}
                        strokeWidth="7"
                        fill="none"
                      />
                      <circle
                        className="progress-bar-circle"
                        cx="45"
                        cy="45"
                        r={radius}
                        strokeWidth="7"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="progress-text">{progressPercent}%</div>
                  </div>
                  <strong>Hackathon 2026</strong>
                  <p>{completedCount} of 4 sprints finished</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-strip">
        <div className="metrics-grid">
          <div className="metric-item">
            <strong>99.9%</strong>
            <p>Platform Uptime</p>
          </div>
          <div className="metric-item">
            <strong>25,000+</strong>
            <p>Tasks Completed</p>
          </div>
          <div className="metric-item">
            <strong>4.9 / 5</strong>
            <p>Average User Rating</p>
          </div>
          <div className="metric-item">
            <strong>2,000+</strong>
            <p>Active Workspaces</p>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <p className="eyebrow">Key Capabilities</p>
        <h2>Everything you need to deliver results</h2>
        <p className="section-sub">
          Intuitive controls engineered to keep you focused on building, not
          busywork.
        </p>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiCheckSquare />
            </div>
            <h3>Personal Task Board</h3>
            <p>
              Organize daily to-dos with drag-and-drop clarity, priority tags,
              and clean checklists.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiUsers />
            </div>
            <h3>Team Project Spaces</h3>
            <p>
              Create dedicated workspaces for student clubs, hackathons, or
              startup sprints with custom permissions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiBarChart2 />
            </div>
            <h3>Live Progress Analytics</h3>
            <p>
              Instantly see who is blocked and celebrate completed milestones
              with visual progress rings.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiClock />
            </div>
            <h3>Smart Reminders</h3>
            <p>
              Never miss a sprint deadline with automatic notifications and
              milestone countdown timers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiShield />
            </div>
            <h3>Secure Collaboration</h3>
            <p>
              Encrypted end-to-end cloud storage ensures your team notes and
              project documents stay private.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiZap />
            </div>
            <h3>Lightweight & Fast</h3>
            <p>
              Built for speed. Zero loading latency with instant offline
              synchronization and optimistic UI updates.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <p className="eyebrow">Simple Workflow</p>
        <h2>Get set up in four easy steps</h2>
        <p className="section-sub">
          Transition from chaotic group chats to a structured, repeatable
          workspace in minutes.
        </p>

        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-icon">
              <FiFilePlus />
            </div>
            <h4>Create Workspace</h4>
            <p>
              Spin up a project board with templates tailored for your goal.
            </p>
          </div>

          <FiArrowRight className="step-arrow" />

          <div className="step">
            <span className="step-number">2</span>
            <div className="step-icon">
              <FiList />
            </div>
            <h4>Add Tasks</h4>
            <p>Break complex deliverables into bite-sized actionable items.</p>
          </div>

          <FiArrowRight className="step-arrow" />

          <div className="step">
            <span className="step-number">3</span>
            <div className="step-icon">
              <FiUserPlus />
            </div>
            <h4>Invite Peers</h4>
            <p>
              Share a quick invite link to collaborate with teammates in real
              time.
            </p>
          </div>

          <FiArrowRight className="step-arrow" />

          <div className="step">
            <span className="step-number">4</span>
            <div className="step-icon">
              <FiTrendingUp />
            </div>
            <h4>Track & Ship</h4>
            <p>
              Monitor completion percentages and hit every deadline together.
            </p>
          </div>
        </div>
      </section>

      <section className="showcase" id="showcase">
        <div className="showcase-left">
          <div className="showcase-head">
            <div>
              <h4>Hackathon 2026 Board</h4>
              <p>Building something meaningful together</p>
            </div>
            <span className="progress-pill">
              {Math.round(
                (showcaseTasks.filter((t) => t.completed).length /
                  showcaseTasks.length) *
                  100,
              )}
              % Complete
            </span>
          </div>

          <div className="showcase-tabs">
            <button
              className={showcaseTab === "tasks" ? "active" : ""}
              onClick={() => setShowcaseTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={showcaseTab === "members" ? "active" : ""}
              onClick={() => setShowcaseTab("members")}
            >
              Members
            </button>
            <button
              className={showcaseTab === "activity" ? "active" : ""}
              onClick={() => setShowcaseTab("activity")}
            >
              Activity
            </button>
          </div>

          {showcaseTab === "tasks" && (
            <ul className="showcase-tasklist">
              {showcaseTasks.map((t) => (
                <li
                  key={t.id}
                  className={`showcase-task-row ${t.completed ? "done-row" : ""}`}
                  onClick={() => toggleShowcaseTask(t.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleShowcaseTask(t.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={t.completed}
                >
                  <span
                    className={`check-box-icon ${t.completed ? "checked" : "unchecked"}`}
                  >
                    {t.completed && <FiCheck />}
                  </span>
                  <span className="task-title">{t.text}</span>
                  <span className="due">{t.due}</span>
                  <span className={`tag ${t.tag}`}>
                    {t.tag.charAt(0).toUpperCase() + t.tag.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {showcaseTab === "members" && (
            <ul className="showcase-members-list">
              <li className="member-item">
                <div className="member-info">
                  <div className="member-avatar avatar-blue">
                    NK
                  </div>
                  <div>
                    <div className="member-name">Nithesh Kumar</div>
                    <div className="member-role">Fullstack Lead</div>
                  </div>
                </div>
                <span className="member-status-dot" />
              </li>
              <li className="member-item">
                <div className="member-info">
                  <div className="member-avatar avatar-yellow">
                    AL
                  </div>
                  <div>
                    <div className="member-name">Aarav L.</div>
                    <div className="member-role">UI/UX Designer</div>
                  </div>
                </div>
                <span className="member-status-dot" />
              </li>
              <li className="member-item">
                <div className="member-info">
                  <div className="member-avatar avatar-purple">
                    SR
                  </div>
                  <div>
                    <div className="member-name">Sneha Roy</div>
                    <div className="member-role">Backend Engineer</div>
                  </div>
                </div>
                <span className="member-status-dot" />
              </li>
            </ul>
          )}

          {showcaseTab === "activity" && (
            <ul className="showcase-activity-list">
              <li className="activity-item">
                <div className="activity-icon">
                  <FiCheck />
                </div>
                <div>
                  <strong>Aarav</strong> completed Design UI components
                </div>
                <span className="activity-time">10m ago</span>
              </li>
              <li className="activity-item">
                <div className="activity-icon">
                  <FiActivity />
                </div>
                <div>
                  <strong>Sneha</strong> updated backend repository
                </div>
                <span className="activity-time">42m ago</span>
              </li>
              <li className="activity-item">
                <div className="activity-icon">
                  <FiUserPlus />
                </div>
                <div>
                  <strong>Nithesh</strong> added a new task to sprint
                </div>
                <span className="activity-time">2h ago</span>
              </li>
            </ul>
          )}
        </div>

        <div className="showcase-right" id="about">
          <p className="eyebrow">A Better Way to Work</p>
          <h2>Stay organized, reduce stress, ship on time.</h2>
          <p>
            Whether it is an academic term paper, college hackathon project, or
            your personal fitness routine, TrackIt brings all your scattered
            ideas into one synchronized workspace.
          </p>

          <ul className="checklist">
            <li>
              <span className="checklist-check-bubble">
                <FiCheck />
              </span>
              Real-time collaboration with zero sync delays
            </li>
            <li>
              <span className="checklist-check-bubble">
                <FiCheck />
              </span>
              Visual analytics with dynamic completion tracking
            </li>
            <li>
              <span className="checklist-check-bubble">
                <FiCheck />
              </span>
              Accessible anywhere on desktop and mobile browsers
            </li>
            <li>
              <span className="checklist-check-bubble">
                <FiCheck />
              </span>
              Tailored specifically for student developers and teams
            </li>
          </ul>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <p className="eyebrow">Common Questions</p>
        <h2>Frequently Asked Questions</h2>
        <p className="section-sub">
          Everything you need to know about getting started with TrackIt.
        </p>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-card ${activeFaq === idx ? "open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <span>{faq.q}</span>
                <FiChevronDown
                  className={`faq-arrow ${activeFaq === idx ? "rotated" : ""}`}
                />
              </button>
              {activeFaq === idx && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Ready to hit your milestones faster?</h2>
        <p>
          Join thousands of students and builders who use TrackIt every day to
          manage their work and ship their goals.
        </p>
        <div className="cta-buttons">
          <button
            className="btn-cta-primary"
            onClick={() => setShowSignup(true)}
          >
            Get Started Free <FiArrowRight />
          </button>
          <button
            className="btn-cta-secondary"
            onClick={() => setShowLogin(true)}
          >
            Existing User? Log In
          </button>
        </div>
        <div className="cta-guarantee">
          <span>✓ Free forever tier</span>
          <span>✓ No credit card required</span>
          <span>✓ Instant setup</span>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="logo">
              <div className="logo-icon-wrap">
                <GrInProgress />
              </div>
              TrackIt
            </a>
            <p>
              The lightweight project tracker built to help students and agile
              teams turn ambitions into reality.
            </p>
          </div>

          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#showcase">Project Showcase</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <ul>
              <li>
                <a href="#showcase">Community</a>
              </li>
              <li>
                <a href="#features">Templates</a>
              </li>
              <li>
                <a href="#faq">Help Center</a>
              </li>
              <li>
                <a href="#features">Changelog</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Security</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 TrackIt Technologies Inc. All rights reserved.
          </p>
          <div className="footer-badges">
            <span>Student Friendly</span>
            <span>·</span>
            <span>Encrypted Data</span>
            <span>·</span>
            <span>Fast CDN</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
