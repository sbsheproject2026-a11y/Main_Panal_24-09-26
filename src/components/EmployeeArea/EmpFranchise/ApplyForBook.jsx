 import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    getDepartmentData,
    getStudyCentreSelectedCourse,
    getStudyCentreSelectedCourseAmount,
} from "../../AllServicesFiles/StudentService";

import { ApplyForBook } from "../../AllServicesFiles/FrenchiseService";
// 👇 Payment Services import karein
import { createRazorpayOrder, verifyPayment } from "../../AllServicesFiles/PaymentService";

const ApplyForBookComponent = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const loginUserId = String(localStorage.getItem("UserId") || 0).trim();
    const location = useLocation();
    
    const referenceId =
        Number(location.state?.referenceId) > 0
            ? Number(location.state.referenceId)
            : Number(loginUserId) || 0;

    const [courseTypes, setCourseTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 👇 Payment Result State
    const [paymentResult, setPaymentResult] = useState(null);

    const [formData, setFormData] = useState({
        courseTypeId: 0,
        courseId: 0,
        referenceId: referenceId,
        quantity: 1,       
        unitPrice: 0,      
        totalAmount: 0,    
        address: "",       
        remark: "",        
        isActive: 1
    });

    useEffect(() => {
        loadCourseType(referenceId);
    }, [referenceId]);

    const loadCourseType = async (refId) => {
        try {
            const result = await getDepartmentData(refId);
            setCourseTypes(result?.data || []);
        } catch (error) {
            console.error("Course Type Error:", error);
        }
    };

    const loadCourse = async (refId, courseTypeId) => {
        try {
            const result = await getStudyCentreSelectedCourse(refId, courseTypeId);
            setCourses(result?.data || []);
        } catch (error) {
            console.error("Course Error:", error);
            setCourses([]);
        }
    };

    const loadCourseAmount = async (courseId) => {
        try {
            const result = await getStudyCentreSelectedCourseAmount(courseId);
            const data = result?.data || [];
            const bookPriceData = data.find(item => Number(item.amountTypeId) === 1152);
            
            if (bookPriceData) {
                const price = Number(bookPriceData.amount || 0);
                setFormData(prev => ({
                    ...prev,
                    unitPrice: price,
                    totalAmount: price * prev.quantity
                }));
            } else {
                setFormData(prev => ({ ...prev, unitPrice: 0, totalAmount: 0 }));
            }
        } catch (error) {
            console.error("Course Amount Error:", error);
        }
    };

    const handleCourseTypeChange = (selectedOption) => {
        const id = selectedOption ? Number(selectedOption.value) : 0;
        setFormData((prev) => ({ 
            ...prev, 
            courseTypeId: id, 
            courseId: 0,
            unitPrice: 0, 
            totalAmount: 0,
            quantity: 1 
        }));
        setErrors((prev) => ({ ...prev, courseTypeId: "" }));
        
        if (id) {
            loadCourse(referenceId, id);
        } else {
            setCourses([]);
        }
    };

    const handleSelectChange = (name, selectedOption) => {
        const id = selectedOption ? Number(selectedOption.value) : 0;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: id,
            unitPrice: 0,
            totalAmount: 0,
            quantity: 1
        }));
        
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        if (name === "courseId" && id) {
            loadCourseAmount(id);
        }
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleIncrement = () => {
        setFormData(prev => {
            const newQty = prev.quantity + 1;
            return { ...prev, quantity: newQty, totalAmount: prev.unitPrice * newQty };
        });
    };

    const handleDecrement = () => {
        setFormData(prev => {
            if (prev.quantity <= 1) return prev;
            const newQty = prev.quantity - 1;
            return { ...prev, quantity: newQty, totalAmount: prev.unitPrice * newQty };
        });
    };

    // 👇 Razorpay Script Loader 👇
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

    // 👇 Main Submit & Payment Handler 👇
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        // Validation
        const newErrors = {};
        if (!formData.courseTypeId) newErrors.courseTypeId = "Programme is required";
        if (!formData.courseId) newErrors.courseId = "Course is required";
        if (!formData.address.trim()) newErrors.address = "Delivery Address is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            setIsSubmitting(true);
            
            // STEP 1: Backend API call (Order create)
            const payload = {
                UserId: formData.referenceId,
                CourseId: formData.courseId,
                Amount: formData.totalAmount,
                Address: formData.address,
                Remark: formData.remark,
                Quantity: formData.quantity
            };

            const applyRes = await ApplyForBook(payload);
            console.log("📦 Apply API Response:", applyRes);

            // Check if order was created successfully and IDs are present
            const userid = applyRes?.userid || applyRes?.userId || applyRes?.data?.userId;
            const paymentid = applyRes?.paymentid || applyRes?.paymentId || applyRes?.data?.paymentId;

            if (!applyRes?.success && !userid) {
                toast.error(applyRes?.message || "Order creation failed");
                setIsSubmitting(false);
                return;
            }

            if (!userid || !paymentid) {
                toast.error("Invalid response from server (Missing Payment IDs)");
                setIsSubmitting(false);
                return;
            }

            // STEP 2: Razorpay script load karein
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                setIsSubmitting(false);
                return;
            }

            // STEP 3: Razorpay Config fetch karein
            const data = await createRazorpayOrder(userid, paymentid);
            console.log("🎯 Razorpay Config:", data);

            const razorpayKey = data.key || data.Key;
            const razorpayOrderId = data.R_orderId || data.r_orderId || data.R_OrderId || data.orderId;
            const razorpayAmount = data.amount || data.Amount;
            const razorpayCurrency = data.currency || data.Currency || "INR";
            const profileName = data.ProfileName || data.profileName || "";
            const profileEmail = data.ProfileEmail || data.profileEmail || "";
            const mobile = data.Mobile || data.mobile || "";
            const notes = data.Notes || data.notes || {};

            if (!razorpayOrderId || !razorpayKey) {
                toast.error("Invalid Razorpay response. Please contact support.");
                setIsSubmitting(false);
                return;
            }

            // STEP 4: Razorpay Open Karein
            const options = {
                key: razorpayKey,
                amount: razorpayAmount,
                currency: razorpayCurrency,
                name: profileName || "Your Institute",
                description: `Book Purchase - Qty: ${formData.quantity}`,
                order_id: razorpayOrderId,
                prefill: { name: profileName, email: profileEmail, contact: mobile },
                notes: notes,
                theme: { color: "#4f46e5" }, // Theme color matching your UI

                handler: async function (response) {
                    console.log("✅ Razorpay Success:", response);
                    try {
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
                                amount: formData.totalAmount,
                                message: verifyRes?.message || "Book Applied successfully!",
                            });
                        } else {
                            setPaymentResult({
                                success: false,
                                message: verifyRes?.message || "Payment verification failed!",
                            });
                        }
                    } catch (err) {
                        console.error("Verify error:", err);
                        setPaymentResult({
                            success: false,
                            message: err?.response?.data?.message || "Payment verification failed!",
                        });
                    } finally {
                        setIsSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("❌ Payment cancelled by user");
                        setIsSubmitting(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Apply Error:", error);
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
            setIsSubmitting(false);
        }
    };

    const makeOptions = (data) => {
        return data.map((item) => ({ value: item.id, label: item.name }));
    };

    const getSelected = (data, id) => {
        return data
            .map((item) => ({ value: item.id, label: item.name }))
            .find((item) => Number(item.value) === Number(id)) || null;
    };

    const selectedCourseName = getSelected(courses, formData.courseId)?.label;

    // 👇 SUCCESS SCREEN 👇
    if (paymentResult) {
        return (
            <div className="ecom-page-wrapper">
                <div className="container py-5">
                    <div className="ecom-summary-card mx-auto" style={{ maxWidth: "600px", padding: "40px 20px", textAlign: "center" }}>
                        <div className="mx-auto mb-4" style={{
                            width: "80px", height: "80px", borderRadius: "50%", 
                            background: paymentResult.success ? "#dcfce7" : "#fee2e2",
                            color: paymentResult.success ? "#16a34a" : "#ef4444",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "40px"
                        }}>
                            {paymentResult.success ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill"></i>}
                        </div>
                        
                        <h2 style={{ fontWeight: 800, color: "#1e293b", marginBottom: "10px" }}>
                            {paymentResult.success ? "Payment Successful!" : "Payment Failed"}
                        </h2>
                        <p style={{ color: "#64748b", marginBottom: "30px" }}>{paymentResult.message}</p>

                        {paymentResult.success && (
                            <div className="mb-4 p-3 rounded" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "left" }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: "#64748b", fontWeight: 600 }}>Amount Paid:</span>
                                    <span style={{ fontWeight: 800, color: "#16a34a" }}>₹{paymentResult.amount?.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: "#64748b", fontWeight: 600 }}>Order ID:</span>
                                    <span style={{ fontWeight: 600, fontSize: "13px", wordBreak: "break-all" }}>{paymentResult.orderId}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span style={{ color: "#64748b", fontWeight: 600 }}>Payment ID:</span>
                                    <span style={{ fontWeight: 600, fontSize: "13px", wordBreak: "break-all" }}>{paymentResult.paymentId}</span>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => navigate("/student-list")} 
                            className="ecom-checkout-btn"
                        >
                            Go to Dashboard <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 👇 MAIN FORM SCREEN 👇
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            
            <div className="ecom-page-wrapper">
                <div className="container py-4 py-md-5">
                    
                    <div className="ecom-header text-center mb-4 mb-md-5">
                        <div className="ecom-icon-box mx-auto mb-3">
                            <i className="bi bi-bag-check-fill"></i>
                        </div>
                        <h2>Book Application Checkout</h2>
                        <p>Select your programme, course and provide delivery details</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            
                            {/* LEFT SIDE */}
                            <div className="col-12 col-lg-7">
                                <div className="ecom-card p-3 p-md-5 h-100">
                                    <h5 className="ecom-card-title mb-4">
                                        <span className="step-badge">1</span> Select Course Details
                                    </h5>

                                    <div className="mb-4">
                                        <label className="ecom-label">Programme <span>*</span></label>
                                        <Select
                                            options={makeOptions(courseTypes)}
                                            value={getSelected(courseTypes, formData.courseTypeId)}
                                            onChange={handleCourseTypeChange}
                                            placeholder="Search & Select Programme"
                                            isSearchable
                                            isClearable
                                            classNamePrefix="ecom-select"
                                        />
                                        {errors.courseTypeId && <ErrorText text={errors.courseTypeId} />}
                                    </div>

                                    <div className="mb-4">
                                        <label className="ecom-label">Course <span>*</span></label>
                                        <Select
                                            options={makeOptions(courses)}
                                            value={getSelected(courses, formData.courseId)}
                                            onChange={(option) => handleSelectChange("courseId", option)}
                                            placeholder={formData.courseTypeId ? "Search & Select Course" : "Please select programme first"}
                                            isSearchable
                                            isClearable
                                            isDisabled={!formData.courseTypeId}
                                            classNamePrefix="ecom-select"
                                        />
                                        {errors.courseId && <ErrorText text={errors.courseId} />}
                                    </div>

                                    <div className="mb-4">
                                        <label className="ecom-label">Delivery Address <span>*</span></label>
                                        <textarea
                                            name="address"
                                            className="form-control ecom-textarea"
                                            rows="3"
                                            placeholder="Enter your full delivery address with pincode"
                                            value={formData.address}
                                            onChange={handleTextChange}
                                        ></textarea>
                                        {errors.address && <ErrorText text={errors.address} />}
                                    </div>

                                    <div className="mb-2">
                                        <label className="ecom-label">Remark / Message <small className="text-muted">(Optional)</small></label>
                                        <textarea
                                            name="remark"
                                            className="form-control ecom-textarea"
                                            rows="2"
                                            placeholder="Any special instructions..."
                                            value={formData.remark}
                                            onChange={handleTextChange}
                                        ></textarea>
                                    </div>

                                    <div className="ecom-info-box mt-4">
                                        <i className="bi bi-info-circle-fill flex-shrink-0"></i>
                                        <p className="mb-0">Make sure you select the correct course and provide an accurate delivery address.</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE */}
                            <div className="col-12 col-lg-5">
                                <div className="ecom-summary-card sticky-summary">
                                    <div className="summary-header">
                                        <h5><i className="bi bi-cart3 me-2"></i> Order Summary</h5>
                                    </div>
                                    
                                    <div className="summary-body">
                                        <div className="selected-item-box mb-4">
                                            <div className="item-icon flex-shrink-0">
                                                <i className="bi bi-book"></i>
                                            </div>
                                            <div className="item-details text-break">
                                                <h6>{selectedCourseName || "No Course Selected"}</h6>
                                                <span>{selectedCourseName ? "Study Material / Book" : "Awaiting selection..."}</span>
                                            </div>
                                        </div>

                                        <div className="price-row">
                                            <span>Book Price (Unit)</span>
                                            <strong>₹{formData.unitPrice.toFixed(2)}</strong>
                                        </div>

                                        <div className="qty-row mb-4">
                                            <span>Quantity</span>
                                            <div className="ecom-quantity-counter">
                                                <button 
                                                    type="button" 
                                                    onClick={handleDecrement}
                                                    disabled={formData.quantity <= 1 || !formData.courseId}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={formData.quantity} 
                                                    readOnly 
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={handleIncrement}
                                                    disabled={!formData.courseId}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="summary-divider" />

                                        <div className="total-row">
                                            <span>Total Amount</span>
                                            <h3>₹{formData.totalAmount.toFixed(2)}</h3>
                                        </div>

                                        <button
                                            type="submit"
                                            className="ecom-checkout-btn mt-4"
                                            disabled={isSubmitting || formData.courseId === 0}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span> Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Pay & Apply <i className="bi bi-credit-card ms-2"></i>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            className="ecom-cancel-btn mt-3"
                                            onClick={() => navigate("/student-list")}
                                            disabled={isSubmitting}
                                        >
                                            Cancel & Go Back
                                        </button>
                                        
                                        <div className="secure-badge mt-4 text-center">
                                            <i className="bi bi-shield-check"></i> 100% Secure Payment
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>

            {/* CSS STYLES (Same as before) */}
            <style>{`
                :root {
                    --primary: #4f46e5;
                    --primary-hover: #4338ca;
                    --bg-color: #f8fafc;
                    --text-dark: #1e293b;
                    --text-muted: #64748b;
                    --border-color: #e2e8f0;
                }

                .ecom-page-wrapper {
                    min-height: 100vh;
                    background-color: var(--bg-color);
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }

                .ecom-header h2 { font-weight: 800; color: var(--text-dark); letter-spacing: -0.5px; font-size: clamp(22px, 4vw, 28px); }
                .ecom-header p { color: var(--text-muted); font-size: clamp(13px, 2vw, 15px); }
                .ecom-icon-box {
                    width: 60px; height: 60px;
                    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
                    color: var(--primary);
                    border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px;
                    box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.2);
                }

                .ecom-card {
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
                }
                .ecom-card-title { font-weight: 700; color: var(--text-dark); display: flex; align-items: center; gap: 12px; font-size: 18px; }
                .step-badge {
                    background: var(--primary); color: white;
                    width: 28px; height: 28px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%; font-size: 14px; font-weight: 600; flex-shrink: 0;
                }

                .ecom-label { font-weight: 600; color: var(--text-dark); font-size: 14px; margin-bottom: 8px; display: block; }
                .ecom-label span { color: #ef4444; }
                
                .ecom-textarea {
                    background: #f8fafc;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 14px;
                    color: var(--text-dark);
                    transition: all 0.2s ease;
                    box-shadow: none;
                    resize: vertical;
                }
                .ecom-textarea:focus {
                    background: #fff;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
                    outline: none;
                }
                .ecom-textarea::placeholder { color: #94a3b8; }

                .ecom-select__control { min-height: 50px !important; border-radius: 12px !important; border-color: var(--border-color) !important; background: #f8fafc !important; box-shadow: none !important; transition: all 0.2s ease !important; }
                .ecom-select__control:hover { border-color: #cbd5e1 !important; }
                .ecom-select__control--is-focused { background: #fff !important; border-color: var(--primary) !important; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important; }
                .ecom-select__menu { border-radius: 12px !important; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important; z-index: 1000 !important; }
                .ecom-select__option--is-focused { background: #eef2ff !important; color: var(--primary) !important; }
                .ecom-select__option--is-selected { background: var(--primary) !important; color: #fff !important; }

                .ecom-info-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; display: flex; gap: 12px; color: #166534; font-size: 13px; line-height: 1.6; }
                .ecom-info-box i { font-size: 18px; color: #22c55e; }

                .ecom-summary-card { background: #fff; border-radius: 20px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); overflow: hidden; }
                
                @media (min-width: 992px) {
                    .sticky-summary { position: -webkit-sticky; position: sticky; top: 100px !important; align-self: flex-start; z-index: 10; }
                }

                .summary-header { background: #f8fafc; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
                .summary-header h5 { margin: 0; font-weight: 700; color: var(--text-dark); font-size: 18px; }
                .summary-body { padding: 24px; }

                .selected-item-box { display: flex; align-items: center; gap: 16px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px dashed #cbd5e1; }
                .item-icon { width: 45px; height: 45px; background: #e0e7ff; color: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
                .item-details h6 { margin: 0 0 4px; font-weight: 700; color: var(--text-dark); font-size: 15px; line-height: 1.4; }
                .item-details span { font-size: 12px; color: var(--text-muted); }

                .price-row, .qty-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: var(--text-muted); font-size: 14px; font-weight: 500; }
                .price-row strong { color: var(--text-dark); font-size: 15px; }
                .summary-divider { border-color: var(--border-color); opacity: 1; margin: 20px 0; }
                .total-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
                .total-row span { font-weight: 700; color: var(--text-dark); font-size: 16px; }
                .total-row h3 { margin: 0; color: var(--primary); font-weight: 800; font-size: 26px; }

                .ecom-quantity-counter { display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: 8px; background: #fff; overflow: hidden; height: 38px; }
                .ecom-quantity-counter button { width: 38px; height: 100%; border: none; background: #f8fafc; color: var(--text-dark); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .ecom-quantity-counter button:hover:not(:disabled) { background: #e2e8f0; }
                .ecom-quantity-counter button:disabled { color: #cbd5e1; cursor: not-allowed; }
                .ecom-quantity-counter input { width: 45px; text-align: center; border: none; font-weight: 700; color: var(--text-dark); outline: none; }

                .ecom-checkout-btn { width: 100%; height: 52px; border-radius: 12px; border: none; background: var(--primary); color: white; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 8px 20px -6px rgba(79, 70, 229, 0.4); }
                .ecom-checkout-btn:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 12px 25px -6px rgba(79, 70, 229, 0.5); }
                .ecom-checkout-btn:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; }
                
                .ecom-cancel-btn { width: 100%; height: 48px; border-radius: 12px; border: 1px solid var(--border-color); background: transparent; color: var(--text-muted); font-weight: 600; transition: all 0.2s; }
                .ecom-cancel-btn:hover { background: #f1f5f9; color: var(--text-dark); }
                .secure-badge { font-size: 12px; color: var(--text-muted); font-weight: 500; }
                .secure-badge i { color: #10b981; margin-right: 4px; }

                @media (max-width: 991px) {
                    .ecom-card, .ecom-summary-card { border-radius: 16px; margin-bottom: 20px; }
                    .summary-body { padding: 20px; }
                }
                @media (max-width: 575px) {
                    .container { padding-left: 15px; padding-right: 15px; }
                    .total-row h3 { font-size: 22px; }
                    .ecom-card { padding: 20px 15px !important; }
                    .summary-header { padding: 16px; }
                    .summary-body { padding: 16px; }
                }
            `}</style>
        </>
    );
};

const ErrorText = ({ text }) => {
    return (
        <div className="text-danger mt-1" style={{ fontSize: "12px", fontWeight: "500" }}>
            <i className="bi bi-exclamation-circle me-1"></i> {text}
        </div>
    );
};

export default ApplyForBookComponent;