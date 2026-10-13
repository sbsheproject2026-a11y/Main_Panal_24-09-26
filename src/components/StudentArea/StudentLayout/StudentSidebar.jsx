

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
                    {/* <!-- End Dashboard Nav --> */}


                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#franchise-nav" data-bs-toggle="collapse" href="#">
                            <i className="bi bi-bar-chart"></i><span>Student</span><i className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="franchise-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">

                            <li>
                                <Link
                                    to={`/admission-form-print/${localStorage.getItem("UserId")}`}
                                >
                                    <i className="bi bi-circle"></i>
                                    <span>Profile Print</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/id-card/${localStorage.getItem("UserId")}`}
                                >
                                    <i className="bi bi-circle"></i>
                                    <span>ID-Card </span>
                                </Link>
                            </li>

                            {/* <li>
                                <Link
                                    to={`/admit-card-print/${localStorage.getItem("UserId")}`}
                                >
                                    <i className="bi bi-circle"></i>
                                    <span>Admit-Card</span>
                                </Link>
                            </li> */}

                            <li>
                                <Link to="/update-password-student" >
                                    <i className="bi bi-circle"></i>
                                    <span>Update-Password</span>
                                </Link>
                            </li>




                        </ul>
                    </li>





                </ul>

            </aside>
            {/* <!-- End Sidebar--> */}

        </>
    )
}

export default StudentSidebar