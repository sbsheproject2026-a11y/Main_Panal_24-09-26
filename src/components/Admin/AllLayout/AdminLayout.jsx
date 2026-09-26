 import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useEffect(()=>{

if(sidebarOpen)
{
 document.body.classList.add("toggle-sidebar");
}
else
{
 document.body.classList.remove("toggle-sidebar");
}

},[sidebarOpen]);
  return (
    <div className="d-flex flex-column min-vh-100">

    <Header 
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
            />

      <div className="d-flex flex-grow-1">
       <Sidebar 
                sidebarOpen={sidebarOpen}
            />

        <main id="main" className="main flex-grow-1">
          <div className="pagetitle">
            <Outlet />
          </div>
        </main>

      </div>

      {/* <Footer /> */}

    </div>
  );
}

export default AdminLayout;