import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentCourseById, ApplyForBookbyStudent } from "../../AllServicesFiles/CourseService";
// 👇 Payment Services import karein
import { createRazorpayOrder, verifyPayment } from "../../AllServicesFiles/PaymentService";
import { FILE_URL } from "../../api";

function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States (Files)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFiles, setModalFiles] = useState([]);

  // Modal States (Apply Book)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [applyForm, setApplyForm] = useState({ address: "", message: "" });

  // 👇 Payment & Loading States 👇
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // Payment success/fail track karne ke liye

  const userId = localStorage.getItem("UserId") || "N/A";

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const result = await getStudentCourseById(id);

      let courseData = [];
      if (Array.isArray(result)) courseData = result;
      else if (Array.isArray(result?.data)) courseData = result.data;
      else if (Array.isArray(result?.data?.data)) courseData = result.data.data;
      else if (result?.data && typeof result.data === "object") courseData = [result.data];
      else if (result && typeof result === "object") courseData = [result];

      if (courseData.length === 0) {
        setError("Course not found.");
        setCourses([]);
      } else {
        setCourses(courseData);
      }
    } catch (err) {
      console.log("Course Error:", err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (fileName) => {
    if (!fileName) return "#";
    if (fileName.startsWith("http")) return encodeURI(fileName);
    const base = FILE_URL.replace(/\/+$/, "");
    return encodeURI(`${base}/${fileName}`);
  };

  const getFileName = (fileName) => {
    if (!fileName) return "Untitled Document";
    return fileName.split("/").pop().split("\\").pop();
  };

  const openModal = (files, title) => {
    setModalFiles(files);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const openApplyModal = (item, bookPrice) => {
    setSelectedCourse({
      id: item.id,
      name: item.name,
      bookPrice: bookPrice
    });
    setApplyForm({ address: "", message: "" });
    setApplySuccess(false);
    setPaymentResult(null); // Reset payment state
    setIsApplyModalOpen(true);
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
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.address.trim()) {
      alert("Kripya delivery address likhein!");
      return;
    }

    try {
      setIsApplying(true);

      // STEP 1: Backend API ko call karein
      const requestData = {
        UserId: Number(userId),
        CourseId: selectedCourse.id,
        Amount: selectedCourse.bookPrice,
        Address: applyForm.address,
        Message: applyForm.message
      };

      const applyRes = await ApplyForBookbyStudent(requestData);
      console.log("📦 Apply API Response:", applyRes);

      if (!applyRes?.success) {
        alert(applyRes?.message || "Order creation failed");
        setIsApplying(false);
        return;
      }

      const userid = applyRes.userid || applyRes.userId;
      const paymentid = applyRes.paymentid || applyRes.paymentId;

      if (!userid || !paymentid) {
        alert("Invalid response from server (Missing Payment IDs)");
        setIsApplying(false);
        return;
      }

      // STEP 2: Razorpay script load karein
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load");
        setIsApplying(false);
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
        alert("Invalid Razorpay response. Please contact support.");
        setIsApplying(false);
        return;
      }

      // STEP 4: Razorpay Open Karein
      const options = {
        key: razorpayKey,
        amount: razorpayAmount,
        currency: razorpayCurrency,
        name: profileName || "Your Institute",
        description: `Book Purchase - ${selectedCourse.name}`,
        order_id: razorpayOrderId,
        prefill: { name: profileName, email: profileEmail, contact: mobile },
        notes: notes,
        theme: { color: "#16a34a" }, // Green color book ke liye

        handler: async function (response) {
          console.log("✅ Razorpay Success:", response);
          try {
            setLoading(true); // Loader chalu rakhein
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
                amount: Number(selectedCourse.bookPrice),
                message: verifyRes?.message || "Book Applied successfully!",
              });
            } else {
              setPaymentResult({
                success: false,
                message: verifyRes?.message || "Payment verification failed!",
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              });
            }
          } catch (err) {
            console.error("Verify error:", err);
            setPaymentResult({
              success: false,
              message: err?.response?.data?.message || "Verification failed!",
            });
          } finally {
            setIsApplying(false);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("❌ Payment cancelled by user");
            setIsApplying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Apply Error:", error);
      alert(error?.response?.data?.message || error?.message || "Something went wrong");
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="cd-load" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="cd-spinner" style={{ width: "46px", height: "46px", border: "4px solid #e0e3ff", borderTopColor: "#6366f1", borderRadius: "50%", animation: "cdSpin .8s linear infinite" }}></div>
        <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading course details...</p>
      </div>
    );
  }

  if (error || courses.length === 0) {
    return (
      <div className="cd-err" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h3 style={{ color: "#e5484d" }}>{error || "Course Not Found"}</h3>
        <button onClick={() => navigate(-1)} style={{ padding: "10px 20px", background: "#6366f1", color: "#fff", borderRadius: "8px", border: "none", marginTop: "15px", cursor: "pointer" }}>
          Go Back
        </button>
      </div>
    );
  }

  const mainCourse = courses.find(c => c.parentId === null) || courses[0];

  return (
    <>
      <style>{`
        /* Page & Table CSS (No changes) */
        html, body, #root { background: #f7f8fc; overflow-x: hidden !important; width: 100%; max-width: 100%; margin: 0; padding: 0; }
        .cstack { width: 100%; max-width: 100%; background: #f7f8fc; padding: 40px 20px 70px; box-sizing: border-box; overflow-x: hidden !important; }
        .cstack-inner { width: 100%; max-width: 1300px; margin: 0 auto; box-sizing: border-box; min-width: 0; }
        .cstack-back { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; padding: 9px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 30px; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .25s ease; }
        .cstack-back:hover { color: #6366f1; border-color: #6366f1; transform: translateX(-3px); }
        .cstack-hero { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 22px; padding: 38px 34px; box-shadow: 0 18px 40px rgba(99,102,241,.28); margin-bottom: 22px; position: relative; overflow: hidden; color: white; }
        .cstack-title { margin: 0 0 8px; font-size: 28px; font-weight: 800; line-height: 1.3; }
        .cstack-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
        .cstack-chip { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.35); padding: 8px 14px; border-radius: 30px; font-size: 12px; font-weight: 600; }
        .cstack-card { background: #fff; border-radius: 18px; padding: 20px; border: 1px solid #eef1f6; box-shadow: 0 6px 22px rgba(15,23,42,.05); margin-bottom: 18px; overflow: hidden; width: 100%; max-width: 100%; box-sizing: border-box; }
        .table-responsive { width: 0 !important; min-width: 100% !important; max-width: 100% !important; overflow-x: auto !important; overflow-y: hidden !important; box-sizing: border-box; position: relative; -webkit-overflow-scrolling: touch; scrollbar-gutter: stable; contain: inline-size; border-radius: 14px; border: 1px solid #edf0f5; padding-bottom: 6px; }
        .table-responsive::-webkit-scrollbar { height: 9px; }
        .table-responsive::-webkit-scrollbar-track { background: #eef1f5; border-radius: 10px; }
        .table-responsive::-webkit-scrollbar-thumb { background: #b8bfcc; border-radius: 10px; }
        .table-responsive::-webkit-scrollbar-thumb:hover { background: #8f98a8; }
        .table-responsive { scrollbar-width: thin; scrollbar-color: #b8bfcc #eef1f5; }
        .course-table { width: auto !important; min-width: 1100px !important; max-width: none !important; table-layout: auto !important; border-collapse: separate !important; border-spacing: 0 !important; margin: 0 !important; }
        .course-table th { background: #f8f9fc !important; color: #687185; font-size: 13px; font-weight: 700; text-align: left; padding: 16px; border-bottom: 1px solid #e9edf3 !important; white-space: nowrap; }
        .course-table td { padding: 16px; border-bottom: 1px solid #f0f2f6 !important; color: #414a5d; font-size: 13.5px; font-weight: 500; vertical-align: middle; white-space: nowrap; }
        .course-table tr:hover { background: #fafbff; }
        .course-table tbody tr:last-child td { border-bottom: 0 !important; }
        .doc-btn-group { display: flex; flex-direction: column; gap: 8px; }
        .doc-view-btn { display: inline-flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: 1px solid transparent; width: 100%; min-width: 160px; }
        .doc-view-btn.syllabus { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
        .doc-view-btn.syllabus:hover { background: #2563eb; color: #fff; }
        .doc-view-btn.material { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
        .doc-view-btn.material:hover { background: #16a34a; color: #fff; }
        .doc-view-btn .count-badge { background: rgba(0,0,0,0.1); padding: 2px 7px; border-radius: 12px; font-size: 11px; }
        .doc-view-btn:hover .count-badge { background: rgba(255,255,255,0.25); }
        .no-doc-text { color: #94a3b8; font-size: 12px; font-style: italic; }
        .apply-action-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .book-price-tag { font-size: 14px; font-weight: 800; color: #16a34a; background: #f0fdf4; padding: 4px 10px; border-radius: 6px; border: 1px dashed #22c55e; white-space: nowrap; }
        .apply-books-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; font-size: 12.5px; font-weight: 700; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 15px rgba(34,197,94,.2); transition: all 0.3s ease; white-space: nowrap; }
        .apply-books-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,197,94,.4); }

        /* MODAL CSS */
        .custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 15px; }
        .custom-modal-content { background: #fff; border-radius: 16px; width: 100%; max-width: 850px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: modalScaleIn 0.2s ease-out; overflow: hidden; }
        @keyframes modalScaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .custom-modal-header { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; flex-shrink: 0; }
        .custom-modal-close { background: #fee2e2; border: 1px solid #fca5a5; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ef4444; cursor: pointer; transition: all 0.2s; padding: 0; }
        .custom-modal-close:hover { background: #ef4444; color: #ffffff; transform: rotate(90deg) scale(1.1); }
        .custom-modal-body { padding: 20px; overflow-y: auto; }
        .custom-modal-footer { padding: 15px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc; display: flex; justify-content: flex-end; flex-shrink: 0; }
        .modal-bottom-close-btn { padding: 10px 24px; background: #64748b; color: #fff; font-size: 14px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
        .modal-bottom-close-btn:hover { background: #334155; }

        /* APPLY FORM CSS */
        .apply-form-group { margin-bottom: 16px; }
        .apply-form-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .apply-form-group input, .apply-form-group textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; outline: none; transition: all 0.2s; background: #f8fafc; }
        .apply-form-group input:focus, .apply-form-group textarea:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }
        .apply-form-group input[readonly] { background: #e2e8f0; color: #64748b; cursor: not-allowed; }
        
        .apply-submit-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; font-size: 15px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .apply-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,197,94,.4); }
        .apply-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        /* Success Message CSS */
        .apply-success-box { text-align: center; padding: 40px 20px; }
        .apply-success-icon { width: 70px; height: 70px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .apply-success-box h4 { font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
        .apply-success-box p { font-size: 14px; color: #64748b; margin-bottom: 24px; }

        @media (max-width: 768px) {
          .custom-modal-overlay { padding: 10px; }
          .custom-modal-content { max-height: 95vh; border-radius: 12px; }
          .custom-modal-body { padding: 15px; }
        }
      `}</style>

      <div className="cstack">
        <div className="cstack-inner">
          <div className="cstack-back" onClick={() => navigate(-1)}>
            <i className="fa fa-arrow-left"></i> Back
          </div>

          <div className="cstack-hero">
            <h1 className="cstack-title">{mainCourse.name}</h1>
            <div className="cstack-meta">
              {mainCourse.code && <div className="cstack-chip">Code: {mainCourse.code}</div>}
              {mainCourse.eligbilty && <div className="cstack-chip">Eligibility: {mainCourse.eligbilty}</div>}
            </div>
          </div>

          <div className="cstack-card">
            <div className="table-responsive">
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Apply for Book's</th>
                    <th>Syllabus & Material</th>
                    <th>Year / Class</th>
                    <th>Course Name</th>
                    <th>Duration</th>
                    <th>Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, index) => {
                    const allDocs = (c.productCategoryDocuments || []).filter(d => d.fileupload);
                    const syllabusDocs = allDocs.filter(d => Number(d.documentTypeId) === 145);
                    const materialDocs = allDocs.filter(d => Number(d.documentTypeId) === 118);

                    const bookPriceObj = (c.productAmounts || []).find(pa => pa.name === "BOOK PRICE" || pa.amountTypeId === 1152);
                    const bookPrice = bookPriceObj ? bookPriceObj.amount : 0;

                    return (
                      <tr key={c.id || index}>
                        <td>
                          <div className="apply-action-wrap">
                            <button
                              className="apply-books-btn"
                              onClick={() => openApplyModal(c, bookPrice)}
                            >
                              <i className="fa fa-book"></i> Apply {bookPrice > 0 && (
                                <div className="book-price-tag">₹{bookPrice}</div>
                              )}
                            </button>

                          </div>
                        </td>

                        <td>
                          <div className="doc-btn-group">
                            {syllabusDocs.length > 0 ? (
                              <button className="doc-view-btn syllabus" onClick={() => openModal(syllabusDocs, "Syllabus Files")}>
                                <span><i className="fa fa-file-pdf-o me-2"></i> Syllabus</span>
                                <span className="count-badge">{syllabusDocs.length}</span>
                              </button>
                            ) : (
                              <span className="no-doc-text">No Syllabus</span>
                            )}

                            {materialDocs.length > 0 ? (
                              <button className="doc-view-btn material" onClick={() => openModal(materialDocs, "Material Files")}>
                                <span><i className="fa fa-file-pdf-o me-2"></i> Material</span>
                                <span className="count-badge">{materialDocs.length}</span>
                              </button>
                            ) : (
                              <span className="no-doc-text">No Material</span>
                            )}
                          </div>
                        </td>

                        <td style={{ fontWeight: "700", color: "#6366f1" }}>
                          {c.classNo ? `${c.classNo}${c.classNo === 1 ? 'st' : c.classNo === 2 ? 'nd' : 'rd'} Year` : `Year ${index + 1}`}
                        </td>
                        <td style={{ fontWeight: "600", color: "#212529" }}>({c.code || "-"}) {c.name}</td>
                        <td>{c.durationName || "-"}</td>
                        <td>{c.eligbilty || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FILES MODAL */}
      {isModalOpen && (
        <div className="custom-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                <i className="fa fa-folder-open text-primary me-2"></i> {modalTitle}
              </h4>
              <button className="custom-modal-close" onClick={() => setIsModalOpen(false)} title="Close Modal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="custom-modal-body">
              <div className="row g-3">
                {modalFiles.map((file, idx) => {
                  const bookName = file.name || "Untitled Document";
                  const physicalName = getFileName(file.fileupload);

                  return (
                    <div className="col-12 col-md-4" key={idx}>
                      <a href={getFileUrl(file.fileupload)} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', backgroundColor: '#fff', height: '100%', minHeight: '200px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" style={{ width: '40px', height: '40px' }}>
                            <path d="M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM13 11H18V9H13V11ZM13 15H18V13H13V15ZM13 7H18V5H13V7ZM9 5V15L14 10L9 5Z" />
                          </svg>
                        </div>
                        <div style={{ padding: '15px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0', lineHeight: '1.3', textTransform: 'uppercase', display: 'block', width: '100%' }}>{bookName}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748b', margin: 0, lineHeight: '1.3', wordBreak: 'break-word', display: 'block', width: '100%' }}>{physicalName}</div>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="custom-modal-footer">
              <button className="modal-bottom-close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 👇 APPLY FORM & PAYMENT MODAL 👇 */}
      {isApplyModalOpen && selectedCourse && (
        <div className="custom-modal-overlay" onClick={() => !isApplying && setIsApplyModalOpen(false)}>
          <div className="custom-modal-content" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>

            <div className="custom-modal-header">
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                <i className="fa fa-book text-success me-2"></i> Apply for Books
              </h4>
              {!isApplying && (
                <button className="custom-modal-close" onClick={() => setIsApplyModalOpen(false)} title="Close Modal">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="custom-modal-body">
              {/* 👇 Payment Result Screen 👇 */}
              {paymentResult ? (
                <div className="apply-success-box">
                  <div className="apply-success-icon" style={{
                    background: paymentResult.success ? "#dcfce7" : "#fee2e2",
                    color: paymentResult.success ? "#16a34a" : "#ef4444"
                  }}>
                    {paymentResult.success ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                    )}
                  </div>
                  <h4>{paymentResult.success ? "Payment Successful!" : "Payment Failed"}</h4>
                  <p>{paymentResult.message}</p>
                  {paymentResult.success && (
                    <div style={{ background: "#f0fdf4", padding: "10px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #bbf7d0" }}>
                      <p style={{ margin: 0, fontSize: "13px", color: "#065f46", fontWeight: "bold" }}>Order ID: {paymentResult.orderId}</p>
                    </div>
                  )}
                  <button className="apply-submit-btn" onClick={() => setIsApplyModalOpen(false)}>Close Window</button>
                </div>
              ) : (
                /* 👇 Form Screen 👇 */
                <form onSubmit={handleApplySubmit}>

                  <div className="apply-form-group">
                    <label>User ID</label>
                    <input type="text" value={userId} readOnly />
                  </div>

                  <div className="apply-form-group">
                    <label>Course Name & ID</label>
                    <input type="text" value={`(${selectedCourse.id}) ${selectedCourse.name}`} readOnly />
                  </div>

                  <div className="apply-form-group">
                    <label>Book Amount</label>
                    <input type="text" value={`₹${selectedCourse.bookPrice}`} readOnly style={{ fontWeight: 'bold', color: '#16a34a' }} />
                  </div>

                  <div className="apply-form-group">
                    <label>Delivery Address <span style={{ color: 'red' }}>*</span></label>
                    <textarea
                      rows="3"
                      placeholder="Enter your full address with pincode..."
                      value={applyForm.address}
                      onChange={(e) => setApplyForm({ ...applyForm, address: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="apply-form-group">
                    <label>Message (Optional)</label>
                    <textarea
                      rows="2"
                      placeholder="Any special instructions..."
                      value={applyForm.message}
                      onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="apply-submit-btn" disabled={isApplying}>
                    {isApplying ? (
                      <><span className="spinner-border spinner-border-sm"></span> Processing...</>
                    ) : (
                      <><i className="fa fa-lock"></i> Pay ₹{selectedCourse.bookPrice} & Submit</>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default CourseDetails;