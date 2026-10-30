 import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getStudentexamlist } from "../../AllServicesFiles/StudentService";

function StudentExamList() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const userId = localStorage.getItem("UserId") || localStorage.getItem("userId"); 
  
  const courseId =
    location.state?.courseId ||
    params?.id ||
    localStorage.getItem("CourseId") ||
    0;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Live Time (Har minute check karega taaki time nikalte hi button Closed ho jaye)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (courseId && userId) {
      fetchExams();
    } else {
      setLoading(false);
      setError("Course ID or User ID not found. Please login again.");
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 

    return () => clearInterval(timer);
  }, [courseId, userId]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStudentexamlist(courseId, userId);

      if (response.Success || response.success) {
        setExams(response.Data || response.data || []);
      } else {
        setError("Failed to load exams.");
      }
    } catch (err) {
      console.error("Fetch Exams Error:", err);
      setError("Something went wrong while loading exams.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ SMART DATE & TIME CHECK LOGIC
  const checkExamStatus = (paperDate, startTime, endTime) => {
    if (!paperDate || !startTime || !endTime) return "not-started";

    const dateObj = new Date(paperDate);
    // Local date string banayein taaki timezone issue na aaye
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    let examStartDateTime = new Date(`${dateString}T${startTime}`);
    let examEndDateTime = new Date(`${dateString}T${endTime}`);

    // Agar End Time, Start Time se chota hai (jaise 10:00 AM se 1:00 AM), 
    // toh iska matlab exam agle din khatam hoga. Uske liye 1 din add karein.
    if (examEndDateTime < examStartDateTime) {
      examEndDateTime.setDate(examEndDateTime.getDate() + 1);
    }

    // Compare with current time
    if (currentTime < examStartDateTime) {
      return "not-started"; // Coming Soon
    } else if (currentTime > examEndDateTime) {
      return "closed"; // Closed (Time up)
    } else {
      return "active"; // Start Exam
    }
  };

  return (
    <div className="student-exam-page py-4">
      <style>{`
        .student-exam-page { background: #f8f9fc; min-height: 100vh; padding: 20px;margin-top: 70px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .page-header { margin-bottom: 25px; }
        .page-title { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 5px; }
        .page-subtitle { color: #64748b; font-size: 14px; }
        .exam-table-card { background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); overflow: hidden; }
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table thead { background: #f1f5f9; }
        .custom-table th { padding: 16px 20px; text-align: left; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .custom-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #334155; font-size: 14px; }
        .custom-table tbody tr { transition: background 0.2s; }
        .custom-table tbody tr:hover { background: #f8fafc; }
        .custom-table tbody tr:last-child td { border-bottom: none; }
        .exam-title-td { font-weight: 600; color: #0f172a; font-size: 15px; }
        .exam-subtitle-td { font-size: 12.5px; color: #64748b; margin-top: 4px; }
        .schedule-td { font-size: 13.5px; line-height: 1.6; }
        .schedule-td i { color: #3b82f6; }
        .badge-status { padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-block; }
        .badge-active { background: #dcfce7; color: #16a34a; }
        .badge-inactive { background: #fee2e2; color: #dc2626; }
        .badge-pill-custom { background: #eff6ff; color: #2563eb; padding: 5px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }
        .badge-pill-custom.marks { background: #ecfdf5; color: #059669; }
        .badge-pill-custom.qs { background: #fdf4ff; color: #c026d3; }
        .btn-start-exam { background: #0d6efd; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; transition: 0.2s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .btn-start-exam:hover:not(:disabled) { background: #0b5ed7; box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3); transform: translateY(-1px); }
        .empty-state { text-align: center; padding: 60px 20px; background: #fff; border-radius: 16px; border: 1px dashed #cbd5e1; }
        .empty-state i { font-size: 48px; color: #cbd5e1; margin-bottom: 15px; }
        .spinner-box { display: flex; justify-content: center; align-items: center; min-height: 50vh; }
        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      `}</style>

      <div className="container-fluid px-2 px-md-4">
        <div className="page-header d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1 className="page-title">Available Exams</h1>
            <p className="page-subtitle">Select an exam to view details and start your test.</p>
          </div>
        </div>

        {loading && (
          <div className="spinner-box">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}></div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {!loading && !error && exams.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-journal-x"></i>
            <h5 className="fw-bold">No Exams Found</h5>
            <p className="text-muted mb-0">There are currently no exams available for your course.</p>
          </div>
        )}

        {!loading && !error && exams.length > 0 && (
          <div className="exam-table-card table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exam Details</th>
                  <th>Schedule</th>
                  <th>Duration</th>
                  <th>Marks & Qs</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => {
                  
                  const timeStatus = checkExamStatus(exam.paperDate || exam.PaperDate, exam.startTime || exam.StartTime, exam.endTime || exam.EndTime);
                  
                  const isCompleted = exam.IsCompleted === 1 || exam.isCompleted === 1;

                  return (
                    <tr key={exam.id || exam.Id}>
                      <td className="fw-semibold text-muted">{index + 1}</td>

                      <td>
                        <div className="exam-title-td">{exam.title || exam.Title}</div>
                        {(exam.subTitle || exam.SubTitle) && <div className="exam-subtitle-td">{exam.subTitle || exam.SubTitle}</div>}
                      </td>

                      <td className="schedule-td">
                        <div>
                          <i className="bi bi-calendar-event me-2"></i>
                          {formatDate(exam.paperDate || exam.PaperDate)}
                        </div>
                        <div className="text-muted mt-1">
                          <i className="bi bi-clock me-2"></i>
                          {formatTime(exam.startTime || exam.StartTime)} - {formatTime(exam.endTime || exam.EndTime)}
                        </div>
                      </td>

                      <td>
                        <span className="fw-semibold text-dark">
                          <i className="bi bi-hourglass-split me-1 text-warning"></i>
                          {exam.totalTimeInMinute || exam.TotalTimeInMinute} Mins
                        </span>
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1 align-items-start">
                          <span className="badge-pill-custom marks">
                            <i className="bi bi-award"></i> {exam.totalMark || exam.TotalMark} Marks
                          </span>
                          <span className="badge-pill-custom qs">
                            <i className="bi bi-patch-question"></i> {exam.totalQuestions || exam.TotalQuestions} Qs
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={`badge-status ${(exam.isActive === 1 || exam.IsActive === 1) ? 'badge-active' : 'badge-inactive'}`}>
                          {(exam.isActive === 1 || exam.IsActive === 1) ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* ✅ ACTION BUTTON LOGIC */}
                      <td className="text-center">
                        {isCompleted ? (
                          <span className="badge bg-success py-2 px-3" style={{ borderRadius: '8px', fontSize: '13px' }}>
                            Completed <i className="bi bi-check-all ms-1"></i>
                          </span>
                        ) : timeStatus === "not-started" ? (
                          <span className="badge bg-warning text-dark py-2 px-3" style={{ borderRadius: '8px', fontSize: '13px' }}>
                            Coming Soon <i className="bi bi-hourglass-split ms-1"></i>
                          </span>
                        ) : timeStatus === "closed" ? (
                          <span className="badge bg-danger py-2 px-3" style={{ borderRadius: '8px', fontSize: '13px' }}>
                            Closed <i className="bi bi-slash-circle ms-1"></i>
                          </span>
                        ) : (
                          <button
                            className="btn-start-exam"
                            onClick={() => navigate("/exam-question", {
                              state: { 
                                examId: exam.id || exam.Id, 
                                description: exam.description || exam.Description, 
                                userId: userId 
                              }
                            })}
                          >
                            Start Exam <i className="bi bi-arrow-right ms-1"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentExamList;