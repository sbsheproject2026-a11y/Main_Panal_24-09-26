 import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GetConfirmToAdmin, sendToConfirmStatus  } from '../../AllServicesFiles/AdminStudentService';
import { FILE_URL } from '../../api';
import { getStudentFeeDetails } from '../../AllServicesFiles/PaymentService';

function SendToConfirmStudent() {

    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [pageNo, setPageNo] = useState(1);

    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);

    // ✅ FEE MODAL STATES
    const [selectedItem, setSelectedItem] = useState(null);
    const [feeDetails, setFeeDetails] = useState(null);
    const [feeLoading, setFeeLoading] = useState(false);
    const [feeError, setFeeError] = useState("");

    const navigate = useNavigate();

    // ✅ PRINT
    const handlePrint = (id) => {
        navigate(`/admission-form-print/${id}`);
    };

    // ✅ VIEW
    const handleView = (id) => {
        navigate(`/student-view1/${id}`);
    };

    // ✅ EDIT
    const handleEdit = (id) => {
        navigate(`/student-update1/${id}`);
    };

    // ✅ FORMAT AMOUNT
    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) return "N/A";
        return `₹ ${Number(amount).toLocaleString("en-IN")}`;
    };

    // ✅ FEE BUTTON CLICK
   const handleFeeClick = async (item) => {
    setSelectedItem(item);
    setFeeDetails(null);
    setFeeError("");
    setFeeLoading(true);

    try {
        const result = await getStudentFeeDetails(item.id);
        

        if (result?.success && Array.isArray(result.data) && result.data.length > 0) {
            setFeeDetails(result.data[0]);   // 👈 poori array save karo
        } else {
            setFeeError("No fee record found for this student");
        }
    } catch (err) {
        console.error("Fee Error:", err);
        setFeeError(err.response?.data?.message || "Failed to load fee details");
    } finally {
        setFeeLoading(false);
    }
};

    // ✅ CLOSE FEE MODAL
    const closeFeeModal = () => {
        setSelectedItem(null);
        setFeeDetails(null);
        setFeeError("");
    };

    useEffect(() => {
        loadStudents();
    }, [pageNo, pageSize, search]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const result = await GetConfirmToAdmin(pageNo, pageSize, search);

            setData(result.data.data);
            setTotalRecords(result.data.totalRecords);
        }
        catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalRecords / pageSize);

    const startRecord =
        totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;

    const endRecord = Math.min(pageNo * pageSize, totalRecords);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPageNo(1);
    };

    const clearSearch = () => {
        setSearch("");
        setPageNo(1);
    };

    const handlePageSize = (e) => {
        setPageSize(Number(e.target.value));
        setPageNo(1);
    };

    // ✅ Select all / unselect all
    const toggleSelectAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map((d) => d.id));
        }
    };

    const handleSendToConfirm = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one student.");
            return;
        }

        try {
            const result = await sendToConfirmStatus(selectedIds);

            console.log(result);

            setSelectedIds([]);
            loadStudents();
        } catch (error) {
            console.log(error);
        }
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
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

                .student-page {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    overflow-x: hidden;
                    box-sizing: border-box;
                }

                .student-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .student-page-header h2 {
                    margin: 0 0 6px;
                    font-size: 26px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .student-page-header .breadcrumb {
                    margin: 0;
                    padding: 0;
                    background: transparent;
                    font-size: 13px;
                }

                .student-page-header .breadcrumb-item a {
                    color: #4154f1;
                    text-decoration: none;
                }

                .send-confirm-btn {
                    border: none;
                    background: linear-gradient(135deg, #4154f1, #6573f5);
                    color: white;
                    padding: 10px 18px;
                    border-radius: 9px;
                    font-weight: 600;
                    font-size: 13px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 5px 15px rgba(65, 84, 241, .22);
                    cursor: pointer;
                    white-space: nowrap;
                    transition: .2s ease;
                }

                .send-confirm-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(65, 84, 241, .30);
                }

                .send-confirm-btn:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                .student-card {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    background: #fff;
                    border-radius: 14px;
                    border: 1px solid #e7eaf0;
                    box-shadow: 0 5px 25px rgba(30, 41, 59, .06);
                    overflow: hidden;
                    box-sizing: border-box;
                }

                .student-card-header {
                    padding: 20px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    border-bottom: 1px solid #edf0f5;
                    flex-wrap: wrap;
                }

                .student-card-header h5 {
                    margin: 0;
                    font-size: 18px;
                    color: #1e293b;
                    font-weight: 700;
                }

                .student-count {
                    min-width: 100px;
                    text-align: center;
                    background: #f4f6ff;
                    border: 1px solid #e4e7ff;
                    border-radius: 10px;
                    padding: 8px 14px;
                    flex-shrink: 0;
                }

                .student-count span {
                    display: block;
                    color: #4154f1;
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 1.2;
                }

                .student-count small {
                    color: #7c86a2;
                    font-size: 11px;
                }

                .student-toolbar {
                    padding: 16px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                    border-bottom: 1px solid #edf0f5;
                    background: #fbfcfe;
                }

                .student-search {
                    position: relative;
                    width: 340px;
                    max-width: 100%;
                }

                .student-search > i {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #8c96a8;
                    font-size: 15px;
                    z-index: 1;
                }

                .student-search input {
                    width: 100%;
                    height: 42px;
                    border: 1px solid #dfe3ea;
                    border-radius: 9px;
                    padding: 0 40px;
                    outline: none;
                    color: #334155;
                    font-size: 14px;
                    background: #fff;
                    transition: .2s ease;
                }

                .student-search input:focus {
                    border-color: #4154f1;
                    box-shadow: 0 0 0 3px rgba(65,84,241,.08);
                }

                .student-search button {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: none;
                    background: transparent;
                    color: #9aa3b2;
                    cursor: pointer;
                    padding: 2px;
                    z-index: 2;
                }

                .page-size-wrap {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #64748b;
                    font-size: 13px;
                    white-space: nowrap;
                }

                .page-size-wrap select {
                    height: 38px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 0 10px;
                    color: #334155;
                    background: #fff;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    outline: none;
                }

                .student-table-wrap {
                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    position: relative;
                    box-sizing: border-box;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                    scrollbar-color: #b8bfcc #eef1f5;
                }

                .student-table-wrap::-webkit-scrollbar {
                    height: 9px;
                }

                .student-table-wrap::-webkit-scrollbar-track {
                    background: #eef1f5;
                    border-radius: 10px;
                }

                .student-table-wrap::-webkit-scrollbar-thumb {
                    background: #b8bfcc;
                    border-radius: 10px;
                }

                .student-table-wrap::-webkit-scrollbar-thumb:hover {
                    background: #8f98a8;
                }

                .student-table {
                    width: auto !important;
                    min-width: 100% !important;
                    max-width: none !important;
                    table-layout: auto !important;
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                    margin: 0 !important;
                }

                .student-table th,
                .student-table td {
                    box-sizing: border-box;
                }

                .student-table thead th {
                    background: #f8f9fc !important;
                    color: #687185;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: .3px;
                    white-space: nowrap;
                    padding: 14px 16px !important;
                    border-bottom: 1px solid #e9edf3 !important;
                    vertical-align: middle;
                }

                .student-table tbody td {
                    padding: 14px 16px !important;
                    color: #414a5d;
                    font-size: 13px;
                    vertical-align: middle !important;
                    border-bottom: 1px solid #f0f2f6 !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                    text-overflow: clip !important;
                }

                .student-table tbody tr {
                    transition: .15s ease;
                }

                .student-table tbody tr:hover {
                    background: #fafbff;
                }

                .student-table tbody tr:last-child td {
                    border-bottom: none !important;
                }

                .student-serial {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f0f2ff;
                    color: #4154f1;
                    font-size: 13px;
                    font-weight: 600;
                }

                .student-img {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #eef2ff;
                    display: block;
                }

                .student-checkbox {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                .student-action-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: #eff6ff;
                    color: #2563eb;
                    cursor: pointer;
                    transition: .18s ease;
                    border: none;
                }

                .student-action-icon:hover {
                    background: #2563eb;
                    color: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(37,99,235,.2);
                }

                .student-empty {
                    padding: 55px 20px !important;
                    text-align: center;
                    color: #8991a3;
                }

                .student-empty i {
                    display: block;
                    font-size: 42px;
                    color: #cbd1dc;
                    margin-bottom: 10px;
                }

                .student-loading {
                    padding: 50px !important;
                    text-align: center;
                    color: #737d91;
                }

                .student-pagination {
                    padding: 16px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                    border-top: 1px solid #edf0f5;
                }

                .student-records {
                    color: #7a8395;
                    font-size: 13px;
                }

                .student-records strong {
                    color: #414a5d;
                }

                .student-page-buttons {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .student-page-btn {
                    min-width: 38px;
                    height: 38px;
                    padding: 0 14px;
                    border: 1px solid #e2e6ee;
                    background: #fff;
                    color: #515a6c;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .student-page-btn:hover:not(:disabled) {
                    background: #4154f1;
                    border-color: #4154f1;
                    color: #fff;
                }

                .student-page-btn:disabled {
                    opacity: .45;
                    cursor: not-allowed;
                }

                .student-page-numbers {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .student-page-number-btn {
                    width: 38px;
                    height: 38px;
                    border: 1px solid #dfe3eb;
                    background: #fff;
                    color: #344054;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: .2s ease;
                }

                .student-page-number-btn:hover:not(:disabled) {
                    background: #f5f7ff;
                }

                .student-page-number-btn.active {
                    background: #4353ee;
                    color: #fff;
                    border-color: #4353ee;
                    box-shadow: 0 5px 12px rgba(67, 83, 238, 0.25);
                }

                .student-page-number-btn:disabled {
                    cursor: default;
                }

                .student-page-of {
                    color: #64748b;
                    font-size: 13px;
                    margin-right: 4px;
                    white-space: nowrap;
                }

                .student-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: rgba(15, 23, 42, .65);
                    backdrop-filter: blur(3px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .student-delete-modal {
                    width: 100%;
                    max-width: 430px;
                    background: #fff;
                    border-radius: 16px;
                    padding: 30px;
                    text-align: center;
                    box-shadow: 0 25px 60px rgba(0,0,0,.18);
                }

                .student-delete-icon {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: #fff1f2;
                    color: #dc3545;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    margin: 0 auto 17px;
                }

                .student-delete-modal h4 {
                    margin: 0 0 8px;
                    color: #1e293b;
                    font-weight: 700;
                }

                .student-delete-modal p {
                    margin: 0;
                    color: #667085;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .student-delete-actions {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 25px;
                }

                .student-delete-actions button {
                    height: 40px;
                    padding: 0 18px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    cursor: pointer;
                    border: none;
                }

                .student-cancel-btn {
                    background: #f1f5f9;
                    color: #475569;
                }

                .student-cancel-btn:hover {
                    background: #e2e8f0;
                }

                .student-confirm-btn {
                    background: #dc3545;
                    color: #fff;
                }

                .student-confirm-btn:hover {
                    background: #bb2d3b;
                }

                @media (max-width: 768px) {
                    .student-page-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .student-toolbar {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .student-search {
                        width: 100%;
                    }

                    .page-size-wrap {
                        justify-content: flex-end;
                    }

                    .student-pagination {
                        flex-direction: column;
                        align-items: center;
                    }
                }

                .student-action-group {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: nowrap;
                }

                .student-action {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 7px 14px;
                    font-size: 13px;
                    font-weight: 600;
                    line-height: 1;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    outline: none;
                    text-decoration: none;
                    font-family: inherit;
                }

                .student-action i {
                    font-size: 14px;
                    line-height: 1;
                }

                .student-action.print {
                    background: #e0f2fe;
                    color: #0369a1;
                    border-color: #bae6fd;
                }

                .student-action.print:hover {
                    background: #0369a1;
                    color: #ffffff;
                    border-color: #0369a1;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(3, 105, 161, 0.25);
                }

                .student-action.view {
                    background: #dcfce7;
                    color: #15803d;
                    border-color: #bbf7d0;
                }

                .student-action.view:hover {
                    background: #15803d;
                    color: #ffffff;
                    border-color: #15803d;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(21, 128, 61, 0.25);
                }

                .student-action.edit {
                    background: #fef3c7;
                    color: #b45309;
                    border-color: #fde68a;
                }

                .student-action.edit:hover {
                    background: #b45309;
                    color: #ffffff;
                    border-color: #b45309;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(180, 83, 9, 0.25);
                }

                .student-action:focus-visible {
                    outline: 2px solid #6366f1;
                    outline-offset: 2px;
                }

                @media (max-width: 576px) {
                    .student-action {
                        padding: 8px 10px;
                        font-size: 12px;
                    }

                    .student-action span {
                        display: none;
                    }

                    .student-action i {
                        font-size: 15px;
                    }
                }

                .list-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    font-family: inherit;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    flex-shrink: 0;
                }

                .list-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
                }

                /* ================================================
                   FEE DETAILS MODAL
                ================================================ */

                .details-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    background: rgba(15, 23, 42, .65);
                    backdrop-filter: blur(3px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .details-card {
                    width: 100%;
                    max-width: 640px;
                    max-height: 90vh;
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 25px 60px rgba(0,0,0,.25);
                }

                .details-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 18px 22px;
                    border-bottom: 1px solid #edf0f5;
                }

                .details-header h2 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .close-btn {
                    border: none;
                    background: transparent;
                    font-size: 20px;
                    color: #64748b;
                    cursor: pointer;
                    line-height: 1;
                    padding: 4px 8px;
                    border-radius: 6px;
                }

                .close-btn:hover {
                    background: #f1f5f9;
                    color: #1e293b;
                }

                .details-body {
                    padding: 18px 22px;
                    overflow-y: auto;
                    flex: 1;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 10px 0;
                    border-bottom: 1px dashed #eef1f5;
                    font-size: 14px;
                }

                .detail-row:last-child {
                    border-bottom: none;
                }

                .detail-row .label {
                    color: #64748b;
                    font-weight: 600;
                    flex-shrink: 0;
                    min-width: 140px;
                }

                .detail-row .value {
                    color: #1e293b;
                    text-align: right;
                    word-break: break-word;
                }

                .details-footer {
                    padding: 14px 22px;
                    border-top: 1px solid #edf0f5;
                    display: flex;
                    justify-content: flex-end;
                    background: #fbfcfe;
                }

                .btn-close-modal {
                    padding: 9px 20px;
                    border-radius: 9px;
                    border: none;
                    background: linear-gradient(135deg, #4154f1, #6573f5);
                    color: #fff;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: .2s ease;
                }

                .btn-close-modal:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(65,84,241,.3);
                }

                @media (max-width: 576px) {
                    .detail-row {
                        flex-direction: column;
                        gap: 4px;
                    }
                    .detail-row .label {
                        min-width: 0;
                    }
                    .detail-row .value {
                        text-align: left;
                    }
                }

                /* =============================================
   PAYMENT RECEIPT
============================================= */
.payment-receipt {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* ===== TOP (Amount + Status) ===== */
.receipt-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding: 22px 24px;
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
    border-radius: 14px;
    border: 1px solid #e0e7ff;
    flex-wrap: wrap;
}

.receipt-amount-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.receipt-amount-label {
    font-size: 12px;
    font-weight: 600;
    color: #6366f1;
    text-transform: uppercase;
    letter-spacing: .5px;
}

.receipt-amount {
    margin: 0;
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
    line-height: 1.1;
    letter-spacing: -.5px;
}

.receipt-amount-words {
    font-size: 12px;
    color: #7c86a2;
    font-style: italic;
}

.receipt-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    text-transform: capitalize;
    white-space: nowrap;
}

.receipt-status i {
    font-size: 16px;
}

.status-pending {
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
}

.status-paid {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
}

.status-failed {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
}

/* ===== DIVIDER ===== */
.receipt-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #cbd5e1;
}

.receipt-divider span {
    flex: 1;
    height: 1px;
    background: repeating-linear-gradient(
        to right,
        #cbd5e1 0,
        #cbd5e1 6px,
        transparent 6px,
        transparent 12px
    );
}

.receipt-divider i {
    font-size: 16px;
    color: #94a3b8;
    transform: rotate(-90deg);
}

/* ===== SECTIONS ===== */
.receipt-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.receipt-section-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: .4px;
}

