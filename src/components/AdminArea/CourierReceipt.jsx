 import React from 'react';

const CourierReceipt = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .receipt-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5px 15px;
          background: #eef2f7;
          min-height: 100vh;
          font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        }

        .print-btn {
          background: #489419;
          color: #f0f0f7;
          border: none;
          padding: 14px 34px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          margin-bottom: 28px;
          box-shadow: 0 6px 18px rgba(30, 60, 114, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.5px;
        }

        .print-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(30, 60, 114, 0.45);
        }

        /* Main Label Box */
        .label-box {
          width: 100%;
          max-width: 820px;
          background: #fff;
          border: 3px solid #1e3c72;
          border-radius: 14px;
          padding: 0;
          position: relative;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }

        /* Top Header Bar */
        .label-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: #fff;
          padding: 14px 22px;
        }

        .label-header h2 {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Content Area */
        .label-content {
          padding: 22px 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Section Base */
        .section {
          border: 2px solid #1e3c72;
          border-radius: 10px;
          padding: 14px 16px;
          background: #fbfcfe;
          position: relative;
          transition: box-shadow 0.2s;
        }

        .section:hover {
          box-shadow: 0 4px 14px rgba(30, 60, 114, 0.12);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          padding-bottom: 8px;
          margin-bottom: 12px;
          border-bottom: 2px solid #e0e6ef;
        }

        /* TO Section - Top Left */
        .to-section {
          width: 62%;
          border-color: #1e3c72;
        }

        .to-section .section-title {
          color: #1e3c72;
          border-bottom-color: #c7d4e8;
        }

        .to-section .section-title .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #1e3c72;
        }

        /* FROM Section - Bottom Right */
        .from-section {
          width: 62%;
          align-self: flex-end;
          border-color: #218838;
        }

        .from-section .section-title {
          color: #218838;
          border-bottom-color: #c3e6cb;
        }

        .from-section .section-title .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #218838;
        }

        /* Field Rows */
        .field-row {
          display: flex;
          margin-bottom: 9px;
          font-size: 14px;
          line-height: 1.5;
        }

        .field-row:last-child {
          margin-bottom: 0;
        }

        .field-label {
          width: 95px;
          font-weight: 700;
          color: #333;
          flex-shrink: 0;
        }

        .field-value {
          flex: 1;
          color: #000;
          font-weight: 600;
          border-bottom: 1.5px dotted #9aa8bd;
          padding-bottom: 2px;
          min-height: 20px;
        }

        /* Diagonal Arrow (decorative) */
        .diagonal-arrow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          font-size: 28px;
          color: #c7d4e8;
          font-weight: bold;
          z-index: 0;
          pointer-events: none;
          user-select: none;
        }

        /* Footer Note */
        .footer-note {
          text-align: center;
          font-size: 11px;
          color: #6c757d;
          padding: 10px 22px 14px;
          background: #fff;
          letter-spacing: 0.3px;
        }

        /* ============================================
           PRINT SETTINGS - NO TOP SPACE
           ============================================ */
        @media print {
          /* Sab kuch hide karo pehle */
          body * {
            visibility: hidden;
          }

          /* Sirf label-box aur uske andar ki cheezein visible karo */
          .label-box,
          .label-box * {
            visibility: visible;
          }

          /* HTML aur Body - zero margin/padding */
          html, body {
            height: auto !important;
            min-height: 0 !important;
            overflow: hidden !important;
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Wrapper - zero padding, zero margin */
          .receipt-wrapper {
            display: block !important;
            min-height: 0 !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
          }

          /* Label box - top space zero */
          .label-box {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: 144mm !important;
            border: 2px solid #1e3c72 !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            margin: 0 !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            overflow: hidden !important;
          }

          /* Content - top padding kam */
          .label-content {
            padding: 6px 14px !important;
            gap: 6px !important;
          }

          .section {
            padding: 6px 10px !important;
          }

          .field-row {
            margin-bottom: 3px !important;
            font-size: 11px !important;
          }

          .label-header {
            padding: 5px 14px !important;
          }

          .label-header h2 {
            font-size: 15px !important;
          }

          .footer-note {
            padding: 3px 14px 5px !important;
            font-size: 9px !important;
          }

          /* Print button hide */
          .no-print {
            display: none !important;
          }

          /* Page setup - margin 0 */
          @page {
            size: 210mm 148mm;
            margin: 0;
          }

          /* Colors print mein sahi aayein */
          .label-header {
            background: #1e3c72 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .to-section,
          .from-section {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="receipt-wrapper">
        {/* Print Button */}
        <button className="print-btn no-print" onClick={handlePrint}>
          🖨️ Print Courier Label
        </button>

        {/* Main Label Box */}
        <div className="label-box">

          {/* Header */}
          <div className="label-header">
            <h2>📦 Courier Shipping Label</h2>
          </div>

          {/* Content */}
          <div className="label-content">

            {/* Diagonal Arrow Decoration */}
            <div className="diagonal-arrow">↘</div>

            {/* TOP LEFT: TO Section */}
            <div className="section to-section">
              <div className="section-title">
                <span className="dot"></span>
                TO (Receiver)
              </div>
              <div className="field-row">
                <span className="field-label"></span>
                <span className="field-value">Mr. Kanishk Pareek</span>
              </div>
              <div className="field-row">
                <span className="field-label"></span>
                <span className="field-value">Unr. Skill Academy Shikwara</span>
              </div>
              <div className="field-row">
                <span className="field-label">Address:</span>
                <span className="field-value">Alwar Circle, Dayanagar Sadi Ke Pass</span>
              </div>
              <div className="field-row">
                <span className="field-label">City/Pin:</span>
                <span className="field-value">Alwar - 301605</span>
              </div>
              <div className="field-row">
                <span className="field-label">Contact:</span>
                <span className="field-value">8890427888</span>
              </div>
            </div>

            {/* BOTTOM RIGHT: FROM Section */}
            <div className="section from-section">
              <div className="section-title">
                <span className="dot"></span>
                FROM (Sender)
              </div>
              <div className="field-row">
                <span className="field-label">Room:</span>
                <span className="field-value">Shaheed Bhagat Singh Health &amp; Education</span>
              </div>
              <div className="field-row">
                <span className="field-label">Contact:</span>
                <span className="field-value">7082013215</span>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="footer-note">
            This is a computer generated label. Please retain for your records.
          </div>

        </div>
      </div>
    </>
  );
};

export default CourierReceipt;