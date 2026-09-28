 import React, { useEffect, useState } from "react";
import {
  getStudentSubjectMarks,
  Getunsetmarks,
  submitStudentMarks,
} from "../../AllServicesFiles/AdminStudentService";
import { FILE_URL } from "../../api";

function SetMarksStudent() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rollNo, setRollNo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [studentDetails, setStudentDetails] = useState([]);

  useEffect(() => {
    loadStudents();
  }, [pageNo, pageSize, search]);

  const loadStudents = async () => {
    try {
      const result = await Getunsetmarks(pageNo, pageSize, search);
      setData(result?.data?.data || []);
      setTotalRecords(result?.data?.totalRecords || 0);
    } catch (error) {
      console.log(error);
      setData([]);
      setTotalRecords(0);
    }
  };

  const handleRollNoClick = async (rollno) => {
    try {
      setModalOpen(true);
      setStudentDetails([]);

      const result = await getStudentSubjectMarks(rollno);
      setStudentDetails(result?.data || []);
    } catch (error) {
      console.log(error);
      setModalOpen(false);
      setStudentDetails([]);
    }
  };

  const handleSetMarks = async () => {
    if (!rollNo.trim()) {
      alert("Please enter Roll No");
      return;
    }

    await handleRollNoClick(rollNo.trim());
  };

  const handleMarksChange = (index, field, value) => {
    const updatedData = [...studentDetails];

    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    };

    setStudentDetails(updatedData);
  };

  const handleSaveMarks = async () => {
    try {
      setIsSaving(true);

      const requestData = {
        marks: studentDetails.map((item) => ({
          pid: Number(item.puId),
          sid: Number(item.subjectId),
          theoryMarks: Number(item.theoryMarks ?? 0),
          practicalMarks: Number(item.practicalMarks ?? 0),
          assignmentMarks: Number(item.assignmentMarks ?? 0),
        })),
      };

      await submitStudentMarks(requestData);

      setModalOpen(false);
      setStudentDetails([]);
      setRollNo("");

      await loadStudents();
    } catch (error) {
      console.log("Save Marks Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    if (!isSaving) {
      setModalOpen(false);
      setStudentDetails([]);
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
        totalPages,
      ];
    }

    return [
      pageNo - 2,
      pageNo - 1,
      pageNo,
      pageNo + 1,
      pageNo + 2,
    ];
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

        .setmarks-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .setmarks-page .section,
        .setmarks-page .row,
        .setmarks-page .card,
        .setmarks-page .card-body {
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .setmarks-page .card {
          width: 100%;
        }

        .setmarks-toolbar {
          min-width: 0;
          max-width: 100%;
        }

        .setmarks-search {
          min-width: 0;
          max-width: 350px;
        }

        .setmarks-table-wrapper {
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
          border: 1px solid #edf0f5;
          border-radius: 15px;
        }

        .setmarks-table {
          width: 1450px !important;
          min-width: 1450px !important;
          max-width: none !important;
          table-layout: fixed !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
        }

        .setmarks-table th,
        .setmarks-table td {
          box-sizing: border-box;
        }

        .setmarks-table th {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .setmarks-table td {
          height: 76px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .setmarks-cell {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .setmarks-roll-btn {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .setmarks-image {
          width: 58px;
          height: 58px;
          min-width: 58px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .setmarks-modal {
          max-width: 100vw;
        }

        .setmarks-modal .modal-content {
          max-width: 100%;
          min-width: 0;
        }

        .setmarks-modal-table-wrapper {
          width: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          scrollbar-gutter: stable;
          contain: inline-size;
        }

        .setmarks-modal-table {
          width: 1150px !important;
          min-width: 1150px !important;
          max-width: none !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }

        .setmarks-modal-table th,
        .setmarks-modal-table td {
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .setmarks-modal-table input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .setmarks-modal-table .setmarks-course,
        .setmarks-modal-table .setmarks-subject {
          display: block;
          width: 100%;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .setmarks-table-wrapper::-webkit-scrollbar,
        .setmarks-modal-table-wrapper::-webkit-scrollbar {
          height: 8px;
        }

        .setmarks-table-wrapper::-webkit-scrollbar-track,
        .setmarks-modal-table-wrapper::-webkit-scrollbar-track {
          background: #f1f3f7;
          border-radius: 10px;
        }

        .setmarks-table-wrapper::-webkit-scrollbar-thumb,
        .setmarks-modal-table-wrapper::-webkit-scrollbar-thumb {
          background: #c9ced8;
          border-radius: 10px;
        }

        .setmarks-table-wrapper::-webkit-scrollbar-thumb:hover,
        .setmarks-modal-table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #aeb5c2;
        }

        @media (max-width: 768px) {
          .setmarks-page .card-body {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }

          .setmarks-table-wrapper {
            width: 0 !important;
            min-width: 100% !important;
            max-width: 100% !important;
          }

          .setmarks-table {
            width: 1450px !important;
            min-width: 1450px !important;
          }

          .setmarks-modal .modal-dialog {
            margin: 10px;
          }

          .setmarks-modal .modal-body,
          .setmarks-modal .modal-header,
          .setmarks-modal .modal-footer {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
        }
      `}</style>

      <div className="setmarks-page">
        <div>
          <h1>Set Marks</h1>

          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Dashboard</a>
              </li>

              <li className="breadcrumb-item">
                Student Detail
              </li>

              <li className="breadcrumb-item active">
                Student Detail
              </li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="setmarks-toolbar d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <h5 className="card-title mb-0">
                      Student List
                    </h5>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control"
                        placeholder="Enter Roll No"
                        value={rollNo}
                        onChange={(e) =>
                          setRollNo(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSetMarks();
                          }
                        }}
                        style={{
                          width: "180px",
                          height: "38px",
                          borderRadius: "10px",
                        }}
                      />

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSetMarks}
                        disabled={!rollNo.trim() || isSaving}
                        style={{
                          height: "38px",
                          whiteSpace: "nowrap",
                          borderRadius: "10px",
                        }}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Set Marks
                      </button>
                    </div>
                  </div>

                  <div className="row g-3 align-items-center mb-3">
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
                            borderRadius: "10px",
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
                      <div className="position-relative setmarks-search ms-lg-auto">
                        <i
                          className="bi bi-search position-absolute"
                          style={{
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#899bbd",
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
                            border: "1px solid #e1e5eb",
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
                              transform: "translateY(-50%)",
                            }}
                          >
                            <i className="bi bi-x-circle-fill text-muted"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-3 py-3 mb-3"
                    style={{
                      background: "#f8f9fc",
                      borderRadius: "12px",
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
                          color: "#4154f1",
                        }}
                      >
                        <i className="bi bi-search me-1"></i>
                        Search: "{search}"
                      </div>
                    )}
                  </div>

                  <div className="setmarks-table-wrapper">
                    <table className="table align-middle mb-0 setmarks-table">
                      <colgroup>
                        <col style={{ width: "70px" }} />
                        <col style={{ width: "180px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "110px" }} />
                        <col style={{ width: "220px" }} />
                        <col style={{ width: "210px" }} />
                        <col style={{ width: "310px" }} />
                        <col style={{ width: "200px" }} />
                      </colgroup>

                      <thead
                        style={{
                          background: "#f8f9fc",
                        }}
                      >
                        <tr>
                          <th className="ps-4 py-3 text-muted small fw-bold">
                            #
                          </th>

                          <th className="py-3 text-muted small fw-bold">
                            ENROLLMENT NO
                          </th>

                          <th className="py-3 text-muted small fw-bold">
                            ROLL NO
                          </th>

                          <th className="py-3 text-muted small fw-bold">
                            IMAGE
                          </th>

                          <th className="py-3 text-muted small fw-bold">
                            NAME
                          </th>

                          <th className="py-3 text-muted small fw-bold">
                            FATHER NAME
                          </th>

                          <th className="py-3 text-muted small fw-bold">
                            ADDRESS
                          </th>

                          <th className="py-3 text-muted small fw-bold">
                            MOBILE NO
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.length > 0 ? (
                          data.map((item, index) => (
                            <tr key={item.id}>
                              <td className="ps-4">
                                <span
                                  className="d-inline-flex align-items-center justify-content-center fw-semibold"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "10px",
                                    background: "#eef1ff",
                                    color: "#4154f1",
                                    fontSize: "13px",
                                  }}
                                >
                                  {(pageNo - 1) *
                                    pageSize +
                                    index +
                                    1}
                                </span>
                              </td>

                              <td>
                                <span
                                  className="setmarks-cell"
                                  title={item.enrollmentNo || "-"}
                                >
                                  {item.enrollmentNo || "-"}
                                </span>
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm setmarks-roll-btn"
                                  onClick={() =>
                                    handleRollNoClick(
                                      item.rollno
                                    )
                                  }
                                  title={item.rollno || "-"}
                                  style={{
                                    borderRadius: "9px",
                                    maxWidth: "100%",
                                  }}
                                >
                                  {item.rollno || "-"}
                                </button>
                              </td>

                              <td>
                                <img
                             
                                  src={`${FILE_URL}${item.selfImageShow}`} 
                                  alt="Student"
                                  className="setmarks-image"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://ui-avatars.com/api/?name=" +
                                      encodeURIComponent(
                                        item.name || "Student"
                                      );
                                  }}
                                />
                              </td>

                              <td>
                                <span
                                  className="setmarks-cell fw-semibold text-dark"
                                  title={item.name || "-"}
                                >
                                  {item.name || "-"}
                                </span>
                              </td>

                              <td>
                                <span
                                  className="setmarks-cell"
                                  title={item.fatherName || "-"}
                                >
                                  {item.fatherName || "-"}
                                </span>
                              </td>

                              <td>
                                <span
                                  className="setmarks-cell"
                                  title={item.address || "-"}
                                >
                                  {item.address || "-"}
                                </span>
                              </td>

                              <td>
                                <span
                                  className="setmarks-cell"
                                  title={item.mobileNo || "-"}
                                >
                                  {item.mobileNo || "-"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center py-5 text-muted"
                            >
                              <i
                                className="bi bi-people"
                                style={{
                                  fontSize: "32px",
                                }}
                              ></i>

                              <div className="mt-2">
                                No student found
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
                            borderRadius: "10px",
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
                                  : "400",
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
                            borderRadius: "10px",
                          }}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {modalOpen && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(3px)",
            }}
          ></div>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered setmarks-modal">
              <div
                className="modal-content border-0 shadow-lg"
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "5px",
                    background:
                      "linear-gradient(90deg, #0d6efd, #6ea8fe)",
                  }}
                ></div>

                <div className="modal-header border-0 px-4 pt-4 pb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#e7f1ff",
                      }}
                    >
                      <i
                        className="bi bi-person-lines-fill text-primary"
                        style={{
                          fontSize: "22px",
                        }}
                      ></i>
                    </div>

                    <div>
                      <h5 className="modal-title fw-bold mb-1">
                        Student Details
                      </h5>

                      <small className="text-muted">
                        Enter student subject marks
                      </small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={isSaving}
                  ></button>
                </div>

                <div className="modal-body px-4 py-3">
                  {studentDetails.length > 0 ? (
                    <div className="setmarks-modal-table-wrapper">
                      <table className="table table-bordered table-hover align-middle mb-0 setmarks-modal-table">
                        <colgroup>
                          <col style={{ width: "130px" }} />
                          <col style={{ width: "240px" }} />
                          <col style={{ width: "100px" }} />
                          <col style={{ width: "230px" }} />
                          <col style={{ width: "150px" }} />
                          <col style={{ width: "150px" }} />
                          <col style={{ width: "150px" }} />
                        </colgroup>

                        <thead className="table-light">
                          <tr>
                            <th>Roll No</th>
                            <th>Course</th>
                            <th>Code</th>
                            <th>Subject</th>
                            <th>Theory</th>
                            <th>Practical</th>
                            <th>Assignment</th>
                          </tr>
                        </thead>

                        <tbody>
                          {studentDetails.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-semibold">
                                {item.rollno || "-"}
                              </td>

                              <td>
                                <span
                                  className="setmarks-course"
                                  title={item.courseName || "-"}
                                >
                                  {item.courseName || "-"}
                                </span>
                              </td>

                              <td>
                                <span className="badge bg-primary">
                                  {item.code || "-"}
                                </span>
                              </td>

                              <td>
                                <span
                                  className="setmarks-subject"
                                  title={item.name || "-"}
                                >
                                  {item.name || "-"}
                                </span>
                              </td>

                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  className="form-control"
                                  value={
                                    item.theoryMarks ?? 0
                                  }
                                  onChange={(e) =>
                                    handleMarksChange(
                                      index,
                                      "theoryMarks",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  className="form-control"
                                  value={
                                    item.practicalMarks ?? 0
                                  }
                                  onChange={(e) =>
                                    handleMarksChange(
                                      index,
                                      "practicalMarks",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  className="form-control"
                                  value={
                                    item.assignmentMarks ?? 0
                                  }
                                  onChange={(e) =>
                                    handleMarksChange(
                                      index,
                                      "assignmentMarks",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>

                      <p className="text-muted mt-3 mb-0">
                        Loading student details...
                      </p>
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 px-4 pb-4 pt-3">
                  <button
                    type="button"
                    className="btn btn-light border px-4"
                    style={{
                      borderRadius: "8px",
                    }}
                    onClick={closeModal}
                    disabled={isSaving}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Close
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    style={{
                      borderRadius: "8px",
                      minWidth: "140px",
                    }}
                    onClick={handleSaveMarks}
                    disabled={
                      studentDetails.length === 0 ||
                      isSaving
                    }
                  >
                    {isSaving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Save Marks
                      </>
                    )}
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

export default SetMarksStudent;