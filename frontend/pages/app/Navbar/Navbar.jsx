import { useEffect, useRef, useState } from "react";
import { FiBell, FiChevronDown, FiCommand, FiLogOut, FiMenu, FiMoon, FiPlus, FiSearch, FiSettings, FiSun, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { openOverlay } from "../../../store/features/ui";
import { useLogout } from "../../../hooks/useLogout";
import { Avatar } from "../../../components/Common";
import "./Navbar.css";

const Navbar = ({ onMenuClick, theme = "light", onThemeToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = useLogout();
  const user = useSelector((state) => state.auth.user);
  const unread = useSelector((state) => state.workspace.unread);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const openSearch = () => dispatch(openOverlay("search"));

  useEffect(() => {
    const close = (event) => {
      if (event.type === "keydown" ? event.key === "Escape" : profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  const go = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="topbar">
      <div className="topbar-start">
        <button className="topbar-icon-button menu-button" type="button" aria-label="Toggle sidebar" onClick={onMenuClick}>
          <FiMenu aria-hidden="true" />
        </button>

        <div className="topbar-divider" aria-hidden="true" />

        <button className="mobile-search-button topbar-icon-button" type="button" aria-label="Open search" onClick={openSearch}>
          <FiSearch />
        </button>

        <label className="global-search is-open">
          <FiSearch className="search-icon" />
          <input readOnly type="search" placeholder="Search tasks, projects, members" aria-label="Search" onFocus={openSearch} onClick={openSearch} />
          <span className="search-shortcut">
            <FiCommand /> K
          </span>
        </label>
      </div>

      <div className="topbar-actions">
        <button className="quick-add" type="button" onClick={() => dispatch(openOverlay("quick"))}>
          <FiPlus aria-hidden="true" />
          <span>Quick add</span>
        </button>
        <button
          className="topbar-icon-button theme-toggle-button"
          type="button"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          onClick={onThemeToggle}
        >
          {theme === "dark" ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
        </button>
        <Link className="topbar-icon-button notification-button" to="/notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <FiBell aria-hidden="true" />
          {unread > 0 && <span className="notification-count">{unread > 9 ? "9+" : unread}</span>}
        </Link>

        <div className="topbar-divider" aria-hidden="true" />

        <div className="nav-user" ref={profileRef}>
          <button className="nav-user-trigger" type="button" aria-haspopup="menu" aria-expanded={profileOpen} onClick={() => setProfileOpen(!profileOpen)}>
            <Avatar name={user.name} size={30} />
            <span className="nav-user-name">{user.name}</span>
            <FiChevronDown aria-hidden="true" />
          </button>
          {profileOpen && (
            <div className="menu-list right" role="menu">
              <button role="menuitem" onClick={() => go("/profile")}>
                <FiUser /> Profile
              </button>
              <button role="menuitem" onClick={() => go("/settings")}>
                <FiSettings /> Settings
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  dispatch(openOverlay("shortcuts"));
                }}
              >
                <FiCommand /> Keyboard shortcuts
              </button>
              <button role="menuitem" onClick={logout}>
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
