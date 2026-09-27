import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "../pages/app/Navbar/Navbar";
import Sidebar from "../pages/app/Sidebar/Sidebar";
import "../src/App.css";

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("trackit-theme") === "dark" ? "dark" : "light");

  useEffect(() => localStorage.setItem("trackit-theme", theme), [theme]);

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`} data-theme={theme}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div className="app-main">
        <Navbar
          onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)}
          onCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
          theme={theme}
          onThemeToggle={() => setTheme((current) => current === "dark" ? "light" : "dark")}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
