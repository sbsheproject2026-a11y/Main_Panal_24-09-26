 import React, { useEffect, useState } from "react";
import { getPendingWalletBalance, getWalletRequestConfirm } from "../../AllServicesFiles/WalletService";
import { FILE_URL } from "../../api";

const PendingWalletRequest = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // 🔹 modal state (image/pdf preview)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null); // full URL
  const [modalType, setModalType] = useState("");   // "image" | "pdf" | "other"

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const result = await getPendingWalletBalance();
      setTransactions(result?.data || []);
    } catch (error) {
      console.log("Wallet load error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // single checkbox toggle
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // select all
  const handleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((r) => r.fundId));
    }
  };

  // ✅ Confirm
  const handleConfirm = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one request");
      return;
    }

    try {
      setLoading(true);

      const res = await getWalletRequestConfirm(selectedIds);
      console.log("Confirm response:", res);

      if (res?.success) {
        alert(res.message || "Confirmed successfully!");
        setSelectedIds([]);
        loadWallets();   // refresh list
      } else {
        alert(res?.message || "Confirmation failed!");
      }
    } catch (error) {
      console.log("Confirm error:", error);
      alert(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 file open in modal
  const handleFileClick = (fileName) => {
    if (!fileName) return;
    const fullUrl = `${FILE_URL}${fileName}`;
    const ext = fileName.split(".").pop().toLowerCase();

    setModalFile(fullUrl);
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) {
      setModalType("image");
    } else if (ext === "pdf") {
      setModalType("pdf");
    } else {
      setModalType("other");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalFile(null);
    setModalType("");
  };

  return (
    <>
      <div className="pwr-container">
        <div className="pwr-header">
          <h2>Pending Wallet Requests</h2>
        </div>

        <div className="pwr-header">
          <button
            className="btn approve"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : `Confirm Selected (${selectedIds.length})`}
          </button>
        </div>

        {/* =====================================================
            TABLE WRAPPER — only this area scrolls
        ===================================================== */}
        <div className="table-wrapper">
          <table className="pwr-table">
            <thead>
              <tr>
                <th className="pwr-checkbox-cell">
                  <input
                    type="checkbox"
                    checked={
                      transactions.length > 0 &&
                      selectedIds.length === transactions.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Slip</th>
                <th>Franchise Name</th>
                <th>Type</th>
                <th>Remark</th>
                <th>CR</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="pwr-empty">
                    <div className="pwr-spinner"></div>
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="pwr-empty">
                    <i className="bi bi-inbox"></i>
                    <div>No pending requests</div>
                  </td>
                </tr>
              ) : (
                transactions.map((r) => (
                  <tr key={r.fundId}>
                    <td className="pwr-checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.fundId)}
                        onChange={() => handleSelect(r.fundId)}
                      />
                    </td>
                    <td>
                      {r.slip ? (
                        <img
                          src={`${FILE_URL}${r.slip}`}
                          alt="slip"
                          className="slip-thumb"
                          onClick={() => handleFileClick(r.slip)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{r.branchname || "-"}</td>
                    <td>{r.transactionType || "-"}</td>
                    <td>{r.remark || "-"}</td>
                    <td className="cr">{r.cr || "-"}</td>
                    <td>{r.balance || "-"}</td>
                    <td>
                      <span className={`status ${r.status?.toLowerCase()}`}>
                        {r.status || "-"}
                      </span>
                    </td>
                    <td>{r.entryDate || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal for image / pdf preview */}
      {modalOpen && (
        <div className="pwr-modal-overlay" onClick={closeModal}>
          <div className="pwr-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="pwr-modal-close" onClick={closeModal}>
              ×
            </button>

            {modalType === "image" && (
              <img src={modalFile} alt="preview" className="pwr-modal-img" />
            )}

            {modalType === "pdf" && (
              <iframe
                src={modalFile}
                title="pdf-preview"
                className="pwr-modal-pdf"
              />
            )}

            {modalType === "other" && (
              <div style={{ padding: 20 }}>
                <a href={modalFile} target="_blank" rel="noreferrer">
                  Download file
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
        html,
        body,
        #root {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden !important;
        }

        .pwr-container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .pwr-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pwr-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .btn {
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn.approve {
          background: #16a34a;
          color: #fff;
        }

        .btn.approve:hover:not(:disabled) {
          background: #15803d;
        }

        .btn.approve:disabled {
          background: #86efac;
          cursor: not-allowed;
        }

        /* =====================================================
           TABLE WRAPPER — only this area scrolls
        ===================================================== */

        .table-wrapper {
          width: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #c9ced8 #eef1f5;
        }

        .table-wrapper::-webkit-scrollbar {
          height: 9px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: #eef1f5;
          border-radius: 10px;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: #c9ced8;
          border-radius: 10px;
        }

        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #aeb5c2;
        }

        /* =====================================================
           TABLE — AUTO WIDTH + AUTO HEIGHT
        ===================================================== */

        .pwr-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 14px;
          margin: 0;
        }

        .pwr-table th,
        .pwr-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          white-space: nowrap;
          vertical-align: middle;
        }

        .pwr-table th {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .3px;
        }

        .pwr-table td {
          color: #334155;
          font-size: 13px;
        }

        .pwr-table tbody tr {
          transition: background .15s ease;
        }

        .pwr-table tbody tr:hover {
          background: #f9fafb;
        }

        .pwr-table tbody tr:last-child td {
          border-bottom: none;
        }

        .pwr-checkbox-cell {
          text-align: center;
          width: 40px;
        }

        .pwr-checkbox-cell input {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .slip-thumb {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          transition: transform .15s ease;
        }

        .slip-thumb:hover {
          transform: scale(1.05);
        }

        .cr {
          color: #16a34a;
          font-weight: 600;
        }

        .status {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        /* =====================================================
           EMPTY / LOADING
        ===================================================== */

        .pwr-empty {
          text-align: center !important;
          padding: 50px 20px !important;
          color: #94a3b8;
        }

        .pwr-empty i {
          display: block;
          font-size: 40px;
          color: #cbd5e1;
          margin-bottom: 10px;
        }

        .pwr-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #e2e8f0;
          border-top-color: #4154f1;
          border-radius: 50%;
          margin: 0 auto 12px;
          animation: pwrSpin .7s linear infinite;
        }

        @keyframes pwrSpin {
          to { transform: rotate(360deg); }
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .pwr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .pwr-modal-box {
          position: relative;
          background: #fff;
          border-radius: 8px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          padding: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .pwr-modal-img {
          max-width: 85vw;
          max-height: 85vh;
          display: block;
          border-radius: 6px;
        }

        .pwr-modal-pdf {
          width: 80vw;
          height: 85vh;
          border: none;
          border-radius: 6px;
        }

        .pwr-modal-close {
          position: absolute;
          top: 6px;
          right: 10px;
          background: #dc2626;
          color: #fff;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          z-index: 10;
        }

        .pwr-modal-close:hover {
          background: #b91c1c;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 768px) {
          .pwr-container {
            padding: 12px;
          }

          .pwr-header h2 {
            font-size: 17px;
          }

          .pwr-table th,
          .pwr-table td {
            padding: 10px 12px;
            font-size: 12px;
          }
        }
        `}
      </style>
    </>
  );
};

export default PendingWalletRequest;