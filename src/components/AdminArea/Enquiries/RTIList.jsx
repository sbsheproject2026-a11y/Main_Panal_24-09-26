 import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
 
    deleteRTI,
  getRtiList,
  updateRtiStatus,
} from "../../AllServicesFiles/EmployeeService";
import { FILE_URL } from "../../api";
import { getStudentData } from "../../AllServicesFiles/StudentService";

function RTIList() {
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ====== STATUS MASTER (for dropdown) ✅ ======
  const [statusList, setStatusList] = useState([]);

  // ====== DELETE MODAL ======
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteName, setDeleteName] = useState("");

  // ====== UPDATE MODAL ======
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [updateName, setUpdateName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateRemark, setUpdateRemark] = useState("");
  const [updateError, setUpdateError] = useState("");

  // =========================================================
  // LOAD DATA
  // =========================================================
  useEffect(() => {
    loadRTIList();
    loadStatus();
  }, []);

  const loadRTIList = async () => {
    try {
      setLoading(true);
      const result = await getRtiList();
      console.log("RTI List:", result.data);
      setData(result.data?.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ============ LOAD STATUS MASTER ✅ ============
  const loadStatus = async () => {
    try {
      // ⚠️ Yahan apna Status master type ID daalo
      const STATUS_MASTER_ID = 4;   // 👈 APNI ID YAHAN DAALO

      const result = await getStudentData(STATUS_MASTER_ID);
      setStatusList(result?.data || []);
      console.log("Status List:", result?.data);
    } catch (error) {
      console.error("Status Error:", error);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setShowDeleteModal(false);
    setDeleteId(0);
    setDeleteName("");
  };

  const confirmDelete = async () => {
    try {
      if (!deleteId) return;
      setDeleteLoading(true);
      const result = await deleteRTI(deleteId);
      alert(result?.message || result || "RTI deleted successfully");
      closeDeleteModal();
      await loadRTIList();
    } catch (error) {
      console.log(error);
      alert("Unable to delete RTI.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================================
  // UPDATE
  // =========================================================
  const handleUpdate = (item) => {
    setUpdateId(item.id);
    setUpdateName(item.name || "");
    setUpdateStatus(item.statusId || "");
    setUpdateRemark(item.remarks || "");
    setUpdateError("");
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    if (updateLoading) return;
    setShowUpdateModal(false);
    setUpdateId(0);
    setUpdateName("");
    setUpdateStatus("");
    setUpdateRemark("");
    setUpdateError("");
  };

  const confirmUpdate = async () => {
    if (!updateStatus) {
      setUpdateError("Please select a status.");
      return;
    }
    if (!updateRemark.trim()) {
      setUpdateError("Please enter remark.");
      return;
    }

    try {
      setUpdateLoading(true);
      setUpdateError("");

      const payload = {
        id: updateId,
        statusId: Number(updateStatus),
        remarks: updateRemark.trim(),
      };

      const result = await updateRtiStatus(payload);
      console.log("Update Response:", result);
      alert(result?.message || "RTI updated successfully");
      closeUpdateModal();
      await loadRTIList();
    } catch (error) {
      console.log(error);
      setUpdateError(
        error?.response?.data?.message || "Unable to update RTI."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Status badge class — name ke hisaab se
  const getStatusClass = (statusName) => {
    const lower = (statusName || "").toLowerCase();
    if (lower.includes("approved")) return "approved";
    if (lower.includes("progress")) return "inprogress";
    if (lower.includes("reject")) return "rejected";
    return "pending";
  };

  // ✅ Applicant Type badge class — name ke hisaab se
  const getTypeClass = (typeName) => {
    const lower = (typeName || "").toLowerCase();
    if (lower.includes("government") || lower.includes("private")) return "govt";
    if (lower.includes("student")) return "student";
    if (lower.includes("study") || lower.includes("centre") || lower.includes("center")) return "centre";
    return "govt";
  };

  // =========================================================
  // FILTER
  // =========================================================
  const filteredData = data.filter((item) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return (
      item.name?.toString().toLowerCase().includes(search) ||
      item.mobileNo?.toString().toLowerCase().includes(search) ||
      item.email?.toString().toLowerCase().includes(search) ||
      item.trackingId?.toString().toLowerCase().includes(search) ||
      item.subject?.toString().toLowerCase().includes(search) ||
      item.infoRequired?.toString().toLowerCase().includes(search)
    );
  });

  // =========================================================
  // PAGINATION
  // =========================================================
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const startRecord = totalRecords === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(endIndex, totalRecords);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const pageNumbers = getPageNumbers();

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <style>{`
        html, body, #root {
          width: 100%; max-width: 100%;
          overflow-x: hidden !important;
        }
        .rti-page {
          width: 100%; max-width: 100%; min-width: 0;
          overflow-x: hidden; box-sizing: border-box;
        }

        /* HEADER */
        .rti-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 24px;
          gap: 15px; flex-wrap: wrap;
        }
        .rti-header h1 {
          margin: 0 0 6px; font-size: 26px; font-weight: 700;
          color: #1e293b; display: flex;
          align-items: center; gap: 10px;
        }
        .rti-header h1 i { color: #4154f1; }
        .rti-breadcrumb {
          margin: 0; padding: 0; background: transparent; font-size: 13px;
        }
        .rti-breadcrumb a { color: #4154f1; text-decoration: none; }
        .rti-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #4154f1, #6f7bf7);
          color: #fff; border-radius: 12px;
          font-size: 13px; font-weight: 600;
          box-shadow: 0 6px 18px rgba(65, 84, 241, 0.25);
        }

        /* CARD */
        .rti-card {
          width: 100%; max-width: 100%; min-width: 0;
          background: #fff; border-radius: 16px;
          border: 1px solid #e7eaf0;
          box-shadow: 0 5px 25px rgba(30, 41, 59, .06);
          overflow: hidden; box-sizing: border-box;
        }
        .rti-card-header {
          padding: 22px 24px;
          display: flex; justify-content: space-between;
          align-items: center; gap: 15px;
          border-bottom: 1px solid #edf0f5; flex-wrap: wrap;
        }
        .rti-card-header h5 {
          margin: 0 0 4px; font-size: 18px; font-weight: 700;
          color: #1e293b; display: flex;
          align-items: center; gap: 8px;
        }
        .rti-card-header h5 i { color: #4154f1; }

        /* TOOLBAR */
        .rti-toolbar {
          padding: 18px 24px;
          display: flex; justify-content: space-between;
          align-items: center; gap: 15px;
          flex-wrap: wrap; background: #fbfcfe;
          border-bottom: 1px solid #edf0f5;
        }
        .rti-toolbar-left, .rti-toolbar-right {
          display: flex; align-items: center;
          gap: 12px; flex-wrap: wrap;
        }
        .rti-page-size {
          display: flex; align-items: center; gap: 8px;
          color: #64748b; font-size: 13px; white-space: nowrap;
        }
        .rti-page-size select {
          height: 38px; padding: 0 10px;
          border: 1px solid #dfe4ec; border-radius: 8px;
          background: #fff; color: #334155;
          font-size: 13px; font-weight: 600;
          outline: none; cursor: pointer;
        }
        .rti-search {
          position: relative; width: 300px; max-width: 100%;
        }
        .rti-search > i {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8; font-size: 15px;
        }
        .rti-search input {
          width: 100%; height: 42px;
          padding: 0 42px 0 40px;
          border: 1px solid #dfe4ec; border-radius: 10px;
          background: #fff; color: #334155;
          font-size: 13px; outline: none;
          transition: all .2s ease;
        }
        .rti-search input:focus {
          border-color: #4154f1;
          box-shadow: 0 0 0 3px rgba(65, 84, 241, .08);
        }
        .rti-search button {
          position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          border: none; background: transparent;
          color: #94a3b8; cursor: pointer;
          display: flex; align-items: center;
        }
        .rti-search button:hover { color: #dc3545; }

        /* INFO BAR */
        .rti-info-bar {
          padding: 12px 24px; background: #f8fafc;
          border-bottom: 1px solid #edf0f5;
          color: #64748b; font-size: 12px;
          display: flex; justify-content: space-between;
          align-items: center; gap: 10px;
          flex-wrap: wrap;
        }
        .rti-info-bar strong { color: #334155; }

        /* TABLE */
        .rti-table-wrap {
          width: 0 !important; min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #c9ced8 #eef1f5;
        }
        .rti-table-wrap::-webkit-scrollbar { height: 9px; }
        .rti-table-wrap::-webkit-scrollbar-track {
          background: #eef1f5; border-radius: 10px;
        }
        .rti-table-wrap::-webkit-scrollbar-thumb {
          background: #c9ced8; border-radius: 10px;
        }

        .rti-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
        }
        .rti-table thead th {
          background: #f8f9fc !important;
          color: #687185; font-size: 12px;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: .3px; white-space: nowrap;
          padding: 15px 16px;
          border-bottom: 1px solid #e9edf3;
          vertical-align: middle;
        }
        .rti-table tbody td {
          padding: 15px 16px; color: #414a5d;
          font-size: 13px; vertical-align: middle;
          border-bottom: 1px solid #f0f2f6;
          white-space: nowrap;
        }
        .rti-table tbody tr { transition: background .15s ease; }
        .rti-table tbody tr:hover { background: #fafbff; }
        .rti-table tbody tr:last-child td { border-bottom: none; }

        /* CELLS */
        .rti-serial {
          display: inline-flex; align-items: center;
          justify-content: center; width: 32px; height: 32px;
          border-radius: 8px; background: #eef1ff;
          color: #4154f1; font-size: 12px; font-weight: 700;
        }
        .rti-tracking {
          display: inline-block;
          padding: 5px 10px; border-radius: 6px;
          background: #eef1ff; color: #4154f1;
          font-size: 12px; font-weight: 700;
          font-family: 'Courier New', monospace;
          letter-spacing: .5px;
        }
        .rti-name {
          display: flex; align-items: center; gap: 10px;
        }
        .rti-avatar {
          width: 38px; height: 38px; min-width: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4154f1, #6f7bf7);
          color: #fff; display: flex;
          align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 10px rgba(65, 84, 241, .2);
        }
        .rti-name-text strong {
          color: #1e293b; font-size: 13px; font-weight: 600;
        }
        .rti-mobile {
          display: inline-flex; align-items: center;
          gap: 6px; color: #334155; font-weight: 500;
        }
        .rti-mobile i { color: #0ea5e9; font-size: 12px; }
        .rti-email {
          display: inline-flex; align-items: center;
          gap: 6px; color: #475569;
        }
        .rti-email i { color: #8b5cf6; font-size: 12px; }
        .rti-subject {
          color: #334155; font-size: 13px;
          max-width: 200px; display: inline-block;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis;
        }
        .rti-type-badge {
          display: inline-block;
          padding: 5px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
          white-space: nowrap;
        }
        .rti-type-badge.govt { background: #dbeafe; color: #1e40af; }
        .rti-type-badge.student { background: #fef3c7; color: #92400e; }
        .rti-type-badge.centre { background: #ede9fe; color: #5b21b6; }

        .rti-status-badge {
          display: inline-block;
          padding: 5px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .3px; white-space: nowrap;
        }
        .rti-status-badge.pending { background: #dbeafe; color: #1e40af; }
        .rti-status-badge.inprogress { background: #fef3c7; color: #92400e; }
        .rti-status-badge.approved { background: #dcfce7; color: #15803d; }
        .rti-status-badge.rejected { background: #fee2e2; color: #991b1b; }

        .rti-file-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 6px;
          background: #eff6ff; color: #2563eb;
          font-size: 12px; font-weight: 600;
          text-decoration: none;
          transition: all .2s ease; cursor: pointer;
        }
        .rti-file-link:hover {
          background: #2563eb; color: #fff;
          text-decoration: none;
        }
        .rti-file-missing { color: #cbd5e1; font-size: 12px; }
        .rti-date {
          color: #64748b; font-size: 12px;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .rti-date i { color: #94a3b8; }

        /* ACTION BUTTONS */
        .rti-action-group {
          display: inline-flex; align-items: center;
          gap: 6px; justify-content: center;
        }
        .rti-action-btn {
          width: 34px; height: 34px;
          border-radius: 8px; border: none;
          display: inline-flex;
          align-items: center; justify-content: center;
          cursor: pointer; transition: all .18s ease;
          font-size: 13px;
        }
        .rti-action-btn.delete {
          background: #fff1f2; color: #dc3545;
        }
        .rti-action-btn.delete:hover {
          background: #dc3545; color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(220, 53, 69, .25);
        }
        .rti-action-btn.update {
          background: #eff6ff; color: #2563eb;
        }
        .rti-action-btn.update:hover {
          background: #2563eb; color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(37, 99, 235, .25);
        }

        /* EMPTY / LOADING */
        .rti-empty, .rti-loading {
          text-align: center;
          padding: 60px 20px !important;
          color: #94a3b8;
        }
        .rti-empty-icon, .rti-loading-icon {
          width: 60px; height: 60px;
          margin: 0 auto 14px; border-radius: 50%;
          background: #f1f5f9; color: #94a3b8;
          display: flex; align-items: center;
          justify-content: center; font-size: 26px;
        }
        .rti-empty h5 {
          color: #334155; font-size: 16px;
          font-weight: 600; margin: 0 0 6px;
        }
        .rti-empty p { color: #94a3b8; font-size: 13px; margin: 0; }

        /* PAGINATION */
        .rti-pagination {
          padding: 18px 24px;
          display: flex; justify-content: space-between;
          align-items: center; gap: 15px;
          flex-wrap: wrap; border-top: 1px solid #edf0f5;
        }
        .rti-records { color: #7a8395; font-size: 13px; }
        .rti-records strong { color: #414a5d; }
        .rti-page-buttons {
          display: flex; align-items: center;
          gap: 6px; flex-wrap: wrap;
        }
        .rti-page-btn {
          min-width: 38px; height: 38px;
          padding: 0 12px;
          border: 1px solid #e2e6ee; background: #fff;
          color: #515a6c; border-radius: 8px;
          cursor: pointer; font-size: 13px;
          font-weight: 600; display: inline-flex;
          align-items: center; justify-content: center;
          gap: 6px; transition: all .15s ease;
        }
        .rti-page-btn:hover:not(:disabled) {
          background: #4154f1; border-color: #4154f1; color: #fff;
        }
        .rti-page-btn:disabled { opacity: .45; cursor: not-allowed; }
        .rti-page-number {
          width: 38px; height: 38px;
          border: 1px solid #dfe3eb; background: #fff;
          color: #344054; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all .2s ease;
        }
        .rti-page-number:hover:not(:disabled) {
          background: #f5f7ff; border-color: #c7c9ff; color: #4154f1;
        }
        .rti-page-number.active {
          background: #4154f1; color: #fff;
          border-color: #4154f1;
          box-shadow: 0 5px 12px rgba(65, 84, 241, 0.25);
        }
        .rti-page-of {
          color: #64748b; font-size: 13px;
          margin-left: 6px; white-space: nowrap;
        }

        /* MODAL */
        .rti-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15, 23, 42, .65);
          backdrop-filter: blur(4px);
          display: flex; align-items: center;
          justify-content: center; z-index: 9999;
          padding: 20px;
          animation: rtiFadeIn .2s ease;
        }
        .rti-modal {
          width: 100%; max-width: 430px;
          background: #fff; border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(0,0,0,.25);
          animation: rtiSlideIn .25s ease;
        }
        .rti-modal-icon-wrap {
          display: flex; justify-content: center;
          padding: 30px 0 15px;
        }
        .rti-modal-icon {
          width: 72px; height: 72px;
          border-radius: 50%; background: #fff1f2;
          color: #dc3545; display: flex;
          align-items: center; justify-content: center;
          font-size: 30px;
        }
        .rti-modal-content {
          padding: 0 25px 20px; text-align: center;
        }
        .rti-modal-content h4 {
          color: #1e293b; font-weight: 700;
          margin: 0 0 8px; font-size: 18px;
        }
        .rti-modal-content p {
          color: #64748b; font-size: 14px;
          margin: 0 0 6px; line-height: 1.6;
        }
        .rti-modal-name {
          display: inline-block; padding: 6px 14px;
          border-radius: 8px; background: #f1f5f9;
          color: #334155; font-weight: 700;
          font-size: 14px; margin: 6px 0 14px;
        }
        .rti-modal-warning {
          display: flex; align-items: center;
          justify-content: center; gap: 8px;
          background: #fffbeb; color: #92400e;
          border-radius: 8px; padding: 10px;
          font-size: 12px;
        }
        .rti-modal-footer {
          padding: 18px 25px 25px;
          display: flex; justify-content: center;
          gap: 10px; border-top: 1px solid #f1f5f9;
        }
        .rti-modal-footer button {
          min-width: 120px; height: 42px;
          border-radius: 9px; font-size: 13px;
          font-weight: 600; display: inline-flex;
          align-items: center; justify-content: center;
          gap: 7px; border: none; cursor: pointer;
          transition: all .18s ease;
        }
        .rti-cancel-btn { background: #f1f5f9; color: #475569; }
        .rti-cancel-btn:hover:not(:disabled) { background: #e2e8f0; }
        .rti-confirm-btn { background: #dc3545; color: #fff; }
        .rti-confirm-btn:hover:not(:disabled) { background: #bb2d3b; }
        .rti-modal-footer button:disabled {
          opacity: .6; cursor: not-allowed;
        }

        /* UPDATE MODAL */
        .rti-update-modal .rti-modal-icon-wrap { padding: 25px 0 10px; }
        .rti-update-modal .rti-modal-icon {
          background: #eff6ff;
          color: #2563eb;
        }
        .rti-update-form { padding: 0 25px 20px; }
        .rti-update-form .form-group { margin-bottom: 18px; }
        .rti-update-form label {
          display: block; font-weight: 600;
          margin-bottom: 8px; color: #1e293b;
          font-size: 13.5px;
        }
        .rti-update-form label span { color: #dc2626; }
        .rti-update-form select,
        .rti-update-form textarea {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #cbd5e1; border-radius: 8px;
          font-size: 14px; outline: none;
          font-family: inherit; transition: all 0.25s;
          background: #fff; color: #1e293b;
        }
        .rti-update-form select:focus,
        .rti-update-form textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .rti-update-form textarea {
          resize: vertical; min-height: 90px;
        }
        .rti-update-form .error-text {
          color: #dc2626; font-size: 12.5px;
          margin-top: 6px; font-weight: 500;
        }
        .rti-update-name-info {
          text-align: center; padding: 0 25px 15px;
          color: #64748b; font-size: 13px;
        }
        .rti-update-name-info strong { color: #1e293b; }

        @keyframes rtiFadeIn { from {opacity:0;} to {opacity:1;} }
        @keyframes rtiSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 768px) {
          .rti-header h1 { font-size: 22px; }
          .rti-card-header, .rti-toolbar,
          .rti-info-bar, .rti-pagination { padding: 15px 18px; }
          .rti-search { width: 100%; }
          .rti-toolbar { align-items: stretch; flex-direction: column; }
          .rti-toolbar-left, .rti-toolbar-right { width: 100%; }
          .rti-page-size { justify-content: flex-end; width: 100%; }
          .rti-pagination { flex-direction: column; align-items: flex-start; }
          .rti-page-buttons { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="rti-page">
        {/* HEADER */}
        <div className="rti-header">
          <div>
            <h1>
              <i className="bi bi-file-earmark-text-fill"></i>
              RTI Applications
            </h1>
            <nav>
              <ol className="breadcrumb rti-breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/dashboard">
                    <i className="bi bi-house-door me-1"></i>
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item active">RTI Applications</li>
              </ol>
            </nav>
          </div>

          <div className="rti-badge">
            <i className="bi bi-inbox-fill"></i>
            Total: {totalRecords}
          </div>
        </div>

        <div className="rti-card">
          <div className="rti-card-header">
            <div>
              <h5>
                <i className="bi bi-list-ul"></i>
                RTI List
              </h5>
            </div>
          </div>

          {/* Toolbar */}
          <div className="rti-toolbar">
            <div className="rti-toolbar-left">
              <div className="rti-page-size">
                <span>Show</span>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            <div className="rti-toolbar-right">
              <div className="rti-search">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search tracking ID, name, mobile, email..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                {searchTerm && (
                  <button type="button" onClick={() => { setSearchTerm(""); setCurrentPage(1); }} title="Clear">
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rti-info-bar">
            <span>
              <i className="bi bi-info-circle me-1"></i>
              Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of <strong>{totalRecords}</strong> {totalRecords === 1 ? "RTI" : "RTIs"}
            </span>
          </div>

          {/* Table */}
          <div className="rti-table-wrap">
            <table className="rti-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tracking ID</th>
                  <th>Applicant</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Applicant Type</th>
                  <th>Subject</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Remark</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="rti-loading">
                      <div className="rti-loading-icon">
                        <div className="spinner-border text-primary"></div>
                      </div>
                      <div>Loading RTI applications...</div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((item, index) => {
                    // ✅ Direct backend names
                    const typeName = item.applicantType || "-";
                    const typeClass = getTypeClass(typeName);

                    const statusName = item.statusName || "-";
                    const statusClass = getStatusClass(statusName);

                    return (
                      <tr key={item.id}>
                        <td><span className="rti-serial">{startIndex + index + 1}</span></td>
                        <td><span className="rti-tracking">{item.trackingId || "-"}</span></td>
                        <td>
                          <div className="rti-name">
                            <div className="rti-avatar">
                              {item.name ? item.name.charAt(0).toUpperCase() : "R"}
                            </div>
                            <div className="rti-name-text">
                              <strong>{item.name || "-"}</strong>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="rti-mobile">
                            <i className="bi bi-telephone-fill"></i>
                            {item.mobileNo || "-"}
                          </span>
                        </td>
                        <td>
                          <span className="rti-email">
                            <i className="bi bi-envelope-fill"></i>
                            {item.email || "-"}
                          </span>
                        </td>
                        <td>
                          <span className={`rti-type-badge ${typeClass}`}>
                            {typeName}
                          </span>
                        </td>
                        <td>
                          <span className="rti-subject" title={item.subject || "-"}>
                            {item.subject || "-"}
                          </span>
                        </td>
                        <td>
                          {item.filePath1 ? (
                            <a
                              href={`${FILE_URL}/uploads/rti/${item.filePath1}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rti-file-link"
                              title="Letter Head"
                              style={{ marginRight: 6 }}
                            >
                              <i className="bi bi-file-earmark-pdf"></i>
                              Letter Head
                            </a>
                          ) : null}
                          <br/>

                          {item.filePath ? (
                            <a
                              href={`${FILE_URL}/uploads/rti/${item.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rti-file-link my-2"
                              title="All Documents"
                            >
                              <i className="bi bi-file-earmark-pdf"></i>
                              Documents
                            </a>
                          ) : null}

                          {!item.filePath && !item.filePath1 && (
                            <span className="rti-file-missing">—</span>
                          )}
                        </td>
                        <td>
                          <span className={`rti-status-badge ${statusClass}`}>
                            {statusName}
                          </span>
                        </td>
                        <td>
                          <span className="rti-date">
                            <i className="bi bi-calendar-event"></i>
                            {formatDate(item.createdAt)}
                          </span>
                        </td>

                         
                         <td>
                          <span className="rti-subject" title={item.subject || "-"}>
                            {item.remarks || "-"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="rti-action-group">
                            <button
                              type="button"
                              className="rti-action-btn update"
                              title="Update Status"
                              onClick={() => handleUpdate(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              type="button"
                              className="rti-action-btn delete"
                              title="Delete"
                              onClick={() => handleDelete(item.id, item.name)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="rti-empty">
                      <div className="rti-empty-icon">
                        <i className="bi bi-inbox"></i>
                      </div>
                      <h5>No RTI Applications Found</h5>
                      <p>
                        {searchTerm
                          ? "No RTI matches your search."
                          : "No RTI applications have been received yet."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="rti-pagination">
              <div className="rti-records">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>

              <div className="rti-page-buttons">
                <button
                  type="button"
                  className="rti-page-btn"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                  Prev
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`rti-page-number ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <span className="rti-page-of">of {totalPages}</span>

                <button
                  type="button"
                  className="rti-page-btn"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="rti-modal-overlay" onClick={closeDeleteModal}>
          <div className="rti-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rti-modal-icon-wrap">
              <div className="rti-modal-icon">
                <i className="bi bi-trash3-fill"></i>
              </div>
            </div>

            <div className="rti-modal-content">
              <h4>Delete RTI Application?</h4>
              <p>Are you sure you want to delete this RTI application?</p>
              {deleteName && <div className="rti-modal-name">"{deleteName}"</div>}
              <div className="rti-modal-warning">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>This action cannot be undone.</span>
              </div>
            </div>

            <div className="rti-modal-footer">
              <button
                type="button"
                className="rti-cancel-btn"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>
              <button
                type="button"
                className="rti-confirm-btn"
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
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className="rti-modal-overlay" onClick={closeUpdateModal}>
          <div
            className="rti-modal rti-update-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rti-modal-icon-wrap">
              <div className="rti-modal-icon">
                <i className="bi bi-pencil-square"></i>
              </div>
            </div>

            <div className="rti-modal-content">
              <h4>Update RTI Status</h4>
            </div>

            {updateName && (
              <div className="rti-update-name-info">
                Applicant: <strong>{updateName}</strong>
              </div>
            )}

            <div className="rti-update-form">
              {/* ✅ DYNAMIC STATUS DROPDOWN (from master) */}
              <div className="form-group">
                <label>Status <span>*</span></label>
                <select
                  value={updateStatus}
                  onChange={(e) => {
                    setUpdateStatus(e.target.value);
                    setUpdateError("");
                  }}
                >
                  <option value="">-- Select Status --</option>
                  {statusList && statusList.length > 0 ? (
                    statusList.map((s) => (
                      <option
                        key={s.id || s.Id}
                        value={s.id || s.Id}
                      >
                        {s.name || s.Name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading...</option>
                  )}
                </select>
              </div>

              {/* Remark */}
              <div className="form-group">
                <label>Remark <span>*</span></label>
                <textarea
                  value={updateRemark}
                  onChange={(e) => {
                    setUpdateRemark(e.target.value);
                    setUpdateError("");
                  }}
                  placeholder="Enter remark..."
                />
              </div>

              {updateError && (
                <div className="error-text">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {updateError}
                </div>
              )}
            </div>

            <div className="rti-modal-footer">
              <button
                type="button"
                className="rti-cancel-btn"
                onClick={closeUpdateModal}
                disabled={updateLoading}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>

              <button
                type="button"
                className="rti-confirm-btn"
                style={{ background: "#2563eb" }}
                onClick={confirmUpdate}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RTIList;