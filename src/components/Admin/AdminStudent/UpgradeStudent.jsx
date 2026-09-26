 import React, { useEffect, useState } from "react";
import {
    addStudentClass,
    getCourseClass,
    getMasterSessionbyupgrade,
    GetUpgradeStudentList
} from "./AdminStudentService";
import { FILE_URL } from "../../api";

function UpgradeStudent() {
    const [masterSession, setMasterSession] = useState([]);
 
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [upgradeLoading, setUpgradeLoading] = useState(false);

    const [formData, setFormData] = useState({
      
        examSessionId: 0
    });

    

    useEffect(() => {
        loadMasterSession();
        loadStudents();
    }, [pageNo, pageSize, search]);

    const loadMasterSession = async () => {
        try {
            const result = await getMasterSessionbyupgrade();
            setMasterSession(result?.data || []);
        } catch (error) {
            console.log("Session Error:", error);
        }
    };

    

    const loadStudents = async () => {
        try {
            setLoading(true);

            const result = await GetUpgradeStudentList(
                pageNo,
                pageSize,
                search
            );

            setData(result?.data?.data || []);
            setTotalRecords(result?.data?.totalRecords || 0);
        } catch (error) {
            console.log("Student Error:", error);
            setData([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPageNo(1);
    };

    const handleStudentSelect = (item, checked) => {
        const puId = String(item.puId);

        if (checked) {
            setSelectedIds((prev) => {
                if (prev.includes(puId)) {
                    return prev;
                }

                return [...prev, puId];
            });
        } else {
            setSelectedIds((prev) =>
                prev.filter((id) => id !== puId)
            );
        }
    };

    const handleSelectAll = (e) => {
        const currentPuids = data
            .filter((item) => item.puId != null)
            .map((item) => String(item.puId));

        if (e.target.checked) {
            setSelectedIds((prev) => {
                const newPuids = currentPuids.filter(
                    (puId) => !prev.includes(puId)
                );

                return [...prev, ...newPuids];
            });
        } else {
            setSelectedIds((prev) =>
                prev.filter(
                    (puId) => !currentPuids.includes(puId)
                )
            );
        }
    };

    const isAllSelected =
        data.length > 0 &&
        data
            .filter((item) => item.puId != null)
            .every((item) =>
                selectedIds.includes(String(item.puId))
            );

    const handleSendToConfirm = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one student.");
            return;
        }

        if (!formData.examSessionId || formData.examSessionId === 0) {
            alert("Please select Session.");
            return;
        }

        

        try {
            setUpgradeLoading(true);

            const requestData = {
                
                examSessionId: formData.examSessionId,
                pUid: selectedIds
            };

            console.log("Upgrade Request Data:", requestData);

            const result = await addStudentClass(requestData);

            console.log("Upgrade Response:", result);

            alert(
                result?.message ||
                "Students upgraded successfully."
            );

            setSelectedIds([]);

            await loadStudents();
        } catch (error) {
            console.log("Upgrade Error:", error);

            alert(
                error?.response?.data?.message ||
                "Something went wrong while upgrading students."
            );
        } finally {
            setUpgradeLoading(false);
        }
    };

    const totalPages = Math.ceil(
        totalRecords / pageSize
    );

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

                .upgrade-page {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    overflow-x: hidden;
                    box-sizing: border-box;
                }

                .upgrade-page .section,
                .upgrade-page .card,
                .upgrade-page .card-body,
                .upgrade-page .card-header {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    box-sizing: border-box;
                }

                .upgrade-table-wrapper {
                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    position: relative;
                    box-sizing: border-box;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-gutter: stable;
                    contain: inline-size;
                    border-radius: 14px;
                    border: 1px solid #edf0f5;
                }

                .upgrade-table {
                    width: 1450px !important;
                    min-width: 1450px !important;
                    max-width: none !important;
                    table-layout: fixed !important;
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                    margin: 0 !important;
                }

                .upgrade-table th,
                .upgrade-table td {
                    box-sizing: border-box;
                }

                .upgrade-table th:nth-child(1),
                .upgrade-table td:nth-child(1) {
                    width: 70px;
                }

                .upgrade-table th:nth-child(2),
                .upgrade-table td:nth-child(2) {
                    width: 70px;
                }

                .upgrade-table th:nth-child(3),
                .upgrade-table td:nth-child(3) {
                    width: 110px;
                }

                .upgrade-table th:nth-child(4),
                .upgrade-table td:nth-child(4) {
                    width: 180px;
                }

                .upgrade-table th:nth-child(5),
                .upgrade-table td:nth-child(5) {
                    width: 220px;
                }

                .upgrade-table th:nth-child(6),
                .upgrade-table td:nth-child(6) {
                    width: 210px;
                }

                .upgrade-table th:nth-child(7),
                .upgrade-table td:nth-child(7) {
                    width: 250px;
                }

                .upgrade-table th:nth-child(8),
                .upgrade-table td:nth-child(8) {
                    width: 150px;
                }

                .upgrade-table th:nth-child(9),
                .upgrade-table td:nth-child(9) {
                    width: 220px;
                }

                .upgrade-table th:nth-child(10),
                .upgrade-table td:nth-child(10) {
                    width: 240px;
                }

                .upgrade-table thead th {
                    background: #f8f9fc !important;
                    color: #687185;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: .3px;
                    white-space: nowrap;
                    padding: 15px 16px !important;
                    border-bottom: 1px solid #e9edf3 !important;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                }

                .upgrade-table tbody td {
                    padding: 14px 16px !important;
                    color: #414a5d;
                    font-size: 13px;
                    vertical-align: middle !important;
                    border-bottom: 1px solid #f0f2f6 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    height: 76px;
                }

                .upgrade-table tbody tr:last-child td {
                    border-bottom: 0 !important;
                }

                .upgrade-table tbody tr:hover {
                    background: #fafbff;
                }

                .upgrade-checkbox {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }

                .upgrade-student {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 0;
                    width: 100%;
                }

                .upgrade-student-image {
                    width: 55px;
                    height: 55px;
                    min-width: 55px;
                    object-fit: cover;
                    border-radius: 14px;
                    border: 3px solid #fff;
                    box-shadow: 0 3px 10px rgba(0,0,0,.12);
                }

                .upgrade-student-name {
                    display: block;
                    max-width: 165px;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: 600;
                    color: #212529;
                }

                .upgrade-cell {
                    display: block;
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .upgrade-badge {
                    display: inline-flex;
                    align-items: center;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    box-sizing: border-box;
                }

                .upgrade-father {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    min-width: 0;
                    max-width: 100%;
                }

                .upgrade-father-icon {
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

                .upgrade-father-name {
                    display: block;
                    min-width: 0;
                    max-width: 155px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .upgrade-address {
                    display: block;
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #596273;
                }

                .upgrade-email {
                    display: block;
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .upgrade-course {
                    display: block;
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: 500;
                }

                .upgrade-table-wrapper::-webkit-scrollbar {
                    height: 9px;
                }

                .upgrade-table-wrapper::-webkit-scrollbar-track {
                    background: #eef1f5;
                    border-radius: 10px;
                }

                .upgrade-table-wrapper::-webkit-scrollbar-thumb {
                    background: #b8bfcc;
                    border-radius: 10px;
                }

                .upgrade-table-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #8f98a8;
                }

                .upgrade-table-wrapper {
                    scrollbar-width: thin;
                    scrollbar-color: #b8bfcc #eef1f5;
                }

                @media (max-width: 768px) {
                    .upgrade-table-wrapper {
                        width: 0 !important;
                        min-width: 100% !important;
                        max-width: 100% !important;
                        overflow-x: auto !important;
                    }

                    .upgrade-table {
                        width: 1450px !important;
                        min-width: 1450px !important;
                    }
                }
                `}
            </style>

            <div className="upgrade-page">
                <div className="mb-3">
                    <h1>
                        Upgrade Student
                    </h1>

                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    Dashboard
                                </a>
                            </li>

                            <li className="breadcrumb-item">
                                Student
                            </li>

                            <li className="breadcrumb-item active">
                                Upgrade Student
                            </li>
                        </ol>
                    </nav>
                </div>

                <section className="section">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">
                                Upgrade Students
                            </h5>

                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label className="form-label">
                                        Session
                                        <span className="text-danger">
                                            {" "}*
                                        </span>
                                    </label>

                                    <select
                                        className="form-select"
                                        value={formData.examSessionId}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                examSessionId: Number(e.target.value)
                                            }));
                                        }}
                                    >
                                        <option value={0}>
                                            Select Session
                                        </option>

                                        {masterSession.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                

                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        disabled={
                                            upgradeLoading ||
                                            selectedIds.length === 0
                                        }
                                        onClick={handleSendToConfirm}
                                    >
                                        {upgradeLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-arrow-up-circle me-2" />
                                                Upgrade ({selectedIds.length})
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search student..."
                                        value={search}
                                        onChange={handleSearch}
                                    />
                                </div>

                                <div className="col-md-8 text-end">
                                    <span className="badge bg-primary fs-6">
                                        Selected Students: {selectedIds.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <h5 className="card-title">
                                Upgrade Student List
                            </h5>

                            <div className="upgrade-table-wrapper">
                                <table className="table table-hover align-middle upgrade-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                SrNo
                                            </th>

                                            <th>
                                                <input
                                                    className="form-check-input upgrade-checkbox"
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>

                                            <th>
                                                Image
                                            </th>

                                            <th>
                                                Enrollment No
                                            </th>

                                            <th>
                                                Name
                                            </th>

                                            <th>
                                                Father Name
                                            </th>
                                            <th>
                                              ExamSession
                                            </th>

                                         

                                            <th>
                                                Mobile No
                                            </th>

                                            <th>
                                                Email
                                            </th>

                                            <th>
                                                Course Name
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan="10"
                                                    className="text-center py-5"
                                                >
                                                    <div className="spinner-border text-primary" />
                                                    <div className="mt-2">
                                                        Loading students...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="10"
                                                    className="text-center py-5 text-muted"
                                                >
                                                    No students found.
                                                </td>
                                            </tr>
                                        ) : (
                                            data.map((item, index) => (
                                                <tr
                                                    key={
                                                        item.puId ??
                                                        item.id ??
                                                        index
                                                    }
                                                >
                                                    <td>
                                                        {(pageNo - 1) *
                                                            pageSize +
                                                            index +
                                                            1}
                                                    </td>

                                                    <td>
                                                        <input
                                                            className="form-check-input upgrade-checkbox"
                                                            type="checkbox"
                                                            checked={selectedIds.includes(
                                                                String(item.puId)
                                                            )}
                                                            onChange={(e) =>
                                                                handleStudentSelect(
                                                                    item,
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <img
                                                            className="upgrade-student-image"
                                                   
                                                            src={`${FILE_URL}${item.selfImageShow}`} 
                                                            alt="Student"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                        item.name || "Student"
                                                                    )}`;
                                                            }}
                                                        />
                                                    </td>

                                                    <td>
                                                        <span className="upgrade-cell">
                                                            {item.enrollmentNo || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="upgrade-cell">
                                                            {item.name || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="upgrade-father">
                                                            <div className="upgrade-father-icon">
                                                                <i className="bi bi-person"></i>
                                                            </div>

                                                            <span className="upgrade-father-name">
                                                                {item.fatherName || "-"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    

                                                    <td>
                                                        <span className="upgrade-cell">
                                                            {item.startDate || "-"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="upgrade-cell">
                                                            {item.mobileNo || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="upgrade-email">
                                                            {item.email || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="upgrade-course">
                                                            {item.courseName || "-"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
                                    <div>
                                        <small className="text-muted">
                                            Showing{" "}
                                            <strong>
                                                {totalRecords === 0
                                                    ? 0
                                                    : (pageNo - 1) * pageSize + 1}
                                            </strong>{" "}
                                            to{" "}
                                            <strong>
                                                {Math.min(
                                                    pageNo * pageSize,
                                                    totalRecords
                                                )}
                                            </strong>{" "}
                                            of{" "}
                                            <strong>
                                                {totalRecords}
                                            </strong>{" "}
                                            students
                                        </small>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            disabled={pageNo === 1}
                                            onClick={() =>
                                                setPageNo((prev) => prev - 1)
                                            }
                                        >
                                            Previous
                                        </button>

                                        <span className="btn btn-light">
                                            Page {pageNo} of {totalPages}
                                        </span>

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            disabled={pageNo >= totalPages}
                                            onClick={() =>
                                                setPageNo((prev) => prev + 1)
                                            }
                                        >
                                            Next
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

export default UpgradeStudent;