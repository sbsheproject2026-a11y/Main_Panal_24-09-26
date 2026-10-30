 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExamStudentResult, getSubmittedExams } from "../../AllServicesFiles/AdminStudentService";
import { FILE_URL } from "../../api";

function StudentResult() {
  const navigate = useNavigate();

  // States for List
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States for Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // States for Modal (Detail View)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExamDetail, setSelectedExamDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // 1. Fetch List on Load
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getExamStudentResult();
        setExams(data || []);
      } catch (err) {
        console.error("API Error:", err);
        if (err.response?.status === 404) {
          setExams([]); 
        } else {
          setError("Failed to load data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // 2. Handle "View Result" Click
  const handleViewResult = async (studentId) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
    setModalLoading(true);
    setSelectedExamDetail(null);

    try {
      const detailData = await getSubmittedExams(studentId); 
      if (detailData && detailData.length > 0) {
        setSelectedExamDetail(detailData[0]); 
      }
    } catch (err) {
      console.error("Detail API Error:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const getFileUrl = (fileName) => {
    if (!fileName) return null;
    return `${FILE_URL}${fileName}`; 
  };

  // 3. Filter Logic (Search)
  const filteredExams = exams.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(searchLower) ||
      (item.code || "").toLowerCase().includes(searchLower) ||
      (item.courseName || "").toLowerCase().includes(searchLower)
    );
  });

  // 4. Pagination Logic
  const totalRecords = filteredExams.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredExams.slice(startIndex, endIndex);

  const startRecord = totalRecords === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(endIndex, totalRecords);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };
  const pageNumbers = getPageNumbers();

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };
  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      {/* ✅ ENQUIRIES LIST WALI CSS */}
      <style>{`
        html, body, #root { width: 100%; max-width: 100%; overflow-x: hidden !important; }
        .enquiry-page { width: 100%; max-width: 100%; min-width: 0; overflow-x: hidden; box-sizing: border-box; padding: 20px; background-color: #f8fafc; min-height: 100vh; }

        .enq-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 15px; flex-wrap: wrap; }
        .enq-header h1 { margin: 0 0 6px; font-size: 26px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 10px; }
        .enq-header h1 i { color: #4154f1; }
        .enq-breadcrumb { margin: 0; padding: 0; background: transparent; font-size: 13px; }
        .enq-breadcrumb a { color: #4154f1; text-decoration: none; }
        
        .btn-back { padding: 10px 18px; background: #fff; border: 1px solid #dfe4ec; border-radius: 10px; color: #475569; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .btn-back:hover { background: #f1f5f9; }

        .enq-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: linear-gradient(135deg, #4154f1, #6f7bf7); color: #fff; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 6px 18px rgba(65, 84, 241, 0.25); }
        .enq-badge i { font-size: 15px; }

        .enq-card { width: 100%; max-width: 100%; min-width: 0; background: #fff; border-radius: 16px; border: 1px solid #e7eaf0; box-shadow: 0 5px 25px rgba(30, 41, 59, .06); overflow: hidden; box-sizing: border-box; }
        .enq-card-header { padding: 22px 24px; display: flex; justify-content: space-between; align-items: center; gap: 15px; border-bottom: 1px solid #edf0f5; flex-wrap: wrap; }
        .enq-card-header h5 { margin: 0 0 4px; font-size: 18px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
        .enq-card-header h5 i { color: #4154f1; }
        .enq-card-header p { margin: 0; color: #94a3b8; font-size: 12px; }

        .enq-toolbar { padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; background: #fbfcfe; border-bottom: 1px solid #edf0f5; }
        .enq-toolbar-left, .enq-toolbar-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .enq-page-size { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 13px; white-space: nowrap; }
        .enq-page-size select { height: 38px; padding: 0 10px; border: 1px solid #dfe4ec; border-radius: 8px; background: #fff; color: #334155; font-size: 13px; font-weight: 600; outline: none; cursor: pointer; }

        .enq-search { position: relative; width: 300px; max-width: 100%; }
        .enq-search > i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 15px; }
        .enq-search input { width: 100%; height: 42px; padding: 0 42px 0 40px; border: 1px solid #dfe4ec; border-radius: 10px; background: #fff; color: #334155; font-size: 13px; outline: none; transition: all .2s ease; }
        .enq-search input:focus { border-color: #4154f1; box-shadow: 0 0 0 3px rgba(65, 84, 241, .08); }
        .enq-search input::placeholder { color: #94a3b8; }
        .enq-search button { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 2px; display: flex; align-items: center; justify-content: center; }
        .enq-search button:hover { color: #dc3545; }

        .enq-info-bar { padding: 12px 24px; background: #f8fafc; border-bottom: 1px solid #edf0f5; color: #64748b; font-size: 12px; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
        .enq-info-bar strong { color: #334155; }
        .enq-info-bar .enq-search-tag { color: #4154f1; font-weight: 600; }

        .enq-table-wrap { width: 0 !important; min-width: 100% !important; max-width: 100% !important; overflow-x: auto !important; overflow-y: hidden !important; box-sizing: border-box; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: #c9ced8 #eef1f5; }
        .enq-table-wrap::-webkit-scrollbar { height: 9px; }
        .enq-table-wrap::-webkit-scrollbar-track { background: #eef1f5; border-radius: 10px; }
        .enq-table-wrap::-webkit-scrollbar-thumb { background: #c9ced8; border-radius: 10px; }
        .enq-table-wrap::-webkit-scrollbar-thumb:hover { background: #aeb5c2; }

        .enq-table { width: auto !important; min-width: 100% !important; max-width: none !important; table-layout: auto !important; border-collapse: separate !important; border-spacing: 0 !important; margin: 0 !important; }
        .enq-table thead th { background: #f8f9fc !important; color: #687185; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .3px; white-space: nowrap; padding: 15px 16px; border-bottom: 1px solid #e9edf3; vertical-align: middle; }
        .enq-table tbody td { padding: 15px 16px; color: #414a5d; font-size: 13px; vertical-align: middle; border-bottom: 1px solid #f0f2f6; white-space: nowrap; }
        .enq-table tbody tr { transition: background .15s ease; }
        .enq-table tbody tr:hover { background: #fafbff; }
        .enq-table tbody tr:last-child td { border-bottom: none; }

        .enq-table th.sticky-action, .enq-table td.sticky-action { position: sticky !important; right: 0 !important; z-index: 5; background-color: #fff; box-shadow: -4px 0 10px -5px rgba(0, 0, 0, 0.1); }
        .enq-table thead th.sticky-action { background-color: #f8f9fc !important; z-index: 6; }
        .enq-table tbody tr:hover td.sticky-action { background-color: #fafbff !important; }

        .enq-serial { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: #eef1ff; color: #4154f1; font-size: 12px; font-weight: 700; }
        .enq-name { display: flex; align-items: center; gap: 10px; }
    
        .enq-name-text { display: flex; flex-direction: column; }
        .enq-name-text strong { color: #1e293b; font-size: 13px; font-weight: 600; }

        .enq-course-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 20px; background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 600; white-space: nowrap; }
        .enq-course-text { font-size: 13px; font-weight: 500; color: #334155; white-space: normal; max-width: 300px; line-height: 1.4; }

        /* Action Button */
        .enq-view-btn { width: 34px; height: 34px; border-radius: 8px; border: none; background: #eff6ff; color: #2563eb; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s ease; font-size: 14px; }
        .enq-view-btn:hover { background: #2563eb; color: #fff; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(37, 99, 235, .25); }

        .enq-empty, .enq-loading { text-align: center; padding: 60px 20px !important; color: #94a3b8; }
        .enq-empty-icon, .enq-loading-icon { width: 60px; height: 60px; margin: 0 auto 14px; border-radius: 50%; background: #f1f5f9; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 26px; }
        .enq-empty h5 { color: #334155; font-size: 16px; font-weight: 600; margin: 0 0 6px; }
        .enq-empty p { color: #94a3b8; font-size: 13px; margin: 0 0 14px; }

        .enq-pagination { padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; border-top: 1px solid #edf0f5; }
        .enq-records { color: #7a8395; font-size: 13px; }
        .enq-records strong { color: #414a5d; }
        .enq-page-buttons { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .enq-page-btn { min-width: 38px; height: 38px; padding: 0 12px; border: 1px solid #e2e6ee; background: #fff; color: #515a6c; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all .15s ease; }
        .enq-page-btn:hover:not(:disabled) { background: #4154f1; border-color: #4154f1; color: #fff; }
        .enq-page-btn:disabled { opacity: .45; cursor: not-allowed; }
        .enq-page-number { width: 38px; height: 38px; border: 1px solid #dfe3eb; background: #fff; color: #344054; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s ease; }
        .enq-page-number:hover:not(:disabled) { background: #f5f7ff; border-color: #c7c9ff; color: #4154f1; }
        .enq-page-number.active { background: #4154f1; color: #fff; border-color: #4154f1; box-shadow: 0 5px 12px rgba(65, 84, 241, 0.25); }
        .enq-page-of { color: #64748b; font-size: 13px; margin-left: 6px; white-space: nowrap; }

        @media (max-width: 768px) {
          .enq-header h1 { font-size: 22px; }
          .enq-card-header, .enq-toolbar, .enq-info-bar, .enq-pagination { padding: 15px 18px; }
          .enq-search { width: 100%; }
          .enq-toolbar { align-items: stretch; flex-direction: column; }
          .enq-toolbar-left, .enq-toolbar-right { width: 100%; }
          .enq-page-size { justify-content: flex-end; width: 100%; }
          .enq-pagination { flex-direction: column; align-items: flex-start; }
          .enq-page-buttons { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="enquiry-page">
        
        {/* HEADER */}
        <div className="enq-header">
          <div>
            <h1>
              <i className="bi bi-file-earmark-check-fill"></i>
              Submitted Students List
            </h1>
            <nav>
              <ol className="breadcrumb enq-breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/dashboard">
                    <i className="bi bi-house-door me-1"></i>
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item active">Student Results</li>
              </ol>
            </nav>
          </div>
          
        </div>

        {/* MAIN CARD */}
        <div className="enq-card">
          
           

          {/* Toolbar */}
          <div className="enq-toolbar">
            <div className="enq-toolbar-left">
              <div className="enq-page-size">
                <span>Show</span>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            <div className="enq-toolbar-right">
              <div className="enq-search">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search name, code, or course..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button type="button" onClick={clearSearch} title="Clear">
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Info Bar */}
          <div className="enq-info-bar">
            <span>
              <i className="bi bi-info-circle me-1"></i>
              Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of <strong>{totalRecords}</strong> students
            </span>
            {searchQuery && (
              <span className="enq-search-tag">
                <i className="bi bi-search me-1"></i>
                Search: "{searchQuery}"
              </span>
            )}
          </div>

          {/* Table */}
          <div className="enq-table-wrap">
            <table className="enq-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Enrollment Code</th>
                  <th>Course Name</th>
                  <th className="sticky-action" style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="enq-loading">
                      <div className="enq-loading-icon">
                        <div className="spinner-border text-primary"></div>
                      </div>
                      <div>Loading results...</div>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        <span className="enq-serial">{startIndex + index + 1}</span>
                      </td>

                      <td>
                        <div className="enq-name">
                           
                          <div className="enq-name-text">
                            <strong>{item.name || "-"}</strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="enq-course-badge">
                         
                          {item.code || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="enq-course-text">
                          {item.courseName || "-"}
                        </span>
                      </td>

                      <td className="sticky-action" style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="enq-view-btn"
                          title="View Result"
                          onClick={() => handleViewResult(item.id)}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="enq-empty">
                      <div className="enq-empty-icon">
                        <i className="bi bi-inbox"></i>
                      </div>
                      <h5>No Results Found</h5>
                      <p>
                        {searchQuery
                          ? "No student matches your search."
                          : "No exams have been submitted yet."}
                      </p>
                      {searchQuery && (
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={clearSearch}>
                          <i className="bi bi-x-circle me-1"></i> Clear Search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="enq-pagination">
              <div className="enq-records">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>

              <div className="enq-page-buttons">
                <button type="button" className="enq-page-btn" onClick={handlePrevious} disabled={currentPage === 1} title="Previous">
                  <i className="bi bi-chevron-left"></i> Prev
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`enq-page-number ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <span className="enq-page-of">of {totalPages}</span>

                <button type="button" className="enq-page-btn" onClick={handleNext} disabled={currentPage === totalPages} title="Next">
                  Next <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL (Detail View) */}
      {isModalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
                
                <div className="modal-header bg-primary text-white border-0" style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-file-earmark-check me-2"></i> Exam Result Details
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)}></button>
                </div>

                <div className="modal-body p-4">
                  {modalLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                      <p className="mt-2 text-muted">Fetching details...</p>
                    </div>
                  ) : selectedExamDetail ? (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded h-100">
                          <h6 className="text-muted small text-uppercase fw-bold mb-2">Exam Info</h6>
                          <h5 className="fw-bold text-dark mb-1">{selectedExamDetail.name}</h5>
                          <span className="enq-course-badge mb-2">Code: {selectedExamDetail.code}</span>
                          <div className="text-muted small mt-2">
                            <i className="bi bi-calendar-event me-1 text-primary"></i> Date: {selectedExamDetail.date}
                          </div>
                          <div className="text-muted small">
                            <i className="bi bi-clock me-1 text-primary"></i> Schedule: {selectedExamDetail.starttime} - {selectedExamDetail.endtime}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded h-100">
                          <h6 className="text-muted small text-uppercase fw-bold mb-2">Submission Info</h6>
                          <div className="mb-2">
                            <span className="text-success fw-semibold d-block">
                              <i className="bi bi-play-circle me-1"></i> Started: 
                            </span>
                            <span className="text-dark">{selectedExamDetail.startDate || "-"}</span>
                          </div>
                          <div>
                            <span className="text-danger fw-semibold d-block">
                              <i className="bi bi-stop-circle me-1"></i> Submitted: 
                            </span>
                            <span className="text-dark">{selectedExamDetail.endDate || "-"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-4">
                        <div className="p-3 border rounded text-center">
                          <h6 className="fw-bold mb-3">Uploaded Answer Sheet</h6>
                          {selectedExamDetail.filepath ? (
                            <a 
                              href={getFileUrl(selectedExamDetail.filepath)} 
                              target="_blank" 
                              rel="noreferrer"
                              className="btn btn-success px-4 py-2 fw-semibold"
                            >
                              <i className="bi bi-cloud-arrow-down me-2"></i> View / Download File
                            </a>
                          ) : (
                            <span className="badge bg-warning text-dark px-3 py-2">No File Uploaded</span>
                          )}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-danger py-3">
                      Failed to load details for Student ID: {selectedStudentId}
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-secondary fw-semibold" onClick={() => setIsModalOpen(false)}>
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

export default StudentResult;