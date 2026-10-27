 import React, { useEffect, useState } from "react";
import {
  createMasterSession,
  getMasterSession,
  getMasterSessionById,
  getMasterSessionDelete,
  getStudentMasterSessions,
  updateMasterSession
} from "../../AllServicesFiles/MasterSessionService";

function MasterSession() {
  const [data, setData] = useState([]);
  const [masterTypes, setMasterTypes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSessionName, setDeleteSessionName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  // =========================================================
  // ✅ TOAST STATE & FUNCTION
  // =========================================================
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000); // 3 seconds baad gayab ho jayega
  };

  const [formData, setFormData] = useState({
    id: 0,
    shortName: "",
    name: "",
    startDate: "",
    endDate: "",
    issueDate: "",
    isActive: 1,
    masterSessionId: 0
  });

  useEffect(() => {
    loadDuration();
    loadMasterSessions();
  }, []);

  const loadDuration = async () => {
    try {
      const result = await getStudentMasterSessions(15);
      setMasterTypes(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMasterSessions = async () => {
    try {
      const result = await getMasterSession();
      setData(result.data);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      shortName: "",
      name: "",
      startDate: "",
      endDate: "",
      issueDate: "",
      isActive: 0,
      masterSessionId: 0
    });
  };

  const handleEdit = async (id) => {
    try {
      const result = await getMasterSessionById(id);
      setFormData({
        id: result.id,
        shortName: result.shortName,
        name: result.name,
        startDate: result.startDate1,
        endDate: result.endDate1,
        issueDate: result.issueDate1,
        isActive: result.isActive,
        masterSessionId: result.masterSessionId
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteSessionName(name);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteId(null);
    setDeleteSessionName("");
  };

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;
      setDeleteLoading(true);
      const result = await getMasterSessionDelete(deleteId);
      showToast(result?.message || result || "Master Session deleted successfully", "success");
      closeDeleteModal();
      await loadMasterSessions();
    } catch (error) {
      console.log(error);
      showToast("Unable to delete session.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let result;
      if (formData.id > 0) {
        result = await updateMasterSession(formData);
      } else {
        result = await createMasterSession(formData);
      }
      showToast(result.message || "Master Session saved successfully", "success");
      await loadMasterSessions();
      resetForm();
    } catch (error) {
      console.log(error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase().trim();
    return (
      item.shortName?.toString().toLowerCase().includes(search) ||
      item.name?.toString().toLowerCase().includes(search) ||
      item.startDate1?.toString().toLowerCase().includes(search) ||
      item.endDate1?.toString().toLowerCase().includes(search) ||
      item.issueDate1?.toString().toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="ms-page">
      {/* ✅ TOAST UI */}
      {toast.show && (
        <div className="custom-toast-container">
          <div className={`custom-toast ${toast.type}`}>
            <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            {toast.message}
          </div>
        </div>
      )}

      <style>{`
        /* ================= TOAST CSS ================= */
        .custom-toast-container {
          position: fixed;
          top: 25px;
          right: 25px;
          z-index: 99999;
          animation: slideInRight 0.3s ease-out forwards;
        }

        .custom-toast {
          min-width: 300px;
          padding: 16px 20px;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .custom-toast.success { background: #16a34a; }
        .custom-toast.error { background: #dc2626; }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* ================= PAGE ================= */
        html, body, #root {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden !important;
          box-sizing: border-box;
        }

        .ms-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
          padding: 8px 0;
          background: #f6f8fb;
        }

        /* ================= HEADER ================= */
        .ms-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .ms-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ms-header-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          font-size: 24px;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.28);
        }

        .ms-header-title {
          margin: 0 0 3px;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -.3px;
        }

        .ms-header-subtitle {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }

        .ms-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #94a3b8;
        }

        .ms-breadcrumb a {
          color: #64748b;
          text-decoration: none;
          transition: color .15s;
        }

        .ms-breadcrumb a:hover { color: #6366f1; }

        .ms-breadcrumb .active {
          color: #6366f1;
          font-weight: 600;
        }

        /* ================= CARD ================= */
        .ms-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          margin-bottom: 20px;
          box-sizing: border-box;
        }

        /* ================= FORM HEADER ================= */
        .ms-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ms-form-header-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .ms-form-header-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(6px);
          font-size: 19px;
        }

        .ms-form-header h3 {
          margin: 0 0 2px;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }

        .ms-form-header p {
          margin: 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        .ms-edit-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(6px);
          font-size: 11.5px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* ================= FORM BODY ================= */
        .ms-form-body {
          padding: 26px;
        }

        .ms-section {
          margin-bottom: 24px;
        }

        .ms-section:last-child {
          margin-bottom: 0;
        }

        .ms-section-head {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px dashed #e8edf3;
        }

        .ms-section-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 16px;
        }

        .ms-section-icon.blue {
          background: #eef4ff;
          color: #2563eb;
        }

        .ms-section-icon.green {
          background: #ecfdf3;
          color: #16a34a;
        }

        .ms-section-head h4 {
          margin: 0 0 2px;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .ms-section-head p {
          margin: 0;
          font-size: 11.5px;
          color: #94a3b8;
        }

        /* ================= FORM GRID ================= */
        .ms-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .ms-grid .span-2 {
          grid-column: span 2;
        }

        .ms-field {
          display: flex;
          flex-direction: column;
        }

        .ms-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 7px;
        }

        .ms-label .req {
          color: #ef4444;
          margin-left: 3px;
        }

        .ms-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ms-input-wrap .ms-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 15px;
          pointer-events: none;
          z-index: 2;
          transition: color .2s;
        }

        .ms-input-wrap:focus-within .ms-icon {
          color: #6366f1;
        }

        .ms-input {
          width: 100%;
          height: 46px;
          padding: 0 14px 0 42px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          color: #1e293b;
          font-size: 13.5px;
          outline: none;
          transition: all .2s ease;
          font-family: inherit;
          box-sizing: border-box;
        }

        .ms-input:hover:not(:focus):not(:disabled) {
          border-color: #cbd5e1;
        }

        .ms-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
          background: #fefeff;
        }

        .ms-input::placeholder {
          color: #a0a8b5;
        }

        .ms-input:disabled {
          background: #f5f6f8;
          cursor: not-allowed;
          color: #94a3b8;
        }

        select.ms-input {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 38px;
        }

        /* ================= STATUS TOGGLE ================= */
        .ms-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: #fafbff;
          border: 1.5px solid #e8edf3;
          border-radius: 12px;
          gap: 14px;
        }

        .ms-status-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .ms-status-dot {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          font-size: 17px;
          transition: all .2s;
        }

        .ms-status-dot.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .ms-status-dot.inactive {
          background: #f1f5f9;
          color: #64748b;
        }

        .ms-status-label {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .ms-status-sub {
          font-size: 11.5px;
          color: #94a3b8;
        }

        .ms-switch {
          width: 46px !important;
          height: 24px;
          cursor: pointer;
          border: none;
          background-color: #cbd5e1;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
          background-position: left center;
          background-repeat: no-repeat;
          border-radius: 999px;
          transition: all .2s;
          appearance: none;
          outline: none;
        }

        .ms-switch:checked {
          background-color: #16a34a;
          background-position: right center;
        }

        /* ================= FORM FOOTER ================= */
        .ms-form-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid #e8edf3;
          margin-top: 6px;
        }

        .ms-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 44px;
          padding: 0 22px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
          font-family: inherit;
          border: none;
          white-space: nowrap;
        }

        .ms-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ms-btn-ghost {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          color: #475569;
        }

        .ms-btn-ghost:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .ms-btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        }

        .ms-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        /* ================= LIST HEADER ================= */
        .ms-list-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          gap: 16px;
          flex-wrap: wrap;
          border-bottom: 1px solid #e8edf3;
        }

        .ms-list-title {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .ms-list-title-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #f3e8ff;
          color: #7c3aed;
          font-size: 17px;
        }

        .ms-list-title h3 {
          margin: 0 0 2px;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .ms-list-title p {
          margin: 0;
          font-size: 11.5px;
          color: #94a3b8;
        }

        .ms-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 30px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 12px;
          font-weight: 700;
        }

        /* ================= TOOLBAR ================= */
        .ms-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          gap: 14px;
          flex-wrap: wrap;
          background: #fafbfc;
          border-bottom: 1px solid #e8edf3;
        }

        .ms-toolbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #64748b;
        }

        .ms-toolbar-select {
          height: 38px;
          width: 78px;
          padding: 0 30px 0 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          background: #fff;
          color: #1e293b;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 9px center;
          background-size: 14px;
        }

        .ms-toolbar-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .ms-search {
          position: relative;
          width: 280px;
          max-width: 100%;
        }

        .ms-search i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 15px;
        }

        .ms-search input {
          width: 100%;
          height: 40px;
          padding: 0 14px 0 40px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          font-size: 13.5px;
          color: #1e293b;
          outline: none;
          transition: all .2s;
        }

        .ms-search input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        /* ================= TABLE ================= */
        .ms-table-wrap {
          display: block !important;
          width: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          box-sizing: border-box !important;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #c9ced8 #eef1f5;
        }

        .ms-table-wrap::-webkit-scrollbar { height: 9px; }

        .ms-table-wrap::-webkit-scrollbar-track {
          background: #eef1f5;
          border-radius: 10px;
        }

        .ms-table-wrap::-webkit-scrollbar-thumb {
          background: #c9ced8;
          border-radius: 10px;
        }

        .ms-table-wrap::-webkit-scrollbar-thumb:hover {
          background: #aeb5c2;
        }

        .ms-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
          table-layout: auto !important;
        }

        .ms-table thead th {
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .5px;
          padding: 14px 18px;
          white-space: nowrap;
          border-bottom: 1px solid #e9eef5;
          text-align: left;
        }

        .ms-table tbody td {
          padding: 14px 18px;
          font-size: 13.5px;
          color: #334155;
          vertical-align: middle;
          border-bottom: 1px solid #f1f5f9;
          white-space: nowrap;
        }

        .ms-table tbody tr:last-child td {
          border-bottom: none;
        }

        .ms-table tbody tr {
          transition: background .15s ease;
        }

        .ms-table tbody tr:hover {
          background: #fafbff;
        }

        /* ================= ✅ STICKY ACTION COLUMN ================= */
        .ms-table th.sticky-action,
        .ms-table td.sticky-action {
          position: sticky !important;
          right: 0 !important;
          z-index: 5; /* Data ke upar dikhne ke liye */
          background-color: #fff; /* White background taake text overlap na ho */
          box-shadow: -4px 0 10px -5px rgba(0, 0, 0, 0.1); /* Left side par shadow */
        }

        .ms-table thead th.sticky-action {
          background-color: #f8fafc !important;
          z-index: 6; /* Header aur data ke beech layer manage karne ke liye */
        }

        .ms-table tbody tr:hover td.sticky-action {
          background-color: #fafbff !important;
        }

        /* ================= TABLE CELLS ================= */
        .ms-session-cell {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .ms-session-avatar {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          font-size: 16px;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.22);
        }

        .ms-session-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
        }

        .ms-session-id {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 1px;
        }

        .ms-name-text {
          font-size: 13.5px;
          font-weight: 600;
          color: #1e293b;
        }

        .ms-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
        }

        .ms-date-badge.start {
          background: #ecfdf3;
          color: #15803d;
        }

        .ms-date-badge.end {
          background: #fef2f2;
          color: #b91c1c;
        }

        .ms-date-badge.issue {
          background: #fff7ed;
          color: #c2410c;
        }

        .ms-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
        }

        .ms-status-badge.active {
          background: #ecfdf3;
          color: #15803d;
        }

        .ms-status-badge.inactive {
          background: #f1f5f9;
          color: #64748b;
        }

        .ms-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        /* ================= ACTIONS ================= */
        .ms-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .ms-action-btn {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          border: 1.5px solid;
          background: #fff;
          font-size: 14px;
          cursor: pointer;
          transition: all .2s ease;
        }

        .ms-action-btn.edit {
          color: #6366f1;
          border-color: #dfe3ff;
        }

        .ms-action-btn.edit:hover {
          background: #6366f1;
          border-color: #6366f1;
          color: #fff;
          transform: translateY(-1px);
        }

        .ms-action-btn.delete {
          color: #dc2626;
          border-color: #fecaca;
        }

        .ms-action-btn.delete:hover {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
          transform: translateY(-1px);
        }

        /* ================= EMPTY ================= */
        .ms-empty {
          padding: 60px 20px;
          text-align: center;
        }

        .ms-empty-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          font-size: 30px;
        }

        .ms-empty h5 {
          margin: 0 0 6px;
          font-size: 15px;
          font-weight: 700;
          color: #334155;
        }

        .ms-empty p {
          margin: 0;
          font-size: 13px;
          color: #94a3b8;
        }

        /* ================= PAGINATION ================= */
        .ms-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          padding: 18px 24px;
          border-top: 1px solid #e8edf3;
          background: #fff;
        }

        .ms-page-info {
          font-size: 12.5px;
          color: #64748b;
        }

        .ms-page-info strong {
          color: #1e293b;
        }

        .ms-page-btns {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ms-page-btn {
          min-width: 38px;
          height: 38px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          color: #475569;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all .15s;
          font-family: inherit;
        }

        .ms-page-btn:hover:not(:disabled) {
          border-color: #6366f1;
          color: #6366f1;
        }

        .ms-page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ms-page-btn.active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-color: #6366f1;
          color: #fff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        /* ================= MODAL ================= */
        .ms-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          animation: msFadeIn .15s ease;
        }

        @keyframes msFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ms-modal {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(15, 23, 42, 0.28);
          animation: msModalIn .2s ease;
        }

        @keyframes msModalIn {
          from { opacity: 0; transform: translateY(10px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ms-modal-top {
          padding: 32px 24px 24px;
          text-align: center;
          background: linear-gradient(180deg, #fef7f7 0%, #ffffff 100%);
        }

        .ms-modal-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff1f2;
          color: #dc2626;
          font-size: 30px;
        }

        .ms-modal h3 {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .ms-modal p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }

        .ms-modal-record {
          margin: 20px 24px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e8edf3;
          border-radius: 12px;
        }

        .ms-modal-record-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #eef2ff;
          color: #4338ca;
          font-weight: 700;
          font-size: 15px;
        }

        .ms-modal-record-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: .5px;
          margin-bottom: 2px;
        }

        .ms-modal-record-value {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .ms-modal-footer {
          padding: 16px 24px 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .ms-modal-footer .ms-btn {
          flex: 1;
          max-width: 180px;
        }

        .ms-btn-danger {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
        }

        .ms-btn-danger:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 900px) {
          .ms-page { padding: 0; }

          .ms-header-icon {
            width: 46px;
            height: 46px;
            font-size: 20px;
          }

          .ms-header-title { font-size: 20px; }

          .ms-form-body { padding: 20px; }

          .ms-grid {
            grid-template-columns: 1fr 1fr;
          }

          .ms-grid .span-2 {
            grid-column: span 2;
          }

          .ms-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .ms-search { width: 100%; }
        }

        @media (max-width: 640px) {
          .ms-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .ms-header-title { font-size: 18px; }

          .ms-form-header {
            padding: 16px 18px;
          }

          .ms-form-header h3 { font-size: 15px; }

          .ms-form-body { padding: 16px; }

          .ms-grid { grid-template-columns: 1fr; }

          .ms-grid .span-2 {
            grid-column: span 1;
          }

          .ms-list-head,
          .ms-toolbar,
          .ms-pagination {
            padding-left: 16px;
            padding-right: 16px;
          }

          .ms-pagination {
            flex-direction: column;
            align-items: stretch;
          }

          .ms-page-btns {
            justify-content: center;
            flex-wrap: wrap;
          }

          .ms-page-btn {
            min-width: 34px;
            height: 34px;
          }

          .ms-status-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .ms-modal-footer {
            flex-direction: column;
          }

          .ms-modal-footer .ms-btn {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <div className="ms-header">
        <div className="ms-header-left">
          <div className="ms-header-icon">
            <i className="bi bi-calendar3"></i>
          </div>
          <div>
            <h1 className="ms-header-title">Master Sessions</h1>
            <p className="ms-header-subtitle">
              Manage academic sessions and session periods
            </p>
          </div>
        </div>

        <div className="ms-breadcrumb">
          <a href="index.html">
            <i className="bi bi-house-door me-1"></i>Dashboard
          </a>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }}></i>
          <span>Master Detail</span>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }}></i>
          <span className="active">Sessions</span>
        </div>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="ms-card">
        <div className="ms-form-header">
          <div className="ms-form-header-left">
            <div className="ms-form-header-icon">
              <i className={formData.id > 0 ? "bi bi-pencil-square" : "bi bi-plus-lg"}></i>
            </div>
            <div>
              <h3>{formData.id > 0 ? "Edit Master Session" : "Create Master Session"}</h3>
              <p>
                {formData.id > 0
                  ? "Update session details and dates"
                  : "Configure session name, dates and status"}
              </p>
            </div>
          </div>

          {formData.id > 0 && (
            <div className="ms-edit-badge">
              <i className="bi bi-pencil"></i>
              Editing #{formData.id}
            </div>
          )}
        </div>

        <div className="ms-form-body">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={formData.id} />

            {/* SESSION INFORMATION */}
            <div className="ms-section">
              <div className="ms-section-head">
                <div className="ms-section-icon blue">
                  <i className="bi bi-info-circle-fill"></i>
                </div>
                <div>
                  <h4>Session Information</h4>
                  <p>Basic session details and name</p>
                </div>
              </div>

              <div className="ms-grid">
                <div className="ms-field">
                  <label className="ms-label">
                    Master Session<span className="req">*</span>
                  </label>
                  <div className="ms-input-wrap">
                    <i className="bi bi-diagram-3 ms-icon"></i>
                    <select
                      className="ms-input"
                      value={formData.masterSessionId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          masterSessionId: Number(e.target.value)
                        })
                      }
                      required
                    >
                      <option value={0}>Select Master Session</option>
                      {masterTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ms-field">
                  <label className="ms-label">Short Name</label>
                  <div className="ms-input-wrap">
                    <i className="bi bi-tag ms-icon"></i>
                    <input
                      type="text"
                      name="shortName"
                      className="ms-input"
                      placeholder="e.g. 2025-26"
                      value={formData.shortName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ms-field">
                  <label className="ms-label">
                    Session Name<span className="req">*</span>
                  </label>
                  <div className="ms-input-wrap">
                    <i className="bi bi-pencil ms-icon"></i>
                    <input
                      type="text"
                      name="name"
                      className="ms-input"
                      placeholder="Enter session name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SESSION DATES */}
            <div className="ms-section">
              <div className="ms-section-head">
                <div className="ms-section-icon green">
                  <i className="bi bi-calendar-event-fill"></i>
                </div>
                <div>
                  <h4>Session Dates</h4>
                  <p>Define the session timeline</p>
                </div>
              </div>

              <div className="ms-grid">
                <div className="ms-field">
                  <label className="ms-label">
                    Start Date<span className="req">*</span>
                  </label>
                  <div className="ms-input-wrap">
                    <i className="bi bi-calendar-check ms-icon"></i>
                    <input
                      type="date"
                      name="startDate"
                      className="ms-input"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="ms-field">
                  <label className="ms-label">
                    End Date<span className="req">*</span>
                  </label>
                  <div className="ms-input-wrap">
                    <i className="bi bi-calendar-x ms-icon"></i>
                    <input
                      type="date"
                      name="endDate"
                      className="ms-input"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="ms-field">
                  <label className="ms-label">
                    Issue Date<span className="req">*</span>
                  </label>
                  <div className="ms-input-wrap">
                    <i className="bi bi-calendar-plus ms-icon"></i>
                    <input
                      type="date"
                      name="issueDate"
                      className="ms-input"
                      value={formData.issueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="ms-section">
              <div className="ms-status-row">
                <div className="ms-status-left">
                  <div className={`ms-status-dot ${formData.isActive === 1 ? "active" : "inactive"}`}>
                    <i className={formData.isActive === 1 ? "bi bi-check-lg" : "bi bi-pause-fill"}></i>
                  </div>
                  <div>
                    <div className="ms-status-label">
                      {formData.isActive === 1 ? "Active Session" : "Inactive Session"}
                    </div>
                    <div className="ms-status-sub">
                      {formData.isActive === 1
                        ? "This session is currently active"
                        : "This session is currently inactive"}
                    </div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="ms-switch"
                  checked={formData.isActive === 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.checked ? 1 : 0
                    })
                  }
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="ms-form-footer">
              {formData.id > 0 && (
                <button type="button" className="ms-btn ms-btn-ghost" onClick={resetForm}>
                  <i className="bi bi-x-lg"></i>
                  Cancel
                </button>
              )}
              <button type="submit" className="ms-btn ms-btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className={formData.id > 0 ? "bi bi-check2-circle" : "bi bi-plus-circle"}></i>
                    {formData.id > 0 ? "Update Session" : "Create Session"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= LIST CARD ================= */}
      <div className="ms-card">
        <div className="ms-list-head">
          <div className="ms-list-title">
            <div className="ms-list-title-icon">
              <i className="bi bi-list-ul"></i>
            </div>
            <div>
              <h3>Session Directory</h3>
              <p>View and manage all master sessions</p>
            </div>
          </div>

          <div className="ms-count-badge">
            <i className="bi bi-collection"></i>
            {filteredData.length} {filteredData.length === 1 ? "Record" : "Records"}
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="ms-toolbar">
          <div className="ms-toolbar-left">
            <span>Show</span>
            <select
              className="ms-toolbar-select"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="ms-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="ms-table-wrap">
          <table className="ms-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Session Type</th>
                <th>Session</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Issue Date</th>
                <th style={{ textAlign: "center" }}>Status</th>
                {/* ✅ ADDED sticky-action CLASS */}
                <th className="sticky-action" style={{ textAlign: "center", width: "120px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                        {startIndex + index + 1}
                      </span>
                    </td>
                    <td>
                      <span className="ms-name-text">{item.masterSessionName}</span>
                    </td>
                    <td>
                      <div className="ms-session-cell">
                        <div className="ms-session-avatar">
                          <i className="bi bi-calendar3"></i>
                        </div>
                        <div>
                          <div className="ms-session-name">
                            {item.shortName || "-"}
                          </div>
                          <div className="ms-session-id">ID #{item.id}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="ms-name-text">{item.name}</span>
                    </td>

                    <td>
                      <span className="ms-date-badge start">
                        <i className="bi bi-calendar-check"></i>
                        {item.startDate1}
                      </span>
                    </td>

                    <td>
                      <span className="ms-date-badge end">
                        <i className="bi bi-calendar-x"></i>
                        {item.endDate1}
                      </span>
                    </td>

                    <td>
                      <span className="ms-date-badge issue">
                        <i className="bi bi-calendar-plus"></i>
                        {item.issueDate1}
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span className={`ms-status-badge ${item.isActive == 1 ? "active" : "inactive"}`}>
                        <span className="ms-dot"></span>
                        {item.isActive == 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ✅ ADDED sticky-action CLASS */}
                    <td className="sticky-action">
                      <div className="ms-actions">
                        <button
                          type="button"
                          className="ms-action-btn edit"
                          title="Edit"
                          onClick={() => handleEdit(item.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="ms-action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(item.id, item.name)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* ✅ FIXED colSpan to 9 */}
                  <td colSpan="9">
                    <div className="ms-empty">
                      <div className="ms-empty-icon">
                        <i className="bi bi-calendar-x"></i>
                      </div>
                      <h5>No Sessions Found</h5>
                      <p>
                        {searchTerm
                          ? "Try changing your search criteria."
                          : "There are no sessions available."}
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
          <div className="ms-pagination">
            <div className="ms-page-info">
              {filteredData.length > 0 ? (
                <>
                  Showing{" "}
                  <strong>{startIndex + 1}</strong> to{" "}
                  <strong>{Math.min(endIndex, filteredData.length)}</strong> of{" "}
                  <strong>{filteredData.length}</strong> entries
                </>
              ) : (
                "No records"
              )}
            </div>

            <div className="ms-page-btns">
              <button
                type="button"
                className="ms-page-btn"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                <i className="bi bi-chevron-left"></i>
                <span className="d-none d-sm-inline">Previous</span>
              </button>

              {getPageNumbers().map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`ms-page-btn ${currentPage === page ? "active" : ""}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="ms-page-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                <span className="d-none d-sm-inline">Next</span>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= DELETE MODAL ================= */}
      {deleteModal && (
        <div className="ms-modal-overlay" onClick={closeDeleteModal}>
          <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ms-modal-top">
              <div className="ms-modal-icon">
                <i className="bi bi-trash3-fill"></i>
              </div>
              <h3>Delete Session?</h3>
              <p>
                This action cannot be undone. The session will be permanently
                removed from the system.
              </p>
            </div>

            <div className="ms-modal-record">
              <div className="ms-modal-record-icon">
                {deleteSessionName?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div>
                <div className="ms-modal-record-label">Session</div>
                <div className="ms-modal-record-value">{deleteSessionName}</div>
              </div>
            </div>

            <div className="ms-modal-footer">
              <button
                type="button"
                className="ms-btn ms-btn-ghost"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ms-btn ms-btn-danger"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash3"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterSession;