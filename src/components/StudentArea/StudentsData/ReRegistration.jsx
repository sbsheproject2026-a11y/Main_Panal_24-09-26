 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 👇 Services Import
import { getStudentFeeDetails, createRazorpayOrder, upgradeverifyPayment,   } from "../../AllServicesFiles/PaymentService";
import { PayPendingStudent } from "../../AllServicesFiles/CourseService";

/* ==========================================================
   Field Normalizer
   ========================================================== */
const normalizeRow = (row) => {
    // 1. Pehle Amount aur Paid Amount nikaalein
    const amount = Number(row.amount ?? row.Amount ?? 0);
    const paidAmount = Number(row.paidAmount ?? row.PaidAmount ?? 0);

    return {
        oId: row.oId ?? row.OId ?? row.id ?? row.Id,
        orderId: row.orderId ?? row.OrderId,
        referenceId: row.referenceId ?? row.ReferenceId,
        feeName: row.feeName ?? row.FeeName ?? row.ProductName,
        name: (row.name ?? row.Name ?? "").trim(),
        mobileNo: row.mobileNo ?? row.MobileNo,
        emailId: row.emailId ?? row.EmailId,
        address: row.address ?? row.Address,
        // 👇 CourseId zaroori hai payment ke liye
        courseId: row.courseId ?? row.CourseId ?? row.productId ?? row.ProductId,
        amount: amount,
        paidAmount: paidAmount,
        // ✅ FIX: Pending Amount hamesha (Amount - Paid) hoga
        pendingAmount: amount - paidAmount,
        amountW: row.amountW ?? row.AmountW ?? "",
        payStatus: row.payStatus ?? row.PayStatus ?? "",
        oDate: row.oDate ?? row.ODate,
        printPayDate: row.printPayDate ?? row.PrintPayDate,
        getwayPrm: row.getwayPrm ?? row.GetwayPrm ?? "",
    };
};

/* ==========================================================
   Main Component
   ========================================================== */
