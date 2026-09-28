 import React from "react";
import {
  FaUserGraduate,
  FaUserPlus,
  FaMoneyBillWave,
  FaBookOpen,
  FaCertificate,
  FaClipboardCheck,
  FaArrowUp,
  FaArrowRight,
  FaBell,
  FaPlus,
} from "react-icons/fa";

const FranchiseDashboard = () => {
  const stats = [
    {
      title: "Total Students",
      value: "1,250",
      change: "+12.5%",
      icon: <FaUserGraduate />,
      color: "#4f46e5",
      bg: "#eef2ff",
    },
    {
      title: "New Admissions",
      value: "86",
      change: "+8.2%",
      icon: <FaUserPlus />,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      title: "Pending Fees",
      value: "₹2,45,000",
      change: "+5.4%",
      icon: <FaMoneyBillWave />,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      title: "Active Courses",
      value: "12",
      change: "+2 New",
      icon: <FaBookOpen />,
      color: "#16a34a",
      bg: "#f0fdf4",
    },
  ];

  const students = [
    {
      name: "Rahul Kumar",
      course: "DCA",
      admission: "ADM-2026-001",
      date: "05 Sep 2026",
      status: "Active",
    },
    {
      name: "Amit Sharma",
      course: "ADCA",
      admission: "ADM-2026-002",
      date: "04 Sep 2026",
      status: "Active",
    },
    {
      name: "Neha Singh",
      course: "Tally Prime",
      admission: "ADM-2026-003",
      date: "03 Sep 2026",
      status: "Pending",
    },
    {
      name: "Pooja Verma",
      course: "PGDCA",
      admission: "ADM-2026-004",
      date: "02 Sep 2026",
      status: "Active",
    },
  ];

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Franchise Dashboard</h3>
          <p className="text-muted mb-0">
            Welcome back! Here's what's happening at your centre.
          </p>
        </div>

         
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((item, index) => (
          <div className="col-xl-3 col-md-6" key={index}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-2">{item.title}</p>

                    <h3 className="fw-bold mb-2">
                      {item.value}
                    </h3>

                    <small className="text-success fw-semibold">
                      <FaArrowUp size={11} className="me-1" />
                      {item.change}
                    </small>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: item.bg,
                      color: item.color,
                      fontSize: "22px",
                    }}
                  >
                    {item.icon}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="row g-4">

        {/* Admission Overview */}
        <div className="col-xl-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bold mb-1">
                    Admission Overview
                  </h5>
                  <small className="text-muted">
                    Monthly admission performance
                  </small>
                </div>

                <select className="form-select form-select-sm w-auto">
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>

              {/* Simple Chart */}
              <div
                className="d-flex align-items-end justify-content-between px-3"
                style={{ height: "250px" }}
              >
                {[
                  ["Jan", 45],
                  ["Feb", 60],
                  ["Mar", 52],
                  ["Apr", 75],
                  ["May", 68],
                  ["Jun", 90],
                  ["Jul", 72],
                  ["Aug", 95],
                  ["Sep", 82],
                  ["Oct", 70],
                  ["Nov", 88],
                  ["Dec", 100],
                ].map(([month, height], index) => (
                  <div
                    key={index}
                    className="d-flex flex-column align-items-center"
                    style={{ width: "7%" }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: `${height * 2}px`,
                        maxHeight: "190px",
                        background:
                          "linear-gradient(180deg, #4f46e5, #818cf8)",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>

                    <small className="text-muted mt-2">
                      {month}
                    </small>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

         
        {/* Fee Overview */}
        <div className="col-xl-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-4">

              <h5 className="fw-bold mb-1">
                Fee Overview
              </h5>

              <small className="text-muted">
                Current month collection
              </small>

              <div className="text-center my-4">

                <div
                  className="mx-auto d-flex flex-column align-items-center justify-content-center"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background:
                      "conic-gradient(#4f46e5 0% 72%, #e5e7eb 72% 100%)",
                  }}
                >
                  <div
                    className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center"
                    style={{
                      width: "115px",
                      height: "115px",
                    }}
                  >
                    <h4 className="fw-bold mb-0">
                      72%
                    </h4>

                    <small className="text-muted">
                      Collected
                    </small>
                  </div>
                </div>

              </div>

              <div className="d-flex justify-content-between border-bottom py-2">
                <span className="text-muted">
                  Collected
                </span>
                <strong className="text-success">
               
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">
                  Pending
                </span>
                <strong className="text-danger">
                  
                </strong>
              </div>

            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    Institute Notices
                  </h5>

                  <small className="text-muted">
                    Latest announcements from institute
                  </small>
                </div>

                <button className="btn btn-sm btn-outline-primary">
                  View All
                </button>
              </div>

              <div className="list-group list-group-flush">

                <div className="list-group-item px-0 d-flex align-items-center">
                  <div
                    className="rounded-circle p-3 me-3"
                    style={{
                      background: "#eef2ff",
                      color: "#4f46e5",
                    }}
                  >
                    <FaBell />
                  </div>

                  <div>
                    <h6 className="mb-1 fw-semibold">
                      New examination schedule announced
                    </h6>

                    <small className="text-muted">
                      Today, 10:30 AM
                    </small>
                  </div>
                </div>

                <div className="list-group-item px-0 d-flex align-items-center">
                  <div
                    className="rounded-circle p-3 me-3"
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                    }}
                  >
                    <FaCertificate />
                  </div>

                  <div>
                    <h6 className="mb-1 fw-semibold">
                      Certificate verification is now available
                    </h6>

                    <small className="text-muted">
                      Yesterday
                    </small>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FranchiseDashboard;
