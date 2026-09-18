import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FiBell, FiChevronDown, FiMenu, FiSearch, FiSidebar } from "react-icons/fi";
import "./Navbar.css";

const pageTitles = {
  "/home": "Home",
  "/dashboard": "Dashboard",
  "/projects": "Projects",
};

const Navbar = ({ onMenuClick, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button className="icon-button mobile-menu-button" onClick={onMenuClick} aria-label="Open sidebar">
          <FiMenu />
        </button>
        <button className="icon-button desktop-collapse-button" onClick={onCollapse} aria-label="Collapse sidebar">
          <FiSidebar />
        </button>
        <div className="page-heading">
          <span className="page-kicker">Workspace</span>
          <h1>{pageTitles[location.pathname] || "Home"}</h1>
        </div>
      </div>

      <label className="navbar-search">
        <FiSearch />
        <input type="search" placeholder="Search projects, tasks..." aria-label="Search projects and tasks" />
        <kbd>⌘ K</kbd>
      </label>

      <div className="navbar-right">
        <button className="icon-button notification-button" aria-label="Notifications">
          <FiBell />
          <span className="notification-dot" />
        </button>
        <div className="profile-wrap">
          <button className="profile-trigger" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
            <span className="avatar">NS</span>
            <span className="profile-name">Nithesh</span>
            <FiChevronDown className={profileOpen ? "chevron-up" : ""} />
          </button>
          {profileOpen && (
            <div className="profile-menu">
              <button onClick={() => setProfileOpen(false)}>Profile</button>
              <button onClick={() => setProfileOpen(false)}>Settings</button>
              <button onClick={() => navigate("/")}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
