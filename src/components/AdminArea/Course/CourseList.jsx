 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseDelete, getCourses } from "../../AllServicesFiles/CourseService";

function CourseList() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/Course-update/${id}`);
    };

    const handleAddSubject = (id) => {
        navigate(`/subject-create/${id}`);
    };
    const handleAddmaterial = (id) => {
        navigate(`/course-material/${id}`);
    };

    const handleAddAmount = (id) => {
        navigate(`/course-amount/${id}`);
    };

    useEffect(() => {
        loadCourses();
    }, [pageNo, pageSize, search]);

    const loadCourses = async () => {
        try {
            setLoading(true);

            const result = await getCourses(pageNo, pageSize, search);

            setData(result?.data?.data || []);
            setTotalRecords(result?.data?.totalRecords || 0);
        } catch (error) {
            console.log(error);
            setData([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalRecords / pageSize);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPageNo(1);
    };

    const clearSearch = () => {
        setSearch("");
        setPageNo(1);
    };

    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);

            const result = await getCourseDelete(deleteId);

            alert(result.message);

            setShowDeleteModal(false);
            setDeleteId(0);

            await loadCourses();
        } catch (error) {
            console.log(error);
            alert("Unable to delete course.");
        } finally {
            setDeleteLoading(false);
        }
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

                .course-page {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    overflow-x: hidden;
                    box-sizing: border-box;
                }

                .course-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    gap: 20px;
                    min-width: 0;
                    max-width: 100%;
                }

                .course-page-header h1 {
                    margin: 0 0 8px;
                    font-size: 28px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .course-page-header h1 i {
                    color: #4154f1;
                }

                .breadcrumb {
                    margin: 0;
                    padding: 0;
                    background: transparent;
                }

                .breadcrumb-item a {
                    color: #4154f1;
                    text-decoration: none;
                }

                .add-course-btn {
                    border: none;
                    background: linear-gradient(135deg, #4154f1, #6573f5);
                    color: white;
                    padding: 11px 20px;
                    border-radius: 9px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 5px 15px rgba(65, 84, 241, .22);
                    transition: .2s ease;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .add-course-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(65, 84, 241, .30);
                }

                .course-card {
                    width: 100%;
                    min-width: 0;
                    max-width: 100%;
                    background: #fff;
                    border-radius: 14px;
                    border: 1px solid #e7eaf0;
                    box-shadow: 0 5px 25px rgba(30, 41, 59, .06);
                    overflow: hidden;
                    box-sizing: border-box;
                }

                .course-card-header {
                    padding: 22px 25px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #edf0f5;
                    min-width: 0;
                    max-width: 100%;
                    gap: 15px;
                }

                .course-card-header h5 {
                    margin: 0;
                    font-size: 19px;
                    color: #1e293b;
                    font-weight: 700;
                }

                .course-card-header h5 i {
                    color: #4154f1;
                }

                .course-card-header p {
                    margin: 5px 0 0;
                    color: #8a94a6;
                    font-size: 13px;
                }

                .course-count {
                    min-width: 100px;
                    text-align: center;
                    background: #f4f6ff;
                    border: 1px solid #e4e7ff;
                    border-radius: 10px;
                    padding: 8px 14px;
                    flex-shrink: 0;
                }

                .course-count span {
                    display: block;
                    color: #4154f1;
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 1.2;
                }

                .course-count small {
                    color: #7c86a2;
                    font-size: 11px;
                }

                .course-toolbar {
                    padding: 18px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    min-width: 0;
                    max-width: 100%;
                }

                .course-search {
                    position: relative;
                    width: 380px;
                    max-width: 100%;
                }

                .course-search > i {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #8c96a8;
                    font-size: 16px;
                    z-index: 1;
                }

                .course-search input {
                    width: 100%;
                    height: 43px;
                    border: 1px solid #dfe3ea;
                    border-radius: 9px;
                    padding: 0 40px;
                    outline: none;
                    color: #334155;
                    font-size: 14px;
                    transition: .2s ease;
                }

                .course-search input:focus {
                    border-color: #4154f1;
                    box-shadow: 0 0 0 3px rgba(65,84,241,.08);
                }

                .course-search button {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: none;
                    background: transparent;
                    color: #9aa3b2;
                    cursor: pointer;
                    padding: 2px;
                    z-index: 2;
                }

                .course-info {
                    color: #7c8799;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }

                .course-info i {
                    color: #4154f1;
                }

                .course-table-outer {
                    width: 100%;
                    min-width: 0;
                    max-width: 100%;
                    padding: 0 25px;
                    box-sizing: border-box;
                }

                .course-table-wrapper {
                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    position: relative;
                    box-sizing: border-box;
                    border-top: 1px solid #edf0f5;
                    border-bottom: 1px solid #edf0f5;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                    scrollbar-color: #b8bfcc #eef1f5;
                }

                .course-table-wrapper::-webkit-scrollbar {
                    height: 9px;
                }

                .course-table-wrapper::-webkit-scrollbar-track {
                    background: #eef1f5;
                    border-radius: 10px;
                }

                .course-table-wrapper::-webkit-scrollbar-thumb {
                    background: #b8bfcc;
                    border-radius: 10px;
                }

                .course-table-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #8f98a8;
                }

                /* ============================================
                   TABLE — AUTO WIDTH + AUTO HEIGHT
                   ============================================ */

                .course-table {
                    width: auto !important;
                    min-width: 100% !important;
                    max-width: none !important;
                    table-layout: auto !important;
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                    margin: 0 !important;
                }

                .course-table th,
                .course-table td {
                    box-sizing: border-box;
                }

                .course-table thead th {
                    background: #f8f9fc !important;
                    color: #687185;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: .3px;
                    white-space: nowrap;
                    padding: 15px 16px !important;
                    border-bottom: 1px solid #e9edf3 !important;
                    vertical-align: middle;
                }

                .course-table tbody td {
                    padding: 14px 16px !important;
                    color: #414a5d;
                    font-size: 13px;
                    vertical-align: middle !important;
                    border-bottom: 1px solid #f0f2f6 !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                    text-overflow: clip !important;
                }

                .course-table tbody tr {
                    transition: .15s ease;
                }

                .course-table tbody tr:hover {
                    background: #fafbff;
                }

                .course-table tbody tr:last-child td {
                    border-bottom: none !important;
                }

                .serial-number {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f0f2ff;
                    color: #4154f1;
                    font-size: 13px;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: visible;
                }

                .course-code {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 10px;
                    border-radius: 20px;
                    background: #eef7ff;
                    color: #0d6efd;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .course-name-cell {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 0;
                    width: auto;
                }

                .course-icon {
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #eef2ff;
                    color: #4154f1;
                }

                .course-name-cell strong {
                    display: inline-block;
                    color: #212529;
                    font-size: 13px;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: visible;
                    text-overflow: clip;
                    max-width: none;
                }

                .hindi-name {
                    display: inline-block;
                    color: #596273;
                    white-space: nowrap;
                    overflow: visible;
                    text-overflow: clip;
                    max-width: none;
                }

                .type-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 11px;
                    border-radius: 20px;
                    background: #fff5e6;
                    color: #f39c12;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .duration-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 10px;
                    border-radius: 20px;
                    background: #ecfdf3;
                    color: #15803d;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .category-text,
                .department-text {
                    display: inline-block;
                    color: #475467;
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: visible;
                    text-overflow: clip;
                    max-width: none;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 11px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .status-badge.active {
                    background: #ecfdf3;
                    color: #027a48;
                }

                .status-badge.inactive {
                    background: #fef3f2;
                    color: #b42318;
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: currentColor;
                }

                .course-actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    overflow: visible;
                }

                .action-btn {
                    width: 34px;
                    height: 34px;
                    min-width: 34px;
                    border-radius: 7px;
                    border: 1px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: .18s ease;
                    background: white;
                }

                .edit-btn {
                    color: #4154f1;
                    border-color: #dfe3ff;
                }

                .edit-btn:hover {
                    color: white;
                    background: #4154f1;
                    border-color: #4154f1;
                }

                .delete-btn {
                    color: #dc3545;
                    border-color: #f4c7cc;
                }

                .delete-btn:hover {
                    color: white;
                    background: #dc3545;
                    border-color: #dc3545;
                }

                .subject-btn {
                    height: 34px;
                    padding: 0 11px;
                    border: none;
                    border-radius: 7px;
                    background: #4154f1;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    cursor: pointer;
                    transition: .18s ease;
                    white-space: nowrap;
                }

                .subject-btn:hover {
                    background: #3042d8;
                    transform: translateY(-1px);
                }

                .course-pagination {
                    min-width: 0;
                    max-width: 100%;
                    padding: 17px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                }

                .pagination-info {
                    color: #7c8799;
                    font-size: 13px;
                }

                .pagination-info strong {
                    color: #344054;
                }

                .pagination-buttons {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pagination-buttons button {
                    height: 36px;
                    border: 1px solid #dfe3ea;
                    background: white;
                    border-radius: 7px;
                    padding: 0 13px;
                    color: #475467;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                }

                .pagination-buttons button:hover:not(:disabled) {
                    color: #4154f1;
                    border-color: #4154f1;
                }

                .pagination-buttons button:disabled {
                    opacity: .45;
                    cursor: not-allowed;
                }

                .page-number {
                    color: #667085;
                    font-size: 12px;
                    padding: 0 5px;
                }

                .page-number strong {
                    color: #344054;
                }

                .course-loading {
                    min-height: 220px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 12px;
                    color: #667085;
                }

                .course-empty {
                    min-height: 230px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    text-align: center;
                }

                .empty-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #f1f3f8;
                    color: #98a2b3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    margin-bottom: 12px;
                }

                .course-empty h5 {
                    color: #344054;
                    margin: 0 0 5px;
                }

                .course-empty p {
                    color: #98a2b3;
                    margin: 0 0 12px;
                    font-size: 13px;
                }

                .course-empty button {
                    border: none;
                    background: #eef2ff;
                    color: #4154f1;
                    padding: 7px 13px;
                    border-radius: 7px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .course-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: rgba(15, 23, 42, .60);
                    backdrop-filter: blur(3px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .course-delete-modal {
                    width: 100%;
                    max-width: 430px;
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    text-align: center;
                    box-shadow: 0 25px 60px rgba(0,0,0,.18);
                    animation: modalShow .2s ease;
                }

                @keyframes modalShow {
                    from {
                        opacity: 0;
                        transform: scale(.95) translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .delete-icon-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 17px;
                }

                .delete-icon {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: #fff1f2;
                    color: #dc3545;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                }

                .course-delete-modal h4 {
                    margin: 0 0 8px;
                    color: #1e293b;
                    font-weight: 700;
                }

                .course-delete-modal p {
                    margin: 0;
                    color: #667085;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .course-delete-modal p span {
                    color: #98a2b3;
                    font-size: 12px;
                }

                .delete-modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 25px;
                }

                .delete-modal-actions button {
                    height: 40px;
                    padding: 0 18px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    cursor: pointer;
                }

                .cancel-delete {
                    background: #f8f9fb;
                    color: #475467;
                    border: 1px solid #dfe3ea;
                }

                .cancel-delete:hover {
                    background: #eef0f4;
                }

                .confirm-delete {
                    background: #dc3545;
                    color: white;
                    border: 1px solid #dc3545;
                }

                .confirm-delete:hover:not(:disabled) {
                    background: #bb2d3b;
                }

                .delete-modal-actions button:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .course-page-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .add-course-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .course-toolbar {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .course-search {
                        width: 100%;
                    }

                    .course-card-header {
                        padding: 18px;
                    }

                    .course-toolbar {
                        padding: 15px 18px;
                    }

                    .course-table-outer {
                        padding: 0 18px;
                    }

                    .course-table-wrapper {
                        width: 0 !important;
                        min-width: 100% !important;
                        max-width: 100% !important;
                        overflow-x: auto !important;
                    }

                    .course-table {
                        width: auto !important;
                        min-width: 100% !important;
                        max-width: none !important;
                    }

                    .course-pagination {
                        align-items: flex-start;
                        flex-direction: column;
                        padding: 15px 18px;
                    }

                    .pagination-buttons {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
                `}
            </style>

            <div className="course-page">

                <div className="course-page-header">
                    <div>
                        <h1>
                            <i className="bi bi-book-half me-2"></i>
                            Course Management
                        </h1>

                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">
                                        <i className="bi bi-house-door me-1"></i>
                                        Dashboard
                                    </a>
                                </li>

                                <li className="breadcrumb-item active">
                                    Course Detail
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <button
                        type="button"
                        className="add-course-btn"
                        onClick={() => navigate("/course-create")}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add Course
                    </button>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="course-card">

                                <div className="course-card-header">
                                    <div>
                                        <h5>
                                            <i className="bi bi-journal-text me-2"></i>
                                            Course List
                                        </h5>

                                        <p>
                                            Manage courses, subjects and course details
                                        </p>
                                    </div>

                                    <div className="course-count">
                                        <span>{totalRecords}</span>
                                        <small>Total Courses</small>
                                    </div>
                                </div>

                                <div className="course-toolbar">

                                    <div className="course-search">
                                        <i className="bi bi-search"></i>

                                        <input
                                            type="text"
                                            placeholder="Search by code or course name..."
                                            value={search}
                                            onChange={handleSearch}
                                        />

                                        {search && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                            >
                                                <i className="bi bi-x-circle-fill"></i>
                                            </button>
                                        )}
                                    </div>

                                    <div className="course-info">
                                        <i className="bi bi-info-circle"></i>
                                        {totalRecords} course
                                        {totalRecords !== 1 ? "s" : ""} found
                                    </div>

                                </div>

                                <div className="course-table-outer">

                                    <div className="course-table-wrapper">

                                        <table className="course-table">

                                            <thead>
                                                <tr>
                                                    <th className="text-center">#</th>
                                                    <th>Code</th>
                                                    <th>Course Name</th>
                                                    <th>Hindi Name</th>
                                                    <th>Type</th>
                                                    <th>Duration</th>
                                                    <th>Category</th>
                                                    <th>Department</th>
                                                    <th className="text-center">Status</th>
                                                    <th className="text-center">Actions</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="10">
                                                            <div className="course-loading">
                                                                <div className="spinner-border text-primary"></div>
                                                                <span>
                                                                    Loading courses...
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : data.length === 0 ? (

                                                    <tr>
                                                        <td colSpan="10">
                                                            <div className="course-empty">

                                                                <div className="empty-icon">
                                                                    <i className="bi bi-journal-x"></i>
                                                                </div>

                                                                <h5>
                                                                    No Courses Found
                                                                </h5>

                                                                <p>
                                                                    {search
                                                                        ? "No course matches your search."
                                                                        : "No courses have been added yet."}
                                                                </p>

                                                                {search && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={clearSearch}
                                                                    >
                                                                        Clear Search
                                                                    </button>
                                                                )}

                                                            </div>
                                                        </td>
                                                    </tr>

                                                ) : (

                                                    data.map((item, index) => (

                                                        <tr
                                                            key={
                                                                item.id ||
                                                                index
                                                            }
                                                        >

                                                            <td className="text-center">
                                                                <span className="serial-number">
                                                                    {(pageNo - 1) *
                                                                        pageSize +
                                                                        index +
                                                                        1}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="course-code">
                                                                    {item.code || "-"}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <div className="course-name-cell">

                                                                    <div className="course-icon">
                                                                        <i className="bi bi-book"></i>
                                                                    </div>

                                                                    <strong>
                                                                        {item.name || "-"}
                                                                    </strong>

                                                                </div>
                                                            </td>

                                                            <td>
                                                                <span className="hindi-name">
                                                                    {item.nameHindi || "-"}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="type-badge">
                                                                    {!item.parentId
                                                                        ? "Course"
                                                                        : "Class"}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="duration-badge">
                                                                    <i className="bi bi-clock me-1"></i>
                                                                    {item.durationName || "-"}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="category-text">
                                                                    {item.categoryName || "-"}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="department-text">
                                                                    {item.departmentName || "-"}
                                                                </span>
                                                            </td>

                                                            <td className="text-center">

                                                                {item.isActive == 1 ? (
                                                                    <span className="status-badge active">
                                                                        <span className="status-dot"></span>
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="status-badge inactive">
                                                                        <span className="status-dot"></span>
                                                                        Inactive
                                                                    </span>
                                                                )}

                                                            </td>

                                                            {/* ============================================
                                                                ACTIONS — all buttons visible
                                                            ============================================ */}

                                                            <td>

                                                                <div className="course-actions">

                                                                    <button
                                                                        type="button"
                                                                        className="action-btn edit-btn"
                                                                        title="Edit Course"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-pencil-square"></i>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="action-btn delete-btn"
                                                                        title="Delete Course"
                                                                        onClick={() => {
                                                                            setDeleteId(
                                                                                item.id
                                                                            );
                                                                            setShowDeleteModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-trash3"></i>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="subject-btn"
                                                                        onClick={() =>
                                                                            handleAddSubject(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-plus-circle"></i>
                                                                        Subject
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="subject-btn"
                                                                        onClick={() =>
                                                                            handleAddmaterial(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-plus-circle"></i>
                                                                        Course-Material
                                                                    </button>

                                                                    {(!item.parentId ||
                                                                        item.parentId === 0) && (
                                                                        <button
                                                                            type="button"
                                                                            className="subject-btn"
                                                                            onClick={() =>
                                                                                handleAddAmount(
                                                                                    item.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="bi bi-plus-circle"></i>
                                                                            Amount
                                                                        </button>
                                                                    )}

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    ))
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                                {totalRecords > 0 && (
                                    <div className="course-pagination">

                                        <div className="pagination-info">
                                            Showing{" "}
                                            <strong>
                                                {(pageNo - 1) *
                                                    pageSize +
                                                    1}
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
                                            courses
                                        </div>

                                        <div className="pagination-buttons">

                                            <button
                                                type="button"
                                                disabled={
                                                    pageNo === 1 ||
                                                    loading
                                                }
                                                onClick={() =>
                                                    setPageNo(
                                                        (prev) =>
                                                            prev - 1
                                                    )
                                                }
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                                Previous
                                            </button>

                                            <div className="page-number">
                                                Page{" "}
                                                <strong>
                                                    {pageNo}
                                                </strong>{" "}
                                                of{" "}
                                                <strong>
                                                    {totalPages || 1}
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={
                                                    pageNo >=
                                                        totalPages ||
                                                    loading
                                                }
                                                onClick={() =>
                                                    setPageNo(
                                                        (prev) =>
                                                            prev + 1
                                                    )
                                                }
                                            >
                                                Next
                                                <i className="bi bi-chevron-right"></i>
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </section>
            </div>

            {showDeleteModal && (

                <div
                    className="course-modal-overlay"
                    onClick={() =>
                        setShowDeleteModal(false)
                    }
                >

                    <div
                        className="course-delete-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="delete-icon-wrapper">
                            <div className="delete-icon">
                                <i className="bi bi-trash3-fill"></i>
                            </div>
                        </div>

                        <h4>
                            Delete Course?
                        </h4>

                        <p>
                            Are you sure you want to delete this course?
                            <br />
                            <span>
                                This action cannot be undone.
                            </span>
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                type="button"
                                className="cancel-delete"
                                disabled={deleteLoading}
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                            >
                                <i className="bi bi-x-lg"></i>
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-delete"
                                disabled={deleteLoading}
                                onClick={confirmDelete}
                            >

                                {deleteLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3"></i>
                                        Delete Course
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}
        </>
    );
}

export default CourseList;