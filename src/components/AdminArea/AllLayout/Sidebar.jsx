import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar({ sidebarOpen }) {
  return (
    <>
      {/* <!-- ======= Sidebar ======= --> */}
      <aside className={`sidebar ${sidebarOpen ? "close" : ""}`}>

        <ul className="sidebar-nav" id="sidebar-nav">

          <li className="nav-item">
            <Link className="nav-link " to="/dashboard">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          {/* <!-- End Dashboard Nav --> */}

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-menu-button-wide"></i><span>Course Details</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="components-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
              <li>
                <Link to="department">
                  <i className="bi bi-circle"></i><span>Department</span>
                </Link>
              </li>
              <li>
                <Link to="course-category">
                  <i className="bi bi-circle"></i><span>Course Category</span>
                </Link>
              </li>

              <li>
                <Link to="/course-list">
                  <i className="bi bi-circle"></i><span>Course List</span>
                </Link>
              </li>



            </ul>
          </li>
          {/* <!-- End Components Nav --> */}

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-journal-text"></i><span>Authority</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="forms-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
              {/* <li>
                <Link to="/franchise-create">
                  <i className="bi bi-circle"></i><span>Franchise Add</span>
                </Link>
              </li> */}
              <li>
                <Link to="/franchise-list">
                  <i className="bi bi-circle"></i><span>Confirm Study Centre List</span>
                </Link>
              </li>

              <li>
                <Link to="/acc-list">
                  <i className="bi bi-circle"></i><span>Confirm Acc List</span>
                </Link>
              </li>
              <li>
                <Link to="/acc-pending">
                  <i className="bi bi-circle"></i><span>Pending  List</span>
                </Link>
              </li>
              <li>
                <Link to="/reject-list">
                  <i className="bi bi-circle"></i><span>Reject  List</span>
                </Link>
              </li>
              <li>
                <Link to="/Course-commission">
                  <i className="bi bi-circle"></i><span> Set Course Commission</span>
                </Link>
              </li>
              <li>
                <Link to="/franchise-commission">
                  <i className="bi bi-circle"></i><span>Set Franchise Commission</span>
                </Link>
              </li>


            </ul>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#forms-nav-acc" data-bs-toggle="collapse" href="#">
              <i className="bi bi-journal-text"></i><span>Acc Acount List</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="forms-nav-acc" className="nav-content collapse " data-bs-parent="#sidebar-nav">
              
              


            </ul>
          </li> */}
          {/* <!-- End Forms Nav --> */}

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-layout-text-window-reverse"></i><span>Master Detail</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="tables-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
              <li>
                <Link to="/mastertype">
                  <i className="bi bi-circle"></i><span>Master Type</span>
                </Link>
              </li>
              <li>
                <Link to="/mastertypeDetails">
                  <i className="bi bi-circle"></i><span>Master Type Detail</span>
                </Link>
              </li>
              <li>
                <Link to="/mastersession">
                  <i className="bi bi-circle"></i><span> Exam Session</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* <!-- End Tables Nav --> */}

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#charts-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-bar-chart"></i><span>Student Management</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="charts-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">

              <li>
                <Link to="/send-to-confirm-student">
                  <i className="bi bi-circle"></i><span>Confirm Student</span>
                </Link>
              </li>
              <li>
                <Link to="/student-rollno-list?studyModeId=88">
                  <i className="bi bi-circle"></i><span>Student RollNo  List Online</span>
                </Link>
              </li>
              <li>
                <Link to="/student-rollno-list?studyModeId=89">
                  <i className="bi bi-circle"></i><span>Student RollNo  List Offline</span>
                </Link>
              </li>

              <li>
                <Link to="/student-upgrade">
                  <i className="bi bi-circle"></i><span>Upgrade Student</span>
                </Link>
              </li>
              <li>
                <Link to="/confirm-addmissions?studyModeId=88">
                  <i className="bi bi-circle"></i>
                  <span>Student Confirm & Print Online</span>
                </Link>
              </li>
              <li>
                <Link to="/confirm-addmissions?studyModeId=89">
                  <i className="bi bi-circle"></i>
                  <span>Student Confirm & Print Offline</span>
                </Link>
              </li>
              <li>
                <Link to="/student-setmarks">
                  <i className="bi bi-circle"></i><span>Set Marks</span>
                </Link>
              </li>

            </ul>
          </li>
          {/* <!-- End Charts Nav --> */}
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#charts-nav-wallet" data-bs-toggle="collapse" href="#">
              <i className="bi bi-bar-chart"></i><span>Wallet</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="charts-nav-wallet" className="nav-content collapse " data-bs-parent="#sidebar-nav">

              <li>
                <Link to="/admin-wallet-recharge">
                  <i className="bi bi-circle"></i><span>Wallet Recharge</span>
                </Link>
              </li>
              <li>
                <Link to="/pending-wallet-request">
                  <i className="bi bi-circle"></i><span>Pending Wallet Request</span>
                </Link>
              </li>
              <li>
                <Link to="/admin-wallet-list">
                  <i className="bi bi-circle"></i><span>Wallet History</span>
                </Link>
              </li>


            </ul>
          </li>

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#forms-nav-website" data-bs-toggle="collapse" href="#">
              <i className="bi bi-journal-text"></i><span>Website Content</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="forms-nav-website" className="nav-content collapse " data-bs-parent="#sidebar-nav">


              <li>
                <Link to="/website-content">
                  <i className="bi bi-circle"></i><span>Website Content</span>
                </Link>
              </li>

            </ul>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-gem"></i><span>Employee</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="icons-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">

              <li>
                <Link to="/employee-list">
                  <i className="bi bi-circle"></i><span>List</span>
                </Link>
              </li>
              <li>
                <Link to="/employee-frenchise-assign">
                  <i className="bi bi-circle"></i><span>Assign</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#icons-navf" data-bs-toggle="collapse" href="#">
              <i className="bi bi-gem"></i><span>Enquiry   Management</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="icons-navf" className="nav-content collapse " data-bs-parent="#sidebar-nav">

              <li>
                <Link to="/enquiries-list?type=student">
                  <i className="bi bi-circle"></i>
                  <span>Student Enquiries</span>
                </Link>
              </li>

              <li>
                <Link to="/enquiries-list?type=franchise">
                  <i className="bi bi-circle"></i>
                  <span>Franchise Enquiries</span>
                </Link>
              </li>
              <li>
                <Link to="r-t-i-list">
                  <i className="bi bi-circle"></i>
                  <span>RTI List</span>
                </Link>
              </li>


            </ul>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#icons-navl" data-bs-toggle="collapse" href="#">
              <i className="bi bi-gem"></i><span>Location</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="icons-navl" className="nav-content collapse " data-bs-parent="#sidebar-nav">

              <li>
                <Link to="/state">
                  <i className="bi bi-circle"></i>
                  <span>State List</span>
                </Link>
              </li>

              <li>
                <Link to="/district">
                  <i className="bi bi-circle"></i>
                  <span>District List</span>
                </Link>
              </li>
              <li>
                <Link to="/city">
                  <i className="bi bi-circle"></i>
                  <span>City List</span>
                </Link>
              </li>


            </ul>
          </li>
          {
      /* <!-- End Icons Nav --> */}


        </ul>

      </aside>
      {/* <!-- End Sidebar--> */}

    </>
  )
}

export default Sidebar