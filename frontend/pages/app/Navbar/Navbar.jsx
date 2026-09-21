import { useEffect, useRef, useState } from "react";
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
import { HiOutlineSparkles } from "react-icons/hi2";
import "./Navbar.css";

const profileMenuItems = [
  { label: "Profile", icon: FiUser },
  { label: "Settings", icon: FiSettings },
  { label: "Keyboard shortcuts", icon: HiOutlineSparkles },
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

  return (
    <header className="topbar">
      <div className="topbar-start">
        <div className="brand-lockup" aria-label="TrackIt">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
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
          {searchOpen ? <FiX aria-hidden="true" /> : <FiSearch aria-hidden="true" />}
        </button>

        <label className={`global-search ${searchOpen ? "is-open" : ""}`}>
          <FiSearch className="search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search tasks, projects..."
            aria-label="Search tasks and projects"
          />
          <span className="search-shortcut" aria-hidden="true">
            <FiCommand /> K
          </span>
        </label>
      </div>

      <div className="topbar-actions">
        <button className="quick-add" type="button">
          <FiPlus aria-hidden="true" />
          <span>Quick add</span>
        </button>

        <button
          className="topbar-icon-button notification-button"
          type="button"
          aria-label="Notifications"
        >
          <FiBell aria-hidden="true" />
          <span className="notification-dot" aria-hidden="true" />
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
            <span className="avatar" aria-hidden="true">
              NS
            </span>
            <span className="profile-name">Nithesh</span>
            <FiChevronDown className="profile-chevron" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div className="profile-menu" role="menu">
              <div className="profile-summary">
                <span className="avatar avatar-large" aria-hidden="true">
                  NS
                </span>
                <span>
                  <strong>Nithesh</strong>
                  <small>nithesh@example.com</small>
                </span>
              </div>

              <div className="menu-divider" />

              {profileMenuItems.map(({ label, icon: Icon }) => (
                <button key={label} type="button" role="menuitem">
                  <Icon aria-hidden="true" /> {label}
                </button>
              ))}

              <div className="menu-divider" />

              <button className="logout-item" type="button" role="menuitem">
                <FiLogOut aria-hidden="true" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
