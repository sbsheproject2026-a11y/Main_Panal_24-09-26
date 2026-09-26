 import React, { useState } from "react";

const ExpertQuery = () => {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        queryType: "",
        course: "",
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mobile" && !/^\d{0,10}$/.test(value)) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.mobile.length !== 10) {
            alert("Please enter a valid 10 digit mobile number.");
            return;
        }

        console.log(formData);
        alert("Your query has been submitted successfully.");

        setFormData({
            name: "",
            mobile: "",
            email: "",
            queryType: "",
            course: "",
            message: ""
        });
    };

    return (
        <section className="expert-section">
            <div className="container">

                <div className="expert-wrapper">

                    {/* LEFT SIDE */}
                    <div className="expert-left">

                        <div className="expert-label">
                            <span>
                                <i className="fas fa-headset"></i>
                            </span>
                            CAREER GUIDANCE
                        </div>

                        <h2>
                            Confused About
                            <br />
                            <span>Your Career?</span>
                        </h2>

                        <p className="expert-description">
                            Choosing the right course and career path can be
                            confusing. Our experts are here to understand your
                            goals and help you make the right decision.
                        </p>

                        <div className="expert-highlight">
                            <div className="expert-highlight-icon">
                                <i className="fas fa-user-tie"></i>
                            </div>

                            <div>
                                <strong>Talk to Our Experts</strong>
                                <p>
                                    Get personalised guidance for your career.
                                </p>
                            </div>
                        </div>

                        <div className="expert-features">

                            <div className="expert-feature">
                                <div>
                                    <i className="fas fa-check"></i>
                                </div>
                                <span>Free Career Counselling</span>
                            </div>

                            <div className="expert-feature">
                                <div>
                                    <i className="fas fa-check"></i>
                                </div>
                                <span>Course & Admission Guidance</span>
                            </div>

                            <div className="expert-feature">
                                <div>
                                    <i className="fas fa-check"></i>
                                </div>
                                <span>Expert Advice Based on Your Goals</span>
                            </div>

                        </div>

                        <div className="expert-contact-box">
                            <div className="expert-contact-icon">
                                <i className="fas fa-phone-alt"></i>
                            </div>

                            <div>
                                <small>Need immediate help?</small>
                                <strong>+91 7082013215</strong>
                            </div>
                        </div>

                    </div>


                    {/* RIGHT SIDE */}
                    <div className="expert-form-card">

                        <div className="form-top">

                            <div className="form-top-icon">
                                <i className="fas fa-comments"></i>
                            </div>

                            <div>
                                <span>WE ARE HERE TO HELP</span>
                                <h3>Ask Our Experts</h3>
                            </div>

                        </div>

                        <p className="form-intro">
                            Tell us what you are looking for and our team
                            will get in touch with you.
                        </p>

                        <form onSubmit={handleSubmit}>

                            <div className="row">

                                {/* NAME */}
                                <div className="col-md-6">
                                    <div className="premium-field">

                                        <label>
                                            Full Name <b>*</b>
                                        </label>

                                        <div className="premium-input">
                                            <i className="fas fa-user"></i>

                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                required
                                            />
                                        </div>

                                    </div>
                                </div>


                                {/* MOBILE */}
                                <div className="col-md-6">
                                    <div className="premium-field">

                                        <label>
                                            Mobile Number <b>*</b>
                                        </label>

                                        <div className="premium-input">
                                            <i className="fas fa-mobile-alt"></i>

                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                placeholder="10 digit mobile"
                                                maxLength="10"
                                                required
                                            />
                                        </div>

                                    </div>
                                </div>


                                {/* EMAIL */}
                                <div className="col-md-6">
                                    <div className="premium-field">

                                        <label>Email Address</label>

                                        <div className="premium-input">
                                            <i className="fas fa-envelope"></i>

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                    </div>
                                </div>


                                {/* QUERY TYPE */}
                                <div className="col-md-6">
                                    <div className="premium-field">

                                        <label>
                                            How Can We Help? <b>*</b>
                                        </label>

                                        <div className="premium-input">
                                            <i className="fas fa-question-circle"></i>

                                            <select
                                                name="queryType"
                                                value={formData.queryType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Query
                                                </option>

                                                <option value="Career Guidance">
                                                    Career Guidance
                                                </option>

                                                <option value="Admission">
                                                    Admission
                                                </option>

                                                <option value="Course Information">
                                                    Course Information
                                                </option>

                                                <option value="Fees">
                                                    Fees & Payment
                                                </option>

                                                <option value="Study Centre">
                                                    Study Centre
                                                </option>

                                                <option value="Examination">
                                                    Examination
                                                </option>

                                                <option value="Result">
                                                    Result
                                                </option>

                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>
                                        </div>

                                    </div>
                                </div>


                                {/* COURSE */}
                                <div className="col-md-12">
                                    <div className="premium-field">

                                        <label>Interested Course</label>

                                        <div className="premium-input">
                                            <i className="fas fa-graduation-cap"></i>

                                            <input
                                                type="text"
                                                name="course"
                                                value={formData.course}
                                                onChange={handleChange}
                                                placeholder="Which course are you interested in?"
                                            />
                                        </div>

                                    </div>
                                </div>


                                {/* MESSAGE */}
                                <div className="col-md-12">
                                    <div className="premium-field">

                                        <label>
                                            Your Query <b>*</b>
                                        </label>

                                        <div className="premium-textarea">

                                            <i className="fas fa-comment-alt"></i>

                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Write your question or requirement..."
                                                required
                                            ></textarea>

                                        </div>

                                    </div>
                                </div>

                            </div>


                            <button
                                type="submit"
                                className="expert-submit"
                            >
                                <span>Submit Your Query</span>

                                <i className="fas fa-arrow-right"></i>
                            </button>

                            <div className="form-bottom">

                                <span>
                                    <i className="fas fa-shield-alt"></i>
                                    Your information is secure
                                </span>

                                <span>
                                    <i className="fas fa-clock"></i>
                                    Quick Response
                                </span>

                            </div>

                        </form>

                    </div>

                </div>

            </div>


            <style>{`

                .expert-section {
                    position: relative;
                    padding: 75px 0;
                    background:
                        radial-gradient(
                            circle at 10% 20%,
                            rgba(0, 102, 204, 0.07),
                            transparent 30%
                        ),
                        #f7f9fc;
                    overflow: hidden;
                }

                .expert-wrapper {
                    max-width: 1180px;
                    margin: auto;
                    display: flex;
                    align-items: stretch;
                    gap: 45px;
                }

                /* LEFT */

                .expert-left {
                    flex: 1;
                    padding: 25px 0;
                }

                .expert-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    color: #0066cc;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    margin-bottom: 18px;
                }

                .expert-label span {
                    width: 31px;
                    height: 31px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #e8f2ff;
                    font-size: 13px;
                }

                .expert-left h2 {
                    margin: 0;
                    color: #0f172a;
                    font-size: 42px;
                    line-height: 1.13;
                    font-weight: 800;
                    letter-spacing: -1px;
                }

                .expert-left h2 span {
                    color: #ff6600;
                }

                .expert-description {
                    max-width: 510px;
                    margin: 20px 0 27px;
                    color: #64748b;
                    font-size: 14px;
                    line-height: 1.8;
                }

                .expert-highlight {
                    max-width: 490px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px 18px;
                    background: #ffffff;
                    border: 1px solid #e8edf4;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(15, 23, 42, 0.05);
                    margin-bottom: 25px;
                }

                .expert-highlight-icon {
                    width: 45px;
                    height: 45px;
                    min-width: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff1e8;
                    color: #ff6600;
                    border-radius: 10px;
                    font-size: 18px;
                }

                .expert-highlight strong {
                    display: block;
                    color: #1e293b;
                    font-size: 14px;
                    margin-bottom: 3px;
                }

                .expert-highlight p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 11px;
                }

                .expert-features {
                    display: flex;
                    flex-direction: column;
                    gap: 13px;
                    margin-bottom: 28px;
                }

                .expert-feature {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 500;
                }

                .expert-feature div {
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #e8f7ef;
                    color: #16a34a;
                    border-radius: 50%;
                    font-size: 9px;
                }

                .expert-contact-box {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 17px;
                    background: #0066cc;
                    border-radius: 10px;
                    color: #ffffff;
                }

                .expert-contact-icon {
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.15);
                    border-radius: 8px;
                    font-size: 13px;
                }

                .expert-contact-box small {
                    display: block;
                    font-size: 9px;
                    opacity: 0.75;
                    margin-bottom: 2px;
                }

                .expert-contact-box strong {
                    font-size: 13px;
                }

                /* FORM */

                .expert-form-card {
                    width: 540px;
                    flex-shrink: 0;
                    background: #ffffff;
                    border: 1px solid #e5eaf1;
                    border-radius: 18px;
                    padding: 30px;
                    box-shadow: 0 20px 55px rgba(15, 23, 42, 0.10);
                }

                .form-top {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                }

                .form-top-icon {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(
                        135deg,
                        #ff6600,
                        #e65100
                    );
                    color: #ffffff;
                    border-radius: 12px;
                    font-size: 20px;
                    box-shadow: 0 7px 18px rgba(255, 102, 0, 0.22);
                }

                .form-top span {
                    color: #ff6600;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .form-top h3 {
                    margin: 3px 0 0;
                    color: #0f172a;
                    font-size: 23px;
                    font-weight: 800;
                }

                .form-intro {
                    color: #94a3b8;
                    font-size: 11px;
                    line-height: 1.6;
                    margin: 15px 0 22px;
                }

                .premium-field {
                    margin-bottom: 17px;
                }

                .premium-field label {
                    display: block;
                    color: #334155;
                    font-size: 11px;
                    font-weight: 700;
                    margin-bottom: 7px;
                }

                .premium-field label b {
                    color: #ef4444;
                }

                .premium-input {
                    position: relative;
                }

                .premium-input i {
                    position: absolute;
                    left: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #0066cc;
                    font-size: 12px;
                    z-index: 2;
                }

                .premium-input input,
                .premium-input select {
                    width: 100%;
                    height: 43px;
                    border: 1px solid #dfe5ed;
                    border-radius: 8px;
                    background: #fbfcfe;
                    padding: 0 12px 0 37px;
                    color: #334155;
                    font-size: 12px;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .premium-input input::placeholder {
                    color: #b0bac8;
                }

                .premium-input input:focus,
                .premium-input select:focus {
                    background: #ffffff;
                    border-color: #0066cc;
                    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.07);
                }

                .premium-input select {
                    cursor: pointer;
                    appearance: auto;
                }

                .premium-textarea {
                    position: relative;
                }

                .premium-textarea i {
                    position: absolute;
                    left: 13px;
                    top: 14px;
                    color: #0066cc;
                    font-size: 12px;
                    z-index: 2;
                }

                .premium-textarea textarea {
                    width: 100%;
                    border: 1px solid #dfe5ed;
                    border-radius: 8px;
                    background: #fbfcfe;
                    padding: 11px 12px 11px 37px;
                    color: #334155;
                    font-size: 12px;
                    outline: none;
                    resize: vertical;
                    transition: all 0.2s ease;
                }

                .premium-textarea textarea::placeholder {
                    color: #b0bac8;
                }

                .premium-textarea textarea:focus {
                    background: #ffffff;
                    border-color: #0066cc;
                    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.07);
                }

                .expert-submit {
                    width: 100%;
                    height: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border: none;
                    border-radius: 8px;
                    padding: 0 17px 0 20px;
                    background: linear-gradient(
                        135deg,
                        #ff6600,
                        #e65100
                    );
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    box-shadow: 0 7px 20px rgba(255, 102, 0, 0.20);
                }

                .expert-submit i {
                    width: 27px;
                    height: 27px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.15);
                    border-radius: 6px;
                    font-size: 10px;
                }

                .expert-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(255, 102, 0, 0.28);
                }

                .form-bottom {
                    display: flex;
                    justify-content: center;
                    gap: 25px;
                    margin-top: 13px;
                }

                .form-bottom span {
                    color: #a0aaba;
                    font-size: 9px;
                }

                .form-bottom i {
                    color: #16a34a;
                    margin-right: 4px;
                }

                @media (max-width: 991px) {

                    .expert-section {
                        padding: 50px 0;
                    }

                    .expert-wrapper {
                        flex-direction: column;
                        gap: 30px;
                        padding: 0 15px;
                    }

                    .expert-left {
                        padding: 0;
                    }

                    .expert-left h2 {
                        font-size: 35px;
                    }

                    .expert-form-card {
                        width: 100%;
                    }

                }

                @media (max-width: 576px) {

                    .expert-section {
                        padding: 40px 0;
                    }

                    .expert-left h2 {
                        font-size: 29px;
                    }

                    .expert-description {
                        font-size: 13px;
                    }

                    .expert-form-card {
                        padding: 22px 17px;
                        border-radius: 14px;
                    }

                    .form-top h3 {
                        font-size: 20px;
                    }

                    .form-bottom {
                        gap: 12px;
                    }

                }

            `}</style>
        </section>
    );
};

export default ExpertQuery;