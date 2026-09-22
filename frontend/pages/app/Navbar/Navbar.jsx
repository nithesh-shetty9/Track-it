import { useEffect, useRef, useState } from "react";
import { GrInProgress } from "react-icons/gr";
import {
  FiBell,
  FiChevronDown,
  FiCommand,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import "./Navbar.css";

const profileMenuItems = [
  { label: "Profile", icon: FiUser },
  { label: "Settings", icon: FiSettings },
];

const Navbar = ({ onMenuClick }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const closeProfile = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", closeProfile);
    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);
  const User = useSelector((state) => state.auth.user);
  const userName = User?.name || "User";
  return (
    <header className="topbar">
      <div className="topbar-start">
        <div className="brand-lockup" aria-label="TrackIt">
          <GrInProgress className="brand-logo" />
          <span className="brand-name">
            Track<span>It</span>
          </span>
        </div>

        <div className="topbar-divider brand-divider" aria-hidden="true" />
        <button
          className="topbar-icon-button menu-button"
          type="button"
          aria-label="Toggle sidebar"
          onClick={onMenuClick}
        >
          <FiMenu aria-hidden="true" />
        </button>

        <div className="topbar-divider" aria-hidden="true" />

        <button
          className="mobile-search-button topbar-icon-button"
          type="button"
          aria-label="Open search"
          onClick={() => setSearchOpen((isOpen) => !isOpen)}
        >
          {searchOpen ? <FiX /> : <FiSearch />}
        </button>

        <label className={`global-search ${searchOpen ? "is-open" : ""}`}>
          <FiSearch className="search-icon" />
          <input
            type="search"
            placeholder="Search tasks, projects..."
            aria-label="Search tasks and projects"
          />
          <span className="search-shortcut">
            <FiCommand /> K
          </span>
        </label>
      </div>

      <div className="topbar-actions">
        <button className="quick-add" type="button">
          <FiPlus aria-hidden="true" />
          <span>Quick add</span>
        </button>
        {/* addding projects */}

        <button
          className="topbar-icon-button notification-button"
          type="button"
          aria-label="Notifications"
        >
          <FiBell aria-hidden="true" />
          <span className="notification-dot" />
          {/* notifaction */}
        </button>

        <div className="topbar-divider action-divider" aria-hidden="true" />

        <div className="profile-wrap" ref={profileRef}>
          <button
            className={`profile-trigger ${profileOpen ? "is-active" : ""}`}
            type="button"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            onClick={() => setProfileOpen((isOpen) => !isOpen)}
          >
            <span className="avatar">{userName[0].toUpperCase()}</span>
            <span className="profile-name">{userName}</span>
            <FiChevronDown className="profile-chevron" />
          </button>
          {profileOpen && (
            <div className="profile-menu" role="menu">
                  <div className="profile-summary">
                <span className="avatar avatar-large">
                  {userName[0].toUpperCase()}
                </span>
                <span>
                  <strong>{userName}</strong>
                  <small>{User?.email || ""}</small>
                </span>
              </div>
              <div className="menu-divider" />
              {profileMenuItems.map(({ label, icon: Icon }) => (
                <button key={label} type="button" role="menuitem">
                  <Icon /> {label}
                </button>
              ))}
              <div className="menu-divider" />
              <button className="logout-item" type="button" role="menuitem">
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
