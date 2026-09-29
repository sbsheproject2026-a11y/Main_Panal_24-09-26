 import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getEmployeeById } from "../../AllServicesFiles/EmployeeService";

const AddressPrint = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const loginUserId = String(localStorage.getItem("UserId") || 0).trim();
    const fallbackName = localStorage.getItem("name") || "User";

    const data = location.state?.printData || {};

    // ✅ Employee info
    const [employee, setEmployee] = useState({
        name: "",
        whatsAppNo: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loginUserId && loginUserId !== "0") {
            loadEmployee(loginUserId);
        }
        // eslint-disable-next-line
    }, [loginUserId]);

    const loadEmployee = async (id) => {
        try {
            setLoading(true);

            const result = await getEmployeeById(id);

            console.log("EMPLOYEE RESPONSE:", result);

            const emp = result?.data || result || {};

            setEmployee({
                name:
                    emp?.name ||
                    emp?.Name ||
                    emp?.fullName ||
                    fallbackName ||
                    "",
                whatsAppNo:
                    emp?.whatsAppNo ||
                    emp?.whatsappNo ||
                    emp?.WhatsAppNo ||
                    emp?.mobileNo ||
                    emp?.MobileNo ||
                    emp?.contactNo ||
                    "",
            });
        } catch (error) {
            console.log("Employee load error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => window.print();

    const formatLocation = () => {
        const parts = [];

        if (data.cityName) parts.push(data.cityName);

        if (data.districtName && data.districtName !== data.cityName) {
            parts.push(data.districtName);
        }

        if (data.stateName) parts.push(data.stateName);

        let location = parts.join(", ");

        if (data.pincode) location += ` - ${data.pincode}`;

        return location || "-";
    };

    return (
        <>
            <style>{`
                /* =========================================================
                   SCREEN VIEW
                   ========================================================= */
                .print-wrapper {
                    padding: 20px;
                    background: #eef2f7;
                    min-height: 100vh;
                }

                .print-btn {
                    background: #489419;
                    color: #fff;
                    border: none;
                    padding: 12px 30px;
                    font-size: 15px;
                    font-weight: 600;
                    border-radius: 10px;
                    cursor: pointer;
                    margin-bottom: 20px;
                }

                .label-box {
                    width: 100%;
                    max-width: 820px;
                    margin: 0 auto;
                    background: #fff;
                    border: 3px solid #1e3c72;
                    border-radius: 14px;
                    overflow: hidden;
                }

                .label-content {
                    padding: 22px;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .section {
                    border: 2px solid #1e3c72;
                    border-radius: 10px;
                    padding: 14px 16px;
                    background: #fbfcfe;
                    box-sizing: border-box;
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

                .section-title .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }

                .to-section {
                    width: 62%;
                    border-color: #1e3c72;
                }
                .to-section .section-title {
                    color: #1e3c72;
                    border-bottom-color: #c7d4e8;
                }
                .to-section .section-title .dot {
                    background: #1e3c72;
                }

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
                    background: #218838;
                }

                .field-row {
                    display: flex;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                .field-row:last-child { margin-bottom: 0; }

                .field-label {
                    width: 120px;
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
                    word-break: break-word;
                }

                .footer-note {
                    text-align: center;
                    font-size: 11px;
                    color: #6c757d;
                    padding: 10px;
                }

                /* =========================================================
                   ✅ PRINT SETTINGS — FORCE NO HEADERS
                   ========================================================= */
                @media print {

                    /* ✅ Force all page margins to 0 — headers ki jagah nahi */
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    @page :first {
                        margin: 0;
                    }

                    @page :left {
                        margin: 0;
                    }

                    @page :right {
                        margin: 0;
                    }

                    /* ✅ Sab kuch hide */
                    body * {
                        visibility: hidden !important;
                    }

                    /* ✅ Sirf label dikhe */
                    .label-box,
                    .label-box * {
                        visibility: visible !important;
                    }

                    /* ✅ Label — top-left pe */
                    .label-box {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 10mm !important;
                        box-sizing: border-box !important;
                        border: 2px solid #1e3c72 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        page-break-inside: avoid !important;
                        page-break-after: avoid !important;
                        page-break-before: avoid !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    /* ✅ HTML & Body reset */
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        overflow: hidden !important;
                        background: #fff !important;
                    }

                    .print-wrapper {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: #fff !important;
                        min-height: 0 !important;
                        display: block !important;
                        overflow: hidden !important;
                    }

                    /* ✅ Buttons hide */
                    .no-print {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    /* ✅ Colors print me */
                    .label-header,
                    .section {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            <div className="print-wrapper">
                {/* Buttons */}
                <div className="text-center mb-3 no-print">
                    <button className="print-btn" onClick={handlePrint}>
                        🖨️ Print Address
                    </button>
                    <button
                        className="print-btn ms-2"
                        style={{ background: "#1e3c72" }}
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                </div>

                {/* Label */}
                <div className="label-box">
                    <div className="label-content">

                        {/* ==================== TO (Receiver) ==================== */}
                        <div className="section to-section">
                            <div className="section-title">
                                <span className="dot"></span>
                                TO (Receiver)
                            </div>

                            <div className="field-row">
                                <span className="field-label">Name:</span>
                                <span className="field-value">{data.name || "-"}</span>
                            </div>

                            <div className="field-row">
                                <span className="field-label">Owner Name:</span>
                                <span className="field-value">
                                    {data.fatherName || "-"}
                                </span>
                            </div>

                            <div className="field-row">
                                <span className="field-label">Mobile:</span>
                                <span className="field-value">{data.mobileNo || "-"}</span>
                            </div>

                            <div className="field-row">
                                <span className="field-label">Address:</span>
                                <span className="field-value">{data.address || "-"}</span>
                            </div>

                            <div className="field-row">
                                <span className="field-label">City/State:</span>
                                <span className="field-value">{formatLocation()}</span>
                            </div>
                        </div>

                        {/* ==================== FROM (Sender) ==================== */}
                        <div className="section from-section">
                            <div className="section-title">
                                <span className="dot"></span>
                                FROM (Sender)
                            </div>

                            <div className="field-row">
                                <span className="field-label">Room:</span>
                                <span className="field-value">
                                    Shaheed Bhagat Singh Health &amp; Education
                                </span>
                            </div>

                            <div className="field-row">
                                <span className="field-label">Name:</span>
                                <span className="field-value">
                                    {loading ? "Loading..." : (employee.name || fallbackName)}
                                </span>
                            </div>

                            <div className="field-row">
                                <span className="field-label">Contact:</span>
                                <span className="field-value">
                                    {loading ? "Loading..." : (employee.whatsAppNo || "-")}
                                </span>
                            </div>
                        </div>

                    </div>

                    <div className="footer-note">
                        This is a computer generated address label.
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddressPrint;