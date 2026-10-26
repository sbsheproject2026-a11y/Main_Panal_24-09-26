
 
 import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    createOfflinePayment,
    getBooksPayments,
     
} from "../../AllServicesFiles/PaymentService";
import { useNavigate } from "react-router-dom";

function BookPaymentRequestList() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Success");
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddForm, setShowAddForm] = useState(false);
    const [addFormData, setAddFormData] = useState({
        userId: "",
        studentName: "",
        courseId: "",
        feeName: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        remark: "",
    });
    const [addErrors, setAddErrors] = useState({});
    const [addSubmitting, setAddSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setList([]);
            setSelectedItem(null);
            setSearch("");
            setCurrentPage(1);

            const result = await getBooksPayments(activeTab);

            if (result?.success && result?.data) {
                setList(result.data);
            } else {
                setList([]);
            }
        } catch (err) {
            console.error(err);
            setError("Data load nahi ho paaya!");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredList = useMemo(() => {
        if (!search.trim()) return list;
        const s = search.toLowerCase().trim();

        return list.filter((item) => {
            return (
                item.name?.toLowerCase().includes(s) ||
                item.emailId?.toLowerCase().includes(s) ||
                item.mobileNo?.toLowerCase().includes(s) ||
                item.orderId?.toLowerCase().includes(s) ||
                item.feeName?.toLowerCase().includes(s) ||
                item.referenceId?.toLowerCase().includes(s) ||
                item.address?.toLowerCase().includes(s) ||
                item.payStatus?.toLowerCase().includes(s)
            );
        });
    }, [list, search]);

    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedList = filteredList.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, pageSize]);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push("...");
            }

            for (let i = start; i <= end; i++) pages.push(i);

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const formatAmount = (amt) => {
        const num = Number(amt || 0);
        return `₹${num.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handleAdd = (item) => {
        setSelectedItem(null);
        setAddErrors({});

        const studentUserId = item.eId || item.studentId || item.userId || "";
        const courseId =
            item.productId ||
            item.ProductId ||
            item.courseId ||
            item.CourseId ||
            "";

        setAddFormData({
            userId: studentUserId,
            studentName: item.name?.trim() || "",
            courseId: courseId,
            feeName: item.feeName || "",
            amount: "",
            paymentDate: new Date().toISOString().split("T")[0],
            remark: "",
        });
        setShowAddForm(true);
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddFormData((prev) => ({ ...prev, [name]: value }));
        if (addErrors[name]) {
            setAddErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateAddForm = () => {
        const err = {};
        if (!addFormData.amount || Number(addFormData.amount) <= 0) {
            err.amount = "Valid amount required";
        }
        if (!addFormData.paymentDate) {
            err.paymentDate = "Payment date required";
        }
        if (!addFormData.userId) {
            err.userId = "Student ID missing";
        }
        if (!addFormData.remark?.trim()) {
            err.remark = "Remark required";
        }
        setAddErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!validateAddForm()) return;

        setAddSubmitting(true);
        try {
            const res = await createOfflinePayment({
                userId: addFormData.userId,
                amount: addFormData.amount,
                remark: addFormData.remark.trim(),
                paidDate: addFormData.paymentDate,
                courseid: addFormData.courseId || 4,
            });

            const responseData = res?.data || res;

            if (responseData?.success) {
                alert(responseData.message || "Payment added successfully!");
                setShowAddForm(false);
                fetchData();
            } else {
                alert(responseData?.message || "Failed to save payment");
            }
        } catch (err) {
            console.error("Add payment error:", err);
            alert(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to save payment"
            );
        } finally {
            setAddSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .off-page {
                    min-height: 100vh;
                    background: #f1f5f9;
                    padding: 30px 20px;
                    font-family: 'Segoe UI', Tahoma, sans-serif;
                }

                .off-container { max-width: 1400px; margin: 0 auto; }

                .off-top-header {
                    background: #fff;
                    border-radius: 16px 16px 0 0;
                    padding: 24px 28px 0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
                }

                .off-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .off-tabs {
                    display: flex;
                    gap: 8px;
                    border-bottom: 2px solid #f1f5f9;
                    margin: 0 -28px;
                    padding: 0 28px;
                }

                .off-tab {
                    padding: 12px 22px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 14.5px;
                    font-weight: 600;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.25s ease;
                    border-bottom: 3px solid transparent;
                    margin-bottom: -2px;
                }

                .off-tab:hover { color: #475569; }

                .off-tab.active {
                    color: #6366f1;
                    border-bottom-color: #6366f1;
                }

                .off-tab .tab-badge {
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 11.5px;
                    font-weight: 700;
                    background: #f1f5f9;
                    color: #64748b;
                }

                .off-tab.active .tab-badge {
                    background: #eef2ff;
                    color: #6366f1;
                }

                .off-body {
                    background: #fff;
                    border-radius: 0 0 16px 16px;
                    padding: 24px 28px 28px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
                    min-height: 400px;
                }

                .off-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .search-box {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                    min-width: 200px;
                }

                .search-box input {
                    width: 100%;
                    padding: 11px 40px 11px 40px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px;
                    font-family: inherit;
                    color: #1e293b;
                    outline: none;
                    transition: all 0.2s ease;
                    background: #f8fafc;
                }

                .search-box input:focus {
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
                }

                .search-box .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    font-size: 15px;
                    pointer-events: none;
                }

                .search-box .clear-btn {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 22px;
                    height: 22px;
                    border: none;
                    border-radius: 50%;
                    background: #e2e8f0;
                    color: #64748b;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .search-box .clear-btn:hover {
                    background: #cbd5e1;
                    color: #475569;
                }

                .page-size-box {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13.5px;
                    color: #64748b;
                }

                .page-size-box select {
                    padding: 9px 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 13.5px;
                    font-family: inherit;
                    color: #1e293b;
                    background: #f8fafc;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .page-size-box select:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
                }

                /* ============================================
                   ✅ TABLE WRAPPER — RollNoList style scroll
                   ============================================ */
                .table-wrapper {
                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    box-sizing: border-box;
                    position: relative;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-gutter: stable;
                    contain: inline-size;
                    border: 2px solid #cbd5e1;
                    border-radius: 12px;
                    background: #fff;
                }

                /* Scrollbar — visible thin style */
                .table-wrapper::-webkit-scrollbar {
                    height: 10px;
                }
                .table-wrapper::-webkit-scrollbar-track {
                    background: #eef1f5;
                    border-radius: 10px;
                }
                .table-wrapper::-webkit-scrollbar-thumb {
                    background: #b8bfcc;
                    border-radius: 10px;
                    border: 2px solid #eef1f5;
                }
                .table-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #8f98a8;
                }

                .table-wrapper {
                    scrollbar-width: thin;
                    scrollbar-color: #b8bfcc #eef1f5;
                }

                /* ============================================
                   TABLE
                   ============================================ */
                .data-table {
                    width: auto !important;
                    min-width: 100% !important;
                    max-width: none !important;
                    table-layout: auto !important;
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                    margin: 0 !important;
                    font-size: 13.5px;
                }

                .data-table th,
                .data-table td {
                    box-sizing: border-box;
                    white-space: nowrap !important;
                }

                .data-table thead th {
                    padding: 14px 16px;
                    text-align: left;
                    font-size: 11.5px;
                    font-weight: 700;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    background: #f1f5f9;
                    border-right: 1px solid #cbd5e1;
                    border-bottom: 2px solid #94a3b8;
                }

                .data-table thead th:last-child { border-right: none; }
                .data-table thead th.center { text-align: center; }
                .data-table thead th.right  { text-align: right; }

                .data-table tbody tr {
                    transition: background 0.15s ease;
                }

                .data-table tbody tr:hover { background: #f8faff; }

                .data-table tbody td {
                    padding: 12px 16px;
                    color: #1e293b;
                    vertical-align: middle;
                    border-right: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .data-table tbody td:last-child { border-right: none; }
                .data-table tbody tr:last-child td { border-bottom: none; }
                .data-table tbody td.center { text-align: center; }
                .data-table tbody td.right  { text-align: right; }

                .table-user-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 200px;
                }

                .table-user-avatar {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .table-user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    min-width: 0;
                }

                .table-user-name {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 13.5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .table-user-email {
                    font-size: 11.5px;
                    color: #94a3b8;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .table-cell-mono {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    color: #475569;
                    letter-spacing: 0.2px;
                    white-space: nowrap;
                }

                .table-cell-text {
                    color: #475569;
                    font-size: 13px;
                    max-width: 220px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: block;
                }

                .table-amount {
                    font-weight: 800;
                    font-size: 14px;
                    color: #1e293b;
                    white-space: nowrap;
                }

                .table-amount-paid {
                    font-weight: 700;
                    font-size: 13.5px;
                    color: #059669;
                    white-space: nowrap;
                }

                .table-amount-pending {
                    font-weight: 800;
                    font-size: 14px;
                    color: #ea580c;
                    white-space: nowrap;
                }

                .table-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 11px;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .table-status.success {
                    background: #d1fae5;
                    color: #065f46;
                }

                .table-status.pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .table-status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: currentColor;
                    opacity: 0.7;
                }

                .table-actions {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    white-space: nowrap;
                }

                .table-btn {
                    padding: 7px 14px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    white-space: nowrap;
                }

                .table-btn-view {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                }

                .table-btn-view:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
                }

                .table-btn-add {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: #fff;
                }

                .table-btn-add:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
                }

                /* Pagination */
                .pagination-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #f1f5f9;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .pagination-info {
                    font-size: 13px;
                    color: #64748b;
                }

                .pagination-info strong {
                    color: #1e293b;
                    font-weight: 700;
                }

                .pagination-buttons {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .page-btn {
                    min-width: 36px;
                    height: 36px;
                    padding: 0 10px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    border-radius: 8px;
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .page-btn:hover:not(:disabled):not(.dots) {
                    border-color: #6366f1;
                    color: #6366f1;
                    background: #eef2ff;
                }

                .page-btn.active {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-color: #6366f1;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.35);
                }

                .page-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .page-btn.dots {
                    border: none;
                    background: transparent;
                    cursor: default;
                    color: #94a3b8;
                }

                .empty-box, .spinner-box {
                    padding: 60px 20px;
                    text-align: center;
                    color: #94a3b8;
                }

                .empty-icon { font-size: 48px; margin-bottom: 12px; }

                .empty-box h3 {
                    font-size: 16px;
                    color: #64748b;
                    margin-bottom: 4px;
                }

                .empty-box p { font-size: 13px; }

                .spinner {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 12px;
                    border: 4px solid #e2e8f0;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .spinner-box p { font-size: 13.5px; color: #64748b; }

                /* DETAILS MODAL */
                .details-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.55);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                    animation: fadeIn 0.25s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .details-card {
                    background: #fff;
                    border-radius: 22px;
                    width: 620px;
                    max-width: 100%;
                    max-height: 92vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.35);
                    animation: cardPop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes cardPop {
                    from { opacity: 0; transform: scale(0.92) translateY(24px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .details-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 20px 24px;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: #fff;
                    flex-shrink: 0;
                }

                .details-header-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .details-header-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(6px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: #fff;
                    flex-shrink: 0;
                }

                .details-header h2 {
                    margin: 0 0 2px;
                    font-size: 17px;
                    font-weight: 700;
                    letter-spacing: -0.2px;
                }

                .details-header span {
                    font-size: 12px;
                    opacity: 0.85;
                }

                .close-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.18);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                .details-body {
                    padding: 22px 24px;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .details-hero {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 30px 22px;
                    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                    border: 1px solid #c7d2fe;
                    border-radius: 16px;
                    position: relative;
                    overflow: hidden;
                }

                .details-hero::before {
                    content: "";
                    position: absolute;
                    top: -40%;
                    right: -10%;
                    width: 180px;
                    height: 180px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .details-hero-left {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    position: relative;
                    z-index: 1;
                }

                .details-hero-label {
                    font-size: 11.5px;
                    font-weight: 700;
                    color: #6366f1;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                }

                .details-hero-amount {
                    font-size: 28px;
                    font-weight: 800;
                    color: #4338ca;
                    letter-spacing: -0.6px;
                    line-height: 1.1;
                }

                .details-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 999px;
                    font-size: 12.5px;
                    font-weight: 700;
                    position: relative;
                    z-index: 1;
                    flex-shrink: 0;
                }

                .details-status.status-success {
                    background: #d1fae5;
                    color: #065f46;
                }

                .details-status.status-pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .details-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .details-section-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #6366f1;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                }

                .details-section-title i {
                    font-size: 14px;
                    color: #8b5cf6;
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }

                .details-grid-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 11px 14px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }

                .details-grid-item:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                }

                .grid-label {
                    font-size: 10.5px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .grid-value {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #1e293b;
                    word-break: break-word;
                    line-height: 1.35;
                }

                .grid-value-mono {
                    font-family: "Courier New", monospace;
                    font-size: 12.5px;
                    letter-spacing: 0.2px;
                }

                .amount-rows {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .amount-row-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 13.5px;
                    color: #475569;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .amount-row-item:hover { background: #f1f5f9; }

                .amount-row-item strong {
                    font-size: 15px;
                    font-weight: 800;
                    letter-spacing: -0.2px;
                }

                .amt-total { color: #1e293b; }
                .amt-paid { color: #059669; }

                .amt-pending-row {
                    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
                    border-color: #fed7aa;
                }

                .amt-pending { color: #ea580c; }

                .amount-words {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 12px 16px;
                    background: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 12px;
                    font-size: 12.5px;
                    color: #0c4a6e;
                    font-style: italic;
                    line-height: 1.5;
                }

                .amount-words i {
                    color: #0284c7;
                    font-size: 14px;
                    margin-top: 1px;
                    flex-shrink: 0;
                }

                .details-footer {
                    padding: 16px 24px 20px;
                    border-top: 1px solid #f1f5f9;
                    background: #fafbfc;
                    flex-shrink: 0;
                    display: flex;
                    gap: 10px;
                }

                .btn-close-modal {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    background: #fff;
                    color: #475569;
                    font-weight: 700;
                    font-size: 13.5px;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .btn-close-modal:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                    color: #1e293b;
                }

                .details-body::-webkit-scrollbar { width: 6px; }
                .details-body::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
                .details-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

                /* ADD FORM MODAL */
                .add-form-card { width: 480px; max-height: 90vh; }

                .add-form-card form {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                }

                .add-form-card .details-body {
                    overflow-y: auto;
                    flex: 1;
                    min-height: 0;
                }

                .form-group {
                    margin-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                }

                .form-label .req {
                    color: #ef4444;
                    margin-left: 2px;
                }

                .form-input {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px;
                    font-family: inherit;
                    color: #1e293b;
                    background: #f8fafc;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .form-input:focus {
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
                }

                .form-input.readonly {
                    background: #f1f5f9;
                    color: #64748b;
                    cursor: not-allowed;
                }

                .form-input.has-error {
                    border-color: #ef4444;
                    background: #fef2f2;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 70px;
                }

                .error-text {
                    font-size: 12px;
                    color: #ef4444;
                    font-weight: 500;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    width: 100%;
                }

                .btn-cancel-modal {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 12px;
                    background: #f1f5f9;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                }

                .btn-cancel-modal:hover:not(:disabled) {
                    background: #e2e8f0;
                    color: #475569;
                }

                .btn-submit-modal {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }

                .btn-submit-modal:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
                }

                .btn-submit-modal:disabled,
                .btn-cancel-modal:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .off-page { padding: 20px 12px; }
                    .off-top-header { padding: 20px 18px 0; }
                    .off-tabs { margin: 0 -18px; padding: 0 18px; }
                    .off-body { padding: 20px 18px; }
                    .off-tab { padding: 10px 16px; font-size: 13.5px; }
                    .off-toolbar { flex-direction: column; align-items: stretch; }
                    .search-box { max-width: 100%; }
                    .page-size-box { justify-content: space-between; }
                    .pagination-wrapper { flex-direction: column; }
                    .pagination-buttons { flex-wrap: wrap; justify-content: center; }
                }

                @media (max-width: 640px) {
                    .details-overlay { padding: 12px; }
                    .details-card { border-radius: 18px; max-height: 94vh; }
                    .details-header { padding: 16px 18px; }
                    .details-header h2 { font-size: 15.5px; }
                    .details-header-icon { width: 38px; height: 38px; font-size: 17px; }
                    .details-body { padding: 18px; gap: 14px; }
                    .details-hero { padding: 16px 18px; }
                    .details-hero-amount { font-size: 22px; }
                    .details-grid { grid-template-columns: 1fr; }
                    .details-footer { padding: 14px 18px 18px; flex-direction: column; }
                }
            `}</style>

            <div className="off-page">
                <div className="off-container">
                    <div className="off-top-header">
                        <div className="off-title">
                            <span>💳</span>
                            <span>Book's Payments</span>
                        </div>

                        <div className="off-tabs">
                            <button
                                className={`off-tab ${activeTab === "Success" ? "active" : ""}`}
                                onClick={() => setActiveTab("Success")}
                            >
                                <span className="tab-icon">✅</span>
                                <span>Success</span>
                                {activeTab === "Success" && (
                                    <span className="tab-badge">{list.length}</span>
                                )}
                            </button>

                            <button
                                className={`off-tab ${activeTab === "Pending" ? "active" : ""}`}
                                onClick={() => setActiveTab("Pending")}
                            >
                                <span className="tab-icon">⏳</span>
                                <span>Pending</span>
                                {activeTab === "Pending" && (
                                    <span className="tab-badge">{list.length}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="off-body">
                        <div className="off-toolbar">
                            <div className="search-box">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, mobile, order id..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        className="clear-btn"
                                        onClick={() => setSearch("")}
                                        title="Clear"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <div className="page-size-box">
                                <span>Show</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                >
                                    <option value={100}>100</option>
                                    <option value={250}>250</option>
                                    <option value={500}>500</option>
                                    <option value={1000}>1000</option>
                                </select>
                                <span>entries</span>
                            </div>
                        </div>

                        {loading && (
                            <div className="spinner-box">
                                <div className="spinner"></div>
                                <p>Loading {activeTab.toLowerCase()} payments...</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="empty-box">
                                <div className="empty-icon">⚠️</div>
                                <h3>Something went wrong</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {!loading && !error && filteredList.length === 0 && (
                            <div className="empty-box">
                                <div className="empty-icon">
                                    {search ? "🔍" : activeTab === "Success" ? "📭" : "⏳"}
                                </div>
                                <h3>
                                    {search
                                        ? "No results found"
                                        : `No ${activeTab.toLowerCase()} payments`}
                                </h3>
                                <p>
                                    {search
                                        ? `No match for "${search}"`
                                        : "Data not available for this filter"}
                                </p>
                            </div>
                        )}

                        {!loading && !error && filteredList.length > 0 && (
                            <>
                                <div className="table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Quantity</th>
                                                <th>Student</th>
                                                <th>Order ID</th>
                                                <th>Course / Fee</th>
                                                <th className="right">Total</th>
                                                <th className="right">Paid</th>
                                                <th className="right">Pending</th>
                                                <th className="center">Status</th>
                                                <th className="center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedList.map((item, index) => (
                                                <tr key={item.oId || index}>
                                                    <td>
                                                        <span className="table-cell-mono">
                                                            {item.quantity || "0"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="table-user-cell">
                                                            <div className="table-user-avatar">
                                                                {item.name?.trim()?.charAt(0)?.toUpperCase() || "?"}
                                                            </div>
                                                            
                                                            <div className="table-user-info">
                                                                <span className="table-user-name">
                                                                    {item.name?.trim() || "Unknown"}
                                                                </span>
                                                                <span className="table-user-email">
                                                                    {item.mobileNo || item.emailId || "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="table-cell-mono">
                                                            {item.orderId || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="table-cell-text"
                                                            title={item.feeName || "N/A"}
                                                        >
                                                            {item.feeName || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="right">
                                                        <span className="table-amount">
                                                            {formatAmount(item.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="right">
                                                        <span className="table-amount-paid">
                                                            {formatAmount(item.paidAmount)}
                                                        </span>
                                                    </td>
                                                    <td className="right">
                                                        <span className="table-amount-pending">
                                                            {formatAmount(item.pendingAmount)}
                                                        </span>
                                                    </td>
                                                    <td className="center">
                                                        <span
                                                            className={`table-status ${
                                                                item.payStatus === "Success"
                                                                    ? "success"
                                                                    : "pending"
                                                            }`}
                                                        >
                                                            <span className="table-status-dot"></span>
                                                            {item.payStatus || "Pending"}
                                                        </span>
                                                    </td>
                                                    <td className="center">
                                                        <div className="table-actions">
                                                            <button
                                                                className="table-btn table-btn-view"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    navigate(`/student-payments/${item.eId}`);
                                                                }}
                                                                title={`View payments of ${item.name}`}
                                                            >
                                                                📄 Print
                                                            </button>

                                                            <button
                                                                className="table-btn table-btn-view"
                                                                onClick={() => setSelectedItem(item)}
                                                            >
                                                                👁️ View
                                                            </button>

                                                            {Number(item.pendingAmount || 0) > 0 && (
                                                                <button
                                                                    className="table-btn table-btn-add"
                                                                    onClick={() => handleAdd(item)}
                                                                >
                                                                    ➕ Add
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pagination-wrapper">
                                    <div className="pagination-info">
                                        Showing <strong>{startIndex + 1}</strong> to{" "}
                                        <strong>{Math.min(endIndex, totalItems)}</strong> of{" "}
                                        <strong>{totalItems}</strong> entries
                                    </div>

                                    <div className="pagination-buttons">
                                        <button
                                            className="page-btn"
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            title="First"
                                        >
                                            «
                                        </button>
                                        <button
                                            className="page-btn"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ‹
                                        </button>

                                        {getPageNumbers().map((p, i) =>
                                            p === "..." ? (
                                                <span key={`dots-${i}`} className="page-btn dots">
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    className={`page-btn ${currentPage === p ? "active" : ""}`}
                                                    onClick={() => setCurrentPage(p)}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )}

                                        <button
                                            className="page-btn"
                                            onClick={() =>
                                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                                            }
                                            disabled={currentPage === totalPages}
                                        >
                                            ›
                                        </button>
                                        <button
                                            className="page-btn"
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                            title="Last"
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedItem && (
                <div className="details-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="details-card" onClick={(e) => e.stopPropagation()}>
                        <div className="details-header">
                            <div className="details-header-left">
                                <div className="details-header-icon">
                                    <i className="bi bi-receipt"></i>
                                </div>
                                <div>
                                    <h2>Payment Details</h2>
                                    <span>Transaction Information</span>
                                </div>
                            </div>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedItem(null)}
                                title="Close"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="details-body">
                            <div className="details-hero">
                                <div className="details-hero-left">
                                    <span className="details-hero-label">Total Amount</span>
                                    <strong className="details-hero-amount">
                                        {formatAmount(selectedItem.amount)}
                                    </strong>
                                </div>
                                <span
                                    className={`details-status ${
                                        selectedItem.payStatus === "Success"
                                            ? "status-success"
                                            : "status-pending"
                                    }`}
                                >
                                    <i
                                        className={`bi ${
                                            selectedItem.payStatus === "Success"
                                                ? "bi-check-circle-fill"
                                                : "bi-clock-fill"
                                        }`}
                                    ></i>
                                    {selectedItem.payStatus || "Pending"}
                                </span>
                            </div>

                            <div className="details-section">
                                <div className="details-section-title">
                                    <i className="bi bi-person-fill"></i>
                                    <span>Student Information</span>
                                </div>
                                <div className="details-grid">
                                    <div className="details-grid-item">
                                        <span className="grid-label">Name</span>
                                        <span className="grid-value">
                                            {selectedItem.name?.trim() || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Email</span>
                                        <span className="grid-value grid-value-mono">
                                            {selectedItem.emailId || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Mobile</span>
                                        <span className="grid-value grid-value-mono">
                                            {selectedItem.mobileNo || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Address</span>
                                        <span className="grid-value">
                                            {selectedItem.address || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="details-section">
                                <div className="details-section-title">
                                    <i className="bi bi-cash-stack"></i>
                                    <span>Payment Breakdown</span>
                                </div>

                                <div className="amount-rows">
                                    <div className="amount-row-item">
                                        <span>Total Amount</span>
                                        <strong className="amt-total">
                                            {formatAmount(selectedItem.amount)}
                                        </strong>
                                    </div>
                                    <div className="amount-row-item">
                                        <span>Paid Amount</span>
                                        <strong className="amt-paid">
                                            {formatAmount(selectedItem.paidAmount)}
                                        </strong>
                                    </div>
                                    <div className="amount-row-item amt-pending-row">
                                        <span>Pending Amount</span>
                                        <strong className="amt-pending">
                                            {formatAmount(selectedItem.pendingAmount)}
                                        </strong>
                                    </div>
                                    {selectedItem.amountW && (
                                        <div className="amount-words">
                                            <i className="bi bi-chat-quote"></i>
                                            <span>{selectedItem.amountW}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="details-section">
                                <div className="details-section-title">
                                    <i className="bi bi-receipt-cutoff"></i>
                                    <span>Transaction Info</span>
                                </div>
                                <div className="details-grid">
                                    <div className="details-grid-item">
                                        <span className="grid-label">Order ID</span>
                                        <span className="grid-value grid-value-mono">
                                            {selectedItem.orderId || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Reference ID</span>
                                        <span className="grid-value grid-value-mono">
                                            {selectedItem.referenceId || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Course / Fee</span>
                                        <span className="grid-value">
                                            {selectedItem.feeName || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Gateway</span>
                                        <span className="grid-value">
                                            {selectedItem.getwayPrm || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Order Date</span>
                                        <span className="grid-value">
                                            {selectedItem.oDate || "N/A"}
                                        </span>
                                    </div>
                                    <div className="details-grid-item">
                                        <span className="grid-label">Pay Date</span>
                                        <span className="grid-value">
                                            {selectedItem.printPayDate || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="details-footer">
                            <button
                                className="btn-close-modal"
                                onClick={() => setSelectedItem(null)}
                            >
                                <i className="bi bi-x-lg"></i>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD PAYMENT MODAL */}
            {showAddForm && (
                <div className="details-overlay" onClick={() => setShowAddForm(false)}>
                    <div
                        className="details-card add-form-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="details-header">
                            <h2>➕ Add Offline Payment</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowAddForm(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit}>
                            <div className="details-body">
                                <div className="form-group">
                                    <label className="form-label">👤 Student Name</label>
                                    <input
                                        type="text"
                                        className="form-input readonly"
                                        value={addFormData.studentName}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">🆔 Student ID (UserId)</label>
                                    <input
                                        type="text"
                                        className="form-input readonly"
                                        value={addFormData.userId}
                                        readOnly
                                    />
                                    {addErrors.userId && (
                                        <small className="error-text">
                                            {addErrors.userId}
                                        </small>
                                    )}
                                </div>

                                {addFormData.courseId && (
                                    <div className="form-group">
                                        <label className="form-label">📚 Course ID</label>
                                        <input
                                            type="text"
                                            className="form-input readonly"
                                            value={addFormData.courseId}
                                            readOnly
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">
                                        💰 Amount <span className="req">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className={`form-input ${addErrors.amount ? "has-error" : ""}`}
                                        placeholder="Enter amount"
                                        value={addFormData.amount}
                                        onChange={handleAddChange}
                                        min="1"
                                        step="0.01"
                                        autoFocus
                                    />
                                    {addErrors.amount && (
                                        <small className="error-text">
                                            {addErrors.amount}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        📅 Payment Date <span className="req">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="paymentDate"
                                        className={`form-input ${addErrors.paymentDate ? "has-error" : ""}`}
                                        value={addFormData.paymentDate}
                                        onChange={handleAddChange}
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                    {addErrors.paymentDate && (
                                        <small className="error-text">
                                            {addErrors.paymentDate}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        📝 Remark <span className="req">*</span>
                                    </label>
                                    <textarea
                                        name="remark"
                                        className={`form-input form-textarea ${addErrors.remark ? "has-error" : ""}`}
                                        placeholder="e.g. Cash payment collected at office"
                                        value={addFormData.remark}
                                        onChange={handleAddChange}
                                        rows={3}
                                        maxLength={200}
                                    />
                                    {addErrors.remark && (
                                        <small className="error-text">
                                            {addErrors.remark}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="details-footer">
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel-modal"
                                        onClick={() => setShowAddForm(false)}
                                        disabled={addSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit-modal"
                                        disabled={addSubmitting}
                                    >
                                        {addSubmitting ? "Saving..." : "Save Payment"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default BookPaymentRequestList;