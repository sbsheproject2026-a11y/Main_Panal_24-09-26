 import React, { useEffect, useState } from "react";
import {
  getAccAcountLists,
  getAccAcountDelete,
  sendToConfirmStatus,
  getAccAcountPendingLists,
} from "./FrenchiseService";
import { useNavigate } from "react-router-dom";

function AccPendingList() {
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

  // ✅ selection + action loading
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  // =========================================================
  // LOAD DATA
  // =========================================================
  useEffect(() => {
    loadAccAcounts();
  }, [pageNo, pageSize, search]);

  const loadAccAcounts = async () => {
    try {
      setLoading(true);

      const result = await getAccAcountPendingLists(11, pageNo, pageSize, search);

      setData(result?.data?.data || []);
      setTotalRecords(result?.data?.totalRecords || 0);
      setSelectedIds([]);
    } catch (error) {
      console.log("Error loading accounts:", error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PAGINATION CALCULATION
  // =========================================================
  const totalPages = Math.ceil(totalRecords / pageSize);

  const startRecord =
    totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;

  const endRecord = Math.min(pageNo * pageSize, totalRecords);

  // =========================================================
  // SEARCH
  // =========================================================
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNo(1);
  };

  const clearSearch = () => {
    setSearch("");
    setPageNo(1);
  };

  // =========================================================
  // PAGE SIZE
  // =========================================================
  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPageNo(1);
  };

  // =========================================================
  // EDIT
  // =========================================================
  const handleEdit = (id) => {
    navigate(`/acc-update/${id}`);
  };

  // =========================================================
  // DELETE MODAL
  // =========================================================
  const openDeleteModal = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
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

      await getAccAcountDelete(deleteId);

      setShowDeleteModal(false);
      setDeleteId(0);
      setDeleteName("");

      if (data.length === 1 && pageNo > 1) {
        setPageNo((prev) => prev - 1);
      } else {
        loadAccAcounts();
      }
    } catch (error) {
      console.log("Delete error:", error);
      alert("Unable to delete record.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================================
  // ✅ CHECKBOX HANDLERS
  // =========================================================
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((d) => d.id));
    }
  };

  // =========================================================
  // ✅ CONFIRM HANDLER (code = 12)
  // =========================================================
  const handleConfirm = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one record to confirm.");
      return;
    }

    try {
      setActionLoading(true);

      const result = await sendToConfirmStatus(selectedIds, 12);
      console.log("Confirm result:", result);

      alert(`${selectedIds.length} record(s) confirmed successfully.`);
      setSelectedIds([]);
      loadAccAcounts();
    } catch (error) {
      console.log("Confirm error:", error);
      alert("Unable to confirm records.");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // ✅ REJECT HANDLER (code = 13)
  // =========================================================
  const handleReject = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one record to reject.");
      return;
    }

    try {
      setActionLoading(true);

      const result = await sendToConfirmStatus(selectedIds, 13);
      console.log("Reject result:", result);

      alert(`${selectedIds.length} record(s) rejected successfully.`);
      setSelectedIds([]);
      loadAccAcounts();
    } catch (error) {
      console.log("Reject error:", error);
      alert("Unable to reject records.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header mb-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap">

          <div>

            <h2 className="page-title mb-1">

              <i className="bi bi-person-vcard-fill text-primary me-2"></i>

              Admission Consultant

            </h2>

            <p className="page-subtitle mb-0">
              Manage and view all admission consultant records
            </p>

          </div>

        </div>


        {/* Breadcrumb */}

        <nav className="mt-3">

          <ol className="breadcrumb mb-0">

            <li className="breadcrumb-item">

              <a
                href="/dashboard"
                className="text-decoration-none"
              >

                <i className="bi bi-house-door me-1"></i>

                Dashboard

              </a>

            </li>

            <li className="breadcrumb-item active">
              Admission Consultant
            </li>

          </ol>

        </nav>

      </div>


      {/* =====================================================
          MAIN SECTION
      ====================================================== */}

      <section className="section">

        <div className="card consultant-card border-0">


          {/* =================================================
              CARD HEADER
          ================================================== */}

          <div className="card-header consultant-header">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div>

                <h5 className="consultant-title mb-1">

                  <i className="bi bi-list-ul text-primary me-2"></i>

                  Consultant List

                </h5>


                <span className="total-text">

                  Total{" "}

                  <strong>
                    {totalRecords}
                  </strong>{" "}

                  consultant
                  {totalRecords !== 1 ? "s" : ""}

                </span>

              </div>

              {/* ✅ REJECT + CONFIRM BUTTONS */}
              <div className="header-action-buttons">

                <button
                  type="button"
                  className="btn confirm-btn btn-success"
                  disabled={actionLoading || selectedIds.length === 0}
                  onClick={handleConfirm}
                >
                  {actionLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Confirm ({selectedIds.length})
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn reject-btn btn-danger mx-3"
                  disabled={actionLoading || selectedIds.length === 0}
                  onClick={handleReject}
                >
                  {actionLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle me-2"></i>
                      Reject ({selectedIds.length})
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              TOP TOOLBAR
          ================================================== */}

          <div className="table-toolbar">


            {/* ================= SEARCH ================= */}

            <div className="search-wrapper">

              <div className="search-box">

                <i className="bi bi-search search-icon"></i>

                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search code, name..."
                  value={search}
                  onChange={handleSearch}
                />

                {search && (

                  <button
                    type="button"
                    className="clear-search"
                    onClick={clearSearch}
                    title="Clear Search"
                  >

                    <i className="bi bi-x-circle-fill"></i>

                  </button>

                )}

              </div>

            </div>


            {/* ================= PAGE SIZE ================= */}

            <div className="page-size-wrapper">

              <span className="page-size-label">
                Show
              </span>

              <select
                className="form-select page-size-select"
                value={pageSize}
                onChange={handlePageSize}
              >

                <option value="10">
                  10
                </option>

                <option value="25">
                  25
                </option>

                <option value="50">
                  50
                </option>

                <option value="100">
                  100
                </option>

              </select>

              <span className="page-size-label">
                entries
              </span>

            </div>

          </div>


          {/* =================================================
              TABLE
          ================================================== */}

          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table consultant-table mb-0">

                <thead>

                  <tr>

                    <th className="serial-column">
                      #
                    </th>

                    {/* ✅ CHECKBOX HEADER */}
                    <th className="checkbox-column">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={
                          data.length > 0 &&
                          selectedIds.length === data.length
                        }
                        onChange={toggleSelectAll}
                        disabled={loading || data.length === 0}
                      />
                    </th>

                    <th>
                      Consultant
                    </th>

                    <th>
                      Contact Person
                    </th>

                    <th>
                      Mobile No
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Login Details
                    </th>

                    <th className="action-column">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {/* =================================================
                      LOADING
                  ================================================== */}

                  {loading ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="loading-cell"
                      >

                        <div
                          className="spinner-border text-primary"
                          role="status"
                        ></div>

                        <div className="loading-text">
                          Loading consultants...
                        </div>

                      </td>

                    </tr>

                  ) : data.length === 0 ? (


                    /* =================================================
                       EMPTY
                    ================================================== */

                    <tr>

                      <td
                        colSpan="8"
                        className="empty-cell"
                      >

                        <div className="empty-icon">

                          <i className="bi bi-person-x"></i>

                        </div>

                        <h5 className="empty-title">
                          No Consultants Found
                        </h5>

                        <p className="empty-text">
                          No records match your search.
                        </p>

                        {search && (

                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mt-2"
                            onClick={clearSearch}
                          >

                            <i className="bi bi-x-circle me-1"></i>

                            Clear Search

                          </button>

                        )}

                      </td>

                    </tr>

                  ) : (


                    /* =================================================
                       DATA
                    ================================================== */

                    data.map((item, index) => (

                      <tr key={item.id}>


                        {/* ================= SERIAL ================= */}

                        <td>

                          <span className="serial-number">

                            {(pageNo - 1) * pageSize +
                              index +
                              1}

                          </span>

                        </td>

                        {/* ✅ CHECKBOX */}
                        <td className="checkbox-column">

                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                          />

                        </td>


                        {/* ================= CONSULTANT ================= */}

                        <td>

                          <div className="consultant-info">

                            <div>

                              <div className="consultant-name">

                                {item.name || "-"}

                              </div>

                              <div className="consultant-role">

                                Admission Consultant

                              </div>

                            </div>

                          </div>

                        </td>


                        {/* ================= CONTACT PERSON ================= */}

                        <td>

                          <div className="contact-person">

                            {item.fatherName || "-"}

                          </div>

                        </td>


                        {/* ================= MOBILE ================= */}

                        <td>

                          <div className="mobile-info">

                            <div className="mobile-icon">

                              <i className="bi bi-telephone-fill"></i>

                            </div>

                            <span>
                              {item.mobileNo || "-"}
                            </span>

                          </div>

                        </td>


                        {/* ================= LOCATION ================= */}

                        <td>

                          <div className="location-info">


                            <div className="location-icon">

                              <i className="bi bi-geo-alt-fill"></i>

                            </div>


                            <div>

                              <div className="city-name">

                                {item.cityName || "-"}

                              </div>

                              <div className="location-sub">

                                {item.districtName || ""}

                                {item.districtName &&
                                  item.stateName
                                  ? ", "
                                  : ""}

                                {item.stateName || ""}

                              </div>

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            LOGIN DETAILS
                        ================================================== */}

                        <td>

                          <div className="login-details">


                            {/* Username */}

                            <div className="login-item">

                              <div className="login-label">

                                <i className="bi bi-person-circle"></i>

                                Username

                              </div>

                              <div className="login-value">

                                {item.userName || "-"}

                              </div>

                            </div>


                            {/* Password */}

                            <div className="login-item">

                              <div className="login-label password-label">

                                <i className="bi bi-key-fill"></i>

                                Password

                              </div>

                              <div className="login-value password-value">

                                {item.password || "-"}

                              </div>

                            </div>

                          </div>

                        </td>


                        {/* ================= ACTION ================= */}

                        <td>

                          <div className="action-buttons">


                            {/* EDIT */}

                            <button
                              type="button"
                              className="action-btn edit-btn"
                              title="Edit"
                              onClick={() =>
                                handleEdit(item.id)
                              }
                            >

                              <i className="bi bi-pencil-square"></i>

                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              className="action-btn delete-btn"
                              title="Delete"
                              onClick={() =>
                                openDeleteModal(
                                  item.id,
                                  item.name
                                )
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

          </div>


          {/* =================================================
              BOTTOM PAGINATION
          ================================================== */}

          <div className="table-footer">


            {/* ================= RECORD INFO ================= */}

            <div className="record-info">

              Showing{" "}

              <strong>
                {startRecord}
              </strong>

              {" "}to{" "}

              <strong>
                {endRecord}
              </strong>

              {" "}of{" "}

              <strong>
                {totalRecords}
              </strong>

              {" "}records

            </div>


            {/* ================= PAGINATION ================= */}

            <div className="bottom-pagination">


              {/* PREVIOUS */}

              <button
                type="button"
                className="pagination-btn"
                disabled={
                  pageNo <= 1 ||
                  loading
                }
                onClick={() =>
                  setPageNo(
                    (prev) => prev - 1
                  )
                }
              >

                <i className="bi bi-chevron-left"></i>

                <span>
                  Previous
                </span>

              </button>


              {/* PAGE NUMBERS */}

              <div className="page-numbers">
                {Array.from(
                  { length: Math.min(6, totalPages - pageNo + 1) },
                  (_, index) => pageNo + index
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`page-number-btn ${pageNo === page ? "active" : ""
                      }`}
                    disabled={loading}
                    onClick={() => setPageNo(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>


              <span className="page-of">

                of {totalPages || 1}

              </span>


              {/* NEXT */}

              <button
                type="button"
                className="pagination-btn"
                disabled={
                  pageNo >= totalPages ||
                  totalPages === 0 ||
                  loading
                }
                onClick={() =>
                  setPageNo(
                    (prev) => prev + 1
                  )
                }
              >

                <span>
                  Next
                </span>

                <i className="bi bi-chevron-right"></i>

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {showDeleteModal && (

        <div
          className="custom-modal-overlay"
          onClick={closeDeleteModal}
        >

          <div
            className="delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* DELETE ICON */}

            <div className="delete-icon-wrapper">

              <div className="delete-icon">

                <i className="bi bi-trash3-fill"></i>

              </div>

            </div>


            {/* CONTENT */}

            <div className="delete-content">

              <h4>
                Delete Consultant?
              </h4>

              <p>
                Are you sure you want to delete
              </p>

              <div className="delete-name">

                "{deleteName || "this consultant"}"

              </div>


              <div className="delete-warning">

                <i className="bi bi-exclamation-triangle-fill"></i>

                <span>
                  This action cannot be undone.
                </span>

              </div>

            </div>


            {/* FOOTER */}

            <div className="delete-modal-footer">


              {/* CANCEL */}

              <button
                type="button"
                className="btn cancel-btn"
                disabled={deleteLoading}
                onClick={closeDeleteModal}
              >

                <i className="bi bi-x-lg me-2"></i>

                Cancel

              </button>


              {/* DELETE */}

              <button
                type="button"
                className="btn confirm-delete-btn"
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

      <style>{`

/* =========================================================
   PAGE HEADER
========================================================= */

.page-header {
  padding: 5px 2px;
}

.page-title {
  font-size: 25px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.4px;
}

.page-title i {
  font-size: 23px;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px;
}


/* =========================================================
   MAIN SECTION
========================================================= */

.section {
  display: block !important;

  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;

  overflow-x: hidden !important;
}


/* =========================================================
   CARD
========================================================= */

.consultant-card {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;

  border: 1px solid #e8edf3 !important;
  border-radius: 16px !important;

  background: #ffffff;

  overflow: hidden !important;

  position: relative;

  box-shadow:
    0 4px 18px rgba(15, 23, 42, 0.055);
}


/* =========================================================
   CARD HEADER
========================================================= */

.consultant-header {
  background: #ffffff;

  padding: 20px 24px;

  border-bottom: 1px solid #edf0f4;
}

.consultant-title {
  font-size: 18px;

  font-weight: 700;

  color: #1e293b;

  letter-spacing: -0.2px;
}

.consultant-title i {
  font-size: 17px;
}

.total-text {
  color: #94a3b8;

  font-size: 13px;
}

.total-text strong {
  color: #334155;

  font-weight: 700;
}


/* =========================================================
   TOP TOOLBAR
========================================================= */

.table-toolbar {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;

  box-sizing: border-box;

  padding: 17px 24px;

  background: #ffffff;

  border-bottom: 1px solid #edf0f4;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  overflow: hidden !important;
}


/* =========================================================
   SEARCH
========================================================= */

.search-wrapper {
  width: 320px;

  max-width: 100%;
}

.search-box {
  position: relative;

  width: 100%;
}

.search-input {
  height: 40px;

  padding-left: 40px;
  padding-right: 40px;

  border: 1px solid #e2e8f0;

  border-radius: 9px;

  background: #f8fafc;

  color: #334155;

  font-size: 13px;

  box-shadow: none !important;

  transition: all .2s ease;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  border-color: #93c5fd;

  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.08) !important;
}

.search-icon {
  position: absolute;

  left: 14px;

  top: 50%;

  transform: translateY(-50%);

  color: #94a3b8;

  font-size: 14px;

  z-index: 2;
}

.clear-search {
  position: absolute;

  right: 10px;

  top: 50%;

  transform: translateY(-50%);

  width: 25px;
  height: 25px;

  border: 0;

  background: transparent;

  color: #94a3b8;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  transition: all .2s ease;
}

.clear-search:hover {
  color: #dc3545;
}


/* =========================================================
   PAGE SIZE
========================================================= */

.page-size-wrapper {
  display: flex;

  align-items: center;

  gap: 8px;

  color: #64748b;

  font-size: 13px;

  white-space: nowrap;
}

.page-size-label {
  color: #64748b;

  font-size: 13px;
}

.page-size-select {
  width: 75px;

  height: 38px;

  border: 1px solid #e2e8f0;

  border-radius: 8px;

  color: #334155;

  background-color: #ffffff;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  box-shadow: none !important;
}

.page-size-select:focus {
  border-color: #93c5fd;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, .08) !important;
}


/* =========================================================
   CARD BODY
========================================================= */

.consultant-card > .card-body {
  display: block !important;

  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;

  padding: 0 !important;

  overflow: hidden !important;
}


/* =========================================================
   TABLE RESPONSIVE — only this area scrolls
========================================================= */

.consultant-card
> .card-body
> .table-responsive {

  display: block !important;

  width: 0 !important;

  min-width: 100% !important;

  max-width: 100% !important;

  box-sizing: border-box !important;

  overflow-x: auto !important;

  overflow-y: hidden !important;

  position: relative !important;

  -webkit-overflow-scrolling: touch;

  scrollbar-gutter: stable;
}


/* =========================================================
   TABLE — AUTO WIDTH + AUTO HEIGHT
========================================================= */

.consultant-card
> .card-body
> .table-responsive
> .consultant-table {

  display: table !important;

  width: auto !important;

  min-width: 100% !important;

  max-width: none !important;

  margin: 0 !important;

  table-layout: auto !important;

  border-collapse: separate;

  border-spacing: 0;
}


/* =========================================================
   TABLE HEADER — height auto
========================================================= */

.consultant-table thead th {

  background: #f8fafc;

  color: #64748b;

  font-size: 11px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: .55px;

  padding: 14px;

  border-bottom: 1px solid #e2e8f0;

  white-space: nowrap;

  vertical-align: middle;
}


/* =========================================================
   TABLE BODY — height auto
========================================================= */

.consultant-table tbody td {

  padding: 15px 14px;

  border-bottom: 1px solid #f1f5f9;

  color: #334155;

  font-size: 13px;

  vertical-align: middle;

  background: #ffffff;

  white-space: nowrap;
}

.consultant-table tbody tr {

  transition:
    background-color .18s ease;
}

.consultant-table tbody tr:hover td {

  background: #f8fbff;
}


/* =========================================================
   LAST ROW BORDER
========================================================= */

.consultant-table tbody tr:last-child td {
  border-bottom: 0;
}


/* =========================================================
   CHECKBOX COLUMN
========================================================= */

.checkbox-column {
  text-align: center;
}

.checkbox-column .form-check-input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}


/* =========================================================
   SERIAL NUMBER
========================================================= */

.serial-column {
  padding-left: 24px !important;
}

.serial-number {

  width: 30px;
  height: 30px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  background: #f1f5f9;

  color: #64748b;

  border-radius: 8px;

  font-size: 12px;

  font-weight: 600;
}


/* =========================================================
   CODE BADGE
========================================================= */

.code-badge {

  display: inline-flex;

  align-items: center;

  background: #eff6ff;

  color: #2563eb;

  border: 1px solid #dbeafe;

  padding: 6px 10px;

  border-radius: 7px;

  font-size: 12px;

  font-weight: 700;

  white-space: nowrap;
}

.authority-letter {

  display: inline-flex;

  align-items: center;

  background: #eff6ff;

  color: #2563eb;

  border: 1px solid #dbeafe;

  padding: 6px 10px;

  border-radius: 7px;

  font-size: 12px;

  font-weight: 700;

  white-space: nowrap;
}


/* =========================================================
   CONSULTANT INFO
========================================================= */

.consultant-info {

  display: flex;

  align-items: center;
}

.consultant-name {

  color: #1e293b;

  font-weight: 700;

  font-size: 14px;

  white-space: nowrap;
}

.consultant-role {

  color: #94a3b8;

  font-size: 11px;

  margin-top: 2px;
}


/* =========================================================
   CONTACT PERSON
========================================================= */

.contact-person {

  font-weight: 500;

  color: #475569;

  white-space: nowrap;
}


/* =========================================================
   MOBILE
========================================================= */

.mobile-info {

  display: flex;

  align-items: center;

  gap: 8px;

  white-space: nowrap;
}

.mobile-icon {

  width: 30px;
  height: 30px;

  min-width: 30px;

  border-radius: 8px;

  background: #eff6ff;

  color: #2563eb;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 11px;
}


/* =========================================================
   LOCATION
========================================================= */

.location-info {

  display: flex;

  align-items: flex-start;
}

.location-icon {

  width: 30px;
  height: 30px;

  min-width: 30px;

  border-radius: 8px;

  background: #fff1f2;

  color: #ef4444;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-right: 9px;

  font-size: 12px;
}

.city-name {

  color: #334155;

  font-weight: 600;

  font-size: 13px;

  white-space: nowrap;
}

.location-sub {

  color: #94a3b8;

  font-size: 11px;

  margin-top: 2px;

  white-space: nowrap;
}


/* =========================================================
   LOGIN DETAILS
========================================================= */

.login-details {

  min-width: 175px;
}

.login-item {

  display: flex;

  flex-direction: column;

  gap: 3px;
}

.login-item + .login-item {

  margin-top: 9px;
}

.login-label {

  display: flex;

  align-items: center;

  color: #94a3b8;

  font-size: 10px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: .4px;
}

.login-label i {

  color: #2563eb;

  margin-right: 6px;

  font-size: 11px;
}

.password-label i {

  color: #f59e0b;
}

.login-value {

  padding-left: 17px;

  color: #334155;

  font-size: 13px;

  font-weight: 600;

  word-break: break-word;
}

.password-value {

  color: #dc3545;

  font-family: monospace;

  font-weight: 700;

  letter-spacing: .3px;
}


/* =========================================================
   ACTION
========================================================= */

.action-column {

  text-align: center;
}

.action-buttons {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;
}

.action-btn {

  width: 35px;
  height: 35px;

  min-width: 35px;

  border: 0;

  border-radius: 8px;

  display: flex;

  align-items: center;

  justify-content: center;

  transition: all .2s ease;

  cursor: pointer;
}

.edit-btn {

  background: #eff6ff;

  color: #2563eb;
}

.edit-btn:hover {

  background: #2563eb;

  color: #ffffff;

  transform: translateY(-2px);

  box-shadow:
    0 4px 10px rgba(37,99,235,.2);
}

.delete-btn {

  background: #fff1f2;

  color: #dc3545;
}

.delete-btn:hover {

  background: #dc3545;

  color: #ffffff;

  transform: translateY(-2px);

  box-shadow:
    0 4px 10px rgba(220,53,69,.2);
}


/* =========================================================
   TABLE SCROLLBAR
========================================================= */

.consultant-card
> .card-body
> .table-responsive::-webkit-scrollbar {

  height: 9px;
}

.consultant-card
> .card-body
> .table-responsive::-webkit-scrollbar-track {

  background: #f1f5f9;

  border-top: 1px solid #e2e8f0;
}

.consultant-card
> .card-body
> .table-responsive::-webkit-scrollbar-thumb {

  background: #cbd5e1;

  border-radius: 10px;

  border: 2px solid #f1f5f9;
}

.consultant-card
> .card-body
> .table-responsive::-webkit-scrollbar-thumb:hover {

  background: #94a3b8;
}


/* Firefox */

.consultant-card
> .card-body
> .table-responsive {

  scrollbar-width: thin;

  scrollbar-color:
    #cbd5e1
    #f1f5f9;
}


/* =========================================================
   LOADING
========================================================= */

.loading-cell {

  height: 300px;

  text-align: center;
}

.loading-text {

  color: #64748b;

  margin-top: 10px;

  font-size: 13px;
}


/* =========================================================
   EMPTY STATE
========================================================= */

.empty-cell {

  height: 300px;

  text-align: center;
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

.empty-title {

  color: #334155;

  font-size: 16px;

  margin-top: 15px;
}

.empty-text {

  color: #94a3b8;

  font-size: 13px;

  margin-bottom: 0;
}


/* =========================================================
   FOOTER
========================================================= */

.table-footer {

  width: 100% !important;

  max-width: 100% !important;

  min-width: 0 !important;

  box-sizing: border-box;

  padding: 17px 24px;

  background: #ffffff;

  border-top: 1px solid #edf0f4;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  overflow: hidden !important;
}

.record-info {

  color: #94a3b8;

  font-size: 13px;
}

.record-info strong {

  color: #334155;
}


/* =========================================================
   PAGINATION
========================================================= */

.bottom-pagination {

  display: flex;

  align-items: center;

  gap: 8px;
}

.pagination-btn {

  height: 38px;

  padding: 0 14px;

  border: 1px solid #e2e8f0;

  background: #ffffff;

  color: #475569;

  border-radius: 8px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  font-size: 13px;

  font-weight: 500;

  transition: all .2s ease;

  white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {

  background: #0d6efd;

  border-color: #0d6efd;

  color: #ffffff;

  box-shadow:
    0 3px 8px rgba(13,110,253,.15);
}

.pagination-btn:disabled {

  opacity: .45;

  cursor: not-allowed;
}

.page-of {

  color: #64748b;

  font-size: 13px;

  margin-right: 4px;

  white-space: nowrap;
}


/* =========================================================
   DELETE MODAL
========================================================= */

.custom-modal-overlay {

  position: fixed;

  inset: 0;

  background:
    rgba(15, 23, 42, .65);

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

  max-width: 420px;

  background: #ffffff;

  border-radius: 18px;

  overflow: hidden;

  box-shadow:
    0 25px 70px rgba(0,0,0,.25);

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

  font-size: 29px;
}

.delete-content {

  text-align: center;

  padding: 0 25px 20px;
}

.delete-content h4 {

  color: #1e293b;

  font-weight: 700;

  margin-bottom: 8px;
}

.delete-content p {

  color: #64748b;

  margin-bottom: 5px;

  font-size: 14px;
}

.delete-name {

  color: #334155;

  font-weight: 700;

  font-size: 15px;

  margin-bottom: 18px;
}

.delete-warning {

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

.delete-modal-footer {

  padding: 18px 25px 25px;

  display: flex;

  justify-content: center;

  gap: 10px;

  border-top: 1px solid #f1f5f9;
}

.cancel-btn {

  min-width: 110px;

  background: #f1f5f9;

  color: #475569;

  border-radius: 8px;
}

.cancel-btn:hover {

  background: #e2e8f0;
}

.confirm-delete-btn {

  min-width: 130px;

  background: #dc3545;

  color: #ffffff;

  border-radius: 8px;
}

.confirm-delete-btn:hover {

  background: #bb2d3b;

  color: #ffffff;
}


/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes fadeIn {

  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }

}

@keyframes modalSlide {

  from {

    opacity: 0;

    transform:
      translateY(20px)
      scale(.97);
  }

  to {

    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }

}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 768px) {

  .page-title {
    font-size: 21px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .consultant-header {
    padding: 17px 15px;
  }

  .table-toolbar {

    flex-direction: column;

    align-items: stretch;

    padding: 15px;

    gap: 12px;
  }

  .search-wrapper {

    width: 100%;
  }

  .page-size-wrapper {

    justify-content: flex-end;
  }

  .table-footer {

    flex-direction: column;

    align-items: center;

    padding: 15px;
  }

  .record-info {

    text-align: center;
  }

  .bottom-pagination {

    justify-content: center;
  }

  .consultant-card
  > .card-body
  > .table-responsive {

    width: 0 !important;

    min-width: 100% !important;

    max-width: 100% !important;

    overflow-x: auto !important;
  }

  .consultant-card
  > .card-body
  > .table-responsive
  > .consultant-table {

    width: auto !important;

    min-width: 100% !important;

    max-width: none !important;
  }

}


@media (max-width: 480px) {

  .page-size-label {
    display: none;
  }

  .page-size-select {
    width: 70px;
  }

  .pagination-btn {

    padding: 0 10px;

    height: 36px;
  }

}


/* =========================================================
   FINAL GLOBAL SAFETY
========================================================= */

html,
body,
#root {

  width: 100% !important;

  max-width: 100% !important;

  overflow-x: hidden !important;
}


/* =========================================================
   paging number
   ========================================================= */
.page-numbers {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-number-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #dfe3eb;
  background: #fff;
  color: #344054;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
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

`}</style>

    </>
  );
}

export default AccPendingList;