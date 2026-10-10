 import React, { useEffect, useState, useMemo } from "react";
import { getOfflinePayments } from "../../AllServicesFiles/PaymentService";

function OfflinePaymentList() {
    const [activeTab, setActiveTab] = useState("Success");
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // ✅ Search & Pagination State
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Fetch on tab change
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setList([]);
                setSelectedItem(null);
                setSearch("");
                setCurrentPage(1);

                const result = await getOfflinePayments(activeTab);

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
        };

        fetchData();
    }, [activeTab]);

    // ✅ Filtered List (Search)
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

    // ✅ Pagination Calculations
    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedList = filteredList.slice(startIndex, endIndex);

    // ✅ Reset page on search / pageSize change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, pageSize]);

    // ✅ Page number buttons
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

                .off-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ============ TOP HEADER ============ */
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

                /* ============ TOP TABS ============ */
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

                /* ============ BODY ============ */
                .off-body {
                    background: #fff;
                    border-radius: 0 0 16px 16px;
                    padding: 24px 28px 28px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
                    min-height: 400px;
                }

                /* ============ TOOLBAR (Search + Page Size) ============ */
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

                /* ============ LIST ============ */
                .list-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .list-card {
                    background: #fff;
                    border-radius: 14px;
                    padding: 18px 20px;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    transition: all 0.25s ease;
                    animation: cardFadeIn 0.4s ease;
                }

                @keyframes cardFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .list-card:hover {
                    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
                    border-color: #c7d2fe;
                    transform: translateY(-2px);
                }

                .list-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 18px;
                    flex-shrink: 0;
                }

                .list-info { flex: 1; min-width: 0; }

                .list-info h3 {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 3px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .list-info p {
                    font-size: 12.5px;
                    color: #64748b;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .list-amount {
                    font-size: 16px;
                    font-weight: 800;
                    color: #059669;
                    flex-shrink: 0;
                    min-width: 100px;
                    text-align: right;
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

                /* ============ PAGINATION ============ */
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

                /* ============ EMPTY / LOADING ============ */
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

                /* ============ DETAILS MODAL ============ */
                .details-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .details-card {
                    background: #fff;
                    border-radius: 20px;
                    width: 500px;
                    max-width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    animation: cardPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes cardPop {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .details-header {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    padding: 22px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 2;
                }

                .details-header h2 { font-size: 18px; font-weight: 700; }

                .close-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.35);
                    transform: rotate(90deg);
                }

                .details-body { padding: 24px; }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 12px 0;
                    border-bottom: 1px dashed #e2e8f0;
                    font-size: 13.5px;
                }

                .detail-row:last-child { border-bottom: none; }

                .detail-row .label {
                    color: #64748b;
                    font-weight: 500;
                    flex-shrink: 0;
                }

                .detail-row .value {
                    color: #1e293b;
                    font-weight: 600;
                    text-align: right;
                    margin-left: 16px;
                    word-break: break-word;
                }

                .details-footer { padding: 0 24px 24px; }

                .btn-close-modal {
                    width: 100%;
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

                .btn-close-modal:hover { background: #e2e8f0; color: #475569; }

                /* ============ RESPONSIVE ============ */
                @media (max-width: 768px) {
                    .off-page { padding: 20px 12px; }
                    .off-top-header { padding: 20px 18px 0; }
                    .off-tabs { margin: 0 -18px; padding: 0 18px; }
                    .off-body { padding: 20px 18px; }
                    .list-card { flex-wrap: wrap; gap: 12px; }
                    .list-info { flex: 1 1 100%; }
                    .off-tab { padding: 10px 16px; font-size: 13.5px; }
                    .off-toolbar { flex-direction: column; align-items: stretch; }
                    .search-box { max-width: 100%; }
                    .page-size-box { justify-content: space-between; }
                    .pagination-wrapper { flex-direction: column; }
                    .pagination-buttons { flex-wrap: wrap; justify-content: center; }
                }
            `}</style>

            <div className="off-page">
                <div className="off-container">
                    {/* HEADER */}
                    <div className="off-top-header">
                        <div className="off-title">
                            <span>💳</span>
                            <span>Payments</span>
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

                    {/* BODY */}
                    <div className="off-body">
                        {/* ✅ TOOLBAR — Search + Page Size */}
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
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span>entries</span>
                            </div>
                        </div>

                        {/* LOADING */}
                        {loading && (
                            <div className="spinner-box">
                                <div className="spinner"></div>
                                <p>Loading {activeTab.toLowerCase()} payments...</p>
                            </div>
                        )}

                        {/* ERROR */}
                        {error && !loading && (
                            <div className="empty-box">
                                <div className="empty-icon">⚠️</div>
                                <h3>Something went wrong</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {/* EMPTY */}
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

                        {/* LIST */}
                        {!loading && !error && filteredList.length > 0 && (
                            <>
                                <div className="list-wrapper">
                                    {paginatedList.map((item, index) => (
                                        <div className="list-card" key={item.oId || index}>
                                            <div className="list-avatar">
                                                {item.name?.trim()?.charAt(0)?.toUpperCase() || "?"}
                                            </div>

                                            <div className="list-info">
                                                <h3>{item.name?.trim() || "Unknown"}</h3>
                                                <p>
                                                    {item.feeName || "N/A"} • {item.orderId || "N/A"}
                                                </p>
                                            </div>

                                            <div className="list-amount">
                                                {formatAmount(item.amount)}
                                            </div>

                                            <button
                                                className="list-btn"
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                👁️ View
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* ✅ PAGINATION */}
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

            {/* ============ DETAILS MODAL ============ */}
            {selectedItem && (
                <div className="details-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="details-card" onClick={(e) => e.stopPropagation()}>
                        <div className="details-header">
                            <h2>📄 Payment Details</h2>
                            <button className="close-btn" onClick={() => setSelectedItem(null)}>
                                ✕
                            </button>
                        </div>

                        <div className="details-body">
                            <div className="detail-row">
                                <span className="label">👤 Name</span>
                                <span className="value">{selectedItem.name?.trim() || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">📧 Email</span>
                                <span className="value">{selectedItem.emailId || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">📱 Mobile</span>
                                <span className="value">{selectedItem.mobileNo || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">📚 Course</span>
                                <span className="value">{selectedItem.feeName || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">📋 Order ID</span>
                                <span className="value">{selectedItem.orderId || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">🔖 Reference ID</span>
                                <span className="value">{selectedItem.referenceId || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">💰 Amount</span>
                                <span className="value" style={{ color: "#059669" }}>
                                    {formatAmount(selectedItem.amount)}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="label">💵 Amount (Words)</span>
                                <span className="value">{selectedItem.amountW || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">📅 Order Date</span>
                                <span className="value">{selectedItem.oDate || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">🖨️ Pay Date</span>
                                <span className="value">{selectedItem.printPayDate || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">🏠 Address</span>
                                <span className="value">{selectedItem.address || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">✅ Status</span>
                                <span className="value">{selectedItem.payStatus || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">💳 Gateway</span>
                                <span className="value">{selectedItem.getwayPrm || "N/A"}</span>
                            </div>
                        </div>

                        <div className="details-footer">
                            <button className="btn-close-modal" onClick={() => setSelectedItem(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OfflinePaymentList;