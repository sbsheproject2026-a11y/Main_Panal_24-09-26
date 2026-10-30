 

import { useEffect, useState } from "react";
import Header from "../../AdminArea/AllLayout/Header";
import StudentSidebar from "./StudentSidebar";
import { Outlet } from "react-router-dom";
 
 

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {

    if (sidebarOpen) {
      document.body.classList.add("toggle-sidebar");
    }
    else {
      document.body.classList.remove("toggle-sidebar");
    }

  }, [sidebarOpen]);
  return (
    <div className="d-flex flex-column min-vh-100">

      <Header
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />

      <div className="d-flex flex-grow-1">
        {/* <StudentSidebar
          sidebarOpen={sidebarOpen}
        /> */}

        <main id=" " className="main flex-grow-1">
          <div className="pagetitle">
            <Outlet />
          </div>
        </main>

      </div>

      {/* <Footer /> */}

    </div>
  );
}

export default StudentLayout;