import { Outlet } from "react-router";
import Navbar from "../pages/app/Navbar/Navbar";
import Sidebar from "../pages/app/Sidebar/Sidebar";

export const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
    </>
  );
};
