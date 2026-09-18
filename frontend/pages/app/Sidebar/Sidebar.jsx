import { NavLink, useNavigate } from "react-router";
import { FiBarChart2, FiFolder, FiHome, FiLogOut, FiSettings, FiX } from "react-icons/fi";
import "./Sidebar.css";
import { GrInProgress } from "react-icons/gr";
const navItems = [
  { label: "Home", path: "/home", icon: FiHome },
  { label: "Dashboard", path: "/dashboard", icon: FiBarChart2 },
  { label: "Projects", path: "/projects", icon: FiFolder },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? "is-visible" : ""}`} onClick={onClose} />
      <aside className={`app-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand-row">
          <NavLink to="/home" className="sidebar-brand" onClick={onClose}>
            <span className="brand-mark"><GrInProgress/></span>
            <span className="brand-name">Track<span>It</span></span>
          </NavLink>
          <button className="sidebar-close icon-button" onClick={onClose} aria-label="Close sidebar"><FiX /></button>
        </div>

        <div className="sidebar-section-label">Main</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-section-label">Account</div>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => {}}><FiSettings /><span>Settings</span></button>
          <button className="sidebar-link sidebar-logout" onClick={() => navigate("/")}><FiLogOut /><span>Logout</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-avatar">NS</div>
          <div className="sidebar-user"><strong>Nithesh</strong><span>Personal workspace</span></div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
