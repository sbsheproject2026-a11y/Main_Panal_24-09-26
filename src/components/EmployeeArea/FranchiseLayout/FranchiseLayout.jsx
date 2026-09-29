import React, { useEffect, useState } from "react";

import FranchiseSidebar from "./FranchiseSidebar";

import { Outlet } from "react-router-dom";
import Header from "../../AdminArea/AllLayout/Header";
 

function FranchiseLayout() {
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
        <FranchiseSidebar
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

export default FranchiseLayout;