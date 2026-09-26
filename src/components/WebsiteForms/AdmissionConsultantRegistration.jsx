import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import {
    getCity,
    getDistrict,
    getState
} from "../Admin/Frenchise/FrenchiseService";

import {
    createAccRegistration
} from "./WebformService";


const AdmissionConsultantRegistration = () => {

    const navigate = useNavigate();


    // =========================================================
    // DROPDOWN STATES
    // =========================================================

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [citys, setCitys] = useState([]);


    // =========================================================
    // ERRORS
    // =========================================================

    const [errors, setErrors] = useState({});


    // =========================================================
    // FORM DATA
    // =========================================================

    const [formData, setFormData] = useState({

        name: "",
        fatherName: "",

        dob: "",

        instituteName: "",

        experience: "",
        occupation: "",
        expectedAdmissions: "",

        mobileNo: "",
        whatsAppNo: "",
        email: "",

        stateId: 0,
        districtId: 0,
        locationId: 0,

        address: "",
        pincode: "",

        remark: "",

        isActive: 1
    });


    // =========================================================
    // LOAD STATES
    // =========================================================

    useEffect(() => {

        loadState();

    }, []);


    const loadState = async () => {

        try {

            const result = await getState();

            setStates(result?.data || []);

        }
        catch (error) {

            console.log("State Error:", error);

        }

    };


    // =========================================================
    // LOAD DISTRICT
    // =========================================================

    const loadDistrict = async (stateId) => {

        try {

            const result = await getDistrict(stateId);

            setDistricts(result?.data || []);

        }
        catch (error) {

            console.log("District Error:", error);

            setDistricts([]);

        }

    };


    // =========================================================
    // LOAD CITY
    // =========================================================

    const loadCity = async (districtId) => {

        try {

            const result = await getCity(districtId);

            setCitys(result?.data || []);

        }
        catch (error) {

            console.log("City Error:", error);

            setCitys([]);

        }

    };


    // =========================================================
    // NORMAL INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));


        // Remove field error while typing

        if (errors[name]) {

            setErrors((prev) => ({

                ...prev,

                [name]: ""

            }));

        }

    };


    // =========================================================
    // STATE CHANGE
    // =========================================================

    const handleStateChange = (selectedOption) => {

        const stateId = selectedOption
            ? Number(selectedOption.value)
            : 0;


        setFormData((prev) => ({

            ...prev,

            stateId: stateId,

            districtId: 0,

            locationId: 0

        }));


        // Clear old data

        setDistricts([]);
        setCitys([]);


        // Load District

        if (stateId > 0) {

            loadDistrict(stateId);

        }

    };


    // =========================================================
    // DISTRICT CHANGE
    // =========================================================

    const handleDistrictChange = (selectedOption) => {

        const districtId = selectedOption
            ? Number(selectedOption.value)
            : 0;


        setFormData((prev) => ({

            ...prev,

            districtId: districtId,

            locationId: 0

        }));


        // Clear old cities

        setCitys([]);


        // Load City

        if (districtId > 0) {

            loadCity(districtId);

        }

    };


    // =========================================================
    // CITY CHANGE
    // =========================================================

    const handleCityChange = (selectedOption) => {

        const locationId = selectedOption
            ? Number(selectedOption.value)
            : 0;


        setFormData((prev) => ({

            ...prev,

            locationId: locationId

        }));


        if (errors.locationId) {

            setErrors((prev) => ({

                ...prev,

                locationId: ""

            }));

        }

    };


    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {

        const newErrors = {};


        // Name

        if (
            !formData.name ||
            formData.name.trim() === ""
        ) {

            newErrors.name =
                "Name is required";

        }


        // Father Name

        if (
            !formData.instituteName ||
            formData.instituteName.trim() === ""
        ) {

            newErrors.instituteName =
                "institute Name is required";

        }


        // Mobile

        if (
            !formData.mobileNo ||
            formData.mobileNo.trim() === ""
        ) {

            newErrors.mobileNo =
                "Mobile No is required";

        }
        else if (
            !/^[0-9]{10}$/.test(formData.mobileNo)
        ) {

            newErrors.mobileNo =
                "Enter valid 10 digit mobile number";

        }


        // Email

        if (
            !formData.email ||
            formData.email.trim() === ""
        ) {

            newErrors.email =
                "Email is required";

        }


        // State

        if (
            !formData.stateId ||
            Number(formData.stateId) === 0
        ) {

            newErrors.stateId =
                "State is required";

        }


        // District

        if (
            !formData.districtId ||
            Number(formData.districtId) === 0
        ) {

            newErrors.districtId =
                "District is required";

        }


        // City

        if (
            !formData.locationId ||
            Number(formData.locationId) === 0
        ) {

            newErrors.locationId =
                "City is required";

        }


        // Address

        if (
            !formData.address ||
            formData.address.trim() === ""
        ) {

            newErrors.address =
                "Address is required";

        }


        // Pincode

        if (
            !formData.pincode ||
            formData.pincode.trim() === ""
        ) {

            newErrors.pincode =
                "Pin Code is required";

        }
        else if (
            !/^[0-9]{6}$/.test(formData.pincode)
        ) {

            newErrors.pincode =
                "Enter valid 6 digit pin code";

        }


        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;

    };


    // =========================================================
    // SUBMIT
    // =========================================================

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {
        console.log("Submitting Data:", formData);

        const result = await createAccRegistration(formData);

        if (result?.message === "Successfully") {
            navigate("/success", {
                state: {
                    printmsg: result?.printmsg || ""
                }
            });

            return;
        }

        alert(
            result?.message ||
            "Registration failed"
        );

    } catch (error) {
        console.log("Registration Error:", error);
        console.log("API Error:", error?.response?.data);

        alert(
            error?.response?.data?.message ||
            "Something went wrong"
        );
    }
};




    // =========================================================
    // SELECT OPTIONS
    // =========================================================

    const stateOptions = states.map((item) => ({

        value: item.id,
        label: item.name

    }));


    const districtOptions = districts.map((item) => ({

        value: item.id,
        label: item.name

    }));


    const cityOptions = citys.map((item) => ({

        value: item.id,
        label: item.name

    }));


    // =========================================================
    // SELECTED VALUES
    // =========================================================

    const selectedState =
        stateOptions.find(
            (item) =>
                Number(item.value) ===
                Number(formData.stateId)
        ) || null;


    const selectedDistrict =
        districtOptions.find(
            (item) =>
                Number(item.value) ===
                Number(formData.districtId)
        ) || null;


    const selectedCity =
        cityOptions.find(
            (item) =>
                Number(item.value) ===
                Number(formData.locationId)
        ) || null;


    return (

        <>

            <div className="acc-page">

                <div className="container">


                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <div className="acc-logo-wrapper">

                        <div className="acc-logo-card">

                            <img
                                src="/assets/img/websheddlogo.png"
                                alt="SBSHE"
                                className="sbshe-acc-logo"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        MAIN CARD
                    ================================================= */}

                    <div className="acc-card">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="acc-header">

                            <div className="acc-header-left">

                                <div className="acc-header-icon">

                                    <i className="bi bi-person-workspace"></i>

                                </div>


                                <div>

                                    <h2>
                                        Admission Consultant Registration
                                    </h2>

                                    <p>
                                        Register with us and become an Admission Consultant
                                    </p>

                                </div>

                            </div>


                            <div className="acc-header-badge">

                                <i className="bi bi-shield-check"></i>

                                Secure Registration

                            </div>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            className="acc-form"
                            onSubmit={handleSubmit}
                        >


                            {/* =================================================
                                PERSONAL INFORMATION
                            ================================================= */}

                            <div className="form-section">

                                <div className="section-title">

                                    <div className="section-title-icon">

                                        <i className="bi bi-person-fill"></i>

                                    </div>


                                    <div>

                                        <h3>
                                            Personal Information
                                        </h3>

                                        <span>
                                            Please provide your basic personal details
                                        </span>

                                    </div>

                                </div>


                                <div className="row">

     {/* Institute Name */}

                                    <div className="col-md-6">

                                        <div className="form-group">

                                            <label>
                                                Institute Name<span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-building"></i>


                                                <input
                                                    type="text"
                                                    name="instituteName"
                                                    className="form-control"
                                                    placeholder="Enter institute name"
                                                    value={formData.instituteName}
                                                    onChange={handleChange}
                                                />
{
                                                errors.instituteName && (

                                                    <div className="text-danger mt-1">
                                                        {errors.instituteName}
                                                    </div>

                                                )
                                            }

                                            </div>

                                        </div>

                                    </div>
                                    {/* Full Name */}

                                    <div className="col-md-6">

                                        <div className="form-group">

                                            <label>
                                                Full Name <span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-person"></i>


                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    placeholder="Enter full name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />

                                            </div>


                                            {
                                                errors.name && (

                                                    <div className="text-danger mt-1">
                                                        {errors.name}
                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>


                                    {/* Father's Name */}

                                    <div className="col-md-6">

                                        <div className="form-group">

                                            <label>
                                                Father's Name  
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-person-vcard"></i>


                                                <input
                                                    type="text"
                                                    name="fatherName"
                                                    className="form-control"
                                                    placeholder="Enter father's name"
                                                    value={formData.fatherName}
                                                    onChange={handleChange}
                                                />

                                            </div>


                                             

                                        </div>

                                    </div>


                                    {/* DOB */}

                                    <div className="col-md-6">

                                        <div className="form-group">

                                            <label>
                                                Date of Birth
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-calendar3"></i>


                                                <input
                                                    type="date"
                                                    name="dob"
                                                    className="form-control"
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                        </div>

                                    </div>


                               

                                </div>

                            </div>

  {/* =================================================
                                CONTACT INFORMATION
                            ================================================= */}

                            <div className="form-section">

                                <div className="section-title">

                                    <div className="section-title-icon">

                                        <i className="bi bi-telephone-fill"></i>

                                    </div>


                                    <div>

                                        <h3>
                                            Contact Information
                                        </h3>

                                        <span>
                                            Provide your contact details
                                        </span>

                                    </div>

                                </div>


                                <div className="row">


                                    {/* Mobile */}

                                    <div className="col-md-4">

                                        <div className="form-group">

                                            <label>
                                                Mobile <span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-phone-fill"></i>


                                                <input
                                                    type="tel"
                                                    name="mobileNo"
                                                    className="form-control"
                                                    placeholder="Enter 10 digit mobile number"
                                                    maxLength="10"
                                                    value={formData.mobileNo}
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            );

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            mobileNo: value
                                                        }));

                                                    }}
                                                />

                                            </div>


                                            {
                                                errors.mobileNo && (

                                                    <div className="text-danger mt-1">
                                                        {errors.mobileNo}
                                                    </div>

                                                )
                                            }


                                            <small>

                                                <i className="bi bi-info-circle me-1"></i>

                                                Enter a valid 10 digit mobile number

                                            </small>

                                        </div>

                                    </div>


                                    {/* WhatsApp */}

                                    <div className="col-md-4">

                                        <div className="form-group">

                                            <label>
                                                WhatsApp No
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-whatsapp"></i>


                                                <input
                                                    type="tel"
                                                    name="whatsAppNo"
                                                    className="form-control"
                                                    placeholder="Enter WhatsApp number"
                                                    maxLength="10"
                                                    value={formData.whatsAppNo}
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            );

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            whatsAppNo: value
                                                        }));

                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </div>


                                    {/* Email */}

                                    <div className="col-md-4">

                                        <div className="form-group">

                                            <label>
                                                Email <span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-envelope-fill"></i>


                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Enter email address"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />

                                            </div>


                                            {
                                                errors.email && (

                                                    <div className="text-danger mt-1">
                                                        {errors.email}
                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                PROFESSIONAL INFORMATION
                            ================================================= */}

                            <div className="form-section">

                                <div className="section-title">

                                    <div className="section-title-icon">

                                        <i className="bi bi-briefcase-fill"></i>

                                    </div>


                                    <div>

                                        <h3>
                                            Professional Information
                                        </h3>

                                        <span>
                                            Tell us about your professional background
                                        </span>

                                    </div>

                                </div>


                                <div className="row">


                                    {/* Experience */}

                                    <div className="col-md-4">

                                        <div className="form-group">

                                            <label>
                                                Experience
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-clock-history"></i>


                                                <input
                                                    type="text"
                                                    name="experience"
                                                    className="form-control"
                                                    placeholder="e.g. 3 Years"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                        </div>

                                    </div>


                                    {/* Occupation */}

                                    <div className="col-md-4">

                                        <div className="form-group">

                                            <label>
                                                Occupation
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-person-badge"></i>


                                                <input
                                                    type="text"
                                                    name="occupation"
                                                    className="form-control"
                                                    placeholder="Enter occupation"
                                                    value={formData.occupation}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                        </div>

                                    </div>


                                    {/* Expected Admissions */}

                                    <div className="col-md-4">

                                        <div className="form-group">

                                            <label>
                                                Expected Admissions
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-people-fill"></i>


                                                <input
                                                    type="number"
                                                    name="expectedAdmissions"
                                                    className="form-control"
                                                    placeholder="Expected admissions"
                                                    min="0"
                                                    value={formData.expectedAdmissions}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                          

                            {/* =================================================
                                ADDRESS INFORMATION
                            ================================================= */}

                            <div className="form-section">

                                <div className="section-title">

                                    <div className="section-title-icon">

                                        <i className="bi bi-map-fill"></i>

                                    </div>


                                    <div>

                                        <h3>
                                            Address Information
                                        </h3>

                                        <span>
                                            Enter your current address details
                                        </span>

                                    </div>

                                </div>


                                <div className="row">


                                    {/* Address */}

                                    <div className="col-md-12">

                                        <div className="form-group">

                                            <label>
                                                Full Address <span>*</span>
                                            </label>


                                            <div className="textarea-box">

                                                <i className="bi bi-house-fill"></i>


                                                <textarea
                                                    name="address"
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="Enter complete address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />

                                            </div>


                                            {
                                                errors.address && (

                                                    <div className="text-danger mt-1">
                                                        {errors.address}
                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>


                                    {/* =================================================
                                        STATE - SEARCHABLE
                                    ================================================= */}

                                    <div className="col-md-3">

                                        <div className="form-group">

                                            <label>
                                                State <span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-map"></i>


                                                <Select

                                                    options={stateOptions}

                                                    value={selectedState}

                                                    onChange={handleStateChange}

                                                    placeholder="Search State..."

                                                    isSearchable

                                                    isClearable

                                                    noOptionsMessage={() =>
                                                        "State not found"
                                                    }

                                                    styles={{

                                                        control: (base, state) => ({

                                                            ...base,

                                                            minHeight: "46px",

                                                            height: "46px",

                                                            borderRadius: "9px",

                                                            paddingLeft: "28px",

                                                            borderColor:
                                                                state.isFocused
                                                                    ? "#07567f"
                                                                    : "#dfe4eb",

                                                            boxShadow:
                                                                state.isFocused
                                                                    ? "0 0 0 3px rgba(255,102,0,0.09)"
                                                                    : "none",

                                                            background:
                                                                "#fbfcfd"

                                                        }),

                                                        valueContainer: (base) => ({

                                                            ...base,

                                                            padding:
                                                                "2px 8px"

                                                        }),

                                                        indicatorSeparator: () => ({

                                                            display: "none"

                                                        }),

                                                        menu: (base) => ({

                                                            ...base,

                                                            zIndex: 9999

                                                        }),

                                                        option: (base, state) => ({

                                                            ...base,

                                                            fontSize: "12px",

                                                            backgroundColor:
                                                                state.isSelected
                                                                    ? "#07567f"
                                                                    : state.isFocused
                                                                        ? "#fff1e8"
                                                                        : "#ffffff",

                                                            color:
                                                                state.isSelected
                                                                    ? "#ffffff"
                                                                    : "#263142"

                                                        })

                                                    }}

                                                />

                                            </div>


                                            {
                                                errors.stateId && (

                                                    <div className="text-danger mt-1">
                                                        {errors.stateId}
                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>


                                    {/* =================================================
                                        DISTRICT - SEARCHABLE
                                    ================================================= */}

                                    <div className="col-md-3">

                                        <div className="form-group">

                                            <label>
                                                District <span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-buildings"></i>


                                                <Select

                                                    options={districtOptions}

                                                    value={selectedDistrict}

                                                    onChange={handleDistrictChange}

                                                    placeholder={
                                                        formData.stateId
                                                            ? "Search District..."
                                                            : "Select State First"
                                                    }

                                                    isSearchable

                                                    isClearable

                                                    isDisabled={
                                                        !formData.stateId
                                                    }

                                                    noOptionsMessage={() =>
                                                        "District not found"
                                                    }

                                                    styles={{

                                                        control: (base, state) => ({

                                                            ...base,

                                                            minHeight: "46px",

                                                            height: "46px",

                                                            borderRadius: "9px",

                                                            paddingLeft: "28px",

                                                            borderColor:
                                                                state.isFocused
                                                                    ? "#07567f"
                                                                    : "#dfe4eb",

                                                            boxShadow:
                                                                state.isFocused
                                                                    ? "0 0 0 3px rgba(255,102,0,0.09)"
                                                                    : "none",

                                                            background:
                                                                "#fbfcfd"

                                                        }),

                                                        valueContainer: (base) => ({

                                                            ...base,

                                                            padding:
                                                                "2px 8px"

                                                        }),

                                                        indicatorSeparator: () => ({

                                                            display: "none"

                                                        }),

                                                        menu: (base) => ({

                                                            ...base,

                                                            zIndex: 9999

                                                        }),

                                                        option: (base, state) => ({

                                                            ...base,

                                                            fontSize: "12px",

                                                            backgroundColor:
                                                                state.isSelected
                                                                    ? "#07567f"
                                                                    : state.isFocused
                                                                        ? "#fff1e8"
                                                                        : "#ffffff",

                                                            color:
                                                                state.isSelected
                                                                    ? "#ffffff"
                                                                    : "#263142"

                                                        })

                                                    }}

                                                />

                                            </div>


                                            {
                                                errors.districtId && (

                                                    <div className="text-danger mt-1">
                                                        {errors.districtId}
                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CITY - SEARCHABLE
                                    ================================================= */}

                                    <div className="col-md-3">

                                        <div className="form-group">

                                            <label>
                                                City <span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-buildings-fill"></i>


                                                <Select

                                                    options={cityOptions}

                                                    value={selectedCity}

                                                    onChange={handleCityChange}

                                                    placeholder={
                                                        formData.districtId
                                                            ? "Search City..."
                                                            : "Select District First"
                                                    }

                                                    isSearchable

                                                    isClearable

                                                    isDisabled={
                                                        !formData.districtId
                                                    }

                                                    noOptionsMessage={() =>
                                                        "City not found"
                                                    }

                                                    styles={{

                                                        control: (base, state) => ({

                                                            ...base,

                                                            minHeight: "46px",

                                                            height: "46px",

                                                            borderRadius: "9px",

                                                            paddingLeft: "28px",

                                                            borderColor:
                                                                state.isFocused
                                                                    ? "#07567f"
                                                                    : "#dfe4eb",

                                                            boxShadow:
                                                                state.isFocused
                                                                    ? "0 0 0 3px rgba(255,102,0,0.09)"
                                                                    : "none",

                                                            background:
                                                                "#fbfcfd"

                                                        }),

                                                        valueContainer: (base) => ({

                                                            ...base,

                                                            padding:
                                                                "2px 8px"

                                                        }),

                                                        indicatorSeparator: () => ({

                                                            display: "none"

                                                        }),

                                                        menu: (base) => ({

                                                            ...base,

                                                            zIndex: 9999

                                                        }),

                                                        option: (base, state) => ({

                                                            ...base,

                                                            fontSize: "12px",

                                                            backgroundColor:
                                                                state.isSelected
                                                                    ? "#07567f"
                                                                    : state.isFocused
                                                                        ? "#fff1e8"
                                                                        : "#ffffff",

                                                            color:
                                                                state.isSelected
                                                                    ? "#ffffff"
                                                                    : "#263142"

                                                        })

                                                    }}

                                                />

                                            </div>


                                            {
                                                errors.locationId && (

                                                    <div className="text-danger mt-1">
                                                        {errors.locationId}
                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>


                                    {/* =================================================
                                        PIN CODE
                                    ================================================= */}

                                    <div className="col-md-3">

                                        <div className="form-group">

                                            <label>
                                                Pin Code <span>*</span>
                                            </label>


                                            <div className="input-box">

                                                <i className="bi bi-pin-map-fill"></i>


                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    className="form-control"
                                                    placeholder="6 digit pin code"
                                                    maxLength="6"
                                                    value={formData.pincode}
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            );

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            pincode: value
                                                        }));

                                                    }}
                                                />

                                            </div>


                                            {
                                                errors.pincode && (

                                                    <div className="text-danger mt-1">
                                                        {errors.pincode}
                                                    </div>

                                                )
                                            }

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                ADMISSION DETAILS
                            ================================================= */}

                            <div className="form-section">

                                <div className="section-title">

                                    <div className="section-title-icon">

                                        <i className="bi bi-mortarboard-fill"></i>

                                    </div>


                                    <div>

                                        <h3>
                                            Message
                                        </h3>

                                        <span>
                                            Tell us about your admission requirements
                                        </span>

                                    </div>

                                </div>


                                <div className="row">








                                    {/* Remark */}

                                    <div className="col-md-12">

                                        <div className="form-group">

                                            <label>
                                                Message / Remark
                                            </label>


                                            <div className="textarea-box">

                                                <i className="bi bi-chat-left-text-fill"></i>


                                                <textarea
                                                    name="remark"
                                                    className="form-control"
                                                    rows="4"
                                                    placeholder="Enter your message or remark"
                                                    value={formData.remark}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                FOOTER
                            ================================================= */}

                            <div className="form-footer">


                                <button
                                    type="submit"
                                    className="submit-btn"
                                >

                                    <span className="submit-icon">

                                        <i className="bi bi-send-fill"></i>

                                    </span>


                                    Submit ACC Request


                                    <i className="bi bi-arrow-right submit-arrow"></i>

                                </button>


                                <div className="security-info">

                                    <div className="security-icon">

                                        <i className="bi bi-shield-lock-fill"></i>

                                    </div>


                                    <div>

                                        <strong>
                                            Your information is secure
                                        </strong>

                                        <span>
                                            We respect your privacy and keep your information confidential.
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </form>

                    </div>

                </div>

            </div>


            {/* =====================================================
                YOUR EXISTING CSS
            ===================================================== */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .acc-page {
                    min-height: 100vh;
                    padding: 35px 15px 50px;
                    position: relative;
                    overflow: hidden;

                    background:
                        radial-gradient(
                            circle at 8% 12%,
                            rgba(255, 102, 0, 0.12),
                            transparent 28%
                        ),
                        radial-gradient(
                            circle at 92% 18%,
                            rgba(0, 102, 204, 0.08),
                            transparent 30%
                        ),
                        radial-gradient(
                            circle at 15% 90%,
                            rgba(255, 102, 0, 0.06),
                            transparent 25%
                        ),
                        radial-gradient(
                            circle at 88% 88%,
                            rgba(0, 102, 204, 0.07),
                            transparent 28%
                        ),
                        linear-gradient(
                            135deg,
                            #f8fafc 0%,
                            #f4f7fb 45%,
                            #eef3f9 100%
                        );
                }

                .acc-page::before {
                    content: "";
                    position: absolute;
                    width: 420px;
                    height: 420px;
                    top: -180px;
                    left: -180px;
                    border-radius: 50%;
                    background: rgba(255, 102, 0, 0.04);
                    filter: blur(10px);
                    pointer-events: none;
                }

                .acc-page::after {
                    content: "";
                    position: absolute;
                    width: 380px;
                    height: 380px;
                    right: -160px;
                    bottom: -160px;
                    border-radius: 50%;
                    background: rgba(0, 102, 204, 0.045);
                    filter: blur(10px);
                    pointer-events: none;
                }

                .acc-page > .container {
                    position: relative;
                    z-index: 1;
                }

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

                .acc-card {
                    width: 100%;
                    max-width: 1120px;
                    margin: 0 auto;
                    overflow: hidden;
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid #e9edf3;

                    box-shadow:
                        0 20px 60px rgba(20, 30, 50, 0.09);
                }

                .acc-header {
                    min-height: 105px;
                    padding: 22px 30px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    color: #ffffff;

                    background:
                        linear-gradient(
                            135deg,
                            #07567f 0%,
                            #f45b00 55%,
                            #db4800 100%
                        );

                    position: relative;
                    overflow: hidden;
                }

                .acc-header::after {
                    content: "";
                    position: absolute;
                    width: 240px;
                    height: 240px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.12);
                    right: -100px;
                    top: -120px;
                }

                .acc-header-left {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .acc-header-icon {
                    width: 60px;
                    height: 60px;
                    min-width: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                    background: rgba(255,255,255,0.16);
                    border: 1px solid rgba(255,255,255,0.20);
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.18);
                    font-size: 26px;
                }

                .acc-header h2 {
                    margin: 0 0 5px;
                    font-size: 24px;
                    line-height: 1.25;
                    font-weight: 800;
                    color: #ffffff;
                }

                .acc-header p {
                    margin: 0;
                    font-size: 13px;
                    color: rgba(255,255,255,0.85);
                }

                .acc-header-badge {
                    position: relative;
                    z-index: 2;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 9px 13px;
                    border-radius: 50px;
                    white-space: nowrap;
                    background: rgba(255,255,255,0.13);
                    border: 1px solid rgba(255,255,255,0.18);
                    font-size: 11px;
                    font-weight: 600;
                }

                .acc-form {
                    padding: 32px;
                }

                .form-section {
                    margin-bottom: 30px;
                }

                .form-section:last-of-type {
                    margin-bottom: 20px;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #edf0f4;
                }

                .section-title-icon {
                    width: 37px;
                    height: 37px;
                    min-width: 37px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    color: #07567f;

                    background:
                        linear-gradient(
                            135deg,
                            rgba(255,102,0,0.13),
                            rgba(255,102,0,0.06)
                        );

                    border: 1px solid rgba(255,102,0,0.12);
                    font-size: 15px;
                }

                .section-title h3 {
                    margin: 0;
                    color: #1f2937;
                    font-size: 16px;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .section-title span {
                    display: block;
                    margin-top: 3px;
                    color: #929baa;
                    font-size: 10px;
                }

                .form-group {
                    margin-bottom: 19px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 7px;
                    color: #374151;
                    font-size: 12px;
                    font-weight: 700;
                }

                .form-group label span {
                    color: #dc2626;
                    margin-left: 2px;
                }

                .input-box {
                    position: relative;
                }

                .input-box > i {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 3;
                    color: #07567f;
                    font-size: 14px;
                    pointer-events: none;
                }

                .form-control {
                    width: 100%;
                    height: 46px;
                    border: 1px solid #dfe4eb;
                    border-radius: 9px;
                    background: #fbfcfd;
                    color: #263142;
                    font-size: 12px;
                    padding: 0 14px;
                    box-shadow: none;

                    transition:
                        border-color 0.2s ease,
                        box-shadow 0.2s ease,
                        background 0.2s ease;
                }

                .input-box .form-control {
                    padding-left: 41px;
                }

                .form-control::placeholder {
                    color: #aeb5c1;
                }

                .form-control:hover {
                    border-color: #cdd4df;
                    background: #ffffff;
                }

                .form-control:focus {
                    outline: none;
                    border-color: #07567f;
                    background: #ffffff;

                    box-shadow:
                        0 0 0 3px rgba(255,102,0,0.09);
                }

                .textarea-box {
                    position: relative;
                }

                .textarea-box > i {
                    position: absolute;
                    left: 15px;
                    top: 15px;
                    z-index: 2;
                    color: #07567f;
                    font-size: 14px;
                    pointer-events: none;
                }

                .textarea-box .form-control {
                    height: auto;
                    min-height: 95px;
                    padding:
                        12px
                        14px
                        12px
                        41px;
                    resize: vertical;
                    line-height: 1.6;
                }

                .form-group small {
                    display: block;
                    margin-top: 5px;
                    color: #98a1af;
                    font-size: 10px;
                }

                .form-group small i {
                    color: #07567f;
                }

                .text-danger {
                    font-size: 11px;
                }

                .form-footer {
                    padding-top: 22px;
                    border-top: 1px solid #edf0f4;
                    text-align: center;
                }

                .submit-btn {
                    position: relative;
                    min-width: 220px;
                    height: 50px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    padding: 0 20px;
                    border: 0;
                    border-radius: 10px;
                    color: #ffffff;

                    background:
                        linear-gradient(
                            135deg,
                            #07567f,
                            #e65300
                        );

                    box-shadow:
                        0 9px 22px rgba(255,102,0,0.24);

                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;

                    transition:
                        transform 0.25s ease,
                        box-shadow 0.25s ease;
                }

                .submit-btn:hover {
                    transform: translateY(-2px);

                    box-shadow:
                        0 13px 28px rgba(255,102,0,0.30);
                }

                .submit-btn:active {
                    transform: translateY(0);
                }

                .submit-icon {
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 7px;
                    background: rgba(255,255,255,0.16);
                }

                .submit-icon i {
                    font-size: 11px;
                }

                .submit-arrow {
                    font-size: 12px;
                    transition: transform 0.2s ease;
                }

                .submit-btn:hover .submit-arrow {
                    transform: translateX(3px);
                }

                .security-info {
                    max-width: 420px;
                    margin: 18px auto 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    text-align: left;
                }

                .security-icon {
                    width: 30px;
                    height: 30px;
                    min-width: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    color: #16a34a;
                    background: #ecfdf3;
                    font-size: 13px;
                }

                .security-info strong {
                    display: block;
                    color: #4b5563;
                    font-size: 10px;
                    font-weight: 700;
                }

                .security-info span {
                    display: block;
                    margin-top: 2px;
                    color: #9ca3af;
                    font-size: 9px;
                }

                @media (max-width: 991px) {

                    .acc-page {
                        padding-top: 25px;
                    }

                    .acc-form {
                        padding: 25px;
                    }

                    .acc-header {
                        padding: 22px 25px;
                    }

                    .acc-header-badge {
                        display: none;
                    }

                }

                @media (max-width: 767px) {

                    .acc-page {
                        padding: 20px 10px 35px;
                    }

                    .acc-logo-wrapper {
                        margin-bottom: 18px;
                    }

                    .acc-logo-card {
                        width: 225px;
                        min-height: 72px;
                        padding: 8px 16px;
                        border-radius: 15px;
                    }

                    .sbshe-acc-logo {
                        max-width: 185px;
                        max-height: 54px;
                    }

                    .acc-card {
                        border-radius: 15px;
                    }

                    .acc-header {
                        padding: 18px;
                        min-height: auto;
                    }

                    .acc-header-left {
                        gap: 12px;
                    }

                    .acc-header-icon {
                        width: 48px;
                        height: 48px;
                        min-width: 48px;
                        border-radius: 12px;
                        font-size: 20px;
                    }

                    .acc-header h2 {
                        font-size: 17px;
                    }

                    .acc-header p {
                        font-size: 10px;
                        line-height: 1.5;
                    }

                    .acc-form {
                        padding: 20px 15px;
                    }

                    .form-section {
                        margin-bottom: 25px;
                    }

                    .section-title {
                        gap: 9px;
                        margin-bottom: 17px;
                    }

                    .section-title-icon {
                        width: 34px;
                        height: 34px;
                        min-width: 34px;
                    }

                    .section-title h3 {
                        font-size: 14px;
                    }

                    .section-title span {
                        font-size: 9px;
                    }

                    .form-group {
                        margin-bottom: 15px;
                    }

                    .form-control {
                        height: 45px;
                    }

                    .submit-btn {
                        width: 100%;
                        min-width: auto;
                    }

                }

                @media (max-width: 400px) {

                    .acc-header h2 {
                        font-size: 15px;
                    }

                    .acc-header p {
                        font-size: 9px;
                    }

                    .acc-header-icon {
                        width: 43px;
                        height: 43px;
                        min-width: 43px;
                        font-size: 18px;
                    }

                    .acc-form {
                        padding: 18px 12px;
                    }

                    .security-info {
                        align-items: flex-start;
                    }

                }

            `}</style>

        </>

    );

};


export default AdmissionConsultantRegistration;
