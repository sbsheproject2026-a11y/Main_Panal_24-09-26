 import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const receiptRef = useRef(null);

    // ✅ Payment response se data
    const payment = {
        orderId: location.state?.OId || "N/A",
        paymentId: location.state?.paymentId || "N/A",
        amount: location.state?.amount || 0,
        status: location.state?.status || "Success",
        message: location.state?.message || "Your payment has been processed successfully.",
        date: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        }),
        name: location.state?.name || "Student",
        email: location.state?.email || "",
    };

    const handleHome = () => {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("oId");
        navigate("/");
    };

    // ✅ RECEIPT DOWNLOAD — Frontend se PDF (No backend)
    const handleDownload = async () => {
        try {
            const element = receiptRef.current;
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pdfWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // ✅ Agar image page se badi ho toh multiple pages mein baanto
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20);

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                heightLeft -= (pdfHeight - 20);
            }

            pdf.save(`Receipt_${payment.orderId}.pdf`);
        } catch (err) {
            console.error("Receipt download error:", err);
            alert("Receipt download failed!");
        }
    };

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .success-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, sans-serif;
                }

                .success-card {
                    position: relative;
                    width: 480px;
                    max-width: 100%;
                    background: #fff;
                    border-radius: 24px;
                    box-shadow: 
                        0 20px 40px -12px rgba(0, 0, 0, 0.15),
                        0 0 0 1px rgba(0, 0, 0, 0.04);
                    overflow: hidden;
                    animation: cardEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes cardEntry {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .success-header {
                    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
                    padding: 28px 24px 26px;
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }

                .success-header::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer { 100% { left: 100%; } }

                .checkmark {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 14px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    animation: pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.2s both;
                }

                .checkmark::before {
                    content: '';
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.6);
                    opacity: 0;
                    animation: ripple 1.8s ease-out 0.5s infinite;
                }

                @keyframes ripple {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                @keyframes pop {
                    0% { transform: scale(0); opacity: 0; }
                    70% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }

                .checkmark svg {
                    width: 42px;
                    height: 42px;
                    stroke: #fff;
                    stroke-width: 4;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    fill: none;
                }

                .checkmark svg path {
                    stroke-dasharray: 50;
                    stroke-dashoffset: 50;
                    animation: drawCheck 0.6s ease-out 0.6s forwards;
                }

                @keyframes drawCheck {
                    to { stroke-dashoffset: 0; }
                }

                .success-header h2 {
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 4px;
                    letter-spacing: -0.3px;
                }

                .success-header p {
                    font-size: 13px;
                    opacity: 0.9;
                    line-height: 1.5;
                }

                .success-body {
                    padding: 24px;
                }

                .details-box {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 18px;
                    border: 1px solid #e2e8f0;
                }

                .details-title {
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    font-size: 13px;
                    border-bottom: 1px dashed #e2e8f0;
                }

                .detail-row:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }

                .detail-row:first-child {
                    padding-top: 0;
                }

                .detail-label {
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .detail-label-icon {
                    width: 24px;
                    height: 24px;
                    background: #f1f5f9;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                }

                .detail-value {
                    color: #1e293b;
                    font-weight: 600;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    text-align: right;
                    max-width: 55%;
                    word-break: break-all;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 12px;
                    background: #d1fae5;
                    color: #065f46;
                    border-radius: 20px;
                    font-size: 11.5px;
                    font-weight: 700;
                    font-family: 'Segoe UI', sans-serif;
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #10b981;
                    animation: pulseDot 1.5s infinite;
                }

                @keyframes pulseDot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                .amount-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 18px;
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    border-radius: 14px;
                    margin-top: 14px;
                    border: 1px solid #a7f3d0;
                }

                .amount-row .amount-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #065f46;
                }

                .amount-row .amount-value {
                    font-size: 22px;
                    font-weight: 800;
                    color: #059669;
                    letter-spacing: -0.5px;
                }

                .success-footer {
                    padding: 18px 24px 24px;
                    display: flex;
                    gap: 10px;
                }

                .btn {
                    flex: 1;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 13.5px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-family: inherit;
                }

                .btn-download {
                    flex: 1;
                    background: #f1f5f9;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                }

                .btn-download:hover {
                    background: #e2e8f0;
                }

                .btn-home {
                    flex: 1.5;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
                }

                .btn-home:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5);
                }

                .trust-badges {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    padding: 0 24px 20px;
                    font-size: 11.5px;
                    color: #94a3b8;
                }

                .trust-badge {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .confirm-note {
                    text-align: center;
                    font-size: 11.5px;
                    color: #94a3b8;
                    padding: 0 24px 20px;
                    line-height: 1.5;
                }

                .confirm-note a {
                    color: #10b981;
                    text-decoration: none;
                    font-weight: 600;
                }

                @media (max-width: 500px) {
                    .success-card { border-radius: 20px; }
                    .success-header { padding: 22px 20px; }
                    .checkmark { width: 68px; height: 68px; }
                    .checkmark::before { width: 86px; height: 86px; }
                    .success-body { padding: 20px; }
                    .success-footer {
                        padding: 14px 20px 20px;
                        flex-direction: column;
                    }
                    .btn { width: 100%; }
                    .amount-row { padding: 14px 16px; }
                    .amount-row .amount-value { font-size: 20px; }
                }
            `}</style>

            <div className="success-page">
                <div className="success-card">
                    {/* ✅ RECEIPT PORTION — Sirf yahi PDF mein jayega */}
                    <div ref={receiptRef}>
                        {/* HEADER */}
                        <div className="success-header">
                            <div className="checkmark">
                                <svg viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2>Payment Successful!</h2>
                            <p>
                                Thank you, <strong>{payment.name}</strong>!<br />
                                Your payment has been processed successfully.
                            </p>
                        </div>

                        {/* BODY */}
                        <div className="success-body">
                            <div className="details-box">
                                <div className="details-title">
                                    <span>📄</span>
                                    <span>Transaction Details</span>
                                </div>

                                <div className="detail-row">
                                    <div className="detail-label">
                                        <div className="detail-label-icon">📋</div>
                                        <span>Order ID</span>
                                    </div>
                                    <span className="detail-value">{payment.orderId}</span>
                                </div>

                                <div className="detail-row">
                                    <div className="detail-label">
                                        <div className="detail-label-icon">💳</div>
                                        <span>Payment ID</span>
                                    </div>
                                    <span className="detail-value">{payment.paymentId}</span>
                                </div>

                                <div className="detail-row">
                                    <div className="detail-label">
                                        <div className="detail-label-icon">📅</div>
                                        <span>Date & Time</span>
                                    </div>
                                    <span className="detail-value">{payment.date}</span>
                                </div>

                                {payment.email && (
                                    <div className="detail-row">
                                        <div className="detail-label">
                                            <div className="detail-label-icon">📧</div>
                                            <span>Email</span>
                                        </div>
                                        <span className="detail-value">{payment.email}</span>
                                    </div>
                                )}

                                <div className="detail-row">
                                    <div className="detail-label">
                                        <div className="detail-label-icon">✅</div>
                                        <span>Status</span>
                                    </div>
                                    <span className="status-badge">
                                        <span className="status-dot"></span>
                                        {payment.status}
                                    </span>
                                </div>
                            </div>

                            {payment.amount > 0 && (
                                <div className="amount-row">
                                    <div className="amount-label">
                                        <span>💰</span>
                                        <span>Amount Paid</span>
                                    </div>
                                    <span className="amount-value">
                                        ₹{Number(payment.amount).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* ✅ RECEIPT PORTION END */}

                    {/* ❌ FOOTER — Card ke andar, lekin PDF se bahar */}
                    <div className="success-footer">
                        <button className="btn btn-download" onClick={handleDownload}>
                            ⬇️ Receipt
                        </button>
                        <button className="btn btn-home" onClick={handleHome}>
                            🏠 Go to Home
                        </button>
                    </div>

                    {/* ❌ TRUST BADGES */}
                    <div className="trust-badges">
                        <div className="trust-badge">🔒 Secure</div>
                        <div className="trust-badge">⚡ Instant</div>
                        <div className="trust-badge">✅ Verified</div>
                    </div>

                    {/* ❌ CONFIRMATION NOTE */}
                    <div className="confirm-note">
                        A confirmation email has been sent to your inbox.<br />
                        Need help? <a href="/contact">Contact Support</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PaymentSuccess;