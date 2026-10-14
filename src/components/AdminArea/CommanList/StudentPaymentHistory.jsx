 import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentFeeDetails } from "../../AllServicesFiles/PaymentService";

/* ==========================================================
   Field Normalizer
   ========================================================== */
const normalizeRow = (row) => ({
  oId:           row.oId ?? row.OId ?? row.id ?? row.Id,
  orderId:       row.orderId ?? row.OrderId,
  referenceId:   row.referenceId ?? row.ReferenceId,
  feeName:       row.feeName ?? row.FeeName ?? row.ProductName,
  name:          (row.name ?? row.Name ?? "").trim(),
  mobileNo:      row.mobileNo ?? row.MobileNo,
  emailId:       row.emailId ?? row.EmailId,
  address:       row.address ?? row.Address,
  amount:        Number(row.amount ?? row.Amount ?? 0),
  paidAmount:    Number(row.paidAmount ?? row.PaidAmount ?? 0),
  pendingAmount: Number(
    row.pendingAmount ??
      row.PendingAmount ??
      Number(row.amount ?? row.Amount ?? 0) -
        Number(row.paidAmount ?? row.PaidAmount ?? 0)
  ),
  amountW:       row.amountW ?? row.AmountW ?? "",
  payStatus:     row.payStatus ?? row.PayStatus ?? "",
  oDate:         row.oDate ?? row.ODate,
  printPayDate:  row.printPayDate ?? row.PrintPayDate,
  getwayPrm:     row.getwayPrm ?? row.GetwayPrm ?? "",
});

/* ==========================================================
   Main Component
   ========================================================== */
