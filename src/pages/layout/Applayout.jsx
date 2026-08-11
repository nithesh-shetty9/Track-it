import { Outlet } from "react-router"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { Footer } from "./Footer"

export const Applayout=(()=>{
    return(
    <>
    <Navbar/>
        <main>
            <Sidebar/>
            <Outlet/>
        </main>
        <Footer/>
    </>
    );
});