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
    translateToHindi
} from "../EmployeePanal/Students/StudentService";
import { createStudentfordata } from "./WebformService";




const StudentRegistration = () => {
    const navigate = useNavigate();


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
    const [isDeclarationAccepted, setIsDeclarationAccepted] =
        useState(false);
    const [showDeclarationModal, setShowDeclarationModal] =
        useState(false);

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

        address: "",
        pincode: "",

        academicDetails: [
            {
                levelTypeId: 0,
                schoolCollege: "",
                rollNo: "",
                boardUniversity: "",
                percentageCgpa: "",
                file: null
            }
        ],

        isActive: 1
    });

    // =========================
    // Initial API Calls
    // =========================

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        await Promise.all([
            loadState(),
            loadGender(),

            loadCasteCategory(),
            loadCourseType(),
            loadEducationlevels(),
            loadMasterSession()
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
            console.error("Course Type Error:", error);
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
    // Generic Change
    // =========================

    const handleChange = async (e) => {
        const { name, value, files, type } = e.target;

        const newValue =
            type === "file"
                ? files?.[0] || null
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }

        // Hindi translation - Student Name
        if (name === "name" && value.trim()) {
            try {
                const hindi = await translateToHindi(value);

                setFormData((prev) => ({
                    ...prev,
                    name: value,
                    studentNameHindi: hindi || ""
                }));
            } catch (error) {
                console.error("Hindi Translation Error:", error);
            }
        }

        // Hindi translation - Father Name
        if (name === "fatherName" && value.trim()) {
            try {
                const hindi = await translateToHindi(value);

                setFormData((prev) => ({
                    ...prev,
                    fatherName: value,
                    fatherNameHindi: hindi || ""
                }));
            } catch (error) {
                console.error("Hindi Translation Error:", error);
            }
        }
    };

    // =========================
    // Select Helper
    // =========================

    const makeOptions = (data) => {
        return data.map((item) => ({
            value: item.id,
            label: item.name
        }));
    };

    // =========================
    // Academic Change
    // =========================

    const handleAcademicChange = (index, e) => {
        const { name, value, files, type } = e.target;

        setFormData((prev) => {
            const academicDetails = [...prev.academicDetails];

            academicDetails[index] = {
                ...academicDetails[index],
                [name]:
                    type === "file"
                        ? files?.[0] || null
                        : value
            };

            return {
                ...prev,
                academicDetails
            };
        });
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
                    file: null
                }
            ]
        }));
    };

    const removeAcademicRow = (index) => {
        setFormData((prev) => {
            if (prev.academicDetails.length === 1) {
                return prev;
            }

            return {
                ...prev,
                academicDetails:
                    prev.academicDetails.filter(
                        (_, i) => i !== index
                    )
            };
        });
    };

    // =========================
    // Number Input
    // =========================

    const handleNumberChange = (name, maxLength, e) => {
        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, maxLength);

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // =========================
    // Validation
    // =========================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.examSessionId) {
            newErrors.examSessionId =
                "Session is required";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Student name is required";
        }

        if (!formData.fatherName.trim()) {
            newErrors.fatherName =
                "Father name is required";
        }

        if (!formData.mobileNo.trim()) {
            newErrors.mobileNo =
                "Mobile number is required";
        } else if (formData.mobileNo.length !== 10) {
            newErrors.mobileNo =
                "Enter valid 10 digit mobile number";
        }

        if (!formData.email.trim()) {
            newErrors.email =
                "Email address is required";
        }

        if (!formData.address.trim()) {
            newErrors.address =
                "Address is required";
        }

        if (!formData.selfImage1) {
            newErrors.selfImage1 =
                "Student photo is required";
        }

        if (!formData.courseTypeId) {
            newErrors.courseTypeId =
                "Programme is required";
        }

        if (!formData.courseCategoryId) {
            newErrors.courseCategoryId =
                "Course category is required";
        }

        if (!formData.courseId) {
            newErrors.courseId =
                "Course is required";
        }

        // Academic Details
        const academic = formData.academicDetails?.[0];

        if (!academic || !academic.levelTypeId) {
            toast.error("Please add at least one academic detail");
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
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }

        if (!isDeclarationAccepted) {
            alert("Please accept the Declaration & Undertaking.");
            return;
        }

        try {
            setIsSubmitting(true);



            const result = await createStudentfordata(formData);

            // Sirf Successfully hone par Success page par jayega
            if (result?.message === "Successfully") {
                navigate("/success", {
                    state: {
                        printmsg: result?.printmsg || ""
                    }
                });

                return;
            }


        } catch (error) {
            console.error("Create Student Error:", error);

            alert(
                error?.response?.data?.message ||
                "Unable to create student"
            );

        } finally {
            setIsSubmitting(false);
        }
    };


    // =========================
    // Select Change
    // =========================

    const handleSelectChange = (
        name,
        selectedOption
    ) => {
        const id = selectedOption
            ? Number(selectedOption.value)
            : 0;

        setFormData((prev) => ({
            ...prev,
            [name]: id
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // =========================
    // Course Type Change
    // =========================

    const handleCourseTypeChange = (
        selectedOption
    ) => {
        const id = selectedOption
            ? Number(selectedOption.value)
            : 0;

        setFormData((prev) => ({
            ...prev,
            courseTypeId: id,
            courseCategoryId: 0,
            courseId: 0
        }));

        setCourseCategories([]);
        setCourses([]);

        if (id) {
            loadCourseCategory(id);
        }
    };

    // =========================
    // Course Category Change
    // =========================

    const handleCourseCategoryChange = (
        selectedOption
    ) => {
        const id = selectedOption
            ? Number(selectedOption.value)
            : 0;

        setFormData((prev) => ({
            ...prev,
            courseCategoryId: id,
            courseId: 0
        }));

        setCourses([]);

        if (id) {
            loadCourse(id);
        }
    };

    // =========================
    // State Change
    // =========================

    const handleStateChange = (
        selectedOption
    ) => {
        const id = selectedOption
            ? Number(selectedOption.value)
            : 0;

        setFormData((prev) => ({
            ...prev,
            stateId: id,
            districtId: 0,
            locationId: 0
        }));

        setDistricts([]);
        setCities([]);

        if (id) {
            loadDistrict(id);
        }
    };

    // =========================
    // District Change
    // =========================

    const handleDistrictChange = (
        selectedOption
    ) => {
        const id = selectedOption
            ? Number(selectedOption.value)
            : 0;

        setFormData((prev) => ({
            ...prev,
            districtId: id,
            locationId: 0
        }));

        setCities([]);

        if (id) {
            loadCity(id);
        }
    };

    // =========================
    // Reusable Select
    // =========================

    const getSelected = (data, id) => {
        return data
            .map((item) => ({
                value: item.id,
                label: item.name
            }))
            .find(
                (item) =>
                    Number(item.value) ===
                    Number(id)
            ) || null;
    };

    return (
        <>
            {/* Aapka Student Registration Form */}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />
            <div className="student-registration-page">


                {/* =====================================
                PAGE HEADER
            ===================================== */}

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
                    MAIN CARD
                ===================================== */}

                    <div className="registration-card">

                        <div className="registration-top">
                            <div>
                                <h4>
                                    <i className="bi bi-person-vcard"></i>
                                    Student Registration Form
                                </h4>

                                <p>
                                    Please enter all required
                                    information carefully.
                                </p>
                            </div>

                            <div className="required-info">
                                <span>*</span>
                                Required Fields
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="registration-form"
                        >

                            {/* =====================================
                            COURSE DETAILS
                        ===================================== */}

                            <div className="form-section">

                                <div className="section-heading">
                                    <div className="section-icon blue">
                                        <i className="bi bi-book-half"></i>
                                    </div>

                                    <div>
                                        <h5>Course Details</h5>
                                        <p>
                                            Select programme, mode,
                                            category and course
                                        </p>
                                    </div>
                                </div>

                                <div className="row">


                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Programme
                                            <span>*</span>
                                        </label>

                                        <Select
                                            options={makeOptions(
                                                courseTypes
                                            )}
                                            value={getSelected(
                                                courseTypes,
                                                formData.courseTypeId
                                            )}
                                            onChange={
                                                handleCourseTypeChange
                                            }
                                            placeholder="Select programme"
                                            isSearchable
                                            isClearable
                                            classNamePrefix="student-select"
                                        />

                                        {errors.courseTypeId && (
                                            <ErrorText
                                                text={
                                                    errors.courseTypeId
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Course Category
                                            <span>*</span>
                                        </label>

                                        <Select
                                            options={makeOptions(
                                                courseCategories
                                            )}
                                            value={getSelected(
                                                courseCategories,
                                                formData.courseCategoryId
                                            )}
                                            onChange={
                                                handleCourseCategoryChange
                                            }
                                            placeholder={
                                                formData.courseTypeId
                                                    ? "Select category"
                                                    : "Select programme first"
                                            }
                                            isSearchable
                                            isClearable
                                            isDisabled={
                                                !formData.courseTypeId
                                            }
                                            classNamePrefix="student-select"
                                        />

                                        {errors.courseCategoryId && (
                                            <ErrorText
                                                text={
                                                    errors.courseCategoryId
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Course
                                            <span>*</span>
                                        </label>

                                        <Select
                                            options={makeOptions(
                                                courses
                                            )}
                                            value={getSelected(
                                                courses,
                                                formData.courseId
                                            )}
                                            onChange={(option) =>
                                                handleSelectChange(
                                                    "courseId",
                                                    option
                                                )
                                            }
                                            placeholder={
                                                formData.courseCategoryId
                                                    ? "Select course"
                                                    : "Select category first"
                                            }
                                            isSearchable
                                            isClearable
                                            isDisabled={
                                                !formData.courseCategoryId
                                            }
                                            classNamePrefix="student-select"
                                        />

                                        {errors.courseId && (
                                            <ErrorText
                                                text={
                                                    errors.courseId
                                                }
                                            />
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* =====================================
                            PERSONAL DETAILS
                        ===================================== */}

                            <div className="form-section">

                                <div className="section-heading">
                                    <div className="section-icon green">
                                        <i className="bi bi-person-vcard-fill"></i>
                                    </div>

                                    <div>
                                        <h5>Personal Details</h5>
                                        <p>
                                            Enter student's personal
                                            information
                                        </p>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Session
                                            <span>*</span>
                                        </label>

                                        <Select
                                            options={makeOptions(
                                                masterSessions
                                            )}
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
                                            <ErrorText
                                                text={
                                                    errors.examSessionId
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Student Name
                                            <span>*</span>
                                        </label>

                                        <InputField
                                            icon="bi-person"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter student name"
                                        />

                                        {errors.name && (
                                            <ErrorText
                                                text={errors.name}
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Student Name (Hindi)
                                        </label>

                                        <InputField
                                            icon="bi-translate"
                                            name="studentNameHindi"
                                            value={
                                                formData.studentNameHindi
                                            }
                                            onChange={handleChange}
                                            placeholder="हिंदी में नाम"
                                        />
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Date of Birth
                                        </label>

                                        <InputField
                                            type="date"
                                            icon="bi-calendar3"
                                            name="dateOfBirth"
                                            value={
                                                formData.dateOfBirth
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Father's Name
                                            <span>*</span>
                                        </label>

                                        <InputField
                                            icon="bi-person-badge"
                                            name="fatherName"
                                            value={
                                                formData.fatherName
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter father's name"
                                        />

                                        {errors.fatherName && (
                                            <ErrorText
                                                text={
                                                    errors.fatherName
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Father's Name (Hindi)
                                        </label>

                                        <InputField
                                            icon="bi-translate"
                                            name="fatherNameHindi"
                                            value={
                                                formData.fatherNameHindi
                                            }
                                            onChange={handleChange}
                                            placeholder="हिंदी में पिता का नाम"
                                        />
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Mother's Name
                                        </label>

                                        <InputField
                                            icon="bi-person-heart"
                                            name="motherName"
                                            value={
                                                formData.motherName
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter mother's name"
                                        />
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Aadhaar Number
                                        </label>

                                        <InputField
                                            icon="bi-credit-card-2-front"
                                            name="idNumber"
                                            value={
                                                formData.idNumber
                                            }
                                            onChange={(e) =>
                                                handleNumberChange(
                                                    "idNumber",
                                                    12,
                                                    e
                                                )
                                            }
                                            placeholder="Enter 12 digit Aadhaar"
                                            maxLength={12}
                                        />
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>
                                            Gender
                                        </label>

                                        <Select
                                            options={makeOptions(
                                                genders
                                            )}
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
                                        <label>
                                            Caste Category
                                        </label>

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

                            {/* =====================================
                            ACADEMIC DETAILS
                        ===================================== */}

                            <div className="form-section">

                                <div className="section-heading">
                                    <div className="section-icon purple">
                                        <i className="bi bi-mortarboard-fill"></i>
                                    </div>

                                    <div>
                                        <h5>Academic Details</h5>
                                        <p>
                                            Add student's educational qualifications
                                        </p>
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

                                                            {/* ================= FIRST ROW ================= */}
                                                            <tr className="academic-row">

                                                                {/* Sr. No. */}
                                                                <td rowSpan={2} className="academic-sr-no">
                                                                    {index + 1}
                                                                </td>


                                                                {/* Level */}
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
                                                                        onChange={(
                                                                            selectedOption
                                                                        ) =>
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
                                                                        menuPortalTarget={
                                                                            document.body
                                                                        }
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

                                                                {/* School / College */}
                                                                <td>
                                                                    <label className="academic-mobile-label">
                                                                        School / College
                                                                    </label>

                                                                    <input
                                                                        type="text"
                                                                        name="schoolCollege"
                                                                        className="table-input"
                                                                        placeholder="School / College"
                                                                        value={
                                                                            academic.schoolCollege
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleAcademicChange(
                                                                                index,
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                </td>

                                                                {/* Roll No */}
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


                                                            {/* ================= SECOND ROW ================= */}
                                                            <tr className="academic-row">

                                                                {/* Board / University */}
                                                                <td>
                                                                    <label className="academic-mobile-label">
                                                                        Board / University
                                                                    </label>

                                                                    <input
                                                                        type="text"
                                                                        name="boardUniversity"
                                                                        className="table-input"
                                                                        placeholder="Board / University"
                                                                        value={
                                                                            academic.boardUniversity
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleAcademicChange(
                                                                                index,
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                </td>

                                                                {/* Percentage / CGPA */}
                                                                <td>
                                                                    <label className="academic-mobile-label">
                                                                        Percentage / CGPA
                                                                    </label>

                                                                    <input
                                                                        type="text"
                                                                        name="percentageCgpa"
                                                                        className="table-input"
                                                                        placeholder="Percentage / CGPA"
                                                                        value={
                                                                            academic.percentageCgpa
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleAcademicChange(
                                                                                index,
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                </td>

                                                                {/* Document + Action */}
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
                                                                                    {
                                                                                        academic
                                                                                            .file
                                                                                            .name
                                                                                    }
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
                                                                                    .length ===
                                                                                1
                                                                            }
                                                                            title="Remove Qualification"
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



                            {/* =====================================
                            CONTACT & ADDRESS
                        ===================================== */}

                            <div className="form-section">

                                <div className="section-heading">
                                    <div className="section-icon orange">
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </div>

                                    <div>
                                        <h5>Contact & Address Details</h5>
                                        <p>
                                            Enter student's contact and
                                            residential details
                                        </p>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-lg-6 col-md-6 mb-4">
                                        <label>
                                            Mobile Number
                                            <span>*</span>
                                        </label>

                                        <InputField
                                            type="tel"
                                            icon="bi-phone"
                                            name="mobileNo"
                                            value={
                                                formData.mobileNo
                                            }
                                            onChange={(e) =>
                                                handleNumberChange(
                                                    "mobileNo",
                                                    10,
                                                    e
                                                )
                                            }
                                            placeholder="Enter 10 digit mobile number"
                                            maxLength={10}
                                        />

                                        {errors.mobileNo && (
                                            <ErrorText
                                                text={
                                                    errors.mobileNo
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-6 col-md-6 mb-4">
                                        <label>
                                            Email Address
                                            <span>*</span>
                                        </label>

                                        <InputField
                                            type="email"
                                            icon="bi-envelope"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter email address"
                                        />

                                        {errors.email && (
                                            <ErrorText
                                                text={errors.email}
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>State</label>

                                        <Select
                                            options={makeOptions(
                                                states
                                            )}
                                            value={getSelected(
                                                states,
                                                formData.stateId
                                            )}
                                            onChange={
                                                handleStateChange
                                            }
                                            placeholder="Select state"
                                            isSearchable
                                            isClearable
                                            classNamePrefix="student-select"
                                        />
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>District</label>

                                        <Select
                                            options={makeOptions(
                                                districts
                                            )}
                                            value={getSelected(
                                                districts,
                                                formData.districtId
                                            )}
                                            onChange={
                                                handleDistrictChange
                                            }
                                            placeholder={
                                                formData.stateId
                                                    ? "Select district"
                                                    : "Select state first"
                                            }
                                            isSearchable
                                            isClearable
                                            isDisabled={
                                                !formData.stateId
                                            }
                                            classNamePrefix="student-select"
                                        />
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <label>City</label>

                                        <Select
                                            options={makeOptions(
                                                cities
                                            )}
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
                                            isDisabled={
                                                !formData.districtId
                                            }
                                            classNamePrefix="student-select"
                                        />
                                    </div>

                                    <div className="col-lg-8 col-md-8 mb-4">
                                        <label>
                                            Address
                                            <span>*</span>
                                        </label>

                                        <div className="input-icon-box textarea-icon">
                                            <i className="bi bi-house-door"></i>

                                            <textarea
                                                name="address"
                                                className="form-control"
                                                rows="3"
                                                value={
                                                    formData.address
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter complete residential address"
                                            ></textarea>
                                        </div>

                                        {errors.address && (
                                            <ErrorText
                                                text={
                                                    errors.address
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="col-lg-4 col-md-4 mb-4">
                                        <label>Pin Code</label>

                                        <InputField
                                            type="text"
                                            icon="bi-geo"
                                            name="pincode"
                                            value={
                                                formData.pincode
                                            }
                                            onChange={(e) =>
                                                handleNumberChange(
                                                    "pincode",
                                                    6,
                                                    e
                                                )
                                            }
                                            placeholder="Enter 6 digit PIN"
                                            maxLength={6}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* =====================================
                            DOCUMENT DETAILS
                        ===================================== */}

                            <div className="form-section">

                                <div className="section-heading">
                                    <div className="section-icon red">
                                        <i className="bi bi-file-earmark-image-fill"></i>
                                    </div>

                                    <div>
                                        <h5>Document Details</h5>
                                        <p>
                                            Upload student's required
                                            documents
                                        </p>
                                    </div>
                                </div>

                                <div className="row">

                                    <DocumentUpload
                                        label="Student Photo"
                                        required
                                        name="selfImage1"
                                        file={
                                            formData.selfImage1
                                        }
                                        error={
                                            errors.selfImage1
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        icon="bi-person-square"
                                        accept="image/*"
                                    />

                                    <DocumentUpload
                                        label="Signature Image"
                                        name="signatureImage1"
                                        file={
                                            formData.signatureImage1
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        icon="bi-pen"
                                        accept="image/*"
                                    />

                                    <DocumentUpload
                                        label="Aadhaar Front"
                                        name="aadhaarCardFrant1"
                                        file={
                                            formData.aadhaarCardFrant1
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        icon="bi-credit-card"
                                        accept="image/*"
                                    />

                                    <DocumentUpload
                                        label="Aadhaar Back"
                                        name="aadhaarCardBack1"
                                        file={
                                            formData.aadhaarCardBack1
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        icon="bi-credit-card-2-back"
                                        accept="image/*"
                                    />

                                </div>
                            </div>

                            {/* =====================================
                            DECLARATION
                        ===================================== */}

                            <div className="declaration-card">

                                <div className="declaration-header">

                                    <div className="declaration-icon">
                                        <i className="bi bi-shield-check"></i>
                                    </div>

                                    <div>
                                        <h5>
                                            Declaration &
                                            Undertaking
                                        </h5>

                                        <p>
                                            Please read the declaration
                                            before submitting the form.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="view-declaration-btn"
                                        onClick={() =>
                                            setShowDeclarationModal(
                                                true
                                            )
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
                                        checked={
                                            isDeclarationAccepted
                                        }
                                        onChange={(e) =>
                                            setIsDeclarationAccepted(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <label htmlFor="declarationCheck">
                                        I hereby declare that I have
                                        read, understood, and accept
                                        all the terms and conditions
                                        mentioned above. I confirm
                                        that all the information
                                        provided in this application
                                        is true and correct to the
                                        best of my knowledge.
                                    </label>

                                </div>

                            </div>

                            {/* =====================================
                            FOOTER
                        ===================================== */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        navigate(
                                            "/student-list"
                                        )
                                    }
                                >
                                    <i className="bi bi-x-lg"></i>
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={
                                        !isDeclarationAccepted ||
                                        isSubmitting
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
                </div>

                {/* =====================================
                DECLARATION MODAL
            ===================================== */}

                {showDeclarationModal && (
                    <div className="declaration-overlay">

                        <div className="declaration-modal">

                            <div className="modal-header-custom">

                                <div>
                                    <i className="bi bi-file-earmark-check-fill"></i>

                                    <div>
                                        <h5>
                                            Declaration &
                                            Undertaking
                                        </h5>

                                        <small>
                                            Please read carefully
                                        </small>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeclarationModal(
                                            false
                                        )
                                    }
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>

                            </div>

                            <div className="modal-body-custom">

                                <h5>
                                    Declaration by Candidate
                                </h5>

                                <p>
                                    We (Candidate){" "}
                                    <strong>
                                        {formData.name ||
                                            "Candidate"}
                                    </strong>{" "}
                                    s/o, d/o, h/o, w/o{" "}
                                    <strong>
                                        {formData.fatherName ||
                                            "Parent/Guardian"}
                                    </strong>{" "}
                                    hereby declare that the entries
                                    made in this form are true and
                                    correct. We have carefully read
                                    all terms and conditions, rules
                                    and regulations as stipulated in
                                    the prospectus and shall abide by
                                    the same.
                                </p>

                                <p>
                                    We also undertake that we will
                                    not discontinue the course in any
                                    circumstances before the
                                    completion of the course. However,
                                    if this happens due to any
                                    unavoidable / unforeseen
                                    circumstances, we shall be liable
                                    to pay the fees of full course
                                    duration remaining to be
                                    completed.
                                </p>

                                <p>
                                    We also undertake not to claim any
                                    refunds of tuition fee, hostel
                                    charges or any other funds
                                    deposits. We undertake not to
                                    indulge into any legal proceeding.
                                    In case of any unavoidable
                                    circumstances, court jurisdiction
                                    will be Delhi only.
                                </p>

                                <hr />

                                <h5>
                                    Undertaking by The Applicant
                                </h5>

                                <p>
                                    I declare that I have not been
                                    debarred from joining any
                                    educational institution or
                                    rusticated from the Institution /
                                    Board last attended.
                                </p>

                                <p>
                                    I declare that all the statements
                                    made in the application by me are
                                    true to the best of my knowledge
                                    and belief. I clearly understand
                                    that if any of the statements
                                    subsequently found untrue, my
                                    admission to the Institution would
                                    stand automatically cancelled,
                                    without any claim for refund.
                                </p>

                                <p>
                                    I have read the rules &
                                    regulations regarding admission
                                    criteria made by the Institution
                                    and instructions incorporated
                                    therein carefully. I have read
                                    and understood the conditions of
                                    eligibility for the programme to
                                    which I seek admission. I fulfill
                                    the minimum eligibility criteria.
                                </p>

                                <p>
                                    In the event of any information
                                    being incorrect or misleading my
                                    candidature shall be liable to
                                    cancellation by the Institution at
                                    any time and I shall not be
                                    entitled to refund of any fee paid
                                    by me to the Institution.
                                </p>

                                <p>
                                    I have satisfied myself that I
                                    fulfill the minimum educational,
                                    physical and medical standards and
                                    that I agree to be removed from
                                    the institution if found deficient
                                    in these standards during the
                                    course.
                                </p>

                                <p>
                                    I agree that admission may be
                                    granted to me on the conditions
                                    stated in the latest edition of
                                    the prospectus / syllabus
                                    prescribed by the Institution or
                                    such modification thereof as may
                                    be made by the authorities.
                                </p>

                                <p>
                                    I have read the rules, regulations
                                    and code of conduct as prescribed
                                    by the Institution and promise to
                                    abide by them and those that may be
                                    made in future for the admission.
                                    I also undertake that I shall do
                                    nothing inside or outside the
                                    Institution Campus that will
                                    interfere with its discipline.
                                </p>

                                <p>
                                    I undertake to pay the dues of
                                    college, hostel and other dues
                                    regularly if admitted.
                                </p>

                                <p className="fw-bold">
                                    I also declare that:
                                </p>

                                <ol type="A">

                                    <li>
                                        I have never been convicted
                                        of any criminal offence, nor
                                        have I ever been released on
                                        bail in connection with a
                                        criminal case.
                                    </li>

                                    <li>
                                        No case of criminal offence
                                        or moral turpitude is
                                        pending against me in any
                                        Court of law.
                                    </li>

                                    <li>
                                        No complaint of F.I.R. has
                                        ever been lodged against me
                                        by the School / Institution.
                                    </li>

                                    <li>
                                        I have not been debarred from
                                        appearing by Coordination
                                        Committee.
                                    </li>

                                    <li>
                                        Admission is purely on
                                        temporary basis subject to
                                        confirmation by the
                                        Institution concerned. In all
                                        matters court jurisdiction
                                        will be Delhi only.
                                    </li>

                                </ol>

                                <p>
                                    In case it is found at any stage
                                    by the Institution or other
                                    authority that I am not eligible
                                    for admission / course, I shall
                                    have no claim for the refund of
                                    fees and will not make any legal
                                    dispute.
                                </p>

                                <p>
                                    I accept that if any above
                                    undertaking is missing I agree to
                                    be prosecuted by the court of law
                                    for providing fake acceptance
                                    statement / declaration.
                                </p>

                                <div className="modal-accept-box">

                                    <input
                                        type="checkbox"
                                        id="modalDeclarationCheck"
                                        checked={
                                            isDeclarationAccepted
                                        }
                                        onChange={(e) =>
                                            setIsDeclarationAccepted(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <label htmlFor="modalDeclarationCheck">
                                        I hereby declare that I have
                                        read, understood, and accept
                                        all the terms and conditions
                                        mentioned above. I confirm
                                        that all the information
                                        provided in this application
                                        is true and correct to the
                                        best of my knowledge.
                                    </label>

                                </div>

                            </div>

                            <div className="modal-footer-custom">

                                <button
                                    type="button"
                                    className="modal-close-btn"
                                    onClick={() =>
                                        setShowDeclarationModal(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="modal-accept-btn"
                                    disabled={
                                        !isDeclarationAccepted
                                    }
                                    onClick={() =>
                                        setShowDeclarationModal(
                                            false
                                        )
                                    }
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
// Reusable Input Component
// =============================================

const InputField = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    icon,
    maxLength
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
            />
        </div>
    );
};

// =============================================
// Error Component
// =============================================

const ErrorText = ({ text }) => {
    return (
        <div className="field-error">
            <i className="bi bi-exclamation-circle"></i>
            {text}
        </div>
    );
};

// =============================================
// Document Upload Component
// =============================================

const DocumentUpload = ({
    label,
    required,
    name,
    file,
    error,
    onChange,
    icon,
    accept
}) => {
    return (
        <div className="col-lg-3 col-md-6 mb-4">

            <label>
                {label}
                {required && <span>*</span>}
            </label>

            <div
                className={`document-upload ${error ? "has-error" : ""
                    }`}
            >
                <div className="document-icon">
                    <i className={`bi ${icon}`}></i>
                </div>

                <div className="document-content">

                    <div className="document-title">
                        {file
                            ? "File Selected"
                            : "Choose File"}
                    </div>

                    <div className="document-subtitle">
                        JPG, PNG or PDF
                    </div>

                    <input
                        type="file"
                        name={name}
                        accept={accept}
                        onChange={onChange}
                    />

                    {file && (
                        <div className="selected-file">
                            <i className="bi bi-check-circle-fill"></i>

                            <span>
                                {file.name}
                            </span>
                        </div>
                    )}

                </div>

            </div>

            {error && (
                <ErrorText text={error} />
            )}

            {/* ================= PART 2 CSS ================= */}
            <style>{`

/* =========================================================
   STUDENT REGISTRATION
   ========================================================= */

.student-registration-page {
    min-height: 100vh;
    background:
        radial-gradient(
            circle at top left,
            rgba(25, 135, 84, 0.07),
            transparent 30%
        ),
        #f5f7fb;

    padding: 25px 0 50px;
    color: #253044;
}


/* =========================================================
   PAGE HEADING
   ========================================================= */

 
  
  .acc-logo-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 25px;
                }

                .acc-logo-card {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 270px;
                    min-height: 82px;
                    padding: 10px 22px;
                    background: #ffffff;
                    border-radius: 18px;
                    border: 1px solid rgba(255, 102, 0, 0.12);

                    box-shadow:
                        0 10px 30px rgba(20, 30, 50, 0.08),
                        0 2px 8px rgba(20, 30, 50, 0.04);

                    transition: all 0.3s ease;
                }

                .acc-logo-card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 65px;
                    height: 3px;
                    border-radius: 0 0 10px 10px;
                    background: linear-gradient(
                        90deg,
                        #07567f,
                        #e65300
                    );
                }

                .acc-logo-card:hover {
                    transform: translateY(-3px);

                    box-shadow:
                        0 15px 38px rgba(20, 30, 50, 0.12);
                }

                .sbshe-acc-logo {
                    width: 100%;
                    max-width: 220px;
                    max-height: 62px;
                    object-fit: contain;
                    display: block;
                }
 
 

 
/* =========================================================
   BREADCRUMB
   ========================================================= */

.breadcrumb-custom {
    display: flex;
    align-items: center;
    gap: 8px;

    margin-bottom: 20px;

    color: #8a94a6;

    font-size: 12px;
}

.breadcrumb-custom span {
    cursor: pointer;
    transition: color 0.2s ease;
}

.breadcrumb-custom span:hover {
    color: #198754;
}

.breadcrumb-custom i {
    font-size: 9px;
    color: #b2bac7;
}

.breadcrumb-custom strong {
    color: #4b5563;
    font-weight: 600;
}


/* =========================================================
   MAIN CARD
   ========================================================= */

.registration-card {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;

    background: #fff;
    border-radius: 16px;
    border: 1px solid #e9edf3;

    box-shadow:
        0 10px 35px rgba(31, 41, 55, 0.06);

    overflow: hidden;
}



/* =========================================================
   TOP HEADER
   ========================================================= */

.registration-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 21px 28px;

     background:
                        linear-gradient(
                            135deg,
                            #07567f 0%,
                            #f45b00 55%,
                            #db4800 100%
                        );

    color: #fff;
}

.registration-top h4 {
    margin: 0;

    font-size: 19px;
    font-weight: 700;
}

.registration-top h4 i {
    margin-right: 9px;
}

.registration-top p {
    margin: 5px 0 0;

    font-size: 12px;

    color: rgba(255, 255, 255, 0.82);
}

.required-info {
    padding: 7px 12px;

    border-radius: 20px;

    background: rgba(230, 42, 42, 0.14);

    font-size: 11px;
}

.required-info span {
    color: #ffd6d6;

    font-weight: 800;

    margin-right: 4px;
}


/* =========================================================
   FORM
   ========================================================= */

.registration-form {
    padding: 28px;
}

.form-section {
    margin-bottom: 30px;
}

.form-section:last-of-type {
    margin-bottom: 22px;
}


/* =========================================================
   SECTION HEADING
   ========================================================= */

.section-heading {
    position: relative;

    display: flex;
    align-items: center;

    gap: 12px;

    margin-bottom: 22px;

    padding-bottom: 13px;

    border-bottom: 1px solid #edf0f4;
}

.section-heading::after {
    content: "";

    position: absolute;

    left: 0;
    bottom: -1px;

    width: 65px;
    height: 2px;

    border-radius: 10px;

    background: #198754;
}

.section-heading > div:nth-child(2) {
    flex: 1;
}

.section-icon {
    width: 42px;
    height: 42px;

    min-width: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    font-size: 17px;
}

.section-icon.blue {
    background: #eaf3ff;
    color: #1473d4;
}

.section-icon.green {
    background: #e8f8f0;
    color: #198754;
}

.section-icon.purple {
    background: #f2edff;
    color: #7952d8;
}

.section-icon.orange {
    background: #fff2e7;
    color: #e87917;
}

.section-icon.red {
    background: #ffeded;
    color: #dc3545;
}

.section-heading h5 {
    margin: 0;

    font-size: 16px;
    font-weight: 700;

    color: #263244;
}

.section-heading p {
    margin: 3px 0 0;

    font-size: 11px;

    color: #929aaa;
}


/* =========================================================
   LABEL
   ========================================================= */

.registration-form label {
    display: block;

    margin-bottom: 7px;

    color: #3c4656;

    font-size: 12px;
    font-weight: 650;
}

.registration-form label span {
    color: #dc3545;

    margin-left: 3px;

    font-size: 13px;
}


/* =========================================================
   INPUT
   ========================================================= */

.input-icon-box {
    position: relative;
}

.input-icon-box > i {
    position: absolute;

    left: 14px;
    top: 50%;

    transform: translateY(-50%);

    z-index: 2;

    color: #198754;

    font-size: 14px;

    pointer-events: none;
}

.input-icon-box .form-control {
    padding-left: 40px;
}

.form-control {
    height: 43px;

    border: 1px solid #dce2e9;

    border-radius: 8px;

    background: #fff;

    color: #303846;

    font-size: 12px;

    box-shadow: none;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
}

.form-control::placeholder {
    color: #a7afbc;
}

.form-control:hover {
    border-color: #c7d0dc;
}

.form-control:focus {
    border-color: #198754;

    box-shadow:
        0 0 0 3px rgba(25, 135, 84, 0.09);

    background: #fff;
}

textarea.form-control {
    height: auto;

    resize: vertical;

    min-height: 100px;
}

.textarea-icon {
    position: relative;
}

.textarea-icon > i {
    position: absolute;

    left: 14px;
    top: 14px;

    color: #198754;

    font-size: 14px;

    z-index: 2;
}

.textarea-icon textarea {
    padding-left: 40px;
}


/* =========================================================
   REACT SELECT
   ========================================================= */

.student-select__control {
    min-height: 43px !important;

    height: 43px;

    border-radius: 8px !important;

    border-color: #dce2e9 !important;

    box-shadow: none !important;

    font-size: 12px;

    transition: all 0.2s ease !important;
}

.student-select__control:hover {
    border-color: #c7d0dc !important;
}

.student-select__control--is-focused {
    border-color: #198754 !important;

    box-shadow:
        0 0 0 3px rgba(25, 135, 84, 0.09) !important;
}

.student-select__value-container {
    padding-left: 12px !important;
}

.student-select__placeholder {
    color: #a7afbc !important;
}

.student-select__single-value {
    color: #303846 !important;
}

.student-select__input-container {
    color: #303846 !important;
}

.student-select__menu {
    z-index: 100 !important;

    border-radius: 9px !important;

    overflow: hidden;

    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.12) !important;

    font-size: 12px;
}

.student-select__option {
    padding: 9px 12px !important;

    cursor: pointer;
}

.student-select__option--is-focused {
    background: #eaf8f1 !important;

    color: #198754 !important;
}

.student-select__option--is-selected {
    background: #198754 !important;

    color: #fff !important;
}


/* =========================================================
   ERROR
   ========================================================= */

.field-error {
    display: flex;
    align-items: center;

    gap: 4px;

    margin-top: 5px;

    color: #dc3545;

    font-size: 10.5px;

    font-weight: 500;
}


/* =========================================================
   ACADEMIC SECTION
   ========================================================= */

.add-academic-btn {
    display: flex;
    align-items: center;
    gap: 6px;

    border: none;

    background: #198754;

    color: #fff;

    padding: 8px 13px;

    border-radius: 7px;

    font-size: 11px;
    font-weight: 650;

    cursor: pointer;

    transition: all 0.2s ease;
}

.add-academic-btn:hover {
    background: #157347;

    transform: translateY(-1px);

    box-shadow:
        0 4px 12px rgba(25, 135, 84, 0.2);
}


/* =========================================================
   ACADEMIC TABLE - 3 COLUMNS / 2 ROWS
   ========================================================= */

.academic-wrapper {
    width: 100%;

    border: 1px solid #e4e8ee;

    border-radius: 10px;

    overflow: hidden;

    background: #fff;
}

.academic-table {
    width: 100%;

    margin: 0;

    border-collapse: separate;

    border-spacing: 0;

    table-layout: fixed;

    min-width: 0;
}


/* Header */

.academic-table thead th {
    width: 33.333%;

    padding: 11px 12px;

    background: #f0f9f4;

    color: #256044;

    border-bottom: 1px solid #dfe9e3;

    font-size: 11px;
    font-weight: 700;

    text-align: left;

    white-space: nowrap;
}


/* Body cells */

.academic-table tbody td {
    width: 33.333%;

    padding: 10px 12px;

    border-bottom: 1px solid #edf0f3;

    background: #fff;

    vertical-align: middle;
}


/* Every qualification's second row */

.academic-table tbody tr.academic-row:last-of-type td {
    border-bottom: 1px solid #edf0f3;
}


/* Hover */

.academic-table tbody tr.academic-row:hover td {
    background: #fbfdfc;
}

.academic-table th:first-child,
.academic-table td:first-child {
    width: 45px;
    min-width: 45px;
    max-width: 45px;
    text-align: left;
    padding: 8px 6px;
}

.academic-sr-no {
    font-size: 13px;
    font-weight: 500;
    text-align: left;
}

/* Input */

.academic-table .table-input {
    width: 100%;

    height: 38px;

    box-sizing: border-box;

    border: 1px solid #dce2e9;

    border-radius: 6px;

    padding: 0 9px;

    outline: none;

    color: #374151;

    font-size: 11px;

    background: #fff;

    transition: all 0.2s ease;
}

.academic-table .table-input::placeholder {
    color: #a7afbc;
}

.academic-table .table-input:hover {
    border-color: #c7d0dc;
}

.academic-table .table-input:focus {
    border-color: #198754;

    box-shadow:
        0 0 0 2px rgba(25, 135, 84, 0.08);
}


/* React Select inside academic table */

.academic-table .student-select__control {
    width: 100%;

    min-height: 38px !important;

    height: 38px;

    box-sizing: border-box;
}


/* File input */

.academic-table .file-table-input {
    width: 100%;

    height: 38px;

    box-sizing: border-box;

    border: 1px solid #dce2e9;

    border-radius: 6px;

    padding: 7px;

    font-size: 10px;

    color: #657080;

    background: #fff;
}

.academic-table .file-table-input::file-selector-button {
    border: none;

    background: #198754;

    color: #fff;

    padding: 5px 8px;

    border-radius: 5px;

    margin-right: 5px;

    cursor: pointer;

    font-size: 9px;
}


/* Selected file name */

.academic-table .file-name {
    display: block;

    margin-top: 4px;

    color: #198754;

    font-size: 9px;

    max-width: 100%;

    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;
}

.academic-table .file-name i {
    margin-right: 3px;
}


/* =========================================================
   DOCUMENT + ACTION
   ========================================================= */

.document-action-wrapper {
    display: flex;

    align-items: center;

    gap: 8px;

    width: 100%;
}

.document-input-wrapper {
    flex: 1;

    min-width: 0;
}

.document-input-wrapper .file-table-input {
    width: 100%;
}


/* Delete button */

.academic-table .delete-row-btn {
    width: 38px;
    height: 38px;

    min-width: 38px;

    display: flex;

    align-items: center;

    justify-content: center;

    margin: 0;

    padding: 0;

    border: 1px solid #f1c7cb;

    background: #fff5f5;

    color: #dc3545;

    border-radius: 7px;

    cursor: pointer;

    transition: all 0.2s ease;
}

.academic-table .delete-row-btn:hover:not(:disabled) {
    background: #dc3545;

    border-color: #dc3545;

    color: #fff;
}

.academic-table .delete-row-btn:disabled {
    opacity: 0.4;

    cursor: not-allowed;
}


/* =========================================================
   LABELS FOR MOBILE
   ========================================================= */

.academic-mobile-label {
    display: none;
}


/* =========================================================
   QUALIFICATION SEPARATOR
   ========================================================= */

.academic-table tbody tr.academic-row:nth-child(2n) td {
    border-bottom: 8px solid #f5f7fb;
}


/* =========================================================
   DOCUMENT UPLOAD
   ========================================================= */

.document-upload {
    position: relative;

    display: flex;
    align-items: center;

    gap: 10px;

    min-height: 90px;

    padding: 12px;

    border: 1px dashed #cfd7e2;

    border-radius: 10px;

    background: #fbfcfe;

    transition: all 0.2s ease;

    overflow: hidden;
}

.document-upload:hover {
    border-color: #198754;

    background: #f7fcf9;
}

.document-upload.has-error {
    border-color: #dc3545;

    background: #fff8f8;
}

.document-icon {
    width: 40px;
    height: 40px;

    min-width: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #eaf8f1;

    color: #198754;

    border-radius: 9px;

    font-size: 17px;
}

.document-content {
    min-width: 0;

    flex: 1;
}

.document-title {
    color: #394454;

    font-size: 11px;
    font-weight: 700;
}

.document-subtitle {
    margin-top: 2px;

    color: #9aa3b0;

    font-size: 9px;
}

.document-content input[type="file"] {
    width: 100%;

    margin-top: 7px;

    color: #657080;

    font-size: 9px;
}

.document-content input[type="file"]::file-selector-button {
    border: none;

    background: #198754;

    color: #fff;

    padding: 5px 8px;

    border-radius: 5px;

    margin-right: 5px;

    cursor: pointer;

    font-size: 9px;
}

.selected-file {
    display: flex;
    align-items: center;

    gap: 4px;

    margin-top: 5px;

    color: #198754;

    font-size: 9px;

    max-width: 100%;

    overflow: hidden;
}

.selected-file i {
    flex-shrink: 0;
}

.selected-file span {
    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;
}


/* =========================================================
   DECLARATION
   ========================================================= */

.declaration-card {
    margin-top: 10px;

    padding: 20px;

    border: 1px solid #dcefe4;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            #f7fcf9,
            #f2faf6
        );
}

.declaration-header {
    display: flex;
    align-items: center;

    gap: 12px;

    margin-bottom: 17px;
}

.declaration-icon {
    width: 44px;
    height: 44px;

    min-width: 44px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    background: #dff5e9;

    color: #198754;

    font-size: 18px;
}

.declaration-header > div:nth-child(2) {
    flex: 1;
}

.declaration-header h5 {
    margin: 0;

    color: #245c40;

    font-size: 15px;
    font-weight: 700;
}

.declaration-header p {
    margin: 3px 0 0;

    color: #8a9b91;

    font-size: 10px;
}

.view-declaration-btn {
    border: 1px solid #b9dfc9;

    background: #fff;

    color: #198754;

    padding: 8px 12px;

    border-radius: 7px;

    font-size: 10px;
    font-weight: 650;

    cursor: pointer;

    transition: all 0.2s ease;
}

.view-declaration-btn i {
    margin-right: 5px;
}

.view-declaration-btn:hover {
    background: #198754;

    color: #fff;

    border-color: #198754;
}

.declaration-check {
    display: flex;
    align-items: flex-start;

    gap: 10px;

    padding: 13px;

    background: #fff;

    border: 1px solid #e2eee7;

    border-radius: 8px;
}

.declaration-check input {
    width: 17px;
    height: 17px;

    margin-top: 1px;

    accent-color: #198754;

    flex-shrink: 0;

    cursor: pointer;
}

.declaration-check label {
    margin: 0;

    color: #5f6b78;

    font-size: 11px;

    line-height: 1.65;

    cursor: pointer;
}


/* =========================================================
   FORM ACTIONS
   ========================================================= */

.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    gap: 10px;

    margin-top: 25px;

    padding-top: 20px;

    border-top: 1px solid #edf0f3;
}

.cancel-btn,
.submit-btn {
    min-width: 135px;

    height: 43px;

    border-radius: 8px;

    font-size: 12px;
    font-weight: 650;

    cursor: pointer;

    transition: all 0.2s ease;
}

.cancel-btn {
    border: 1px solid #dce2e9;

    background: #fff;

    color: #596474;
}

.cancel-btn i {
    margin-right: 6px;
}

.cancel-btn:hover {
    border-color: #adb7c4;

    background: #f8f9fa;
}

.submit-btn {
    border: none;

    background:
        linear-gradient(
            135deg,
            #198754,
            #20a86b
        );

    color: #fff;

    box-shadow:
        0 5px 15px rgba(25, 135, 84, 0.2);
}

.submit-btn i {
    margin-right: 7px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);

    box-shadow:
        0 8px 20px rgba(25, 135, 84, 0.28);
}

.submit-btn:disabled {
    background: #aab5af;

    box-shadow: none;

    cursor: not-allowed;

    opacity: 0.7;
}

.submit-btn .spinner-border {
    margin-right: 7px;
}


/* =========================================================
   DECLARATION MODAL
   ========================================================= */

.declaration-overlay {
    position: fixed;

    inset: 0;

    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;

    background: rgba(17, 24, 39, 0.72);

    backdrop-filter: blur(4px);
}

.declaration-modal {
    width: 100%;

    max-width: 950px;

    max-height: 90vh;

    display: flex;
    flex-direction: column;

    overflow: hidden;

    border-radius: 14px;

    background: #fff;

    box-shadow:
        0 25px 70px rgba(0, 0, 0, 0.25);

    animation: declarationModalIn 0.2s ease;
}

@keyframes declarationModalIn {
    from {
        opacity: 0;

        transform: translateY(15px) scale(0.98);
    }

    to {
        opacity: 1;

        transform: translateY(0) scale(1);
    }
}

.modal-header-custom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 17px 22px;

    background:
        linear-gradient(
            135deg,
            #198754,
            #20c997
        );

    color: #fff;
}

.modal-header-custom > div {
    display: flex;
    align-items: center;

    gap: 10px;
}

.modal-header-custom > div > i {
    font-size: 22px;
}

.modal-header-custom h5 {
    margin: 0;

    font-size: 16px;
    font-weight: 700;
}

.modal-header-custom small {
    color: rgba(255, 255, 255, 0.75);

    font-size: 10px;
}

.modal-header-custom > button {
    width: 34px;
    height: 34px;

    border: none;

    border-radius: 7px;

    background: rgba(255, 255, 255, 0.12);

    color: #fff;

    cursor: pointer;

    transition: all 0.2s ease;
}

.modal-header-custom > button:hover {
    background: rgba(255, 255, 255, 0.23);
}

.modal-body-custom {
    flex: 1;

    overflow-y: auto;

    padding: 25px 28px;

    color: #566170;

    font-size: 12px;

    line-height: 1.8;
}

.modal-body-custom h5 {
    margin-top: 0;
    margin-bottom: 12px;

    color: #198754;

    font-size: 15px;
    font-weight: 700;
}

.modal-body-custom p {
    margin-bottom: 14px;
}

.modal-body-custom hr {
    margin: 22px 0;

    border: none;

    border-top: 1px solid #e8ebef;
}

.modal-body-custom ol {
    padding-left: 22px;
}

.modal-body-custom li {
    margin-bottom: 9px;
}

.modal-accept-box {
    display: flex;
    align-items: flex-start;

    gap: 10px;

    margin-top: 20px;

    padding: 14px;

    border: 1px solid #ccebd9;

    border-radius: 9px;

    background: #f0fbf5;

    color: #426050;

    font-size: 11px;

    line-height: 1.65;
}

.modal-accept-box input {
    width: 17px;
    height: 17px;

    margin-top: 2px;

    accent-color: #198754;

    flex-shrink: 0;

    cursor: pointer;
}

.modal-accept-box label {
    margin: 0;

    cursor: pointer;

    color: #426050;
}

.modal-footer-custom {
    display: flex;
    justify-content: flex-end;

    gap: 9px;

    padding: 15px 22px;

    border-top: 1px solid #edf0f3;

    background: #fafbfc;
}

.modal-close-btn,
.modal-accept-btn {
    height: 38px;

    padding: 0 15px;

    border-radius: 7px;

    font-size: 11px;
    font-weight: 650;

    cursor: pointer;
}

.modal-close-btn {
    border: 1px solid #d8dee6;

    background: #fff;

    color: #596474;
}

.modal-accept-btn {
    border: none;

    background: #198754;

    color: #fff;
}

.modal-accept-btn i {
    margin-right: 6px;
}

.modal-accept-btn:disabled {
    background: #aab5af;

    cursor: not-allowed;
}


/* =========================================================
   RESPONSIVE - TABLET
   ========================================================= */

@media (max-width: 991px) {

    .registration-form {
        padding: 22px;
    }

    .registration-top {
        padding: 19px 22px;
    }

    .page-heading h2 {
        font-size: 21px;
    }

    .document-upload {
        min-height: 85px;
    }

    .academic-table {
        min-width: 0;
    }

    .academic-table th,
    .academic-table td {
        padding-left: 8px;
        padding-right: 8px;
    }

    .academic-table .table-input,
    .academic-table .student-select__control {
        font-size: 10px;
    }

    .academic-table .file-table-input {
        font-size: 9px;
    }
}


/* =========================================================
   RESPONSIVE - MOBILE
   ========================================================= */

@media (max-width: 767px) {

    .student-registration-page {
        padding: 18px 0 35px;
    }

    .page-heading {
        align-items: flex-start;

        flex-direction: column;

        gap: 13px;
    }

    .page-heading > div:first-child {
        width: 100%;
    }

    .heading-icon {
        width: 45px;
        height: 45px;

        min-width: 45px;

        font-size: 19px;
    }

    .page-heading h2 {
        font-size: 19px;
    }

    .page-heading p {
        font-size: 11px;
    }

    .back-btn {
        width: 100%;
    }

    .breadcrumb-custom {
        margin-top: 3px;

        margin-bottom: 15px;
    }

    .registration-card {
        border-radius: 11px;
    }

    .registration-top {
        padding: 17px;

        align-items: flex-start;

        flex-direction: column;

        gap: 10px;
    }

    .registration-top h4 {
        font-size: 16px;
    }

    .registration-top p {
        font-size: 10px;
    }

    .required-info {
        font-size: 9px;
    }

    .registration-form {
        padding: 18px 15px;
    }

    .section-heading {
        align-items: flex-start;

        gap: 9px;

        margin-bottom: 18px;
    }

    .section-icon {
        width: 38px;
        height: 38px;

        min-width: 38px;

        font-size: 15px;
    }

    .section-heading h5 {
        font-size: 14px;
    }

    .section-heading p {
        font-size: 9px;
    }

    .add-academic-btn {
        padding: 7px 9px;

        font-size: 9px;
    }


    /* =====================================================
       ACADEMIC TABLE MOBILE
       ===================================================== */

    .academic-wrapper {
        overflow: visible;

        border: none;

        background: transparent;
    }

    .academic-table {
        display: block;

        width: 100%;

        min-width: 0;
    }

    .academic-table thead {
        display: none;
    }

    .academic-table tbody {
        display: block;

        width: 100%;
    }

    .academic-table tbody tr.academic-row {
        display: block;

        width: 100%;

        margin: 0 0 15px;

        padding: 12px;

        border: 1px solid #e4e8ee;

        border-radius: 10px;

        background: #fff;

        box-shadow:
            0 3px 12px rgba(31, 41, 55, 0.04);
    }

    .academic-table tbody tr.academic-row td {
        display: block;

        width: 100%;

        padding: 7px 0;

        border: none;

        background: transparent;
    }

    .academic-table tbody tr.academic-row td:last-child {
        padding-bottom: 0;
    }

    .academic-table tbody tr.academic-row:hover td {
        background: transparent;
    }

    .academic-mobile-label {
        display: block;

        margin-bottom: 5px;

        color: #3c4656;

        font-size: 11px;

        font-weight: 650;
    }

    .academic-table .table-input {
        width: 100%;

        height: 41px;

        font-size: 11px;
    }

    .academic-table .student-select__control {
        width: 100%;

        min-height: 41px !important;

        height: 41px;
    }

    .academic-table .file-table-input {
        width: 100%;

        height: 41px;
    }

    .document-action-wrapper {
        align-items: center;

        gap: 8px;
    }

    .academic-table .delete-row-btn {
        width: 41px;
        height: 41px;

        min-width: 41px;
    }

    .academic-table tbody tr.academic-row:nth-child(2n) td {
        border-bottom: none;
    }


    /* Mobile file name */

    .academic-table .file-name {
        max-width: calc(100% - 50px);

        font-size: 9px;
    }


    /* =====================================================
       OTHER MOBILE SECTIONS
       ===================================================== */

    .declaration-card {
        padding: 15px;
    }

    .declaration-header {
        align-items: flex-start;

        flex-wrap: wrap;
    }

    .view-declaration-btn {
        width: 100%;
    }

    .declaration-check label {
        font-size: 10px;
    }

    .form-actions {
        flex-direction: column-reverse;
    }

    .cancel-btn,
    .submit-btn {
        width: 100%;
    }

    .declaration-overlay {
        padding: 10px;
    }

    .declaration-modal {
        max-height: 94vh;

        border-radius: 10px;
    }

    .modal-header-custom {
        padding: 14px 16px;
    }

    .modal-body-custom {
        padding: 20px 17px;

        font-size: 11px;

        line-height: 1.7;
    }

    .modal-footer-custom {
        padding: 12px 15px;
    }

    .modal-close-btn,
    .modal-accept-btn {
        flex: 1;
    }

    .sbshe-acc-logo {
    width: 400px !important;
    height: 150px !important;
     
    object-fit: contain;
    display: block;
}
}


/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (max-width: 480px) {

    .container-fluid {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }

    .registration-form {
        padding: 15px 12px;
    }

    .section-heading {
        flex-wrap: wrap;
    }

    .section-heading > div:nth-child(2) {
        min-width: calc(100% - 52px);
    }

    .add-academic-btn {
        width: 100%;

        justify-content: center;

        margin-top: 5px;
    }

    .registration-top h4 {
        font-size: 15px;
    }

    .form-control {
        height: 41px;
    }

    .student-select__control {
        min-height: 41px !important;

        height: 41px;
    }

    .document-upload {
        min-height: 82px;

        padding: 9px;
    }

    .document-icon {
        width: 35px;
        height: 35px;

        min-width: 35px;

        font-size: 14px;
    }

    .document-title {
        font-size: 10px;
    }

    .document-subtitle {
        font-size: 8px;
    }

    .modal-footer-custom {
        flex-direction: column;
    }

    .modal-close-btn,
    .modal-accept-btn {
        width: 100%;
    }
        .sbshe-acc-logo {
    width: 400px !important;
    height: 150px !important;
     
    object-fit: contain;
    display: block;
}
}
      

`}</style>

        </div>
    );
};

export default StudentRegistration;
