import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
    const location = useLocation();


    // Submit page se bheja hua data
    const {   printmsg  } = location.state || {};
    return (
        <>
            <div className="acc-success-page">

                <div className="acc-success-card">

                    {/* Logo */}
                    <div className="acc-success-logo">
                        <img
                            src="/assets/img/websheddlogo.png"
                            alt="SBSHE"
                        />
                    </div>

                    {/* Success Icon */}
                    <div className="success-icon-wrapper">
                        <div className="success-icon">
                            <i className="bi bi-check-lg"></i>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="success-content">

                        <div className="success-badge">
                            <i className="bi bi-check-circle-fill"></i>
                            Registration Successful
                        </div>

                        <h1>
                            Thank You for Registering!
                        </h1>



                        <p className="success-sub-description">
                            Our team will review your details and contact you
                            shortly regarding the next steps.
                        </p>

                    </div>

                    {/* Reference Box */}
                    <div className="reference-box">

                   

                        <div className="reference-content">

                            <strong style={{ whiteSpace: "pre-line" }}> {printmsg ||
                                "Your Admission Consultant registration request has been submitted successfully."}</strong>
                        </div>



                    </div>



                    {/* Buttons */}
                    <div className="success-actions">

                        <button
                            type="button"
                            className="primary-btn"
                            onClick={() => window.location.href = "/"}
                        >
                            <i className="bi bi-house-fill"></i>
                            Go to Home
                        </button>

                        {/* <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => window.print()}
                        >
                            <i className="bi bi-printer-fill"></i>
                            Print
                        </button> */}

                    </div>

                    {/* Footer */}
                    <div className="success-footer">

                        <i className="bi bi-shield-check"></i>

                        <span>
                            Your information is safe and secure with us.
                        </span>

                    </div>

                </div>

            </div>


            <style>{`

                * {
                    box-sizing: border-box;
                }

                /* =========================================
                   PAGE
                ========================================= */

                .acc-success-page {
                    min-height: 100vh;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 40px 15px;

                    background:
                        radial-gradient(
                            circle at 10% 10%,
                            rgba(255, 102, 0, 0.08),
                            transparent 30%
                        ),
                        radial-gradient(
                            circle at 90% 90%,
                            rgba(0, 102, 204, 0.07),
                            transparent 30%
                        ),
                        #f5f7fb;
                }


                /* =========================================
                   CARD
                ========================================= */

                .acc-success-card {
                    width: 100%;
                    max-width: 600px;

                    padding: 35px 40px 30px;

                    background: #ffffff;

                    border-radius: 24px;

                    border: 1px solid #e9edf3;

                    box-shadow:
                        0 25px 70px rgba(20, 30, 50, 0.10);

                    text-align: center;

                    position: relative;

                    overflow: hidden;
                }


                .acc-success-card::before {
                    content: "";

                    position: absolute;

                    top: 0;
                    left: 0;
                    right: 0;

                    height: 5px;

                    background:
                        linear-gradient(
                            90deg,
                            #ff6600,
                            #ff8500,
                            #ff6600
                        );
                }


                /* =========================================
                   LOGO
                ========================================= */

                .acc-success-logo {
                    width: 210px;
                    height: 70px;

                    margin: 0 auto 20px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #ffffff;

                    border-radius: 14px;

                    border: 1px solid #f0f1f4;

                    box-shadow:
                        0 5px 20px rgba(20, 30, 50, 0.06);
                }


                .acc-success-logo img {
                    width: 175px;
                    max-height: 55px;

                    object-fit: contain;

                    display: block;
                }


                /* =========================================
                   SUCCESS ICON
                ========================================= */

                .success-icon-wrapper {
                    display: flex;

                    align-items: center;
                    justify-content: center;

                    margin: 5px auto 18px;
                }


                .success-icon {
                    width: 82px;
                    height: 82px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    border-radius: 50%;

                    background:
                        linear-gradient(
                            135deg,
                            #22c55e,
                            #16a34a
                        );

                    color: #ffffff;

                    font-size: 42px;

                    box-shadow:
                        0 12px 30px rgba(22, 163, 74, 0.25);

                    position: relative;
                }


                .success-icon::after {
                    content: "";

                    position: absolute;

                    inset: -8px;

                    border-radius: 50%;

                    border: 1px solid rgba(34, 197, 94, 0.20);
                }


                /* =========================================
                   BADGE
                ========================================= */

                .success-badge {
                    display: inline-flex;

                    align-items: center;

                    gap: 6px;

                    padding: 7px 13px;

                    margin-bottom: 12px;

                    border-radius: 50px;

                    background: #ecfdf3;

                    border: 1px solid #bbf7d0;

                    color: #15803d;

                    font-size: 11px;

                    font-weight: 700;
                }


                /* =========================================
                   CONTENT
                ========================================= */

                .success-content h1 {
                    margin: 0 0 10px;

                    color: #1f2937;

                    font-size: 28px;

                    font-weight: 800;
                }


                .success-description {
                    max-width: 480px;

                    margin: 0 auto 7px;

                    color: #4b5563;

                    font-size: 14px;

                    line-height: 1.7;
                }


                .success-sub-description {
                    max-width: 470px;

                    margin: 0 auto;

                    color: #929baa;

                    font-size: 11px;

                    line-height: 1.7;
                }


                /* =========================================
                   REFERENCE BOX
                ========================================= */

                .reference-box {
                    margin-top: 12px;

                    padding: 13px 10px;

                    display: flex;

                    align-items: center;

                    gap: 12px;

                    text-align: left;

                    background: #fff8f3;

                    border: 1px solid #ffe0cc;

                    border-radius: 12px;
                }


                 


                .reference-content {
                    flex: 1;
                }


                .reference-content span {
                    display: block;

                    margin-bottom: 3px;

                    color: #929baa;

                    font-size: 9px;

                    font-weight: 600;
                }


                .reference-content strong {
                    color: #374151;

                    font-size: 15px;

                    letter-spacing: 0.5px;
                }


                .copy-btn {
                    width: 35px;
                    height: 35px;

                    border: none;

                    border-radius: 8px;

                    background: #ffffff;

                    color: #ff6600;

                    cursor: pointer;

                    transition: all 0.2s ease;
                }


                .copy-btn:hover {
                    background: #ff6600;

                    color: #ffffff;
                }


                /* =========================================
                   NEXT STEP
                ========================================= */

                .next-step-box {
                    margin-top: 15px;

                    padding: 13px 15px;

                    display: flex;

                    align-items: flex-start;

                    gap: 11px;

                    text-align: left;

                    background: #f8fafc;

                    border: 1px solid #edf0f4;

                    border-radius: 12px;
                }


                .next-step-icon {
                    width: 32px;
                    height: 32px;

                    min-width: 32px;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    border-radius: 8px;

                    background: #eaf3ff;

                    color: #0066cc;

                    font-size: 14px;
                }


                .next-step-box strong {
                    display: block;

                    color: #374151;

                    font-size: 11px;

                    margin-bottom: 3px;
                }


                .next-step-box p {
                    margin: 0;

                    color: #8b95a5;

                    font-size: 10px;

                    line-height: 1.6;
                }


                /* =========================================
                   BUTTONS
                ========================================= */

                .success-actions {
                    display: flex;

                    justify-content: center;

                    gap: 10px;

                    margin-top: 24px;
                }


                .primary-btn,
                .secondary-btn {
                    height: 45px;

                    padding: 0 22px;

                    display: inline-flex;

                    align-items: center;
                    justify-content: center;

                    gap: 8px;

                    border-radius: 9px;

                    font-size: 12px;

                    font-weight: 700;

                    cursor: pointer;

                    transition: all 0.25s ease;
                }


                .primary-btn {
                    border: none;

                    color: #ffffff;

                    background:
                        linear-gradient(
                            135deg,
                            #ff6600,
                            #e65300
                        );

                    box-shadow:
                        0 7px 18px rgba(255,102,0,0.22);
                }


                .primary-btn:hover {
                    transform: translateY(-2px);

                    box-shadow:
                        0 10px 23px rgba(255,102,0,0.30);
                }


                .secondary-btn {
                    border: 1px solid #dfe4eb;

                    background: #ffffff;

                    color: #4b5563;
                }


                .secondary-btn:hover {
                    border-color: #ff6600;

                    color: #ff6600;

                    background: #fff8f3;
                }


                /* =========================================
                   FOOTER
                ========================================= */

                .success-footer {
                    display: flex;

                    align-items: center;
                    justify-content: center;

                    gap: 5px;

                    margin-top: 22px;
                    padding-top: 18px;

                    border-top: 1px solid #edf0f4;

                    color: #9ca3af;

                    font-size: 9px;
                }


                .success-footer i {
                    color: #16a34a;

                    font-size: 12px;
                }


                /* =========================================
                   MOBILE
                ========================================= */

                @media (max-width: 600px) {

                    .acc-success-page {
                        padding: 25px 12px;
                    }


                    .acc-success-card {
                        padding: 28px 18px 22px;

                        border-radius: 19px;
                    }


                    .acc-success-logo {
                        width: 185px;
                        height: 62px;
                    }


                    .acc-success-logo img {
                        width: 155px;
                    }


                    .success-icon {
                        width: 70px;
                        height: 70px;

                        font-size: 34px;
                    }


                    .success-content h1 {
                        font-size: 22px;
                    }


                    .success-description {
                        font-size: 12px;
                    }


                    .success-sub-description {
                        font-size: 10px;
                    }


                    .reference-box {
                        padding: 11px;
                    }


                    .reference-content strong {
                        font-size: 13px;
                    }


                    .success-actions {
                        flex-direction: column;
                    }


                    .primary-btn,
                    .secondary-btn {
                        width: 100%;
                    }

                }

            `}</style>
        </>
    );
};

export default Success;
