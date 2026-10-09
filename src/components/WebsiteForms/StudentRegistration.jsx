 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    getCity,
    getCourse,
    getCourseCategory,
    getDistrict,
    getMasterSession,
    getState,
    getStudentData,
    translateToHindi,
} from "../AllServicesFiles/StudentService";
import { createStudentfordata, getFrenchises } from "../AllServicesFiles/WebformService";

import "./StudentRegistration.css";

const StudentRegistration = () => {
    const navigate = useNavigate();

    // =========================
    // STEP CONTROL
    // =========================
    const [registrationMode, setRegistrationMode] = useState(null); // "Online" | "Offline"
    const [showFullForm, setShowFullForm] = useState(false);

    // Offline flow
    const [selectedState, setSelectedState] = useState(null);
    const [stateFranchises, setStateFranchises] = useState([]);
    const [selectedFranchise, setSelectedFranchise] = useState(null);
    const [loadingFranchises, setLoadingFranchises] = useState(false);

    // =========================
    // Dropdown States
    // =========================
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [genders, setGenders] = useState([]);
    const [educationlevel, setEducationlevels] = useState([]);
    const [casteCategories, setCasteCategories] = useState([]);
    const [courseTypes, setCourseTypes] = useState([]);
    const [courseCategories, setCourseCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [masterSessions, setMasterSessions] = useState([]);

    // =========================
    // UI States
    // =========================
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeclarationAccepted, setIsDeclarationAccepted] = useState(false);
    const [showDeclarationModal, setShowDeclarationModal] = useState(false);

    // =========================
    // Form Data
    // =========================
    const [formData, setFormData] = useState({
        dateOfBirth: "",
        name: "",
        studentNameHindi: "",
        fatherName: "",
        fatherNameHindi: "",
        motherName: "",
        mobileNo: "",
        email: "",
        idNumber: "",
        selfImage1: null,
        signatureImage1: null,
        aadhaarCardFrant1: null,
        aadhaarCardBack1: null,
        casteCategoryId: 0,
        courseTypeId: 0,
        courseCategoryId: 0,
        courseId: 0,
        examSessionId: 0,
        genderId: 0,
        stateId: 0,
        districtId: 0,
        locationId: 0,
        studyModeId: 0,
        referenceId: 0,
        franchiseName: "",   // ✅ FRANCHISE NAME
        address: "",
        pincode: "",
        academicDetails: [
            {
                levelTypeId: 0,
                schoolCollege: "",
                rollNo: "",
                boardUniversity: "",
                percentageCgpa: "",
                file: null,
            },
        ],
        isActive: 1,
    });

    // =========================
    // Initial API Calls
    // =========================
    useEffect(() => {
        loadInitialData();
    }, []);

    // Modal scroll lock + Escape close
    useEffect(() => {
        if (showDeclarationModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showDeclarationModal]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setShowDeclarationModal(false);
        };
        if (showDeclarationModal) {
            document.addEventListener("keydown", handleEsc);
        }
        return () => document.removeEventListener("keydown", handleEsc);
    }, [showDeclarationModal]);

    const loadInitialData = async () => {
        await Promise.all([
            loadState(),
            loadGender(),
            loadCasteCategory(),
            loadCourseType(),
            loadEducationlevels(),
            loadMasterSession(),
        ]);
    };

    // =========================
    // APIs
    // =========================
    const loadState = async () => {
        try {
            const result = await getState();
            setStates(result?.data || []);
        } catch (error) {
            console.error("State Error:", error);
        }
    };

    const loadGender = async () => {
        try {
            const result = await getStudentData(17);
            setGenders(result?.data || []);
        } catch (error) {
            console.error("Gender Error:", error);
        }
    };

    const loadCasteCategory = async () => {
        try {
            const result = await getStudentData(21);
            setCasteCategories(result?.data || []);
        } catch (error) {
            console.error("Caste Category Error:", error);
        }
    };

    const loadCourseType = async () => {
        try {
            const result = await getStudentData(13);
            setCourseTypes(result?.data || []);
        } catch (error) {
            console.error("Course Type Error:", error);
        }
    };

    const loadEducationlevels = async () => {
        try {
            const result = await getStudentData(24);
            setEducationlevels(result?.data || []);
        } catch (error) {
            console.error("Education Level Error:", error);
        }
    };

    const loadMasterSession = async () => {
        try {
            const result = await getMasterSession();
            setMasterSessions(result?.data || []);
        } catch (error) {
            console.error("Session Error:", error);
        }
    };

    const loadDistrict = async (stateId) => {
        try {
            const result = await getDistrict(stateId);
            setDistricts(result?.data || []);
        } catch (error) {
            console.error("District Error:", error);
            setDistricts([]);
        }
    };

    const loadCity = async (districtId) => {
        try {
            const result = await getCity(districtId);
            setCities(result?.data || []);
        } catch (error) {
            console.error("City Error:", error);
            setCities([]);
        }
    };

    const loadCourseCategory = async (courseTypeId) => {
        try {
            const result = await getCourseCategory(courseTypeId);
            setCourseCategories(result?.data || []);
        } catch (error) {
            console.error("Course Category Error:", error);
            setCourseCategories([]);
        }
    };

    const loadCourse = async (courseCategoryId) => {
        try {
            const result = await getCourse(courseCategoryId);
            setCourses(result?.data || []);
        } catch (error) {
            console.error("Course Error:", error);
            setCourses([]);
        }
    };

    // =========================
    // ✅ ONLINE — direct form open
    // =========================
    const handleOnlineClick = () => {
        setRegistrationMode("Online");

        setFormData((prev) => ({
            ...prev,
            referenceId: 3,
            studyModeId: 88,
            franchiseName: "",
        }));

        setShowFullForm(true);
    };

    // =========================
    // ✅ OFFLINE — state/franchise select
    // =========================
    const handleOfflineClick = () => {
        setRegistrationMode("Offline");
        setSelectedState(null);
        setSelectedFranchise(null);
        setStateFranchises([]);
    };

    const handleOfflineStateChange = async (option) => {
        setSelectedState(option);
        setSelectedFranchise(null);
        setStateFranchises([]);

        if (!option) return;

        try {
            setLoadingFranchises(true);
            const result = await getFrenchises(option.value);
            setStateFranchises(result?.data || []);
        } catch (error) {
            console.error("Franchise Error:", error);
            setStateFranchises([]);
            toast.error("Unable to load franchises for this state");
        } finally {
            setLoadingFranchises(false);
        }
    };

    const handleFranchiseChange = (option) => {
        setSelectedFranchise(option);
    };

    const handleOfflineNext = () => {
        if (!selectedState) {
            toast.error("Please select State");
            return;
        }
        if (!selectedFranchise) {
            toast.error("Please select Franchise");
            return;
        }

        const stateId = Number(selectedState.value);

        setFormData((prev) => ({
            ...prev,
            referenceId: Number(selectedFranchise.value),
            franchiseName: selectedFranchise.label,   // ✅ FRANCHISE NAME SAVE
            stateId: stateId,
            districtId: 0,
            locationId: 0,
            studyModeId: 89,
        }));

        // ✅ State ke districts turant load karo
        loadDistrict(stateId);

        setShowFullForm(true);
    };

    // =========================
    // Back to mode selection
    // =========================
    const handleBackToMode = () => {
        setRegistrationMode(null);
        setSelectedState(null);
        setSelectedFranchise(null);
        setStateFranchises([]);
        setShowFullForm(false);
        setDistricts([]);
        setCities([]);
        setFormData((prev) => ({
            ...prev,
            referenceId: 0,
            studyModeId: 0,
            stateId: 0,
            districtId: 0,
            locationId: 0,
            franchiseName: "",   // ✅ CLEAR
        }));
    };

    // =========================
    // Generic Change
    // =========================
    const handleChange = async (e) => {
        const { name, value, files, type } = e.target;

        const newValue = type === "file" ? files?.[0] || null : value;

        setFormData((prev) => ({ ...prev, [name]: newValue }));

        if (type === "file") {
            e.target.value = "";
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

 if (name === "name" && value.trim()) {
    const currentValue = value;
    try {
        const hindi = await translateToHindi(currentValue);
        setFormData((prev) => {
            if (prev.name !== currentValue) return prev;
            return { ...prev, studentNameHindi: hindi || "" };  // ✅ FIXED
        });
    } catch (error) {
        console.error("Hindi Translation Error:", error);
    }
}

        if (name === "fatherName" && value.trim()) {
            const currentValue = value;
            try {
                const hindi = await translateToHindi(currentValue);
                setFormData((prev) => {
                    if (prev.fatherName !== currentValue) return prev;
                    return { ...prev, fatherNameHindi: hindi || "" };
                });
            } catch (error) {
                console.error("Hindi Translation Error:", error);
            }
        }
    };

    // =========================
    // Helpers
    // =========================
    const makeOptions = (data) =>
        data.map((item) => ({
            value: item.id,
            label: item.name,
        }));

    const handleAcademicChange = (index, e) => {
        const { name, value, files, type } = e.target;

        setFormData((prev) => {
            const academicDetails = [...prev.academicDetails];
            academicDetails[index] = {
                ...academicDetails[index],
                [name]: type === "file" ? files?.[0] || null : value,
            };
            return { ...prev, academicDetails };
        });

        if (type === "file") {
            e.target.value = "";
        }
    };

    const addAcademicRow = () => {
        setFormData((prev) => ({
            ...prev,
            academicDetails: [
                ...prev.academicDetails,
                {
                    levelTypeId: 0,
                    schoolCollege: "",
                    rollNo: "",
                    boardUniversity: "",
                    percentageCgpa: "",
                    file: null,
                },
            ],
        }));
    };

    const removeAcademicRow = (index) => {
        setFormData((prev) => {
            if (prev.academicDetails.length === 1) return prev;
            return {
                ...prev,
                academicDetails: prev.academicDetails.filter(
                    (_, i) => i !== index
                ),
            };
        });
    };

    const handleNumberChange = (name, maxLength, e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectChange = (name, selectedOption) => {
        const id = selectedOption ? Number(selectedOption.value) : 0;
        setFormData((prev) => ({ ...prev, [name]: id }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCourseTypeChange = (selectedOption) => {
        const id = selectedOption ? Number(selectedOption.value) : 0;
        setFormData((prev) => ({
            ...prev,
            courseTypeId: id,
            courseCategoryId: 0,
            courseId: 0,
        }));
        setCourseCategories([]);
        setCourses([]);
        if (id) loadCourseCategory(id);
    };

    const handleCourseCategoryChange = (selectedOption) => {
        const id = selectedOption ? Number(selectedOption.value) : 0;
        setFormData((prev) => ({
            ...prev,
            courseCategoryId: id,
            courseId: 0,
        }));
        setCourses([]);
        if (id) loadCourse(id);
    };

    const handleStateChange = (selectedOption) => {
        const id = selectedOption ? Number(selectedOption.value) : 0;
        setFormData((prev) => ({
            ...prev,
            stateId: id,
            districtId: 0,
            locationId: 0,
        }));
        setDistricts([]);
        setCities([]);
        if (id) loadDistrict(id);
    };

    const handleDistrictChange = (selectedOption) => {
        const id = selectedOption ? Number(selectedOption.value) : 0;
        setFormData((prev) => ({
            ...prev,
            districtId: id,
            locationId: 0,
        }));
        setCities([]);
        if (id) loadCity(id);
    };

    const getSelected = (data, id) => {
        return (
            data
                .map((item) => ({ value: item.id, label: item.name }))
                .find((item) => Number(item.value) === Number(id || 0)) || null
        );
    };

    // =========================
    // Validation
    // =========================
    const validateForm = () => {
        const newErrors = {};

        if (!formData.examSessionId)
            newErrors.examSessionId = "Session is required";
        if (!formData.name.trim())
            newErrors.name = "Student name is required";
        if (!formData.fatherName.trim())
            newErrors.fatherName = "Father name is required";
        if (!formData.mobileNo.trim())
            newErrors.mobileNo = "Mobile number is required";
        else if (formData.mobileNo.length !== 10)
            newErrors.mobileNo = "Enter valid 10 digit mobile number";
        if (!formData.email.trim())
            newErrors.email = "Email address is required";
        if (!formData.address.trim())
            newErrors.address = "Address is required";
        if (!formData.selfImage1)
            newErrors.selfImage1 = "Student photo is required";
        if (!formData.courseTypeId)
            newErrors.courseTypeId = "Programme is required";
        if (!formData.courseCategoryId)
            newErrors.courseCategoryId = "Course category is required";
        if (!formData.courseId)
            newErrors.courseId = "Course is required";

        const invalidAcademic = formData.academicDetails.some(
            (a) => !a.levelTypeId
        );
        if (invalidAcademic) {
            toast.error("Please select level for all academic details");
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // =========================
    // Submit
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!isDeclarationAccepted) {
            toast.error("Please accept the Declaration & Undertaking.");
            return;
        }

        try {
            setIsSubmitting(true);

            const result = await createStudentfordata(formData);

            if (result?.message === "Successfully") {
                navigate(`/admission-form-print/${result?.userid}`);
                return;
            }

            toast.error(result?.message || "Registration failed");
        } catch (error) {
            console.error("Create Student Error:", error);
            toast.error(
                error?.response?.data?.message || "Unable to create student"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />

            <div className="student-registration-page">
                <div className="container-fluid px-3 px-md-4">
                    <div className="acc-logo-wrapper">
                        <div className="acc-logo-card">
                            <img
                                src="/assets/img/websheddlogo.png"
                                alt="SBSHE"
                                className="sbshe-acc-logo"
                            />
                        </div>
                    </div>

                    {/* =====================================
                        STEP 1 — MODE SELECTION
                    ===================================== */}
                    {!showFullForm && (
                        <div className="registration-card mode-step-card">
                            <div className="registration-top">
                                <div>
                                    <h4>
                                        <i className="bi bi-person-vcard"></i>
                                        Choose Registration Mode
                                    </h4>
                                    <p>Please select Online or Offline to continue</p>
                                </div>
                            </div>

                            <div className="mode-step-body">
                                {!registrationMode && (
                                    <div className="mode-cards">
                                        <button
                                            type="button"
                                            className="mode-card"
                                            onClick={handleOnlineClick}
                                        >
                                            <div className="mode-card-icon online">
                                                <i className="bi bi-globe2"></i>
                                            </div>
                                            <div className="mode-card-text">
                                                <h5>Online</h5>
                                                <p>Direct registration</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            className="mode-card"
                                            onClick={handleOfflineClick}
                                        >
                                            <div className="mode-card-icon offline">
                                                <i className="bi bi-geo-alt-fill"></i>
                                            </div>
                                            <div className="mode-card-text">
                                                <h5>Offline</h5>
                                                <p>Select State & Franchise</p>
                                            </div>
                                        </button>
                                    </div>
                                )}

                                {registrationMode === "Offline" && (
                                    <div className="mode-detail-block">
                                        <button
                                            type="button"
                                            className="back-mode-btn"
                                            onClick={handleBackToMode}
                                        >
                                            <i className="bi bi-arrow-left"></i>
                                            Back to modes
                                        </button>

                                        <div className="mode-detail-form">
                                            <div className="mode-field-row">
                                                <div className="mode-field">
                                                    <label>
                                                        State <span>*</span>
                                                    </label>
                                                    <Select
                                                        options={makeOptions(states)}
                                                        value={selectedState}
                                                        onChange={handleOfflineStateChange}
                                                        placeholder="Search or select state"
                                                        isSearchable
                                                        isClearable
                                                        classNamePrefix="student-select"
                                                        menuPortalTarget={document.body}
                                                        menuPosition="fixed"
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                            menu: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />
                                                </div>

                                                <div className="mode-field">
                                                    <label>
                                                        Franchise <span>*</span>
                                                    </label>
                                                    <Select
                                                        options={stateFranchises.map(
                                                            (f) => ({
                                                                value: f.id,
                                                                label: f.name,
                                                            })
                                                        )}
                                                        value={selectedFranchise}
                                                        onChange={handleFranchiseChange}
                                                        placeholder={
                                                            !selectedState
                                                                ? "Select state first"
                                                                : loadingFranchises
                                                                    ? "Loading franchises..."
                                                                    : stateFranchises.length === 0
                                                                        ? "No franchise found in this state"
                                                                        : "Search or select franchise"
                                                        }
                                                        isSearchable
                                                        isClearable
                                                        isDisabled={
                                                            !selectedState ||
                                                            loadingFranchises
                                                        }
                                                        isLoading={loadingFranchises}
                                                        classNamePrefix="student-select"
                                                        menuPortalTarget={document.body}
                                                        menuPosition="fixed"
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                            menu: (base) => ({ ...base, zIndex: 9999 }),
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="next-step-btn"
                                                onClick={handleOfflineNext}
                                                disabled={!selectedFranchise}
                                            >
                                                Continue
                                                <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* =====================================
                        STEP 2 — FULL FORM
                    ===================================== */}
                    {showFullForm && (
                        <div className="registration-card">
                            <div className="registration-top">
                                <div>
                                    <h4>
                                        <i className="bi bi-person-vcard"></i>
                                        Student Registration Form
                                    </h4>
                                    <p>{registrationMode} Registration</p>
                                </div>

                                <div className="top-right-actions">
                                    <button
                                        type="button"
                                        className="mode-change-btn"
                                        onClick={handleBackToMode}
                                    >
                                        <i className="bi bi-arrow-left-circle"></i>
                                        Change Mode
                                    </button>
                                    <div className="required-info">
                                        <span>*</span> Required Fields
                                    </div>
                                </div>
                            </div>

                            {/* ✅ FRANCHISE NAME INPUT — sirf Offline me dikhega */}
                            {registrationMode === "Offline" && formData.franchiseName && (
                                <div className="franchise-name-bar">
                                    <label>
                                        <i className="bi bi-shop"></i> Franchise
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.franchiseName}
                                        readOnly
                                    />
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="registration-form">
                                {/* ===== COURSE DETAILS ===== */}
                                <div className="form-section">
                                    <div className="section-heading">
                                        <div className="section-icon blue">
                                            <i className="bi bi-book-half"></i>
                                        </div>
                                        <div>
                                            <h5>Course Details</h5>
                                            <p>Select programme, mode, category and course</p>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>
                                                Programme <span>*</span>
                                            </label>
                                            <Select
                                                options={makeOptions(courseTypes)}
                                                value={getSelected(
                                                    courseTypes,
                                                    formData.courseTypeId
                                                )}
                                                onChange={handleCourseTypeChange}
                                                placeholder="Select programme"
                                                isSearchable
                                                isClearable
                                                classNamePrefix="student-select"
                                            />
                                            {errors.courseTypeId && (
                                                <ErrorText text={errors.courseTypeId} />
                                            )}
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>
                                                Course Category <span>*</span>
                                            </label>
                                            <Select
                                                options={makeOptions(courseCategories)}
                                                value={getSelected(
                                                    courseCategories,
                                                    formData.courseCategoryId
                                                )}
                                                onChange={handleCourseCategoryChange}
                                                placeholder={
                                                    formData.courseTypeId
                                                        ? "Select category"
                                                        : "Select programme first"
                                                }
                                                isSearchable
                                                isClearable
                                                isDisabled={!formData.courseTypeId}
                                                classNamePrefix="student-select"
                                            />
                                            {errors.courseCategoryId && (
                                                <ErrorText
                                                    text={errors.courseCategoryId}
                                                />
                                            )}
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>
                                                Course <span>*</span>
                                            </label>
                                            <Select
                                                options={makeOptions(courses)}
                                                value={getSelected(
                                                    courses,
                                                    formData.courseId
                                                )}
                                                onChange={(option) =>
                                                    handleSelectChange("courseId", option)
                                                }
                                                placeholder={
                                                    formData.courseCategoryId
                                                        ? "Select course"
                                                        : "Select category first"
                                                }
                                                isSearchable
                                                isClearable
                                                isDisabled={!formData.courseCategoryId}
                                                classNamePrefix="student-select"
                                            />
                                            {errors.courseId && (
                                                <ErrorText text={errors.courseId} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ===== PERSONAL DETAILS ===== */}
                                <div className="form-section">
                                    <div className="section-heading">
                                        <div className="section-icon green">
                                            <i className="bi bi-person-vcard-fill"></i>
                                        </div>
                                        <div>
                                            <h5>Personal Details</h5>
                                            <p>Enter student's personal information</p>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>
                                                Session <span>*</span>
                                            </label>
                                            <Select
                                                options={makeOptions(masterSessions)}
                                                value={getSelected(
                                                    masterSessions,
                                                    formData.examSessionId
                                                )}
                                                onChange={(option) =>
                                                    handleSelectChange(
                                                        "examSessionId",
                                                        option
                                                    )
                                                }
                                                placeholder="Select session"
                                                isSearchable
                                                isClearable
                                                classNamePrefix="student-select"
                                            />
                                            {errors.examSessionId && (
                                                <ErrorText text={errors.examSessionId} />
                                            )}
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>
                                                Student Name <span>*</span>
                                            </label>
                                            <InputField
                                                icon="bi-person"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter student name"
                                            />
                                            {errors.name && (
                                                <ErrorText text={errors.name} />
                                            )}
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>Student Name (Hindi)</label>
                                            <InputField
                                                icon="bi-translate"
                                                name="studentNameHindi"
                                                value={formData.studentNameHindi}
                                                onChange={handleChange}
                                                placeholder="हिंदी में नाम"
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>Date of Birth</label>
                                            <InputField
                                                type="date"
                                                icon="bi-calendar3"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                max={new Date()
                                                    .toISOString()
                                                    .split("T")[0]}
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>
                                                Father's Name <span>*</span>
                                            </label>
                                            <InputField
                                                icon="bi-person-badge"
                                                name="fatherName"
                                                value={formData.fatherName}
                                                onChange={handleChange}
                                                placeholder="Enter father's name"
                                            />
                                            {errors.fatherName && (
                                                <ErrorText text={errors.fatherName} />
                                            )}
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>Father's Name (Hindi)</label>
                                            <InputField
                                                icon="bi-translate"
                                                name="fatherNameHindi"
                                                value={formData.fatherNameHindi}
                                                onChange={handleChange}
                                                placeholder="हिंदी में पिता का नाम"
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>Mother's Name</label>
                                            <InputField
                                                icon="bi-person-heart"
                                                name="motherName"
                                                value={formData.motherName}
                                                onChange={handleChange}
                                                placeholder="Enter mother's name"
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>Aadhaar Number</label>
                                            <InputField
                                                icon="bi-credit-card-2-front"
                                                name="idNumber"
                                                value={formData.idNumber}
                                                onChange={(e) =>
                                                    handleNumberChange("idNumber", 12, e)
                                                }
                                                placeholder="Enter 12 digit Aadhaar"
                                                maxLength={12}
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>Gender</label>
                                            <Select
                                                options={makeOptions(genders)}
                                                value={getSelected(
                                                    genders,
                                                    formData.genderId
                                                )}
                                                onChange={(option) =>
                                                    handleSelectChange(
                                                        "genderId",
                                                        option
                                                    )
                                                }
                                                placeholder="Select gender"
                                                isSearchable
                                                isClearable
                                                classNamePrefix="student-select"
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>Caste Category</label>
                                            <Select
                                                options={makeOptions(
                                                    casteCategories
                                                )}
                                                value={getSelected(
                                                    casteCategories,
                                                    formData.casteCategoryId
                                                )}
                                                onChange={(option) =>
                                                    handleSelectChange(
                                                        "casteCategoryId",
                                                        option
                                                    )
                                                }
                                                placeholder="Select caste category"
                                                isSearchable
                                                isClearable
                                                classNamePrefix="student-select"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ===== ACADEMIC DETAILS ===== */}
                                <div className="form-section">
                                    <div className="section-heading">
                                        <div className="section-icon purple">
                                            <i className="bi bi-mortarboard-fill"></i>
                                        </div>
                                        <div>
                                            <h5>Academic Details</h5>
                                            <p>Add student's educational qualifications</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="add-academic-btn"
                                            onClick={addAcademicRow}
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                            Add Qualification
                                        </button>
                                    </div>

                                    <div className="academic-wrapper">
                                        <div className="table-responsive">
                                            <table className="academic-table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr. No.</th>
                                                        <th>Level</th>
                                                        <th>School / College</th>
                                                        <th>Roll No</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {formData.academicDetails.map(
                                                        (academic, index) => (
                                                            <React.Fragment key={index}>
                                                                <tr className="academic-row">
                                                                    <td
                                                                        rowSpan={2}
                                                                        className="academic-sr-no"
                                                                    >
                                                                        {index + 1}
                                                                    </td>

                                                                    <td>
                                                                        <label className="academic-mobile-label">
                                                                            Level
                                                                        </label>
                                                                        <Select
                                                                            options={makeOptions(
                                                                                educationlevel
                                                                            )}
                                                                            value={getSelected(
                                                                                educationlevel,
                                                                                academic.levelTypeId
                                                                            )}
                                                                            onChange={(selectedOption) =>
                                                                                handleAcademicChange(
                                                                                    index,
                                                                                    {
                                                                                        target: {
                                                                                            name: "levelTypeId",
                                                                                            value: selectedOption
                                                                                                ? selectedOption.value
                                                                                                : "",
                                                                                        },
                                                                                    }
                                                                                )
                                                                            }
                                                                            placeholder="Select Level"
                                                                            isSearchable
                                                                            isClearable
                                                                            classNamePrefix="student-select"
                                                                            menuPortalTarget={document.body}
                                                                            menuPosition="fixed"
                                                                            styles={{
                                                                                menuPortal: (base) => ({
                                                                                    ...base,
                                                                                    zIndex: 9999,
                                                                                }),
                                                                                menu: (base) => ({
                                                                                    ...base,
                                                                                    zIndex: 9999,
                                                                                }),
                                                                            }}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <label className="academic-mobile-label">
                                                                            School / College
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="schoolCollege"
                                                                            className="table-input"
                                                                            placeholder="School / College"
                                                                            value={academic.schoolCollege}
                                                                            onChange={(e) =>
                                                                                handleAcademicChange(
                                                                                    index,
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <label className="academic-mobile-label">
                                                                            Roll No
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="rollNo"
                                                                            className="table-input"
                                                                            placeholder="Roll No"
                                                                            value={academic.rollNo}
                                                                            onChange={(e) =>
                                                                                handleAcademicChange(
                                                                                    index,
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>

                                                                <tr className="academic-row">
                                                                    <td>
                                                                        <label className="academic-mobile-label">
                                                                            Board / University
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="boardUniversity"
                                                                            className="table-input"
                                                                            placeholder="Board / University"
                                                                            value={academic.boardUniversity}
                                                                            onChange={(e) =>
                                                                                handleAcademicChange(
                                                                                    index,
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <label className="academic-mobile-label">
                                                                            Percentage / CGPA
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="percentageCgpa"
                                                                            className="table-input"
                                                                            placeholder="Percentage / CGPA"
                                                                            value={academic.percentageCgpa}
                                                                            onChange={(e) =>
                                                                                handleAcademicChange(
                                                                                    index,
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <label className="academic-mobile-label">
                                                                            Document
                                                                        </label>
                                                                        <div className="document-action-wrapper">
                                                                            <div className="document-input-wrapper">
                                                                                <input
                                                                                    type="file"
                                                                                    name="file"
                                                                                    className="file-table-input"
                                                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                                                    onChange={(e) =>
                                                                                        handleAcademicChange(
                                                                                            index,
                                                                                            e
                                                                                        )
                                                                                    }
                                                                                />
                                                                                {academic.file && (
                                                                                    <small className="file-name">
                                                                                        <i className="bi bi-check-circle-fill"></i>{" "}
                                                                                        {academic.file.name}
                                                                                    </small>
                                                                                )}
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                className="delete-row-btn"
                                                                                onClick={() =>
                                                                                    removeAcademicRow(
                                                                                        index
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    formData
                                                                                        .academicDetails
                                                                                        .length === 1
                                                                                }
                                                                            >
                                                                                <i className="bi bi-trash3"></i>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* ===== CONTACT & ADDRESS ===== */}
                                <div className="form-section">
                                    <div className="section-heading">
                                        <div className="section-icon orange">
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>
                                        <div>
                                            <h5>Contact & Address Details</h5>
                                            <p>Enter student's contact and residential details</p>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 mb-4">
                                            <label>
                                                Mobile Number <span>*</span>
                                            </label>
                                            <InputField
                                                type="tel"
                                                icon="bi-phone"
                                                name="mobileNo"
                                                value={formData.mobileNo}
                                                onChange={(e) =>
                                                    handleNumberChange("mobileNo", 10, e)
                                                }
                                                placeholder="Enter 10 digit mobile number"
                                                maxLength={10}
                                            />
                                            {errors.mobileNo && (
                                                <ErrorText text={errors.mobileNo} />
                                            )}
                                        </div>

                                        <div className="col-lg-6 col-md-6 mb-4">
                                            <label>
                                                Email Address <span>*</span>
                                            </label>
                                            <InputField
                                                type="email"
                                                icon="bi-envelope"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && (
                                                <ErrorText text={errors.email} />
                                            )}
                                        </div>

                                        {/* ✅ STATE — editable always */}
                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>State</label>
                                            <Select
                                                options={makeOptions(states)}
                                                value={getSelected(states, formData.stateId)}
                                                onChange={handleStateChange}
                                                placeholder="Select state"
                                                isSearchable
                                                isClearable
                                                classNamePrefix="student-select"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>District</label>
                                            <Select
                                                options={makeOptions(districts)}
                                                value={getSelected(
                                                    districts,
                                                    formData.districtId
                                                )}
                                                onChange={handleDistrictChange}
                                                placeholder={
                                                    formData.stateId
                                                        ? "Select district"
                                                        : "Select state first"
                                                }
                                                isSearchable
                                                isClearable
                                                isDisabled={!formData.stateId}
                                                classNamePrefix="student-select"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                        </div>

                                        <div className="col-lg-4 col-md-6 mb-4">
                                            <label>City</label>
                                            <Select
                                                options={makeOptions(cities)}
                                                value={getSelected(
                                                    cities,
                                                    formData.locationId
                                                )}
                                                onChange={(option) =>
                                                    handleSelectChange(
                                                        "locationId",
                                                        option
                                                    )
                                                }
                                                placeholder={
                                                    formData.districtId
                                                        ? "Select city"
                                                        : "Select district first"
                                                }
                                                isSearchable
                                                isClearable
                                                isDisabled={!formData.districtId}
                                                classNamePrefix="student-select"
                                                menuPortalTarget={document.body}
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                        </div>

                                        <div className="col-lg-8 col-md-8 mb-4">
                                            <label>
                                                Address <span>*</span>
                                            </label>
                                            <div className="input-icon-box textarea-icon">
                                                <i className="bi bi-house-door"></i>
                                                <textarea
                                                    name="address"
                                                    className="form-control"
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Enter complete residential address"
                                                ></textarea>
                                            </div>
                                            {errors.address && (
                                                <ErrorText text={errors.address} />
                                            )}
                                        </div>

                                        <div className="col-lg-4 col-md-4 mb-4">
                                            <label>Pin Code</label>
                                            <InputField
                                                type="text"
                                                icon="bi-geo"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={(e) =>
                                                    handleNumberChange("pincode", 6, e)
                                                }
                                                placeholder="Enter 6 digit PIN"
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ===== DOCUMENT DETAILS ===== */}
                                <div className="form-section">
                                    <div className="section-heading">
                                        <div className="section-icon red">
                                            <i className="bi bi-file-earmark-image-fill"></i>
                                        </div>
                                        <div>
                                            <h5>Document Details</h5>
                                            <p>Upload student's required documents</p>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <DocumentUpload
                                            label="Student Photo"
                                            required
                                            name="selfImage1"
                                            file={formData.selfImage1}
                                            error={errors.selfImage1}
                                            onChange={handleChange}
                                            icon="bi-person-square"
                                            accept="image/*"
                                        />
                                        <DocumentUpload
                                            label="Signature Image"
                                            name="signatureImage1"
                                            file={formData.signatureImage1}
                                            onChange={handleChange}
                                            icon="bi-pen"
                                            accept="image/*"
                                        />
                                        <DocumentUpload
                                            label="Aadhaar Front"
                                            name="aadhaarCardFrant1"
                                            file={formData.aadhaarCardFrant1}
                                            onChange={handleChange}
                                            icon="bi-credit-card"
                                            accept="image/*"
                                        />
                                        <DocumentUpload
                                            label="Aadhaar Back"
                                            name="aadhaarCardBack1"
                                            file={formData.aadhaarCardBack1}
                                            onChange={handleChange}
                                            icon="bi-credit-card-2-back"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                {/* ===== DECLARATION ===== */}
                                <div className="declaration-card">
                                    <div className="declaration-header">
                                        <div className="declaration-icon">
                                            <i className="bi bi-shield-check"></i>
                                        </div>
                                        <div>
                                            <h5>Declaration & Undertaking</h5>
                                            <p>
                                                Please read the declaration before
                                                submitting the form.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="view-declaration-btn"
                                            onClick={() =>
                                                setShowDeclarationModal(true)
                                            }
                                        >
                                            <i className="bi bi-eye"></i>
                                            Read Declaration
                                        </button>
                                    </div>

                                    <div className="declaration-check">
                                        <input
                                            type="checkbox"
                                            id="declarationCheck"
                                            checked={isDeclarationAccepted}
                                            onChange={(e) =>
                                                setIsDeclarationAccepted(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <label htmlFor="declarationCheck">
                                            I hereby declare that I have read,
                                            understood, and accept all the terms and
                                            conditions mentioned above. I confirm that
                                            all the information provided in this
                                            application is true and correct to the
                                            best of my knowledge.
                                        </label>
                                    </div>
                                </div>

                                {/* ===== ACTIONS ===== */}
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => navigate("/student-list")}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={
                                            !isDeclarationAccepted || isSubmitting
                                        }
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check2-circle"></i>
                                                Submit Registration
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* ===== DECLARATION MODAL ===== */}
                {showDeclarationModal && (
                    <div className="declaration-overlay">
                        <div className="declaration-modal">
                            <div className="modal-header-custom">
                                <div>
                                    <i className="bi bi-file-earmark-check-fill"></i>
                                    <div>
                                        <h5>Declaration & Undertaking</h5>
                                        <small>Please read carefully</small>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDeclarationModal(false)}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            <div className="modal-body-custom">
                                <h5>Declaration by Candidate</h5>

                                <p>
                                    We (Candidate){" "}
                                    <strong>{formData.name || "Candidate"}</strong>{" "}
                                    s/o, d/o, h/o, w/o{" "}
                                    <strong>
                                        {formData.fatherName || "Parent/Guardian"}
                                    </strong>{" "}
                                    hereby declare that the entries made in this
                                    form are true and correct. We have carefully
                                    read all terms and conditions, rules and
                                    regulations as stipulated in the prospectus and
                                    shall abide by the same.
                                </p>

                                <p>
                                    We also undertake that we will not discontinue
                                    the course in any circumstances before the
                                    completion of the course. However, if this
                                    happens due to any unavoidable / unforeseen
                                    circumstances, we shall be liable to pay the
                                    fees of full course duration remaining to be
                                    completed.
                                </p>

                                <p>
                                    We also undertake not to claim any refunds of
                                    tuition fee, hostel charges or any other funds
                                    deposits. We undertake not to indulge into any
                                    legal proceeding. In case of any unavoidable
                                    circumstances, court jurisdiction will be
                                    Delhi only.
                                </p>

                                <hr />

                                <h5>Undertaking by The Applicant</h5>

                                <p>
                                    I declare that I have not been debarred from
                                    joining any educational institution or
                                    rusticated from the Institution / Board last
                                    attended.
                                </p>

                                <p>
                                    I declare that all the statements made in the
                                    application by me are true to the best of my
                                    knowledge and belief. I clearly understand that
                                    if any of the statements subsequently found
                                    untrue, my admission to the Institution would
                                    stand automatically cancelled, without any claim
                                    for refund.
                                </p>

                                <p>
                                    I have read the rules & regulations regarding
                                    admission criteria made by the Institution and
                                    instructions incorporated therein carefully. I
                                    have read and understood the conditions of
                                    eligibility for the programme to which I seek
                                    admission. I fulfill the minimum eligibility
                                    criteria.
                                </p>

                                <p>
                                    In the event of any information being incorrect
                                    or misleading my candidature shall be liable to
                                    cancellation by the Institution at any time and
                                    I shall not be entitled to refund of any fee
                                    paid by me to the Institution.
                                </p>

                                <p>
                                    I have satisfied myself that I fulfill the
                                    minimum educational, physical and medical
                                    standards and that I agree to be removed from
                                    the institution if found deficient in these
                                    standards during the course.
                                </p>

                                <p>
                                    I agree that admission may be granted to me on
                                    the conditions stated in the latest edition of
                                    the prospectus / syllabus prescribed by the
                                    Institution or such modification thereof as may
                                    be made by the authorities.
                                </p>

                                <p>
                                    I have read the rules, regulations and code of
                                    conduct as prescribed by the Institution and
                                    promise to abide by them and those that may be
                                    made in future for the admission. I also
                                    undertake that I shall do nothing inside or
                                    outside the Institution Campus that will
                                    interfere with its discipline.
                                </p>

                                <p>
                                    I undertake to pay the dues of college, hostel
                                    and other dues regularly if admitted.
                                </p>

                                <p className="fw-bold">I also declare that:</p>

                                <ol type="A">
                                    <li>
                                        I have never been convicted of any criminal
                                        offence, nor have I ever been released on
                                        bail in connection with a criminal case.
                                    </li>
                                    <li>
                                        No case of criminal offence or moral
                                        turpitude is pending against me in any Court
                                        of law.
                                    </li>
                                    <li>
                                        No complaint of F.I.R. has ever been lodged
                                        against me by the School / Institution.
                                    </li>
                                    <li>
                                        I have not been debarred from appearing by
                                        Coordination Committee.
                                    </li>
                                    <li>
                                        Admission is purely on temporary basis
                                        subject to confirmation by the Institution
                                        concerned. In all matters court jurisdiction
                                        will be Delhi only.
                                    </li>
                                </ol>

                                <p>
                                    In case it is found at any stage by the
                                    Institution or other authority that I am not
                                    eligible for admission / course, I shall have no
                                    claim for the refund of fees and will not make
                                    any legal dispute.
                                </p>

                                <p>
                                    I accept that if any above undertaking is
                                    missing I agree to be prosecuted by the court of
                                    law for providing fake acceptance statement /
                                    declaration.
                                </p>

                                <div className="modal-accept-box">
                                    <input
                                        type="checkbox"
                                        id="modalDeclarationCheck"
                                        checked={isDeclarationAccepted}
                                        onChange={(e) =>
                                            setIsDeclarationAccepted(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label htmlFor="modalDeclarationCheck">
                                        I hereby declare that I have read,
                                        understood, and accept all the terms and
                                        conditions mentioned above. I confirm that
                                        all the information provided in this
                                        application is true and correct to the best
                                        of my knowledge.
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer-custom">
                                <button
                                    type="button"
                                    className="modal-close-btn"
                                    onClick={() => setShowDeclarationModal(false)}
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="modal-accept-btn"
                                    disabled={!isDeclarationAccepted}
                                    onClick={() => setShowDeclarationModal(false)}
                                >
                                    <i className="bi bi-check-lg"></i>
                                    Accept & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

// =============================================
// Reusable Components
// =============================================
const InputField = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    icon,
    maxLength,
    ...rest
}) => {
    return (
        <div className="input-icon-box">
            <i className={`bi ${icon}`}></i>
            <input
                type={type}
                name={name}
                className="form-control"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                {...rest}
            />
        </div>
    );
};

const ErrorText = ({ text }) => (
    <div className="field-error">
        <i className="bi bi-exclamation-circle"></i>
        {text}
    </div>
);

const DocumentUpload = ({
    label,
    required,
    name,
    file,
    error,
    onChange,
    icon,
    accept,
}) => {
    return (
        <div className="col-lg-3 col-md-6 mb-4">
            <label>
                {label}
                {required && <span>*</span>}
            </label>

            <div className={`document-upload ${error ? "has-error" : ""}`}>
                <div className="document-icon">
                    <i className={`bi ${icon}`}></i>
                </div>
                <div className="document-content">
                    <div className="document-title">
                        {file ? "File Selected" : "Choose File"}
                    </div>
                    <div className="document-subtitle">JPG, PNG or PDF</div>

                    <input
                        type="file"
                        name={name}
                        accept={accept}
                        onChange={onChange}
                    />

                    {file && (
                        <div className="selected-file">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>{file.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {error && <ErrorText text={error} />}
        </div>
    );
};

export default StudentRegistration;