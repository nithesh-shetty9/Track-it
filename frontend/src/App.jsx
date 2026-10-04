import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Landingpage from "../pages/landing/landingpage";
import { AppLayout } from "../layouts/Applayout";
import Home from "../pages/app/Home/Home";
import MyTasks from "../pages/app/MyTasks/MyTasks";
import Projects from "../pages/app/Projects/Projects";
import ProjectDetail from "../pages/app/ProjectDetail/ProjectDetail";
import Notifications from "../pages/app/Notifications/Notifications";
import Profile from "../pages/app/profile/Profile";
import Setting from "../pages/app/Settings/Setting";
import ProtectedRoute from "../security/protectedroute";
import ErrorPage from "../error/error";

const router = createBrowserRouter([
  { path: "/", element: <Landingpage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/dashboard", element: <Navigate to="/home" replace /> },
          { path: "/tasks", element: <MyTasks /> },
          { path: "/projects", element: <Projects /> },
          { path: "/projects/:id", element: <ProjectDetail /> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/profile", element: <Profile /> },
          { path: "/settings", element: <Setting /> },
        ],
      },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
