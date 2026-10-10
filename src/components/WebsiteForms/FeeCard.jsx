 import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    getAmountDetail,
     
     
} from "../AllServicesFiles/StudentService";
import { createRazorpayOrder, verifyPayment } from "../AllServicesFiles/PaymentService";

function FeeCard() {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ location.state se lo, warna sessionStorage se fallback
    const userId = location.state?.userId || sessionStorage.getItem("userId");
    const oId = location.state?.oId || sessionStorage.getItem("oId");

    // Test ke liye
    //  const userId = 632;
    //  const oId = 1;

    const [fees, setFees] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paying, setPaying] = useState(false); // ✅ Payment loading state

    // ✅ Razorpay script loader
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // ✅ DATA FETCH
    useEffect(() => {
        const loadAmount = async () => {
            if (!userId || !oId) {
                setError("Missing user or order ID");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await getAmountDetail(userId, oId);

                if (result?.success && result?.data) {
                    const d = result.data;
                    setFees({
                        courseFee: d.courseFee || 0,
                        cgstPercent: d.cgstPercent || 0,
                        cgst: d.cgst || 0,
                        sgstPercent: d.sgstPercent || 0,
                        sgst: d.sgst || 0,
                        totalGstPercent: d.totalGstPercent || 0,
                        totalGst: d.totalGst || 0,
                        total: d.total || 0,
                    });
                } else {
                    setError(result?.message || "Fee details not found");
                }
            } catch (err) {
                console.error("Fee fetch error:", err);
                setError(
                    err?.response?.data?.message || "Something went wrong!"
                );
            } finally {
                setLoading(false);
            }
        };

        loadAmount();
    }, [userId, oId]);

    // ============================================================
    // ✅ PROCEED — SEEDHA RAZORPAY CHECKOUT
    // ============================================================
   const handleProceed = async () => {
    setPaying(true);

    try {
        // ✅ Step 1: Razorpay script load
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            alert("Razorpay SDK failed to load!");
            setPaying(false);
            return;
        }

        // ✅ Step 2: Order create karo
        const orderData = await createRazorpayOrder(userId, oId);

        

        // ✅✅✅ Destructure with CORRECT case (camelCase)
        const {
            key,
            amount,
            currency,
            r_orderId,        // ✅ small 'r'  (backend se aise aata hai)
            profileName,      // ✅ small 'p'
            mobile,           // ✅ small 'm'
            profileEmail,     // ✅ small 'p'
            notes,            // ✅ small 'n'
        } = orderData;

        

        // ✅ Validation
        if (!r_orderId || !key) {
            throw new Error(
                `Invalid order response: key=${key}, r_orderId=${r_orderId}`
            );
        }

        // ✅ Step 3: Razorpay options
        const options = {
            key: key,
            amount: amount,
            currency: currency || "INR",
            name: "Your Institute Name",
            description: "Course Fee Payment",
            order_id: r_orderId,          // ✅ small 'r'
            notes: notes || {},
            prefill: {
                name: profileName || "",
                email: profileEmail || "",
                contact: mobile || "",
            },
            handler: async function (response) {
                try {
                    const verifyRes = await verifyPayment({
                        R_orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        paymentstatus: "Success",
                        userId,
                        oId,
                    });

                    if (verifyRes.success) {
                        navigate("/payment-success", {
                            state: {
                                message: verifyRes.message,
                                OId: verifyRes.OId,
                                paymentId: response.razorpay_payment_id,
                                amount: amount / 100,
                                name: profileName,
                                email: profileEmail,
                                status: "Success",
                            },
                        });
                    } else {
                        alert("Payment verification failed!");
                        setPaying(false);
                    }
                } catch (err) {
                    console.error("Verify error:", err);
                    alert("Verification failed!");
                    setPaying(false);
                }
            },
            theme: { color: "#6366f1" },
            modal: { ondismiss: () => setPaying(false) },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error("Payment error:", err);
        alert(err?.message || "Payment failed!");
        setPaying(false);
    }
};

    // ✅ Print Form
    const handlePrintForm = () => {
        navigate(`/admission-form-print/${userId}`);
    };

    // ✅ Cancel
    const handleCancel = () => {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("oId");
        navigate("/");
    };

    // ============================================================
    // ✅ LOADING STATE
    // ============================================================
    if (loading) {
        return (
            <>
                <style>{`
                    * { box-sizing: border-box; margin: 0; padding: 0; }

                    .loading-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f1f5f9;
                        font-family: 'Segoe UI', Tahoma, sans-serif;
                    }

                    .loading-box { text-align: center; }

                    .spinner {
                        width: 56px;
                        height: 56px;
                        margin: 0 auto 18px;
                        border: 4px solid #e2e8f0;
                        border-top-color: #6366f1;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }

                    @keyframes spin { to { transform: rotate(360deg); } }

                    .loading-box p {
                        font-size: 14px;
                        color: #64748b;
                        font-weight: 500;
                    }
                `}</style>

                <div className="loading-page">
                    <div className="loading-box">
                        <div className="spinner"></div>
                        <p>Loading fee details...</p>
                    </div>
                </div>
            </>
        );
    }

    // ============================================================
    // ✅ ERROR STATE
    // ============================================================
    if (error || !fees) {
        return (
            <>
                <style>{`
                    * { box-sizing: border-box; margin: 0; padding: 0; }

                    .err-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f1f5f9;
                        padding: 20px;
                        font-family: 'Segoe UI', Tahoma, sans-serif;
                    }

                    .err-card {
                        position: relative;
                        width: 440px;
                        max-width: 100%;
                        background: #fff;
                        border-radius: 24px;
                        box-shadow: 
                            0 20px 40px -12px rgba(0, 0, 0, 0.15),
                            0 0 0 1px rgba(0, 0, 0, 0.04);
                        overflow: hidden;
                        text-align: center;
                        animation: errEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    @keyframes errEntry {
                        from { opacity: 0; transform: translateY(30px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }

                    .err-header {
                        background: linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #d946ef 100%);
                        padding: 28px 24px 26px;
                        color: #fff;
                        position: relative;
                        overflow: hidden;
                    }

                    .err-header::before {
                        content: '';
                        position: absolute;
                        top: 0; left: -100%;
                        width: 100%; height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                        animation: errShimmer 3s infinite;
                    }

                    @keyframes errShimmer { 100% { left: 100%; } }

                    .err-icon {
                        width: 64px; height: 64px;
                        margin: 0 auto 12px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.2);
                        backdrop-filter: blur(10px);
                        display: flex; align-items: center; justify-content: center;
                        font-size: 30px;
                        position: relative;
                        animation: errPop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.2s both;
                    }

                    .err-icon::before {
                        content: '';
                        position: absolute;
                        width: 84px; height: 84px;
                        border-radius: 50%;
                        border: 2px solid rgba(255, 255, 255, 0.6);
                        opacity: 0;
                        animation: errRipple 1.8s ease-out 0.5s infinite;
                    }

                    @keyframes errRipple {
                        0% { transform: scale(0.8); opacity: 1; }
                        100% { transform: scale(1.5); opacity: 0; }
                    }

                    @keyframes errPop {
                        0% { transform: scale(0); opacity: 0; }
                        70% { transform: scale(1.1); }
                        100% { transform: scale(1); opacity: 1; }
                    }

                    .err-header h2 {
                        font-size: 20px; font-weight: 700;
                        margin-bottom: 4px; letter-spacing: -0.3px;
                    }

                    .err-header p { font-size: 12.5px; opacity: 0.9; }

                    .err-body { padding: 26px 24px 24px; }

                    .err-message-box {
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        border-radius: 14px;
                        padding: 16px 18px;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                        text-align: left;
                    }

                    .err-message-icon {
                        width: 32px; height: 32px;
                        background: #fee2e2;
                        border-radius: 8px;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 15px; flex-shrink: 0;
                    }

                    .err-message-content h4 {
                        font-size: 13.5px; color: #991b1b;
                        font-weight: 700; margin-bottom: 3px;
                    }

                    .err-message-content p {
                        font-size: 12.5px; color: #b91c1c;
                        line-height: 1.5; opacity: 0.9;
                    }

                    .err-info-box {
                        background: #f8fafc;
                        border-radius: 14px;
                        padding: 14px 18px;
                        border: 1px dashed #cbd5e1;
                        margin-bottom: 20px;
                        text-align: left;
                    }

                    .err-info-box h5 {
                        font-size: 11px; font-weight: 700;
                        color: #94a3b8;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                        display: flex; align-items: center; gap: 6px;
                    }

                    .err-info-item {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12.5px;
                        padding: 6px 0;
                        color: #64748b;
                    }

                    .err-actions { display: flex; gap: 10px; }

                    .err-btn {
                        flex: 1;
                        padding: 12px 16px;
                        border: none;
                        border-radius: 11px;
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

                    .err-btn-primary {
                        flex: 2;
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        color: #fff;
                        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
                    }

                    .err-btn-secondary {
                        flex: 1;
                        background: #f1f5f9;
                        color: #64748b;
                        border: 1px solid #e2e8f0;
                    }

                    .err-footer {
                        padding: 0 24px 22px;
                        font-size: 11.5px;
                        color: #94a3b8;
                        line-height: 1.5;
                    }

                    .err-footer a {
                        color: #6366f1;
                        text-decoration: none;
                        font-weight: 600;
                    }

                    @media (max-width: 500px) {
                        .err-card { border-radius: 20px; }
                        .err-header { padding: 22px 20px; }
                        .err-icon { width: 56px; height: 56px; font-size: 26px; }
                        .err-icon::before { width: 74px; height: 74px; }
                        .err-body { padding: 22px 20px 20px; }
                        .err-actions { flex-direction: column; }
                        .err-btn { width: 100%; }
                    }
                `}</style>

                <div className="err-page">
                    <div className="err-card">
                        <div className="err-header">
                            <div className="err-icon">⚠️</div>
                            <h2>Oops! Something went wrong</h2>
                            <p>We couldn't load your fee details</p>
                        </div>

                        <div className="err-body">
                            <div className="err-message-box">
                                <div className="err-message-icon">🚫</div>
                                <div className="err-message-content">
                                    <h4>
                                        {error === "Missing user or order ID"
                                            ? "Missing Information"
                                            : "Error Occurred"}
                                    </h4>
                                    <p>
                                        {error === "Missing user or order ID"
                                            ? "User ID or Order ID is missing. Please complete your registration first."
                                            : error || "Fee details not available."}
                                    </p>
                                </div>
                            </div>

                            <div className="err-info-box">
                                <h5>
                                    <span>🔍</span>
                                    <span>What you can do</span>
                                </h5>
                                <div className="err-info-item">
                                    <span>→ Complete registration form</span>
                                </div>
                                <div className="err-info-item">
                                    <span>→ Try again from home</span>
                                </div>
                                <div className="err-info-item">
                                    <span>→ Contact support if issue persists</span>
                                </div>
                            </div>

                            <div className="err-actions">
                                <button
                                    className="err-btn err-btn-secondary"
                                    onClick={() => window.history.back()}
                                >
                                    ← Back
                                </button>
                                <button
                                    className="err-btn err-btn-primary"
                                    onClick={() => navigate("/")}
                                >
                                    🏠 Go to Home
                                </button>
                            </div>
                        </div>

                        <div className="err-footer">
                            Need help? <a href="/contact">Contact Support</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ============================================================
    // ✅ MAIN RENDER (FeeCard)
    // ============================================================
    return (
        <>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .fee-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, sans-serif;
                }

                .fee-card {
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

                /* Header */
                .fee-header {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                    padding: 20px 24px;
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }

                .fee-header::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer { 100% { left: 100%; } }

                .header-icon {
                    width: 48px; height: 48px;
                    margin: 0 auto 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    position: relative;
                    animation: pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.2s both;
                }

                .header-icon::before {
                    content: '';
                    position: absolute;
                    width: 66px; height: 66px;
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

                .fee-header h2 {
                    font-size: 18px; font-weight: 700;
                    margin-bottom: 2px; letter-spacing: -0.2px;
                }

                .fee-header p {
                    font-size: 12px; opacity: 0.9; line-height: 1.4;
                }

                /* Body */
                .fee-body { padding: 24px; }

                .details-box {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 18px;
                    border: 1px solid #e2e8f0;
                }

                .details-title {
                    font-size: 12px; font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 12px;
                    display: flex; align-items: center; gap: 8px;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    font-size: 14px;
                    border-bottom: 1px dashed #e2e8f0;
                }

                .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
                .detail-row:first-child { padding-top: 0; }

                .detail-label {
                    color: #64748b;
                    display: flex; align-items: center; gap: 10px;
                }

                .detail-label-icon {
                    width: 26px; height: 26px;
                    background: #f1f5f9;
                    border-radius: 7px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px;
                }

                .detail-value {
                    color: #1e293b; font-weight: 600;
                    font-family: 'Courier New', monospace;
                    font-size: 13px; text-align: right;
                }

                .subtotal-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0 0;
                    font-size: 14px;
                    border-top: 2px dashed #cbd5e1;
                    margin-top: 8px;
                }

                .subtotal-row .detail-label {
                    font-weight: 700; color: #475569;
                }

                .subtotal-row .detail-value {
                    font-weight: 800; color: #6366f1;
                }

                .amount-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 18px;
                    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
                    border-radius: 14px;
                    margin-top: 14px;
                    border: 1px solid #c4b5fd;
                }

                .amount-row .amount-label {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 14px; font-weight: 600; color: #5b21b6;
                }

                .amount-row .amount-value {
                    font-size: 22px; font-weight: 800;
                    color: #6d28d9; letter-spacing: -0.5px;
                }

                /* Footer */
                .fee-footer {
                    padding: 18px 24px 24px;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .btn {
                    flex: 1;
                    padding: 12px 10px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    font-family: inherit;
                    white-space: nowrap;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-print {
                    flex: 1;
                    background: #eef2ff;
                    color: #4f46e5;
                    border: 2px dashed #a5b4fc;
                }

                .btn-print:hover:not(:disabled) {
                    background: #e0e7ff;
                    border-color: #6366f1;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
                }

                .btn-cancel {
                    flex: 1;
                    background: #f1f5f9;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                }

                .btn-cancel:hover:not(:disabled) {
                    background: #e2e8f0;
                    color: #475569;
                }

                .btn-proceed {
                    flex: 1.5;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
                }

                .btn-proceed:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
                }

                /* ✅ Button Spinner */
                .btn-spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: btnSpin 0.7s linear infinite;
                }

                @keyframes btnSpin {
                    to { transform: rotate(360deg); }
                }

                /* Trust badges */
                .trust-badges {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    padding: 0 24px 20px;
                    font-size: 12px;
                    color: #94a3b8;
                }

                .trust-badge { display: flex; align-items: center; gap: 5px; }

                /* Responsive */
                @media (max-width: 500px) {
                    .fee-card { border-radius: 20px; }
                    .fee-header { padding: 18px 20px; }
                    .fee-body { padding: 18px; }
                    .fee-footer {
                        padding: 14px 18px 18px;
                        flex-direction: column;
                    }
                    .btn { width: 100%; }
                    .amount-row { padding: 14px 16px; }
                    .amount-row .amount-value { font-size: 20px; }
                }
            `}</style>

            <div className="fee-page">
                <div className="fee-card">
                    {/* HEADER */}
                    <div className="fee-header">
                        <div className="header-icon">💳</div>
                        <h2>Payment Summary</h2>
                        <p>Review your fee details before proceeding</p>
                    </div>

                    {/* BODY */}
                    <div className="fee-body">
                        <div className="details-box">
                            <div className="details-title">
                                <span>📄</span>
                                <span>Fee Breakdown</span>
                            </div>

                            <div className="detail-row">
                                <div className="detail-label">
                                    <div className="detail-label-icon">📚</div>
                                    <span>Course Fee</span>
                                </div>
                                <span className="detail-value">
                                    ₹{Number(fees.courseFee).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="detail-row">
                                <div className="detail-label">
                                    <div className="detail-label-icon">🏛️</div>
                                    <span>CGST ({fees.cgstPercent}%)</span>
                                </div>
                                <span className="detail-value">
                                    ₹{Number(fees.cgst).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="detail-row">
                                <div className="detail-label">
                                    <div className="detail-label-icon">🏢</div>
                                    <span>SGST ({fees.sgstPercent}%)</span>
                                </div>
                                <span className="detail-value">
                                    ₹{Number(fees.sgst).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="subtotal-row">
                                <div className="detail-label">
                                    <div className="detail-label-icon">🧾</div>
                                    <span>Total GST ({fees.totalGstPercent}%)</span>
                                </div>
                                <span className="detail-value">
                                    ₹{Number(fees.totalGst).toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        <div className="amount-row">
                            <div className="amount-label">
                                <span>💰</span>
                                <span>Total Payable</span>
                            </div>
                            <span className="amount-value">
                                ₹{Number(fees.total).toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="fee-footer">
                        <button
                            className="btn btn-print"
                            onClick={handlePrintForm}
                            disabled={paying}
                        >
                            🖨️ Print Form
                        </button>
                        <button
                            className="btn btn-cancel"
                            onClick={handleCancel}
                            disabled={paying}
                        >
                            ❌ Cancel
                        </button>
                        <button
                            className="btn btn-proceed"
                            onClick={handleProceed}
                            disabled={paying}
                        >
                            {paying ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>✅ Proceed to Pay</>
                            )}
                        </button>
                    </div>

                    {/* TRUST BADGES */}
                    <div className="trust-badges">
                        <div className="trust-badge">🔒 Secure</div>
                        <div className="trust-badge">⚡ Instant</div>
                        <div className="trust-badge">✅ Verified</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FeeCard;