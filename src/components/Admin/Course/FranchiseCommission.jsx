 import React, { useEffect, useState } from "react";
import { getCourseType, sendToSaveCommission, SetFranchiseCourseAmount } from "./CourseService";
import { getFrenchisesAssign1 } from "../WalletWorking/WalletService";

function FranchiseCommission() {
  const [departments, setDepartments] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [bulkAmount, setBulkAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDepartments();
    loadFranchises();
  }, []);

  const loadDepartments = async () => {
    try {
      const result = await getCourseType(13);
      setDepartments(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadFranchises = async () => {
    try {
      const result = await getFrenchisesAssign1(9);
      setFranchises(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Department change — state set karo + list clear
  const handleDepartmentChange = (e) => {
    setSelectedDept(e.target.value);
    setCourses([]);
    setBulkAmount("");
  };

  // ✅ Franchise change — sirf state set karo, list clear NA karo
  const handleFranchiseChange = (e) => {
    setSelectedFranchise(e.target.value);
  };

  // View button — API call
  const handleView = async () => {
    if (!selectedDept) {
      alert("Please select a department");
      return;
    }

    try {
      setLoading(true);
      setCourses([]);
      setBulkAmount("");

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

  // Save — success pe sab reset
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

    console.log("Save payload:", payload);

    try {
      const res = await sendToSaveCommission(payload);
      console.log("Save response:", res);

      alert("Saved successfully!");

      // ✅ SAB RESET
      setSelectedDept("");
      setSelectedFranchise("");
      setCourses([]);
      setBulkAmount("");
    } catch (err) {
      console.log("Save error:", err);
      alert(
        err?.response?.data?.message ??
        err?.response?.data ??
        "Something went wrong"
      );
    }
  };

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
            {/* Franchise — optional */}
            <div className="col-md-4">
              <label className="fc-label">
                Franchise <span className="fc-optional">(optional)</span>
              </label>
              <select
                className="form-select"
                value={selectedFranchise}
                onChange={handleFranchiseChange}
              >
                <option value="">-- Select Franchise --</option>
                {franchises.map((f) => (
                  <option key={f.id ?? f.Id} value={f.id ?? f.Id}>
                    {f.name ?? f.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department — required */}
            <div className="col-md-4">
              <label className="fc-label">
                Department <span className="fc-required">*</span>
              </label>
              <select
                className="form-select"
                value={selectedDept}
                onChange={handleDepartmentChange}
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d.id ?? d.Id} value={d.id ?? d.Id}>
                    {d.name ?? d.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* View button */}
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
                    {courses.map((c, idx) => (
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
                    ))}
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

        /* ---------- Bootstrap form-select override ---------- */
        .fc-card .form-select {
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          color: #0f172a;
          background-color: #fff;
          transition: all 0.2s ease;
        }

        .fc-card .form-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
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