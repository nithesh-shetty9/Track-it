import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiCommand,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSun,
  FiX,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import "./Navbar.css";

const Navbar = ({ onMenuClick, theme = "light", onThemeToggle }) => {
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
        <button
          className="topbar-icon-button theme-toggle-button"
          type="button"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-pressed={theme === "dark"}
          onClick={onThemeToggle}
        >
          {theme === "dark" ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
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

      </div>
    </header>
  );
};

export default Navbar;
