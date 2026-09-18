import { Outlet } from "react-router";
import { useState } from "react";
import Navbar from "../pages/app/Navbar/Navbar";
import Sidebar from "../pages/app/Sidebar/Sidebar";
import "../src/App.css";

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <Navbar
          onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)}
          onCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
