 import React from "react";
import {
  FaBookOpen,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaCertificate,
  FaCalendarAlt,
  FaBell,
  FaArrowRight,
  FaPlayCircle,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const StudentDashboard = () => {
  const stats = [
    {
      title: "My Courses",
      value: "3",
      icon: <FaBookOpen />,
      color: "#4f46e5",
      bg: "#eef2ff",
    },
    {
      title: "Attendance",
      value: "87%",
      icon: <FaClipboardCheck />,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      title: "Pending Fees",
      value: "₹4,500",
      icon: <FaMoneyBillWave />,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      title: "Certificates",
      value: "2",
      icon: <FaCertificate />,
      color: "#16a34a",
      bg: "#f0fdf4",
    },
  ];

  const courses = [
    {
      name: "Advanced Diploma in Computer Application",
      shortName: "ADCA",
      progress: 75,
      lessons: "24 / 32 Lessons",
      color: "#4f46e5",
    },
    {
      name: "Tally Prime",
      shortName: "Tally",
      progress: 60,
      lessons: "12 / 20 Lessons",
      color: "#0891b2",
    },
    {
      name: "Digital Marketing",
      shortName: "DM",
      progress: 40,
      lessons: "8 / 20 Lessons",
      color: "#d97706",
    },
  ];

  const notices = [
    {
      title: "Your ADCA examination schedule has been announced.",
      date: "Today, 10:30 AM",
    },
    {
      title: "Your certificate is ready for download.",
      date: "Yesterday",
    },
    {
      title: "New study material has been uploaded.",
      date: "02 Sep 2026",
    },
  ];

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            Student Dashboard
          </h3>

          <p className="text-muted mb-0">
            Welcome back, Rahul Kumar! 👋
          </p>
        </div>

        <div className="d-flex gap-2">

          <button
            className="btn btn-light border position-relative"
            style={{ width: "42px", height: "42px" }}
          >
            <FaBell />

            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "9px" }}
            >
              3
            </span>
          </button>

          <button className="btn btn-primary">
            My Profile
          </button>

        </div>
      </div>

      {/* Student Info */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderRadius: "15px",
          background:
            "linear-gradient(135deg, #4f46e5, #6366f1)",
          color: "#fff",
        }}
      >
        <div className="card-body p-4">

          <div className="row align-items-center">

            <div className="col-md-8">
              <div className="d-flex align-items-center">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(255,255,255,0.2)",
                    fontSize: "25px",
                    fontWeight: "700",
                  }}
                >
                  RK
                </div>

                <div>
                  <h4 className="fw-bold mb-1">
                    Rahul Kumar
                  </h4>

                  <p className="mb-1 opacity-75">
                    Student ID: STD-2026-001
                  </p>

                  <small className="opacity-75">
                    Course: ADCA | Batch: Morning
                  </small>
                </div>

              </div>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">

              <small className="opacity-75">
                Overall Course Progress
              </small>

              <h2 className="fw-bold mb-2">
                68%
              </h2>

              <div
                className="progress"
                style={{
                  height: "7px",
                  background: "rgba(255,255,255,0.25)",
                }}
              >
                <div
                  className="progress-bar bg-white"
                  style={{ width: "68%" }}
                ></div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">

        {stats.map((item, index) => (
          <div
            className="col-xl-3 col-md-6"
            key={index}
          >
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <p className="text-muted mb-2">
                      {item.title}
                    </p>

                    <h3 className="fw-bold mb-0">
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: item.bg,
                      color: item.color,
                      fontSize: "21px",
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

      {/* Main Row */}
      <div className="row g-4">

        {/* My Courses */}
        <div className="col-xl-8">

          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "15px" }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                  <h5 className="fw-bold mb-1">
                    My Courses
                  </h5>

                  <small className="text-muted">
                    Your enrolled courses
                  </small>
                </div>

                <button className="btn btn-sm btn-outline-primary">
                  View All
                  <FaArrowRight
                    size={11}
                    className="ms-2"
                  />
                </button>

              </div>

              {courses.map((course, index) => (
                <div
                  key={index}
                  className="mb-4"
                >

                  <div className="d-flex justify-content-between align-items-center mb-2">

                    <div className="d-flex align-items-center">

                      <div
                        className="d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "10px",
                          background: `${course.color}15`,
                          color: course.color,
                          fontWeight: "700",
                          fontSize: "13px",
                        }}
                      >
                        {course.shortName}
                      </div>

                      <div>
                        <h6 className="fw-semibold mb-1">
                          {course.name}
                        </h6>

                        <small className="text-muted">
                          {course.lessons}
                        </small>
                      </div>

                    </div>

                    <strong
                      style={{ color: course.color }}
                    >
                      {course.progress}%
                    </strong>

                  </div>

                  <div
                    className="progress"
                    style={{
                      height: "7px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${course.progress}%`,
                        background: course.color,
                      }}
                    ></div>
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>

        {/* Upcoming */}
        <div className="col-xl-4">

          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "15px" }}
          >

            <div className="card-body p-4">

              <h5 className="fw-bold mb-1">
                Upcoming
              </h5>

              <small className="text-muted">
                Your upcoming activities
              </small>

              <div className="mt-4">

                <div
                  className="p-3 mb-3"
                  style={{
                    background: "#eef2ff",
                    borderRadius: "12px",
                  }}
                >

                  <div className="d-flex">

                    <div
                      className="me-3"
                      style={{
                        color: "#4f46e5",
                        fontSize: "22px",
                      }}
                    >
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <h6 className="fw-semibold mb-1">
                        ADCA Examination
                      </h6>

                      <small className="text-muted">
                        15 Sep 2026
                      </small>

                      <br />

                      <small className="text-muted">
                        10:00 AM
                      </small>
                    </div>

                  </div>

                </div>

                <div
                  className="p-3 mb-3"
                  style={{
                    background: "#ecfeff",
                    borderRadius: "12px",
                  }}
                >

                  <div className="d-flex">

                    <div
                      className="me-3"
                      style={{
                        color: "#0891b2",
                        fontSize: "22px",
                      }}
                    >
                      <FaClock />
                    </div>

                    <div>
                      <h6 className="fw-semibold mb-1">
                        Tally Class
                      </h6>

                      <small className="text-muted">
                        Today
                      </small>

                      <br />

                      <small className="text-muted">
                        02:00 PM
                      </small>
                    </div>

                  </div>

                </div>

                <div
                  className="p-3"
                  style={{
                    background: "#f0fdf4",
                    borderRadius: "12px",
                  }}
                >

                  <div className="d-flex">

                    <div
                      className="me-3"
                      style={{
                        color: "#16a34a",
                        fontSize: "22px",
                      }}
                    >
                      <FaCheckCircle />
                    </div>

                    <div>
                      <h6 className="fw-semibold mb-1">
                        Assignment Due
                      </h6>

                      <small className="text-muted">
                        10 Sep 2026
                      </small>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="col-xl-8">

          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "15px" }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <h5 className="fw-bold mb-1">
                    Recent Activity
                  </h5>

                  <small className="text-muted">
                    Your latest learning activities
                  </small>
                </div>

                <button className="btn btn-sm btn-outline-primary">
                  View All
                </button>

              </div>

              <div className="list-group list-group-flush">

                <div className="list-group-item px-0 py-3 d-flex align-items-center">

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "#eef2ff",
                      color: "#4f46e5",
                    }}
                  >
                    <FaPlayCircle />
                  </div>

                  <div className="flex-grow-1">

                    <h6 className="mb-1 fw-semibold">
                      Completed HTML & CSS Lesson
                    </h6>

                    <small className="text-muted">
                      ADCA Course
                    </small>

                  </div>

                  <small className="text-muted">
                    2 hours ago
                  </small>

                </div>

                <div className="list-group-item px-0 py-3 d-flex align-items-center">

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "#f0fdf4",
                      color: "#16a34a",
                    }}
                  >
                    <FaClipboardCheck />
                  </div>

                  <div className="flex-grow-1">

                    <h6 className="mb-1 fw-semibold">
                      Attendance marked
                    </h6>

                    <small className="text-muted">
                      Today's class
                    </small>

                  </div>

                  <small className="text-muted">
                    5 hours ago
                  </small>

                </div>

                <div className="list-group-item px-0 py-3 d-flex align-items-center">

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "#fffbeb",
                      color: "#d97706",
                    }}
                  >
                    <FaMoneyBillWave />
                  </div>

                  <div className="flex-grow-1">

                    <h6 className="mb-1 fw-semibold">
                      Fee payment received
                    </h6>

                    <small className="text-muted">
                      Receipt: REC-2026-1024
                    </small>

                  </div>

                  <small className="text-muted">
                    1 day ago
                  </small>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Notices */}
        <div className="col-xl-4">

          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "15px" }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="fw-bold mb-0">
                  Notices
                </h5>

                <FaBell
                  style={{ color: "#4f46e5" }}
                />

              </div>

              {notices.map((notice, index) => (
                <div
                  key={index}
                  className="border-bottom py-3"
                >

                  <h6
                    className="fw-semibold"
                    style={{ fontSize: "14px" }}
                  >
                    {notice.title}
                  </h6>

                  <small className="text-muted">
                    {notice.date}
                  </small>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
