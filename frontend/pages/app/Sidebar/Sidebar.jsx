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
  FiMoreHorizontal,
  FiPlus,
  FiSettings,
  FiStar,
  FiUser,
  FiX,
} from "react-icons/fi";
import { GrInProgress } from "react-icons/gr";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/features/user.js";
import "./Sidebar.css";

const projectColors = ["#14845b", "#d17b50", "#597db5", "#b2923c", "#8668a9", "#398f98"];
const navItems = [["Home", "/home", FiHome], ["My Tasks", "/dashboard", FiCheckSquare]];
const initials = (name) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

const Avatar = ({ user, name, large = false }) => {
  const source = user?.avatarUrl || user?.avatar || user?.profilePicture;
  const className = `sidebar-avatar${large ? " sidebar-avatar-large" : ""}`;
  return source
    ? <img className={className} src={source} alt="" />
    : <span className={className}>{initials(name)}</span>;
};

const Sidebar = ({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  workspace,
  projects = [],
  favoriteProjects = [],
  taskCounts,
  activeRoute,
  onCreateProject,
  onProjectSelect,
  onProjectMenu,
  onProfile,
  onSettings,
  onKeyboardShortcuts,
  onLogout,
  onWorkspaceSelect,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const currentRoute = activeRoute || location.pathname;
  const workspaceName = workspace?.name || "Personal Workspace";
  const userName = user?.name || user?.username || user?.fullName;
  const myTaskCount = typeof taskCounts === "number" ? taskCounts : taskCounts?.myTasks;
  const favoriteIds = new Set(favoriteProjects.map((project) => typeof project === "string" ? project : project?.id || project?._id));
  const favorites = projects.filter((project) => project.isFavorite || favoriteIds.has(project.id) || favoriteIds.has(project._id));

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        onClose?.();
      } else if (profileRef.current && !profileRef.current.contains(event.target)) {
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

  const isActive = (key, path) => currentRoute === key || currentRoute === path ||
    (key === "projects" && currentRoute.startsWith("/projects/"));

  return (
    <>
      <button className={`sidebar-backdrop ${isOpen ? "is-visible" : ""}`} type="button" aria-label="Close navigation" tabIndex={isOpen ? 0 : -1} onClick={onClose} />
      <aside className={`sidebar ${isCollapsed ? "is-collapsed" : ""} ${isOpen ? "is-open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-brand-row">
          <Link className="sidebar-brand" to="/home" aria-label="TrackIt home" onClick={onClose}>
            <span className="sidebar-brand-mark"><GrInProgress aria-hidden="true" /></span>
            <span className="sidebar-brand-name">Track<span>It</span></span>
          </Link>
          {onToggleCollapse && (
            <button className="sidebar-collapse-button" type="button" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggleCollapse}>
              {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          )}
          <button className="sidebar-mobile-close" type="button" aria-label="Close navigation" onClick={onClose}>
            <FiX aria-hidden="true" />
          </button>
        </div>

        <button className="workspace-switcher" type="button" title={workspaceName} aria-label={`Workspace: ${workspaceName}`} onClick={onWorkspaceSelect}>
          <span className="workspace-monogram" aria-hidden="true">{workspaceName.slice(0, 1).toUpperCase()}</span>
          <span className="workspace-copy"><span className="workspace-eyebrow">Workspace</span><span className="workspace-name">{workspaceName}</span></span>
          <FiChevronDown className="workspace-chevron" aria-hidden="true" />
        </button>

        <div className="sidebar-scroll-area">
          <nav className="sidebar-navigation" aria-label="Primary">
            <p className="sidebar-section-label">Home</p>
            {navItems.map(([label, to, Icon]) => {
              const active = isActive(label === "My Tasks" ? "my-tasks" : label.toLowerCase(), to);
              return <Link key={to} className={`sidebar-nav-item ${active ? "is-active" : ""}`} to={to} title={isCollapsed ? label : undefined} aria-current={active ? "page" : undefined} onClick={onClose}>
                <Icon className="sidebar-nav-icon" aria-hidden="true" />
                <span className="sidebar-nav-label">{label}</span>
                {label === "My Tasks" && myTaskCount != null && <span className="task-count">{myTaskCount}</span>}
              </Link>;
            })}
          </nav>

          <section className="sidebar-project-section" aria-labelledby="projects-heading">
            <div className="sidebar-section-heading">
              <h2 className="sidebar-section-label" id="projects-heading">Projects</h2>
              <button className="sidebar-add-button" type="button" title="Create new project" aria-label="Create new project" onClick={onCreateProject}>
                <FiPlus aria-hidden="true" />
              </button>
            </div>

            {projects.length ? <div className="sidebar-project-list" aria-label="Projects">
              {projects.map((project, index) => {
                const id = project.id || project._id;
                const name = project.name || "";
                const active = currentRoute === id || currentRoute.endsWith(`/${id}`);
                return <div className={`sidebar-project-row ${active ? "is-active" : ""}`} key={id || name || index}>
                  <button className="sidebar-project-link" type="button" title={name} aria-current={active ? "page" : undefined} onClick={() => onProjectSelect?.(project)}>
                    <span className="project-color-dot" style={{ "--project-color": project.color || projectColors[index % projectColors.length] }} aria-hidden="true" />
                    <span className="sidebar-project-name">{name}</span>
                  </button>
                  {onProjectMenu && <button className="project-menu-button" type="button" title={`More options for ${name}`} aria-label={`More options for ${name}`} onClick={() => onProjectMenu(project)}><FiMoreHorizontal aria-hidden="true" /></button>}
                </div>;
              })}
            </div> : <div className="projects-empty-state">
              <span className="empty-project-icon"><FiFolder aria-hidden="true" /></span>
              <p className="empty-project-title">No projects yet</p>
              <p className="empty-project-copy">Create your first project to get started.</p>
              <button className="empty-project-action" type="button" onClick={onCreateProject}><FiPlus aria-hidden="true" /> Create project</button>
            </div>}
          </section>

          {favorites.length > 0 && <section className="sidebar-favorites-section" aria-labelledby="favorites-heading">
            <h2 className="sidebar-section-label" id="favorites-heading">Favorites</h2>
            <div className="sidebar-project-list">
              {favorites.map((project, index) => <button className="sidebar-favorite-link" key={project.id || project._id || index} type="button" title={project.name || ""} onClick={() => onProjectSelect?.(project)}>
                <FiStar className="favorite-icon" aria-hidden="true" /><span className="sidebar-project-name">{project.name}</span>
              </button>)}
            </div>
          </section>}
        </div>

        <div className="sidebar-footer">
          <Link className={`sidebar-nav-item sidebar-settings-link ${currentRoute === "/settings" ? "is-active" : ""}`} to="/settings" title={isCollapsed ? "Settings" : undefined} onClick={onClose}>
            <FiSettings className="sidebar-nav-icon" aria-hidden="true" />
            <span className="sidebar-nav-label">Settings</span>
          </Link>

          <div className="sidebar-footer-divider" />
          <div className="sidebar-profile-wrap" ref={profileRef}>
            {profileOpen && userName && <div className="sidebar-user-menu" role="menu">
              <div className="sidebar-menu-profile">
                <Avatar user={user} name={userName} large />
                <span className="sidebar-menu-user-copy"><strong>{userName}</strong>{user?.email && <small>{user.email}</small>}</span>
              </div>
              <div className="sidebar-menu-divider" />
                  {[["Profile", FiUser, onProfile], ["Settings", FiSettings, onSettings], ["Keyboard Shortcuts", FiCommand, onKeyboardShortcuts]].map(([label, Icon, action]) => <button key={label} type="button" role="menuitem" onClick={() => { action?.(); setProfileOpen(false); }}><Icon aria-hidden="true" /> {label}</button>)}
                  <div className="sidebar-menu-divider" />
              <div className="sidebar-menu-divider" />
              <button className="sidebar-logout-item" type="button" role="menuitem" onClick={() => { dispatch(logout()); onLogout?.(); setProfileOpen(false); }}><FiLogOut aria-hidden="true" /> Logout</button>
            </div>}
            <button className={`sidebar-user-trigger ${profileOpen ? "is-active" : ""}`} type="button" aria-expanded={profileOpen} aria-haspopup="menu" aria-label={userName ? `Account menu for ${userName}` : "Loading account"} title={isCollapsed && userName ? userName : undefined} onClick={() => userName && setProfileOpen(!profileOpen)}>
              {userName ? <>
                <Avatar user={user} name={userName} />
                <span className="sidebar-user-copy"><span className="sidebar-user-name">{userName}</span>{user?.email && <span className="sidebar-user-email">{user.email}</span>}</span>
                <FiChevronDown className="sidebar-user-chevron" aria-hidden="true" />
              </> : <span className="sidebar-user-skeleton" aria-label="Loading user information"><span className="sidebar-avatar-skeleton" /><span className="sidebar-skeleton-lines"><i /><i /></span></span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
