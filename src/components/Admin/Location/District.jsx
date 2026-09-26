 
import React, { useEffect, useState } from 'react';

import {
  createDistricts,
  getDistricts,
  getDistrictsById,
  getDistrictsDelete,
  getStates,
  updateDistricts
} from './LocationService';


function District() {

  // =========================================================
  // DATA
  // =========================================================
  const [data, setData] = useState([]);
  const [states, setStatess] = useState([]);

  // =========================================================
  // EDIT DATA
  // =========================================================
  const [editData, setEditData] = useState(null);

  // =========================================================
  // FORM DATA
  // =========================================================
  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    name: "",
    isActive: 1,
    parentId: 0,
  });


  // =========================================================
  // SEARCH
  // =========================================================
  const [searchTerm, setSearchTerm] = useState("");


  // =========================================================
  // PAGINATION
  // =========================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  // =========================================================
  // DELETE MODAL
  // =========================================================
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDistrictName, setDeleteDistrictName] = useState("");


  // =========================================================
  // LOAD STATES
  // =========================================================
  const loadStates = async () => {

    try {

      const result = await getStates();

      setStatess(result.data || []);

    }
    catch (error) {

      console.log(error);

    }

  };


  // =========================================================
  // LOAD DISTRICTS
  // =========================================================
  const loadDistrictDetails = async () => {

    try {

      const result = await getDistricts();

      setData(result.data || []);

      // Refresh ke baad first page
      setCurrentPage(1);

    }
    catch (error) {

      console.log(error);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {

    loadStates();
    loadDistrictDetails();

  }, []);


  // =========================================================
  // EDIT
  // =========================================================
  const handleEdit = async (id) => {

    try {

      const result = await getDistrictsById(id);

      console.log(result);

      setFormData({
        id: result.id,
        code: result.code || "",
        name: result.name || "",
        isActive: result.isActive,
        parentId: result.parentId
      });

    }
    catch (error) {

      console.log(error);

    }

  };


  // =========================================================
  // OPEN DELETE MODAL
  // =========================================================
  const handleDelete = (id, name) => {

    setDeleteId(id);

    setDeleteDistrictName(name);

    setDeleteModal(true);

  };


  // =========================================================
  // CLOSE DELETE MODAL
  // =========================================================
  const closeDeleteModal = () => {

    setDeleteModal(false);

    setDeleteId(null);

    setDeleteDistrictName("");

  };


  // =========================================================
  // CONFIRM DELETE
  // =========================================================
  const confirmDelete = async () => {

    try {

      if (!deleteId) {
        return;
      }

      const result =
        await getDistrictsDelete(deleteId);


      alert(
        result?.message ||
        result ||
        "District deleted successfully"
      );


      // Close modal
      closeDeleteModal();


      // Refresh list
      await loadDistrictDetails();

    }
    catch (error) {

      console.log(error);

    }

  };


  // =========================================================
  // INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // =========================================================
  // SUBMIT / UPDATE
  // =========================================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      let result;


      // UPDATE
      if (formData.id > 0) {

        result =
          await updateDistricts(formData);

      }

      // CREATE
      else {

        result =
          await createDistricts(formData);

      }


      alert(result.message);


      // Refresh list
      await loadDistrictDetails();


      // Reset form
      setFormData({
        id: 0,
        code: "",
        name: "",
        isActive: 0,
        parentId: 0,
      });


      setEditData(null);

    }
    catch (error) {

      console.log(error);

    }

  };


  // =========================================================
  // SEARCH CHANGE
  // =========================================================
  const handleSearchChange = (e) => {

    setSearchTerm(e.target.value);

    // Search par first page
    setCurrentPage(1);

  };


  // =========================================================
  // FILTER DATA
  // =========================================================
  const filteredData = data.filter((item) => {

    const search =
      searchTerm
        .toLowerCase()
        .trim();


    return (

      item.code
        ?.toString()
        .toLowerCase()
        .includes(search)

      ||

      item.name
        ?.toString()
        .toLowerCase()
        .includes(search)

    );

  });


  // =========================================================
  // TOTAL PAGES
  // =========================================================
  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );


  // =========================================================
  // START INDEX
  // =========================================================
  const startIndex =
    (currentPage - 1) * itemsPerPage;


  // =========================================================
  // END INDEX
  // =========================================================
  const endIndex =
    startIndex + itemsPerPage;


  // =========================================================
  // CURRENT PAGE DATA
  // =========================================================
  const currentData =
    filteredData.slice(
      startIndex,
      endIndex
    );


  // =========================================================
  // PAGE NUMBERS
  // =========================================================
  const getPageNumbers = () => {

    // 5 ya kam pages
    if (totalPages <= 5) {

      return Array.from(
        {
          length: totalPages
        },
        (_, index) => index + 1
      );

    }


    // First pages
    if (currentPage <= 3) {

      return [
        1,
        2,
        3,
        4,
        5
      ];

    }


    // Last pages
    if (currentPage >= totalPages - 2) {

      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];

    }


    // Middle pages
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2
    ];

  };


  const pageNumbers =
    getPageNumbers();


  // =========================================================
  // ITEMS PER PAGE
  // =========================================================
  const handleItemsPerPageChange = (e) => {

    const value =
      Number(e.target.value);

    setItemsPerPage(value);

    setCurrentPage(1);

  };


  // =========================================================
  // PREVIOUS
  // =========================================================
  const handlePrevious = () => {

    if (currentPage > 1) {

      setCurrentPage(
        currentPage - 1
      );

    }

  };


  // =========================================================
  // NEXT
  // =========================================================
  const handleNext = () => {

    if (currentPage < totalPages) {

      setCurrentPage(
        currentPage + 1
      );

    }

  };


  // =========================================================
  // PAGE CHANGE
  // =========================================================
  const handlePageChange = (page) => {

    setCurrentPage(page);

  };


  // =========================================================
  // JSX
  // =========================================================
  return (

    <>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div>

        <h1>
          District Details
        </h1>

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
              District Details
            </li>

          </ol>

        </nav>

      </div>


      {/* =====================================================
          SECTION
      ===================================================== */}

      <section className="section">

        <div className="row">


          {/* =================================================
              DISTRICT FORM
          ================================================= */}

          <div className="col-lg-12">

            <div className="card">

              <div className="card-body">

                <h5 className="card-title">
                  District Details
                </h5>


                <form
                  onSubmit={handleSubmit}
                >


                  {/* ==========================================
                      STATE
                  ========================================== */}

                  <div className="row mb-3">

                    <label className="col-sm-3 col-form-label">
                      State
                    </label>

                    <div className="col-sm-9">

                      <select
                        className="form-select"
                        required
                        value={formData.parentId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentId:
                              Number(
                                e.target.value
                              )
                          })
                        }
                      >

                        <option value={0}>
                          Select State
                        </option>


                        {states.map(
                          (item) => (

                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                  </div>


                  {/* ==========================================
                      CODE
                  ========================================== */}

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


                  {/* ==========================================
                      NAME
                  ========================================== */}

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
                        required
                      />

                    </div>

                  </div>


                  {/* ==========================================
                      IS ACTIVE
                  ========================================== */}

                  <div className="row mb-3">

                    <label className="col-sm-3 col-form-label">
                      IsActive:
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
                          id="districtActiveSwitch"
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


                  {/* ==========================================
                      BUTTON
                  ========================================== */}

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >

                    {formData.id > 0
                      ? "Update"
                      : "Submit"}

                  </button>


                  {/* ==========================================
                      CANCEL BUTTON
                  ========================================== */}

                  {formData.id > 0 && (

                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => {

                        setFormData({
                          id: 0,
                          code: "",
                          name: "",
                          isActive: 0,
                          parentId: 0
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


          {/* =================================================
              DISTRICT LIST
          ================================================= */}

          <div className="col-lg-12">

            <div className="card">

              <div className="card-body">

                <h5 className="card-title">
                  District List
                </h5>


                {/* =================================================
                    SHOW + SEARCH
                ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">


                  {/* ============================================
                      SHOW ENTRIES
                  ============================================ */}

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


                  {/* ============================================
                      SEARCH
                  ============================================ */}

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


                {/* =================================================
                    SHOWING RECORDS
                ================================================= */}

                <div className="text-muted mb-2">

                  {filteredData.length > 0

                    ? `Showing ${
                        startIndex + 1
                      } to ${
                        Math.min(
                          endIndex,
                          filteredData.length
                        )
                      } of ${
                        filteredData.length
                      }`

                    : "Showing 0 to 0 of 0"}

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

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

                            <tr
                              key={item.id}
                            >


                              {/* ==================================
                                  SERIAL NUMBER
                              ================================== */}

                              <th scope="row">

                                {startIndex +
                                  index +
                                  1}

                              </th>


                              {/* ==================================
                                  CODE
                              ================================== */}

                              <td>
                                {item.code}
                              </td>


                              {/* ==================================
                                  NAME
                              ================================== */}

                              <td>
                                {item.name}
                              </td>


                              {/* ==================================
                                  ACTION
                              ================================== */}

                              <td>


                                {/* EDIT */}

                                <i
                                  className="bi bi-pencil-square text-primary"
                                  style={{
                                    cursor:
                                      "pointer",
                                    fontSize:
                                      "18px"
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


                                {/* DELETE */}

                                <i
                                  className="bi bi-trash-fill text-danger"
                                  style={{
                                    cursor:
                                      "pointer",
                                    fontSize:
                                      "18px"
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
                            className="text-center py-4"
                          >
                            No District Found
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {totalPages > 0 && (

                  <div className="d-flex justify-content-end mt-3">

                    <nav>

                      <ul className="pagination mb-0">


                        {/* ==========================================
                            PREVIOUS
                        ========================================== */}

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


                        {/* ==========================================
                            PAGE NUMBERS
                        ========================================== */}

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


                        {/* ==========================================
                            NEXT
                        ========================================== */}

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
                              currentPage ===
                              totalPages
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

          {/* ================================================
              BACKDROP
          ================================================= */}

          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 1040
            }}
          ></div>


          {/* ================================================
              MODAL
          ================================================= */}

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


                {/* ==========================================
                    MODAL HEADER
                ========================================== */}

                <div className="modal-header">

                  <h5 className="modal-title">
                    Confirm Delete
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={
                      closeDeleteModal
                    }
                  ></button>

                </div>


                {/* ==========================================
                    MODAL BODY
                ========================================== */}

                <div className="modal-body text-center">

                  {/* Warning Icon */}

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

                    Do you really want to
                    delete this district?

                  </p>


                  <h6 className="fw-bold">

                    {deleteDistrictName}

                  </h6>


                  <p className="text-muted mb-0">

                    This action cannot be undone.

                  </p>

                </div>


                {/* ==========================================
                    MODAL FOOTER
                ========================================== */}

                <div className="modal-footer justify-content-center">


                  {/* CANCEL */}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      closeDeleteModal
                    }
                  >

                    <i className="bi bi-x-circle me-1"></i>

                    Cancel

                  </button>


                  {/* CONFIRM DELETE */}

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={
                      confirmDelete
                    }
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

export default District;
 