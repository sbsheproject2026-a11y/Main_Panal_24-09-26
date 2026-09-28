 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, getEmployeeDelete } from "../../AllServicesFiles/EmployeeService";

function EmployeeList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteName, setDeleteName] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, [pageNo, pageSize, search]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const result = await getEmployees(pageNo, pageSize, search);
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

  const startRecord =
    totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;

  const endRecord = Math.min(pageNo * pageSize, totalRecords);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNo(1);
  };

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPageNo(1);
  };

  const handleEdit = (id) => {
    navigate(`/employee-update/${id}`);
  };

  const handleCreate = () => {
    navigate("/employee-create");
  };

  const handlePrevious = () => {
    if (pageNo > 1) setPageNo(pageNo - 1);
  };

  const handleNext = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  const openDeleteModal = (id, name) => {
    setDeleteId(id);
    setDeleteName(name || "");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!deleteLoading) {
      setShowDeleteModal(false);
      setDeleteId(0);
      setDeleteName("");
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      const result = await getEmployeeDelete(deleteId);

      alert(result?.message || "Employee deleted successfully.");

      setShowDeleteModal(false);
      setDeleteId(0);
      setDeleteName("");

      if (data.length === 1 && pageNo > 1) {
        setPageNo((prev) => prev - 1);
      } else {
        await loadEmployees();
      }
    } catch (error) {
      console.log(error);
      alert("Unable to delete employee.");
    } finally {
      setDeleteLoading(false);
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

        .employee-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .employee-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          border-radius: 14px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .page-header h2 {
          color: #1f2937;
          letter-spacing: -0.5px;
        }

        .card-top {
          border-bottom: 1px solid #eef0f3;
        }

        .search-box {
          width: 280px;
          max-width: 100%;
        }

        .search-box > i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          z-index: 2;
        }

        .search-box input {
          padding-left: 42px;
          padding-right: 40px;
          border-radius: 50px;
        }

        .search-clear {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #94a3b8;
          z-index: 3;
        }

        .page-size {
          width: 75px;
          border-radius: 7px;
        }

        /* =========================================================
           TABLE RESPONSIVE — only this area scrolls
        ========================================================= */

        .table-responsive {
          display: block !important;
          width: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          box-sizing: border-box !important;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #c9ced8 #eef1f5;
        }

        .table-responsive::-webkit-scrollbar {
          height: 9px;
        }

        .table-responsive::-webkit-scrollbar-track {
          background: #eef1f5;
          border-radius: 10px;
        }

        .table-responsive::-webkit-scrollbar-thumb {
          background: #c9ced8;
          border-radius: 10px;
        }

        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: #aeb5c2;
        }

        /* =========================================================
           TABLE — AUTO WIDTH + AUTO HEIGHT
        ========================================================= */

        .table.employee-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
        }

        .employee-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .5px;
          border-bottom: 1px solid #e5e7eb;
          padding: 15px 14px;
          white-space: nowrap;
          vertical-align: middle;
        }

        .employee-table tbody td {
          padding: 15px 14px;
          border-color: #f0f2f5;
          color: #374151;
          font-size: 14px;
          white-space: nowrap;
          vertical-align: middle;
        }

        .employee-table tbody tr {
          transition: all .2s ease;
        }

        .employee-table tbody tr:hover {
          background: #f8fbff;
        }

        .employee-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* =========================================================
           CELL CONTENT
        ========================================================= */

        .serial-number {
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .avatar {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d6efd, #6610f2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 17px;
          box-shadow: 0 4px 10px rgba(13,110,253,.20);
        }

        .contact-box {
          display: flex;
          align-items: center;
        }

        .contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          font-size: 12px;
        }

        .location-box {
          display: flex;
          align-items: flex-start;
        }

        .login-info {
          font-size: 13px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 0;
          transition: all .2s ease;
          background: #f8fafc;
        }

        .edit-btn {
          color: #0d6efd;
        }

        .edit-btn:hover {
          background: #e7f1ff;
          color: #0d6efd;
          transform: translateY(-2px);
        }

        .delete-btn {
          color: #dc3545;
        }

        .delete-btn:hover {
          background: #fff0f1;
          color: #dc3545;
          transform: translateY(-2px);
        }

        .empty-icon {
          width: 65px;
          height: 65px;
          margin: auto;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        /* =========================================================
           PAGINATION
        ========================================================= */

        .pagination-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .page-btn {
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
          transition: .15s ease;
        }

        .page-btn:hover:not(:disabled) {
          background: #4154f1;
          border-color: #4154f1;
          color: #fff;
        }

        .page-btn:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .page-number-btn {
          width: 38px;
          height: 38px;
          border: 1px solid #dfe3eb;
          background: #fff;
          color: #344054;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: .2s ease;
        }

        .page-number-btn:hover:not(:disabled) {
          background: #f5f7ff;
        }

        .page-number-btn.active {
          background: #4353ee;
          color: #fff;
          border-color: #4353ee;
          box-shadow: 0 5px 12px rgba(67, 83, 238, 0.25);
        }

        .page-number-btn:disabled {
          cursor: default;
        }

        .page-of {
          color: #64748b;
          font-size: 13px;
          margin-left: 6px;
          white-space: nowrap;
        }

        /* =========================================================
           DELETE MODAL
        ========================================================= */

        .custom-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, .65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn .2s ease;
        }

        .delete-modal {
          width: 100%;
          max-width: 430px;
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(0,0,0,.25);
          animation: modalSlide .25s ease;
        }

        .delete-icon-wrapper {
          display: flex;
          justify-content: center;
          padding-top: 30px;
          padding-bottom: 15px;
        }

        .delete-icon {
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

        .delete-modal-footer {
          padding: 18px 25px 25px;
          display: flex;
          justify-content: center;
          gap: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .delete-modal-footer button {
          min-width: 110px;
          border-radius: 8px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .page-header h2 {
            font-size: 22px;
          }

          .search-box {
            width: 100%;
          }

          .card-top {
            padding: 20px !important;
          }

          .card-footer {
            padding: 20px !important;
          }
        }
      `}</style>

      <div className="employee-page">

        <div className="page-header mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">
                <i className="bi bi-people-fill text-primary me-2"></i>
                Employee Detail
              </h2>
              <div className="text-muted">
                Manage and view all employee records
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary mt-3 mt-md-0 px-4"
              onClick={handleCreate}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Employee
            </button>
          </div>

          <nav className="mt-3">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-decoration-none">
                  <i className="bi bi-house-door me-1"></i>
                  Dashboard
                </a>
              </li>
              <li className="breadcrumb-item active">Employee Detail</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card employee-card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="card-top p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <h5 className="fw-bold mb-1">
                      <i className="bi bi-list-ul text-primary me-2"></i>
                      Employee List
                    </h5>
                    <small className="text-muted">
                      Total {totalRecords} employee
                      {totalRecords !== 1 ? "s" : ""}
                    </small>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="search-box position-relative">
                      <i className="bi bi-search"></i>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search code or name..."
                        value={search}
                        onChange={handleSearch}
                      />
                      {search && (
                        <button
                          type="button"
                          className="search-clear"
                          onClick={() => {
                            setSearch("");
                            setPageNo(1);
                          }}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted small">Rows:</span>
                      <select
                        className="form-select form-select-sm page-size"
                        value={pageSize}
                        onChange={handlePageSize}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 employee-table">
                  <thead>
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Code</th>
                      <th>Employee</th>
                      <th>Father Name</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Login Details</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          ></div>
                          <div className="text-muted mt-2">
                            Loading employees...
                          </div>
                        </td>
                      </tr>
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="empty-icon">
                            <i className="bi bi-person-x"></i>
                          </div>
                          <h5 className="fw-semibold mt-3">
                            No Employees Found
                          </h5>
                          <p className="text-muted mb-0">
                            No records match your search.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      data.map((item, index) => (
                        <tr key={item.id}>
                          <td className="ps-4">
                            <span className="serial-number">
                              {(pageNo - 1) * pageSize + index + 1}
                            </span>
                          </td>

                          <td>
                            <span className="badge bg-primary-subtle text-primary px-3 py-2">
                              {item.code || "-"}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar me-3">
                                {item.name
                                  ? item.name.charAt(0).toUpperCase()
                                  : "E"}
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">
                                  {item.name || "-"}
                                </div>
                                <small className="text-muted">
                                  {item.designationName ||
                                    item.designation ||
                                    "Employee"}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="fw-medium">
                              {item.fatherName || "-"}
                            </span>
                          </td>

                          <td>
                            <div className="contact-box">
                              <div className="contact-icon">
                                <i className="bi bi-telephone-fill"></i>
                              </div>
                              <div>
                                <div className="fw-medium">
                                  {item.mobileNo || "-"}
                                </div>
                                {item.whatsAppNo && (
                                  <small className="text-muted">
                                    WhatsApp: {item.whatsAppNo}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="location-box">
                              <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                              <div>
                                <div className="fw-medium">
                                  {item.address || "-"}
                                </div>
                                <small className="text-muted">
                                  {item.cityName || ""}
                                  {item.cityName && item.districtName
                                    ? ", "
                                    : ""}
                                  {item.districtName || ""}
                                  {(item.cityName || item.districtName) &&
                                  item.stateName
                                    ? ", "
                                    : ""}
                                  {item.stateName || ""}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="login-info">
                              <div>
                                <i className="bi bi-person-circle text-primary me-2"></i>
                                <span className="fw-medium">
                                  {item.userName || "-"}
                                </span>
                              </div>
                              <div className="mt-1">
                                <i className="bi bi-key-fill text-warning me-2"></i>
                                <span className="text-muted">
                                  {item.password || "••••••••"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                type="button"
                                className="btn btn-sm action-btn edit-btn"
                                title="Edit"
                                onClick={() => handleEdit(item.id)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm action-btn delete-btn"
                                title="Delete"
                                onClick={() =>
                                  openDeleteModal(item.id, item.name)
                                }
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="card-footer bg-white border-0 p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div className="text-muted small">
                    Showing <strong className="text-dark">{startRecord}</strong>{" "}
                    to <strong className="text-dark">{endRecord}</strong> of{" "}
                    <strong className="text-dark">{totalRecords}</strong> records
                  </div>

                  {totalPages > 0 && (
                    <div className="pagination-wrap">
                      <button
                        type="button"
                        className="page-btn"
                        disabled={pageNo === 1 || loading}
                        onClick={handlePrevious}
                        title="Previous"
                      >
                        <i className="bi bi-chevron-left"></i>
                        Previous
                      </button>

                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`page-number-btn ${
                            pageNo === page ? "active" : ""
                          }`}
                          disabled={loading}
                          onClick={() => setPageNo(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <span className="page-of">
                        of {totalPages}
                      </span>

                      <button
                        type="button"
                        className="page-btn"
                        disabled={
                          pageNo >= totalPages || loading || totalPages === 0
                        }
                        onClick={handleNext}
                        title="Next"
                      >
                        Next
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {showDeleteModal && (
        <div
          className="custom-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon-wrapper">
              <div className="delete-icon">
                <i className="bi bi-trash3-fill"></i>
              </div>
            </div>

            <div className="text-center px-4 pb-3">
              <h4 className="fw-bold mb-2">Delete Employee?</h4>
              <p className="text-muted mb-1">
                Are you sure you want to delete
              </p>
              <div className="fw-semibold text-dark mb-3">
                "{deleteName || "this employee"}"
              </div>
              <div className="alert alert-warning border-0 small mb-0">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                This action cannot be undone.
              </div>
            </div>

            <div className="delete-modal-footer">
              <button
                type="button"
                className="btn btn-light px-4"
                disabled={deleteLoading}
                onClick={closeDeleteModal}
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
                disabled={deleteLoading}
                onClick={confirmDelete}
              >
                {deleteLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash3 me-2"></i>
                    Delete
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

export default EmployeeList;