 
import React, { useEffect, useState } from "react";
import {
  createAssignFrenchise,
  getAssignFrenchises,
  getEmployeesAssign,
  getFrenchiseAssignDelete,
  getFrenchisesAssign
} from "./EmployeeService";

function EmployeeFrenchiseAssing() {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [frenchises, setFrenchises] = useState([]);

  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteEmployeeName, setDeleteEmployeeName] = useState("");

  const [formData, setFormData] = useState({
    id: 0,
    frenchiseIds: [],
    employeeId: "",
    isActive: 1
  });

  useEffect(() => {
    loadAssignFrenchises();
  }, [pageNo, pageSize, search]);

  useEffect(() => {
    loadEmployees();
    loadFrenchises();
  }, []);

  const loadAssignFrenchises = async () => {
    try {
      const result = await getAssignFrenchises(
        pageNo,
        pageSize,
        search
      );

      setData(result?.data?.data || []);
      setTotalRecords(
        Number(result?.data?.totalRecords || 0)
      );
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

  const totalPages = Math.ceil(
    totalRecords / pageSize
  );

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
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
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

  const pageNumbers = getPageNumbers();

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

  const handlePageChange = (page) => {
    setPageNo(page);
  };

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

      const result = await getFrenchiseAssignDelete(
        deleteId
      );

      alert(
        result?.message ||
        result ||
        "Employee assignment deleted successfully"
      );

      closeDeleteModal();

      await loadAssignFrenchises();
      await loadEmployees();
      await loadFrenchises();
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createAssignFrenchise(formData);

      alert(
        result?.message ||
        result ||
        "Employee assigned successfully"
      );

      await loadAssignFrenchises();
      await loadEmployees();
      await loadFrenchises();

      setFormData({
        id: 0,
        frenchiseIds: [],
        employeeId: "",
        isActive: 1
      });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Employee Assign
                </h5>

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      Employee
                    </label>

                    <div className="col-sm-9">
                      <select
                        className="form-select"
                        required
                        value={formData.employeeId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeId: Number(
                              e.target.value
                            )
                          })
                        }
                      >
                        <option value={0}>
                          Select Employee
                        </option>

                        {employees.map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      Frenchise
                    </label>

                    <div className="col-sm-9">
                      <div className="border rounded p-3">
                        {frenchises.length > 0 ? (
                          frenchises.map((item) => (
                            <div
                              className="form-check mb-2"
                              key={item.id}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`franchise-${item.id}`}
                                checked={
                                  formData.frenchiseIds?.includes(
                                    item.id
                                  ) || false
                                }
                                onChange={(e) => {
                                  const checked =
                                    e.target.checked;

                                  setFormData({
                                    ...formData,
                                    frenchiseIds: checked
                                      ? [
                                          ...(formData.frenchiseIds ||
                                            []),
                                          item.id
                                        ]
                                      : (
                                          formData.frenchiseIds ||
                                          []
                                        ).filter(
                                          (id) =>
                                            id !== item.id
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
                            No Franchise Found
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label">
                      IsActive
                    </label>

                    <div className="col-sm-9">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          style={{
                            height: "25px",
                            width: "50px"
                          }}
                          checked={
                            Number(formData.isActive) === 1
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked
                                ? 1
                                : 0
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Employee Assign List
                </h5>

                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      Show
                    </span>

                    <select
                      className="form-select"
                      style={{ width: "80px" }}
                      value={pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>

                    <span className="ms-2">
                      entries
                    </span>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearch}
                    style={{ width: "220px" }}
                  />
                </div>

                <div className="text-muted mb-2">
                  {totalRecords > 0
                    ? `Showing ${
                        (pageNo - 1) * pageSize + 1
                      } to ${Math.min(
                        pageNo * pageSize,
                        totalRecords
                      )} of ${totalRecords}`
                    : "Showing 0 to 0 of 0"}
                </div>

                <div className="table-responsive">
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Employee Name</th>
                        <th>Frenchise Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.length > 0 ? (
                        data.map((item, index) => (
                          <tr key={item.id}>
                            <th>
                              {(pageNo - 1) *
                                pageSize +
                                index +
                                1}
                            </th>

                            <td>{item.code}</td>

                            <td>{item.name}</td>

                            <td>{item.fatherName}</td>

                            <td>
                              <i
                                className="bi bi-trash-fill text-danger"
                                style={{
                                  cursor: "pointer",
                                  fontSize: "18px"
                                }}
                                title="Delete"
                                onClick={() =>
                                  handleDelete(
                                    item.id,
                                    item.name
                                  )
                                }
                              ></i>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-muted py-4"
                          >
                            No Employee Assignment Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handlePrevious}
                      disabled={pageNo === 1}
                    >
                      <i className="bi bi-chevron-left me-1"></i>
                      Prev
                    </button>

                    <div className="d-flex gap-1">
                      {pageNumbers.map((page) => (
                        <button
                          type="button"
                          key={page}
                          onClick={() =>
                            handlePageChange(page)
                          }
                          className={
                            pageNo === page
                              ? "btn btn-primary"
                              : "btn btn-outline-primary"
                          }
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleNext}
                      disabled={
                        pageNo === totalPages
                      }
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

      {showDeleteModal && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.6)"
            }}
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
                      style={{
                        fontSize: "45px"
                      }}
                    ></i>
                  </div>

                  <h5>Are you sure?</h5>

                  <p className="text-muted mb-2">
                    Do you really want to delete this
                    employee assignment?
                  </p>

                  {deleteEmployeeName && (
                    <strong className="d-block">
                      {deleteEmployeeName}
                    </strong>
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
 