.receipt-section-title i {
    color: #6366f1;
    font-size: 15px;
}

/* ===== GRID ===== */
.receipt-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.receipt-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #eef1f5;
    transition: .18s ease;
}

.receipt-item:hover {
    background: #f1f5ff;
    border-color: #dbe4ff;
}

.receipt-item.full {
    grid-column: 1 / -1;
}

.receipt-label {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: .3px;
}

.receipt-value {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    word-break: break-word;
}

.receipt-value.mono {
    font-family: "Courier New", monospace;
    font-size: 13px;
    letter-spacing: .3px;
    color: #4154f1;
}

/* ===== NOTE ===== */
.receipt-note {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 10px;
    font-size: 12px;
    color: #0369a1;
}

.receipt-note i {
    font-size: 15px;
    flex-shrink: 0;
}

/* ===== MOBILE ===== */
@media (max-width: 576px) {
    .receipt-top {
        flex-direction: column;
        align-items: stretch;
        padding: 18px;
    }

    .receipt-amount {
        font-size: 26px;
    }

    .receipt-grid {
        grid-template-columns: 1fr;
    }

    .receipt-item.full {
        grid-column: auto;
    }
}
            `}</style>

            <div className="student-page">

                <div className="student-page-header">
                    <div>
                        <h2>
                            <i className="bi bi-person-vcard-fill me-2"></i>
                            Confirm To Admin List
                        </h2>
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item active">Student Detail</li>
                            </ol>
                        </nav>
                    </div>

                    <button
                        type="button"
                        className="send-confirm-btn"
                        disabled={selectedIds.length === 0}
                        onClick={handleSendToConfirm}
                    >
                        <i className="bi bi-send-check-fill"></i>
                        Send to Confirm ({selectedIds.length})
                    </button>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="student-card">

                                <div className="student-card-header">
                                    <h5>
                                        <i className="bi bi-people-fill me-2"></i>
                                        Student List
                                    </h5>

                                    <div className="student-count">
                                        <span>{totalRecords}</span>
                                        <small>Total Students</small>
                                    </div>
                                </div>

                                <div className="student-toolbar">

                                    <div className="student-search">
                                        <i className="bi bi-search"></i>
                                        <input
                                            type="text"
                                            placeholder="Search name, mobile, code..."
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                title="Clear"
                                            >
                                                <i className="bi bi-x-circle-fill"></i>
                                            </button>
                                        )}
                                    </div>

                                    <div className="page-size-wrap">
                                        <span>Show</span>
                                        <select
                                            value={pageSize}
                                            onChange={handlePageSize}
                                        >
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                        <span>entries</span>
                                    </div>

                                </div>

                                <div className="student-table-wrap">

                                    <table className="student-table">
                                        <thead>
                                            <tr>
                                                <th>SrNo</th>
                                                <th style={{ textAlign: "center" }}>
                                                    <input
                                                        type="checkbox"
                                                        className="student-checkbox"
                                                        checked={
                                                            data.length > 0 &&
                                                            selectedIds.length === data.length
                                                        }
                                                        onChange={toggleSelectAll}
                                                        disabled={loading || data.length === 0}
                                                    />
                                                </th>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Father Name</th>
                                                <th>Address</th>
                                                <th>Mobile No</th>
                                                <th>Franchise Name</th>
                                                <th>Course Name</th>

                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {loading ? (
                                                <tr>
                                                    <td colSpan="13" className="student-loading">
                                                        <div className="spinner-border text-primary mb-2"></div>
                                                        <div>Loading students...</div>
                                                    </td>
                                                </tr>
                                            ) : data.length === 0 ? (
                                                <tr>
                                                    <td colSpan="13" className="student-empty">
                                                        <i className="bi bi-person-x"></i>
                                                        <div>No students found</div>
                                                        {search && (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary mt-2"
                                                                onClick={clearSearch}
                                                            >
                                                                Clear Search
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ) : (
                                                data.map((item, index) => (
                                                    <tr key={item.id}>

                                                        <td>
                                                            <span className="student-serial">
                                                                {(pageNo - 1) * pageSize + index + 1}
                                                            </span>
                                                        </td>

                                                        <td style={{ textAlign: "center" }}>
                                                            <input
                                                                className="student-checkbox"
                                                                type="checkbox"
                                                                checked={selectedIds.includes(item.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedIds((prev) => [...prev, item.id]);
                                                                    } else {
                                                                        setSelectedIds((prev) =>
                                                                            prev.filter((id) => id !== item.id)
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </td>

                                                        <td>
                                                            <img
                                                                src={`${FILE_URL}${item.selfImageShow}`}
                                                                alt="Student"
                                                                className="student-img"
                                                            />
                                                        </td>

                                                        <td>{item.name || "-"}</td>
                                                        <td>{item.fatherName || "-"}</td>
                                                        <td>{item.address || "-"}</td>
                                                        <td>{item.mobileNo || "-"}</td>
                                                        <td>{item.instituteName || "-"}</td>
                                                        <td>{item.courseName || "-"}</td>

                                                        <td>
                                                            <div className="student-action-group">
                                                                <button
                                                                    type="button"
                                                                    className="student-action print"
                                                                    onClick={() => handlePrint(item.id)}
                                                                    title="Print Form"
                                                                >
                                                                    <i className="bi bi-printer-fill"></i>
                                                                    <span>Print</span>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="student-action view"
                                                                    onClick={() => handleView(item.id)}
                                                                    title="View Student"
                                                                >
                                                                    <i className="bi bi-eye-fill"></i>
                                                                    <span>View</span>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="student-action edit"
                                                                    onClick={() => handleEdit(item.id)}
                                                                    title="Edit Student"
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                    <span>Edit</span>
                                                                </button>

                                                                <button
                                                                    className="list-btn"
                                                                    onClick={() => handleFeeClick(item)}
                                                                >
                                                                    Fee
                                                                </button>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))
                                            )}

                                        </tbody>
                                    </table>

                                </div>

                                {totalRecords > 0 && (
                                    <div className="student-pagination">

                                        <div className="student-records">
                                            Showing <strong>{startRecord}</strong> to{" "}
                                            <strong>{endRecord}</strong> of{" "}
                                            <strong>{totalRecords}</strong> records
                                        </div>

                                        <div className="student-page-buttons">

                                            <button
                                                type="button"
                                                className="student-page-btn"
                                                disabled={pageNo <= 1 || loading}
                                                onClick={() => setPageNo((prev) => prev - 1)}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                                Previous
                                            </button>

                                            <div className="student-page-numbers">
                                                {Array.from(
                                                    { length: Math.min(6, totalPages - pageNo + 1) },
                                                    (_, index) => pageNo + index
                                                ).map((page) => (
                                                    <button
                                                        key={page}
                                                        type="button"
                                                        className={`student-page-number-btn ${pageNo === page ? "active" : ""}`}
                                                        disabled={loading}
                                                        onClick={() => setPageNo(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <span className="student-page-of">
                                                of {totalPages || 1}
                                            </span>

                                            <button
                                                type="button"
                                                className="student-page-btn"
                                                disabled={pageNo >= totalPages || totalPages === 0 || loading}
                                                onClick={() => setPageNo((prev) => prev + 1)}
                                            >
                                                Next
                                                <i className="bi bi-chevron-right"></i>
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </section>

            </div>

            {/* =========================================================
                FEE DETAILS MODAL
            ========================================================= */}

            {selectedItem && (
                <div className="details-overlay" onClick={closeFeeModal}>
                    <div
                        className="details-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="details-header">
                            <h2>📄 Payment Details</h2>
                            <button
                                className="close-btn"
                                onClick={closeFeeModal}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="details-body">

                            {feeLoading && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary"></div>
                                    <div className="mt-2">Loading fee details...</div>
                                </div>
                            )}

                            {feeError && !feeLoading && (
                                <div className="alert alert-danger">{feeError}</div>
                            )}

                          {feeDetails && !feeLoading && (
    <div className="payment-receipt">

        {/* ===== HEADER (Amount + Status) ===== */}
        <div className="receipt-top">
            <div className="receipt-amount-box">
                <span className="receipt-amount-label">Amount Paid</span>
                <h1 className="receipt-amount">
                    {formatAmount(feeDetails.amount)}
                </h1>
                <span className="receipt-amount-words">
                    {feeDetails.amountW || ""}
                </span>
            </div>

            <div
                className={`receipt-status ${
                    feeDetails.payStatus?.toLowerCase() === "pending"
                        ? "status-pending"
                        : feeDetails.payStatus?.toLowerCase() === "paid" ||
                          feeDetails.payStatus?.toLowerCase() === "success"
                        ? "status-paid"
                        : "status-failed"
                }`}
            >
                <i
                    className={`bi ${
                        feeDetails.payStatus?.toLowerCase() === "pending"
                            ? "bi-clock-history"
                            : feeDetails.payStatus?.toLowerCase() === "paid" ||
                              feeDetails.payStatus?.toLowerCase() === "success"
                            ? "bi-check-circle-fill"
                            : "bi-x-circle-fill"
                    }`}
                ></i>
                {feeDetails.payStatus || "Unknown"}
            </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className="receipt-divider">
            <span></span>
            <i className="bi bi-scissors"></i>
            <span></span>
        </div>

        {/* ===== STUDENT INFO ===== */}
        <div className="receipt-section">
            <h6 className="receipt-section-title">
                <i className="bi bi-person-badge-fill"></i>
                Student Information
            </h6>

            <div className="receipt-grid">
                <div className="receipt-item">
                    <span className="receipt-label">Full Name</span>
                    <span className="receipt-value">
                        {feeDetails.name?.trim() || "N/A"}
                    </span>
                </div>

                <div className="receipt-item">
                    <span className="receipt-label">Mobile No</span>
                    <span className="receipt-value">
                        {feeDetails.mobileNo || "N/A"}
                    </span>
                </div>

                <div className="receipt-item full">
                    <span className="receipt-label">Email Address</span>
                    <span className="receipt-value">
                        {feeDetails.emailId || "N/A"}
                    </span>
                </div>

                <div className="receipt-item full">
                    <span className="receipt-label">Address</span>
                    <span className="receipt-value">
                        {feeDetails.address || "N/A"}
                    </span>
                </div>
            </div>
        </div>

        {/* ===== COURSE INFO ===== */}
        <div className="receipt-section">
            <h6 className="receipt-section-title">
                <i className="bi bi-mortarboard-fill"></i>
                Course Details
            </h6>

            <div className="receipt-grid">
                <div className="receipt-item full">
                    <span className="receipt-label">Course Name</span>
                    <span className="receipt-value">
                        {feeDetails.feeName || "N/A"}
                    </span>
                </div>
            </div>
        </div>

        {/* ===== TRANSACTION INFO ===== */}
        <div className="receipt-section">
            <h6 className="receipt-section-title">
                <i className="bi bi-receipt-cutoff"></i>
                Transaction Details
            </h6>

            <div className="receipt-grid">
                <div className="receipt-item">
                    <span className="receipt-label">Order ID</span>
                    <span className="receipt-value mono">
                        {feeDetails.orderId || "N/A"}
                    </span>
                </div>

                <div className="receipt-item">
                    <span className="receipt-label">Reference ID</span>
                    <span className="receipt-value mono">
                        {feeDetails.referenceId || "-"}
                    </span>
                </div>

                <div className="receipt-item">
                    <span className="receipt-label">Order Date</span>
                    <span className="receipt-value">
                        {feeDetails.oDate || "N/A"}
                    </span>
                </div>

                <div className="receipt-item">
                    <span className="receipt-label">Pay Date</span>
                    <span className="receipt-value">
                        {feeDetails.printPayDate &&
                        feeDetails.printPayDate !== "01 Jan 1900"
                            ? feeDetails.printPayDate
                            : "-"}
                    </span>
                </div>

                <div className="receipt-item full">
                    <span className="receipt-label">Gateway</span>
                    <span className="receipt-value">
                        {feeDetails.getwayPrm || "Not Specified"}
                    </span>
                </div>
            </div>
        </div>

        {/* ===== FOOTER NOTE ===== */}
        <div className="receipt-note">
            <i className="bi bi-info-circle"></i>
            This is a computer-generated receipt. Please keep it for your records.
        </div>
    </div>
)}
                        </div>

                        <div className="details-footer">
                            <button className="btn-close-modal" onClick={closeFeeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                DELETE MODAL
            ========================================================= */}

            {showDeleteModal && (
                <div
                    className="student-modal-overlay"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="student-delete-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="student-delete-icon">
                            <i className="bi bi-trash3-fill"></i>
                        </div>

                        <h4>Delete Student?</h4>
                        <p>
                            Are you sure you want to delete this student?
                            <br />
                            This action cannot be undone.
                        </p>

                        <div className="student-delete-actions">
                            <button
                                type="button"
                                className="student-cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <i className="bi bi-x-lg"></i>
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="student-confirm-btn"
                                onClick={confirmDelete}
                            >
                                <i className="bi bi-trash3"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SendToConfirmStudent