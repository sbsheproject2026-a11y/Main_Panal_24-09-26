import React, { useEffect, useState } from "react";
import {
    GetConfirmAddmissions

} from "../../AllServicesFiles/AdminStudentService";
import { FILE_URL } from "../../api";
import { useNavigate, useSearchParams } from "react-router-dom";

function RollNoList() {
       const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const studyModeId = Number(searchParams.get("studyModeId")) || 0;



    // ✅ PRINT
const handlePrint = (id) => {
    navigate(`/admission-form-print/${id}`);
};

// ✅ VIEW
const handleView = (id) => {
    navigate(`/student-view1/${id}`);
};

// ✅ EDIT
const handleEdit = (id) => {
    navigate(`/student-update1/${id}`);
};

    useEffect(() => {
        loadStudents();
    }, [pageNo, pageSize, search, studyModeId]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const result = await GetConfirmAddmissions(pageNo, pageSize, search, studyModeId);
            const responseData = result?.data;
            setData(responseData?.data || []);
            setTotalRecords(responseData?.totalRecords || 0);
        } catch (error) {
            console.log("Load students error:", error);
            setData([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalRecords / pageSize);

    const startRecord = totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;

    const endRecord = totalRecords === 0
        ? 0
        : Math.min(pageNo * pageSize, totalRecords);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPageNo(1);
    };

    const clearSearch = () => {
        setSearch("");
        setPageNo(1);
    };

    const handlePageSize = (e) => {
        setPageSize(Number(e.target.value));
        setPageNo(1);
    };

    const handlePrevious = () => {
        if (pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    };

    const handleNext = () => {
        if (pageNo < totalPages) {
            setPageNo(pageNo + 1);
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (pageNo <= 3) {
            return [1, 2, 3, 4, 5];
        }

        if (pageNo >= totalPages - 2) {
            return [
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }

        return [
            pageNo - 2,
            pageNo - 1,
            pageNo,
            pageNo + 1,
            pageNo + 2
        ];
    };

    return (
        <>
            <style>
                {`
                html,
                body,
                #root {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden !important;
                }

                .rollno-page {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    overflow-x: hidden;
                    box-sizing: border-box;
                }

                .rollno-page .section,
                .rollno-page .card,
                .rollno-page .card-body,
                .rollno-page .card-header {
                    min-width: 0;
                    max-width: 100%;
                    box-sizing: border-box;
                }

                .rollno-card {
                    width: 100%;
                    min-width: 0;
                    max-width: 100%;
                    border-radius: 18px !important;
                }

                .rollno-toolbar {
                    min-width: 0;
                    max-width: 100%;
                }

                /* ============================================
                   TABLE WRAPPER — only this area scrolls
                   ============================================ */

                .rollno-table-wrapper {
                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    box-sizing: border-box;
                    position: relative;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-gutter: stable;
                    contain: inline-size;
                    border-radius: 14px;
                    border: 1px solid #edf0f5;
                }

                /* ============================================
                   TABLE — AUTO WIDTH + AUTO HEIGHT
                   ============================================ */

                .rollno-table {
                    width: auto !important;
                    min-width: 100% !important;
                    max-width: none !important;
                    table-layout: auto !important;
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                    margin: 0 !important;
                }

                .rollno-table th,
                .rollno-table td {
                    box-sizing: border-box;
                }

                /* Header — auto height, auto width */
                .rollno-table thead th {
                    background: #f8f9fc !important;
                    color: #687185;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: .3px;
                    white-space: nowrap;
                    padding: 15px 16px !important;
                    border-bottom: 1px solid #e9edf3 !important;
                    vertical-align: middle;
                }

                /* Body — auto height, auto width */
                .rollno-table tbody td {
                    padding: 14px 16px !important;
                    color: #414a5d;
                    font-size: 13px;
                    vertical-align: middle !important;
                    border-bottom: 1px solid #f0f2f6 !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                    text-overflow: clip !important;
                }

                .rollno-table tbody tr:last-child td {
                    border-bottom: 0 !important;
                }

                .rollno-table tbody tr:hover {
                    background: #fafbff;
                }

                /* ============================================
                   CELL CONTENT
                   ============================================ */

                .rollno-student {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 0;
                }

                .rollno-student-image {
                    width: 52px;
                    height: 52px;
                    min-width: 52px;
                    object-fit: cover;
                    border-radius: 14px;
                    border: 3px solid #fff;
                    box-shadow: 0 3px 10px rgba(0,0,0,.12);
                }

                .rollno-student-name {
                    font-weight: 600;
                    color: #212529;
                    white-space: nowrap;
                }

                .rollno-badge {
                    display: inline-flex;
                    align-items: center;
                    white-space: nowrap;
                }

                .rollno-father {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }

                .rollno-father-icon {
                    width: 34px;
                    height: 34px;
                    min-width: 34px;
                    border-radius: 50%;
                    background: #fff5e6;
                    color: #f39c12;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .rollno-father-name {
                    white-space: nowrap;
                }

                .rollno-mobile {
                    display: block;
                    white-space: nowrap;
                    font-weight: 600;
                }

                .rollno-address {
                    display: block;
                    white-space: nowrap;
                    color: #596273;
                }

                .rollno-city {
                    display: block;
                    white-space: nowrap;
                    font-weight: 500;
                }

                /* ============================================
                   SCROLLBAR
                   ============================================ */

                .rollno-table-wrapper::-webkit-scrollbar {
                    height: 9px;
                }

                .rollno-table-wrapper::-webkit-scrollbar-track {
                    background: #eef1f5;
                    border-radius: 10px;
                }

                .rollno-table-wrapper::-webkit-scrollbar-thumb {
                    background: #b8bfcc;
                    border-radius: 10px;
                }

                .rollno-table-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #8f98a8;
                }

                .rollno-table-wrapper {
                    scrollbar-width: thin;
                    scrollbar-color: #b8bfcc #eef1f5;
                }

                .rollno-pagination {
                    min-width: 0;
                    max-width: 100%;
                }

                /* ============================================
                   MOBILE
                   ============================================ */

                @media (max-width: 768px) {
                    .rollno-page {
                        width: 100%;
                        max-width: 100%;
                    }

                    .rollno-table-wrapper {
                        width: 0 !important;
                        min-width: 100% !important;
                        max-width: 100% !important;
                        overflow-x: auto !important;
                    }

                    .rollno-table {
                        width: auto !important;
                        min-width: 100% !important;
                        max-width: none !important;
                    }
                }

                /* ========================================
   Student Action Buttons (Print + View)
======================================== */
.student-action-group {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
}

.student-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    outline: none;
    text-decoration: none;
    font-family: inherit;
}

.student-action i {
    font-size: 14px;
    line-height: 1;
}

/* ---------- Print Button ---------- */
.student-action.print {
    background: #e0f2fe;
    color: #0369a1;
    border-color: #bae6fd;
}

.student-action.print:hover {
    background: #0369a1;
    color: #ffffff;
    border-color: #0369a1;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(3, 105, 161, 0.25);
}

.student-action.print:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(3, 105, 161, 0.2);
}

/* ---------- View Button ---------- */
.student-action.view {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
}

.student-action.view:hover {
    background: #15803d;
    color: #ffffff;
    border-color: #15803d;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(21, 128, 61, 0.25);
}

.student-action.view:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(21, 128, 61, 0.2);
}

/* ---------- Focus (accessibility) ---------- */
.student-action:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

/* ---------- Mobile: icon-only buttons ---------- */
@media (max-width: 576px) {
    .student-action {
        padding: 8px 10px;
        font-size: 12px;
    }

    .student-action span {
        display: none; /* sirf icon dikhega */
    }

    .student-action i {
        font-size: 15px;
    }
}

/* ---------- Header Actions (Back + Edit) ---------- */
.view-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

/* ---------- Edit Button ---------- */
.view-edit-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 20px;
    background: linear-gradient(135deg, #198754, #20c997);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 12px rgba(25, 135, 84, 0.25);
}

.view-edit-btn:hover {
    background: linear-gradient(135deg, #146c43, #1aa179);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(25, 135, 84, 0.35);
}

.view-edit-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(25, 135, 84, 0.3);
}

.view-edit-btn i {
    font-size: 15px;
}

.view-edit-btn:focus-visible {
    outline: 2px solid #20c997;
    outline-offset: 2px;
}

/* ---------- Bottom Actions (Back + Edit aligned) ---------- */
.view-bottom-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 12px 0 32px;
    flex-wrap: wrap;
}

/* ---------- Responsive ---------- */
@media (max-width: 576px) {
    .view-header-actions,
    .view-bottom-actions {
        width: 100%;
        justify-content: space-between;
    }

    .view-edit-btn,
    .view-back-btn {
        flex: 1;
        justify-content: center;
    }
}
                `}
            </style>

            <div className="rollno-page">
                <div className="pagetitle mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold mb-1">
                                Student Roll No List
                            </h1>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <a
                                            href="/"
                                            className="text-decoration-none"
                                        >
                                            Dashboard
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        Students
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Roll No List
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <div
                            className="px-4 py-3 rounded-4 shadow-sm"
                            style={{
                                background: "linear-gradient(135deg, #4154f1, #6f7bf7)",
                                color: "#fff",
                                minWidth: "190px"
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "45px",
                                        height: "45px",
                                        background: "rgba(255,255,255,.18)"
                                    }}
                                >
                                    <i className="bi bi-people-fill fs-5"></i>
                                </div>
                                <div>
                                    <small className="opacity-75">
                                        Total Students
                                    </small>
                                    <h4 className="mb-0 fw-bold">
                                        {totalRecords}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="section">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden rollno-card">
                        <div
                            className="card-header border-0 py-4 px-4"
                            style={{
                                background: "linear-gradient(135deg, #f8f9ff, #ffffff)"
                            }}
                        />

                        <div className="px-4 pt-4 rollno-toolbar">
                            <div className="row g-3 align-items-center">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-2">
                                            Show
                                        </span>

                                        <select
                                            className="form-select shadow-none"
                                            style={{
                                                width: "85px",
                                                borderRadius: "10px"
                                            }}
                                            value={pageSize}
                                            onChange={handlePageSize}
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>

                                        <span className="text-muted ms-2">
                                            entries
                                        </span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div
                                        className="position-relative ms-md-auto"
                                        style={{ maxWidth: "320px" }}
                                    >
                                        <i
                                            className="bi bi-search position-absolute"
                                            style={{
                                                left: "15px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                color: "#899bbd"
                                            }}
                                        />

                                        <input
                                            type="text"
                                            className="form-control ps-5 shadow-none"
                                            placeholder="Search student..."
                                            value={search}
                                            onChange={handleSearch}
                                            style={{
                                                height: "44px",
                                                borderRadius: "12px",
                                                border: "1px solid #e1e5eb",
                                                paddingRight: search ? "42px" : "15px"
                                            }}
                                        />

                                        {search && (
                                            <button
                                                type="button"
                                                className="btn position-absolute p-0"
                                                style={{
                                                    right: "13px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)"
                                                }}
                                                onClick={clearSearch}
                                            >
                                                <i className="bi bi-x-circle-fill text-muted"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 pt-4">
                            <div
                                className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-3 py-2 rounded-3"
                                style={{
                                    background: "#f8f9fc"
                                }}
                            >
                                <span className="text-muted small">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Showing{" "}
                                    <strong className="text-dark">
                                        {startRecord}
                                    </strong>{" "}
                                    to{" "}
                                    <strong className="text-dark">
                                        {endRecord}
                                    </strong>{" "}
                                    of{" "}
                                    <strong className="text-dark">
                                        {totalRecords}
                                    </strong>{" "}
                                    students
                                </span>

                                {search && (
                                    <span className="text-primary small fw-semibold">
                                        Search: "{search}"
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="card-body px-4 pt-3">
                            <div className="rollno-table-wrapper">
                                <table className="table align-middle mb-0 rollno-table">
                                    <thead>
                                        <tr>
                                            <th> # </th>
                                            <th> STUDENT </th>
                                            <th> ENROLLMENT NO </th>
                                            <th> ROLL NO </th>
                                            <th> FATHER NAME </th>
                                            <th> CONTACT </th>
                                            <th> ADDRESS </th>
                                            <th>Franchise Name</th>
                                            <th>Course Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="text-center py-5"
                                                >
                                                    <div className="spinner-border text-primary mb-3"></div>
                                                    <div className="text-muted">
                                                        Loading students...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>
                                                        <span
                                                            className="d-inline-flex align-items-center justify-content-center rounded-circle fw-semibold"
                                                            style={{
                                                                width: "32px",
                                                                height: "32px",
                                                                background: "#f0f2ff",
                                                                color: "#4154f1",
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            {(pageNo - 1) * pageSize + index + 1}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="rollno-student">
                                                            <img
                                                                className="rollno-student-image"
                                                                src={`${FILE_URL}${item.selfImageShow}`}
                                                                alt="Student"
                                                                onError={(e) => {
                                                                    e.currentTarget.src =
                                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Student")}`;
                                                                }}
                                                            />

                                                            <div className="rollno-student-name">
                                                                {item.name || "-"}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>

                                                        <i className="bi bi-card-text me-1"></i>
                                                        {item.enrollmentNo || "-"}

                                                    </td>

                                                    <td>

                                                        <i className="bi bi-hash me-1"></i>
                                                        {item.rollno || "-"}

                                                    </td>

                                                    <td>
                                                        <div className="rollno-father">
                                                            <div className="rollno-father-icon">
                                                                <i className="bi bi-person"></i>
                                                            </div>

                                                            <span className="rollno-father-name">
                                                                {item.fatherName || "-"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="rollno-mobile">
                                                            {item.mobileNo || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="rollno-address">
                                                            {item.address || "-"}
                                                        </span>
                                                    </td>

                                                    <td>{item.instituteName || "-"}</td>
                                                    <td>{item.courseName || "-"}</td>

                                                   <td>
    <div className="student-action-group">
        {/* Print */}
        <button
            type="button"
            className="student-action print"
            onClick={() => handlePrint(item.id)}
            title="Print Form"
        >
            <i className="bi bi-printer-fill"></i>
            <span>Print</span>
        </button>

        {/* View */}
        <button
            type="button"
            className="student-action view"
            onClick={() => handleView(item.id)}
            title="View Student"
        >
            <i className="bi bi-eye-fill"></i>
            <span>View</span>
        </button>

        {/* Edit */}
        <button
            type="button"
            className="student-action edit"
            onClick={() => handleEdit(item.id)}
            title="Edit Student"
        >
            <i className="bi bi-pencil-square"></i>
            <span>Edit</span>
        </button>
    </div>
</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="text-center py-5"
                                                >
                                                    <div
                                                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            background: "#f1f3f9"
                                                        }}
                                                    >
                                                        <i
                                                            className="bi bi-people text-muted"
                                                            style={{
                                                                fontSize: "30px"
                                                            }}
                                                        ></i>
                                                    </div>

                                                    <h5 className="fw-semibold">
                                                        No Students Found
                                                    </h5>

                                                    <p className="text-muted mb-0">
                                                        No student records match your search.
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3 rollno-pagination">
                                    <div className="text-muted small">
                                        Page{" "}
                                        <strong className="text-dark">
                                            {pageNo}
                                        </strong>{" "}
                                        of{" "}
                                        <strong className="text-dark">
                                            {totalPages}
                                        </strong>
                                    </div>

                                    <div className="d-flex align-items-center gap-1">
                                        <button
                                            type="button"
                                            className="btn btn-light border"
                                            onClick={handlePrevious}
                                            disabled={pageNo === 1}
                                            style={{
                                                borderRadius: "10px"
                                            }}
                                        >
                                            <i className="bi bi-chevron-left"></i>
                                        </button>

                                        {getPageNumbers().map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => setPageNo(page)}
                                                className={
                                                    pageNo === page
                                                        ? "btn btn-primary"
                                                        : "btn btn-light border"
                                                }
                                                style={{
                                                    minWidth: "40px",
                                                    borderRadius: "10px"
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            type="button"
                                            className="btn btn-light border"
                                            onClick={handleNext}
                                            disabled={pageNo === totalPages}
                                            style={{
                                                borderRadius: "10px"
                                            }}
                                        >
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default RollNoList;