
import React, { useEffect, useMemo, useState } from "react";
import {
  getMasterTypeDetails,
  createMasterTypeDetail,
  getMasterTypeDetailById,
  updateMasterTypeDetail,
  getMasterTypeDetailDelete,
  getMasterTypes,
  getMasterTypesdetails,
} from "../../AllServicesFiles/MastertypeDetailService";
import { FILE_URL } from "../../api";

function Department() {
  const [data, setData] = useState([]);
  const [masterTypes, setMasterTypes] = useState([]);
  const [masterTypesdetsils, setMasterTypesdetails] = useState([]);

  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    name: "",
    file: null,
    parentId: null,
    isActive: 1,
    masterTypeId: 13,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMasterTypeDetailName, setDeleteMasterTypeDetailName] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [masterTypeLoading, setMasterTypeLoading] = useState(false);
  const [masterTypedLoading, setMasterTypedLoading] = useState(false);

  useEffect(() => {
    loadMasterTypes();
    loadMasterTypeDetails();
    loadMasterTypesdetails();
  }, []);

  /* ================= LOAD MASTER TYPES ================= */

  const loadMasterTypes = async () => {
    try {
      setMasterTypeLoading(true);

      const result = await getMasterTypes();

      setMasterTypes(result?.data || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load Master Types.");
    } finally {
      setMasterTypeLoading(false);
    }
  };
  /* ================= LOAD MASTER TYPES details ================= */

  const loadMasterTypesdetails = async () => {
    try {
      setMasterTypedLoading(true);

      const result = await getMasterTypesdetails();

      setMasterTypesdetails(result?.data || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load Master Types Details.");
    } finally {
      setMasterTypedLoading(false);
    }
  };

  /* ================= LOAD DETAILS ================= */

  const loadMasterTypeDetails = async () => {
    try {
      setLoading(true);

      const result = await getMasterTypeDetails();

      const filteredData = (result?.data || []).filter(
        item => item.masterTypeId === 13
      );

      setData(filteredData);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      alert("Unable to load Departments.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setFormData({
      id: 0,
      code: "",
      name: "",
      file: null,
      parentId: null,
      isActive: 0,
      masterTypeId: 13,
    });
  };

  /* ================= EDIT ================= */

  const handleEdit = async (id) => {
    try {
      const result = await getMasterTypeDetailById(id);

      setFormData({
        id: result.id,
        code: result.code || "",
        name: result.name || "",
        isActive: result.isActive ? 1 : 0,
        filePath: result.filePath || null,
        file: result.file || null,
        parentId: result.parentId || null,
        masterTypeId: result.masterTypeId || 0,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
      alert("Unable to load Department.");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteMasterTypeDetailName(name);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteId(null);
    setDeleteMasterTypeDetailName("");
  };

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;

      const result = await getMasterTypeDetailDelete(deleteId);

      alert(
        result?.message ||
        result ||
        "Department deleted successfully"
      );

      closeDeleteModal();

      await loadMasterTypeDetails();
    } catch (error) {
      console.error(error);
      alert("Unable to delete Department.");
    }
  };

  /* ================= FORM CHANGE ================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files?.[0] || null : value,
    }));
  };

  const handleMasterTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      masterTypeId: Number(e.target.value),
    }));
  };
  const handleMasterTypedChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      parentId: Number(e.target.value),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.masterTypeId) {
      alert("Please select Master Type.");
      return;
    }

    try {
      setSaving(true);

      let result;

      if (formData.id > 0) {
        result = await updateMasterTypeDetail(formData);
      } else {
        result = await createMasterTypeDetail(formData);
      }

      alert(
        result?.message ||
        (formData.id > 0
          ? "Department updated successfully"
          : "Department created successfully")
      );

      await loadMasterTypeDetails();

      resetForm();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= SEARCH ================= */

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return data;

    return data.filter((item) => {
      const masterTypeName =
        item.masterTypeName ||
        item.masterType?.name ||
        "";

      return (
        item.code
          ?.toString()
          .toLowerCase()
          .includes(search) ||
        item.name
          ?.toString()
          .toLowerCase()
          .includes(search) ||
        masterTypeName
          ?.toString()
          .toLowerCase()
          .includes(search)
      );
    });
  }, [data, searchTerm]);

  /* ================= PAGINATION ================= */

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
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /* ================= MASTER TYPE NAME ================= */

  const getMasterTypeName = (item) => {
    if (item.masterTypeName) {
      return item.masterTypeName;
    }

    if (item.masterType?.name) {
      return item.masterType.name;
    }

    const masterType = masterTypes.find(
      (master) =>
        Number(master.id) === Number(item.masterTypeId)
    );

    return masterType?.name || "—";
  };

  return (
    <>
      {/* =====================================================
           PAGE HEADER
       ====================================================== */}

      <div className="page-header mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="page-icon detail-icon">
              <i className="bi bi-diagram-3-fill"></i>
            </div>

            <div>
              <h1 className="page-title mb-0">
                Departments
              </h1>

              <p className="page-subtitle mb-0">
                Manage Department records
              </p>
            </div>
          </div>
        </div>

        <nav>
          <ol className="breadcrumb custom-breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="index.html">
                <i className="bi bi-house-door me-1"></i>
                Dashboard
              </a>
            </li>

            <li className="breadcrumb-item">
              Master Detail
            </li>

            <li className="breadcrumb-item active">
              Departments
            </li>
          </ol>
        </nav>
      </div>

      <section className="section">

        {/* =====================================================
             FORM CARD
         ====================================================== */}

        <div className="card modern-card border-0 mb-4">
          <div className="card-body p-0">

            <div className="card-header-modern">
              <div className="d-flex align-items-center gap-3">
                <div className="section-icon">
                  <i
                    className={
                      formData.id > 0
                        ? "bi bi-pencil-square"
                        : "bi bi-plus-lg"
                    }
                  ></i>
                </div>

                <div>
                  <h5 className="mb-1 fw-bold">
                    {formData.id > 0
                      ? "Edit Department"
                      : "Add Department"}
                  </h5>

                  <small className="text-muted">
                    {formData.id > 0
                      ? "Update Department information"
                      : "Create a new Department"}
                  </small>
                </div>
              </div>

              {formData.id > 0 && (
                <button
                  type="button"
                  className="btn btn-light btn-sm reset-btn"
                  onClick={resetForm}
                >
                  <i className="bi bi-x-lg me-1"></i>
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="p-4">
              <form onSubmit={handleSubmit}>

                <div className="row g-4">



                  {/* CODE */}

                  <div className="col-md-6">
                    <label className="form-label-modern">
                      Code
                    </label>

                    <div className="input-group-modern">
                      <span className="input-icon">
                        <i className="bi bi-hash"></i>
                      </span>

                      <input
                        type="text"
                        name="code"
                        className="form-control modern-input"
                        placeholder="Enter detail code"
                        value={formData.code}
                        onChange={handleChange}
                      />
                    </div>

                    <small className="field-help">
                      Enter a unique code for this detail
                    </small>
                  </div>

                  {/* NAME */}

                  <div className="col-md-6">
                    <label className="form-label-modern">
                      Name
                      <span className="text-danger ms-1">
                        *
                      </span>
                    </label>

                    <div className="input-group-modern">
                      <span className="input-icon">
                        <i className="bi bi-tag"></i>
                      </span>

                      <input
                        type="text"
                        name="name"
                        className="form-control modern-input"
                        placeholder="Enter detail name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                  </div>
                  {/* File */}

                  <div className="col-md-6">
                    <label className="form-label-modern">
                      File
                    </label>

                    <div className="input-group-modern">
                      <span className="input-icon">
                        <i className="bi bi-file-earmark"></i>
                      </span>

                      <input
                        type="file"
                        name="file"
                        className="form-control modern-input"
                        accept="image/*,.pdf"
                        onChange={handleChange}
                      />
                    </div>

                    {/* Existing File Preview */}
                    {formData.filePath && (
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        {/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(formData.filePath) ? (
                          /* IMAGE */
                          <a
                            href={`${FILE_URL}${formData.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`${FILE_URL}${formData.filePath}`}
                              alt="File Preview"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                                cursor: "pointer",
                              }}
                            />
                          </a>
                        ) : /\.pdf$/i.test(formData.filePath) ? (
                          /* PDF */
                          <a
                            href={`${FILE_URL}${formData.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px 14px",
                              border: "1px solid #ddd",
                              borderRadius: "6px",
                              textDecoration: "none",
                              color: "#d32f2f",
                              background: "#fff",
                              fontWeight: "600",
                            }}
                          >
                            <i
                              className="bi bi-file-earmark-pdf-fill"
                              style={{ fontSize: "24px" }}
                            ></i>

                            <span>View PDF</span>
                          </a>
                        ) : (
                          /* OTHER FILE */
                          <a
                            href={`${FILE_URL}${formData.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#ff6600",
                              fontWeight: "600",
                              textDecoration: "none",
                            }}
                          >
                            <i className="bi bi-file-earmark"></i> View File
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* STATUS */}

                  <div className="col-md-6">
                    <label className="form-label-modern">
                      Status
                    </label>

                    <div className="status-box">
                      <div className="d-flex align-items-center justify-content-between">

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className={
                              formData.isActive === 1
                                ? "status-icon active"
                                : "status-icon inactive"
                            }
                          >
                            <i
                              className={
                                formData.isActive === 1
                                  ? "bi bi-check-lg"
                                  : "bi bi-pause-fill"
                              }
                            ></i>
                          </div>

                          <div>
                            <div className="fw-semibold">
                              {formData.isActive === 1
                                ? "Active"
                                : "Inactive"}
                            </div>

                            <small className="text-muted">
                              {formData.isActive === 1
                                ? "This detail is active"
                                : "This detail is inactive"}
                            </small>
                          </div>
                        </div>

                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input custom-switch"
                            type="checkbox"
                            checked={
                              formData.isActive === 1
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isActive:
                                  e.target.checked
                                    ? 1
                                    : 0,
                              }))
                            }
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="col-12">
                    <div className="form-actions">

                      <button
                        type="submit"
                        className="btn btn-primary modern-primary-btn"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i
                              className={
                                formData.id > 0
                                  ? "bi bi-check2-circle me-2"
                                  : "bi bi-plus-lg me-2"
                              }
                            ></i>

                            {formData.id > 0
                              ? "Update Detail"
                              : "Create Detail"}
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-light modern-reset-btn"
                        onClick={resetForm}
                      >
                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                        Reset
                      </button>

                    </div>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>

        {/* =====================================================
             LIST CARD
         ====================================================== */}

        <div className="card modern-card border-0">
          <div className="card-body p-0">

            <div className="card-header-modern">

              <div className="d-flex align-items-center gap-3">
                <div className="section-icon purple">
                  <i className="bi bi-list-ul"></i>
                </div>

                <div>
                  <h5 className="mb-1 fw-bold">
                    Departments List
                  </h5>

                  <small className="text-muted">
                    View and manage all detail records
                  </small>
                </div>
              </div>

              <div className="record-count">
                <span>{filteredData.length}</span>
                <small>Records</small>
              </div>

            </div>

            <div className="p-4">

              {/* TOOLBAR */}

              <div className="table-toolbar mb-4">

                <div className="entries-control">
                  <span className="text-muted">
                    Show
                  </span>

                  <select
                    className="form-select entries-select"
                    value={itemsPerPage}
                    onChange={
                      handleItemsPerPageChange
                    }
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>

                  <span className="text-muted">
                    entries
                  </span>
                </div>

                <div className="search-wrapper">

                  <i className="bi bi-search"></i>

                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search type, code or name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                  )}

                </div>

              </div>

              {/* SHOWING */}

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div className="showing-text">
                  {filteredData.length > 0 ? (
                    <>
                      Showing{" "}
                      <strong>
                        {startIndex + 1}
                      </strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          endIndex,
                          filteredData.length
                        )}
                      </strong>{" "}
                      of{" "}
                      <strong>
                        {filteredData.length}
                      </strong>{" "}
                      records
                    </>
                  ) : (
                    "No records available"
                  )}
                </div>

                {searchTerm && (
                  <span className="search-result-label">
                    <i className="bi bi-funnel me-1"></i>
                    Filtered
                  </span>
                )}

              </div>

              {/* TABLE */}

              <div className="table-responsive modern-table-wrapper">

                <table className="table modern-table align-middle mb-0">

                  <thead>
                    <tr>
                      <th style={{ width: "65px" }}>
                        #
                      </th>



                      <th>
                        Code
                      </th>

                      <th>
                        Detail Name
                      </th>
                      <th>
                        Master Type
                      </th>
                      <th style={{ width: "130px" }}>
                        Status
                      </th>
                      <th style={{ width: "130px" }}>
                        File
                      </th>

                      <th
                        className="text-center"
                        style={{ width: "120px" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {loading ? (

                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-5"
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          ></div>

                          <div className="mt-2 text-muted">
                            Loading details...
                          </div>
                        </td>
                      </tr>

                    ) : currentData.length > 0 ? (

                      currentData.map(
                        (item, index) => {

                          const masterTypeName =
                            getMasterTypeName(item);

                          return (
                            <tr key={item.id}>

                              {/* NUMBER */}

                              <td>
                                <span className="row-number">
                                  {startIndex + index + 1}
                                </span>
                              </td>


                              {/* CODE */}

                              <td>
                                <span className="code-badge">
                                  {item.code || "—"}
                                </span>
                              </td>

                              {/* NAME */}

                              <td>
                                <div className="name-cell">

                                  <div className="name-avatar detail-avatar">
                                    {item.name
                                      ?.charAt(0)
                                      ?.toUpperCase() || "D"}
                                  </div>

                                  <div>
                                    <div className="fw-semibold">
                                      {item.name}
                                    </div>

                                    <small className="text-muted">
                                      Master Detail
                                    </small>
                                  </div>

                                </div>
                              </td>

                              {/* MASTER TYPE */}

                              <td>
                                <div className="master-type-cell">

                                  <div className="master-type-icon">
                                    <i className="bi bi-diagram-3"></i>
                                  </div>

                                  <div>
                                    <div className="fw-semibold">
                                      {masterTypeName}
                                    </div>

                                    <small className="text-muted">
                                      Parent Type
                                    </small>
                                  </div>

                                </div>
                              </td>


                              {/* STATUS */}

                              <td>
                                {item.isActive === 1 ? (

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
                              {/* File */}
                              <td>
                                <span className="code-badge">
                                  {item.filePath || "—"}
                                </span>
                              </td>
                              {/* ACTION */}

                              <td>
                                <div className="action-buttons">

                                  <button
                                    type="button"
                                    className="action-btn edit"
                                    title="Edit"
                                    onClick={() =>
                                      handleEdit(item.id)
                                    }
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>

                                  <button
                                    type="button"
                                    className="action-btn delete"
                                    title="Delete"
                                    onClick={() =>
                                      handleDelete(
                                        item.id,
                                        item.name
                                      )
                                    }
                                  >
                                    <i className="bi bi-trash3"></i>
                                  </button>

                                </div>
                              </td>

                            </tr>
                          );
                        }
                      )

                    ) : (

                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-5"
                        >
                          <div className="empty-state">

                            <div className="empty-icon">
                              <i className="bi bi-inbox"></i>
                            </div>

                            <h6 className="fw-bold mt-3">
                              No Departments Found
                            </h6>

                            <p className="text-muted mb-0">
                              {searchTerm
                                ? "Try changing your search keyword."
                                : "There are no detail records available."}
                            </p>

                          </div>
                        </td>
                      </tr>

                    )}

                  </tbody>

                </table>
              </div>

              {/* PAGINATION */}

              {totalPages > 0 && (

                <div className="pagination-wrapper mt-4">

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                    <span>Previous</span>
                  </button>

                  <div className="page-numbers">

                    {pageNumbers.map((page) => (

                      <button
                        type="button"
                        key={page}
                        onClick={() =>
                          handlePageChange(page)
                        }
                        className={
                          currentPage === page
                            ? "page-number active"
                            : "page-number"
                        }
                      >
                        {page}
                      </button>

                    ))}

                  </div>

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={handleNext}
                    disabled={
                      currentPage === totalPages
                    }
                  >
                    <span>Next</span>
                    <i className="bi bi-chevron-right"></i>
                  </button>

                </div>

              )}

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           DELETE MODAL
       ====================================================== */}

      {deleteModal && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor:
                "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(3px)",
            }}
            tabIndex="-1"
          >

            <div className="modal-dialog modal-dialog-centered">

              <div className="modal-content delete-modal">

                <div className="delete-modal-top">

                  <button
                    type="button"
                    className="delete-close-btn"
                    onClick={closeDeleteModal}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>

                  <div className="delete-icon">
                    <i className="bi bi-trash3-fill"></i>
                  </div>

                  <h4 className="fw-bold mt-3 mb-2">
                    Delete Detail?
                  </h4>

                  <p className="text-muted mb-0">
                    You are about to permanently
                    delete this Department.
                  </p>

                </div>

                <div className="delete-record">

                  <div className="delete-record-icon">
                    {deleteMasterTypeDetailName
                      ?.charAt(0)
                      ?.toUpperCase() || "D"}
                  </div>

                  <div>
                    <small className="text-muted">
                      Department
                    </small>

                    <div className="fw-bold">
                      {deleteMasterTypeDetailName}
                    </div>
                  </div>

                </div>

                <div className="delete-warning">

                  <i className="bi bi-exclamation-triangle-fill"></i>

                  <span>
                    This action cannot be undone.
                  </span>

                </div>

                <div className="delete-modal-footer">

                  <button
                    type="button"
                    className="btn btn-light cancel-delete-btn"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn confirm-delete-btn"
                    onClick={confirmDelete}
                  >
                    <i className="bi bi-trash3 me-2"></i>
                    Delete Permanently
                  </button>

                </div>

              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* =====================================================
           CUSTOM CSS
       ====================================================== */}

      <style>{`
 
         /* ================= PAGE ================= */
 
         .page-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-end;
           gap: 20px;
           padding: 5px 0 15px;
         }
 
         .page-icon {
           width: 46px;
           height: 46px;
           border-radius: 12px;
           display: flex;
           align-items: center;
           justify-content: center;
           background: linear-gradient(
             135deg,
             #4154f1,
             #6c63ff
           );
           color: #fff;
           font-size: 20px;
           box-shadow:
             0 8px 20px rgba(
               65,
               84,
               241,
               .22
             );
         }
 
         .detail-icon {
           background: linear-gradient(
             135deg,
             #7c3aed,
             #6366f1
           );
         }
 
         .page-title {
           font-size: 26px;
           font-weight: 700;
           color: #1e293b;
         }
 
         .page-subtitle {
           color: #94a3b8;
           font-size: 13px;
         }
 
         .custom-breadcrumb {
           font-size: 13px;
         }
 
         .custom-breadcrumb a {
           color: #64748b;
           text-decoration: none;
         }
 
         .custom-breadcrumb .active {
           color: #4154f1;
           font-weight: 600;
         }
 
         /* ================= CARD ================= */
 
         .modern-card {
           background: #fff;
           border-radius: 16px;
           box-shadow:
             0 5px 25px
             rgba(15, 23, 42, .06);
           overflow: hidden;
         }
 
         .card-header-modern {
           min-height: 78px;
           padding: 18px 24px;
           display: flex;
           justify-content: space-between;
           align-items: center;
           border-bottom: 1px solid #eef2f7;
           background:
             linear-gradient(
               180deg,
               #ffffff 0%,
               #fbfcff 100%
             );
         }
 
         .section-icon {
           width: 42px;
           height: 42px;
           border-radius: 11px;
           display: flex;
           align-items: center;
           justify-content: center;
           background: rgba(
             65,
             84,
             241,
             .10
           );
           color: #4154f1;
           font-size: 18px;
         }
 
         .section-icon.purple {
           background: rgba(
             124,
             58,
             237,
             .10
           );
           color: #7c3aed;
         }
 
         .reset-btn {
           border: 1px solid #e2e8f0;
           color: #64748b;
           border-radius: 8px;
         }
 
         /* ================= FORM ================= */
 
         .form-label-modern {
           font-size: 13px;
           font-weight: 600;
           color: #334155;
           margin-bottom: 8px;
         }
 
         .input-group-modern {
           position: relative;
         }
 
         .input-icon {
           position: absolute;
           left: 14px;
           top: 50%;
           transform: translateY(-50%);
           color: #94a3b8;
           z-index: 3;
           pointer-events: none;
         }
 
         .modern-input {
           height: 46px;
           border: 1px solid #e2e8f0;
           border-radius: 10px !important;
           padding-left: 42px;
           font-size: 14px;
           color: #334155;
           background: #fff;
           transition: all .2s ease;
         }
 
         .modern-input:focus {
           border-color: #4154f1;
           box-shadow:
             0 0 0 3px
             rgba(65, 84, 241, .10);
         }
 
         .modern-select {
           cursor: pointer;
         }
 
         .field-help {
           display: block;
           margin-top: 6px;
           color: #94a3b8;
           font-size: 11px;
         }
 
         /* ================= STATUS ================= */
 
         .status-box {
           min-height: 70px;
           border: 1px solid #e2e8f0;
           border-radius: 10px;
           padding: 10px 14px;
           background: #fafbff;
         }
 
         .status-icon {
           width: 38px;
           height: 38px;
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
         }
 
         .status-icon.active {
           color: #16a34a;
           background: #dcfce7;
         }
 
         .status-icon.inactive {
           color: #64748b;
           background: #e2e8f0;
         }
 
         .custom-switch {
           width: 42px !important;
           height: 22px;
           cursor: pointer;
         }
 
         .custom-switch:checked {
           background-color: #16a34a;
           border-color: #16a34a;
         }
 
         /* ================= BUTTONS ================= */
 
         .form-actions {
           display: flex;
           gap: 10px;
           padding-top: 5px;
         }
 
         .modern-primary-btn {
           border: 0;
           min-height: 44px;
           padding: 0 22px;
           border-radius: 9px;
           background:
             linear-gradient(
               135deg,
               #4154f1,
               #5b5ff7
             );
           box-shadow:
             0 7px 18px
             rgba(65, 84, 241, .18);
           font-weight: 600;
         }
 
         .modern-primary-btn:hover {
           background:
             linear-gradient(
               135deg,
               #3445db,
               #4f53e7
             );
           transform: translateY(-1px);
         }
 
         .modern-reset-btn {
           min-height: 44px;
           padding: 0 20px;
           border-radius: 9px;
           border: 1px solid #e2e8f0;
           color: #64748b;
           font-weight: 500;
         }
 
         /* ================= RECORD COUNT ================= */
 
         .record-count {
           display: flex;
           align-items: center;
           gap: 7px;
           color: #64748b;
         }
 
         .record-count span {
           min-width: 32px;
           height: 28px;
           padding: 0 8px;
           border-radius: 7px;
           display: flex;
           align-items: center;
           justify-content: center;
           background: #eef2ff;
           color: #4154f1;
           font-weight: 700;
           font-size: 13px;
         }
 
         .record-count small {
           font-size: 12px;
         }
 
         /* ================= TOOLBAR ================= */
 
         .table-toolbar {
           display: flex;
           justify-content: space-between;
           align-items: center;
           gap: 15px;
         }
 
         .entries-control {
           display: flex;
           align-items: center;
           gap: 9px;
           font-size: 13px;
         }
 
         .entries-select {
           width: 75px;
           height: 38px;
           border-radius: 8px;
           border-color: #e2e8f0;
           font-size: 13px;
         }
 
         .search-wrapper {
           width: 300px;
           position: relative;
         }
 
         .search-wrapper > i {
           position: absolute;
           left: 13px;
           top: 50%;
           transform: translateY(-50%);
           color: #94a3b8;
           z-index: 2;
         }
 
         .search-input {
           height: 40px;
           border-radius: 9px;
           border: 1px solid #e2e8f0;
           padding-left: 38px;
           padding-right: 38px;
           font-size: 13px;
         }
 
         .search-input:focus {
           border-color: #4154f1;
           box-shadow:
             0 0 0 3px
             rgba(65, 84, 241, .08);
         }
 
         .search-clear {
           position: absolute;
           right: 10px;
           top: 50%;
           transform: translateY(-50%);
           border: 0;
           background: transparent;
           color: #94a3b8;
           padding: 0;
         }
 
         .showing-text {
           color: #94a3b8;
           font-size: 12px;
         }
 
         .showing-text strong {
           color: #475569;
         }
 
         .search-result-label {
           font-size: 11px;
           padding: 5px 9px;
           border-radius: 20px;
           color: #4154f1;
           background: #eef2ff;
           font-weight: 600;
         }
 
         /* ================= TABLE ================= */
 
         .modern-table-wrapper {
           border: 1px solid #edf1f6;
           border-radius: 12px;
         }
 
         .modern-table {
           min-width: 950px;
         }
 
         .modern-table thead th {
           background: #f8fafc;
           color: #64748b;
           font-size: 11px;
           text-transform: uppercase;
           letter-spacing: .5px;
           font-weight: 700;
           padding: 15px 16px;
           border-bottom: 1px solid #e9eef5;
         }
 
         .modern-table tbody td {
           padding: 15px 16px;
           border-bottom: 1px solid #f1f5f9;
           color: #334155;
           font-size: 13px;
         }
 
         .modern-table tbody tr:last-child td {
           border-bottom: 0;
         }
 
         .modern-table tbody tr {
           transition: background .2s ease;
         }
 
         .modern-table tbody tr:hover {
           background: #fafbff;
         }
 
         /* ================= NUMBER ================= */
 
         .row-number {
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
 
         /* ================= MASTER TYPE ================= */
 
         .master-type-cell {
           display: flex;
           align-items: center;
           gap: 10px;
         }
 
         .master-type-icon {
           width: 35px;
           height: 35px;
           flex-shrink: 0;
           border-radius: 9px;
           display: flex;
           align-items: center;
           justify-content: center;
           background: #f3e8ff;
           color: #7c3aed;
           font-size: 14px;
         }
 
         .master-type-cell small {
           font-size: 10px;
         }
 
         /* ================= CODE ================= */
 
         .code-badge {
           display: inline-flex;
           padding: 6px 10px;
           border-radius: 7px;
           background: #f1f5f9;
           color: #475569;
           font-family: monospace;
           font-size: 12px;
           font-weight: 600;
         }
 
         /* ================= NAME ================= */
 
         .name-cell {
           display: flex;
           align-items: center;
           gap: 11px;
         }
 
         .name-avatar {
           width: 36px;
           height: 36px;
           flex-shrink: 0;
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
           background:
             linear-gradient(
               135deg,
               #eef2ff,
               #e0e7ff
             );
           color: #4154f1;
           font-weight: 700;
           font-size: 13px;
         }
 
         .detail-avatar {
           background:
             linear-gradient(
               135deg,
               #f0fdf4,
               #dcfce7
             );
           color: #16a34a;
         }
 
         .name-cell small {
           font-size: 10px;
         }
 
         /* ================= STATUS BADGE ================= */
 
         .status-badge {
           display: inline-flex;
           align-items: center;
           gap: 7px;
           padding: 6px 10px;
           border-radius: 20px;
           font-size: 11px;
           font-weight: 600;
         }
 
         .status-badge.active {
           background: #ecfdf3;
           color: #15803d;
         }
 
         .status-badge.inactive {
           background: #f1f5f9;
           color: #64748b;
         }
 
         .status-dot {
           width: 6px;
           height: 6px;
           border-radius: 50%;
           background: currentColor;
         }
 
         /* ================= ACTIONS ================= */
 
         .action-buttons {
           display: flex;
           justify-content: center;
           gap: 7px;
         }
 
         .action-btn {
           width: 34px;
           height: 34px;
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           border: 1px solid transparent;
           transition: all .2s ease;
         }
 
         .action-btn.edit {
           color: #4154f1;
           background: #eef2ff;
         }
 
         .action-btn.edit:hover {
           color: #fff;
           background: #4154f1;
         }
 
         .action-btn.delete {
           color: #dc2626;
           background: #fef2f2;
         }
 
         .action-btn.delete:hover {
           color: #fff;
           background: #dc2626;
         }
 
         /* ================= EMPTY ================= */
 
         .empty-state {
           padding: 20px;
         }
 
         .empty-icon {
           width: 65px;
           height: 65px;
           margin: auto;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           background: #f8fafc;
           color: #94a3b8;
           font-size: 28px;
         }
 
         /* ================= PAGINATION ================= */
 
         .pagination-wrapper {
           display: flex;
           justify-content: space-between;
           align-items: center;
           gap: 12px;
         }
 
         .page-numbers {
           display: flex;
           gap: 5px;
         }
 
         .pagination-btn,
         .page-number {
           height: 36px;
           border-radius: 8px;
           border: 1px solid #e2e8f0;
           background: #fff;
           color: #64748b;
           font-size: 12px;
           font-weight: 600;
           transition: all .2s ease;
         }
 
         .pagination-btn {
           padding: 0 13px;
           display: flex;
           align-items: center;
           gap: 7px;
         }
 
         .pagination-btn:hover:not(:disabled) {
           border-color: #4154f1;
           color: #4154f1;
         }
 
         .pagination-btn:disabled {
           opacity: .45;
           cursor: not-allowed;
         }
 
         .page-number {
           width: 36px;
         }
 
         .page-number:hover {
           border-color: #4154f1;
           color: #4154f1;
         }
 
         .page-number.active {
           color: #fff;
           background: #4154f1;
           border-color: #4154f1;
           box-shadow:
             0 5px 12px
             rgba(65, 84, 241, .18);
         }
 
         /* ================= DELETE MODAL ================= */
 
         .delete-modal {
           border: 0;
           border-radius: 18px;
           overflow: hidden;
           box-shadow:
             0 25px 60px
             rgba(15, 23, 42, .25);
         }
 
         .delete-modal-top {
           position: relative;
           padding: 30px 25px 24px;
           text-align: center;
         }
 
         .delete-close-btn {
           position: absolute;
           right: 15px;
           top: 15px;
           width: 32px;
           height: 32px;
           border: 0;
           border-radius: 8px;
           background: #f8fafc;
           color: #64748b;
         }
 
         .delete-icon {
           width: 68px;
           height: 68px;
           margin: auto;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: 50%;
           background: #fef2f2;
           color: #dc2626;
           font-size: 27px;
         }
 
         .delete-record {
           margin: 0 25px;
           padding: 13px;
           border: 1px solid #edf1f6;
           border-radius: 11px;
           display: flex;
           align-items: center;
           gap: 12px;
           background: #fafbfc;
         }
 
         .delete-record-icon {
           width: 40px;
           height: 40px;
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
           background: #eef2ff;
           color: #4154f1;
           font-weight: 700;
         }
 
         .delete-warning {
           margin: 16px 25px;
           padding: 10px 12px;
           border-radius: 9px;
           display: flex;
           align-items: center;
           gap: 9px;
           background: #fff7ed;
           color: #c2410c;
           font-size: 12px;
         }
 
         .delete-modal-footer {
           padding: 15px 25px 22px;
           display: flex;
           justify-content: center;
           gap: 10px;
         }
 
         .cancel-delete-btn,
         .confirm-delete-btn {
           min-height: 42px;
           border-radius: 9px;
           padding: 0 18px;
           font-size: 13px;
           font-weight: 600;
         }
 
         .cancel-delete-btn {
           border: 1px solid #e2e8f0;
           color: #64748b;
         }
 
         .confirm-delete-btn {
           color: #fff;
           background: #dc2626;
           border: 1px solid #dc2626;
         }
 
         .confirm-delete-btn:hover {
           color: #fff;
           background: #b91c1c;
           border-color: #b91c1c;
         }
 
         /* ================= RESPONSIVE ================= */
 
         @media (max-width: 768px) {
 
           .page-header {
             flex-direction: column;
             align-items: flex-start;
           }
 
           .table-toolbar {
             flex-direction: column;
             align-items: stretch;
           }
 
           .search-wrapper {
             width: 100%;
           }
 
           .card-header-modern {
             padding: 16px;
           }
 
           .card-body > .p-4 {
             padding: 16px !important;
           }
 
           .pagination-wrapper {
             flex-direction: column;
           }
 
           .page-numbers {
             order: -1;
           }
 
           .pagination-btn {
             width: 100%;
             justify-content: center;
           }
 
           .record-count {
             display: none;
           }
 
           .form-actions {
             flex-direction: column;
           }
 
           .modern-primary-btn,
           .modern-reset-btn {
             width: 100%;
           }
 
           .delete-modal-footer {
             flex-direction: column;
           }
 
           .cancel-delete-btn,
           .confirm-delete-btn {
             width: 100%;
           }
         }
 
       `}</style>
    </>
  );
}

export default Department;

