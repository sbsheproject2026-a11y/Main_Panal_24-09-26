import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBell, FaPlayCircle, FaFolderOpen, FaRupeeSign,
    FaPaperclip, FaPrint, FaIdCard, FaCalendarAlt,
    FaGlobe, FaGraduationCap, FaLink, FaBookOpen,
    FaMobileAlt, FaShareAlt, FaFileContract, FaBars, FaCaretDown, FaVideo,
    FaPen, FaBookReader, FaLaptopCode
} from "react-icons/fa";
import { getStudentProfile } from "../../AllServicesFiles/StudentService";
import { FILE_URL } from "../../api";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("UserId");

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Admission");

    const [student, setStudent] = useState({
        id: 0, courseId: 0, totalClass: 0, enrollmentNo: "", rollno: "", rollNo1: "", name: ""
    });

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        loadStudent();
    }, [userId]);

    const loadStudent = async () => {
        try {
            setLoading(true);
            const result = await getStudentProfile(userId);
            const data = Array.isArray(result) ? result[0] : (result?.data || result || {});

            setStudent({
                id: data.id || 0,
                courseId: data.courseId || 0,
                totalClass: data.totalClass || 0,
                enrollmentNo: data.enrollmentNo || "",
                rollno: data.rollno || "",
                rollNo1: data.rollNo1 || "",
                name: data.name || "",
                courseName: data.courseName || "",
            });
        } catch (error) {
            console.log("Student Details Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // 1. ADMISSION TAB CARDS
    // =========================================================
    const admissionCards = [
        {
            id: "application", title: "Application Status", bgColor: "#e8cc46", icon: <FaFolderOpen />,
            statusText: "Status : Admission Confirmed",

            links: [{ text: "Review Form", path: `/admission-form-print/${userId}` }]
        },
        {
            id: "payment", title: "Payment Status", bgColor: "#98c953", icon: <FaRupeeSign />,
            statusText: "Paid",
            links: [{ text: "Payment History", path: `/student-payments-view/${student.id}` }]
        },
        {
            id: "documents", title: "My Documents", bgColor: "#5fcd5b", icon: <FaPaperclip />,
            statusText: "Last Date: 29-11-2026\n8 Documents Uploaded",
            links: [{ text: "Review Document", path: `/student-view-profile/${userId}` }]

        },
        {
            id: "print", title: "Print", bgColor: "#25c8f5", icon: <FaPrint />,
            links: [{ text: "I-Card", path: `/id-card/${userId}` }]
        },
        {
            id: "results", title: "Public Exam", bgColor: "#9c27b0", icon: <FaPen />,
            links: [
                { text: "Public Exam ", path: "/student-exam-list" }, // 👈 Yahan path change kiya
                // { text: "On Demand Exam Results", path: "/student-exam-list" }
            ]
        },
        {
            id: "results", title: "Results", bgColor: "#9c27b0", icon: <FaPen />,
            links: [
                { text: "Public Exam Results", path: "#" },
                { text: "On Demand Exam Results", path: "#" }
            ]
        },
        // ✅ E-SERVICE CARD — tab switch ke liye `tab` field add kiya
        {
            id: "eservice", title: "E-Service", bgColor: "#ba68c8", icon: <FaPen />,
            links: [
                { text: "Apply", path: "#", tab: "E-Services" },
                { text: "My Request", path: "#", tab: "E-Services" }
            ]
        },
        {
            id: "study-material", title: "Study Material", bgColor: "#e91e63", icon: <FaBookOpen />,
            links: [
                { text: "Download Study Material", path: "#" },
                { text: "Sample Question Papers", path: "#" },
                { text: "Book Price List", path: `/student-courses/${student.courseId}` },
                { text: "Submit Book Received Response", path: "#" },
                { text: "Track Here", path: "#" }
            ]
        },
        {
            id: "tma", title: "Tutor Mark Assignment", bgColor: "#f06292", icon: <FaBookOpen />,
            links: [
                { text: "Download TMA", path: "#" },
                { text: "Upload TMA", path: "#" },
                { text: "TMA Status", path: "#" }
            ]
        },
        {
            id: "abc", title: "ACADEMIC BANK OF CREDITS", bgColor: "#ef5350", icon: <FaGraduationCap />,
            links: [
                { text: "Create APAAR/ABC ID", path: "https://www.digilocker.gov.in/web/dashboard/issuers/010212" },
                { text: "Create DEB ID", path: "https://deb.ugc.ac.in/" }
            ]
        },
        {
            id: "mobile", title: "Mobile App", bgColor: "#ec407a", icon: <FaMobileAlt />,
            links: [
                { text: "SBSHE SAATHI", path: "https://appweb.shaheedbhagatsinghhealthandeducation.com/download/app.apk" },
                { text: "VIDYAMRIT", path: "https://vidyaamritapp.shaheedbhagatsinghhealthandeducation.com/download/Vidyaamrit.apk" }
            ]
        },
        {
            id: "social", title: "Social Media Links", bgColor: "#ec407a", icon: <FaShareAlt />,
            links: [
                { text: "YouTube", path: "https://youtube.com/@sbshe-sm?si=tDUXjazfu4CpAfPe" },
                { text: "Facebook", path: "https://www.facebook.com/share/1Hb4vQDMov/" },
                { text: "Instagram", path: "https://www.instagram.com/sbsheofficial?utm_source=qr&stkn=Nmw0ZXNkOGwzMjlm" },
                { text: "Linkedin", path: "https://www.linkedin.com/company/sbshe/" }
            ]
        },
        // Conditional Card
        Number(student?.totalClass) === 2 && {
            id: "re-registration", title: "Re-Registration", bgColor: "#0d9488", icon: <FaFileContract />,
            statusText: "Download official registration document",
            links: [{ text: "Download Now", path: `/re-registration/${userId}` }]
        }
    ].filter(Boolean);

    // ✅ UPDATED: link object accept karta hai (path + optional tab)
    const handleLinkClick = (link) => {
        if (!link.path || link.path === "#") return;

        // ✅ Agar link StudentExamList ka hai, to state me courseId bhejo
        if (link.path === "/student-exam-list") {
            navigate(link.path, {
                state: { courseId: student.courseId } // 👈 Yahan student ki courseId jayegi
            });
            return;
        }

        // Baaki links ke liye (http, www, ya internal)
        if (link.path.startsWith("http://") || link.path.startsWith("https://")) {
            window.open(link.path, "_blank", "noopener,noreferrer");
        } else if (link.path.startsWith("www.")) {
            window.open("https://" + link.path, "_blank", "noopener,noreferrer");
        } else {
            navigate(link.path);
        }
    };

    // =========================================================
    // 2. E-SERVICES TAB CARDS
    // =========================================================
    const eServicesCards = [

        {
            title: "Basic Details Change", bgColor: "#fbc02d", icon: <FaPen />,
            links: [
                { text: "Name Change ₹500", path: "#" },
                { text: "Father Name Change ₹500", path: "#" },
                { text: "Mother Name Change ₹500", path: "#" },
                { text: "Gender Change ₹500", path: "#" },
                { text: "DOB Change ₹500", path: "#" }
            ]
        },
        {
            title: "Basic Details Correction", bgColor: "#8bc34a", icon: <FaPen />,
            links: [
                { text: "Name Correction ₹100", path: "#" },
                { text: "Father Name Correction ₹100", path: "#" },
                { text: "Mother Name Correction ₹100", path: "#" },
                { text: "Gender Correction ₹100", path: "#" },
                { text: "DOB Correction ₹100", path: "#" }
            ]
        },

        {
            title: "Other Details Change", bgColor: "#00bcd4", icon: <FaPen />,
            links: [
                { text: "Change Correspondence Address ₹500", path: "#" },
                { text: "Change Permanent Address ₹500", path: "#" },
                { text: "Change Mobile Number ₹300", path: "#" },
                { text: "Study Medium Change ₹500", path: "#" },
                { text: "Change Board ₹500", path: "#" },
                { text: "Apply For TMA/Project ₹500", path: "#" },
                { text: "Change Mobile Number ₹700", path: "#" }
            ]
        },
        {
            title: "Subject / Study Center", bgColor: "#00bcd4", icon: <FaPen />,
            links: [
                { text: "Remove TOC ₹500", path: "#" },
                { text: "Change Part Admission ₹500", path: "#" },
                { text: "Change Subject ₹400", path: "#" },
                { text: "Add Subject ₹400", path: "#" },
                { text: "Add TOC ₹500", path: "#" },
                { text: "Change Study Center ₹400", path: "#" },
                { text: "TOC Lab Fee ₹400", path: "#" },
                { text: "Remove Subject ₹300", path: "#" }
            ]
        },
        {
            title: "Documents Change", bgColor: "#2196f3", icon: <FaPen />,
            links: [
                { text: "Change Photograph ₹100", path: "#" },
                { text: "Change Signature ₹100", path: "#" },
                { text: "Duplicate Marksheet ₹300", path: "#" },
                { text: "Duplicate Marksheet cum Passing Certificate ₹1000", path: "#" },
                { text: "Original Marksheet - Part Admission ₹1000", path: "#" },
                { text: "Original Marksheet cum Passing Certificate ₹1000", path: "#" },
                { text: "Revised Migration Certificate ₹1000", path: "#" },
                { text: "Change Student Signature ₹1000", path: "#" },
                { text: "Original Improvement Marksheet ₹400", path: "#" }
            ]
        },
        {
            title: "TMA", bgColor: "#4caf50", icon: <FaPen />,
            links: [{ text: "Re-Upload TMA ₹400", path: "#" }]
        }
    ];

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#e9eaed" }}>
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}></div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                body { background-color: #e9eaed; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; }
                
                .portal-wrapper { 
                    width: 100%; 
                    min-height: 100vh; 
                    display: flex; 
                    justify-content: center; 
                    padding: 80px 20px 20px 20px; 
                    box-sizing: border-box; 
                }
                
                .portal-container { background: #ffffff; width: 100%; max-width: 1000px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; }

                .np-navbar { display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #eee; padding-right: 20px; }
                .nav-tabs { display: flex; }
                .nav-tab { padding: 16px 25px; font-size: 15px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 10px; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.2s; }
                .nav-tab.active { background: #4fc3f7; color: white; border-bottom: 3px solid #29b6f6; }
                .nav-tab:hover:not(.active) { background: #f9f9f9; }
                .nav-right-bell { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; cursor: pointer; color: #333; }
                .bell-icon-wrapper { position: relative; display: flex; align-items: center; }
                .bell-icon-wrapper svg { color: #d32f2f; font-size: 18px; }
                .bell-badge { position: absolute; top: -5px; right: -5px; background: #d32f2f; color: white; font-size: 9px; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; }

                .np-info-bar-wrapper { padding: 20px; background: #fff; border-bottom: 1px solid #f0f0f0; }
                .np-info-bar { background: #fff; border: 1px solid #eaeaea; border-radius: 6px; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02); flex-wrap: wrap; gap: 10px; }
                .np-info-text { display: flex; align-items: center; gap: 15px; font-size: 14px; color: #333; font-weight: 500; }
                .np-info-text .divider { color: #ccc; font-size: 16px; font-weight: 300; }
                .np-badge-red { background: #ff0000; color: white; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
                .np-info-actions { display: flex; align-items: center; gap: 15px; font-size: 13px; font-weight: 500; color: #333; }
                .np-info-actions .divider { color: #ccc; }
                .btn-my-details { background: #d32f2f; color: white; border: none; padding: 6px 16px; border-radius: 4px; font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.2s; }
                .btn-my-details:hover { background: #b71c1c; }

                .cards-container { padding: 20px; }
                .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                
                .portal-card { 
                    border-radius: 4px; padding: 15px 20px; color: white; position: relative; overflow: hidden; 
                    display: flex; flex-direction: column; box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
                    min-height: 160px; height: 100%;
                }
                
                .portal-card::before {
                    content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 70%;
                    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%);
                    clip-path: polygon(0 100%, 0 40%, 40% 60%, 100% 10%, 100% 100%);
                    pointer-events: none;
                }
                .portal-card::after {
                    content: ""; position: absolute; top: -20px; right: -20px; width: 140px; height: 140px;
                    background: rgba(255,255,255,0.1); border-radius: 50%; pointer-events: none;
                }

                .card-icon-bg { position: absolute; top: 15px; right: 15px; font-size: 40px; opacity: 0.3; z-index: 1; color: #000; }
                .card-title { font-size: 16px; font-weight: 600; margin: 0 0 10px 0; line-height: 1.3; padding-right: 30px; z-index: 2; }
                .card-status { font-size: 13px; margin-bottom: 15px; z-index: 2; font-weight: 500; line-height: 1.5; opacity: 0.9; }
                
                .card-links { margin-top: auto; z-index: 2; display: flex; flex-direction: column; gap: 4px; }
                
                .card-link-item { 
                    font-size: 12px; display: flex; align-items: center; gap: 6px; 
                    font-weight: 600; text-decoration: underline; cursor: pointer; 
                    color: inherit; opacity: 0.9; transition: 0.2s;
                }
                .card-link-item:hover { opacity: 1; text-decoration: none; }

                .swayam-logo-box { background: white; color: #1976d2; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; font-size: 16px; margin-bottom: 10px;}

                .eservice-links-list { display: flex; flex-direction: column; gap: 4px; z-index: 2; margin-top: auto; }
                .eservice-link { font-size: 11.5px; color: #fff; text-decoration: underline; cursor: pointer; opacity: 0.9; }
                .eservice-link:hover { opacity: 1; color: #fff; }

                .news-section { background: white; border-radius: 4px; margin-top: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden;}
                .news-header { background: #4fc3f7; color: white; padding: 10px 20px; font-weight: 600; font-size: 16px; }
                .news-body { padding: 15px 20px; border: 1px solid #ddd; border-top: none; font-size: 14px; font-weight: 600; color: #333; }
                .news-date { display: block; font-size: 12px; color: #777; font-weight: normal; margin-top: 5px; }

                @media (max-width: 992px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 768px) {
                    .portal-wrapper { padding: 60px 10px 10px 10px; }
                    .cards-grid { grid-template-columns: 1fr; }
                    .np-info-bar { flex-direction: column; align-items: flex-start; }
                    .np-navbar { flex-direction: column; align-items: stretch; }
                    .nav-tabs { flex-direction: column; }
                }
            `}</style>

            <div className="portal-wrapper">
                <div className="portal-container">

                    {/* NAVBAR */}
                    <div className="np-navbar">
                        <div className="nav-tabs">
                            <div className={`nav-tab ${activeTab === 'Admission' ? 'active' : ''}`} onClick={() => setActiveTab('Admission')}>
                                <FaIdCard /> Admission
                            </div>
                            <div className={`nav-tab ${activeTab === 'Notifications' ? 'active' : ''}`} onClick={() => setActiveTab('Notifications')}>
                                <FaBell /> Notifications
                            </div>
                            <div className={`nav-tab ${activeTab === 'E-Services' ? 'active' : ''}`} onClick={() => setActiveTab('E-Services')}>
                                <FaBars /> E-Services
                            </div>
                        </div>
                        <div className="nav-right-bell">
                            <div className="bell-icon-wrapper">
                                <FaBell /> <span className="bell-badge">1</span>
                            </div>
                            Notifications <FaCaretDown />
                        </div>
                    </div>

                    {/* INFO BAR */}
                    <div className="np-info-bar-wrapper">
                        <div className="np-info-bar">
                            <div className="np-info-text">
                                {/* <span>Stream 1 Block 1</span> */}
                                {/* <span className="divider">|</span>  */}
                                <span>{student.courseName}</span>
                            </div>

                            <div className="np-badge-red">Notifications</div>

                            <div className="np-info-actions">
                                {/* <span>Ref No:  </span> <span className="divider">|</span> */}
                                <span>Enroll No: {student.enrollmentNo}</span>
                                <button className="btn-my-details" onClick={() => navigate(`/student-view-profile/${userId}`)}>
                                    My Details
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="cards-container">

                        {/* ================= ADMISSION TAB ================= */}
                        {activeTab === 'Admission' && (
                            <>
                                <div className="cards-grid">
                                    {admissionCards.map((card, idx) => (
                                        <div key={idx} className="portal-card" style={{ backgroundColor: card.bgColor }}>
                                            <div className="card-icon-bg">{card.icon}</div>
                                            <h3 className="card-title">{card.title}</h3>

                                            {card.isSwayam && (
                                                <div className="swayam-logo-box">swayam</div>
                                            )}

                                            {card.statusText && !card.isSwayam && (
                                                <div className="card-status">
                                                    {card.statusText.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                                </div>
                                            )}

                                            <div className="card-links">
                                                {card.links.map((link, lIdx) => (
                                                    <div
                                                        key={lIdx}
                                                        className="card-link-item"
                                                        onClick={() => handleLinkClick(link)}  /* ✅ link object pass */
                                                    >
                                                        <FaPlayCircle size={10} /> {link.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </>
                        )}

                        {/* ================= E-SERVICES TAB ================= */}
                        {activeTab === 'E-Services' && (
                            <div className="cards-grid">
                                {eServicesCards.map((card, idx) => (
                                    <div key={idx} className="portal-card" style={{ backgroundColor: card.bgColor, minHeight: "220px" }}>
                                        <div className="card-icon-bg">{card.icon}</div>
                                        <h3 className="card-title">{card.title}</h3>

                                        <div className="eservice-links-list">
                                            {card.links.map((link, lIdx) => (
                                                <span
                                                    key={lIdx}
                                                    className="eservice-link"
                                                    onClick={() => link.path !== "#" && navigate(link.path)}
                                                >
                                                    {link.text}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ================= NOTIFICATIONS TAB ================= */}
                        {activeTab === 'Notifications' && (
                            <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
                                <FaBell size={40} color="#d32f2f" />
                                <h3 className="mt-3">No New Notifications</h3>
                                <p>Aapko abhi koi naya notification nahi hai.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;