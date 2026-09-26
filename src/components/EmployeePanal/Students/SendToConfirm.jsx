 import React, { useEffect, useState } from 'react'
import { getStudentDelete, getStudentsSendToConfirm, sendToConfirmStatus } from './StudentService';
import { useNavigate } from 'react-router-dom';
import { getWalletShowBalance } from '../WalletWorking/WalletService';

function SendToConfirm() {
    const [loading, setLoading] = useState(false);

    // ✅ selected students: { id, courseId, amount }
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [balance, setBalance] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/student-update/${id}`);
    };

    useEffect(() => {
        loadWalletShows();
        loadStudents();
    }, [pageNo, pageSize, search]);

    // ✅ Balance load
    const loadWalletShows = async () => {
        try {
            const result = await getWalletShowBalance();
            const firstBalance = result?.data?.[0]?.balance || 0;
            setBalance(Number(firstBalance));
        } catch (error) {
            console.log("Wallet load error:", error);
            setBalance(0);
        }
    };

    const loadStudents = async () => {
        try {
            setLoading(true);
            const result = await getStudentsSendToConfirm(pageNo, pageSize, search);
            setData(result.data.data);
            setTotalRecords(result.data.totalRecords);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalRecords / pageSize);

    const startRecord = totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;
    const endRecord = totalRecords === 0 ? 0 : Math.min(pageNo * pageSize, totalRecords);

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

    const handlePrevious = () => {
        if (pageNo > 1) setPageNo(pageNo - 1);
    };

    const handleNext = () => {
        if (pageNo < totalPages) setPageNo(pageNo + 1);
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
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

    const confirmDelete = async () => {
        try {
            const result = await getStudentDelete(deleteId);
            alert(result.message);
            setShowDeleteModal(false);
            loadStudents();
        } catch (error) {
            console.log(error);
        }
    };

    // ✅ Send selected students (id + courseId + amount)
    const handleSendToConfirm = async () => {
        if (selectedStudents.length === 0) {
            alert("Please select at least one student.");
            return;
        }

        try {
            const payload = selectedStudents;
            console.log("Payload:", payload);

            const result = await sendToConfirmStatus(payload);
            console.log(result);

            setSelectedStudents([]);
            loadStudents();
        } catch (error) {
            console.log(error);
        }
    };

    // ✅ Select all / deselect all
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(
                data.map((item) => ({
                    id: item.id,
                    courseId: item.courseId,
                    amount: item.amount ?? 0,
                }))
            );
        } else {
            setSelectedStudents([]);
        }
    };

    // ✅ Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    // ✅ Check if a row is selected
    const isRowSelected = (id) => selectedStudents.some((s) => s.id === id);

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

                .stc-page {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    overflow-x: hidden;
                    box-sizing: border-box;
                }

                /* =========================================================
                   PAGE HEADER
                ========================================================= */
                .stc-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 20px;
                    width: 100%;
                }

                .stc-page-header h1 {
                    font-size: 26px;
                    font-weight: 800;
                    color: #1e293b;
                    margin: 0 0 6px;
                    letter-spacing: -0.4px;
                }

                .stc-breadcrumb {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    gap: 8px;
                    font-size: 13px;
                    flex-wrap: wrap;
                }

                .stc-breadcrumb li {
                    color: #94a3b8;
                }

                .stc-breadcrumb li.active {
                    color: #01507c;
                    font-weight: 600;
                }

                .stc-breadcrumb a {
                    color: #64748b;
                    text-decoration: none;
                    transition: 0.2s;
                }

                .stc-breadcrumb a:hover {
                    color: #01507c;
                }

                /* =========================================================
                   ✅ TOP SUMMARY CARD (Balance)
                ========================================================= */
                .stc-summary-wrapper {
                    display: grid;
                    width: 100%;
                    max-width: 320px;
                    grid-template-columns: 1fr;
                    gap: 16px;
                    margin-bottom: 22px;
                }

                .stc-balance-card {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px 22px;
                    background: linear-gradient(135deg, #01507c 0%, #0a7bb5 100%);
                    border-radius: 16px;
                    color: #fff;
                    box-shadow: 0 12px 30px rgba(1, 80, 124, 0.25);
                    overflow: hidden;
                    transition: 0.25s ease;
                }

                .stc-balance-card::after {
                    content: "";
                    position: absolute;
                    right: -40px;
                    top: -40px;
                    width: 140px;
                    height: 140px;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 50%;
                }

                .stc-balance-card::before {
                    content: "";
                    position: absolute;
                    right: 20px;
                    bottom: -50px;
                    width: 100px;
                    height: 100px;
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 50%;
                }

                .stc-balance-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 18px 40px rgba(1, 80, 124, 0.35);
                }

                .stc-balance-icon {
                    position: relative;
                    z-index: 2;
                    width: 54px;
                    height: 54px;
                    min-width: 54px;
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.18);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 800;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .stc-balance-content {
                    position: relative;
                    z-index: 2;
                    flex: 1;
                    min-width: 0;
                }

                .stc-balance-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.6px;
                    text-transform: uppercase;
                    opacity: 0.85;
                    margin-bottom: 4px;
                }

                .stc-balance-value {
                    display: block;
                    font-size: 26px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    line-height: 1.2;
                    word-break: break-word;
                }

                /* =========================================================
                   CARD (main)
                ========================================================= */
                .stc-card {
                    background: #fff;
                    border: 1px solid #e8edf3;
                    border-radius: 16px;
                    box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05);
                    overflow: hidden;
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                }

                .stc-card-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #edf0f4;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .stc-card-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 4px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .stc-card-title i {
                    color: #01507c;
                    font-size: 18px;
                }

                .stc-card-subtitle {
                    color: #94a3b8;
                    font-size: 12px;
                    margin: 0;
                }

                /* Send to Confirm button */
                .stc-send-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 11px 20px;
                    border: 0;
                    border-radius: 9px;
                    background: linear-gradient(135deg, #01507c, #0a7bb5);
                    color: #fff;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 6px 16px rgba(1, 80, 124, 0.25);
                    transition: 0.2s ease;
                    white-space: nowrap;
                }

                .stc-send-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 22px rgba(1, 80, 124, 0.35);
                }

                .stc-send-btn i {
                    font-size: 15px;
                }

                .stc-send-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                /* =========================================================
                   SEARCH
                ========================================================= */
                .stc-toolbar {
                    padding: 16px 24px;
                    background: #fafbfc;
                    border-bottom: 1px solid #edf0f4;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .stc-search {
                    position: relative;
                    width: 300px;
                    max-width: 100%;
                    height: 40px;
                    flex: 0 1 300px;
                }

                .stc-search i {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    font-size: 14px;
                    z-index: 2;
                }

                .stc-search input {
                    width: 100%;
                    height: 100%;
                    padding: 0 40px 0 40px;
                    border: 1px solid #e2e8f0;
                    border-radius: 9px;
                    background: #fff;
                    color: #334155;
                    font-size: 13px;
                    outline: none;
                    transition: 0.2s ease;
                    box-sizing: border-box;
                }

                .stc-search input:focus {
                    border-color: #01507c;
                    box-shadow: 0 0 0 3px rgba(1, 80, 124, 0.08);
                }

                .stc-search-clear {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: 0;
                    background: transparent;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 2px;
                    z-index: 3;
                }

                .stc-selected-info {
                    font-size: 13px;
                    color: #64748b;
                }

                .stc-selected-info strong {
                    color: #01507c;
                    font-weight: 700;
                }

                /* =========================================================
                   PAGE SIZE SELECT
                ========================================================= */
                .stc-page-size {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #64748b;
                    white-space: nowrap;
                }

                .stc-page-size select {
                    height: 38px;
                    padding: 0 10px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #fff;
                    color: #334155;
                    font-size: 13px;
                    font-weight: 600;
                    outline: none;
                    cursor: pointer;
                }

                /* =========================================================
                   TABLE WRAPPER — only this area scrolls
                ========================================================= */
                .stc-table-scroll {
                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    box-sizing: border-box;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }

                .stc-table-scroll::-webkit-scrollbar {
                    height: 10px;
                }

                .stc-table-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }

                .stc-table-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                    border: 2px solid #f1f5f9;
                }

                .stc-table-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                /* =========================================================
                   TABLE — AUTO WIDTH + AUTO HEIGHT
                ========================================================= */
                .stc-table {
                    width: auto !important;
                    min-width: 100% !important;
                    max-width: none !important;
                    table-layout: auto !important;
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                    margin: 0 !important;
                }

                .stc-table thead {
                    background: #f8fafc;
                }

                .stc-table thead th {
                    padding: 14px 16px;
                    text-align: left;
                    color: #64748b;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.55px;
                    white-space: nowrap;
                    border-bottom: 1px solid #e2e8f0;
                    vertical-align: middle;
                }

                .stc-table tbody td {
                    padding: 14px 16px;
                    color: #334155;
                    font-size: 13px;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                    white-space: nowrap;
                }

                .stc-table tbody tr {
                    transition: 0.15s ease;
                }

                .stc-table tbody tr:hover {
                    background: #f8fbff;
                }

                .stc-table tbody tr:last-child td {
                    border-bottom: 0;
                }

                /* Serial */
                .stc-serial {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    background: #f1f5f9;
                    color: #64748b;
                    font-size: 12px;
                    font-weight: 600;
                }

                /* Checkbox */
                .stc-checkbox {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    border-color: #cbd5e1;
                    accent-color: #01507c;
                }

                /* Image */
                .stc-avatar {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #e8edf3;
                    background: #f1f5f9;
                    display: block;
                }

                /* Name cell */
                .stc-name {
                    color: #1e293b;
                    font-weight: 700;
                    font-size: 13.5px;
                    white-space: nowrap;
                }

                /* Amount */
                .stc-amount {
                    color: #059669;
                    font-weight: 700;
                    font-size: 13px;
                    white-space: nowrap;
                }

                /* Action */
                .stc-action-btn {
                    width: 34px;
                    height: 34px;
                    border: 0;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: #eff6ff;
                    color: #2563eb;
                    transition: 0.2s ease;
                }

                .stc-action-btn:hover {
                    background: #2563eb;
                    color: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
                }

                /* =========================================================
                   EMPTY STATE
                ========================================================= */
                .stc-empty {
                    padding: 60px 20px;
                    text-align: center;
                }

                .stc-empty-icon {
                    width: 65px;
                    height: 65px;
                    margin: 0 auto 15px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                }

                .stc-empty h5 {
                    color: #334155;
                    font-size: 16px;
                    margin: 0 0 6px;
                }

                .stc-empty p {
                    color: #94a3b8;
                    font-size: 13px;
                    margin: 0;
                }

                /* =========================================================
                   PAGINATION
                ========================================================= */
                .stc-footer {
                    padding: 16px 24px;
                    background: #fff;
                    border-top: 1px solid #edf0f4;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .stc-record-info {
                    color: #94a3b8;
                    font-size: 13px;
                }

                .stc-record-info strong {
                    color: #334155;
                }

                .stc-pagination {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-wrap: wrap;
                }

                .stc-page-btn {
                    min-width: 38px;
                    height: 38px;
                    padding: 0 10px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    color: #475569;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .stc-page-btn:hover:not(:disabled) {
                    border-color: #01507c;
                    color: #01507c;
                    transform: translateY(-1px);
                }

                .stc-page-btn.active {
                    background: linear-gradient(135deg, #01507c, #0a7bb5);
                    border-color: #01507c;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(1, 80, 124, 0.25);
                }

                .stc-page-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .stc-page-of {
                    color: #94a3b8;
                    font-size: 13px;
                    padding: 0 4px;
                    white-space: nowrap;
                }

                /* =========================================================
                   MODAL
                ========================================================= */
                .stc-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.65);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                    animation: stcFadeIn 0.2s ease;
                }

                @keyframes stcFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .stc-modal {
                    background: #fff;
                    border-radius: 18px;
                    width: 100%;
                    max-width: 420px;
                    overflow: hidden;
                    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
                    animation: stcModalSlide 0.25s ease;
                }

                @keyframes stcModalSlide {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .stc-modal-header {
                    padding: 22px 25px 15px;
                    text-align: center;
                }

                .stc-modal-icon {
                    width: 68px;
                    height: 68px;
                    margin: 0 auto 15px;
                    border-radius: 50%;
                    background: #fff1f2;
                    color: #dc3545;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                }

                .stc-modal-header h4 {
                    color: #1e293b;
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 6px;
                }

                .stc-modal-header p {
                    color: #64748b;
                    font-size: 14px;
                    margin: 0;
                }

                .stc-modal-warning {
                    margin: 10px 25px 20px;
                    padding: 10px 12px;
                    background: #fffbeb;
                    color: #92400e;
                    border-radius: 8px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .stc-modal-footer {
                    padding: 18px 25px 25px;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    border-top: 1px solid #f1f5f9;
                }

                .stc-cancel-btn,
                .stc-delete-btn {
                    min-height: 42px;
                    padding: 0 20px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    border: 0;
                    transition: 0.2s ease;
                }

                .stc-cancel-btn {
                    background: #f1f5f9;
                    color: #475569;
                    min-width: 110px;
                }

                .stc-cancel-btn:hover {
                    background: #e2e8f0;
                }

                .stc-delete-btn {
                    background: #dc3545;
                    color: #fff;
                    min-width: 130px;
                }

                .stc-delete-btn:hover {
                    background: #bb2d3b;
                }

                /* =========================================================
                   RESPONSIVE
                ========================================================= */
                @media (max-width: 992px) {
                    .stc-balance-value {
                        font-size: 24px;
                    }
                }

                @media (max-width: 768px) {
                    .stc-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .stc-page-header h1 {
                        font-size: 22px;
                    }

                    .stc-card-header {
                        flex-direction: column;
                        align-items: stretch;
                        padding: 16px 18px;
                    }

                    .stc-send-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .stc-toolbar {
                        flex-direction: column;
                        align-items: stretch;
                        padding: 14px 16px;
                    }

                    .stc-search {
                        width: 100%;
                        flex: 1 1 100%;
                    }

                    .stc-selected-info {
                        text-align: center;
                    }

                    .stc-balance-value {
                        font-size: 22px;
                    }

                    .stc-summary-wrapper {
                        max-width: 100%;
                    }

                    .stc-footer {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .stc-modal {
                        max-width: 100%;
                    }

                    .stc-modal-footer {
                        flex-direction: column-reverse;
                    }

                    .stc-cancel-btn,
                    .stc-delete-btn {
                        width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .stc-page-header h1 {
                        font-size: 20px;
                    }

                    .stc-breadcrumb {
                        font-size: 12px;
                    }

                    .stc-balance-card {
                        padding: 16px 18px;
                        gap: 12px;
                    }

                    .stc-balance-icon {
                        width: 46px;
                        height: 46px;
                        min-width: 46px;
                        font-size: 20px;
                    }

                    .stc-balance-value {
                        font-size: 20px;
                    }

                    .stc-card-title {
                        font-size: 16px;
                    }

                    .stc-table thead th,
                    .stc-table tbody td {
                        padding: 12px 12px;
                        font-size: 12px;
                    }

                    .stc-footer {
                        padding: 14px 16px;
                    }

                    .stc-page-btn {
                        min-width: 34px;
                        height: 34px;
                        font-size: 12px;
                    }
                }
            `}</style>

            <div className="stc-page">

                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}
                <div className="stc-page-header">
                    <div>
                        <h1>
                            <i className="bi bi-people-fill me-2" style={{ color: "#01507c" }}></i>
                            Student Detail
                        </h1>

                        <ol className="stc-breadcrumb">
                            <li><a href="/dashboard">Dashboard</a></li>
                            <li>Student Detail</li>
                            <li className="active">Send to Confirm</li>
                        </ol>
                    </div>
                </div>

                {/* =====================================================
                    ✅ BALANCE SUMMARY CARD
                ===================================================== */}
                <div className="stc-summary-wrapper">
                    <div className="stc-balance-card">
                        <div className="stc-balance-icon">₹</div>
                        <div className="stc-balance-content">
                            <span className="stc-balance-label">Total Balance</span>
                            <span className="stc-balance-value">
                                {formatCurrency(balance)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    MAIN CARD
                ===================================================== */}
                <section className="section">
                    <div className="stc-card">

                        {/* Card Header */}
                        <div className="stc-card-header">
                            <div>
                                <h5 className="stc-card-title">
                                    <i className="bi bi-list-ul"></i>
                                    Student List
                                </h5>
                                <p className="stc-card-subtitle">
                                    {totalRecords} student{totalRecords !== 1 ? "s" : ""} found
                                </p>
                            </div>

                            <div className="stc-page-size">
                                <span>Show</span>
                                <select
                                    value={pageSize}
                                    onChange={handlePageSize}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span>entries</span>
                            </div>
                        </div>

                        {/* Toolbar / Search */}
                        <div className="stc-toolbar">
                            <button
                                type="button"
                                className="stc-send-btn"
                                onClick={handleSendToConfirm}
                                disabled={selectedStudents.length === 0}
                            >
                                <i className="bi bi-send-check-fill"></i>
                                Send to Confirm
                                {selectedStudents.length > 0 && ` (${selectedStudents.length})`}
                            </button>

                            <div className="stc-search">
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        className="stc-search-clear"
                                        onClick={clearSearch}
                                        title="Clear"
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                )}
                            </div>

                            <div className="stc-selected-info">
                                Selected: <strong>{selectedStudents.length}</strong> of <strong>{data.length}</strong>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="stc-table-scroll">
                            <table className="stc-table">
                                <thead>
                                    <tr>
                                        <th>SrNo</th>
                                        <th>
                                            <input
                                                type="checkbox"
                                                className="stc-checkbox"
                                                checked={data.length > 0 && selectedStudents.length === data.length}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Contact Person</th>
                                        <th>Address</th>
                                        <th>Mobile No</th>
                                        <th>Course Name</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10">
                                                <div className="stc-empty">
                                                    <div className="stc-empty-icon">
                                                        <i className="bi bi-hourglass-split"></i>
                                                    </div>
                                                    <h5>Loading...</h5>
                                                    <p>Please wait while we load students.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan="10">
                                                <div className="stc-empty">
                                                    <div className="stc-empty-icon">
                                                        <i className="bi bi-person-x"></i>
                                                    </div>
                                                    <h5>No Students Found</h5>
                                                    <p>No records match your search.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <span className="stc-serial">
                                                        {(pageNo - 1) * pageSize + index + 1}
                                                    </span>
                                                </td>

                                                <td>
                                                    <input
                                                        className="stc-checkbox"
                                                        type="checkbox"
                                                        checked={isRowSelected(item.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedStudents((prev) => [
                                                                    ...prev,
                                                                    {
                                                                        id: item.id,
                                                                        courseId: item.courseId,
                                                                        amount: item.amount ?? 0,
                                                                    },
                                                                ]);
                                                            } else {
                                                                setSelectedStudents((prev) =>
                                                                    prev.filter((s) => s.id !== item.id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </td>

                                                <td>
                                                    <img
                                                        src={item.selfImageShow}
                                                        alt="Student"
                                                        className="stc-avatar"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "https://ui-avatars.com/api/?name=" +
                                                                encodeURIComponent(item.name || "S");
                                                        }}
                                                    />
                                                </td>

                                                <td>
                                                    <div className="stc-name">{item.name || "-"}</div>
                                                </td>
                                                <td>{item.fatherName || "-"}</td>
                                                <td>{item.address || "-"}</td>
                                                <td>{item.mobileNo || "-"}</td>
                                                <td>{item.courseName || "-"}</td>
                                                <td>
                                                    <span className="stc-amount">
                                                        {formatCurrency(item.amount)}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        className="stc-action-btn"
                                                        onClick={() => handleEdit(item.id)}
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Pagination */}
                        {totalRecords > 0 && (
                            <div className="stc-footer">
                                <div className="stc-record-info">
                                    Showing <strong>{startRecord}</strong> to{" "}
                                    <strong>{endRecord}</strong> of{" "}
                                    <strong>{totalRecords}</strong> records
                                </div>

                                <div className="stc-pagination">
                                    <button
                                        className="stc-page-btn"
                                        disabled={pageNo <= 1}
                                        onClick={handlePrevious}
                                        title="Previous"
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>

                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            className={`stc-page-btn ${pageNo === page ? "active" : ""}`}
                                            onClick={() => setPageNo(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <span className="stc-page-of">
                                        of {totalPages || 1}
                                    </span>

                                    <button
                                        className="stc-page-btn"
                                        disabled={pageNo >= totalPages}
                                        onClick={handleNext}
                                        title="Next"
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </section>

            </div>

            {/* =====================================================
                DELETE MODAL
            ===================================================== */}
            {showDeleteModal && (
                <div className="stc-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="stc-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="stc-modal-header">
                            <div className="stc-modal-icon">
                                <i className="bi bi-trash3-fill"></i>
                            </div>
                            <h4>Delete Student?</h4>
                            <p>Are you sure you want to delete this student?</p>
                        </div>

                        <div className="stc-modal-warning">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>This action cannot be undone.</span>
                        </div>

                        <div className="stc-modal-footer">
                            <button
                                type="button"
                                className="stc-cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <i className="bi bi-x-lg me-1"></i>
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="stc-delete-btn"
                                onClick={confirmDelete}
                            >
                                <i className="bi bi-trash me-1"></i>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SendToConfirm