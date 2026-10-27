

import React from 'react'
import { Link } from 'react-router-dom'

function StudentSidebar({ sidebarOpen }) {
    return (
        <>
            {/* <!-- ======= Sidebar ======= --> */}
            <aside className={`sidebar ${sidebarOpen ? "close" : ""}`}>

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <Link className="nav-link " to="/student-dashboard">
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
             
 

                </ul>

            </aside>
            {/* <!-- End Sidebar--> */}

        </>
    )
}

export default StudentSidebar