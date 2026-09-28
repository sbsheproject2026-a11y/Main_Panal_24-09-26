 
import React, { useEffect, useState } from 'react'
import {
  createStates,
  getStates,
  getStatesById,
  getStatesDelete,
  updateStates
} from '../../AllServicesFiles/LocationService';

function State() {

  // ============================================================
  // State List
  // ============================================================
  const [data, setData] = useState([]);

  // ============================================================
  // Edit Data
  // ============================================================
  const [editData, setEditData] = useState(null);

  // ============================================================
  // Form Data
  // ============================================================
  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    name: "",
    isActive: 1
  });

  // ============================================================
  // Search & Pagination
  // ============================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ============================================================
  // Delete Modal
  // ============================================================
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteStateName, setDeleteStateName] = useState("");


  // ============================================================
  // Load States
  // ============================================================
  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {

    try {

      const result = await getStates();

      setData(result.data || []);

    }
    catch (error) {

      console.log(error);

    }

  };


  // ============================================================
  // Edit State
  // ============================================================
  const handleEdit = async (id) => {

    try {

      const result = await getStatesById(id);

      console.log(result);

      setFormData({
        id: result.id,
        code: result.code || "",
        name: result.name || "",
        isActive: result.isActive
      });

    }
    catch (error) {

      console.log(error);

    }

  };


  // ============================================================
  // Open Delete Confirmation Modal
  // ============================================================
  const handleDelete = (id, name) => {

    setDeleteId(id);
    setDeleteStateName(name);
    setDeleteModal(true);

  };


  // ============================================================
  // Close Delete Modal
  // ============================================================
  const closeDeleteModal = () => {

    setDeleteModal(false);
    setDeleteId(null);
    setDeleteStateName("");

  };


  // ============================================================
  // Confirm Delete
  // ============================================================
  const confirmDelete = async () => {

    try {

      if (!deleteId) {
        return;
      }

      const result = await getStatesDelete(deleteId);

      alert(result);

      closeDeleteModal();

      await loadStates();

    }
    catch (error) {

      console.log(error);

    }

  };


  // ============================================================
  // Edit Data Effect
  // ============================================================
  useEffect(() => {

    if (editData) {

      setFormData({
        id: editData.id,
        code: editData.code || "",
        name: editData.name || "",
        isActive: editData.isActive
      });

    }

  }, [editData]);


  // ============================================================
  // Handle Input Change
  // ============================================================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // ============================================================
  // Submit / Update
  // ============================================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      let result;

      if (formData.id > 0) {

        // Update
        result = await updateStates(formData);

      }
      else {

        // Create
        result = await createStates(formData);

      }

      alert(result.message);

      await loadStates();

      // Reset Form
      setFormData({
        id: 0,
        code: "",
        name: "",
        isActive: 1
      });

      setEditData(null);

    }
    catch (error) {

      console.log(error);

    }

  };


  // ============================================================
  // Search
  // ============================================================
  const handleSearchChange = (e) => {

    setSearchTerm(e.target.value);

    setCurrentPage(1);

  };


  // ============================================================
  // Items Per Page
  // ============================================================
  const handleItemsPerPageChange = (e) => {

    setItemsPerPage(Number(e.target.value));

    setCurrentPage(1);

  };


  // ============================================================
  // Filter Data
  // ============================================================
  const filteredData = data.filter((item) => {

    const search = searchTerm
      .toLowerCase()
      .trim();

    return (
      item.code
        ?.toString()
        .toLowerCase()
        .includes(search) ||

      item.name
        ?.toString()
        .toLowerCase()
        .includes(search)
    );

  });


  // ============================================================
  // Pagination
  // ============================================================
  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentData =
    filteredData.slice(
      startIndex,
      endIndex
    );


  // ============================================================
  // Get Page Numbers
  // ============================================================
  const getPageNumbers = () => {

    const pages = [];

    if (totalPages <= 5) {

      for (let i = 1; i <= totalPages; i++) {

        pages.push(i);

      }

    }
    else if (currentPage <= 3) {

      pages.push(
        1,
        2,
        3,
        4,
        5
      );

    }
    else if (currentPage >= totalPages - 2) {

      pages.push(
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );

    }
    else {

      pages.push(
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2
      );

    }

    return pages;

  };


  // ============================================================
  // Page Change
  // ============================================================
  const handlePageChange = (page) => {

    setCurrentPage(page);

  };


  // ============================================================
  // Previous
  // ============================================================
  const handlePrevious = () => {

    if (currentPage > 1) {

      setCurrentPage(
        currentPage - 1
      );

    }

  };


  // ============================================================
  // Next
  // ============================================================
  const handleNext = () => {

    if (currentPage < totalPages) {

      setCurrentPage(
        currentPage + 1
      );

    }

  };


  const pageNumbers = getPageNumbers();


  // ============================================================
  // JSX
  // ============================================================
  return (

    <>

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}
      <div>

        <h1>State</h1>

        <nav>

          <ol className="breadcrumb">

            <li className="breadcrumb-item">

              <a href="index.html">
                Dashboard
              </a>

            </li>

            <li className="breadcrumb-item">
              Location Detail
            </li>

            <li className="breadcrumb-item active">
              State
            </li>

          </ol>

        </nav>

      </div>


      {/* ========================================================
          MAIN SECTION
      ======================================================== */}
      <section className="section">

        <div className="row">


          {/* ====================================================
              STATE FORM
          ==================================================== */}
          <div className="col-lg-5">

            <div className="card">

              <div className="card-body">

                <h5 className="card-title">
                  State
                </h5>


                <form onSubmit={handleSubmit}>


                  {/* ==================================================
                      CODE
                  ================================================== */}
                  <div className="row mb-3">

                    <label className="col-sm-3 col-form-label">
                      Code
                    </label>

                    <div className="col-sm-9">

                      <input
                        type="text"
                        name="code"
                        className="form-control"
                        value={formData.code}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  {/* ==================================================
                      NAME
                  ================================================== */}
                  <div className="row mb-3">

                    <label className="col-sm-3 col-form-label">
                      Name
                    </label>

                    <div className="col-sm-9">

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  {/* ==================================================
                      IS ACTIVE
                  ================================================== */}
                  <div className="row mb-3">

                    <label className="col-sm-3 col-form-label">
                      IsActive
                    </label>

                    <div className="col-sm-9">

                      <div className="form-check form-switch">

                        <input
                          style={{
                            height: "25px",
                            width: "50px"
                          }}
                          className="form-check-input"
                          type="checkbox"
                          id="stateActiveSwitch"
                          checked={
                            formData.isActive === 1
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive:
                                e.target.checked
                                  ? 1
                                  : 0
                            })
                          }
                        />

                      </div>

                    </div>

                  </div>


                  {/* ==================================================
                      BUTTONS
                  ================================================== */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >

                    {formData.id > 0
                      ? "Update"
                      : "Submit"}

                  </button>


                  {formData.id > 0 && (

                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => {

                        setFormData({
                          id: 0,
                          code: "",
                          name: "",
                          isActive: 1
                        });

                        setEditData(null);

                      }}
                    >
                      Cancel
                    </button>

                  )}

                </form>

              </div>

            </div>

          </div>


          {/* ====================================================
              STATE LIST
          ==================================================== */}
          <div className="col-lg-7">

            <div className="card">

              <div className="card-body">

                <h5 className="card-title">
                  State List
                </h5>


                {/* ==================================================
                    SHOW + SEARCH
                ================================================== */}
                <div className="d-flex justify-content-between align-items-center mb-3">


                  {/* Show Entries */}
                  <div className="d-flex align-items-center">

                    <span className="me-2">
                      Show
                    </span>

                    <select
                      className="form-select"
                      style={{
                        width: "80px"
                      }}
                      value={itemsPerPage}
                      onChange={
                        handleItemsPerPageChange
                      }
                    >

                      <option value={10}>
                        10
                      </option>

                      <option value={25}>
                        25
                      </option>

                      <option value={50}>
                        50
                      </option>

                      <option value={100}>
                        100
                      </option>

                    </select>

                    <span className="ms-2">
                      entries
                    </span>

                  </div>


                  {/* Search */}
                  <div>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={
                        handleSearchChange
                      }
                      style={{
                        width: "220px"
                      }}
                    />

                  </div>

                </div>


                {/* ==================================================
                    TABLE
                ================================================== */}
                <div className="table-responsive">

                  <table className="table datatable">

                    <thead>

                      <tr>

                        <th scope="col">
                          #
                        </th>

                        <th scope="col">
                          Code
                        </th>

                        <th scope="col">
                          Name
                        </th>

                        <th scope="col">
                          Action
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {currentData.length > 0 ? (

                        currentData.map(
                          (item, index) => (

                            <tr key={item.id}>

                              {/* Serial */}
                              <th scope="row">
                                {startIndex + index + 1}
                              </th>


                              {/* Code */}
                              <td>
                                {item.code}
                              </td>


                              {/* Name */}
                              <td>
                                {item.name}
                              </td>


                              {/* Action */}
                              <td>

                                {/* Edit */}
                                <i
                                  className="bi bi-pencil-square text-primary"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "18px"
                                  }}
                                  title="Edit"
                                  onClick={() =>
                                    handleEdit(
                                      item.id
                                    )
                                  }
                                ></i>


                                <span className="mx-2">
                                  |
                                </span>


                                {/* Delete */}
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

                          )
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan="4"
                            className="text-center"
                          >
                            No State Found
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>


                {/* ==================================================
                    PAGINATION
                ================================================== */}
                {totalPages > 0 && (

                  <div className="d-flex justify-content-end mt-3">

                    <nav>

                      <ul className="pagination mb-0">


                        {/* ========================================
                            PREVIOUS
                        ======================================== */}
                        <li
                          className={`page-item ${
                            currentPage === 1
                              ? "disabled"
                              : ""
                          }`}
                        >

                          <button
                            type="button"
                            className="page-link"
                            onClick={
                              handlePrevious
                            }
                            disabled={
                              currentPage === 1
                            }
                          >
                            Prev
                          </button>

                        </li>


                        {/* ========================================
                            PAGE NUMBERS
                        ======================================== */}
                        {pageNumbers.map(
                          (page) => (

                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page
                                  ? "active"
                                  : ""
                              }`}
                            >

                              <button
                                type="button"
                                className="page-link"
                                onClick={() =>
                                  handlePageChange(
                                    page
                                  )
                                }
                              >
                                {page}
                              </button>

                            </li>

                          )
                        )}


                        {/* ========================================
                            NEXT
                        ======================================== */}
                        <li
                          className={`page-item ${
                            currentPage === totalPages
                              ? "disabled"
                              : ""
                          }`}
                        >

                          <button
                            type="button"
                            className="page-link"
                            onClick={
                              handleNext
                            }
                            disabled={
                              currentPage === totalPages
                            }
                          >
                            Next
                          </button>

                        </li>

                      </ul>

                    </nav>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================================
          DELETE CONFIRMATION MODAL
      ========================================================== */}
      {deleteModal && (

        <>

          {/* Modal Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 1040
            }}
          ></div>


          {/* Modal */}
          <div
            className="modal fade show"
            style={{
              display: "block",
              zIndex: 1050
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >

            <div className="modal-dialog modal-dialog-centered">

              <div className="modal-content">


                {/* ==================================================
                    MODAL HEADER
                ================================================== */}
                <div className="modal-header">

                  <h5 className="modal-title">
                    Confirm Delete
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDeleteModal}
                  ></button>

                </div>


                {/* ==================================================
                    MODAL BODY
                ================================================== */}
                <div className="modal-body text-center">

                  <div className="mb-3">

                    <i
                      className="bi bi-exclamation-triangle-fill text-warning"
                      style={{
                        fontSize: "55px"
                      }}
                    ></i>

                  </div>


                  <h5>
                    Are you sure?
                  </h5>


                  <p className="text-muted mb-1">

                    Do you really want to delete

                  </p>


                  <h6 className="fw-bold">

                    {deleteStateName}

                  </h6>


                  <p className="text-muted mb-0">

                    This action cannot be undone.

                  </p>

                </div>


                {/* ==================================================
                    MODAL FOOTER
                ================================================== */}
                <div className="modal-footer justify-content-center">

                  {/* Cancel */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDeleteModal}
                  >

                    <i className="bi bi-x-circle me-1"></i>

                    Cancel

                  </button>


                  {/* Confirm Delete */}
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >

                    <i className="bi bi-trash-fill me-1"></i>

                    Confirm Delete

                  </button>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

    </>

  );

}

export default State;
 