import { createBrowserRouter, RouterProvider } from "react-router";
import Landingpage from "../pages/landing/landingpage";
import { AppLayout } from "../layouts/Applayout";
import Home from "../pages/app/Home/Home";
import Dashboard from "../pages/app/Dashboard/Dashboard";
import Projects from "../pages/app/Projects/Projects";
import ProtectedRoute from "../security/protectedroute";
import ErrorPage from "../error/error";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landingpage />,
    },
     {
      element: <ProtectedRoute/>,
      children: [
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
    }
  ]},
  {
    path:"*",
    element:<ErrorPage/>
  }
  ]);
  return (
  <RouterProvider router={router}></RouterProvider>
  );
};

export default App;