export default function ReRegistration() {
    const { id: studentId } = useParams();
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPaying, setIsPaying] = useState(false); // 👈 Payment Loader

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

                const normalizedData = raw.map(normalizeRow);

                // ✅ FIX: Sabse aakhri (last) Pending entry nikaalo
                const lastPendingPayment = normalizedData.findLast(
                    (p) => Number(p.pendingAmount) > 0 || p.payStatus?.toLowerCase().includes("pending")
                );

                setPayments(lastPendingPayment ? [lastPendingPayment] : []);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Payment details load नहीं हो पाई।"
                );
            } finally {
                setLoading(false);
            }
        })();
    }, [studentId]);

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
       PAYMENT GATEWAY LOGIC
       ========================================================== */
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

    const handlePay = async (item) => {
        try {
            setIsPaying(true);

            // 1. User ID aur Course ID nikaalein (Fallback ke sath)
            const userId = localStorage.getItem("UserId");
            const courseId = item.courseId || 4;
            const amount = item.pendingAmount; // ✅ Yahan calculated pendingAmount jayega

            if (!userId || !amount) {
                alert("User ID ya Pending Amount missing hai!");
                setIsPaying(false);
                return;
            }

            // ✅ SIRF 3 FIELDS BHEJNI HAIN
            const requestData = {
                UserId: Number(userId),
                CourseId: Number(courseId),
                Amount: Number(amount),
            };

            console.log("📦 Sending Request Data:", requestData);

            // STEP 1: Backend API call (Order create)
            const applyRes = await PayPendingStudent(requestData);
            console.log("Apply API Response:", applyRes);

            const userid = applyRes?.userid || applyRes?.userId;
            const paymentid = applyRes?.paymentid || applyRes?.paymentId;

            if (!userid || !paymentid) {
                alert(applyRes?.message || "Order creation failed (Missing IDs)");
                setIsPaying(false);
                return;
            }

            // STEP 2: Razorpay Script load
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                setIsPaying(false);
                return;
            }

            // STEP 3: Razorpay Config fetch
            const data = await createRazorpayOrder(userid, paymentid);
            console.log("Razorpay Config:", data);

            const razorpayKey = data.key || data.Key;
            const razorpayOrderId = data.R_orderId || data.r_orderId || data.R_OrderId || data.orderId;
            const razorpayAmount = data.amount || data.Amount;
            const razorpayCurrency = data.currency || data.Currency || "INR";
            const profileName = data.ProfileName || data.profileName || "";
            const profileEmail = data.ProfileEmail || data.profileEmail || "";
            const mobile = data.Mobile || data.mobile || "";

            if (!razorpayOrderId || !razorpayKey) {
                alert("Invalid Razorpay response. Please contact support.");
                setIsPaying(false);
                return;
            }

            // STEP 4: Razorpay Open Karein
            const options = {
                key: razorpayKey,
                amount: razorpayAmount,
                currency: razorpayCurrency,
                name: profileName || "Your Institute",
                description: `Fee Payment - ${item.feeName}`,
                order_id: razorpayOrderId,
                prefill: { name: profileName, email: profileEmail, contact: mobile },
                theme: { color: "#10b981" }, // Green color

                handler: async function (response) {
                    console.log("✅ Razorpay Success:", response);
                    try {
                        const verifyRes = await upgradeverifyPayment({
                            R_orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            paymentstatus: "Success",
                            userId: userid,
                            oId: paymentid,
                        });

                        console.log("🔍 Verify Response:", verifyRes);

                        if (verifyRes?.success) {
                            alert("Payment Successful! Your fee has been updated.");
                            window.location.reload(); // Page refresh taake naya data aa jaye
                        } else {
                            alert(verifyRes?.message || "Payment verification failed!");
                            setIsPaying(false);
                        }
                    } catch (err) {
                        console.error("Verify error:", err);
                        alert(err?.response?.data?.message || "Payment verification failed!");
                        setIsPaying(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("❌ Payment cancelled by user");
                        setIsPaying(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Pay Error:", error);
            alert(error?.response?.data?.message || error?.message || "Something went wrong");
            setIsPaying(false);
        }
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

        /* ============================================
           TABLE WRAPPER
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

        /* CELLS */
        .rollno-text {
          color: #414a5d;
          white-space: nowrap;
        }

        .rollno-amount-pending {
          font-weight: 800;
          color: #ea580c;
          white-space: nowrap;
        }

        /* ================= ACTION BUTTONS ================= */
        .rollno-action-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* ✅ Pay Button Style */
        .rollno-pay-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 3px 8px rgba(16, 185, 129, 0.25);
        }
        .rollno-pay-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(16, 185, 129, 0.35);
        }
        .rollno-pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .rollno-pay-btn i { font-size: 13px; }

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
                            <h1 className="fw-bold mb-1">Re Registration</h1>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <a href="/" className="text-decoration-none">Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item">Payments</li>
                                    <li className="breadcrumb-item active">Re Registration</li>
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
                                    <small className="opacity-75">Total Pending</small>
                                    <h4 className="mb-0 fw-bold">{payments.length}</h4>
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

                            {/* TABLE */}
                            <div className="rollno-table-wrapper">
                                <table className="table align-middle mb-0 rollno-table">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}> PAY </th>
                                            <th> COURSE / FEE </th>
                                            <th style={{ textAlign: "right" }}> Pay AMOUNT </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                {/* ✅ FIX: colSpan to 3 */}
                                                <td colSpan="3" className="text-center py-5">
                                                    <div className="spinner-border text-primary mb-3"></div>
                                                    <div className="text-muted">
                                                        Loading pending payment...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                {/* ✅ FIX: colSpan to 3 */}
                                                <td colSpan="3" className="text-center py-5">
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
                                        ) : payments.length > 0 ? (
                                            payments.map((p, index) => (
                                                <tr key={p.oId || index}>
                                                    
                                                    {/* 1. Pay Button */}
                                                    <td style={{ textAlign: "center" }}>
                                                        <div className="rollno-action-group">
                                                            <button
                                                                type="button"
                                                                className="rollno-pay-btn"
                                                                onClick={() => handlePay(p)}
                                                                disabled={isPaying}
                                                                title="Pay Now"
                                                            >
                                                                {isPaying ? (
                                                                    <span className="spinner-border spinner-border-sm"></span>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-credit-card-fill"></i> Pay
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* 2. Course/Fee */}
                                                    <td>
                                                        <span className="rollno-text">
                                                            {p.feeName || "N/A"}
                                                        </span>
                                                    </td>

                                                    {/* 3. Pending Amount */}
                                                    <td style={{ textAlign: "right" }}>
                                                        <span className="rollno-amount-pending">
                                                            {formatAmount(p.pendingAmount)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                {/* ✅ FIX: colSpan to 3 */}
                                                <td colSpan="3" className="text-center py-5">
                                                    <div
                                                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            background: "#dcfce7",
                                                        }}
                                                    >
                                                        <i
                                                            className="bi bi-check-circle text-success"
                                                            style={{ fontSize: "30px" }}
                                                        ></i>
                                                    </div>
                                                    <h5 className="fw-semibold text-success">
                                                        No Pending Payments
                                                    </h5>
                                                    <p className="text-muted mb-0">
                                                        इस student की कोई भी fees pending नहीं है।
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

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
        </>
    );
}