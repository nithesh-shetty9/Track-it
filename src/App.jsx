import { createBrowserRouter, RouterProvider } from "react-router";
import { Applayout } from "./pages/layout/Applayout";
import { Dashboard } from "./pages/mainpages/Dashboard";
import { Project } from "./pages/mainpages/Projects";
import { Signup} from "./pages/ui/Signup";
import {Login} from "./pages/ui/Login"
import { Landingpage } from "./pages/ui/Landingpage";
import { Home } from "./pages/mainpages/Home";

const App=()=>{
  //need to be changes for now make default as APPlayout
  const router=createBrowserRouter([
    {
      path:"/",
      element:<Landingpage/>
    },
    {
    element:<Applayout/>,//main applayout 
    errorElement:<main><h1>Something went wrong!</h1></main>,
    children: [
     {
      path: "/home",
      element: <Home/>,
      },
     {
      path: "/dashboard",
      element: <Dashboard />,
     },
    {
      path: "/projects",
      element: <Project />,
    }
  ]
}
  ,{
    path:"/signup",
    element:<Signup/>
  }
  ,{
    path:"/login",
    element:<Login/>
  }
])
     return <RouterProvider router={router}></RouterProvider>
}
export default App;