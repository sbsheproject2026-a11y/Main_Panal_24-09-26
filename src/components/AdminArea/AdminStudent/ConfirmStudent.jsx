import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  GetConfirmAddmissions,
  GenerateUserCode,
} from "../../AllServicesFiles/AdminStudentService";
import { FILE_URL } from "../../api";

function ConfirmStudent() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatingFor, setGeneratingFor] = useState(null);
  const roleId = String(localStorage.getItem("RoleId") || "").trim();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const studyModeId = Number(searchParams.get("studyModeId")) || 0;

  useEffect(() => {
    loadStudents();
  }, [pageNo, pageSize, search, studyModeId]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const result = await GetConfirmAddmissions(
        pageNo,
        pageSize,
        search,
        studyModeId
      );
      const response = result?.data;
      const items = response?.data || [];
      setData(items);
      setTotalRecords(response?.totalRecords || 0);
      return items;
    } catch (error) {
      console.log("Error loading students:", error);
      setData([]);
      setTotalRecords(0);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;
  const endRecord =
    totalRecords === 0 ? 0 : Math.min(pageNo * pageSize, totalRecords);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNo(1);
  };
  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPageNo(1);
  };
  const handlePrevious = () => {
    if (pageNo > 1) setPageNo(pageNo - 1);
  };
  const handleNext = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  const handleGenerateCode = async (id, code, type) => {
    if (generatingFor) return;
    try {
      setGeneratingFor(type);
      await GenerateUserCode(id, code);

      const items = await loadStudents();
      const updated = items.find((s) => s.id === id);
      if (updated) setSelectedStudent(updated);
    } catch (err) {
      console.error("Generate code failed:", err);
      alert(
        err?.response?.data?.message ||
        "Failed to generate code. Please try again."
      );
    } finally {
      setGeneratingFor(null);
    }
  };

  const getPageTitle = () => {
    if (studyModeId === 88) return "Confirmed Students - Online";
    if (studyModeId === 89) return "Confirmed Students - Offline";
    return "Confirmed Students";
  };

  const getHeaderBadge = () => {
    if (studyModeId === 88)
      return {
        bg: "#eaf3ff",
        color: "#1473d4",
        icon: "bi-globe2",
        label: "ONLINE",
      };
    if (studyModeId === 89)
      return {
        bg: "#fff3e8",
        color: "#e87917",
        icon: "bi-geo-alt-fill",
        label: "OFFLINE",
      };
    return null;
  };

  const headerBadge = getHeaderBadge();

  const hasCode = (val) => val != null && String(val).trim() !== "";

  // ✅ Avatar initials
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (partsofLength(parts) === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  function partsofLength(arr) {
    return arr ? arr.length : 0;
  }

  // ✅ Deterministic avatar color
  const avatarColors = [
    { bg: "#eef1ff", color: "#4154f1" },
    { bg: "#f3fcff", color: "#087990" },
    { bg: "#f3fff8", color: "#198754" },
    { bg: "#fff4df", color: "#997404" },
    { bg: "#faf7ff", color: "#6f42c1" },
    { bg: "#fff1f2", color: "#be123c" },
  ];
  const getAvatarColor = (id) => {
    const idx = Math.abs(Number(id) || 0) % avatarColors.length;
    return avatarColors[idx];
  };

  const renderDocOrGenerate = ({
    fieldValue,
    code,
    type,
    title,
    subtitle,
    path,
    generateLabel,
  }) => {
    if (hasCode(fieldValue)) {
      return (
        <DocumentButton
          icon="bi-person-badge-fill"
          title={title}
          subtitle={subtitle}
          color="#087990"
          bg="#f3fcff"
          onClick={() => openDocument(path)}
        />
      );
    }
    return (
      <div
        className="d-flex align-items-center justify-content-center h-100"
        style={{ minHeight: "105px" }}
      >
        <button
          type="button"
          disabled={generatingFor === type}
          onClick={() => handleGenerateCode(selectedStudent.id, code, type)}
          style={{
            background: "#fff8ed",
            color: "#d97706",
            border: "1px solid #d9770640",
            borderRadius: "10px",
            padding: "9px 18px",
            fontSize: "13px",
            fontWeight: "600",
            transition: "all .2s ease",
            cursor: generatingFor === type ? "not-allowed" : "pointer",
            opacity: generatingFor === type ? 0.7 : 1,
          }}
        >
          {generatingFor === type ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Generating...
            </>
          ) : (
            <>
              <i className="bi bi-code-square me-1"></i>
              {generateLabel}
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      <style>{`
        html, body, #root { width: 100%; max-width: 100%; overflow-x: hidden !important; }
        .confirm-page { width: 100%; max-width: 100%; min-width: 0; overflow-x: hidden; box-sizing: border-box; }
        .confirm-page .section, .confirm-page .card, .confirm-page .card-header, .confirm-page .card-body { width: 100%; max-width: 100%; min-width: 0; box-sizing: border-box; }
        .confirm-toolbar, .confirm-record-info { min-width: 0; max-width: 100%; }

        /* ================= TABLE WRAPPER ================= */
        .confirm-table-wrapper {
          width: 0 !important; min-width: 100% !important; max-width: 100% !important;
          overflow-x: auto !important; overflow-y: hidden !important;
          position: relative; box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          scrollbar-gutter: stable;
          contain: inline-size;
        }

        .confirm-table {
          width: auto !important; min-width: 100% !important; max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate !important; border-spacing: 0 !important;
          margin: 0 !important;
        }

        .confirm-table th, .confirm-table td { box-sizing: border-box; }
        .confirm-table th { white-space: nowrap; }
        .confirm-table td { white-space: nowrap; }

        .confirm-badge { display: inline-flex; align-items: center; white-space: nowrap; }
        .confirm-document-btn { white-space: nowrap; }
        .confirm-modal { max-width: 100vw; }
        .confirm-modal .modal-content { max-width: 100%; }
        .confirm-document-grid { min-width: 0; }
        .confirm-document-grid > div { min-width: 0; }
        .confirm-document-button { min-width: 0; max-width: 100%; }
        .confirm-document-button .confirm-document-text { min-width: 0; }

        .confirm-table-wrapper::-webkit-scrollbar { height: 8px; }
        .confirm-table-wrapper::-webkit-scrollbar-track { background: #f1f3f7; border-radius: 10px; }
        .confirm-table-wrapper::-webkit-scrollbar-thumb { background: #c9ced8; border-radius: 10px; }
        .confirm-table-wrapper::-webkit-scrollbar-thumb:hover { background: #aeb5c2; }

        .confirm-mode-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 30px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.4px;
        }

        /* ================= STUDENT CELL ================= */
        .student-cell {
          display: flex; align-items: center; gap: 12px;
        }

        .student-avatar {
          width: 42px; height: 42px; min-width: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 14px;
          letter-spacing: 0.5px;
        }

        .student-info { min-width: 0; }

        .student-name {
          font-weight: 700;
          font-size: 13px;
          color: #1e293b;
          line-height: 1.2;
          margin-bottom: 3px;
        }

        .student-mobile {
          font-size: 11.5px;
          color: #64748b;
          display: flex; align-items: center; gap: 4px;
        }

        /* ================= TABLE ROW ================= */
        .confirm-row {
          transition: all .2s ease;
          border-left: 3px solid transparent;
        }

        .confirm-row:hover {
          background: #fafbff !important;
          border-left-color: #4154f1;
          box-shadow: 0 2px 8px rgba(65, 84, 241, 0.06);
        }

        /* ================= ADDRESS TRUNCATE ================= */
        .address-cell {
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12.5px;
          color: #475569;
        }

        /* ================= DOCUMENTS BUTTON ================= */
        .confirm-document-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #eef4ff, #f5f9ff);
          color: #0d6efd;
          border: 1px solid #d7e5ff;
          font-weight: 600;
          font-size: 12.5px;
          transition: all .2s ease;
        }

        .confirm-document-btn:hover {
          background: linear-gradient(135deg, #dbeafe, #eff6ff);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
        }

        @media (max-width: 768px) {
          .confirm-table-wrapper { width: 0 !important; min-width: 100% !important; max-width: 100% !important; }
          .confirm-table { width: auto !important; min-width: 100% !important; max-width: none !important; }
          .confirm-page .card-header, .confirm-page .card-body { padding-left: 15px !important; padding-right: 15px !important; }
          .confirm-page .modal-dialog { margin: 10px; }
        }
      `}</style>

      <div className="confirm-page">
        <section className="section">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "20px", overflow: "hidden" }}
          >
            <div
              className="card-header border-0 px-4 py-4"
              style={{
                background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)",
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
                        color: "#4154f1",
                      }}
                    >
                      <i className="bi bi-person-check-fill"></i>
                    </span>
                    {getPageTitle()}
                  </h5>
                  <p className="text-muted mb-0 small">
                    Manage confirmed student records and print documents
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {headerBadge && (
                    <div
                      className="confirm-mode-badge"
                      style={{
                        background: headerBadge.bg,
                        color: headerBadge.color,
                      }}
                    >
                      <i className={`bi ${headerBadge.icon}`}></i>
                      {headerBadge.label}
                    </div>
                  )}
                  <div
                    className="px-3 py-2 rounded-pill"
                    style={{
                      background: "#eaf8f0",
                      color: "#198754",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    <i className="bi bi-check-circle-fill me-1"></i>
                    {totalRecords} TOTAL CONFIRMED
                  </div>
                </div>
              </div>
            </div>

            <div className="confirm-toolbar px-4 pt-4">
              <div className="row g-3 align-items-center">
                <div className="col-lg-6">
                  <div className="d-flex align-items-center">
                    <span className="text-muted small me-2">Show</span>
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
                      <option value={100}>100</option>
                      <option value={250}>250</option>
                      <option value={500}>500</option>
                      <option value={1000}>1000</option>
                    </select>
                    <span className="text-muted small ms-2">entries</span>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="position-relative ms-lg-auto"
                    style={{ maxWidth: "350px" }}
                  >
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
            </div>

            <div className="confirm-record-info px-4 pt-4">
              <div
                className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-3 py-3"
                style={{ background: "#f8f9fc", borderRadius: "12px" }}
              >
                <div className="small text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Showing <strong className="text-dark">{startRecord}</strong> to{" "}
                  <strong className="text-dark">{endRecord}</strong> of{" "}
                  <strong className="text-dark">{totalRecords}</strong> students
                </div>
                {search && (
                  <div
                    className="small fw-semibold"
                    style={{ color: "#4154f1" }}
                  >
                    <i className="bi bi-search me-1"></i>Search: "{search}"
                  </div>
                )}
              </div>
            </div>

            <div className="card-body px-4 pt-3">
              <div
                className="confirm-table-wrapper"
                style={{ border: "1px solid #edf0f5", borderRadius: "15px" }}
              >
                <table className="table align-middle mb-0 confirm-table">
                  <thead style={{ background: "#f8f9fc" }}>
                    <tr>
                      <th
                        className="ps-4 py-3 text-muted small fw-bold"
                        style={{ width: "55px" }}
                      >
                        #
                      </th>
                      <th className="py-3 pe-4 text-muted small fw-bold text-center">
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
                      <th className="py-3 text-muted small fw-bold">ADDRESS</th>
                      <th className="py-3 text-muted small fw-bold">COURSE</th>
                      <th className="py-3 text-muted small fw-bold">
                        FRANCHISE
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                          ></div>
                          <div className="text-muted">Loading students...</div>
                        </td>
                      </tr>
                    ) : data.length > 0 ? (
                      data.map((item, index) => {
                        const avatar = getAvatarColor(item.id);
                        return (
                          <tr key={item.id} className="confirm-row">
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
                                {(pageNo - 1) * pageSize + index + 1}
                              </span>
                            </td>
                            {/* DOCUMENTS */}
                            <td className="pe-4 text-center">
                              <button
                                type="button"
                                onClick={() => openDocumentModal(item)}
                                className="confirm-document-btn border-0"
                              >
                                <i className="bi bi-folder2-open"></i>
                                Documents
                                <i
                                  className="bi bi-chevron-right"
                                  style={{ fontSize: "10px" }}
                                ></i>
                              </button>
                            </td>
                            {/* STUDENT */}
                            <td>
                              <div className="student-cell">

                                <div className="student-info">
                                  <div className="student-name">
                                    {item.name || "-"}
                                  </div>
                                  <div className="student-mobile">
                                    <i
                                      className="bi bi-telephone"
                                      style={{ fontSize: "10px" }}
                                    ></i>
                                    {item.mobileNo || "-"}
                                  </div>
                                </div>
                              </div>
                            </td>



                            {/* ENROLLMENT */}
                            <td>
                              <span
                                className="badge rounded-pill px-3 py-2"
                                style={{
                                  background: "#eef7ff",
                                  color: "#0d6efd",
                                  fontWeight: "600",
                                  fontSize: "12px",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                <i className="bi bi-card-text me-1"></i>
                                {item.enrollmentNo || "-"}
                              </span>
                            </td>

                            {/* FATHER */}
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    minWidth: "32px",
                                    borderRadius: "10px",
                                    background: "#fff4df",
                                    color: "#f59e0b",
                                  }}
                                >
                                  <i
                                    className="bi bi-person-fill"
                                    style={{ fontSize: "13px" }}
                                  ></i>
                                </div>
                                <span
                                  style={{
                                    fontWeight: "500",
                                    color: "#334155",
                                    fontSize: "12.5px",
                                  }}
                                >
                                  {item.fatherName || "-"}
                                </span>
                              </div>
                            </td>

                            {/* ADDRESS */}
                            <td>
                              <div
                                className="address-cell"
                                title={item.address || "-"}
                              >
                                <i
                                  className="bi bi-geo-alt me-1"
                                  style={{ color: "#94a3b8" }}
                                ></i>
                                {item.address || "-"}
                              </div>
                            </td>
                            {/* COURSE */}
                            <td>
                              <span
                                className="badge rounded-pill px-3 py-2"
                                style={{
                                  background: "#faf7ff",
                                  color: "#6f42c1",
                                  fontWeight: "600",
                                  fontSize: "11.5px",
                                }}
                              >
                                <i className="bi bi-mortarboard me-1"></i>
                                {item.courseName || "-"}
                              </span>
                            </td>
                            {/* FRANCHISE */}
                            <td>
                              <span
                                className="badge rounded-pill px-3 py-2"
                                style={{
                                  background: "#f1f8f5",
                                  color: "#198754",
                                  fontWeight: "600",
                                  fontSize: "11.5px",
                                }}
                              >
                                <i className="bi bi-building me-1"></i>
                                {item.instituteName || "-"}
                              </span>
                            </td>


                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div>
                            <div
                              className="mx-auto d-flex align-items-center justify-content-center mb-3"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "22px",
                                background: "#f1f3f9",
                              }}
                            >
                              <i
                                className="bi bi-people text-muted"
                                style={{ fontSize: "34px" }}
                              ></i>
                            </div>
                            <h5 className="fw-bold mb-1">No Students Found</h5>
                            <p className="text-muted mb-0">
                              No confirmed student records match your search.
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
                    Page <strong className="text-dark">{pageNo}</strong> of{" "}
                    <strong className="text-dark">{totalPages}</strong>
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
                          fontWeight: pageNo === page ? "600" : "400",
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
        </section>
      </div>

      {/* ============== DOCUMENT MODAL (UNCHANGED) ============== */}
      {documentModalOpen && selectedStudent && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              backgroundColor: "rgba(15,23,42,.70)",
              backdropFilter: "blur(4px)",
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
              style={{ maxWidth: "720px" }}
            >
              <div
                className="modal-content border-0 shadow-lg"
                style={{ borderRadius: "22px", overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "5px",
                    background: "linear-gradient(90deg,#4154f1,#8b5cf6)",
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
                        color: "#4154f1",
                      }}
                    >
                      <i
                        className="bi bi-folder2-open"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Student Documents</h5>
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
                      border: "1px solid #edf0f5",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`${FILE_URL}${selectedStudent.selfImageShow}`}
                        alt="Student"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(selectedStudent.name || "Student");
                        }}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "15px",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">
                          {selectedStudent.name || "-"}
                        </h6>
                        <div className="d-flex gap-2 flex-wrap">
                          <span
                            className="badge rounded-pill"
                            style={{ background: "#eef7ff", color: "#0d6efd" }}
                          >
                            Enrollment: {selectedStudent.enrollmentNo || "-"}
                          </span>
                          <span
                            className="badge rounded-pill"
                            style={{ background: "#f3efff", color: "#6f42c1" }}
                          >
                            Roll 1: {selectedStudent.rollno || "-"}
                          </span>
                          {selectedStudent?.rollNo1?.toString().trim() && (
                            <span
                              className="badge rounded-pill"
                              style={{ background: "#fff4df", color: "#997404" }}
                            >
                              Roll 2: {selectedStudent.rollNo1 || "-"}
                            </span>
                          )}
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
                          openDocument(`/diploma-print/${selectedStudent.id}`)
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
                          openDocument(`/id-card/${selectedStudent.id}`)
                        }
                      />
                    </div>

                    <div className="col-md-4">
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
                    {selectedStudent?.rollNo1?.toString().trim() && (
                      <div className="col-md-4">
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
                    )}

                    <div className="col-md-4">
                      <DocumentButton
                        icon="bi bi-file-earmark-bar-graph-fill"
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
                    {selectedStudent?.rollNo1?.toString().trim() && (
                      <div className="col-md-4">
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
                    )}

                    {roleId === "5" ? (
                      <>
                        <div className="col-md-4">
                          {renderDocOrGenerate({
                            fieldValue: selectedStudent.nocsrno,
                            code: 6,
                            type: "noc",
                            title: "NOC Certificate",
                            subtitle: "Print NOC",
                            path: `/noc-print/${selectedStudent.id}`,
                            generateLabel: "Generate NOC Code",
                          })}
                        </div>

                        <div className="col-md-4">
                          {renderDocOrGenerate({
                            fieldValue: selectedStudent.regCode,
                            code: 7,
                            type: "reg",
                            title: "Registration Certificate",
                            subtitle: "Print Registration",
                            path: `/reg-print/${selectedStudent.id}`,
                            generateLabel: "Generate Reg Code",
                          })}
                        </div>

                        <div className="col-md-6">
                          {renderDocOrGenerate({
                            fieldValue: selectedStudent.bonafideCode,
                            code: 8,
                            type: "bonafide",
                            title: "Bonafide Certificate",
                            subtitle: "Print Bonafide Certificate",
                            path: `/bonafide-certificate-print/${selectedStudent.id}`,
                            generateLabel: "Generate Bonafide Code",
                          })}
                        </div>

                        <div className="col-md-6">
                          {renderDocOrGenerate({
                            fieldValue: selectedStudent.trainingReqCode,
                            code: 9,
                            type: "training",
                            title: "Training Letter",
                            subtitle: "Print Training Letter",
                            path: `/trainging-certificate-print/${selectedStudent.id}`,
                            generateLabel: "Generate Training Code",
                          })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="modal-footer border-0 px-4 pb-4 pt-3">
                  <button
                    type="button"
                    className="btn btn-light border px-4"
                    onClick={closeDocumentModal}
                    style={{ borderRadius: "10px" }}
                  >
                    <i className="bi bi-x-lg me-2"></i>Close
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

function DocumentButton({ icon, title, subtitle, color, bg, onClick }) {
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
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.08)";
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
            flexShrink: 0,
          }}
        >
          <i className={`bi ${icon}`} style={{ fontSize: "21px" }}></i>
        </div>
        <div className="confirm-document-text">
          <div
            className="fw-bold confirm-document-title"
            style={{ fontSize: "14px" }}
          >
            {title}
          </div>
          <small
            className="text-muted confirm-document-subtitle"
            style={{ fontSize: "12px" }}
          >
            {subtitle}
          </small>
        </div>
      </div>
    </button>
  );
}

export default ConfirmStudent;