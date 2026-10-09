import React from 'react'
import { Link } from 'react-router-dom'

function FranchiseSidebar({ sidebarOpen }) {
  return (
    <>
      {/* <!-- ======= Sidebar ======= --> */}
      <aside className={`sidebar ${sidebarOpen ? "close" : ""}`}>

        <ul className="sidebar-nav" id="sidebar-nav">

          <li className="nav-item">
            <Link className="nav-link " to="/employee-dashboard">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          {/* <!-- End Dashboard Nav --> */}


          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#franchise-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-bar-chart"></i><span>Franchise</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="franchise-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
             
              <li>
                <Link to="/profile">
                  <i className="bi bi-circle"></i><span>Profile</span>
                </Link>
              </li>


              <li>
                <Link
                  to={`/authority-letterPrint-print/${localStorage.getItem("UserId")}`}
                >
                  <i className="bi bi-circle"></i>
                  <span>Authority-Letter</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/id-card-print/${localStorage.getItem("UserId")}`}
                >
                  <i className="bi bi-circle"></i>
                  <span>ID-Card </span>
                </Link>
              </li>

              <li>
                <Link
                  to={`/details-update/${localStorage.getItem("UserId")}`}
                >
                  <i className="bi bi-circle"></i>
                  <span>Profile Update Document</span>
                </Link>
              </li>
              <li>
                <Link to="/update-password" >
                  <i className="bi bi-circle"></i>
                  <span>Update-Password</span>
                </Link>
              </li>




            </ul>
          </li>

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#charts-nav-wallet" data-bs-toggle="collapse" href="#">
              <i className="bi bi-bar-chart"></i><span>Wallet</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="charts-nav-wallet" className="nav-content collapse " data-bs-parent="#sidebar-nav">

              <li>
                <Link to="/wallet-recharge">
                  <i className="bi bi-circle"></i><span>Wallet Recharge</span>
                </Link>
              </li>
              <li>
                <Link to="/wallet-history">
                  <i className="bi bi-circle"></i><span>Wallet History</span>
                </Link>
              </li>
              

            </ul>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#charts-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-bar-chart"></i><span>Student</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="charts-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">

              <li>
                <Link to="/student-create">
                  <i className="bi bi-circle"></i><span>Add Student</span>
                </Link>
              </li>
              <li>
                <Link to="/student-list">
                  <i className="bi bi-circle"></i><span>Student List</span>
                </Link>
              </li>
              <li>
                <Link to="/student-to-confirm">
                  <i className="bi bi-circle"></i><span>Student Confirm & Print</span>
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

export default FranchiseSidebar