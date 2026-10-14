 import React, { useState, useEffect } from "react";
import { createWalletOnline } from "../../AllServicesFiles/WalletService";
import {
    createRazorpayOrder,
    verifyPayment,
} from "../../AllServicesFiles/PaymentService";

const WalletRechargeOnline = () => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [franchiseId, setFranchiseId] = useState("");
    const [paymentResult, setPaymentResult] = useState(null);

    const quickAmounts = [500, 1000, 2000, 5000, 10000];

    // =========================================================
    // Franchise ID from localStorage
    // =========================================================
    useEffect(() => {
        const userId = localStorage.getItem("UserId") || "N/A";
        if (userId !== "N/A") {
            setFranchiseId(userId);
        }
    }, []);

    // =========================================================
    // Razorpay script loader
    // =========================================================
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // =========================================================
    // Handle Recharge
    // =========================================================
    const handleRecharge = async (e) => {
        e.preventDefault();

        if (!franchiseId || franchiseId === "N/A") {
            alert("Franchise not found. Please login again.");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (Number(amount) < 1) {
            alert("Minimum recharge amount is ₹100");
            return;
        }

        try {
            setLoading(true);

            // ==========================================
            // STEP 1: Create Order
            // ==========================================
            const createRes = await createWalletOnline({
                totalAmount: amount,
                franchiseId: franchiseId,
            });

            console.log("📦 createRes:", createRes);

            const responseData = createRes?.data || createRes;

            if (!responseData?.success) {
                alert(responseData?.message || "Order creation failed");
                setLoading(false);
                return;
            }

            const userid = responseData.userid || responseData.userId;
            const paymentid =
                responseData.paymentid || responseData.paymentId;

            console.log("📦 Order Created:", { userid, paymentid });

            if (!userid || !paymentid) {
                alert("Invalid response from server");
                setLoading(false);
                return;
            }

            // ==========================================
            // STEP 2: Load Razorpay script
            // ==========================================
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Razorpay SDK failed to load");
                setLoading(false);
                return;
            }

            // ==========================================
            // STEP 3: Get Razorpay Config
            // ==========================================
            const data = await createRazorpayOrder(userid, paymentid);

            console.log("🎯 Razorpay Config Full:", data);

            // ✅ Dono casing support — small aur capital
            const razorpayKey = data.key || data.Key;
            const razorpayOrderId =
                data.R_orderId ||
                data.r_orderId ||
                data.R_OrderId ||
                data.orderId;
            const razorpayAmount = data.amount || data.Amount;
            const razorpayCurrency =
                data.currency || data.Currency || "INR";
            const profileName = data.ProfileName || data.profileName || "";
            const profileEmail =
                data.ProfileEmail || data.profileEmail || "";
            const mobile = data.Mobile || data.mobile || "";
            const notes = data.Notes || data.notes || {};

            console.log("🎯 Extracted:", {
                razorpayKey,
                razorpayOrderId,
                razorpayAmount,
                profileName,
                mobile,
            });

            // ✅ Validation
            if (!razorpayOrderId || !razorpayKey) {
                console.error("❌ Missing Razorpay fields:", {
                    key: razorpayKey,
                    order_id: razorpayOrderId,
                    fullResponse: data,
                });
                alert(
                    "Invalid Razorpay response. Please contact support."
                );
                setLoading(false);
                return;
            }

            // ==========================================
            // STEP 4: Open Razorpay
            // ==========================================
            const options = {
                key: razorpayKey,
                amount: razorpayAmount,
                currency: razorpayCurrency,
                name: profileName || "Your Institute",
                description: "Wallet Recharge",
                order_id: razorpayOrderId,
                prefill: {
                    name: profileName,
                    email: profileEmail,
                    contact: mobile,
                },
                notes: notes,
                theme: { color: "#ff6600" },

                // ✅ STEP 5: Success → verifyPayment
                handler: async function (response) {
                    console.log("✅ Razorpay Success:", response);

                    try {
                        setLoading(true);

                        const verifyRes = await verifyPayment({
                            R_orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            paymentstatus: "Success",
                            userId: userid,
                            oId: paymentid,
                        });

                        console.log("🔍 Verify Response:", verifyRes);

                        if (verifyRes?.success) {
                            setPaymentResult({
                                success: true,
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                amount: Number(amount),
                                date: new Date().toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                }),
                                name: profileName,
                                email: profileEmail,
                                message:
                                    verifyRes?.message ||
                                    "Wallet recharged successfully!",
                            });
                        } else {
                            setPaymentResult({
                                success: false,
                                message:
                                    verifyRes?.message ||
                                    "Payment verification failed!",
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                            });
                        }
                    } catch (err) {
                        console.error("Verify error:", err);
                        setPaymentResult({
                            success: false,
                            message:
                                err?.response?.data?.message ||
                                err?.message ||
                                "Verification failed!",
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                        });
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        console.log("❌ Payment cancelled by user");
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong"
            );
            setLoading(false);
        }
    };

    // =========================================================
    // RESET
    // =========================================================
    const handleReset = () => {
        setPaymentResult(null);
        setAmount("");
    };

    // =========================================================
    // SUCCESS / FAILURE SCREEN
    // =========================================================
    if (paymentResult) {
        const isSuccess = paymentResult.success;

        return (
            <>
                <div className="wallet-page">
                    <div className="wallet-blob blob-1"></div>
                    <div className="wallet-blob blob-2"></div>
                    <div className="wallet-blob blob-3"></div>

                    <div className="wallet-card">
                        <div
                            className="wallet-header"
                            style={{
                                background: isSuccess
                                    ? "linear-gradient(155deg, #10b981 0%, #059669 60%, #047857 100%)"
                                    : "linear-gradient(155deg, #f43f5e 0%, #ec4899 60%, #d946ef 100%)",
                            }}
                        >
                            <div className="wallet-header-glow"></div>

                            <div className="wallet-icon-wrap">
                                <i
                                    className={`bi ${
                                        isSuccess
                                            ? "bi-check-circle-fill"
                                            : "bi-x-circle-fill"
                                    }`}
                                ></i>
                            </div>

                            <h1>
                                {isSuccess
                                    ? "Recharge Successful!"
                                    : "Payment Failed"}
                            </h1>
                            <p>
                                {isSuccess
                                    ? "Your wallet has been recharged"
                                    : paymentResult.message}
                            </p>
                        </div>

                        <div style={{ padding: "24px" }}>
                            <div
                                style={{
                                    background: "#f8fafc",
                                    borderRadius: "16px",
                                    padding: "18px",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        color: "#94a3b8",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        marginBottom: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <span>📄</span>
                                    <span>Transaction Details</span>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "10px 0",
                                        fontSize: "13px",
                                        borderBottom:
                                            "1px dashed #e2e8f0",
                                    }}
                                >
                                    <span style={{ color: "#64748b" }}>
                                        Order ID
                                    </span>
                                    <span
                                        style={{
                                            color: "#1e293b",
                                            fontWeight: 600,
                                            fontFamily:
                                                "'Courier New', monospace",
                                            fontSize: "12px",
                                            maxWidth: "55%",
                                            textAlign: "right",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {paymentResult.orderId || "-"}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "10px 0",
                                        fontSize: "13px",
                                        borderBottom:
                                            "1px dashed #e2e8f0",
                                    }}
                                >
                                    <span style={{ color: "#64748b" }}>
                                        Payment ID
                                    </span>
                                    <span
                                        style={{
                                            color: "#1e293b",
                                            fontWeight: 600,
                                            fontFamily:
                                                "'Courier New', monospace",
                                            fontSize: "12px",
                                            maxWidth: "55%",
                                            textAlign: "right",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {paymentResult.paymentId || "-"}
                                    </span>
                                </div>

                                {isSuccess && (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "10px 0",
                                            fontSize: "13px",
                                        }}
                                    >
                                        <span style={{ color: "#64748b" }}>
                                            Status
                                        </span>
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                padding: "4px 12px",
                                                background: "#d1fae5",
                                                color: "#065f46",
                                                borderRadius: "20px",
                                                fontSize: "11.5px",
                                                fontWeight: 700,
                                            }}
                                        >
                                            ✓ Success
                                        </span>
                                    </div>
                                )}
                            </div>

                            {isSuccess && paymentResult.amount > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px 18px",
                                        background:
                                            "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                                        borderRadius: "14px",
                                        marginTop: "14px",
                                        border: "1px solid #a7f3d0",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: "#065f46",
                                        }}
                                    >
                                        <span>💰</span>
                                        <span>Amount Added</span>
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "22px",
                                            fontWeight: 800,
                                            color: "#059669",
                                            letterSpacing: "-0.5px",
                                        }}
                                    >
                                        ₹
                                        {Number(
                                            paymentResult.amount
                                        ).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                padding: "18px 24px 24px",
                                display: "flex",
                                gap: "10px",
                            }}
                        >
                            <button
                                type="button"
                                className="wallet-btn"
                                style={{
                                    flex: 1,
                                    background: "#f1f5f9",
                                    color: "#475569",
                                    boxShadow: "none",
                                }}
                                onClick={handleReset}
                            >
                                🔄 Recharge Again
                            </button>
                            <button
                                type="button"
                                className="wallet-btn"
                                style={{ flex: 1.5 }}
                                onClick={() => (window.location.href = "/employee-dashboard")}
                            >
                                🏠 Go to Home
                            </button>
                        </div>
                    </div>
                </div>

                <style>{`
                    .wallet-page {
                        min-height: 100vh;
                        padding: 32px 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
                        position: relative;
                        overflow: hidden;
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    }
                    .wallet-blob {
                        position: absolute;
                        border-radius: 50%;
                        filter: blur(90px);
                        pointer-events: none;
                        z-index: 0;
                    }
                    .blob-1 {
                        width: 380px;
                        height: 380px;
                        background: #ffb066;
                        top: -140px;
                        left: -100px;
                        opacity: 0.4;
                    }
                    .blob-2 {
                        width: 320px;
                        height: 320px;
                        background: #a5b4fc;
                        bottom: -120px;
                        right: -100px;
                        opacity: 0.35;
                    }
                    .blob-3 {
                        width: 260px;
                        height: 260px;
                        background: #fecdd3;
                        top: 50%;
                        right: 15%;
                        opacity: 0.22;
                    }
                    .wallet-card {
                        position: relative;
                        z-index: 1;
                        width: 100%;
                        max-width: 520px;
                        background: #fff;
                        border-radius: 24px;
                        overflow: hidden;
                        box-shadow:
                            0 30px 80px rgba(15, 23, 42, 0.14),
                            0 8px 30px rgba(15, 23, 42, 0.06);
                    }
                    .wallet-header {
                        position: relative;
                        padding: 36px 32px 32px;
                        color: #fff;
                        text-align: center;
                        overflow: hidden;
                    }
                    .wallet-header-glow {
                        position: absolute;
                        top: -50%;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 300px;
                        height: 300px;
                        background: radial-gradient(
                            circle,
                            rgba(255, 255, 255, 0.22) 0%,
                            transparent 70%
                        );
                        pointer-events: none;
                    }
                    .wallet-icon-wrap {
                        position: relative;
                        width: 68px;
                        height: 68px;
                        margin: 0 auto 16px;
                        border-radius: 20px;
                        background: rgba(255, 255, 255, 0.22);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.32);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                        color: #fff;
                        box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
                    }
                    .wallet-header h1 {
                        position: relative;
                        margin: 0 0 6px;
                        font-size: 23px;
                        font-weight: 800;
                        letter-spacing: -0.4px;
                    }
                    .wallet-header p {
                        position: relative;
                        margin: 0;
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.9);
                    }
                    .wallet-btn {
                        height: 56px;
                        border: 0;
                        border-radius: 14px;
                        background: linear-gradient(135deg, #ff6600 0%, #ff8c38 100%);
                        color: #fff;
                        font-size: 15px;
                        font-weight: 700;
                        letter-spacing: 0.3px;
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 9px;
                        box-shadow: 0 10px 28px rgba(255, 102, 0, 0.35);
                        transition: all 0.22s ease;
                        font-family: inherit;
                        position: relative;
                        overflow: hidden;
                    }
                    .wallet-btn:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 14px 36px rgba(255, 102, 0, 0.45);
                    }
                    @media (max-width: 520px) {
                        .wallet-page { padding: 16px 12px; }
                        .wallet-card { border-radius: 20px; }
                        .wallet-header { padding: 28px 22px 24px; }
                        .wallet-icon-wrap { width: 58px; height: 58px; font-size: 26px; }
                        .wallet-header h1 { font-size: 19px; }
                    }
                `}</style>
            </>
        );
    }

    // =========================================================
    // MAIN FORM SCREEN
    // =========================================================
    return (
        <>
            <div className="wallet-page">
                <div className="wallet-blob blob-1"></div>
                <div className="wallet-blob blob-2"></div>
                <div className="wallet-blob blob-3"></div>

                <div className="wallet-card">
                    <div className="wallet-header">
                        <div className="wallet-header-glow"></div>

                        <div className="wallet-icon-wrap">
                            <i className="bi bi-wallet2"></i>
                        </div>

                        <h1>Recharge Your Wallet</h1>
                        <p>Add funds instantly and securely</p>

                        <div className="wallet-secure-badge">
                            <i className="bi bi-shield-check"></i>
                            <span>Secured by Razorpay</span>
                        </div>
                    </div>

                    <form onSubmit={handleRecharge} className="wallet-form">
                        <div className="wallet-amount-block">
                            <label className="wallet-label">
                                Enter Amount
                            </label>

                            <div className="wallet-amount-input">
                                <span className="currency-symbol">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="0"
                                    min="1"
                                    max="100000"
                                    autoFocus
                                    required
                                />
                                {amount && Number(amount) > 0 && (
                                    <span className="amount-badge">
                                        ₹
                                        {Number(amount).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                )}
                            </div>

                            <div className="amount-hint">
                                <i className="bi bi-info-circle"></i>
                                Min ₹1 • Max ₹1,00,000
                            </div>
                        </div>

                        <div className="wallet-quick-section">
                            <span className="quick-title">
                                Popular amounts
                            </span>
                            <div className="quick-chips">
                                {quickAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        className={`chip ${
                                            Number(amount) === amt
                                                ? "chip-active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setAmount(String(amt))
                                        }
                                    >
                                        ₹{amt.toLocaleString("en-IN")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {amount && Number(amount) > 0 && (
                            <div className="wallet-preview">
                                <div className="preview-icon">
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div className="preview-content">
                                    <span>You're adding</span>
                                    <strong>
                                        ₹
                                        {Number(amount).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>
                                <div className="preview-arrow">
                                    <i className="bi bi-arrow-right"></i>
                                </div>
                                <div className="preview-content">
                                    <span>New balance</span>
                                    <strong>
                                        ₹
                                        {Number(amount).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="wallet-btn"
                            disabled={
                                loading || !amount || Number(amount) < 1
                            }
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-lock-fill"></i>
                                    Proceed to Pay ₹
                                    {amount
                                        ? Number(amount).toLocaleString(
                                              "en-IN"
                                          )
                                        : "0"}
                                    <i className="bi bi-arrow-right"></i>
                                </>
                            )}
                        </button>

                        <div className="wallet-trust">
                            <div className="trust-item">
                                <i className="bi bi-shield-lock-fill"></i>
                                <span>100% Safe</span>
                            </div>
                            <div className="trust-divider"></div>
                            <div className="trust-item">
                                <i className="bi bi-lightning-charge-fill"></i>
                                <span>Instant</span>
                            </div>
                            <div className="trust-divider"></div>
                            <div className="trust-item">
                                <i className="bi bi-arrow-repeat"></i>
                                <span>Refundable</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .wallet-page {
                    min-height: 100vh;
                    padding: 32px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                .wallet-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(90px);
                    pointer-events: none;
                    z-index: 0;
                }
                .blob-1 {
                    width: 380px;
                    height: 380px;
                    background: #ffb066;
                    top: -140px;
                    left: -100px;
                    opacity: 0.4;
                }
                .blob-2 {
                    width: 320px;
                    height: 320px;
                    background: #a5b4fc;
                    bottom: -120px;
                    right: -100px;
                    opacity: 0.35;
                }
                .blob-3 {
                    width: 260px;
                    height: 260px;
                    background: #fecdd3;
                    top: 50%;
                    right: 15%;
                    opacity: 0.22;
                }
                .wallet-card {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 520px;
                    background: #fff;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow:
                        0 30px 80px rgba(15, 23, 42, 0.14),
                        0 8px 30px rgba(15, 23, 42, 0.06);
                }
                .wallet-header {
                    position: relative;
                    padding: 36px 32px 32px;
                    background: linear-gradient(155deg, #ff6600 0%, #ff8c38 60%, #ffb066 100%);
                    color: #fff;
                    text-align: center;
                    overflow: hidden;
                }
                .wallet-header-glow {
                    position: absolute;
                    top: -50%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(
                        circle,
                        rgba(255, 255, 255, 0.22) 0%,
                        transparent 70%
                    );
                    pointer-events: none;
                }
                .wallet-icon-wrap {
                    position: relative;
                    width: 68px;
                    height: 68px;
                    margin: 0 auto 16px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.22);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.32);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: #fff;
                    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
                }
                .wallet-header h1 {
                    position: relative;
                    margin: 0 0 6px;
                    font-size: 23px;
                    font-weight: 800;
                    letter-spacing: -0.4px;
                }
                .wallet-header p {
                    position: relative;
                    margin: 0 0 16px;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.9);
                }
                .wallet-secure-badge {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.22);
                    backdrop-filter: blur(6px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    font-size: 11.5px;
                    font-weight: 600;
                    color: #fff;
                }
                .wallet-form {
                    padding: 32px 32px 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 22px;
                }
                .wallet-amount-block {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .wallet-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #334155;
                    letter-spacing: 0.15px;
                }
                .wallet-amount-input {
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 6px 8px 6px 20px;
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    background: #f8fafc;
                    transition: all 0.2s ease;
                }
                .wallet-amount-input:focus-within {
                    border-color: #ff6600;
                    background: #fff;
                    box-shadow: 0 0 0 5px rgba(255, 102, 0, 0.1);
                }
                .currency-symbol {
                    font-size: 26px;
                    font-weight: 800;
                    color: #ff6600;
                    margin-right: 6px;
                    line-height: 1;
                }
                .wallet-amount-input input {
                    flex: 1;
                    min-width: 0;
                    padding: 14px 6px;
                    border: 0;
                    background: transparent;
                    font-size: 32px;
                    font-weight: 800;
                    color: #0f172a;
                    outline: none;
                    font-family: inherit;
                    letter-spacing: -0.8px;
                }
                .wallet-amount-input input::placeholder {
                    color: #cbd5e1;
                    font-weight: 700;
                }
                .wallet-amount-input input::-webkit-outer-spin-button,
                .wallet-amount-input input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .wallet-amount-input input {
                    -moz-appearance: textfield;
                    appearance: textfield;
                }
                .amount-badge {
                    flex-shrink: 0;
                    padding: 6px 12px;
                    border-radius: 8px;
                    background: #fff4eb;
                    color: #ff6600;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                }
                .amount-hint {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11.5px;
                    color: #64748b;
                    font-weight: 500;
                }
                .amount-hint i {
                    color: #ff6600;
                    font-size: 13px;
                }
                .wallet-quick-section {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .quick-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    letter-spacing: 0.2px;
                }
                .quick-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .chip {
                    flex: 1;
                    min-width: 78px;
                    padding: 11px 8px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 11px;
                    background: #fff;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    font-family: inherit;
                    text-align: center;
                }
                .chip:hover {
                    border-color: #ff6600;
                    color: #ff6600;
                    background: #fff8f3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 102, 0, 0.12);
                }
                .chip-active {
                    border-color: #ff6600 !important;
                    background: linear-gradient(135deg, #ff6600, #ff8c38) !important;
                    color: #fff !important;
                    box-shadow: 0 6px 16px rgba(255, 102, 0, 0.3);
                }
                .wallet-preview {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
                    border: 1.5px solid #bbf7d0;
                    border-radius: 14px;
                    animation: walletFadeIn 0.25s ease;
                }
                @keyframes walletFadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .preview-icon {
                    width: 34px;
                    height: 34px;
                    flex-shrink: 0;
                    border-radius: 10px;
                    background: #22c55e;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
                .preview-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    min-width: 0;
                }
                .preview-content span {
                    font-size: 10.5px;
                    font-weight: 700;
                    color: #15803d;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .preview-content strong {
                    font-size: 15px;
                    font-weight: 800;
                    color: #166534;
                }
                .preview-arrow {
                    color: #22c55e;
                    font-size: 18px;
                    font-weight: 700;
                }
                .wallet-btn {
                    height: 56px;
                    border: 0;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #ff6600 0%, #ff8c38 100%);
                    color: #fff;
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    box-shadow: 0 10px 28px rgba(255, 102, 0, 0.35);
                    transition: all 0.22s ease;
                    font-family: inherit;
                    position: relative;
                    overflow: hidden;
                }
                .wallet-btn::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.3),
                        transparent
                    );
                    transition: left 0.6s ease;
                }
                .wallet-btn:hover:not(:disabled)::before {
                    left: 100%;
                }
                .wallet-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 36px rgba(255, 102, 0, 0.45);
                }
                .wallet-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    box-shadow: 0 4px 12px rgba(255, 102, 0, 0.18);
                }
                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: walletSpin 0.7s linear infinite;
                }
                @keyframes walletSpin {
                    to { transform: rotate(360deg); }
                }
                .wallet-trust {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                    padding-top: 18px;
                    border-top: 1px dashed #e2e8f0;
                }
                .trust-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11.5px;
                    font-weight: 600;
                    color: #64748b;
                }
                .trust-item i {
                    color: #22c55e;
                    font-size: 14px;
                }
                .trust-divider {
                    width: 1px;
                    height: 16px;
                    background: #e2e8f0;
                }
                @media (max-width: 520px) {
                    .wallet-page { padding: 16px 12px; }
                    .wallet-card { border-radius: 20px; }
                    .wallet-header { padding: 28px 22px 24px; }
                    .wallet-icon-wrap { width: 58px; height: 58px; font-size: 26px; margin-bottom: 12px; }
                    .wallet-header h1 { font-size: 19px; }
                    .wallet-header p { font-size: 12px; }
                    .wallet-form { padding: 24px 20px 22px; gap: 18px; }
                    .currency-symbol { font-size: 22px; }
                    .wallet-amount-input input { font-size: 26px; padding: 12px 4px; }
                    .amount-badge { font-size: 11px; padding: 5px 9px; }
                    .chip { min-width: 68px; padding: 10px 6px; font-size: 12.5px; }
                    .wallet-btn { height: 52px; font-size: 13.5px; }
                    .wallet-preview { padding: 12px 14px; gap: 10px; }
                    .preview-content strong { font-size: 13.5px; }
                }
            `}</style>
        </>
    );
};

export default WalletRechargeOnline;