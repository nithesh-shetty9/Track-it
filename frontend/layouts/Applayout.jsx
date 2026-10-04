import { Outlet } from "react-router";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../pages/app/Navbar/Navbar";
import Sidebar from "../pages/app/Sidebar/Sidebar";
import TaskDrawer from "../components/TaskDrawer";
import ProjectDrawers from "../components/ProjectDrawers";
import QuickAdd from "../components/QuickAdd";
import SearchOverlay from "../components/SearchOverlay";
import Shortcuts from "../components/Shortcuts";
import Toaster from "../components/Toaster";
import { loadProjects, loadUnread } from "../store/features/workspace";
import { openOverlay, setTheme } from "../store/features/ui";
import "../src/App.css";
import "../components/ui.css";

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const subscribe = (callback) => {
  darkQuery.addEventListener("change", callback);
  return () => darkQuery.removeEventListener("change", callback);
};

export const AppLayout = () => {
  const dispatch = useDispatch();
  const preference = useSelector((state) => state.ui.theme);
  const version = useSelector((state) => state.workspace.version);
  const systemDark = useSyncExternalStore(subscribe, () => darkQuery.matches);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = preference === "system" ? (systemDark ? "dark" : "light") : preference;

  useEffect(() => {
    try {
      localStorage.setItem("trackit-theme", preference);
    } catch {
      return undefined;
    }
    return undefined;
  }, [preference]);

  useEffect(() => {
    dispatch(loadProjects());
    dispatch(loadUnread());
  }, [dispatch, version]);

  useEffect(() => {
    const timer = setInterval(() => dispatch(loadUnread()), 60000);
    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    const onKey = (event) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName);
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        dispatch(openOverlay("search"));
      } else if (mod && event.key.toLowerCase() === "j") {
        event.preventDefault();
        dispatch(openOverlay("quick"));
      } else if (event.key === "?" && !typing) {
        dispatch(openOverlay("shortcuts"));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dispatch]);

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
          onMenuClick={() => (window.innerWidth <= 760 ? setSidebarOpen((open) => !open) : setSidebarCollapsed((collapsed) => !collapsed))}
          theme={theme}
          onThemeToggle={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
      <TaskDrawer />
      <ProjectDrawers />
      <QuickAdd />
      <SearchOverlay />
      <Shortcuts />
      <Toaster />
    </div>
  );
};
