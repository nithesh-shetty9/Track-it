import { createBrowserRouter, RouterProvider } from "react-router";
import Landingpage from "../pages/landing/landingpage";
import { AppLayout } from "../layouts/Applayout";
import Home from "../pages/app/Home/Home";
import Dashboard from "../pages/app/Dashboard/Dashboard";
import Projects from "../pages/app/Projects/Projects";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landingpage />,
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/projects",
          element: <Projects />,
        },
      ],
    },
  ]);
  return (
  <RouterProvider router={router}></RouterProvider>
  );
};

export default App;
