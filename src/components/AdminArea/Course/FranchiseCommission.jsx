 import React, { useEffect, useState, useRef } from "react";
import { getCourseType, sendToSaveCommission, SetFranchiseCourseAmount } from "../../AllServicesFiles/CourseService";
import { getFrenchisesAssign1 } from "../../AllServicesFiles/WalletService";

// =========================================================
// ✅ CUSTOM SEARCHABLE DROPDOWN COMPONENT
// =========================================================
const SearchableSelect = ({ options, value, onChange, placeholder, disabled, labelKey = "name", valueKey = "id" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const safeOptions = options || [];

  const filteredOptions = safeOptions.filter((opt) =>
    String(opt[labelKey] || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = safeOptions.find((opt) => String(opt[valueKey]) === String(value));

  return (
    <div className="searchable-select-wrapper" ref={wrapperRef}>
      <div
        className={`form-select modern-input modern-select d-flex align-items-center justify-content-between ${disabled ? "bg-light text-muted" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ cursor: disabled ? "not-allowed" : "pointer", minHeight: "46px" }}
      >
        <span className={selectedOption ? "text-dark" : "text-muted"}>
          {selectedOption ? selectedOption[labelKey] : placeholder}
        </span>
        <i className={`bi bi-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: "12px", color: "#94a3b8" }}></i>
      </div>

      {isOpen && (
        <div className="searchable-dropdown-menu shadow-lg">
          <div className="p-2 border-bottom bg-white sticky-top">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                autoFocus
              />
            </div>
          </div>
          <ul className="list-unstyled mb-0 searchable-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt[valueKey]}
                  className={`searchable-item ${String(opt[valueKey]) === String(value) ? "active" : ""}`}
                  onClick={() => {
                    onChange(opt[valueKey]);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {opt[labelKey]}
                </li>
              ))
            ) : (
              <li className="p-3 text-muted text-center" style={{ fontSize: "13px" }}>
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

function FranchiseCommission() {
  const [departments, setDepartments] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [bulkAmount, setBulkAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NAYA STATE: Course Table ke liye Search
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    loadDepartments();
    loadFranchises();
  }, []);

  const loadDepartments = async () => {
    try {
      const result = await getCourseType(13);
      const deptList = (result?.data || []).map(d => ({ id: d.id ?? d.Id, name: d.name ?? d.Name }));
      setDepartments(deptList);
    } catch (error) {
      console.log(error);
    }
  };

  const loadFranchises = async () => {
    try {
      const result = await getFrenchisesAssign1(9);
      const franchiseList = (result?.data || []).map(f => ({ id: f.id ?? f.Id, name: f.name ?? f.Name }));
      setFranchises(franchiseList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDepartmentChange = (val) => {
    setSelectedDept(val);
    setCourses([]);
    setBulkAmount("");
    setCourseSearch(""); // Search clear on dept change
  };

  const handleFranchiseChange = (val) => {
    setSelectedFranchise(val);
  };

  const handleView = async () => {
    if (!selectedDept) {
      alert("Please select a department");
      return;
    }

    try {
      setLoading(true);
      setCourses([]);
      setBulkAmount("");
      setCourseSearch(""); // Clear search on new load

      const res = await SetFranchiseCourseAmount(
        selectedDept,
        selectedFranchise || null
      );
      const list = res?.data || res || [];

      setCourses(
        list.map((c) => ({
          courseId: c.id ?? c.Id,
          courseName: c.name ?? c.Name,
          amount:
            c.amount !== null && c.amount !== undefined && c.amount !== ""
              ? String(c.amount)
              : "0",
        }))
      );
    } catch (err) {
      console.log("Load courses error:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (courseId, value) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.courseId === courseId ? { ...c, amount: value } : c
      )
    );
  };

  const handleApplyToAll = () => {
    if (bulkAmount === "" || Number(bulkAmount) < 0) {
      alert("Pehle valid amount daalo");
      return;
    }
    setCourses((prev) => prev.map((c) => ({ ...c, amount: bulkAmount })));
  };

  const handleSave = async () => {
    if (!selectedDept) {
      alert("Please select a department");
      return;
    }

    if (courses.length === 0) {
      alert("No courses to save");
      return;
    }

    const payload = courses.map((c) => ({
      productId: c.courseId,
      amount: Number(c.amount) || 0,
      departmentId: Number(selectedDept),
      franchiseId: selectedFranchise ? Number(selectedFranchise) : null,
    }));

    try {
      const res = await sendToSaveCommission(payload);
      alert("Saved successfully!");

      setSelectedDept("");
      setSelectedFranchise("");
      setCourses([]);
      setBulkAmount("");
      setCourseSearch(""); // Reset search
    } catch (err) {
      alert(
        err?.response?.data?.message ??
        err?.response?.data ??
        "Something went wrong"
      );
    }
  };

  // ✅ FILTER LOGIC FOR TABLE
  const filteredCourses = courses.filter((c) => {
    const searchLower = courseSearch.toLowerCase();
    return (
      c.courseName.toLowerCase().includes(searchLower) ||
      String(c.courseId).toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="fc-page">
        <div className="fc-card">
          {/* Header */}
          <div className="fc-header">
            <h2>Franchise Commission</h2>
            <p className="fc-subtitle">
              Set commission amount per course for the selected department
            </p>
          </div>

          {/* Row: Franchise + Department + View button */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-4">
              <label className="fc-label">
                Franchise <span className="fc-optional">(optional)</span>
              </label>
              <SearchableSelect
                options={franchises}
                value={selectedFranchise}
                onChange={handleFranchiseChange}
                placeholder="-- Select Franchise --"
                labelKey="name"
                valueKey="id"
              />
            </div>

            <div className="col-md-4">
              <label className="fc-label">
                Department <span className="fc-required">*</span>
              </label>
              <SearchableSelect
                options={departments}
                value={selectedDept}
                onChange={handleDepartmentChange}
                placeholder="-- Select Department --"
                labelKey="name"
                valueKey="id"
              />
            </div>

            <div className="col-md-4">
              <button
                className="btn-view"
                onClick={handleView}
                disabled={!selectedDept || loading}
              >
                {loading ? "Loading..." : "View"}
              </button>
            </div>
          </div>

          {/* Bulk amount */}
          {courses.length > 0 && (
            <div className="fc-bulk">
              <div className="fc-bulk-left">
                <span className="fc-bulk-icon">⚡</span>
                <div>
                  <div className="fc-bulk-title">Bulk Apply</div>
                  <div className="fc-bulk-hint">
                    Set same amount for all courses
                  </div>
                </div>
              </div>
              <div className="fc-bulk-right">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                  min="0"
                />
                <button className="btn-bulk" onClick={handleApplyToAll}>
                  Apply to All
                </button>
              </div>
            </div>
          )}

          {/* ✅ SEARCH BAR FOR TABLE */}
          {courses.length > 0 && !loading && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 text-muted" style={{ fontWeight: 600, color: '#475569' }}>Course List</h6>
              <div style={{ position: 'relative', width: '300px' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Course Name or ID..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  style={{ paddingLeft: '35px', height: '40px', borderRadius: '8px', fontSize: '13px', border: '1.5px solid #e2e8f0' }}
                />
              </div>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="fc-empty">Loading...</div>
          ) : courses.length > 0 ? (
            <>
              <div className="fc-table-wrapper">
                <table className="fc-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>#</th>
                      <th style={{ width: "140px" }}>Course Id</th>
                      <th>Course Name</th>
                      <th style={{ width: "220px" }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((c, idx) => (
                        <tr key={c.courseId}>
                          <td>
                            <span className="fc-row-num">{idx + 1}</span>
                          </td>
                          <td>
                            <span className="fc-badge">{c.courseId}</span>
                          </td>
                          <td className="fc-course-name">{c.courseName}</td>
                          <td>
                            <div className="fc-input-wrap">
                              <span className="fc-currency">₹</span>
                              <input
                                type="number"
                                value={c.amount}
                                placeholder="0"
                                min="0"
                                onChange={(e) =>
                                  handleAmountChange(c.courseId, e.target.value)
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No courses found matching "{courseSearch}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="fc-footer">
                <button className="btn-save" onClick={handleSave}>
                  Save Commission
                </button>
              </div>
            </>
          ) : (
            <div className="fc-empty">
              {selectedDept
                ? "Click 'View' to load courses"
                : "Please select a department and click View"}
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* ================= SEARCHABLE DROPDOWN CSS ================= */
        .searchable-select-wrapper { position: relative; width: 100%; }
        .searchable-dropdown-menu { position: absolute; top: 105%; left: 0; width: 100%; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; z-index: 1050; overflow: hidden; margin-top: 4px; }
        .searchable-list { max-height: 220px; overflow-y: auto; }
        .searchable-list::-webkit-scrollbar { width: 6px; }
        .searchable-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .searchable-item { padding: 10px 14px; font-size: 13.5px; color: #334155; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.15s ease; }
        .searchable-item:last-child { border-bottom: 0; }
        .searchable-item:hover { background: #f8fafc; color: #4154f1; }
        .searchable-item.active { background: #eef2ff; color: #4154f1; font-weight: 600; }
        
        /* Modern input style for select trigger */
        .modern-input { height: 46px; border: 1px solid #e2e8f0; border-radius: 10px !important; padding-left: 14px; font-size: 14px; color: #334155; background: #fff; transition: all .2s ease; }
        .modern-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, .10); }
        .modern-select { cursor: pointer; }

        /* ---------- Page ---------- */
        .fc-page {
          min-height: 100vh;
          padding: 32px 16px;
          background: linear-gradient(135deg, #f0f4ff 0%, #f9fafb 100%);
          font-family: "Inter", "Segoe UI", sans-serif;
        }

        .fc-card {
          max-width: 1000px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
          padding: 28px 32px 32px;
          border: 1px solid #eef2f7;
        }

        /* ---------- Header ---------- */
        .fc-header {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eef2f7;
        }

        .fc-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.3px;
        }

        .fc-subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }

        /* ---------- Labels ---------- */
        .fc-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
          display: block;
          letter-spacing: 0.2px;
        }

        .fc-optional {
          font-weight: 400;
          color: #94a3b8;
          font-size: 12px;
        }

        .fc-required {
          color: #ef4444;
        }

        /* ---------- View button ---------- */
        .btn-view {
          width: 100%;
          padding: 10px 20px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
          height: 46px; /* Match height with searchable dropdown */
        }

        .btn-view:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        .btn-view:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          box-shadow: none;
          color: #94a3b8;
        }

        /* ---------- Bulk bar ---------- */
        .fc-bulk {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
          border: 1px solid #e0e7ff;
          border-radius: 10px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .fc-bulk-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fc-bulk-icon {
          font-size: 20px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.15);
        }

        .fc-bulk-title {
          font-size: 14px;
          font-weight: 600;
          color: #3730a3;
        }

        .fc-bulk-hint {
          font-size: 12px;
          color: #6366f1;
          margin-top: 2px;
        }

        .fc-bulk-right {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .fc-bulk-right input {
          width: 160px;
          padding: 9px 12px;
          border: 1.5px solid #c7d2fe;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          background: #fff;
          transition: all 0.2s ease;
        }

        .fc-bulk-right input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .btn-bulk {
          padding: 9px 18px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        }

        .btn-bulk:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        /* ---------- Table ---------- */
        .fc-table-wrapper {
          border: 1px solid #eef2f7;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
        }

        .fc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .fc-table thead {
          background: #f8fafc;
        }

        .fc-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 1px solid #eef2f7;
        }

        .fc-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }

        .fc-table tbody tr:last-child td {
          border-bottom: none;
        }

        .fc-table tbody tr:hover {
          background: #f8fafc;
        }

        .fc-row-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          background: #f1f5f9;
          color: #475569;
          font-size: 12.5px;
          font-weight: 600;
          border-radius: 6px;
        }

        .fc-badge {
          display: inline-block;
          padding: 4px 10px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12.5px;
          font-weight: 600;
          border-radius: 6px;
          font-family: "JetBrains Mono", monospace;
        }

        .fc-course-name {
          font-weight: 500;
          color: #0f172a;
        }

        /* ---------- Amount input ---------- */
        .fc-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .fc-currency {
          position: absolute;
          left: 12px;
          font-size: 14px;
          color: #94a3b8;
          font-weight: 500;
          pointer-events: none;
        }

        .fc-input-wrap input {
          width: 100%;
          padding: 9px 12px 9px 30px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          background: #fff;
          transition: all 0.2s ease;
          color: #0f172a;
          font-weight: 500;
        }

        .fc-input-wrap input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .fc-input-wrap input::-webkit-outer-spin-button,
        .fc-input-wrap input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* ---------- Footer ---------- */
        .fc-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #eef2f7;
        }

        .btn-save {
          padding: 11px 28px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 3px 10px rgba(16, 185, 129, 0.25);
        }

        .btn-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(16, 185, 129, 0.35);
        }

        /* ---------- Empty state ---------- */
        .fc-empty {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
          font-size: 14px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px dashed #e2e8f0;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 640px) {
          .fc-card {
            padding: 20px 16px;
          }

          .fc-bulk {
            flex-direction: column;
            align-items: stretch;
          }

          .fc-bulk-right {
            width: 100%;
          }

          .fc-bulk-right input {
            flex: 1;
          }

          .fc-table th,
          .fc-table td {
            padding: 10px 10px;
            font-size: 13px;
          }

          .fc-footer {
            justify-content: stretch;
          }

          .btn-save {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default FranchiseCommission;