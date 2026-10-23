 import React, { useEffect, useMemo, useState } from "react";
import {
  createAssignFrenchise,
  getAssignFrenchises,
  getEmployeesAssign,
  getFrenchiseAssignDelete,
  getFrenchisesAssign
} from "../../AllServicesFiles/EmployeeService";

function EmployeeFrenchiseAssing() {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [frenchises, setFrenchises] = useState([]);

  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [totalRecords, setTotalRecords] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteEmployeeName, setDeleteEmployeeName] = useState("");

  // ✅ Franchise search state
  const [frenchiseSearch, setFrenchiseSearch] = useState("");

  // ✅ TOAST STATE
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    id: 0,
    frenchiseIds: [],
    employeeId: "",
    isActive: 1
  });

  useEffect(() => {
    loadAssignFrenchises();
    loadEmployees();
    loadFrenchises();
  }, [pageNo, pageSize, search]);

  // ✅ TOAST FUNCTION
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000); // 3 seconds baad gayab ho jayega
  };

  const loadAssignFrenchises = async () => {
    try {
      const result = await getAssignFrenchises(pageNo, pageSize, search);
      setData(result?.data?.data || []);
      setTotalRecords(Number(result?.data?.totalRecords || 0));
    } catch (error) {
      console.log(error);
      setData([]);
      setTotalRecords(0);
    }
  };

  const loadEmployees = async () => {
    try {
      const result = await getEmployeesAssign(34);
      setEmployees(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadFrenchises = async () => {
    try {
      const result = await getFrenchisesAssign(9);
      setFrenchises(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredFrenchises = useMemo(() => {
    const q = frenchiseSearch.trim().toLowerCase();
    if (!q) return frenchises;
    return frenchises.filter((item) =>
      (item?.name || "").toLowerCase().includes(q)
    );
  }, [frenchises, frenchiseSearch]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNo(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPageNo(1);
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
        totalPages
      ];
    }
    return [pageNo - 2, pageNo - 1, pageNo, pageNo + 1, pageNo + 2];
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (pageNo > 1) setPageNo(pageNo - 1);
  };

  const handleNext = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };

  const handlePageChange = (page) => setPageNo(page);

  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteEmployeeName(name);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(0);
    setDeleteEmployeeName("");
  };

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;
      const result = await getFrenchiseAssignDelete(deleteId);
      
      // ✅ ALERT KI JAGAH TOAST
      showToast(result?.message || "Employee assignment deleted successfully", "success");
      
      closeDeleteModal();
      await loadAssignFrenchises();
      await loadEmployees();
      await loadFrenchises();
    } catch (error) {
      showToast(error?.message || "Failed to delete assignment", "error");
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createAssignFrenchise(formData);
      
      // ✅ ALERT KI JAGAH TOAST
      showToast(result?.message || "Employee assigned successfully", "success");
      
      await loadAssignFrenchises();
      await loadEmployees();
      await loadFrenchises();
      setFormData({
        id: 0,
        frenchiseIds: [],
        employeeId: "",
        isActive: 1
      });
      setFrenchiseSearch("");
    } catch (error) {
      showToast(error?.message || "Something went wrong", "error");
      console.log(error);
    }
  };

  return (
    <>
      {/* ✅ CUSTOM CSS FOR TOAST & TABLE DESIGN */}
      <style>{`
        /* Toast Container */
        .custom-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          padding: 16px 24px;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          transform: translateX(120%);
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .custom-toast.show {
          transform: translateX(0);
        }
        .custom-toast.success { background-color: #198754; } /* Bootstrap Success Green */
        .custom-toast.error { background-color: #dc3545; } /* Bootstrap Danger Red */
        
        .custom-toast i { font-size: 20px; }

        /* Table Design */
        .modern-table-container {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #e9ecef;
        }
        .modern-table {
          margin-bottom: 0;
        }
        .modern-table thead {
          background-color: #f8f9fa;
        }
        .modern-table thead th {
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
          padding: 15px;
          border-bottom: 2px solid #dee2e6;
        }
        .modern-table tbody td {
          padding: 15px;
          vertical-align: middle;
          color: #333;
          border-bottom: 1px solid #f1f3f5;
        }
        .modern-table tbody tr:hover {
          background-color: #f8f9fa;
          transition: background-color 0.2s ease;
        }
        .delete-btn {
          border: none;
          background: #ffebee;
          color: #dc3545;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .delete-btn:hover {
          background: #dc3545;
          color: #fff;
        }
      `}</style>

      {/* ✅ TOAST UI */}
      <div className={`custom-toast ${toast.show ? "show" : ""} ${toast.type}`}>
        <i className={`bi ${toast.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`}></i>
        {toast.message}
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Employee Assign</h5>

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">Employee</label>
                    <div className="col-sm-9">
                      <select
                        className="form-select"
                        required
                        value={formData.employeeId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeId: Number(e.target.value)
                          })
                        }
                      >
                        <option value={0}>Select Employee</option>
                        {employees.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      Frenchise
                      {formData.frenchiseIds?.length > 0 && (
                        <span className="badge bg-primary ms-2">
                          {formData.frenchiseIds.length} selected
                        </span>
                      )}
                    </label>

                    <div className="col-sm-9">
                      <div className="border rounded p-3">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="bi bi-search"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search franchise..."
                            value={frenchiseSearch}
                            onChange={(e) => setFrenchiseSearch(e.target.value)}
                          />
                          {frenchiseSearch && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setFrenchiseSearch("")}
                              title="Clear"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          )}
                        </div>

                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          {filteredFrenchises.length > 0 ? (
                            filteredFrenchises.map((item) => (
                              <div className="form-check mb-2" key={item.id}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`franchise-${item.id}`}
                                  checked={
                                    formData.frenchiseIds?.includes(item.id) ||
                                    false
                                  }
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setFormData({
                                      ...formData,
                                      frenchiseIds: checked
                                        ? [
                                            ...(formData.frenchiseIds || []),
                                            item.id
                                          ]
                                        : (formData.frenchiseIds || []).filter(
                                            (id) => id !== item.id
                                          )
                                    });
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`franchise-${item.id}`}
                                >
                                  {item.name}
                                </label>
                              </div>
                            ))
                          ) : (
                            <span className="text-muted">
                              {frenchiseSearch
                                ? "No Franchise matches your search"
                                : "No Franchise Found"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">IsActive</label>
                    <div className="col-sm-9">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          style={{ height: "25px", width: "50px" }}
                          checked={Number(formData.isActive) === 1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked ? 1 : 0
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary px-4">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Employee Assign List</h5>

                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <span className="me-2 text-muted">Show</span>
                    <select
                      className="form-select"
                      style={{ width: "80px" }}
                      value={pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <option value={100}>100</option>
                      <option value={250}>250</option>
                      <option value={500}>500</option>
                      <option value={1000}>1000</option>
                    </select>
                    <span className="ms-2 text-muted">entries</span>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearch}
                    style={{ width: "250px" }}
                  />
                </div>

                <div className="text-muted mb-3">
                  {totalRecords > 0
                    ? `Showing ${(pageNo - 1) * pageSize + 1} to ${Math.min(
                        pageNo * pageSize,
                        totalRecords
                      )} of ${totalRecords}`
                    : "Showing 0 to 0 of 0"}
                </div>

                {/* ✅ NAYA TABLE DESIGN WRAPPER */}
                <div className="table-responsive modern-table-container">
                  <table className="table modern-table">
                    <thead>
                      <tr>
                        <th width="10%">#</th>
                        <th width="35%">Franchise Code</th>
                        <th width="35%">Franchise Name</th>
                        <th width="35%">Employee Name</th>
                        <th width="20%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((item, index) => (
                          <tr key={item.id}>
                            <td>{(pageNo - 1) * pageSize + index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                
                                {item.code}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                
                                {item.name}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border px-3 py-2" style={{fontSize: '13px'}}>
                                {item.employeeName}
                              </span>
                            </td>
                            <td>
                              <button
                                className="delete-btn"
                                title="Delete"
                                onClick={() => handleDelete(item.id, item.name)}
                              >
                                <i className="bi bi-trash3-fill me-1"></i>  
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center text-muted py-5"
                          >
                            <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                            No Employee Assignment Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm px-3"
                      onClick={handlePrevious}
                      disabled={pageNo === 1}
                    >
                      <i className="bi bi-chevron-left me-1"></i>
                      Prev
                    </button>

                    <div className="d-flex gap-2">
                      {pageNumbers.map((page) => (
                        <button
                          type="button"
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={
                            pageNo === page
                              ? "btn btn-primary btn-sm px-3"
                              : "btn btn-outline-primary btn-sm px-3"
                          }
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm px-3"
                      onClick={handleNext}
                      disabled={pageNo === totalPages}
                    >
                      Next
                      <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL FOR DELETE */}
      {showDeleteModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Delete Assignment
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeDeleteModal}
                  ></button>
                </div>

                <div className="modal-body text-center p-4">
                  <div className="mb-3">
                    <i
                      className="bi bi-trash3-fill text-danger"
                      style={{ fontSize: "45px" }}
                    ></i>
                  </div>
                  <h5>Are you sure?</h5>
                  <p className="text-muted mb-2">
                    Do you really want to delete this employee assignment?
                  </p>
                  {deleteEmployeeName && (
                    <strong className="d-block fs-5 text-dark">{deleteEmployeeName}</strong>
                  )}
                  <p className="text-muted mt-2 mb-0">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="modal-footer justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={closeDeleteModal}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={confirmDelete}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}

export default EmployeeFrenchiseAssing;