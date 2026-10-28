 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUserCircle,
    FaIdCard,
    FaFileAlt,
    FaBookOpen,
    FaMoneyBillWave,
    FaBell,
    FaArrowRight,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaUniversity,
    FaGraduationCap,
    FaFileContract,
    FaLock
} from "react-icons/fa";
import { getStudentProfile } from "../../AllServicesFiles/StudentService";
import { FILE_URL } from "../../api";

const StudentDashboard = () => {
    const navigate = useNavigate();

    // =========================================================
    // USER ID
    // =========================================================
    const userId = localStorage.getItem("UserId");

    // =========================================================
    // STATE
    // =========================================================
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState({
        id: 0,
        courseId: 0,
        totalClass: 0,
        classNo: 0,
        enrollmentNo: "",
        rollno: "",
        rollNo1: "",
        name: "",
        fatherName: "",
        motherName: "",
        address: "",
        mobileNo: "",
        email: "",
        instituteName: "",
        cityName: "",
        districtName: "",
        stateName: "",
        courseName: "",
        selfImage: "",
        initials: ""
    });

    // =========================================================
    // LOAD STUDENT
    // =========================================================
    useEffect(() => {
        if (!userId) {
            console.log("❌ UserId not found in localStorage");
            setLoading(false);
            return;
        }

        loadStudent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const loadStudent = async () => {
        try {
            setLoading(true);

            const result = await getStudentProfile(userId);
            

            const data = Array.isArray(result)
                ? result[0]
                : (result?.data || result || {});

            const fullName = data.name || "Student";
            const initials = fullName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

            setStudent({
                id: data.id || 0,
                courseId: data.courseId || 0,
                totalClass: data.totalClass || 0,
                classNo: data.classNo || 0,
                enrollmentNo: data.enrollmentNo || "",
                rollno: data.rollno || "",
                rollNo1: data.rollNo1 || "",
                name: data.name || "Student",
                fatherName: data.fatherName || "-",
                motherName: data.motherName || "-",
                address: data.address || "-",
                mobileNo: data.mobileNo || "-",
                email: data.email || "-",
                instituteName: data.instituteName || "-",
                cityName: data.cityName || "-",
                districtName: data.districtName || "-",
                stateName: data.stateName || "-",
                courseName: data.courseName || "-",
                selfImage: data.selfImage || "",
                initials: initials || "S"
            });

        } catch (error) {
            console.log("Student Details Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // IMAGE URL HELPER
    // =========================================================
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        const base = (FILE_URL || "").replace(/\/+$/, "");
        const cleanPath = path.replace(/^\/+/, "");
        return `${base}/${cleanPath}`;
    };

    // =========================================================
    // QUICK ACTIONS
    // =========================================================
     const quickActions = [
    {
        title: "Payment Details",
        desc: "Fee payment history & receipts",
        icon: <FaMoneyBillWave />,
        color: "#dc2626",
        bg: "#fef2f2",
        path: `/student-payments-view/${student.id}`,
        state: { studentId: student.id },
    },
    {
        title: "Profile Print",
        desc: "View & update your personal details",
        icon: <FaUserCircle />,
        color: "#4f46e5",
        bg: "#eef2ff",
        path: `/admission-form-print/${userId}`,
        state: { id: userId },
        //disabled: !student.enrollmentNo,
    },
    {
        title: "My Profile",
        desc: "View & update your personal details",
        icon: <FaUserCircle />,
        color: "#4f46e5",
        bg: "#eef2ff",
        path: `/student-view-profile/${userId}`,
        state: { id: userId },
        disabled: !student.enrollmentNo,
    },
    {
        title: "ID Card",
        desc: "Download your student ID card",
        icon: <FaIdCard />,
        color: "#0891b2",
        bg: "#ecfeff",
        path: `/id-card/${userId}`,
        state: { id: userId },
        disabled: !student.enrollmentNo,
    },
    {
        title: "Course Details",
        desc: "View your enrolled courses",
        icon: <FaBookOpen />,
        color: "#16a34a",
        bg: "#f0fdf4",
        path: `/student-courses/${student.courseId}`,
        state: { id: student.courseId },
        disabled: !student.courseId,
        disabled: !student.enrollmentNo,
    },

    // 👇 SIRF YAHAN CONDITION — totalClass === 2 ho tabhi show hoga
    Number(student?.totalClass) === 2 && {
        title: "Re-Registration Card",
        desc: "Download official registration document",
        icon: <FaFileContract />,
        color: "#0d9488",
        bg: "#ccfbf1",
        path: `/re-registration/${userId}`,
        state: { id: userId },
        // disabled: !student.enrollmentNo,
    },

    {
        title: "Admit Card (1st Year)",
        desc: "Download 1st year exam admit card",
        icon: <FaFileAlt />,
        color: "#d97706",
        bg: "#fffbeb",
        path: student.rollno ? `/admit-card-print/${student.rollno}` : null,
        state: { rollNo: student.rollno },
        disabled: !student.rollno,
    },
    {
        title: "Admit Card (2nd Year)",
        desc: "Download 2nd year exam admit card",
        icon: <FaFileAlt />,
        color: "#c2410c",
        bg: "#fff7ed",
        path: student.rollNo1 ? `/admit-card-print/${student.rollNo1}` : null,
        state: { rollNo: student.rollNo1 },
        disabled: !student.rollNo1,
    },
    {
        title: "Update Password",
        desc: "Fee payment history & receipts",
        icon: <FaLock />,
        color: "#dc2626",
        bg: "#fef2f2",
        path: `/update-password-student`,
        state: { studentId: student.id },
        disabled: !student.enrollmentNo,
    },
].filter(Boolean);   // 👈 ye end mein lagana ZAROORI hai

    // =========================================================
    // LOADING UI
    // =========================================================
    if (loading) {
        return (
            <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "80vh" }}
            >
                <div
                    className="spinner-border text-primary"
                    style={{ width: "45px", height: "45px" }}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>

                <p className="mt-3 text-muted" style={{ fontSize: "13px" }}>
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <>
            <style>{`
                /* =========================================================
                   AAPKA ORIGINAL CSS (100% SAME)
                ========================================================= */
                .sd-page {
                    min-height: 100vh;
                    padding: 24px 20px 50px;
                    background: #f5f7fa;
                }
                .sd-container { max-width: 1400px; margin: 0 auto; }
                .sd-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
                .sd-header h2 { margin: 0; color: #1a202c; font-size: 26px; font-weight: 800; }
                .sd-header p { margin: 6px 0 0; color: #718096; font-size: 13px; }
                .sd-header-actions { display: flex; gap: 10px; align-items: center; }
                .sd-profile-card { background: #fff; border-radius: 20px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #edf2f7; }
                .sd-profile-top { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 24px 28px; display: flex; align-items: center; gap: 22px; position: relative; overflow: hidden; }
                .sd-profile-top::before { content: ""; position: absolute; width: 250px; height: 250px; border-radius: 50%; background: rgba(255, 255, 255, 0.06); top: -100px; right: -60px; pointer-events: none; }
                .sd-profile-top::after { content: ""; position: absolute; width: 150px; height: 150px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); bottom: -80px; right: 100px; pointer-events: none; }
                .sd-profile-avatar-wrap { position: relative; z-index: 2; }
                .sd-avatar { width: 88px; height: 88px; border-radius: 50%; background: rgba(255, 255, 255, 0.20); display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; border: 4px solid rgba(255, 255, 255, 0.35); overflow: hidden; flex-shrink: 0; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
                .sd-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .sd-profile-heading { position: relative; z-index: 2; color: #fff; flex: 1; min-width: 0; }
                .sd-profile-heading h3 { margin: 0 0 8px; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; line-height: 1.3; }
                .sd-profile-heading p { margin: 0; font-size: 12.5px; opacity: 0.9; display: flex; align-items: center; gap: 8px; font-weight: 500; }
                .sd-profile-heading p svg { opacity: 0.8; font-size: 12px; }

                /* INFO GRID */
                .sd-profile-info { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; padding: 6px 28px; }
                .sd-info-item { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid #f7fafc; min-width: 0; }
                .sd-info-item:nth-last-child(-n+2) { border-bottom: none; }
                .sd-info-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
                .sd-info-item > div:last-child { min-width: 0; flex: 1; }
                .sd-info-item span { display: block; color: #a0aec0; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
                .sd-info-item strong { display: block; color: #1a202c; font-size: 13.5px; font-weight: 700; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; }

                /* ROLL ROWS */
                .sd-roll-row { display: flex; align-items: center; gap: 6px; line-height: 1.7; margin-top: 2px; flex-wrap: nowrap; }
                .sd-roll-label { color: #4a5568; font-size: 12px; font-weight: 700; min-width: 62px; max-width: 62px; flex-shrink: 0; display: inline-block; white-space: nowrap; }
                .sd-roll-value { color: #1a202c; font-size: 13px; font-weight: 700; letter-spacing: 0.3px; white-space: nowrap; display: inline-block; }

                /* INSTITUTE FOOTER */
                .sd-institute-footer { display: flex; align-items: center; gap: 14px; padding: 18px 28px; background: #fafbfc; border-top: 1px solid #edf2f7; }
                .sd-institute-icon { width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; box-shadow: 0 5px 15px rgba(79, 70, 229, 0.25); }
                .sd-institute-footer span { display: block; color: #a0aec0; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
                .sd-institute-footer strong { display: block; color: #1a202c; font-size: 13px; font-weight: 800; line-height: 1.4; }

                /* STATS */
                .sd-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 24px; }
                .sd-stat-card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 3px 15px rgba(0, 0, 0, 0.04); transition: transform 0.2s ease, box-shadow 0.2s ease; display: flex; justify-content: space-between; align-items: center; }
                .sd-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); }
                .sd-stat-label { margin: 0 0 8px; color: #718096; font-size: 12px; font-weight: 600; }
                .sd-stat-value { margin: 0; color: #1a202c; font-size: 24px; font-weight: 800; }
                .sd-stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }

                /* SECTION TITLE */
                .sd-section-title { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; color: #1a202c; font-size: 18px; font-weight: 800; }
                .sd-section-title::before { content: ""; width: 4px; height: 20px; background: #4f46e5; border-radius: 20px; }

                /* QUICK ACTIONS */
                .sd-actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px; }
                .sd-action-card { background: #fff; border-radius: 16px; padding: 20px; cursor: pointer; border: 1px solid #edf2f7; transition: all 0.25s ease; display: flex; flex-direction: column; height: 100%; position: relative; }
                .sd-action-card:hover:not(.disabled) { transform: translateY(-4px); border-color: transparent; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10); }
                .sd-action-card.disabled { opacity: 0.5; cursor: not-allowed; }
                .sd-action-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 14px; }
                .sd-action-title { margin: 0 0 6px; color: #1a202c; font-size: 15px; font-weight: 700; }
                .sd-action-desc { margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5; flex: 1; }
                .sd-action-arrow { position: absolute; bottom: 20px; right: 20px; width: 28px; height: 28px; border-radius: 50%; background: #f7fafc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #a0aec0; transition: all 0.25s ease; }
                .sd-action-card:hover:not(.disabled) .sd-action-arrow { background: #4f46e5; color: #fff; transform: translateX(3px); }

                /* RESPONSIVE */
                @media (max-width: 1100px) { .sd-actions-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 991px) {
                    .sd-stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .sd-actions-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 767px) {
                    .sd-page { padding: 16px 12px 40px; }
                    .sd-header h2 { font-size: 20px; }
                    .sd-header-actions { width: 100%; }
                    .sd-profile-top { padding: 20px; flex-direction: column; text-align: center; gap: 16px; }
                    .sd-avatar { width: 72px; height: 72px; font-size: 24px; border-width: 3px; }
                    .sd-profile-heading h3 { font-size: 18px; }
                    .sd-profile-heading p { justify-content: center; font-size: 11.5px; }
                    .sd-profile-info { grid-template-columns: 1fr; padding: 4px 20px; }
                    .sd-info-item { padding: 14px 0; }
                    .sd-info-item:nth-last-child(-n+2) { border-bottom: 1px solid #f7fafc; }
                    .sd-info-item:last-child { border-bottom: none; }
                    .sd-institute-footer { padding: 16px 20px; }
                    .sd-institute-footer strong { font-size: 12px; }
                    .sd-stats-grid { grid-template-columns: 1fr; gap: 12px; }
                    .sd-actions-grid { grid-template-columns: 1fr; gap: 12px; }
                    .sd-stat-value { font-size: 20px; }
                    .sd-section-title { font-size: 15px; }
                }
            `}</style>

            <div className="sd-page">
                <div className="sd-container">

                    {/* HEADER */}
                    <div className="sd-header">
                        <div>
                            <h2>Student Dashboard</h2>
                            <p>Welcome back, {student.name}! 👋</p>
                        </div>

                        <div className="sd-header-actions">
                            <button
                                className="btn btn-primary"
                                style={{ borderRadius: "12px", padding: "10px 18px", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}
                                onClick={() => navigate(`/student-view-profile/${userId}`)}
                            >
                                <FaUserCircle />
                                My Profile
                            </button>
                        </div>
                    </div>

                    {/* PROFILE CARD */}
                    <div className="sd-profile-card">
                        <div className="sd-profile-top">
                            <div className="sd-profile-avatar-wrap">
                                <div className="sd-avatar">
                                    {student.selfImage ? (
                                        <img
                                            src={getImageUrl(student.selfImage)}
                                            alt={student.name}
                                            onError={(e) => { e.target.style.display = "none"; }}
                                        />
                                    ) : (
                                        student.initials
                                    )}
                                </div>
                            </div>

                            <div className="sd-profile-heading">
                                <h3>{student.name}</h3>
                                <p>
                                    <FaGraduationCap /> {student.courseName}
                                </p>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="sd-profile-info">
                            {/* Enrollment */}
                            <div className="sd-info-item">
                                <div className="sd-info-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}><FaIdCard /></div>
                                <div>
                                    <span>Enrollment No.</span>
                                    <strong>{student.enrollmentNo}</strong>
                                </div>
                            </div>

                            {/* Roll No — Both Years */}
                            <div className="sd-info-item">
                                <div className="sd-info-icon" style={{ background: "#ecfeff", color: "#0891b2" }}><FaFileAlt /></div>
                                <div>
                                    <span>Roll No.</span>
                                    <div className="sd-roll-row">
                                        <strong className="sd-roll-value">{student.rollno || "-"}</strong>
                                    </div>
                                    <div className="sd-roll-row">
                                        <strong className="sd-roll-value">{student.rollNo1 || "-"}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Father's Name */}
                            <div className="sd-info-item">
                                <div className="sd-info-icon" style={{ background: "#fef2f2", color: "#dc2626" }}><FaUser /></div>
                                <div>
                                    <span>Father's Name</span>
                                    <strong>{student.fatherName}</strong>
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="sd-info-item">
                                <div className="sd-info-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><FaPhone /></div>
                                <div>
                                    <span>Mobile No.</span>
                                    <strong>{student.mobileNo}</strong>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="sd-info-item">
                                <div className="sd-info-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}><FaEnvelope /></div>
                                <div>
                                    <span>Email</span>
                                    <strong style={{ wordBreak: "break-all", fontSize: "12px" }}>{student.email}</strong>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="sd-info-item">
                                <div className="sd-info-icon" style={{ background: "#fff7ed", color: "#ea580c" }}><FaMapMarkerAlt /></div>
                                <div>
                                    <span>Address</span>
                                    <strong>{student.cityName}, {student.districtName}, {student.stateName}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Institute Footer */}
                        <div className="sd-institute-footer">
                            <div className="sd-institute-icon">
                                <FaUniversity />
                            </div>
                            <div>
                                <span>Institute</span>
                                <strong>{student.instituteName}</strong>
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <h3 className="sd-section-title">Quick Actions</h3>

                    <div className="sd-actions-grid">
                        {quickActions.map((action, i) => (
                            <div
                                key={i}
                                className={`sd-action-card ${action.disabled ? "disabled" : ""}`}
                                onClick={() => {
                                    if (action.disabled) return;
                                    if (action.path) navigate(action.path); 
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !action.disabled && action.path) {
                                        navigate(action.path);
                                    }
                                }}
                            >
                                <div className="sd-action-icon" style={{ background: action.bg, color: action.color }}>
                                    {action.icon}
                                </div>
                                <h4 className="sd-action-title">{action.title}</h4>
                                <p className="sd-action-desc">{action.desc}</p>
                                <div className="sd-action-arrow">
                                    <FaArrowRight />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
};

export default StudentDashboard;