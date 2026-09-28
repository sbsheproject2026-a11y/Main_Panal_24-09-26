 import React, { useState } from "react";

function NeedHelp() {
    const [openFaq, setOpenFaq] = useState(0);

    const faqs = [
        {
            question: "How can I login to the SBSHE Panel?",
            answer:
                "Enter your registered username and password on the login page and click the Login button. After successful authentication, you will be redirected to your dashboard."
        },
        {
            question: "I forgot my password. What should I do?",
            answer:
                "If you have forgotten your password, please contact your administrator or system support team. They can verify your account and help you reset your password."
        },
        {
            question: "Why can't I see some menu options?",
            answer:
                "The available menus depend on your assigned Role ID and account permissions. If a required menu is not visible, please contact your administrator."
        },
        {
            question: "Why am I getting an Unauthorized message?",
            answer:
                "This normally means your account does not have permission to access the selected page or feature. Contact your administrator if you believe you should have access."
        },
        {
            question: "How can I check my profile information?",
            answer:
                "Click your name or profile icon from the top-right corner of the dashboard and select My Profile. Your account information will be displayed there."
        },
        {
            question: "How can I logout from the system?",
            answer:
                "Click your profile icon in the top-right corner and select Sign Out. Your current login session will be cleared and you will be redirected to the login page."
        },
        {
            question: "What should I do if the page is not loading?",
            answer:
                "First check your internet connection and refresh the page. If the problem continues, sign out and login again. You can contact technical support if the issue persists."
        },
        {
            question: "Who should I contact for technical problems?",
            answer:
                "For technical problems, account issues, permissions, or other system-related concerns, please contact the SBSHE technical support team."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleEmail = () => {
        window.location.href =
            "mailto:shaheedbhagatsinghhealthandedu@gmail.com";
    };

    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <div className="container-fluid py-4">

            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex align-items-center">
                        <div
                            className="d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "14px",
                                background: "#fff1e8",
                                color: "#f58634",
                                fontSize: "24px"
                            }}
                        >
                            <i className="bi bi-question-circle-fill"></i>
                        </div>

                        <div>
                            <h4 className="fw-bold mb-1">
                                Need Help?
                            </h4>

                            <p className="text-muted mb-0">
                                Find answers, troubleshooting tips and contact support
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">

                <div className="col-lg-4 col-md-6">
                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "18px" }}
                    >
                        <div className="card-body p-4">

                            <div
                                className="d-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: "58px",
                                    height: "58px",
                                    borderRadius: "15px",
                                    background: "#fff1e8",
                                    color: "#f58634",
                                    fontSize: "25px"
                                }}
                            >
                                <i className="bi bi-book"></i>
                            </div>

                            <h5 className="fw-bold mb-2">
                                Help Center
                            </h5>

                            <p className="text-muted mb-0">
                                Find answers to common questions and learn
                                how to use the SBSHE Panel.
                            </p>

                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6">
                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "18px" }}
                    >
                        <div className="card-body p-4">

                            <div
                                className="d-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: "58px",
                                    height: "58px",
                                    borderRadius: "15px",
                                    background: "#eaf7ef",
                                    color: "#198754",
                                    fontSize: "25px"
                                }}
                            >
                                <i className="bi bi-headset"></i>
                            </div>

                            <h5 className="fw-bold mb-2">
                                Technical Support
                            </h5>

                            <p className="text-muted mb-0">
                                Facing a technical issue? Our support team
                                can help you resolve system problems.
                            </p>

                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6">
                    <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "18px" }}
                    >
                        <div className="card-body p-4">

                            <div
                                className="d-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: "58px",
                                    height: "58px",
                                    borderRadius: "15px",
                                    background: "#eef4ff",
                                    color: "#0d6efd",
                                    fontSize: "25px"
                                }}
                            >
                                <i className="bi bi-shield-check"></i>
                            </div>

                            <h5 className="fw-bold mb-2">
                                Account Support
                            </h5>

                            <p className="text-muted mb-0">
                                Need help with your account, role,
                                permissions or login?
                            </p>

                        </div>
                    </div>
                </div>

            </div>

            <div className="row g-4">

                <div className="col-lg-8">

                    <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius: "18px" }}
                    >
                        <div className="card-body p-4">

                            <div className="d-flex align-items-center mb-4">

                                <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "46px",
                                        height: "46px",
                                        borderRadius: "12px",
                                        background: "#fff1e8",
                                        color: "#f58634"
                                    }}
                                >
                                    <i className="bi bi-patch-question-fill fs-5"></i>
                                </div>

                                <div>
                                    <h5 className="fw-bold mb-1">
                                        Frequently Asked Questions
                                    </h5>

                                    <p className="text-muted mb-0">
                                        Quick answers to common questions
                                    </p>
                                </div>

                            </div>

                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border rounded-3 mb-3"
                                    style={{ overflow: "hidden" }}
                                >

                                    <button
                                        type="button"
                                        className="btn w-100 d-flex justify-content-between align-items-center text-start"
                                        onClick={() => toggleFaq(index)}
                                        style={{
                                            padding: "17px 18px",
                                            background:
                                                openFaq === index
                                                    ? "#fff7f2"
                                                    : "#ffffff",
                                            color: "#212529",
                                            fontWeight: "600",
                                            border: "none"
                                        }}
                                    >
                                        <span>{faq.question}</span>

                                        <i
                                            className={`bi ${
                                                openFaq === index
                                                    ? "bi-chevron-up"
                                                    : "bi-chevron-down"
                                            }`}
                                            style={{
                                                color: "#f58634",
                                                fontSize: "14px"
                                            }}
                                        ></i>
                                    </button>

                                    {openFaq === index && (
                                        <div
                                            className="px-3 pb-3 text-muted"
                                            style={{
                                                lineHeight: "1.7",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {faq.answer}
                                        </div>
                                    )}

                                </div>
                            ))}

                        </div>
                    </div>

                </div>

                <div className="col-lg-4">

                    <div
                        className="card border-0 shadow-sm mb-4"
                        style={{
                            borderRadius: "18px",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            className="card-body p-4"
                            style={{
                                background:
                                    "linear-gradient(135deg, #f58634 0%, #ff9f5a 100%)"
                            }}
                        >

                            <div
                                className="d-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: "58px",
                                    height: "58px",
                                    borderRadius: "15px",
                                    background: "rgba(255,255,255,0.2)",
                                    color: "#fff",
                                    fontSize: "25px"
                                }}
                            >
                                <i className="bi bi-headset"></i>
                            </div>

                            <h5 className="fw-bold text-white mb-2">
                                Still Need Help?
                            </h5>

                            <p className="text-white mb-4">
                                If you cannot find the solution in our
                                FAQ section, contact our support team.
                            </p>

                            <button
                                type="button"
                                className="btn btn-light w-100 mb-2"
                                onClick={handleEmail}
                                style={{
                                    color: "#f58634",
                                    fontWeight: "600",
                                    borderRadius: "10px",
                                    padding: "11px"
                                }}
                            >
                                <i className="bi bi-envelope me-2"></i>
                                Email Support
                            </button>

                            <button
                                type="button"
                                className="btn w-100 text-white mb-2"
                                onClick={() => handleCall("7082013213")}
                                style={{
                                    background: "rgba(255,255,255,0.18)",
                                    border:
                                        "1px solid rgba(255,255,255,0.4)",
                                    borderRadius: "10px",
                                    padding: "11px",
                                    fontWeight: "600"
                                }}
                            >
                                <i className="bi bi-telephone me-2"></i>
                                Call 7082013213
                            </button>

                            <button
                                type="button"
                                className="btn w-100 text-white"
                                onClick={() => handleCall("7082013215")}
                                style={{
                                    background: "rgba(255,255,255,0.18)",
                                    border:
                                        "1px solid rgba(255,255,255,0.4)",
                                    borderRadius: "10px",
                                    padding: "11px",
                                    fontWeight: "600"
                                }}
                            >
                                <i className="bi bi-telephone me-2"></i>
                                Call 7082013215
                            </button>

                        </div>
                    </div>

                    <div
                        className="card border-0 shadow-sm mb-4"
                        style={{ borderRadius: "18px" }}
                    >
                        <div className="card-body p-4">

                            <h6 className="fw-bold mb-4">
                                Support Information
                            </h6>

                            <div className="d-flex align-items-start mb-4">

                                <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        minWidth: "40px",
                                        borderRadius: "10px",
                                        background: "#fff1e8",
                                        color: "#f58634"
                                    }}
                                >
                                    <i className="bi bi-envelope"></i>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        Email
                                    </small>

                                    <div
                                        className="fw-semibold"
                                        style={{
                                            wordBreak: "break-word"
                                        }}
                                    >
                                        shaheedbhagatsinghhealthandedu@gmail.com
                                    </div>
                                </div>

                            </div>

                            <div className="d-flex align-items-start mb-4">

                                <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        minWidth: "40px",
                                        borderRadius: "10px",
                                        background: "#fff1e8",
                                        color: "#f58634"
                                    }}
                                >
                                    <i className="bi bi-telephone"></i>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        Contact Number
                                    </small>

                                    <div className="fw-semibold">
                                        7082013213
                                    </div>

                                    <div className="fw-semibold">
                                        7082013215
                                    </div>
                                </div>

                            </div>

                            <div className="d-flex align-items-start">

                                <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        minWidth: "40px",
                                        borderRadius: "10px",
                                        background: "#fff1e8",
                                        color: "#f58634"
                                    }}
                                >
                                    <i className="bi bi-clock"></i>
                                </div>

                                <div>
                                    <small className="text-muted">
                                        Support Hours
                                    </small>

                                    <div className="fw-semibold">
                                        Monday - Saturday
                                    </div>

                                    <small className="text-muted">
                                        10:00 AM - 6:00 PM
                                    </small>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius: "18px" }}
                    >
                        <div className="card-body p-4">

                            <h6 className="fw-bold mb-3">
                                Quick Troubleshooting
                            </h6>

                            <div className="d-flex align-items-start mb-3">
                                <i
                                    className="bi bi-check-circle-fill me-2"
                                    style={{ color: "#198754" }}
                                ></i>

                                <span className="text-muted">
                                    Check your internet connection
                                </span>
                            </div>

                            <div className="d-flex align-items-start mb-3">
                                <i
                                    className="bi bi-check-circle-fill me-2"
                                    style={{ color: "#198754" }}
                                ></i>

                                <span className="text-muted">
                                    Refresh the current page
                                </span>
                            </div>

                            <div className="d-flex align-items-start mb-3">
                                <i
                                    className="bi bi-check-circle-fill me-2"
                                    style={{ color: "#198754" }}
                                ></i>

                                <span className="text-muted">
                                    Logout and login again
                                </span>
                            </div>

                            <div className="d-flex align-items-start">
                                <i
                                    className="bi bi-check-circle-fill me-2"
                                    style={{ color: "#198754" }}
                                ></i>

                                <span className="text-muted">
                                    Contact administrator if the problem
                                    continues
                                </span>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-12">

                    <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius: "18px" }}
                    >
                        <div className="card-body p-4">

                            <div className="row align-items-center">

                                <div className="col-md-8">

                                    <div className="d-flex align-items-center">

                                        <div
                                            className="d-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "13px",
                                                background: "#fff1e8",
                                                color: "#f58634"
                                            }}
                                        >
                                            <i className="bi bi-info-circle fs-5"></i>
                                        </div>

                                        <div>
                                            <h6 className="fw-bold mb-1">
                                                SBSHE Panel Support
                                            </h6>

                                            <p className="text-muted mb-0">
                                                For account, technical and
                                                permission-related issues,
                                                please contact our support
                                                team.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <div className="col-md-4 text-md-end mt-3 mt-md-0">

                                    <button
                                        type="button"
                                        className="btn text-white px-4"
                                        onClick={handleEmail}
                                        style={{
                                            background: "#f58634",
                                            borderRadius: "10px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        <i className="bi bi-envelope me-2"></i>
                                        Contact Us
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default NeedHelp;
