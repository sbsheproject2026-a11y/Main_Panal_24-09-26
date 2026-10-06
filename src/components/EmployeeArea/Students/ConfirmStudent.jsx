import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GetConfirmAddmissions,

} from "../../AllServicesFiles/AdminStudentService";
import { FILE_URL } from "../../api";
import { GetEmpConfirmAddmissions } from "../../AllServicesFiles/StudentService";

function ConfirmStudent() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, [pageNo, pageSize, search]);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const result = await GetEmpConfirmAddmissions(
        pageNo,
        pageSize,
        search
      );

      const response = result?.data;

      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
    } catch (error) {
      console.log("Error loading students:", error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  const startRecord =
    totalRecords === 0
      ? 0
      : (pageNo - 1) * pageSize + 1;

  const endRecord =
    totalRecords === 0
      ? 0
      : Math.min(pageNo * pageSize, totalRecords);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNo(1);
  };

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPageNo(1);
  };

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

  const openDocumentModal = (student) => {
    setSelectedStudent(student);
    setDocumentModalOpen(true);
  };

  const closeDocumentModal = () => {
    setDocumentModalOpen(false);
    setSelectedStudent(null);
  };

  const openDocument = (url) => {
    closeDocumentModal();
    navigate(url);
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

        .confirm-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .confirm-page .section,
        .confirm-page .card,
        .confirm-page .card-header,
        .confirm-page .card-body {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .confirm-toolbar,
        .confirm-record-info {
          min-width: 0;
          max-width: 100%;
        }

        /* ============================================
           TABLE WRAPPER — only this area scrolls
           ============================================ */

        .confirm-table-wrapper {
          width: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          position: relative;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          scrollbar-gutter: stable;
          contain: inline-size;
        }

        /* ============================================
           TABLE — AUTO WIDTH + AUTO HEIGHT
           ============================================ */

        .confirm-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
        }

        .confirm-table th,
        .confirm-table td {
          box-sizing: border-box;
        }

        /* Header — auto width, auto height */
        .confirm-table th {
          white-space: nowrap;
        }

        /* Body — auto width, auto height */
        .confirm-table td {
          white-space: nowrap;
        }

        .confirm-cell {
          display: block;
          white-space: nowrap;
        }

        .confirm-father-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .confirm-father-text {
          white-space: nowrap;
        }

        .confirm-badge {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }

        .confirm-document-btn {
          white-space: nowrap;
        }

        .confirm-modal {
          max-width: 100vw;
        }

        .confirm-modal .modal-content {
          max-width: 100%;
        }

        .confirm-document-grid {
          min-width: 0;
        }

        .confirm-document-grid > div {
          min-width: 0;
        }

        .confirm-document-button {
          min-width: 0;
          max-width: 100%;
        }

        .confirm-document-button .confirm-document-text {
          min-width: 0;
        }

        .confirm-table-wrapper::-webkit-scrollbar {
          height: 8px;
        }

        .confirm-table-wrapper::-webkit-scrollbar-track {
          background: #f1f3f7;
          border-radius: 10px;
        }

        .confirm-table-wrapper::-webkit-scrollbar-thumb {
          background: #c9ced8;
          border-radius: 10px;
        }

        .confirm-table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #aeb5c2;
        }

        @media (max-width: 768px) {
          .confirm-table-wrapper {
            width: 0 !important;
            min-width: 100% !important;
            max-width: 100% !important;
          }

          .confirm-table {
            width: auto !important;
            min-width: 100% !important;
            max-width: none !important;
          }

          .confirm-page .card-header,
          .confirm-page .card-body {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }

          .confirm-page .modal-dialog {
            margin: 10px;
          }
        }

         
      `}</style>

      <div className="confirm-page">
        <section className="section">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "20px",
              overflow: "hidden"
            }}
          >
            <div
              className="card-header border-0 px-4 py-4"
              style={{
                background:
                  "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)"
              }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    <span
                      className="d-inline-flex align-items-center justify-content-center me-2"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "11px",
                        background: "#eef1ff",
                        color: "#4154f1"
                      }}
                    >
                      <i className="bi bi-person-check-fill"></i>
                    </span>
                    Confirmed Students
                  </h5>

                  <p className="text-muted mb-0 small">
                    Manage confirmed student records and print documents
                  </p>
                </div>

                <div
                  className="px-3 py-2 rounded-pill"
                  style={{
                    background: "#eaf8f0",
                    color: "#198754",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                >
                  <i className="bi bi-check-circle-fill me-1"></i>
                  {totalRecords} TOTAL CONFIRMED
                </div>
              </div>
            </div>

            <div className="confirm-toolbar px-4 pt-4">
              <div className="row g-3 align-items-center">
                <div className="col-lg-6">
                  <div className="d-flex align-items-center">
                    <span className="text-muted small me-2">
                      Show
                    </span>

                    <select
                      value={pageSize}
                      onChange={handlePageSize}
                      className="form-select shadow-none"
                      style={{
                        width: "85px",
                        height: "42px",
                        borderRadius: "10px"
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>

                    <span className="text-muted small ms-2">
                      entries
                    </span>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div
                    className="position-relative ms-lg-auto"
                    style={{
                      maxWidth: "350px"
                    }}
                  >
                    <i
                      className="bi bi-search position-absolute"
                      style={{
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#899bbd"
                      }}
                    ></i>

                    <input
                      type="text"
                      value={search}
                      onChange={handleSearch}
                      placeholder="Search by name, enrollment..."
                      className="form-control shadow-none ps-5"
                      style={{
                        height: "44px",
                        borderRadius: "12px",
                        border: "1px solid #e1e5eb"
                      }}
                    />

                    {search && (
                      <button
                        type="button"
                        className="btn position-absolute p-0"
                        onClick={() => {
                          setSearch("");
                          setPageNo(1);
                        }}
                        style={{
                          right: "13px",
                          top: "50%",
                          transform: "translateY(-50%)"
                        }}
                      >
                        <i className="bi bi-x-circle-fill text-muted"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="confirm-record-info px-4 pt-4">
              <div
                className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-3 py-3"
                style={{
                  background: "#f8f9fc",
                  borderRadius: "12px"
                }}
              >
                <div className="small text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Showing{" "}
                  <strong className="text-dark">
                    {startRecord}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-dark">
                    {endRecord}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-dark">
                    {totalRecords}
                  </strong>{" "}
                  students
                </div>

                {search && (
                  <div
                    className="small fw-semibold"
                    style={{
                      color: "#4154f1"
                    }}
                  >
                    <i className="bi bi-search me-1"></i>
                    Search: "{search}"
                  </div>
                )}
              </div>
            </div>

            <div className="card-body px-4 pt-3">
              <div
                className="confirm-table-wrapper"
                style={{
                  border: "1px solid #edf0f5",
                  borderRadius: "15px"
                }}
              >
                <table className="table align-middle mb-0 confirm-table">
                  <thead
                    style={{
                      background: "#f8f9fc"
                    }}
                  >
                    <tr>
                      <th className="ps-4 py-3 text-muted small fw-bold">
                        #
                      </th>

                      <th className="py-3 text-muted small fw-bold">
                        DOCUMENTS
                      </th>

                      <th className="py-3 text-muted small fw-bold">
                        STUDENT
                      </th>

                      <th className="py-3 text-muted small fw-bold">
                        ENROLLMENT NO
                      </th>

                      <th className="py-3 text-muted small fw-bold">
                        FATHER NAME
                      </th>

                      <th className="py-3 text-muted small fw-bold">
                        CONTACT
                      </th>

                      <th className="py-3 text-muted small fw-bold">
                        ADDRESS
                      </th>

                      <th className="py-3 pe-4 text-muted small fw-bold">
                        CITY
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-5"
                        >
                          <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                          ></div>

                          <div className="text-muted">
                            Loading students...
                          </div>
                        </td>
                      </tr>
                    ) : data.length > 0 ? (
                      data.map((item, index) => (
                        <tr
                          key={item.id}
                          style={{
                            transition: "all .2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "#fafbff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "#fff";
                          }}
                        >
                          <td className="ps-4">
                            <span
                              className="d-inline-flex align-items-center justify-content-center fw-semibold"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "10px",
                                background: "#eef1ff",
                                color: "#4154f1",
                                fontSize: "13px"
                              }}
                            >
                              {(pageNo - 1) *
                                pageSize +
                                index +
                                1}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              onClick={() =>
                                openDocumentModal(item)
                              }
                              className="btn btn-sm confirm-document-btn"
                              style={{
                                borderRadius: "10px",
                                background: "#eef4ff",
                                color: "#0d6efd",
                                border:
                                  "1px solid #d7e5ff",
                                fontWeight: "600"
                              }}
                            >
                              <i className="bi bi-file-earmark-text me-1"></i>
                              Documents
                            </button>
                          </td>

                          <td>
                            <div
                              className="d-flex align-items-center"
                              style={{
                                minWidth: 0
                              }}
                            >
                              <div className="confirm-cell fw-semibold text-dark">
                                {item.name || "-"}
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className="badge rounded-pill px-3 py-2 confirm-badge"
                              style={{
                                background: "#eef7ff",
                                color: "#0d6efd",
                                fontWeight: "600"
                              }}
                            >
                              <i className="bi bi-card-text me-1"></i>
                              {item.enrollmentNo || "-"}
                            </span>
                          </td>

                          <td>
                            <div className="confirm-father-cell">
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  width: "34px",
                                  height: "34px",
                                  minWidth: "34px",
                                  borderRadius: "10px",
                                  background: "#fff4df",
                                  color: "#f59e0b"
                                }}
                              >
                                <i className="bi bi-person-fill"></i>
                              </div>

                              <span className="confirm-father-text text-dark">
                                {item.fatherName || "-"}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="confirm-cell fw-semibold text-dark">
                              {item.mobileNo || "-"}
                            </div>
                          </td>

                          <td>
                            <div className="confirm-cell text-dark">
                              {item.address || "-"}
                            </div>
                          </td>

                          <td className="pe-4">
                            <span
                              className="badge rounded-pill px-3 py-2 confirm-badge"
                              style={{
                                background: "#f1f8f5",
                                color: "#198754",
                                fontWeight: "600"
                              }}
                            >
                              <i className="bi bi-building me-1"></i>
                              {item.cityName || "-"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-5"
                        >
                          <div>
                            <div
                              className="mx-auto d-flex align-items-center justify-content-center mb-3"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "22px",
                                background: "#f1f3f9"
                              }}
                            >
                              <i
                                className="bi bi-people text-muted"
                                style={{
                                  fontSize: "34px"
                                }}
                              ></i>
                            </div>

                            <h5 className="fw-bold mb-1">
                              No Students Found
                            </h5>

                            <p className="text-muted mb-0">
                              No confirmed student records
                              match your search.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <div className="small text-muted">
                    Page{" "}
                    <strong className="text-dark">
                      {pageNo}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-dark">
                      {totalPages}
                    </strong>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <button
                      type="button"
                      className="btn btn-light border"
                      disabled={pageNo === 1}
                      onClick={handlePrevious}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px"
                      }}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>

                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setPageNo(page)}
                        className={
                          pageNo === page
                            ? "btn btn-primary"
                            : "btn btn-light border"
                        }
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          fontWeight:
                            pageNo === page
                              ? "600"
                              : "400"
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="btn btn-light border"
                      disabled={pageNo === totalPages}
                      onClick={handleNext}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px"
                      }}
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

      {documentModalOpen && selectedStudent && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              backgroundColor: "rgba(15,23,42,.70)",
              backdropFilter: "blur(4px)"
            }}
          ></div>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="modal-dialog modal-dialog-centered confirm-modal"
              style={{
                maxWidth: "720px"
              }}
            >
              <div
                className="modal-content border-0 shadow-lg"
                style={{
                  borderRadius: "22px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    height: "5px",
                    background:
                      "linear-gradient(90deg,#4154f1,#8b5cf6)"
                  }}
                ></div>

                <div className="modal-header border-0 px-4 pt-4 pb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "15px",
                        background: "#eef1ff",
                        color: "#4154f1"
                      }}
                    >
                      <i
                        className="bi bi-folder2-open"
                        style={{
                          fontSize: "24px"
                        }}
                      ></i>
                    </div>

                    <div>
                      <h5 className="fw-bold mb-1">
                        Student Documents
                      </h5>

                      <small className="text-muted">
                        Select a document to view or print
                      </small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDocumentModal}
                  ></button>
                </div>

                <div className="modal-body px-4 pt-2">
                  <div
                    className="p-3 mb-4"
                    style={{
                      background: "#f8f9fc",
                      borderRadius: "15px",
                      border: "1px solid #edf0f5"
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`${FILE_URL}${selectedStudent.selfImageShow}`}
                        alt="Student"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(
                              selectedStudent.name || "Student"
                            );
                        }}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "15px"
                        }}
                      />

                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">
                          {selectedStudent.name || "-"}
                        </h6>

                        <div className="d-flex gap-2 flex-wrap">
                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "#eef7ff",
                              color: "#0d6efd"
                            }}
                          >
                            Enrollment:{" "}
                            {selectedStudent.enrollmentNo || "-"}
                          </span>

                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "#f3efff",
                              color: "#6f42c1"
                            }}
                          >
                            Roll 1:{" "}
                            {selectedStudent.rollno || "-"}
                          </span>

                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "#fff4df",
                              color: "#997404"
                            }}
                          >
                            Roll 2:{" "}
                            {selectedStudent.rollNo1 || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 confirm-document-grid">
                    <div className="col-md-4">
                      <DocumentButton
                        icon="bi-award-fill"
                        title="Diploma"
                        subtitle="Print Diploma"
                        color="#0d6efd"
                        bg="#f5f9ff"
                        onClick={() =>
                          openDocument(
                            `/diploma-print/${selectedStudent.id}`
                          )
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <DocumentButton
                        icon="bi-file-earmark-check-fill"
                        title="Migration"
                        subtitle="Print Certificate"
                        color="#198754"
                        bg="#f3fff8"
                        onClick={() =>
                          openDocument(
                            `/migration-certificate/${selectedStudent.id}`
                          )
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <DocumentButton
                        icon="bi-person-badge-fill"
                        title="ID Card"
                        subtitle="Print ID Card"
                        color="#087990"
                        bg="#f3fcff"
                        onClick={() =>
                          openDocument(
                            `/id-card/${selectedStudent.id}`
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <DocumentButton
                        icon="bi-card-text"
                        title="Admit Card 1st"
                        subtitle={
                          selectedStudent.rollno
                            ? `Roll No: ${selectedStudent.rollno}`
                            : "Roll No not available"
                        }
                        color="#997404"
                        bg="#fffdf5"
                        onClick={() =>
                          openDocument(
                            `/admit-card-print/${selectedStudent.rollno}`
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <DocumentButton
                        icon="bi-card-text"
                        title="Admit Card 2nd"
                        subtitle={
                          selectedStudent.rollNo1
                            ? `Roll No: ${selectedStudent.rollNo1}`
                            : "Roll No not available"
                        }
                        color="#997404"
                        bg="#fffdf5"
                        onClick={() =>
                          openDocument(
                            `/admit-card-print/${selectedStudent.rollNo1}`
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <DocumentButton
                        icon="bi-file-earmark-bar-graph-fill"
                        title="Marksheet 1st"
                        subtitle={
                          selectedStudent.rollno
                            ? `Roll No: ${selectedStudent.rollno}`
                            : "Roll No not available"
                        }
                        color="#6f42c1"
                        bg="#faf7ff"
                        onClick={() =>
                          openDocument(
                            `/marksheet-print/${selectedStudent.rollno}`
                          )
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <DocumentButton
                        icon="bi-file-earmark-bar-graph-fill"
                        title="Marksheet 2nd"
                        subtitle={
                          selectedStudent.rollNo1
                            ? `Roll No: ${selectedStudent.rollNo1}`
                            : "Roll No not available"
                        }
                        color="#fd7e14"
                        bg="#fff8f2"
                        onClick={() =>
                          openDocument(
                            `/marksheet-print/${selectedStudent.rollNo1}`
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 px-4 pb-4 pt-3">
                  <button
                    type="button"
                    className="btn btn-light border px-4"
                    onClick={closeDocumentModal}
                    style={{
                      borderRadius: "10px"
                    }}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Close
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

function DocumentButton({
  icon,
  title,
  subtitle,
  color,
  bg,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn w-100 text-start confirm-document-button"
      style={{
        minHeight: "105px",
        padding: "18px",
        borderRadius: "15px",
        border: `1px solid ${color}30`,
        background: bg,
        color: color,
        transition: "all .2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow =
          "0 8px 20px rgba(0,0,0,.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "12px",
            background: `${color}15`,
            flexShrink: 0
          }}
        >
          <i
            className={`bi ${icon}`}
            style={{
              fontSize: "21px"
            }}
          ></i>
        </div>

        <div className="confirm-document-text">
          <div
            className="fw-bold confirm-document-title"
            style={{
              fontSize: "14px"
            }}
          >
            {title}
          </div>

          <small
            className="text-muted confirm-document-subtitle"
            style={{
              fontSize: "12px"
            }}
          >
            {subtitle}
          </small>
        </div>
      </div>
    </button>
  );
}

export default ConfirmStudent;