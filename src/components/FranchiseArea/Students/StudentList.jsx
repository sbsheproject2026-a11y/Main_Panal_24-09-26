 import React, { useEffect, useState } from "react";
import { getStudentDelete, getStudents } from "../../AllServicesFiles/StudentService";
import { useNavigate } from "react-router-dom";
import { FILE_URL } from "../../api";

function StudentList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/student-update/${id}`);
  };

  const handleView = (id) => {
    navigate(`/student-view/${id}`);
  };
  const handleAcademicdetails = (id) => {
    navigate(`/academic-update/${id}`);
  };

  useEffect(() => {
    loadStudents();
  }, [pageNo, pageSize, search]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const result = await getStudents(pageNo, pageSize, search);
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

  const startRecord = totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;
  const endRecord = totalRecords === 0 ? 0 : Math.min(pageNo * pageSize, totalRecords);

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
    if (pageNo > 1) setPageNo(pageNo - 1);
  };

  const handleNext = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (pageNo <= 3) return [1, 2, 3, 4, 5];
    if (pageNo >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [pageNo - 2, pageNo - 1, pageNo, pageNo + 1, pageNo + 2];
  };

  const confirmDelete = async () => {
    try {
      const result = await getStudentDelete(deleteId);
      alert(result.message);
      setShowDeleteModal(false);
      setDeleteId(0);

      if (data.length === 1 && pageNo > 1) {
        setPageNo((prev) => prev - 1);
      } else {
        loadStudents();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{`
        html,
        body,
        #root {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden !important;
        }

        .student-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .student-page .section,
        .student-page .card,
        .student-page .card-body {
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }

        .student-list-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          border: 0;
          border-radius: 18px !important;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(30, 34, 40, .07);
        }

        .student-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 25px 18px;
          border-bottom: 1px solid #edf0f5;
          background: linear-gradient(135deg, #f8f9ff, #ffffff);
          min-width: 0;
          gap: 15px;
          flex-wrap: wrap;
        }

        .student-card-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          color: #263238;
        }

        .student-card-subtitle {
          margin: 5px 0 0;
          font-size: 13px;
          color: #8b95a5;
        }

        .student-total-badge {
          display: inline-flex;
          align-items: center;
          background: #eef1ff;
          color: #4154f1;
          border-radius: 30px;
          padding: 7px 13px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .student-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 25px;
          background: #fff;
          min-width: 0;
          max-width: 100%;
          gap: 20px;
          flex-wrap: wrap;
        }

        .student-search-box {
          width: 320px;
          max-width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          position: relative;
          border: 1px solid #e1e5eb;
          border-radius: 12px;
          background: #fff;
          transition: .2s;
          box-sizing: border-box;
        }

        .student-search-box:focus-within {
          border-color: #4154f1;
          box-shadow: 0 0 0 3px rgba(65, 84, 241, .08);
        }

        .student-search-box > i {
          margin-left: 15px;
          color: #899bbd;
        }

        .student-search-box input {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          padding: 0 42px 0 10px;
          font-size: 13px;
          color: #333;
          background: transparent;
        }

        .student-search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #8b95a5;
          cursor: pointer;
          padding: 4px;
        }

        .student-page-size {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7b8494;
          font-size: 13px;
        }

        .student-page-size select {
          height: 38px;
          width: 85px;
          border: 1px solid #e1e5eb;
          border-radius: 10px;
          padding: 0 9px;
          outline: none;
          color: #4a5565;
          background: #fff;
          cursor: pointer;
        }

        .student-info-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin: 0 25px;
          padding: 8px 12px;
          border-radius: 10px;
          background: #f8f9fc;
        }

        .student-record-info-top {
          color: #8a94a6;
          font-size: 12px;
        }

        .student-record-info-top strong {
          color: #475467;
        }

        .student-search-info {
          color: #4154f1;
          font-size: 12px;
          font-weight: 600;
        }

        /* =========================================================
           TABLE WRAPPER — only this area scrolls
        ========================================================= */

        .student-table-wrapper {
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

        /* =========================================================
           TABLE — AUTO WIDTH + AUTO HEIGHT
        ========================================================= */

        .student-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
        }

        .student-table th,
        .student-table td {
          box-sizing: border-box;
        }

        .student-table thead th {
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

        .student-table tbody td {
          padding: 14px 16px !important;
          color: #414a5d;
          font-size: 13px;
          vertical-align: middle !important;
          border-bottom: 1px solid #f0f2f6 !important;
          white-space: nowrap !important;
          overflow: visible !important;
          text-overflow: clip !important;
        }

        .student-table tbody tr:last-child td {
          border-bottom: 0 !important;
        }

        .student-table tbody tr:hover {
          background: #fafbff;
        }

        /* =========================================================
           CELL CONTENT
        ========================================================= */

        .sr-column {
          text-align: center;
        }

        .student-number {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f0f2ff;
          color: #4154f1;
          font-size: 13px;
          font-weight: 600;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .student-image,
        .student-image-placeholder {
          width: 52px;
          height: 52px;
          min-width: 52px;
          object-fit: cover;
          border-radius: 14px;
          border: 3px solid #fff;
          box-shadow: 0 3px 10px rgba(0,0,0,.12);
        }

        .student-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef1ff;
          color: #4154f1;
          font-size: 20px;
        }

        .student-name-wrapper {
          min-width: 0;
        }

        .student-name {
          font-weight: 600;
          color: #212529;
          font-size: 13px;
          white-space: nowrap;
        }

        .student-name-wrapper small {
          display: block;
          margin-top: 4px;
          color: #98a1b2;
          font-size: 10px;
          white-space: nowrap;
        }

        .table-text {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #4b5565;
          white-space: nowrap;
        }

        .table-text i {
          color: #8d97a8;
        }

        .mobile-number {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          font-weight: 600;
        }

        .mobile-number i {
          color: #35b37e;
          font-size: 11px;
        }

        .username-badge {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          background: #eef7ff;
          color: #3578c7;
          padding: 7px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .address-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .address-text i {
          color: #f25f5c;
        }

        .action-column {
          text-align: center;
        }

        .student-actions {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .student-action {
          width: 34px;
          height: 34px;
          min-width: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 9px;
          cursor: pointer;
          transition: all .2s ease;
        }

        .student-action i {
          font-size: 13px;
        }

        .student-action.view {
          color: #3578c7;
          background: #eef6ff;
        }

        .student-action.view:hover {
          color: #fff;
          background: #3578c7;
        }

        .student-action.edit {
          color: #d68b00;
          background: #fff7e6;
        }

        .student-action.edit:hover {
          color: #fff;
          background: #e5a000;
        }

        .student-action.delete {
          color: #e5484d;
          background: #fff0f0;
        }

        .student-action.delete:hover {
          color: #fff;
          background: #e5484d;
        }

        /* =========================================================
           EMPTY / LOADING
        ========================================================= */

        .student-empty-state {
          height: 280px;
          text-align: center !important;
        }

        .student-empty-state > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .student-empty-state-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #f1f3f9;
          color: #6472dc;
          font-size: 30px;
          margin-bottom: 14px;
        }

        .student-empty-state h5 {
          margin-bottom: 6px;
          color: #344054;
          font-weight: 600;
        }

        .student-empty-state p {
          color: #98a2b3;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .student-loading {
          height: 280px;
          text-align: center !important;
        }

        .student-loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .student-loading-content .spinner-border {
          margin-bottom: 12px;
        }

        /* =========================================================
           PAGINATION
        ========================================================= */

        .student-table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 25px;
          gap: 15px;
          flex-wrap: wrap;
          border-top: 1px solid #edf0f5;
        }

        .student-record-info {
          color: #8a94a6;
          font-size: 12px;
        }

        .student-record-info strong {
          color: #475467;
        }

        .student-pagination {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .student-pagination button {
          min-width: 38px;
          height: 38px;
          padding: 0 10px;
          border: 1px solid #e4e7ec;
          background: #fff;
          color: #667085;
          border-radius: 10px;
          font-size: 12px;
          cursor: pointer;
          transition: .2s;
        }

        .student-pagination button:hover:not(:disabled) {
          border-color: #4154f1;
          color: #4154f1;
        }

        .student-pagination button.active {
          background: #4154f1;
          border-color: #4154f1;
          color: #fff;
        }

        .student-pagination button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        /* =========================================================
           SCROLLBAR
        ========================================================= */

        .student-table-wrapper::-webkit-scrollbar {
          height: 9px;
        }

        .student-table-wrapper::-webkit-scrollbar-track {
          background: #eef1f5;
          border-radius: 10px;
        }

        .student-table-wrapper::-webkit-scrollbar-thumb {
          background: #b8bfcc;
          border-radius: 10px;
        }

        .student-table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #8f98a8;
        }

        .student-table-wrapper {
          scrollbar-width: thin;
          scrollbar-color: #b8bfcc #eef1f5;
        }

        /* =========================================================
           MODAL
        ========================================================= */

        .student-delete-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, .65);
          backdrop-filter: blur(3px);
        }

        .student-delete-modal {
          width: 420px;
          max-width: 100%;
          background: #fff;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,.18);
          animation: studentModalShow .2s ease;
        }

        @keyframes studentModalShow {
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
          width: 65px;
          height: 65px;
          margin: 0 auto 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff0f0;
          color: #e5484d;
          font-size: 27px;
        }

        .student-delete-modal h4 {
          margin-bottom: 8px;
          color: #263238;
          font-weight: 700;
        }

        .student-delete-modal p {
          margin-bottom: 25px;
          color: #667085;
          font-size: 13px;
          line-height: 1.7;
        }

        .student-delete-modal p span {
          color: #98a2b3;
          font-size: 12px;
        }

        .delete-modal-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .delete-cancel-btn,
        .delete-confirm-btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 17px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .delete-cancel-btn {
          color: #475467;
          background: #f2f4f7;
        }

        .delete-confirm-btn {
          color: #fff;
          background: #e5484d;
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 768px) {
          .student-card-header {
            padding: 18px;
          }

          .student-toolbar {
            padding: 15px 18px;
            align-items: stretch;
            flex-direction: column;
          }

          .student-search-box {
            width: 100%;
          }

          .student-page-size {
            justify-content: flex-end;
          }

          .student-info-bar {
            margin: 0 18px;
            flex-direction: column;
            align-items: flex-start;
          }

          .student-table-wrapper {
            width: 0 !important;
            min-width: 100% !important;
            max-width: 100% !important;
            overflow-x: auto !important;
          }

          .student-table {
            width: auto !important;
            min-width: 100% !important;
            max-width: none !important;
          }

          .student-table-footer {
            padding: 15px 18px;
            flex-direction: column;
            align-items: center;
          }

          .student-card-subtitle {
            display: none;
          }

          .student-delete-modal {
            padding: 25px 20px;
          }
        }
      `}</style>

      <div className="student-page">
        <section className="section">
          <div className="card student-list-card">
            <div className="card-body p-0">
              <div className="student-card-header">
                <div>
                  <h5 className="student-card-title">Student Details List</h5>
                  <p className="student-card-subtitle">
                    Manage and view all registered students
                  </p>
                </div>

                <div className="student-total-badge">
                  <i className="bi bi-people me-1"></i>
                  {totalRecords} Students
                </div>
              </div>

              <div className="student-toolbar">
                <div className="student-page-size">
                  <span>Show</span>
                  <select value={pageSize} onChange={handlePageSize}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                </div>

                <div className="student-search-box">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search student..."
                  />
                  {search && (
                    <button
                      type="button"
                      className="student-search-clear"
                      onClick={clearSearch}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="student-info-bar">
                <span className="student-record-info-top">
                  <i className="bi bi-info-circle me-1"></i>
                  Showing <strong>{startRecord}</strong> to{" "}
                  <strong>{endRecord}</strong> of{" "}
                  <strong>{totalRecords}</strong> students
                </span>

                {search && (
                  <span className="student-search-info">
                    Search: "{search}"
                  </span>
                )}
              </div>

              <div className="mt-3 px-4">
                <div className="student-table-wrapper">
                  <table className="table student-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="sr-column">#</th>
                        <th>Student</th>
                        <th>Father's Name</th>
                        <th>Mobile No.</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Address</th>
                        <th className="action-column">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="student-loading">
                            <div className="student-loading-content">
                              <div className="spinner-border text-primary"></div>
                              <div className="text-muted">
                                Loading students...
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : data.length > 0 ? (
                        data.map((item, index) => (
                          <tr key={item.id || index}>
                            <td className="sr-column">
                              <span className="student-number">
                                {(pageNo - 1) * pageSize + index + 1}
                              </span>
                            </td>

                            <td>
                              <div className="student-info">
                                <div>
                                  {item.selfImageShow ? (
                                    <img
                               
                                       src={`${FILE_URL}${item.selfImage}`}
                                      alt="Student"
                                      className="student-image"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        if (e.currentTarget.nextSibling) {
                                          e.currentTarget.nextSibling.style.display = "flex";
                                        }
                                      }}
                                    />
                                  ) : null}

                                  <div
                                    className="student-image-placeholder"
                                    style={{
                                      display: item.selfImageShow ? "none" : "flex",
                                    }}
                                  >
                                    <i className="bi bi-person-fill"></i>
                                  </div>
                                </div>

                                <div className="student-name-wrapper">
                                  <div className="student-name">
                                    {item.name || "-"}
                                  </div>
                                  <small>Student ID: #{item.id}</small>
                                  {item.code && (
                                    <small>Enrollment No: {item.code}</small>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="table-text">
                                <i className="bi bi-person me-1"></i>
                                {item.fatherName || "-"}
                              </span>
                            </td>

                            <td>
                              <span className="mobile-number">
                                <i className="bi bi-telephone-fill"></i>
                                {item.mobileNo || "-"}
                              </span>
                            </td>

                            <td>
                              <span className="mobile-number">
                                <i className="bi bi-envelope-fill"></i>
                                {item.email || "-"}
                              </span>
                            </td>

                            <td>
                              <span className="username-badge">
                                <i className="bi bi-person-circle me-1"></i>
                                {item.userName || "-"}
                                {" / "}
                                {item.password || "-"}
                              </span>
                            </td>

                            <td>
                              <div className="address-text">
                                <i className="bi bi-geo-alt-fill"></i>
                                <span>
                                  {item.cityName || ""}
                                  {item.cityName && item.districtName ? ", " : ""}
                                  {item.districtName || ""}
                                  {(item.cityName || item.districtName) && item.stateName
                                    ? ", "
                                    : ""}
                                  {item.stateName || ""}
                                </span>
                              </div>
                            </td>

                            <td className="action-column">
                              <div className="student-actions">
                                <button
                                  type="button"
                                  className="student-action view"
                                  onClick={() => handleView(item.id)}
                                  title="View Student"
                                >
                                  <i className="bi bi-eye-fill"></i>
                                </button>

                                <button
                                  type="button"
                                  className="student-action view"
                                  onClick={() => handleAcademicdetails(item.id)}
                                  title="View Documents"
                                >
                                  <i className="bi bi-file-earmark-pdf-fill"></i>
                                </button>

                                {!item.code && (
                                  <>
                                    <button
                                      type="button"
                                      className="student-action edit"
                                      onClick={() => handleEdit(item.id)}
                                      title="Edit Student"
                                    >
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>

                                    <button
                                      type="button"
                                      className="student-action delete"
                                      onClick={() => {
                                        setDeleteId(item.id);
                                        setShowDeleteModal(true);
                                      }}
                                      title="Delete Student"
                                    >
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="student-empty-state">
                            <div>
                              <div className="student-empty-state-icon">
                                <i className="bi bi-people"></i>
                              </div>

                              <h5>No Students Found</h5>

                              <p>
                                {search
                                  ? "No students match your search."
                                  : "There are no students available."}
                              </p>

                              {search && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={clearSearch}
                                >
                                  Clear Search
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 0 && (
                <div className="student-table-footer">
                  <div className="student-record-info">
                    Page <strong>{pageNo}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </div>

                  <div className="student-pagination">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={pageNo === 1}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>

                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={pageNo === page ? "active" : ""}
                        onClick={() => setPageNo(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={pageNo === totalPages}
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

      {showDeleteModal && (
        <div
          className="student-delete-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="student-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon-wrapper">
              <i className="bi bi-trash3-fill"></i>
            </div>

            <h4>Delete Student?</h4>

            <p>
              Are you sure you want to delete this student?
              <br />
              <span>This action cannot be undone.</span>
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="bi bi-x-lg me-1"></i>
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >
                <i className="bi bi-trash3-fill me-1"></i>
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentList;