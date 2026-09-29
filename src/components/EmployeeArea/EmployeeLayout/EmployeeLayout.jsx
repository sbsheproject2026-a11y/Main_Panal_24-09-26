 import React, { useEffect, useState } from "react";
import EmployeeSidebar from "./EmployeeSidebar";
    // ⬅️ ADD
import { Outlet } from "react-router-dom";
import Header from "../../AdminArea/AllLayout/Header";
import FranchiseSidebar from "../FranchiseLayout/FranchiseSidebar";

function EmployeeLayout() {
    const roleId = String(localStorage.getItem("RoleId") || "").trim();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.classList.add("toggle-sidebar");
        } else {
            document.body.classList.remove("toggle-sidebar");
        }
    }, [sidebarOpen]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

            <div className="d-flex flex-grow-1">

                {/* ⬇️ CONDITION: Role 33 → FranchiseSidebar, warna EmployeeSidebar */}
                {roleId === "33" ? (
                    < EmployeeSidebar sidebarOpen={sidebarOpen} />
                ) : (
                    <FranchiseSidebar sidebarOpen={sidebarOpen} />
                )}

                <main id="main" className="main flex-grow-1">
                    <div className="pagetitle">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EmployeeLayout;