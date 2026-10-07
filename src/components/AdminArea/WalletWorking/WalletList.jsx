 import React, { useEffect, useMemo, useState } from "react";
import { getFrenchisesAssign1, getWalletBalance } from "../../AllServicesFiles/WalletService";

const WalletList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [frenchises, setFrenchises] = useState([]);

  // ✅ franchise state
  const [formData, setFormData] = useState({
    franchiseId: "",
  });

  // ✅ pagination state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadFrenchises();
    loadWallets(); // ✅ normal view - saara data
  }, []);

  const loadFrenchises = async () => {
    try {
      const result = await getFrenchisesAssign1(9);
      setFrenchises(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ franchiseId optional param
  const loadWallets = async (franchiseId) => {
    try {
      setLoading(true);

      const result = franchiseId
        ? await getWalletBalance(franchiseId)
        : await getWalletBalance();

      setTransactions(result?.data || []);
    } catch (error) {
      console.log("Wallet load error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ franchise change → wallet reload
  const handleFranchiseChange = (e) => {
    const franchiseId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      franchiseId,
    }));

    setPageNo(1);
    loadWallets(franchiseId);
  };

  // =========================================================
  // FILTER
  // =========================================================
  const filteredWallets = useMemo(() => {
    return transactions.filter((item) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        String(item.id).includes(searchText) ||
        String(item.fundId).includes(searchText) ||
        (item.remark || "").toLowerCase().includes(searchText) ||
        (item.transactionType || "").toLowerCase().includes(searchText) ||
        (item.transactionNumber || "").toLowerCase().includes(searchText) ||
        (item.balance || "").toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, status]);

  // =========================================================
  // ✅ PAGINATION
  // =========================================================
  const totalRecords = filteredWallets.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // current page ka data
  const paginatedWallets = useMemo(() => {
    const start = (pageNo - 1) * pageSize;
    return filteredWallets.slice(start, start + pageSize);
  }, [filteredWallets, pageNo, pageSize]);

  const startRecord = totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;
  const endRecord = Math.min(pageNo * pageSize, totalRecords);

  // reset pageNo on filter/search/pageSize change
  useEffect(() => {
    setPageNo(1);
  }, [search, status, pageSize]);

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

  // =========================================================
  // SUMMARY CALCULATIONS
  // =========================================================
  const totalCredit = transactions.reduce(
    (total, item) => total + Number(item.cr || 0),
    0
  );

  const totalDebit = transactions.reduce(
    (total, item) => total + Number(item.dr || 0),
    0
  );

  const confirmedCount = transactions.filter(
    (item) => item.status === "Confirmed"
  ).length;

  // =========================================================
  // HELPERS
  // =========================================================
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderBalance = (balance) => {
    const balStr = String(balance || "0");

    if (balStr.startsWith("CR")) {
      const amount = balStr.replace("CR", "");
      return (
        <strong className="balance credit">
          {formatCurrency(amount)}
        </strong>
      );
    }

    if (balStr.startsWith("DR")) {
      const amount = balStr.replace("DR", "");
      return (
        <strong className="balance debit">
          {formatCurrency(amount)}
        </strong>
      );
    }

    return (
      <strong className="balance">
        {formatCurrency(balStr)}
      </strong>
    );
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

        * { box-sizing: border-box; }

        .wallet-list-page {
          min-height: 100vh;
          padding: 30px;
          background: #f5f7fb;
          color: #182235;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
        }

        /* =========================
           HEADER
        ========================= */

        .wallet-list-header {
          max-width: 1250px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .wallet-breadcrumb {
          color: #8b95a7;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .wallet-breadcrumb span {
          padding: 0 7px;
          color: #b9c0cb;
        }

        .wallet-list-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 750;
        }

        .wallet-list-header p {
          margin: 7px 0 0;
          color: #8993a5;
          font-size: 13px;
        }

        /* =========================
           FRANCHISE FILTER
        ========================= */

        .franchise-filter-wrap {
          max-width: 1250px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          background: #fff;
          padding: 16px 20px;
          border: 1px solid #e7ebf2;
          border-radius: 13px;
          box-shadow: 0 5px 20px rgba(31, 45, 75, 0.035);
        }

        .franchise-filter-wrap label {
          font-size: 13px;
          font-weight: 700;
          color: #303944;
          white-space: nowrap;
        }

        .franchise-filter-wrap label span {
          color: #ef4444;
          margin-left: 3px;
        }

        .franchise-select {
          flex: 1;
          min-width: 220px;
          height: 42px;
          padding: 0 14px;
          border: 1px solid #dfe4ea;
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: #252d36;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
        }

        .franchise-select:hover {
          border-color: #c7c9ff;
        }

        .franchise-select:focus {
          border-color: #5b55e7;
          box-shadow: 0 0 0 3px rgba(91, 85, 231, 0.10);
        }

        /* =========================
           SUMMARY
        ========================= */

        .wallet-summary {
          max-width: 1250px;
          margin: 0 auto 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .summary-card {
          min-height: 90px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 17px;
          background: #fff;
          border: 1px solid #e7ebf2;
          border-radius: 13px;
          box-shadow: 0 5px 20px rgba(31, 45, 75, 0.035);
        }

        .summary-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          font-size: 18px;
          font-weight: 800;
        }

        .summary-icon.purple { color: #5b55e7; background: #efeeff; }
        .summary-icon.green { color: #059669; background: #eafaf4; }
        .summary-icon.orange { color: #ea580c; background: #fff3e8; }
        .summary-icon.blue { color: #2563eb; background: #eaf2ff; }

        .summary-card span {
          display: block;
          color: #8b95a7;
          font-size: 11px;
          margin-bottom: 5px;
        }

        .summary-card strong {
          display: block;
          color: #202a3c;
          font-size: 17px;
        }

        /* =========================
           TABLE CARD
        ========================= */

        .wallet-table-card {
          max-width: 1250px;
          margin: auto;
          background: #fff;
          border: 1px solid #e6eaf1;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(31, 45, 75, 0.05);
          overflow: hidden;
        }

        .wallet-table-header {
          min-height: 78px;
          padding: 17px 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #edf0f5;
        }

        .wallet-table-header h2 {
          margin: 0 0 4px;
          font-size: 16px;
        }

        .wallet-table-header p {
          margin: 0;
          color: #929bab;
          font-size: 11px;
        }

        /* =========================
           TOOLS
        ========================= */

        .table-tools {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .wallet-search {
          width: 220px;
          height: 38px;
          display: flex;
          align-items: center;
          border: 1px solid #dfe4ec;
          border-radius: 8px;
          padding: 0 11px;
        }

        .wallet-search span {
          color: #9da5b3;
          font-size: 18px;
        }

        .wallet-search input {
          width: 100%;
          height: 100%;
          padding-left: 8px;
          border: 0;
          outline: 0;
          font-family: inherit;
          font-size: 11px;
          color: #313b4e;
        }

        .wallet-search input::placeholder { color: #aab1bd; }

        .status-filter {
          height: 38px;
          padding: 0 11px;
          border: 1px solid #dfe4ec;
          border-radius: 8px;
          color: #596274;
          background: #fff;
          outline: 0;
          font-size: 11px;
          cursor: pointer;
        }

        .page-size-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 11px;
          white-space: nowrap;
        }

        .page-size-select {
          height: 38px;
          padding: 0 10px;
          border: 1px solid #dfe4ec;
          border-radius: 8px;
          color: #313b4e;
          background: #fff;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          outline: 0;
        }

        /* =========================================================
           TABLE RESPONSIVE
        ========================================================= */

        .table-responsive {
          width: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #c9ced8 #eef1f5;
        }

        .table-responsive::-webkit-scrollbar { height: 9px; }
        .table-responsive::-webkit-scrollbar-track {
          background: #eef1f5;
          border-radius: 10px;
        }
        .table-responsive::-webkit-scrollbar-thumb {
          background: #c9ced8;
          border-radius: 10px;
        }
        .table-responsive::-webkit-scrollbar-thumb:hover { background: #aeb5c2; }

        /* =========================================================
           TABLE
        ========================================================= */

        .wallet-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate;
          border-spacing: 0;
          margin: 0;
        }

        .wallet-table thead { background: #fafbfc; }

        .wallet-table th {
          padding: 12px 20px;
          text-align: left;
          color: #8b94a5;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .wallet-table td {
          padding: 15px 20px;
          border-top: 1px solid #f0f2f6;
          vertical-align: middle;
          white-space: nowrap;
        }

        .wallet-table tbody tr { transition: 0.15s ease; }
        .wallet-table tbody tr:hover { background: #fafbff; }
        .wallet-table tbody tr:last-child td { border-bottom: none; }

        /* =========================
           WALLET ID
        ========================= */

        .wallet-id {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wallet-id strong {
          display: block;
          color: #283247;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .wallet-id span {
          display: block;
          color: #a0a8b6;
          font-size: 10px;
        }

        /* =========================
           CONTACT INFO
        ========================= */

        .contact-info span {
          display: block;
          color: #424c5e;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .contact-info small {
          color: #9ca5b4;
          font-size: 10px;
        }

        /* =========================
           BALANCE
        ========================= */

        .balance {
          color: #1c8a65;
          font-size: 12px;
          white-space: nowrap;
        }

        .balance.credit { color: #07835e; }
        .balance.debit { color: #dc2626; }

        /* =========================
           DR / CR
        ========================= */

        .tx-amount {
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .tx-amount.credit { color: #07835e; }
        .tx-amount.debit { color: #dc2626; }

        /* =========================
           STATUS
        ========================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 30px;
          font-size: 10px;
          font-weight: 650;
          white-space: nowrap;
        }

        .status-badge i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-badge.confirmed {
          color: #07835e;
          background: #eafaf4;
        }

        .status-badge.confirmed i { background: #10b981; }

        .status-badge.pending {
          color: #a45b08;
          background: #fff4e5;
        }

        .status-badge.pending i { background: #f59e0b; }

        /* =========================
           TYPE BADGE
        ========================= */

        .type-badge {
          display: inline-block;
          padding: 4px 9px;
          border-radius: 30px;
          font-size: 10px;
          font-weight: 600;
          background: #eef2ff;
          color: #4f46e5;
          white-space: nowrap;
        }

        /* =========================
           DATE
        ========================= */

        .created-date {
          color: #667084;
          font-size: 11px;
          white-space: nowrap;
        }

        /* =========================
           NO DATA
        ========================= */

        .no-data {
          height: 260px;
          text-align: center;
        }

        .no-data > div {
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .no-data span {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f2f3f7;
          color: #929baa;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .no-data strong {
          color: #4a5364;
          font-size: 13px;
        }

        .no-data p {
          margin: 5px 0;
          color: #9ca4b2;
          font-size: 11px;
        }

        /* =========================
           FOOTER + PAGINATION
        ========================= */

        .table-footer {
          min-height: 60px;
          padding: 13px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #edf0f5;
          gap: 15px;
          flex-wrap: wrap;
        }

        .table-footer > span {
          color: #919aa9;
          font-size: 11px;
        }

        .table-footer > span strong {
          color: #4b5567;
        }

        .pagination-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pagination-info {
          color: #64748b;
          font-size: 11px;
          white-space: nowrap;
        }

        .pagination-info strong { color: #334155; }

        .pagination {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pagination button {
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          border: 1px solid #e1e5ec;
          border-radius: 7px;
          background: #fff;
          color: #6f7888;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 0.15s ease;
        }

        .pagination button:hover:not(:disabled) {
          background: #f5f6fa;
          color: #4f46e5;
          border-color: #c7c9ff;
        }

        .pagination button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination .active-page {
          color: #fff;
          background: #5b55e7;
          border-color: #5b55e7;
        }

        .pagination .active-page:hover {
          background: #5b55e7;
          color: #fff;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1050px) {
          .wallet-summary { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 750px) {
          .wallet-list-page { padding: 16px; }

          .wallet-list-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .wallet-table-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .table-tools { width: 100%; }

          .wallet-search { flex: 1; }

          .status-filter { min-width: 120px; }

          .table-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 520px) {
          .wallet-summary { grid-template-columns: 1fr; }

          .franchise-filter-wrap {
            flex-direction: column;
            align-items: stretch;
          }

          .franchise-select { width: 100%; }

          .table-tools {
            flex-direction: column;
            align-items: stretch;
          }

          .wallet-search { width: 100%; }
          .status-filter { width: 100%; }

          .page-size-wrap { width: 100%; justify-content: flex-start; }
          .page-size-select { flex: 1; }

          .pagination-wrap {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      <div className="wallet-list-page">

        {/* Header */}
        <div className="wallet-list-header">
          <div>
            <div className="wallet-breadcrumb">
              Dashboard <span>/</span> Wallet
            </div>

            <h1>Wallet Transactions</h1>

            <p>
              Manage wallet transactions, debit/credit entries and status.
            </p>
          </div>
        </div>

        {/* ✅ Franchise Filter */}
        <div className="franchise-filter-wrap">
          <label>
            Select Franchise <span>*</span>
          </label>

          <select
            className="franchise-select"
            name="franchiseId"
            value={formData.franchiseId}
            onChange={handleFranchiseChange}
          >
            <option value="">All Franchises</option>

            {frenchises.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="wallet-summary">
          <div className="summary-card">
            <div className="summary-icon green">₹</div>
            <div>
              <span>Total Credit (CR)</span>
              <strong>{formatCurrency(totalCredit)}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon orange">↓</div>
            <div>
              <span>Total Debit (DR)</span>
              <strong>{formatCurrency(totalDebit)}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon purple">✓</div>
            <div>
              <span>Confirmed</span>
              <strong>{confirmedCount}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon blue">#</div>
            <div>
              <span>Total Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="wallet-table-card">

          {/* Card Header */}
          <div className="wallet-table-header">
            <div>
              <h2>All Transactions</h2>
              <p>{filteredWallets.length} transactions found</p>
            </div>

            <div className="table-tools">
              <div className="wallet-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Search transaction..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="status-filter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
              </select>

              {/* ✅ Page Size */}
              <div className="page-size-wrap">
                <span>Show</span>
                <select
                  className="page-size-select"
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
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="wallet-table">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Type</th>
                  <th>Remark</th>
                  <th>DR</th>
                  <th>CR</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      <div>
                        <span>⏳</span>
                        <strong>Loading...</strong>
                        <p>Please wait while we load transactions.</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedWallets.length > 0 ? (
                  paginatedWallets.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="wallet-id">
                          <div>
                            <strong>{item.id}</strong>
                            <span>{item.transactionNumber || ""}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="type-badge">
                          {item.transactionType || "—"}
                        </span>
                      </td>

                      <td>
                        <div className="contact-info">
                          <span>{item.remark || "-"}</span>
                        </div>
                      </td>

                      <td>
                        {Number(item.dr) > 0 ? (
                          <span className="tx-amount debit">
                            - {formatCurrency(item.dr)}
                          </span>
                        ) : (
                          <span className="tx-amount">—</span>
                        )}
                      </td>

                      <td>
                        {Number(item.cr) > 0 ? (
                          <span className="tx-amount credit">
                            + {formatCurrency(item.cr)}
                          </span>
                        ) : (
                          <span className="tx-amount">—</span>
                        )}
                      </td>

                      <td>{renderBalance(item.balance)}</td>

                      <td>
                        <span
                          className={`status-badge ${(item.status || "").toLowerCase()}`}
                        >
                          <i></i>
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <span className="created-date">
                          {formatDate(item.entryDate)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      <div>
                        <span>⌕</span>
                        <strong>No transactions found</strong>
                        <p>Try changing your search or filter.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with Pagination */}
          <div className="table-footer">
            <span>
              Showing <strong>{startRecord}</strong> to{" "}
              <strong>{endRecord}</strong> of{" "}
              <strong>{totalRecords}</strong> transactions
            </span>

            {totalPages > 0 && (
              <div className="pagination-wrap">
                <div className="pagination-info">
                  Page <strong>{pageNo}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </div>

                <div className="pagination">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={pageNo === 1}
                    title="Previous"
                  >
                    ‹
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setPageNo(page)}
                      className={pageNo === page ? "active-page" : ""}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={pageNo === totalPages || totalPages === 0}
                    title="Next"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default WalletList;