export default function StudentPaymentHistory() {
  const { id: studentId } = useParams();
  const navigate          = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const [search, setSearch]     = useState("");
  const [pageNo, setPageNo]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 🆕 Print Modal
  const [printItem, setPrintItem] = useState(null);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    if (!studentId) {
      setError("Student ID नहीं मिली।");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getStudentFeeDetails(studentId);

        let raw = [];
        if (Array.isArray(result)) raw = result;
        else if (Array.isArray(result?.data)) raw = result.data;
        else if (Array.isArray(result?.result)) raw = result.result;
        else if (result && typeof result === "object") raw = [result];

        setPayments(raw.map(normalizeRow));
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Payment history load नहीं हो पाई।"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  /* ---------- SEARCH ---------- */
  const filteredPayments = useMemo(() => {
    if (!search.trim()) return payments;
    const s = search.toLowerCase().trim();

    return payments.filter(
      (p) =>
        p.orderId?.toLowerCase().includes(s) ||
        p.referenceId?.toLowerCase().includes(s) ||
        p.feeName?.toLowerCase().includes(s) ||
        p.payStatus?.toLowerCase().includes(s) ||
        p.getwayPrm?.toLowerCase().includes(s)
    );
  }, [payments, search]);

  /* ---------- PAGINATION ---------- */
  const totalRecords = filteredPayments.length;
  const totalPages   = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex   = (pageNo - 1) * pageSize;
  const endIndex     = startIndex + pageSize;
  const paginated    = filteredPayments.slice(startIndex, endIndex);

  const startRecord  = totalRecords === 0 ? 0 : startIndex + 1;
  const endRecord    = Math.min(endIndex, totalRecords);

  useEffect(() => {
    setPageNo(1);
  }, [search, pageSize]);

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

  /* ---------- TOTALS ---------- */
  const totalAmount =
    payments.length > 0 ? payments[payments.length - 1].amount : 0;
  const totalPaid    = payments.reduce((s, p) => s + p.paidAmount, 0);
  const totalPending = totalAmount - totalPaid;

  /* ---------- HELPERS ---------- */
  const formatAmount = (amt) => {
    const num = Number(amt || 0);
    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    return isNaN(dt)
      ? d
      : dt.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const statusClass = (status) => {
    const v = (status || "").toLowerCase();
    return v.includes("success") || v.includes("paid") ? "success" : "pending";
  };

  const student = payments[0] || {};

  /* ==========================================================
     PRINT RECEIPT — Modal से print
     ========================================================== */
  const handlePrintReceipt = (item) => {
    if (!item) return;

    const old = document.getElementById("receipt-print-root");
    if (old) old.remove();

    const printRoot = document.createElement("div");
    printRoot.id = "receipt-print-root";

    printRoot.innerHTML = `
      <div class="receipt-paper">
        <div class="rcpt-header">
          <div class="rcpt-header-left">
            <div class="rcpt-header-icon">💰</div>
            <div class="rcpt-header-text">
              <h1>Payment Receipt</h1>
              <p>Transaction Information</p>
            </div>
          </div>
        </div>

        <div class="rcpt-body">
          <div class="rcpt-hero">
            <div class="rcpt-hero-left">
              <span class="rcpt-hero-label">Total Amount</span>
              <strong class="rcpt-hero-amount">${formatAmount(item.amount)}</strong>
            </div>
            <span class="rcpt-status ${statusClass(item.payStatus)}">
              ${item.payStatus || "Pending"}
            </span>
          </div>

          <div class="rcpt-section">
            <div class="rcpt-section-title">
              <span class="rcpt-dot"></span>
              <span>Student Information</span>
            </div>
            <div class="rcpt-grid">
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Name</span>
                <span class="rcpt-cell-value">${item.name || "N/A"}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Email</span>
                <span class="rcpt-cell-value mono">${item.emailId || "N/A"}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Mobile</span>
                <span class="rcpt-cell-value mono">${item.mobileNo || "N/A"}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Address</span>
                <span class="rcpt-cell-value">${item.address || "N/A"}</span>
              </div>
            </div>
          </div>

          <div class="rcpt-section">
            <div class="rcpt-section-title">
              <span class="rcpt-dot"></span>
              <span>Payment Breakdown</span>
            </div>
            <div class="rcpt-amount-rows">
              <div class="rcpt-amount-row">
                <span>Total Amount</span>
                <strong>${formatAmount(item.amount)}</strong>
              </div>
              <div class="rcpt-amount-row">
                <span>Paid Amount</span>
                <strong class="paid">${formatAmount(item.paidAmount)}</strong>
              </div>
              <div class="rcpt-amount-row pending-row">
                <span>Pending Amount</span>
                <strong class="pending">${formatAmount(item.pendingAmount)}</strong>
              </div>
              ${
                item.amountW
                  ? `<div class="rcpt-words">${item.amountW}</div>`
                  : ""
              }
            </div>
          </div>

          <div class="rcpt-section">
            <div class="rcpt-section-title">
              <span class="rcpt-dot"></span>
              <span>Transaction Info</span>
            </div>
            <div class="rcpt-grid">
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Order ID</span>
                <span class="rcpt-cell-value mono">${item.orderId || "N/A"}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Reference ID</span>
                <span class="rcpt-cell-value mono">${item.referenceId || "-"}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Course / Fee</span>
                <span class="rcpt-cell-value">${item.feeName || "N/A"}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Gateway</span>
                <span class="rcpt-cell-value">${item.getwayPrm || "N/A"}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Order Date</span>
                <span class="rcpt-cell-value">${fmtDate(item.oDate)}</span>
              </div>
              <div class="rcpt-cell">
                <span class="rcpt-cell-label">Pay Date</span>
                <span class="rcpt-cell-value">${
                  item.printPayDate && item.printPayDate !== "01 Jan 1900"
                    ? fmtDate(item.printPayDate)
                    : "-"
                }</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rcpt-footer">
          <div class="rcpt-signs">
            <div class="rcpt-sign">Student / Parent Signature</div>
            <div class="rcpt-sign">Authorized Signatory</div>
          </div>
          <div class="rcpt-note">
            Computer-generated receipt • No signature required
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(printRoot);

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        const el = document.getElementById("receipt-print-root");
        if (el) el.remove();
      }, 500);
    }, 100);
  };

  return (
    <>
      <style>{`
        html, body, #root {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden !important;
        }

        * { box-sizing: border-box; }

        .rollno-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .rollno-page .section,
        .rollno-page .card,
        .rollno-page .card-body,
        .rollno-page .card-header {
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }

        .rollno-card {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          border-radius: 18px !important;
        }

        .rollno-toolbar {
          min-width: 0;
          max-width: 100%;
        }

        /* ============================================
           TABLE WRAPPER — only this area scrolls
           ============================================ */
        .rollno-table-wrapper {
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
          border-radius: 14px;
          border: 1px solid #edf0f5;
        }

        .rollno-table-wrapper::-webkit-scrollbar { height: 10px; }
        .rollno-table-wrapper::-webkit-scrollbar-track {
          background: #eef1f5;
          border-radius: 10px;
        }
        .rollno-table-wrapper::-webkit-scrollbar-thumb {
          background: #b8bfcc;
          border-radius: 10px;
          border: 2px solid #eef1f5;
        }
        .rollno-table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #8f98a8;
        }
        .rollno-table-wrapper {
          scrollbar-width: thin;
          scrollbar-color: #b8bfcc #eef1f5;
        }

        /* TABLE */
        .rollno-table {
          width: auto !important;
          min-width: 100% !important;
          max-width: none !important;
          table-layout: auto !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 0 !important;
        }

        .rollno-table th,
        .rollno-table td {
          box-sizing: border-box;
          white-space: nowrap !important;
        }

        .rollno-table thead th {
          background: #f8f9fc !important;
          color: #687185;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .3px;
          text-transform: uppercase;
          padding: 15px 16px !important;
          border-bottom: 1px solid #e9edf3 !important;
          vertical-align: middle;
          position: sticky;
          top: 0;
          z-index: 2;
          box-shadow: 0 1px 0 #e9edf3;
        }

        .rollno-table tbody td {
          padding: 14px 16px !important;
          color: #414a5d;
          font-size: 13px;
          vertical-align: middle !important;
          border-bottom: 1px solid #f0f2f6 !important;
          background: #fff;
        }

        .rollno-table tbody tr:hover td {
          background: #fafbff;
        }

        .rollno-table tbody tr:last-child td {
          border-bottom: 0 !important;
        }

        .rollno-table tfoot td {
          background: #f8f9fc !important;
          padding: 14px 16px !important;
          font-weight: 800;
          color: #1e293b;
          font-size: 13px;
          border-top: 2px solid #cbd5e1;
          border-bottom: 1px solid #e9edf3;
          white-space: nowrap;
        }

        /* CELLS */
        .rollno-mono {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #475569;
          white-space: nowrap;
        }

        .rollno-text {
          color: #414a5d;
          white-space: nowrap;
        }

        .rollno-amount {
          font-weight: 800;
          color: #1e293b;
          white-space: nowrap;
        }
        .rollno-amount-paid {
          font-weight: 700;
          color: #059669;
          white-space: nowrap;
        }
        .rollno-amount-pending {
          font-weight: 800;
          color: #ea580c;
          white-space: nowrap;
        }

        .rollno-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }
        .rollno-badge.success { background: #d1fae5; color: #065f46; }
        .rollno-badge.pending { background: #fef3c7; color: #92400e; }
        .rollno-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.7;
        }

        .rollno-index {
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

        /* ACTION BUTTON */
        .rollno-print-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #4154f1, #6f7bf7);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 3px 8px rgba(65, 84, 241, 0.25);
        }
        .rollno-print-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(65, 84, 241, 0.35);
        }
        .rollno-print-btn i { font-size: 13px; }

        /* Student bar */
        .sph-student-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #f8f9ff, #ffffff);
          border-radius: 14px;
          border: 1px solid #edf0f5;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .sph-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4154f1, #6f7bf7);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(65, 84, 241, 0.25);
        }

        .sph-student-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .sph-student-meta strong {
          font-size: 15px;
          color: #1e293b;
          font-weight: 700;
        }

        .sph-student-meta small {
          font-size: 12px;
          color: #64748b;
        }

        /* Summary cards */
        .sph-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .sph-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #edf0f5;
          border-left: 4px solid #64748b;
          transition: all 0.2s ease;
          min-width: 0;
        }

        .sph-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        .sph-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .sph-card-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sph-card-value {
          font-size: 17px;
          font-weight: 800;
          margin-top: 2px;
          letter-spacing: -0.3px;
        }

        .sph-card-blue  { border-left-color: #4154f1; }
        .sph-card-blue  .sph-card-icon { background: #eef2ff; }
        .sph-card-blue  .sph-card-value { color: #4154f1; }

        .sph-card-green { border-left-color: #10b981; }
        .sph-card-green .sph-card-icon { background: #d1fae5; }
        .sph-card-green .sph-card-value { color: #065f46; }

        .sph-card-red   { border-left-color: #ef4444; }
        .sph-card-red   .sph-card-icon { background: #fee2e2; }
        .sph-card-red   .sph-card-value { color: #991b1b; }

        .sph-card-gray  { border-left-color: #64748b; }
        .sph-card-gray  .sph-card-icon { background: #f1f5f9; }
        .sph-card-gray  .sph-card-value { color: #334155; }

        /* ============================================
           MODAL (Print Preview)
           ============================================ */
        .pay-modal-overlay {
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

        .pay-modal {
          background: #fff;
          border-radius: 20px;
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

        .pay-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px 22px;
          background: linear-gradient(135deg, #4154f1 0%, #6f7bf7 100%);
          color: #fff;
          flex-shrink: 0;
        }

        .pay-modal-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .pay-modal-header-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #fff;
          flex-shrink: 0;
        }

        .pay-modal-header h2 {
          margin: 0 0 2px;
          font-size: 16px;
          font-weight: 700;
        }

        .pay-modal-header span {
          font-size: 12px;
          opacity: 0.85;
        }

        .pay-modal-close {
          width: 34px;
          height: 34px;
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
        .pay-modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .pay-modal-body {
          padding: 20px 22px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pay-modal-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 20px 20px;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border: 1px solid #c7d2fe;
          border-radius: 14px;
        }

        .pay-modal-hero-label {
          font-size: 11px;
          font-weight: 700;
          color: #4154f1;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .pay-modal-hero-amount {
          font-size: 26px;
          font-weight: 800;
          color: #3730a3;
          letter-spacing: -0.5px;
          line-height: 1.1;
          margin-top: 2px;
        }

        .pay-modal-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .pay-modal-status.success { background: #d1fae5; color: #065f46; }
        .pay-modal-status.pending { background: #fef3c7; color: #92400e; }

        .pay-modal-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 700;
          color: #4154f1;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 10px;
        }

        .pay-modal-section-title i {
          font-size: 14px;
        }

        .pay-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .pay-modal-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 10px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .pay-modal-cell-label {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .pay-modal-cell-value {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          word-break: break-word;
        }

        .pay-modal-cell-value.mono {
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }

        .pay-modal-amounts {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pay-modal-amount-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          color: #475569;
        }

        .pay-modal-amount-row strong {
          font-size: 14px;
          font-weight: 800;
          color: #1e293b;
        }

        .pay-modal-amount-row strong.paid { color: #059669; }

        .pay-modal-amount-row.pending-row {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border-color: #fed7aa;
        }
        .pay-modal-amount-row.pending-row strong { color: #ea580c; }

        .pay-modal-words {
          padding: 10px 14px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 10px;
          font-size: 11.5px;
          color: #0c4a6e;
          font-style: italic;
          text-align: center;
        }

        .pay-modal-footer {
          padding: 14px 22px 18px;
          border-top: 1px solid #f1f5f9;
          background: #fafbfc;
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .pay-modal-btn {
          flex: 1;
          padding: 11px 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .pay-modal-btn.cancel {
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #475569;
        }
        .pay-modal-btn.cancel:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .pay-modal-btn.print {
          flex: 1.4;
          border: none;
          background: linear-gradient(135deg, #4154f1, #6f7bf7);
          color: #fff;
          box-shadow: 0 4px 14px rgba(65, 84, 241, 0.3);
        }
        .pay-modal-btn.print:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(65, 84, 241, 0.4);
        }

        @media (max-width: 640px) {
          .pay-modal-overlay { padding: 12px; }
          .pay-modal { border-radius: 18px; max-height: 94vh; }
          .pay-modal-header { padding: 14px 16px; }
          .pay-modal-body { padding: 16px; }
          .pay-modal-grid { grid-template-columns: 1fr; }
          .pay-modal-footer { flex-direction: column; }
        }

        /* ============================================
           PRINT — receipt only
           ============================================ */
        #receipt-print-root { display: none; }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            width: 100% !important;
            height: auto !important;
          }

          body * {
            visibility: hidden !important;
            box-shadow: none !important;
          }

          #receipt-print-root,
          #receipt-print-root * {
            visibility: visible !important;
          }

          #receipt-print-root {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
          }

          .rollno-page,
          .pay-modal-overlay {
            display: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
        }

        /* ============================================
           RECEIPT PRINT STYLES
           ============================================ */
        .receipt-paper {
          font-family: 'Segoe UI', Tahoma, sans-serif;
          color: #1e293b;
          max-width: 100%;
          margin: 0 auto;
          background: #fff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .rcpt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: linear-gradient(135deg, #4154f1 0%, #6f7bf7 100%) !important;
          color: #fff;
          border-radius: 12px 12px 0 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .rcpt-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rcpt-header-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .rcpt-header-text h1 {
          margin: 0 0 1px;
          font-size: 16px;
          font-weight: 800;
          color: #fff;
        }
        .rcpt-header-text p {
          margin: 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.9);
        }

        .rcpt-body { padding: 14px 18px; background: #fff; }

        .rcpt-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%) !important;
          border: 1px solid #c7d2fe;
          border-radius: 12px;
          margin-bottom: 14px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .rcpt-hero-label {
          font-size: 10px;
          font-weight: 700;
          color: #4154f1;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .rcpt-hero-amount {
          font-size: 22px;
          font-weight: 800;
          color: #3730a3;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .rcpt-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .rcpt-status.success {
          background: #d1fae5 !important;
          color: #065f46;
        }
        .rcpt-status.pending {
          background: #fef3c7 !important;
          color: #92400e;
        }

        .rcpt-section {
          margin-bottom: 12px;
          page-break-inside: avoid;
        }

        .rcpt-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          font-weight: 700;
          color: #4154f1;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 8px;
        }

        .rcpt-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4154f1;
        }

        .rcpt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
        }

        .rcpt-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 7px 12px;
          background: #f8fafc !important;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .rcpt-cell-label {
          font-size: 9px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rcpt-cell-value {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          word-break: break-word;
          line-height: 1.3;
        }
        .rcpt-cell-value.mono {
          font-family: 'Courier New', monospace;
          font-size: 11px;
        }

        .rcpt-amount-rows {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .rcpt-amount-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          background: #f8fafc !important;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          color: #475569;
        }
        .rcpt-amount-row strong {
          font-size: 13px;
          font-weight: 800;
          color: #1e293b;
        }
        .rcpt-amount-row strong.paid { color: #059669; }

        .rcpt-amount-row.pending-row {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
          border-color: #fed7aa;
        }
        .rcpt-amount-row strong.pending { color: #ea580c; }

        .rcpt-words {
          padding: 8px 14px;
          background: #f0f9ff !important;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          font-size: 11px;
          color: #0c4a6e;
          font-style: italic;
          text-align: center;
        }

        .rcpt-footer { padding: 0 18px 14px; }

        .rcpt-signs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          padding: 18px 0 10px;
        }

        .rcpt-sign {
          border-top: 1px solid #94a3b8;
          padding-top: 5px;
          font-size: 10px;
          color: #64748b;
          text-align: center;
          font-weight: 600;
        }

        .rcpt-note {
          text-align: center;
          padding-top: 8px;
          border-top: 1px dashed #e2e8f0;
          font-size: 9.5px;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .rollno-table-wrapper {
            width: 0 !important;
            min-width: 100% !important;
            max-width: 100% !important;
            overflow-x: auto !important;
          }
          .rollno-table {
            width: auto !important;
            min-width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>

      <div className="rollno-page">
        {/* PAGE TITLE */}
        <div className="pagetitle mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-1">Payment History</h1>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-decoration-none">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">Payments</li>
                  <li className="breadcrumb-item active">Payment History</li>
                </ol>
              </nav>
            </div>

            <div
              className="px-4 py-3 rounded-4 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #4154f1, #6f7bf7)",
                color: "#fff",
                minWidth: "190px",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    background: "rgba(255,255,255,.18)",
                  }}
                >
                  <i className="bi bi-receipt fs-5"></i>
                </div>
                <div>
                  <small className="opacity-75">Total Payments</small>
                  <h4 className="mb-0 fw-bold">{totalRecords}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="section">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden rollno-card">
            <div
              className="card-header border-0 py-4 px-4"
              style={{
                background: "linear-gradient(135deg, #f8f9ff, #ffffff)",
              }}
            />

            {/* TOOLBAR */}
            <div className="px-4 pt-4 rollno-toolbar">
              <div className="row g-3 align-items-center">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <span className="text-muted me-2">Show</span>
                    <select
                      className="form-select shadow-none"
                      style={{ width: "85px", borderRadius: "10px" }}
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-muted ms-2">entries</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="position-relative ms-md-auto"
                    style={{ maxWidth: "320px" }}
                  >
                    <i
                      className="bi bi-search position-absolute"
                      style={{
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#899bbd",
                      }}
                    />
                    <input
                      type="text"
                      className="form-control ps-5 shadow-none"
                      placeholder="Search order, reference, fee..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        height: "44px",
                        borderRadius: "12px",
                        border: "1px solid #e1e5eb",
                        paddingRight: search ? "42px" : "15px",
                      }}
                    />
                    {search && (
                      <button
                        type="button"
                        className="btn position-absolute p-0"
                        style={{
                          right: "13px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        onClick={() => setSearch("")}
                      >
                        <i className="bi bi-x-circle-fill text-muted"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* INFO LINE */}
            <div className="px-4 pt-4">
              <div
                className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-3 py-2 rounded-3"
                style={{ background: "#f8f9fc" }}
              >
                <span className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Showing <strong className="text-dark">{startRecord}</strong> to{" "}
                  <strong className="text-dark">{endRecord}</strong> of{" "}
                  <strong className="text-dark">{totalRecords}</strong> payments
                </span>
                {search && (
                  <span className="text-primary small fw-semibold">
                    Search: "{search}"
                  </span>
                )}
              </div>
            </div>

            <div className="card-body px-4 pt-3">
              {/* STUDENT BAR */}
              {payments.length > 0 && (
                <div className="sph-student-bar">
                  <div className="sph-avatar">
                    {(student.name || "S").charAt(0).toUpperCase()}
                  </div>
                  <div className="sph-student-meta">
                    <strong>{student.name || "Student"}</strong>
                    <small>
                      {student.mobileNo && `📱 ${student.mobileNo}`}
                      {student.emailId && ` • ✉️ ${student.emailId}`}
                      {studentId && ` • ID: ${studentId}`}
                    </small>
                  </div>
                </div>
              )}

              {/* SUMMARY CARDS */}
              {payments.length > 0 && (
                <div className="sph-cards">
                  <div className="sph-card sph-card-blue">
                    <div className="sph-card-icon">💵</div>
                    <div>
                      <p className="sph-card-label">Total Fee</p>
                      <p className="sph-card-value">{formatAmount(totalAmount)}</p>
                    </div>
                  </div>
                  <div className="sph-card sph-card-green">
                    <div className="sph-card-icon">✅</div>
                    <div>
                      <p className="sph-card-label">Total Paid</p>
                      <p className="sph-card-value">{formatAmount(totalPaid)}</p>
                    </div>
                  </div>
                  <div className="sph-card sph-card-red">
                    <div className="sph-card-icon">⏳</div>
                    <div>
                      <p className="sph-card-label">Pending</p>
                      <p className="sph-card-value">{formatAmount(totalPending)}</p>
                    </div>
                  </div>
                  <div className="sph-card sph-card-gray">
                    <div className="sph-card-icon">📋</div>
                    <div>
                      <p className="sph-card-label">Total Orders</p>
                      <p className="sph-card-value">{payments.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TABLE */}
              <div className="rollno-table-wrapper">
                <table className="table align-middle mb-0 rollno-table">
                  <thead>
                    <tr>
                      <th> # </th>
                      <th> ORDER ID </th>
                      <th> COURSE / FEE </th>
                      <th> ORDER DATE </th>
                      <th> PAID DATE </th>
                      <th> STATUS </th>
                      <th> GATEWAY </th>
                      <th style={{ textAlign: "right" }}> AMOUNT </th>
                      <th style={{ textAlign: "right" }}> PAID </th>
                      <th style={{ textAlign: "right" }}> PENDING </th>
                      <th> REFERENCE ID </th>
                      <th style={{ textAlign: "center" }}> ACTION </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="12" className="text-center py-5">
                          <div className="spinner-border text-primary mb-3"></div>
                          <div className="text-muted">
                            Loading payment history...
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="12" className="text-center py-5">
                          <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                              width: "70px",
                              height: "70px",
                              background: "#fee2e2",
                            }}
                          >
                            <i
                              className="bi bi-exclamation-triangle text-danger"
                              style={{ fontSize: "28px" }}
                            ></i>
                          </div>
                          <h5 className="fw-semibold text-danger">
                            Something went wrong
                          </h5>
                          <p className="text-muted mb-0">{error}</p>
                        </td>
                      </tr>
                    ) : paginated.length > 0 ? (
                      paginated.map((p, index) => (
                        <tr key={p.oId || index}>
                          <td>
                            <span className="rollno-index">
                              {startIndex + index + 1}
                            </span>
                          </td>
                          <td>
                            <span className="rollno-mono">
                              {p.orderId || "N/A"}
                            </span>
                          </td>
                          <td>
                            <span className="rollno-text">
                              {p.feeName || "N/A"}
                            </span>
                          </td>
                          <td>{fmtDate(p.oDate)}</td>
                          <td>
                            {p.printPayDate && p.printPayDate !== "01 Jan 1900"
                              ? fmtDate(p.printPayDate)
                              : "-"}
                          </td>
                          <td>
                            <span className={`rollno-badge ${statusClass(p.payStatus)}`}>
                              <span className="rollno-badge-dot"></span>
                              {p.payStatus || "Pending"}
                            </span>
                          </td>
                          <td>
                            <span className="rollno-text">
                              {p.getwayPrm || "—"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span className="rollno-amount">
                              {formatAmount(p.amount)}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span className="rollno-amount-paid">
                              {formatAmount(p.paidAmount)}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span className="rollno-amount-pending">
                              {formatAmount(p.pendingAmount)}
                            </span>
                          </td>
                          <td>
                            <span className="rollno-mono">
                              {p.referenceId || "N/A"}
                            </span>
                          </td>
                          {/* 🆕 PRINT BUTTON */}
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              className="rollno-print-btn"
                              onClick={() => setPrintItem(p)}
                              title="View & Print"
                            >
                              <i className="bi bi-printer-fill"></i>
                              Print
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center py-5">
                          <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                              width: "70px",
                              height: "70px",
                              background: "#f1f3f9",
                            }}
                          >
                            <i
                              className="bi bi-inbox text-muted"
                              style={{ fontSize: "30px" }}
                            ></i>
                          </div>
                          <h5 className="fw-semibold">
                            {search ? "No Results Found" : "No Payment Records"}
                          </h5>
                          <p className="text-muted mb-0">
                            {search
                              ? `No match for "${search}"`
                              : "इस student का कोई payment record नहीं मिला।"}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>

                  {/* FOOTER */}
                  {!loading && !error && paginated.length > 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan="7" style={{ textAlign: "right" }}>
                          TOTAL
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {formatAmount(totalAmount)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {formatAmount(totalPaid)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {formatAmount(totalPending)}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* PAGINATION */}
              {!loading && totalPages > 0 && totalRecords > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3 rollno-pagination">
                  <div className="text-muted small">
                    Page <strong className="text-dark">{pageNo}</strong> of{" "}
                    <strong className="text-dark">{totalPages}</strong>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <button
                      type="button"
                      className="btn btn-light border"
                      onClick={() => setPageNo(1)}
                      disabled={pageNo === 1}
                      style={{ borderRadius: "10px" }}
                    >
                      <i className="bi bi-chevron-double-left"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light border"
                      onClick={() => setPageNo(pageNo - 1)}
                      disabled={pageNo === 1}
                      style={{ borderRadius: "10px" }}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setPageNo(page)}
                        className={
                          pageNo === page
                            ? "btn btn-primary"
                            : "btn btn-light border"
                        }
                        style={{ minWidth: "40px", borderRadius: "10px" }}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="btn btn-light border"
                      onClick={() => setPageNo(pageNo + 1)}
                      disabled={pageNo === totalPages}
                      style={{ borderRadius: "10px" }}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light border"
                      onClick={() => setPageNo(totalPages)}
                      disabled={pageNo === totalPages}
                      style={{ borderRadius: "10px" }}
                    >
                      <i className="bi bi-chevron-double-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom actions */}
              <div className="d-flex justify-content-end align-items-center gap-3 mt-4 pt-4 flex-wrap no-print">
                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => navigate(-1)}
                  style={{ borderRadius: "10px", padding: "9px 20px" }}
                >
                  <i className="bi bi-arrow-left me-1"></i> Back
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==========================================================
          PRINT MODAL — click Print button पर खुलेगा
          ========================================================== */}
      {printItem && (
        <div
          className="pay-modal-overlay"
          onClick={() => setPrintItem(null)}
        >
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="pay-modal-header">
              <div className="pay-modal-header-left">
                <div className="pay-modal-header-icon">
                  <i className="bi bi-receipt"></i>
                </div>
                <div>
                  <h2>Payment Receipt</h2>
                  <span>Preview & Print</span>
                </div>
              </div>
              <button
                className="pay-modal-close"
                onClick={() => setPrintItem(null)}
                title="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* BODY */}
            <div className="pay-modal-body">
              <div className="pay-modal-hero">
                <div>
                  <div className="pay-modal-hero-label">Total Amount</div>
                  <div className="pay-modal-hero-amount">
                    {formatAmount(printItem.amount)}
                  </div>
                </div>
                <span
                  className={`pay-modal-status ${statusClass(printItem.payStatus)}`}
                >
                  <i
                    className={`bi ${
                      statusClass(printItem.payStatus) === "success"
                        ? "bi-check-circle-fill"
                        : "bi-clock-fill"
                    }`}
                  ></i>
                  {printItem.payStatus || "Pending"}
                </span>
              </div>

              {/* Student Info */}
              <div>
                <div className="pay-modal-section-title">
                  <i className="bi bi-person-fill"></i>
                  <span>Student Information</span>
                </div>
                <div className="pay-modal-grid">
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Name</span>
                    <span className="pay-modal-cell-value">
                      {printItem.name || "N/A"}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Mobile</span>
                    <span className="pay-modal-cell-value mono">
                      {printItem.mobileNo || "N/A"}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Email</span>
                    <span className="pay-modal-cell-value mono">
                      {printItem.emailId || "N/A"}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Address</span>
                    <span className="pay-modal-cell-value">
                      {printItem.address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div>
                <div className="pay-modal-section-title">
                  <i className="bi bi-cash-stack"></i>
                  <span>Payment Breakdown</span>
                </div>
                <div className="pay-modal-amounts">
                  <div className="pay-modal-amount-row">
                    <span>Total Amount</span>
                    <strong>{formatAmount(printItem.amount)}</strong>
                  </div>
                  <div className="pay-modal-amount-row">
                    <span>Paid Amount</span>
                    <strong className="paid">
                      {formatAmount(printItem.paidAmount)}
                    </strong>
                  </div>
                  <div className="pay-modal-amount-row pending-row">
                    <span>Pending Amount</span>
                    <strong>
                      {formatAmount(printItem.pendingAmount)}
                    </strong>
                  </div>
                  {printItem.amountW && (
                    <div className="pay-modal-words">{printItem.amountW}</div>
                  )}
                </div>
              </div>

              {/* Transaction Info */}
              <div>
                <div className="pay-modal-section-title">
                  <i className="bi bi-receipt-cutoff"></i>
                  <span>Transaction Info</span>
                </div>
                <div className="pay-modal-grid">
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Order ID</span>
                    <span className="pay-modal-cell-value mono">
                      {printItem.orderId || "N/A"}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Reference ID</span>
                    <span className="pay-modal-cell-value mono">
                      {printItem.referenceId || "-"}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Course / Fee</span>
                    <span className="pay-modal-cell-value">
                      {printItem.feeName || "N/A"}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Gateway</span>
                    <span className="pay-modal-cell-value">
                      {printItem.getwayPrm || "N/A"}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Order Date</span>
                    <span className="pay-modal-cell-value">
                      {fmtDate(printItem.oDate)}
                    </span>
                  </div>
                  <div className="pay-modal-cell">
                    <span className="pay-modal-cell-label">Pay Date</span>
                    <span className="pay-modal-cell-value">
                      {printItem.printPayDate &&
                      printItem.printPayDate !== "01 Jan 1900"
                        ? fmtDate(printItem.printPayDate)
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="pay-modal-footer">
              <button
                className="pay-modal-btn cancel"
                onClick={() => setPrintItem(null)}
              >
                <i className="bi bi-x-lg"></i>
                Close
              </button>
              <button
                className="pay-modal-btn print"
                onClick={() => handlePrintReceipt(printItem)}
              >
                <i className="bi bi-printer-fill"></i>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}