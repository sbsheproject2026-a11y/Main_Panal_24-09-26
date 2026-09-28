 
import React, { useEffect, useState } from "react";
import {
  createMasterSession,
  getMasterSession,
  getMasterSessionById,
  getMasterSessionDelete,
  getStudentMasterSessions,
  updateMasterSession
} from "../../AllServicesFiles/MasterSessionService";

function MasterSession() {
  const [data, setData] = useState([]);
  const [masterTypes, setMasterTypes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSessionName, setDeleteSessionName] = useState("");

  const [formData, setFormData] = useState({
    id: 0,
    shortName: "",
    name: "",
    startDate: "",
    endDate: "",
    issueDate: "",
    isActive: 0,
    masterSessionId: 0
  });

  useEffect(() => {
    loadDuration();
    loadMasterSessions();
  }, []);

  const loadDuration = async () => {
    try {
      const result = await getStudentMasterSessions(15);
      setMasterTypes(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMasterSessions = async () => {
    try {
      const result = await getMasterSession();
      setData(result.data);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      shortName: "",
      name: "",
      startDate: "",
      endDate: "",
      issueDate: "",
      isActive: 0,
      masterSessionId: 0
    });
  };

  const handleEdit = async (id) => {
    try {
      const result = await getMasterSessionById(id);

      setFormData({
        id: result.id,
        shortName: result.shortName,
        name: result.name,
        startDate: result.startDate1,
        endDate: result.endDate1,
        issueDate: result.issueDate1,
        isActive: result.isActive,
        masterSessionId: result.masterSessionId
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteSessionName(name);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteId(null);
    setDeleteSessionName("");
  };

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;

      const result = await getMasterSessionDelete(deleteId);

      alert(
        result?.message ||
          result ||
          "Master Session deleted successfully"
      );

      closeDeleteModal();
      await loadMasterSessions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      if (formData.id > 0) {
        result = await updateMasterSession(formData);
      } else {
        result = await createMasterSession(formData);
      }

      alert(result.message);

      await loadMasterSessions();
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      item.shortName
        ?.toString()
        .toLowerCase()
        .includes(search) ||
      item.name
        ?.toString()
        .toLowerCase()
        .includes(search) ||
      item.startDate1
        ?.toString()
        .toLowerCase()
        .includes(search) ||
      item.endDate1
        ?.toString()
        .toLowerCase()
        .includes(search) ||
      item.issueDate1
        ?.toString()
        .toLowerCase()
        .includes(search)
    );
  });

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredData.slice(
    startIndex,
    endIndex
  );

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2
    ];
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* ================= PAGE HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h1
            className="fw-bold mb-1"
            style={{ fontSize: "28px" }}
          >
            Master Sessions
          </h1>

          <p className="text-muted mb-0">
            Manage academic sessions and session periods
          </p>
        </div>

        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="index.html">Dashboard</a>
            </li>

            <li className="breadcrumb-item">
              Master Detail
            </li>

            <li className="breadcrumb-item active">
              Sessions
            </li>
          </ol>
        </nav>
      </div>

      <section className="section">

        {/* ================= FORM CARD ================= */}
        <div className="card border-0 shadow-sm mb-4 overflow-hidden">

          {/* Gradient Header */}
          <div
            className="p-4 text-white"
            style={{
              background:
                "linear-gradient(135deg, #4158D0 0%, #C850C0 50%, #FFCC70 100%)"
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div
                  className="d-flex align-items-center mb-2"
                  style={{ gap: "10px" }}
                >
                  <div
                    className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px"
                    }}
                  >
                    <i className="bi bi-calendar3 fs-5"></i>
                  </div>

                  <h5 className="mb-0 fw-bold">
                    {formData.id > 0
                      ? "Edit Master Session"
                      : "Create Master Session"}
                  </h5>
                </div>

                <small className="opacity-75">
                  Configure session name, dates and status
                </small>
              </div>

              {formData.id > 0 && (
                <span className="badge bg-white text-primary px-3 py-2">
                  Editing #{formData.id}
                </span>
              )}
            </div>
          </div>

          <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

              <input
                type="hidden"
                name="id"
                value={formData.id}
              />

              {/* SESSION INFORMATION */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-2"
                    style={{
                      width: "34px",
                      height: "34px"
                    }}
                  >
                    <i className="bi bi-info-circle"></i>
                  </div>

                  <div>
                    <h6 className="fw-bold mb-0">
                      Session Information
                    </h6>

                    <small className="text-muted">
                      Basic session details
                    </small>
                  </div>
                </div>

                <div className="row g-3">

                  {/* Master Session */}
                  <div className="col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      Master Session
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-diagram-3 text-primary"></i>
                      </span>

                      <select
                        className="form-select"
                        value={formData.masterSessionId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            masterSessionId:
                              Number(e.target.value)
                          })
                        }
                        required
                      >
                        <option value={0}>
                          Select Master Session
                        </option>

                        {masterTypes.map((item) => (
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

                  {/* Short Name */}
                  <div className="col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      Short Name
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-tag text-primary"></i>
                      </span>

                      <input
                        type="text"
                        name="shortName"
                        className="form-control"
                        placeholder="e.g. 2025-26"
                        value={formData.shortName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="col-lg-4 col-md-12">
                    <label className="form-label fw-semibold">
                      Session Name
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-pencil text-primary"></i>
                      </span>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter session name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>
              </div>

              <hr className="my-4" />

              {/* DATE INFORMATION */}
              <div className="mb-4">

                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center me-2"
                    style={{
                      width: "34px",
                      height: "34px"
                    }}
                  >
                    <i className="bi bi-calendar-event"></i>
                  </div>

                  <div>
                    <h6 className="fw-bold mb-0">
                      Session Dates
                    </h6>

                    <small className="text-muted">
                      Define the session timeline
                    </small>
                  </div>
                </div>

                <div className="row g-3">

                  {/* Start */}
                  <div className="col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      Start Date
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-calendar-check text-success"></i>
                      </span>

                      <input
                        type="date"
                        name="startDate"
                        className="form-control"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* End */}
                  <div className="col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      End Date
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-calendar-x text-danger"></i>
                      </span>

                      <input
                        type="date"
                        name="endDate"
                        className="form-control"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Issue */}
                  <div className="col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      Issue Date
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-calendar-plus text-warning"></i>
                      </span>

                      <input
                        type="date"
                        name="issueDate"
                        className="form-control"
                        value={formData.issueDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>
              </div>

              <hr className="my-4" />

              {/* STATUS + BUTTONS */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                <div
                  className="border rounded-3 px-3 py-2 d-flex align-items-center"
                  style={{
                    background: "#f8f9fa"
                  }}
                >
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      style={{
                        width: "48px",
                        height: "24px",
                        cursor: "pointer"
                      }}
                      checked={formData.isActive === 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive:
                            e.target.checked ? 1 : 0
                        })
                      }
                    />
                  </div>

                  <div className="ms-2">
                    <div className="fw-semibold">
                      Active Status
                    </div>

                    <small
                      className={
                        formData.isActive === 1
                          ? "text-success"
                          : "text-muted"
                      }
                    >
                      {formData.isActive === 1
                        ? "Session is active"
                        : "Session is inactive"}
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-2">

                  {formData.id > 0 && (
                    <button
                      type="button"
                      className="btn btn-light border px-4"
                      onClick={resetForm}
                    >
                      <i className="bi bi-x-lg me-2"></i>
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary px-4 shadow-sm"
                  >
                    <i
                      className={
                        formData.id > 0
                          ? "bi bi-check2-circle me-2"
                          : "bi bi-plus-circle me-2"
                      }
                    ></i>

                    {formData.id > 0
                      ? "Update Session"
                      : "Create Session"}
                  </button>

                </div>
              </div>

            </form>
          </div>
        </div>

        {/* ================= LIST CARD ================= */}
        <div className="card border-0 shadow-sm">

          <div className="card-body p-4">

            {/* LIST HEADER */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

              <div>
                <div className="d-flex align-items-center">
                  <h5 className="fw-bold mb-0">
                    Session Directory
                  </h5>

                  <span className="badge bg-primary bg-opacity-10 text-primary ms-2 px-3">
                    {filteredData.length}
                  </span>
                </div>

                <small className="text-muted">
                  View and manage all master sessions
                </small>
              </div>

              {/* Search */}
              <div
                className="position-relative"
                style={{ width: "280px" }}
              >
                <i
                  className="bi bi-search position-absolute"
                  style={{
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#8a94a6"
                  }}
                ></i>

                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    borderRadius: "10px"
                  }}
                />
              </div>

            </div>

            {/* TABLE TOOLBAR */}
            <div
              className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3 p-3 rounded-3"
              style={{
                background: "#f8f9fc"
              }}
            >

              <div className="d-flex align-items-center">
                <span className="text-muted me-2">
                  Show
                </span>

                <select
                  className="form-select form-select-sm"
                  style={{ width: "75px" }}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
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

              <div className="text-muted small">
                {filteredData.length > 0
                  ? `Showing ${startIndex + 1} - ${Math.min(
                      endIndex,
                      filteredData.length
                    )} of ${filteredData.length}`
                  : "No records found"}
              </div>

            </div>

            {/* TABLE */}
            <div className="table-responsive">

              <table className="table align-middle mb-0">

                <thead>
                  <tr
                    style={{
                      background: "#f8f9fc"
                    }}
                  >
                    <th
                      className="text-muted"
                      style={{ width: "60px" }}
                    >
                      #
                    </th>

                    <th className="text-muted">
                      SESSION
                    </th>

                    <th className="text-muted">
                      NAME
                    </th>

                    <th className="text-muted">
                      START DATE
                    </th>

                    <th className="text-muted">
                      END DATE
                    </th>

                    <th className="text-muted">
                      ISSUE DATE
                    </th>

                    <th className="text-muted text-center">
                      STATUS
                    </th>

                    <th
                      className="text-muted text-center"
                      style={{ width: "120px" }}
                    >
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (

                      <tr
                        key={item.id}
                        style={{
                          borderBottom:
                            "1px solid #edf0f5"
                        }}
                      >

                        {/* Number */}
                        <td>
                          <span className="text-muted">
                            {startIndex + index + 1}
                          </span>
                        </td>

                        {/* Short Name */}
                        <td>
                          <div className="d-flex align-items-center">

                            <div
                              className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-2"
                              style={{
                                width: "40px",
                                height: "40px"
                              }}
                            >
                              <i className="bi bi-calendar3"></i>
                            </div>

                            <div>
                              <div className="fw-semibold">
                                {item.shortName || "-"}
                              </div>

                              <small className="text-muted">
                                ID #{item.id}
                              </small>
                            </div>

                          </div>
                        </td>

                        {/* Name */}
                        <td>
                          <span className="fw-semibold">
                            {item.name}
                          </span>
                        </td>

                        {/* Start */}
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                            <i className="bi bi-calendar-check me-1"></i>
                            {item.startDate1}
                          </span>
                        </td>

                        {/* End */}
                        <td>
                          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">
                            <i className="bi bi-calendar-x me-1"></i>
                            {item.endDate1}
                          </span>
                        </td>

                        {/* Issue */}
                        <td>
                          <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2">
                            <i className="bi bi-calendar-plus me-1"></i>
                            {item.issueDate1}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="text-center">

                          {item.isActive == 1 ? (
                            <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Active
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                              <i className="bi bi-x-circle-fill me-1"></i>
                              Inactive
                            </span>
                          )}

                        </td>

                        {/* Actions */}
                        <td>

                          <div className="d-flex justify-content-center gap-2">

                            <button
                              type="button"
                              className="btn btn-sm btn-light text-primary border"
                              title="Edit"
                              onClick={() =>
                                handleEdit(item.id)
                              }
                              style={{
                                width: "36px",
                                height: "36px"
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-light text-danger border"
                              title="Delete"
                              onClick={() =>
                                handleDelete(
                                  item.id,
                                  item.name
                                )
                              }
                              style={{
                                width: "36px",
                                height: "36px"
                              }}
                            >
                              <i className="bi bi-trash3"></i>
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
                        <div className="mb-3">
                          <i
                            className="bi bi-calendar-x text-muted"
                            style={{
                              fontSize: "50px"
                            }}
                          ></i>
                        </div>

                        <h6 className="fw-semibold">
                          No Sessions Found
                        </h6>

                        <p className="text-muted mb-0">
                          Try changing your search
                          criteria.
                        </p>
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}
            {totalPages > 0 && (

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">

                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left me-1"></i>
                  Previous
                </button>

                <div className="d-flex gap-1">

                  {getPageNumbers().map((page) => (

                    <button
                      type="button"
                      key={page}
                      onClick={() =>
                        handlePageChange(page)
                      }
                      className={
                        currentPage === page
                          ? "btn btn-primary"
                          : "btn btn-light border"
                      }
                      style={{
                        minWidth: "38px"
                      }}
                    >
                      {page}
                    </button>

                  ))}

                </div>

                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={handleNext}
                  disabled={
                    currentPage === totalPages
                  }
                >
                  Next
                  <i className="bi bi-chevron-right ms-1"></i>
                </button>

              </div>

            )}

          </div>
        </div>

      </section>

      {/* ================= DELETE MODAL ================= */}
      {deleteModal && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor:
                "rgba(15, 23, 42, 0.65)"
            }}
            tabIndex="-1"
          >

            <div className="modal-dialog modal-dialog-centered">

              <div
                className="modal-content border-0 shadow-lg"
                style={{
                  borderRadius: "18px",
                  overflow: "hidden"
                }}
              >

                {/* Modal Top */}
                <div
                  className="text-center pt-4"
                >
                  <div
                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "75px",
                      height: "75px",
                      background:
                        "rgba(220, 53, 69, 0.1)"
                    }}
                  >
                    <i
                      className="bi bi-trash3 text-danger"
                      style={{
                        fontSize: "30px"
                      }}
                    ></i>
                  </div>
                </div>

                <div className="modal-body text-center px-4 pb-2">

                  <h4 className="fw-bold mt-3">
                    Delete Session?
                  </h4>

                  <p className="text-muted mb-2">
                    Are you sure you want to delete
                    this session?
                  </p>

                  <div
                    className="bg-light rounded-3 p-3 mt-3"
                  >
                    <div className="fw-bold">
                      {deleteSessionName}
                    </div>

                    <small className="text-muted">
                      This action cannot be undone.
                    </small>
                  </div>

                </div>

                <div className="modal-footer border-0 justify-content-center gap-2 pb-4">

                  <button
                    type="button"
                    className="btn btn-light border px-4"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={confirmDelete}
                  >
                    <i className="bi bi-trash3 me-2"></i>
                    Delete Session
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

export default MasterSession;
 