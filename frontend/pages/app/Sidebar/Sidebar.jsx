import { useEffect, useRef, useState } from "react";
import {
  FiCheckSquare,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCommand,
  FiFolder,
  FiHome,
  FiLogOut,
  FiPlus,
  FiSettings,
  FiUser,
  FiX,
} from "react-icons/fi";
import { GrInProgress } from "react-icons/gr";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { openOverlay } from "../../../store/features/ui.js";
import { useLogout } from "../../../hooks/useLogout.js";
import { initials } from "../../../utils/format.js";
import "./Sidebar.css";

const navItems = [
  ["Home", "/home", FiHome],
  ["My Tasks", "/tasks", FiCheckSquare],
  ["Projects", "/projects", FiFolder],
];

const Avatar = ({ name, large = false }) => (
  <span className={`sidebar-avatar${large ? " sidebar-avatar-large" : ""}`}>{initials(name)}</span>
);

const Sidebar = ({ isOpen = false, onClose, isCollapsed = false, onToggleCollapse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.workspace.projects);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const currentRoute = location.pathname;
  const workspaceName = "Personal Workspace";
  const userName = user?.name;
  const handlelogout = useLogout();
  const onCreateProject = () => {
    onClose?.();
    dispatch(openOverlay("project"));
  };
  const onProjectSelect = (project) => {
    onClose?.();
    navigate(`/projects/${project._id}`);
  };
  const onProfile = () => navigate("/profile");
  const onSettings = () => navigate("/settings");
  const onKeyboardShortcuts = () => dispatch(openOverlay("shortcuts"));
  useEffect(() => {
    const handleEvent = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        onClose?.();
      } else if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEvent);
    document.addEventListener("mousedown", handleEvent);
    return () => {
      document.removeEventListener("keydown", handleEvent);
      document.removeEventListener("mousedown", handleEvent);
    };
  }, [onClose]);

  const isActive = (path) => currentRoute === path;

  return (
    <>
      <button
        className={`sidebar-backdrop ${isOpen ? "is-visible" : ""}`}
        type="button"
        aria-label="Close navigation"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={`sidebar ${isCollapsed ? "is-collapsed" : ""} ${isOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand-row">
          <Link
            className="sidebar-brand"
            to="/home"
            aria-label="TrackIt home"
            onClick={onClose}
          >
            <span className="sidebar-brand-mark">
              <GrInProgress aria-hidden="true" />
            </span>
            <span className="sidebar-brand-name">
              Track<span>It</span>
            </span>
          </Link>
          {onToggleCollapse && (
            <button
              className="sidebar-collapse-button"
              type="button"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={onToggleCollapse}
            >
              {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          )}
          <button
            className="sidebar-mobile-close"
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="workspace-switcher" title={workspaceName}>
          <span className="workspace-monogram" aria-hidden="true">
            {workspaceName.slice(0, 1).toUpperCase()}
          </span>
          <span className="workspace-copy">
            <span className="workspace-eyebrow">Workspace</span>
            <span className="workspace-name">{workspaceName}</span>
          </span>
        </div>

        <div className="sidebar-scroll-area">
          <nav className="sidebar-navigation" aria-label="Primary">
            <p className="sidebar-section-label">Workspace</p>
            {navItems.map(([label, to, Icon]) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  className={`sidebar-nav-item ${active ? "is-active" : ""}`}
                  to={to}
                  title={isCollapsed ? label : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                >
                  <Icon className="sidebar-nav-icon" aria-hidden="true" />
                  <span className="sidebar-nav-label">{label}</span>
                </Link>
              );
            })}
          </nav>

          <section
            className="sidebar-project-section"
            aria-labelledby="projects-heading"
          >
            <div className="sidebar-section-heading">
              <h2 className="sidebar-section-label" id="projects-heading">
                Projects
              </h2>
              <button
                className="sidebar-add-button"
                type="button"
                title="Create new project"
                aria-label="Create new project"
                onClick={onCreateProject}
              >
                <FiPlus aria-hidden="true" />
              </button>
            </div>

            {projects.length ? (
              <div className="sidebar-project-list" aria-label="Projects">
                {projects.map((project) => {
                  const name = project.name;
                  const active = currentRoute === `/projects/${project._id}`;
                  return (
                    <div
                      className={`sidebar-project-row ${active ? "is-active" : ""}`}
                      key={project._id}
                    >
                      <button
                        className="sidebar-project-link"
                        type="button"
                        title={name}
                        aria-current={active ? "page" : undefined}
                        onClick={() => onProjectSelect(project)}
                      >
                        <span
                          className="project-color-dot"
                          style={{ "--project-color": project.color }}
                          aria-hidden="true"
                        />
                        <span className="sidebar-project-name">{name}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="projects-empty-state">
                <span className="empty-project-icon">
                  <FiFolder aria-hidden="true" />
                </span>
                <p className="empty-project-title">No projects yet</p>
                <p className="empty-project-copy">
                  Create your first project to get started.
                </p>
                <button
                  className="empty-project-action"
                  type="button"
                  onClick={onCreateProject}
                >
                  <FiPlus aria-hidden="true" /> Create project
                </button>
              </div>
            )}
          </section>

        </div>

        <div className="sidebar-footer">
          <Link
            className={`sidebar-nav-item sidebar-settings-link ${currentRoute === "/settings" ? "is-active" : ""}`}
            to="/settings"
            title={isCollapsed ? "Settings" : undefined}
            onClick={onClose}
          >
            <FiSettings className="sidebar-nav-icon" aria-hidden="true" />
            <span className="sidebar-nav-label">Settings</span>
          </Link>

          <div className="sidebar-footer-divider" />
          <div className="sidebar-profile-wrap" ref={profileRef}>
            {profileOpen && userName && (
              <div className="sidebar-user-menu" role="menu">
                <div className="sidebar-menu-profile">
                  <Avatar name={userName} large />
                  <span className="sidebar-menu-user-copy">
                    <strong>{userName}</strong>
                    {user?.email && <small>{user.email}</small>}
                  </span>
                </div>
                <div className="sidebar-menu-divider" />
                {[
                  ["Profile", FiUser, onProfile],
                  ["Settings", FiSettings, onSettings],
                  ["Keyboard Shortcuts", FiCommand, onKeyboardShortcuts],
                ].map(([label, Icon, action]) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      action?.();
                      setProfileOpen(false);
                    }}
                  >
                    <Icon aria-hidden="true" /> {label}
                  </button>
                ))}
                <div className="sidebar-menu-divider" />
                <button
                  className="sidebar-logout-item"
                  type="button"
                  role="menuitem"
                  onClick={handlelogout}
                >
                  <FiLogOut aria-hidden="true" /> Logout
                </button>
              </div>
            )}
            <button
              className={`sidebar-user-trigger ${profileOpen ? "is-active" : ""}`}
              type="button"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label={
                userName ? `Account menu for ${userName}` : "Loading account"
              }
              title={isCollapsed && userName ? userName : undefined}
              onClick={() => userName && setProfileOpen(!profileOpen)}
            >
              {userName ? (
                <>
                  <Avatar name={userName} />
                  <span className="sidebar-user-copy">
                    <span className="sidebar-user-name">{userName}</span>
                    {user?.email && (
                      <span className="sidebar-user-email">{user.email}</span>
                    )}
                  </span>
                  <FiChevronDown
                    className="sidebar-user-chevron"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <span
                  className="sidebar-user-skeleton"
                  aria-label="Loading user information"
                >
                  <span className="sidebar-avatar-skeleton" />
                  <span className="sidebar-skeleton-lines">
                    <i />
                    <i />
                  </span>
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
