import React from 'react'
import { Link } from 'react-router-dom'

function EmployeeSidebar({ sidebarOpen }) {
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
                <Link to="/emp-franchise-list">
                  <i className="bi bi-circle"></i><span>Franchise List</span>
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
            <a className="nav-link collapsed" data-bs-target="#charts-nav-online" data-bs-toggle="collapse" href="#">
              <i className="bi bi-bar-chart"></i><span>Online/Offline Student  </span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="charts-nav-online" className="nav-content collapse " data-bs-parent="#sidebar-nav">


              {/* <li>
                <Link to="/student-rollno?studyModeId=88">
                  <i className="bi bi-circle"></i><span>Student RollNo  List Online</span>
                </Link>
              </li> */}

              <li>
                <Link to="/student-print-list?studyModeId=88">
                  <i className="bi bi-circle"></i>
                  <span>Student Confirm & Print Online</span>
                </Link>
              </li>

  <li>
                <Link to="/student-print-list?studyModeId=89">
                  <i className="bi bi-circle"></i>
                  <span>Student Confirm & Print Offline</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* <!-- End Tables Nav --> */}

        
          {/* <!-- End Charts Nav --> */}

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#charts-nav-req" data-bs-toggle="collapse" href="#">
              <i className="bi bi-bar-chart"></i><span>Student  Request</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="charts-nav-req" className="nav-content collapse " data-bs-parent="#sidebar-nav">


              <li>
                <Link to="/set-marks">
                  <i className="bi bi-circle"></i><span>Set Marks</span>
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

export default EmployeeSidebar