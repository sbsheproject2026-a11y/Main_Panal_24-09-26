 import React, { useEffect, useState } from "react";
import { getDashboard } from "../AllServicesFiles/MastertypeService";
import { getEnquiries } from "../AllServicesFiles/EmployeeService";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalStudent: 0,
    totalFranchise: 0,
    totalAccFranchise: 0,
    totalEmployee: 0,
    totalCourse: 0,
  });

  // ✅ Dynamic enquiries state
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadEnquiries();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const result = await getDashboard();

      setDashboardData({
        totalStudent: result?.data?.totalStudent || 0,
        totalFranchise: result?.data?.totalFranchise || 0,
        totalAccFranchise: result?.data?.totalAccFranchise || 0,
        totalEmployee: result?.data?.totalEmployee || 0,
        totalCourse: result?.data?.totalCourse || 0,
      });
    } catch (error) {
      console.error(error);
      alert("Unable to load Dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed loadEnquiries
  const loadEnquiries = async () => {
    try {
      setEnquiryLoading(true);

      const result = await getEnquiries(1);

      // API response: result.data.data (array) — fallback empty array
      setEnquiries(result?.data?.data || []);
    } catch (error) {
      console.log(error);
      setEnquiries([]);
    } finally {
      setEnquiryLoading(false);
    }
  };

  // ✅ Dynamic stats — API data se
  const stats = [
    {
      title: "Total Students",
      value: dashboardData.totalStudent.toLocaleString("en-IN"),
      change: "+12.5%",
      icon: "bi-mortarboard-fill",
      type: "orange",
    },
    {
      title: "Total Employees",
      value: dashboardData.totalEmployee.toLocaleString("en-IN"),
      change: "+8.2%",
      icon: "bi-people-fill",
      type: "blue",
    },
    {
      title: "Total Franchise",
      value: dashboardData.totalFranchise.toLocaleString("en-IN"),
      change: "+5.4%",
      icon: "bi-building-fill",
      type: "green",
    },
    {
      title: "Total Acc. Franchise",
      value: dashboardData.totalAccFranchise.toLocaleString("en-IN"),
      change: "+5.4%",
      icon: "bi-buildings-fill",
      type: "purple",
    },
    {
      title: "Total Courses",
      value: dashboardData.totalCourse.toLocaleString("en-IN"),
      change: "+3.1%",
      icon: "bi-book-half",
      type: "purple",
    },
  ];

  return (
    <>
      <style>{`
        .dashboard-wrapper {
          background: #f6f8fb;
          min-height: 100vh;
        }

        .dashboard-header {
          margin-bottom: 24px;
        }

        .dashboard-title {
          font-size: 25px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .dashboard-subtitle {
          color: #7b8494;
          font-size: 14px;
          margin-bottom: 0;
        }

        .welcome-card {
          background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
          border: 0;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          color: #fff;
          min-height: 145px;
        }

        .welcome-card::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          right: -70px;
          top: -100px;
        }

        .welcome-card::after {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          right: 80px;
          bottom: -100px;
        }

        .welcome-content {
          position: relative;
          z-index: 2;
        }

        .welcome-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .welcome-text {
          font-size: 14px;
          opacity: 0.9;
          max-width: 650px;
          margin-bottom: 0;
        }

        .welcome-icon {
          position: absolute;
          right: 35px;
          top: 32px;
          font-size: 70px;
          opacity: 0.15;
          z-index: 1;
        }

        .stat-card {
          background: #fff;
          border: 1px solid #edf0f4;
          border-radius: 15px;
          padding: 20px;
          height: 100%;
          transition: all 0.25s ease;
          box-shadow: 0 3px 15px rgba(30, 41, 59, 0.04);
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(30, 41, 59, 0.08);
        }

        .stat-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-icon.orange {
          background: rgba(255, 102, 0, 0.12);
          color: #ff6600;
        }

        .stat-icon.blue {
          background: rgba(13, 110, 253, 0.11);
          color: #0d6efd;
        }

        .stat-icon.green {
          background: rgba(25, 135, 84, 0.11);
          color: #198754;
        }

        .stat-icon.purple {
          background: rgba(111, 66, 193, 0.11);
          color: #6f42c1;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 600;
          padding: 5px 9px;
          border-radius: 20px;
          background: #ecfdf3;
          color: #198754;
        }

        .stat-title {
          color: #7b8494;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 27px;
          font-weight: 700;
          color: #202938;
          line-height: 1.2;
        }

        .dashboard-card {
          background: #fff;
          border: 1px solid #edf0f4;
          border-radius: 15px;
          box-shadow: 0 3px 15px rgba(30, 41, 59, 0.04);
          height: 100%;
        }

        .dashboard-card-header {
          padding: 20px 20px 15px;
          border-bottom: 1px solid #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dashboard-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #202938;
          margin: 0;
        }

        .dashboard-card-subtitle {
          font-size: 12px;
          color: #8b94a3;
          margin-top: 3px;
        }

        .chart-body {
          padding: 20px;
        }

        .bar-chart {
          height: 260px;
          display: flex;
          align-items: flex-end;
          gap: 18px;
          padding: 15px 5px 0;
        }

        .bar-item {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
        }

        .bar-value {
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
        }

        .bar {
          width: 100%;
          max-width: 34px;
          border-radius: 7px 7px 3px 3px;
          background: linear-gradient(to top, #ff6600, #ff9b66);
          min-height: 25px;
          transition: all 0.3s ease;
        }

        .bar:hover {
          opacity: 0.8;
          transform: scaleY(1.03);
        }

        .bar-label {
          font-size: 11px;
          color: #8b94a3;
        }

        .chart-grid {
          border-top: 1px dashed #e8ebef;
          position: relative;
          top: -245px;
          height: 245px;
          pointer-events: none;
        }

        .enquiry-chart {
          padding: 20px;
        }

        .donut-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          min-height: 260px;
        }

        .donut {
          width: 175px;
          height: 175px;
          border-radius: 50%;
          background: conic-gradient(
            #ff6600 0deg 180deg,
            #0d6efd 180deg 270deg,
            #198754 270deg 324deg,
            #e9ecef 324deg 360deg
          );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .donut::after {
          content: "";
          position: absolute;
          width: 112px;
          height: 112px;
          border-radius: 50%;
          background: #fff;
        }

        .donut-center {
          position: absolute;
          z-index: 2;
          text-align: center;
        }

        .donut-total {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #202938;
        }

        .donut-label {
          display: block;
          font-size: 11px;
          color: #8b94a3;
        }

        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 13px;
          color: #596273;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 9px;
        }

        .legend-value {
          margin-left: auto;
          font-weight: 700;
          color: #202938;
        }

        .table-card {
          overflow: hidden;
        }

        .dashboard-table {
          margin-bottom: 0;
        }

        .dashboard-table thead th {
          background: #fafbfc;
          border-bottom: 1px solid #edf0f4;
          color: #697386;
          font-size: 12px;
          font-weight: 600;
          padding: 13px 16px;
          white-space: nowrap;
        }

        .dashboard-table tbody td {
          padding: 14px 16px;
          vertical-align: middle;
          border-bottom: 1px solid #f0f2f5;
          font-size: 13px;
          color: #596273;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .student-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff0e8;
          color: #ff6600;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
        }

        .student-name {
          font-weight: 600;
          color: #273142;
        }

        .student-course {
          font-size: 11px;
          color: #9299a5;
          margin-top: 2px;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 20px;
        }

        .status-active {
          color: #198754;
          background: #eaf8f0;
        }

        .status-pending {
          color: #b7791f;
          background: #fff8e5;
        }

        .status-new {
          color: #ff6600;
          background: #fff0e8;
        }

        .status-contacted {
          color: #0d6efd;
          background: #edf4ff;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border: 1px solid #edf0f4;
          border-radius: 11px;
          margin-bottom: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          background: #fff;
        }

        .quick-action:hover {
          border-color: rgba(255,102,0,0.3);
          background: #fffaf7;
          transform: translateX(3px);
        }

        .quick-action-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff0e8;
          color: #ff6600;
          font-size: 18px;
        }

        .quick-action-title {
          color: #273142;
          font-size: 13px;
          font-weight: 600;
        }

        .quick-action-text {
          color: #9299a5;
          font-size: 11px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          position: relative;
          padding-bottom: 18px;
        }

        .activity-item:last-child {
          padding-bottom: 0;
        }

        .activity-line {
          position: absolute;
          left: 15px;
          top: 32px;
          bottom: 0;
          width: 1px;
          background: #e8ebef;
        }

        .activity-item:last-child .activity-line {
          display: none;
        }

        .activity-icon {
          width: 31px;
          height: 31px;
          min-width: 31px;
          border-radius: 50%;
          background: #fff0e8;
          color: #ff6600;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          position: relative;
          z-index: 2;
        }

        .activity-text {
          font-size: 12px;
          color: #596273;
          line-height: 1.5;
        }

        .activity-text strong {
          color: #273142;
        }

        .activity-time {
          display: block;
          color: #a0a7b2;
          font-size: 10px;
          margin-top: 3px;
        }

        .view-all {
          color: #ff6600;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
        }

        .view-all:hover {
          color: #e85b00;
        }

        @media (max-width: 991px) {
          .welcome-icon {
            display: none;
          }

          .donut-wrapper {
            flex-direction: column;
            gap: 15px;
          }
        }

        @media (max-width: 576px) {
          .dashboard-title {
            font-size: 21px;
          }

          .welcome-card {
            min-height: 165px;
          }

          .bar-chart {
            gap: 8px;
          }

          .bar {
            max-width: 24px;
          }

          .donut {
            width: 145px;
            height: 145px;
          }

          .donut::after {
            width: 95px;
            height: 95px;
          }
        }
      `}</style>

      <div className="dashboard-wrapper p-3 p-md-4">
        <div className="container-fluid">

          <div className="dashboard-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="dashboard-title">Dashboard</h2>
              <p className="dashboard-subtitle">
                Welcome back! Here's what's happening with your organization today.
              </p>
            </div>
          </div>

          <div className="card welcome-card mb-4">
            <div className="card-body p-4 d-flex align-items-center welcome-content">
              <div>
                <div className="welcome-title">
                  Welcome to SBSHE Admin Panel 👋
                </div>
                <p className="welcome-text">
                  Manage students, employees, franchises, courses and enquiries
                  from one powerful dashboard.
                </p>
              </div>

              <i className="bi bi-speedometer2 welcome-icon"></i>
            </div>
          </div>

          <div className="row g-3 mb-4">
            {stats.map((item, index) => (
              <div className="col-xl-3 col-md-6" key={index}>
                <div className="stat-card">
                  <div className="stat-top">
                    <div className={`stat-icon ${item.type}`}>
                      <i className={`bi ${item.icon}`}></i>
                    </div>

                    <span className="stat-change">
                      <i className="bi bi-arrow-up me-1"></i>
                      {item.change}
                    </span>
                  </div>

                  <div className="stat-title">{item.title}</div>
                  <div className="stat-value">
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm text-secondary"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3 mb-4">

            <div className="col-xl-8">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div>
                    <h5 className="dashboard-card-title">
                      Admission Overview
                    </h5>
                    <div className="dashboard-card-subtitle">
                      Monthly student admissions
                    </div>
                  </div>

                  <select
                    className="form-select form-select-sm"
                    style={{ width: "110px" }}
                  >
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>

                <div className="chart-body">
                  <div className="bar-chart">
                    {[
                      ["Jan", 55],
                      ["Feb", 72],
                      ["Mar", 48],
                      ["Apr", 88],
                      ["May", 67],
                      ["Jun", 95],
                      ["Jul", 75],
                      ["Aug", 105],
                      ["Sep", 90],
                      ["Oct", 70],
                      ["Nov", 82],
                      ["Dec", 65],
                    ].map(([month, value], index) => (
                      <div className="bar-item" key={index}>
                        <span className="bar-value">{value}</span>
                        <div
                          className="bar"
                          style={{ height: `${value * 1.7}px` }}
                        ></div>
                        <span className="bar-label">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div>
                    <h5 className="dashboard-card-title">
                      Enquiry Overview
                    </h5>
                    <div className="dashboard-card-subtitle">
                      Current enquiry status
                    </div>
                  </div>

                  <i
                    className="bi bi-three-dots"
                    style={{ color: "#9299a5" }}
                  ></i>
                </div>

                <div className="enquiry-chart">
                  <div className="donut-wrapper">
                    <div className="donut">
                      <div className="donut-center">
                        <span className="donut-total">248</span>
                        <span className="donut-label">Total</span>
                      </div>
                    </div>

                    <div style={{ width: "150px" }}>
                      <div className="legend-item">
                        <span
                          className="legend-dot"
                          style={{ background: "#ff6600" }}
                        ></span>
                        New
                        <span className="legend-value">124</span>
                      </div>

                      <div className="legend-item">
                        <span
                          className="legend-dot"
                          style={{ background: "#0d6efd" }}
                        ></span>
                        Contacted
                        <span className="legend-value">62</span>
                      </div>

                      <div className="legend-item">
                        <span
                          className="legend-dot"
                          style={{ background: "#198754" }}
                        ></span>
                        Converted
                        <span className="legend-value">38</span>
                      </div>

                      <div className="legend-item mb-0">
                        <span
                          className="legend-dot"
                          style={{ background: "#e9ecef" }}
                        ></span>
                        Closed
                        <span className="legend-value">24</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="row g-3 mb-4">

            <div className="col-xl-8">
              <div className="dashboard-card table-card">
                <div className="dashboard-card-header">
                  <div>
                    <h5 className="dashboard-card-title">
                      Recent Enquiries
                    </h5>
                    <div className="dashboard-card-subtitle">
                      Latest student enquiries
                    </div>
                  </div>

                  <a href="/enquiries" className="view-all">
                    View All
                    <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>

                <div className="table-responsive">
                  <table className="table dashboard-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Course</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* ✅ Loading state */}
                      {enquiryLoading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <span
                              className="spinner-border spinner-border-sm text-secondary"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="ms-2 text-muted">
                              Loading enquiries...
                            </span>
                          </td>
                        </tr>
                      ) : enquiries.length === 0 ? (
                        /* ✅ Empty state */
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No enquiries found.
                          </td>
                        </tr>
                      ) : (
                        /* ✅ Dynamic rows */
                        enquiries.slice(0, 5).map((item, index) => {
                          const name = item?.name || item?.studentName || "N/A";
                          const mobile = item?.mobile || item?.mobileNo || item?.contactNo || "—";
                          const course = item?.course || item?.courseName || "—";
                          const date =   item?.enquiryDate || "—";
                          const status = item?.status || item?.enquiryStatus || "New";

                          return (
                            <tr key={item?.id || index}>
                              <td>
                                <div className="student-info">
                                  <div className="student-avatar">
                                    {String(name).charAt(0).toUpperCase()}
                                  </div>

                                  <div className="student-name">
                                    {name}
                                  </div>
                                </div>
                              </td>

                              <td>{mobile}</td>
                              <td>{course}</td>
                              <td>{date}</td>

                              <td>
                                <span
                                  className={`status-badge ${
                                    status === "New"
                                      ? "status-new"
                                      : status === "Contacted"
                                      ? "status-contacted"
                                      : "status-pending"
                                  }`}
                                >
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div>
                    <h5 className="dashboard-card-title">
                      Quick Actions
                    </h5>
                    <div className="dashboard-card-subtitle">
                      Frequently used options
                    </div>
                  </div>
                </div>

                <div className="p-3">

                  <a href="/send-to-confirm-student" className="quick-action">
                    <div className="quick-action-icon">
                      <i className="bi bi-person-plus-fill"></i>
                    </div>
                    <div>
                      <div className="quick-action-title">
                        Confirm Request
                      </div>
                      <div className="quick-action-text">
                        Confirm Request for new student
                      </div>
                    </div>
                    <i className="bi bi-chevron-right ms-auto text-muted"></i>
                  </a>

                  <a href="/employee-list" className="quick-action">
                    <div className="quick-action-icon">
                      <i className="bi bi-person-badge-fill"></i>
                    </div>
                    <div>
                      <div className="quick-action-title">
                         Employee List
                      </div>
                      <div className="quick-action-text">
                          employee profile
                      </div>
                    </div>
                    <i className="bi bi-chevron-right ms-auto text-muted"></i>
                  </a>

                  <a href="/franchise-list" className="quick-action">
                    <div className="quick-action-icon">
                      <i className="bi bi-building-add"></i>
                    </div>
                    <div>
                      <div className="quick-action-title">
                      Franchise List
                      </div>
                      <div className="quick-action-text">
                      new franchise
                      </div>
                    </div>
                    <i className="bi bi-chevron-right ms-auto text-muted"></i>
                  </a>

                  <a href="/enquiries-list?type=franchise" className="quick-action mb-0">
                    <div className="quick-action-icon">
                      <i className="bi bi-chat-left-text-fill"></i>
                    </div>
                    <div>
                      <div className="quick-action-title">
                        View Enquiries
                      </div>
                      <div className="quick-action-text">
                        Manage student enquiries
                      </div>
                    </div>
                    <i className="bi bi-chevron-right ms-auto text-muted"></i>
                  </a>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;