import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getEnquiries,
  deleteEnquiry
} from "../AllServicesFiles/EmployeeService";

function EnquiriesList() {
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteName, setDeleteName] = useState("");

  const type = searchParams.get("type");

  useEffect(() => {
    loadEnquiries();
  }, [type]);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const enquiryType = type === "student" ? 1 : 2;
      const result = await getEnquiries(enquiryType);

      setData(result.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setShowDeleteModal(false);
    setDeleteId(0);
    setDeleteName("");
  };

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;
      setDeleteLoading(true);

      const result = await deleteEnquiry(deleteId);

      alert(
        result?.message ||
        result ||
        "Enquiry deleted successfully"
      );

      closeDeleteModal();
      await loadEnquiries();
    } catch (error) {
      console.log(error);
      alert("Unable to delete enquiry.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // =========================================================
  // FILTER
  // =========================================================
  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    return (
      item.name?.toString().toLowerCase().includes(search) ||
      item.mobileNo?.toString().toLowerCase().includes(search) ||
      item.email?.toString().toLowerCase().includes(search) ||
      item.course?.toString().toLowerCase().includes(search) ||
      item.remarks?.toString().toLowerCase().includes(search)
    );
  });

  // =========================================================
  // PAGINATION
  // =========================================================
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const startRecord = totalRecords === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(endIndex, totalRecords);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const pageNumbers = getPageNumbers();

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageTitle =
    type === "student" ? "Student Enquiries" : "Other Enquiries";

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

        .enquiry-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .enq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 15px;
          flex-wrap: wrap;
        }

        .enq-header h1 {
          margin: 0 0 6px;
          font-size: 26px;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .enq-header h1 i {
          color: #4154f1;
        }

        .enq-breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 13px;
        }

        .enq-breadcrumb a {
          color: #4154f1;
          text-decoration: none;
        }

        .enq-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #4154f1, #6f7bf7);
          color: #fff;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 6px 18px rgba(65, 84, 241, 0.25);
        }

        .enq-badge i {
          font-size: 15px;
        }

        /* =====================================================
           CARD
        ===================================================== */

        .enq-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e7eaf0;
          box-shadow: 0 5px 25px rgba(30, 41, 59, .06);
          overflow: hidden;
          box-sizing: border-box;
        }

        .enq-card-header {
          padding: 22px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid #edf0f5;
          flex-wrap: wrap;
        }

        .enq-card-header h5 {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .enq-card-header h5 i {
          color: #4154f1;
        }

        .enq-card-header p {
          margin: 0;
          color: #94a3b8;
          font-size: 12px;
        }

        /* =====================================================
           TOOLBAR
        ===================================================== */

        .enq-toolbar {
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          background: #fbfcfe;
          border-bottom: 1px solid #edf0f5;
        }

        .enq-toolbar-left,
        .enq-toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .enq-page-size {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 13px;
          white-space: nowrap;
        }

        .enq-page-size select {
          height: 38px;
          padding: 0 10px;
          border: 1px solid #dfe4ec;
          border-radius: 8px;
          background: #fff;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .enq-search {
          position: relative;
          width: 300px;
          max-width: 100%;
        }

        .enq-search > i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 15px;
        }

        .enq-search input {
          width: 100%;
          height: 42px;
          padding: 0 42px 0 40px;
          border: 1px solid #dfe4ec;
          border-radius: 10px;
          background: #fff;
          color: #334155;
          font-size: 13px;
          outline: none;
          transition: all .2s ease;
        }

        .enq-search input:focus {
          border-color: #4154f1;
          box-shadow: 0 0 0 3px rgba(65, 84, 241, .08);
        }

        .enq-search input::placeholder {
          color: #94a3b8;
        }

        .enq-search button {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .enq-search button:hover {
          color: #dc3545;
        }

        /* =====================================================
           INFO BAR
        ===================================================== */

        .enq-info-bar {
          padding: 12px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #edf0f5;
          color: #64748b;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .enq-info-bar strong {
          color: #334155;
        }

        .enq-info-bar .enq-search-tag {
          color: #4154f1;
          font-weight: 600;
        }

        /* =====================================================
           TABLE RESPONSIVE
        ===================================================== */

        .enq-table-wrap {
          width: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #c9ced8 #eef1f5;
        }

        .enq-table-wrap::-webkit-scrollbar {
          height: 9px;
        }

        .enq-table-wrap::-webkit-scrollbar-track {
          background: #eef1f5;
          border-radius: 10px;
        }

        .enq-table-wrap::-webkit-scrollbar-thumb {
          background: #c9ced8;
          border-radius: 10px;
        }

        .enq-table-wrap::-webkit-scrollbar-thumb:hover {
          background: #aeb5c2;
        }

        /* =====================================================
           TABLE
        ===================================================== */

        .enq-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
        }

        .enq-table thead th {
          background: #f8f9fc !important;
          color: #687185;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .3px;
          white-space: nowrap;
          padding: 15px 16px;
          border-bottom: 1px solid #e9edf3;
          vertical-align: middle;
        }

        .enq-table tbody td {
          padding: 15px 16px;
          color: #414a5d;
          font-size: 13px;
          vertical-align: middle;
          border-bottom: 1px solid #f0f2f6;
          white-space: nowrap;
        }

        .enq-table tbody tr {
          transition: background .15s ease;
        }

        .enq-table tbody tr:hover {
          background: #fafbff;
        }

        .enq-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* =====================================================
           CELL STYLES
        ===================================================== */

        .enq-serial {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #eef1ff;
          color: #4154f1;
          font-size: 12px;
          font-weight: 700;
        }

        .enq-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .enq-avatar {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4154f1, #6f7bf7);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(65, 84, 241, .2);
        }

        .enq-name-text {
          display: flex;
          flex-direction: column;
        }

        .enq-name-text strong {
          color: #1e293b;
          font-size: 13px;
          font-weight: 600;
        }

        .enq-name-text small {
          color: #94a3b8;
          font-size: 11px;
          margin-top: 2px;
        }

        .enq-mobile {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #334155;
          font-weight: 500;
        }

        .enq-mobile i {
          color: #0ea5e9;
          font-size: 12px;
        }

        .enq-email {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #475569;
        }

        .enq-email i {
          color: #8b5cf6;
          font-size: 12px;
        }

        .enq-course-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 20px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .enq-remarks {
          color: #64748b;
          font-size: 12px;
          max-width: 260px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .enq-action-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: none;
          background: #fff1f2;
          color: #dc3545;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .18s ease;
          font-size: 13px;
        }

        .enq-action-btn:hover {
          background: #dc3545;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(220, 53, 69, .25);
        }

        /* =====================================================
           EMPTY / LOADING
        ===================================================== */

        .enq-empty,
        .enq-loading {
          text-align: center;
          padding: 60px 20px !important;
          color: #94a3b8;
        }

        .enq-empty-icon,
        .enq-loading-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .enq-empty h5 {
          color: #334155;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 6px;
        }

        .enq-empty p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0 0 14px;
        }

        /* =====================================================
           PAGINATION
        ===================================================== */

        .enq-pagination {
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          border-top: 1px solid #edf0f5;
        }

        .enq-records {
          color: #7a8395;
          font-size: 13px;
        }

        .enq-records strong {
          color: #414a5d;
        }

        .enq-page-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .enq-page-btn {
          min-width: 38px;
          height: 38px;
          padding: 0 12px;
          border: 1px solid #e2e6ee;
          background: #fff;
          color: #515a6c;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all .15s ease;
        }

        .enq-page-btn:hover:not(:disabled) {
          background: #4154f1;
          border-color: #4154f1;
          color: #fff;
        }

        .enq-page-btn:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .enq-page-number {
          width: 38px;
          height: 38px;
          border: 1px solid #dfe3eb;
          background: #fff;
          color: #344054;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
        }

        .enq-page-number:hover:not(:disabled) {
          background: #f5f7ff;
          border-color: #c7c9ff;
          color: #4154f1;
        }

        .enq-page-number.active {
          background: #4154f1;
          color: #fff;
          border-color: #4154f1;
          box-shadow: 0 5px 12px rgba(65, 84, 241, 0.25);
        }

        .enq-page-of {
          color: #64748b;
          font-size: 13px;
          margin-left: 6px;
          white-space: nowrap;
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .enq-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, .65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: enqFadeIn .2s ease;
        }

        .enq-modal {
          width: 100%;
          max-width: 430px;
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(0,0,0,.25);
          animation: enqSlideIn .25s ease;
        }

        .enq-modal-icon-wrap {
          display: flex;
          justify-content: center;
          padding: 30px 0 15px;
        }

        .enq-modal-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #fff1f2;
          color: #dc3545;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .enq-modal-content {
          padding: 0 25px 20px;
          text-align: center;
        }

        .enq-modal-content h4 {
          color: #1e293b;
          font-weight: 700;
          margin: 0 0 8px;
          font-size: 18px;
        }

        .enq-modal-content p {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 6px;
          line-height: 1.6;
        }

        .enq-modal-name {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          font-size: 14px;
          margin: 6px 0 14px;
        }

        .enq-modal-warning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #fffbeb;
          color: #92400e;
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
        }

        .enq-modal-footer {
          padding: 18px 25px 25px;
          display: flex;
          justify-content: center;
          gap: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .enq-modal-footer button {
          min-width: 120px;
          height: 42px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: none;
          cursor: pointer;
          transition: all .18s ease;
        }

        .enq-cancel-btn {
          background: #f1f5f9;
          color: #475569;
        }

        .enq-cancel-btn:hover:not(:disabled) {
          background: #e2e8f0;
        }

        .enq-confirm-btn {
          background: #dc3545;
          color: #fff;
        }

        .enq-confirm-btn:hover:not(:disabled) {
          background: #bb2d3b;
        }

        .enq-modal-footer button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @keyframes enqFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes enqSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 768px) {
          .enq-header h1 {
            font-size: 22px;
          }

          .enq-card-header,
          .enq-toolbar,
          .enq-info-bar,
          .enq-pagination {
            padding: 15px 18px;
          }

          .enq-search {
            width: 100%;
          }

          .enq-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .enq-toolbar-left,
          .enq-toolbar-right {
            width: 100%;
          }

          .enq-page-size {
            justify-content: flex-end;
            width: 100%;
          }

          .enq-pagination {
            flex-direction: column;
            align-items: flex-start;
          }

          .enq-page-buttons {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="enquiry-page">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="enq-header">
          <div>
            <h1>
              <i className="bi bi-chat-square-text-fill"></i>
              {pageTitle}
            </h1>
            <nav>
              <ol className="breadcrumb enq-breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/dashboard">
                    <i className="bi bi-house-door me-1"></i>
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item active">
                  Enquiries
                </li>
              </ol>
            </nav>
          </div>

          <div className="enq-badge">
            <i className="bi bi-inbox-fill"></i>
            Total: {totalRecords}
          </div>
        </div>

        {/* =====================================================
            MAIN CARD
        ====================================================== */}
        <div className="enq-card">

          {/* Card Header */}
          <div className="enq-card-header">
            <div>
              <h5>
                <i className="bi bi-list-ul"></i>
                Enquiry List
              </h5>
              <p>
                {type === "student"
                  ? "All student enquiries received"
                  : "All general enquiries received"}
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="enq-toolbar">

            <div className="enq-toolbar-left">
              <div className="enq-page-size">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            <div className="enq-toolbar-right">
              <div className="enq-search">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search name, mobile, email, course..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    title="Clear"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Info Bar */}
          <div className="enq-info-bar">
            <span>
              <i className="bi bi-info-circle me-1"></i>
              Showing <strong>{startRecord}</strong> to{" "}
              <strong>{endRecord}</strong> of{" "}
              <strong>{totalRecords}</strong>{" "}
              {totalRecords === 1 ? "enquiry" : "enquiries"}
            </span>

            {searchTerm && (
              <span className="enq-search-tag">
                <i className="bi bi-search me-1"></i>
                Search: "{searchTerm}"
              </span>
            )}
          </div>

          {/* Table */}
          <div className="enq-table-wrap">
            <table className="enq-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile No</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Remarks</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="enq-loading">
                      <div className="enq-loading-icon">
                        <div className="spinner-border text-primary"></div>
                      </div>
                      <div>Loading enquiries...</div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <span className="enq-serial">
                          {startIndex + index + 1}
                        </span>
                      </td>

                      <td>
                        <div className="enq-name">
                          <div className="enq-avatar">
                            {item.name
                              ? item.name.charAt(0).toUpperCase()
                              : "E"}
                          </div>
                          <div className="enq-name-text">
                            <strong>{item.name || "-"}</strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="enq-mobile">
                          <i className="bi bi-telephone-fill"></i>
                          {item.mobileNo || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="enq-email">
                          <i className="bi bi-envelope-fill"></i>
                          {item.email || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="enq-course-badge">
                          <i className="bi bi-book"></i>
                          {item.course || "-"}
                        </span>
                      </td>

                      <td>
                        <span
                          className="enq-remarks"
                          title={item.remarks || "-"}
                        >
                          {item.remarks || "-"}
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="enq-action-btn"
                          title="Delete"
                          onClick={() =>
                            handleDelete(item.id, item.name)
                          }
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="enq-empty">
                      <div className="enq-empty-icon">
                        <i className="bi bi-inbox"></i>
                      </div>
                      <h5>No Enquiries Found</h5>
                      <p>
                        {searchTerm
                          ? "No enquiry matches your search."
                          : "No enquiries have been received yet."}
                      </p>

                      {searchTerm && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={clearSearch}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Clear Search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="enq-pagination">
              <div className="enq-records">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </div>

              <div className="enq-page-buttons">
                <button
                  type="button"
                  className="enq-page-btn"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  title="Previous"
                >
                  <i className="bi bi-chevron-left"></i>
                  Prev
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`enq-page-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <span className="enq-page-of">
                  of {totalPages}
                </span>

                <button
                  type="button"
                  className="enq-page-btn"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  title="Next"
                >
                  Next
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}
      {showDeleteModal && (
        <div
          className="enq-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="enq-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="enq-modal-icon-wrap">
              <div className="enq-modal-icon">
                <i className="bi bi-trash3-fill"></i>
              </div>
            </div>

            <div className="enq-modal-content">
              <h4>Delete Enquiry?</h4>

              <p>Are you sure you want to delete this enquiry?</p>

              {deleteName && (
                <div className="enq-modal-name">
                  "{deleteName}"
                </div>
              )}

              <div className="enq-modal-warning">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>This action cannot be undone.</span>
              </div>
            </div>

            <div className="enq-modal-footer">
              <button
                type="button"
                className="enq-cancel-btn"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>

              <button
                type="button"
                className="enq-confirm-btn"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash3"></i>
                    Confirm Delete
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

export default EnquiriesList;