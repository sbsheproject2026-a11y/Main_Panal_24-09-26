 import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
    FaIdCard,
    FaFileInvoice,
    FaCamera,
    FaSignature,
    FaBuilding,
    FaUpload,
    FaTimes,
    FaCheckCircle
} from "react-icons/fa";
import {
    getaccById,
    getCity,
    getDistrict,
    getState,
    updateaccCentre
} from "../../AllServicesFiles/FrenchiseService";
import { FILE_URL } from "../../api";

/* ============================================================
   ✅ Field Component (OUTSIDE main component)
============================================================ */
const Field = ({
    label,
    name,
    icon,
    type = "text",
    placeholder,
    required = false,
    formData,
    handleChange,
    errors
}) => (
    <div className="acc-field">
        <label className="acc-label">
            {label}
            {required && <span>*</span>}
        </label>

        <div className="acc-input-wrap">
            <i className={`bi ${icon}`}></i>

            <input
                type={type}
                name={name}
                className="acc-input"
                placeholder={placeholder}
                value={formData[name] ?? ""}
                onChange={handleChange}
            />
        </div>

        {errors[name] && (
            <div className="acc-error">
                <i className="bi bi-exclamation-circle"></i>
                {errors[name]}
            </div>
        )}
    </div>
);

/* ============================================================
   ✅ FileUpload Component (OUTSIDE main component)
============================================================ */
const FileUpload = ({
    name,
    label,
    icon,
    accept = "image/*,.pdf",
    description,
    formData,
    previews,
    handleFileChange,
    removeFile
}) => {
    const selectedFile = formData[name];
    const preview = previews[name];

    return (
        <div className="acc-document-card">
            <div className="acc-document-header">
                <div className="acc-document-icon">{icon}</div>

                <div>
                    <h4>{label}</h4>
                    <p>{description || "JPG, PNG or PDF"}</p>
                </div>
            </div>

            <div className={`acc-upload-box ${selectedFile ? "selected" : ""}`}>
                <input
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={(e) => handleFileChange(e, name)}
                />

                {selectedFile ? (
                    <>
                        <div className="acc-upload-status">
                            <FaCheckCircle />
                        </div>

                        <div className="acc-upload-info">
                            <strong>{selectedFile.name}</strong>
                            <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                        </div>

                        <button
                            type="button"
                            className="acc-remove-file"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile(name);
                            }}
                        >
                            <FaTimes />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="acc-upload-cloud">
                            <FaUpload />
                        </div>

                        <div className="acc-upload-info">
                            <strong>Choose file to upload</strong>
                            <span>Click to browse your files</span>
                        </div>

                        <div className="acc-upload-arrow">
                            <i className="bi bi-arrow-up-right"></i>
                        </div>
                    </>
                )}
            </div>

            {preview && (
                <div className="acc-new-preview">
                    <img src={preview} alt={label} />
                    <div>
                        <FaCheckCircle />
                        <span>New file selected</span>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ============================================================
   ✅ ExistingFile Component (OUTSIDE main component)
============================================================ */
const ExistingFile = ({ file, label, type = "image" }) => {
    if (!file) return null;

    const fileUrl = `${FILE_URL}${file}`;

    return (
        <div className="acc-existing-file">
            {type === "image" ? (
                <img src={fileUrl} alt={label} />
            ) : (
                <div className="acc-existing-pdf">
                    <FaFileInvoice />
                </div>
            )}

            <div className="acc-existing-info">
                <span>Existing document</span>
                <strong>{label}</strong>
            </div>

            <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="acc-view-file"
            >
                <i className="bi bi-eye"></i>
            </a>
        </div>
    );
};

/* ============================================================
   ✅ Main Component
============================================================ */
const AccUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [citys, setCitys] = useState([]);
    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        id: 0,
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
        passportPhoto: null,
        authorizedSignature: null,
        instituteCertificate: null,
        buildingPhoto1: null,
        buildingPhoto2: null,
        aadhaarCard: null,
        panCard: null,
        passportPhoto1: "",
        authorizedSignature1: "",
        instituteCertificate1: "",
        buildingPhoto11: "",
        buildingPhoto21: "",
        aadhaarCard1: "",
        panCard1: "",
        isActive: 1
    });

    useEffect(() => {
        const initialize = async () => {
            await loadState();

            if (id) {
                await handleEdit(id);
            }

            setPageLoading(false);
        };

        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleEdit = async (editId) => {
        try {
            const result = await getaccById(editId);

            if (!result) return;

            setFormData({
                id: result.id ?? 0,
                instituteName: result.instituteName ?? "",
                name: result.name ?? "",
                fatherName: result.fatherName ?? "",
                experience: result.experience ?? "",
                occupation: result.occupation ?? "",
                expectedAdmissions: result.expectedAdmissions ?? "",
                mobileNo: result.mobileNo ?? "",
                whatsAppNo: result.whatsAppNo ?? "",
                email: result.email ?? "",
                dob: result.doB1 ?? "",
                stateId: result.stateId ?? 0,
                districtId: result.districtId ?? 0,
                locationId: result.locationId ?? 0,
                address: result.address ?? "",
                pincode: result.pincode ?? "",
                remark: result.remark ?? "",
                passportPhoto: null,
                authorizedSignature: null,
                instituteCertificate: null,
                buildingPhoto1: null,
                buildingPhoto2: null,
                aadhaarCard: null,
                panCard: null,
                passportPhoto1: result.passportPhoto ?? "",
                authorizedSignature1: result.authorizedSignature ?? "",
                aadhaarCard1: result.aadhaarCardimage ?? "",
                panCard1: result.panCardimage ?? "",
                instituteCertificate1: result.instituteCertificate ?? "",
                buildingPhoto11: result.buildingPhoto1 ?? "",
                buildingPhoto21: result.buildingPhoto2 ?? "",
                isActive: result.isActive ?? 1
            });

            if (result.stateId > 0) {
                await loadDistrict(result.stateId);
            }

            if (result.districtId > 0) {
                await loadCity(result.districtId);
            }
        } catch (error) {
            console.log("Edit Error:", error);
        }
    };

    const loadState = async () => {
        try {
            const result = await getState();
            setStates(result?.data || []);
        } catch (error) {
            console.log("State Error:", error);
            setStates([]);
        }
    };

    const loadDistrict = async (stateId) => {
        try {
            const result = await getDistrict(stateId);
            setDistricts(result?.data || []);
        } catch (error) {
            console.log("District Error:", error);
            setDistricts([]);
        }
    };

    const loadCity = async (districtId) => {
        try {
            const result = await getCity(districtId);
            setCitys(result?.data || []);
        } catch (error) {
            console.log("City Error:", error);
            setCitys([]);
        }
    };

    /* ✅ useCallback so reference stable rahe */
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => {
            if (!prev[name]) return prev;
            return { ...prev, [name]: "" };
        });
    }, []);

    const handleStateChange = (selectedOption) => {
        const stateId = selectedOption ? Number(selectedOption.value) : 0;

        setFormData((prev) => ({
            ...prev,
            stateId,
            districtId: 0,
            locationId: 0
        }));

        setDistricts([]);
        setCitys([]);

        if (errors.stateId) {
            setErrors((prev) => ({ ...prev, stateId: "" }));
        }

        if (stateId > 0) {
            loadDistrict(stateId);
        }
    };

    const handleDistrictChange = (selectedOption) => {
        const districtId = selectedOption ? Number(selectedOption.value) : 0;

        setFormData((prev) => ({
            ...prev,
            districtId,
            locationId: 0
        }));

        setCitys([]);

        if (errors.districtId) {
            setErrors((prev) => ({ ...prev, districtId: "" }));
        }

        if (districtId > 0) {
            loadCity(districtId);
        }
    };

    const handleCityChange = (selectedOption) => {
        const locationId = selectedOption ? Number(selectedOption.value) : 0;

        setFormData((prev) => ({
            ...prev,
            locationId
        }));

        if (errors.locationId) {
            setErrors((prev) => ({ ...prev, locationId: "" }));
        }
    };

    const handleFileChange = useCallback((e, name) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            [name]: file
        }));

        if (file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [name]: previewUrl }));
        } else {
            setPreviews((prev) => ({ ...prev, [name]: "" }));
        }

        setErrors((prev) => {
            if (!prev[name]) return prev;
            return { ...prev, [name]: "" };
        });
    }, []);

    const removeFile = useCallback((name) => {
        setFormData((prev) => ({
            ...prev,
            [name]: null
        }));

        setPreviews((prev) => ({
            ...prev,
            [name]: ""
        }));
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.instituteName?.trim()) {
            newErrors.instituteName = "Institute name is required";
        }

        if (!formData.name?.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.fatherName?.trim()) {
            newErrors.fatherName = "Father's name is required";
        }

        if (!formData.mobileNo?.trim()) {
            newErrors.mobileNo = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = "Enter valid 10 digit mobile number";
        }

        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.stateId || Number(formData.stateId) === 0) {
            newErrors.stateId = "State is required";
        }

        if (!formData.districtId || Number(formData.districtId) === 0) {
            newErrors.districtId = "District is required";
        }

        if (!formData.locationId || Number(formData.locationId) === 0) {
            newErrors.locationId = "City is required";
        }

        if (!formData.address?.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.pincode?.trim()) {
            newErrors.pincode = "Pin code is required";
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Enter valid 6 digit pin code";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }

        try {
            setLoading(true);

            const submittedData = { ...formData };
            const result = await updateaccCentre(submittedData);

            if (result?.message === "Successfully") {
                navigate("/acc-list");
                return;
            }

            alert(result?.message || "Update failed");
        } catch (error) {
            console.log("Update Error:", error);

            alert(
                error?.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

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

    const selectedState =
        stateOptions.find(
            (item) => Number(item.value) === Number(formData.stateId)
        ) || null;

    const selectedDistrict =
        districtOptions.find(
            (item) => Number(item.value) === Number(formData.districtId)
        ) || null;

    const selectedCity =
        cityOptions.find(
            (item) => Number(item.value) === Number(formData.locationId)
        ) || null;

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: "52px",
            borderRadius: "12px",
            borderColor: state.isFocused ? "#ff6b00" : "#e4e8ee",
            boxShadow: state.isFocused
                ? "0 0 0 4px rgba(255,107,0,.08)"
                : "none",
            backgroundColor: "#fff"
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "4px 14px"
        }),
        placeholder: (base) => ({
            ...base,
            color: "#a2aab5",
            fontSize: "13px"
        }),
        singleValue: (base) => ({
            ...base,
            color: "#1f2937",
            fontSize: "13px",
            fontWeight: "500"
        }),
        input: (base) => ({
            ...base,
            fontSize: "13px"
        }),
        indicatorSeparator: () => ({
            display: "none"
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "#8d96a3"
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 18px 45px rgba(20,30,45,.15)"
        }),
        option: (base, state) => ({
            ...base,
            padding: "11px 14px",
            fontSize: "13px",
            backgroundColor: state.isSelected
                ? "#ff6b00"
                : state.isFocused
                    ? "#fff4eb"
                    : "#fff",
            color: state.isSelected ? "#fff" : "#263342"
        })
    };

    if (pageLoading) {
        return (
            <div className="acc-loading-page">
                <div className="acc-loader"></div>
                <h3>Loading...</h3>
                <p>Please wait while we load consultant details.</p>
            </div>
        );
    }

    return (
        <>
            <style>{`
        .acc-page {
            min-height: 100vh;
            padding: 28px 24px 50px;
            background: #f5f7fa;
            color: #202b38;
        }

        .acc-container {
            width: 100%;
            max-width: 1450px;
            margin: 0 auto;
        }

        .acc-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 25px;
            margin-bottom: 22px;
        }

        .acc-breadcrumb {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #8a94a3;
            font-size: 12px;
            font-weight: 600;
        }

        .acc-breadcrumb i {
            font-size: 9px;
            color: #b2bac5;
        }

        .acc-topbar h1 {
            margin: 0;
            color: #172333;
            font-size: 27px;
            line-height: 1.2;
            font-weight: 800;
            letter-spacing: -.4px;
        }

        .acc-topbar p {
            margin: 7px 0 0;
            color: #87919e;
            font-size: 12px;
        }

        .acc-status {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 9px 14px;
            border: 1px solid #dcefe3;
            border-radius: 30px;
            background: #f5fff8;
            color: #249653;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
        }

        .acc-status span {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #2fbd6a;
            box-shadow: 0 0 0 4px rgba(47,189,106,.10);
        }

        .acc-content {
            overflow: hidden;
            border: 1px solid #e5e9ef;
            border-radius: 18px;
            background: #fff;
            box-shadow: 0 10px 35px rgba(30,42,58,.06);
        }

        .acc-section {
            padding: 30px 34px 34px;
            border-bottom: 1px solid #edf0f4;
        }

        .acc-section:last-child {
            border-bottom: 0;
        }

        .acc-section-head {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-bottom: 26px;
        }

        .acc-section-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 11px;
            border: 1px solid #ffe0c9;
            background: #fff5ed;
            color: #f26912;
            font-size: 11px;
            font-weight: 800;
        }

        .acc-section-head h2 {
            margin: 0;
            color: #1e2a38;
            font-size: 17px;
            line-height: 1.2;
            font-weight: 800;
        }

        .acc-section-head p {
            margin: 4px 0 0;
            color: #9aa3ae;
            font-size: 11px;
        }

        .acc-field {
            width: 100%;
        }

        .acc-label {
            display: block;
            margin-bottom: 8px;
            color: #45515f;
            font-size: 11px;
            line-height: 1.2;
            font-weight: 700;
        }

        .acc-label span {
            margin-left: 3px;
            color: #ef4444;
        }

        .acc-input-wrap,
        .acc-textarea-wrap,
        .acc-select-wrap {
            position: relative;
        }

        .acc-input-wrap > i,
        .acc-textarea-wrap > i,
        .acc-select-wrap > i {
            position: absolute;
            z-index: 5;
            left: 15px;
            color: #7d8997;
            font-size: 14px;
            pointer-events: none;
        }

        .acc-input-wrap > i,
        .acc-select-wrap > i {
            top: 50%;
            transform: translateY(-50%);
        }

        .acc-textarea-wrap > i {
            top: 16px;
        }

        .acc-input {
            width: 100%;
            height: 52px;
            padding: 0 15px 0 42px;
            outline: none;
            border: 1px solid #e1e6ec;
            border-radius: 12px;
            background: #fff;
            color: #253141;
            font-size: 13px;
            font-weight: 500;
            transition: all .2s ease;
        }

        .acc-input:hover {
            border-color: #ccd4de;
        }

        .acc-input:focus {
            border-color: #ff6b00;
            box-shadow: 0 0 0 4px rgba(255,107,0,.08);
        }

        .acc-input::placeholder,
        .acc-textarea::placeholder {
            color: #abb3be;
            font-weight: 400;
        }

        .acc-textarea {
            width: 100%;
            min-height: 125px;
            padding: 15px 15px 15px 42px;
            outline: none;
            resize: vertical;
            border: 1px solid #e1e6ec;
            border-radius: 12px;
            background: #fff;
            color: #253141;
            font-size: 13px;
            line-height: 1.6;
            transition: all .2s ease;
        }

        .acc-textarea:focus {
            border-color: #ff6b00;
            box-shadow: 0 0 0 4px rgba(255,107,0,.08);
        }

        .acc-select-wrap > i {
            left: 15px;
        }

        .acc-select-wrap > div {
            width: 100%;
        }

        .acc-error {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: 6px;
            color: #dc3545;
            font-size: 10px;
            font-weight: 600;
        }

        .acc-error i {
            font-size: 10px;
        }

        .acc-document-notice {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-bottom: 24px;
            padding: 14px 16px;
            border: 1px solid #ffe2ce;
            border-radius: 12px;
            background: #fff9f5;
        }

        .acc-notice-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            min-width: 38px;
            border-radius: 10px;
            background: #fff0e5;
            color: #f36b10;
            font-size: 16px;
        }

        .acc-document-notice strong {
            display: block;
            margin-bottom: 3px;
            color: #49372b;
            font-size: 11px;
            font-weight: 800;
        }

        .acc-document-notice span {
            display: block;
            color: #9b8d83;
            font-size: 10px;
        }

        .acc-document-card {
            height: 100%;
            padding: 18px;
            border: 1px solid #e6eaf0;
            border-radius: 14px;
            background: #fff;
            transition: all .2s ease;
        }

        .acc-document-card:hover {
            border-color: #ffd1b0;
            box-shadow: 0 8px 24px rgba(35,45,60,.06);
            transform: translateY(-1px);
        }

        .acc-document-header {
            display: flex;
            align-items: center;
            gap: 11px;
            margin-bottom: 15px;
        }

        .acc-document-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 10px;
            background: #fff2e9;
            color: #f26a0c;
            font-size: 16px;
        }

        .acc-document-header h4 {
            margin: 0;
            color: #303b49;
            font-size: 12px;
            font-weight: 800;
        }

        .acc-document-header p {
            margin: 4px 0 0;
            color: #9aa4b0;
            font-size: 9px;
        }

        .acc-upload-box {
            position: relative;
            display: flex;
            align-items: center;
            gap: 11px;
            min-height: 72px;
            padding: 10px 43px 10px 11px;
            overflow: hidden;
            border: 1px dashed #d5dce5;
            border-radius: 11px;
            background: #fafbfd;
            cursor: pointer;
            transition: all .2s ease;
        }

        .acc-upload-box:hover {
            border-color: #ff6b00;
            background: #fffaf6;
        }

        .acc-upload-box.selected {
            border-style: solid;
            border-color: #34b76b;
            background: #f6fff9;
        }

        .acc-upload-box input[type="file"] {
            position: absolute;
            inset: 0;
            z-index: 10;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }

        .acc-upload-cloud,
        .acc-upload-status {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 39px;
            height: 39px;
            min-width: 39px;
            border-radius: 9px;
            font-size: 14px;
        }

        .acc-upload-cloud {
            background: #fff0e5;
            color: #f36a0c;
        }

        .acc-upload-status {
            background: #e8f9ef;
            color: #19a858;
        }

        .acc-upload-info {
            min-width: 0;
            flex: 1;
        }

        .acc-upload-info strong {
            display: block;
            overflow: hidden;
            color: #3c4755;
            font-size: 10px;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .acc-upload-info span {
            display: block;
            margin-top: 4px;
            overflow: hidden;
            color: #a0a9b4;
            font-size: 9px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .acc-upload-arrow {
            position: absolute;
            right: 13px;
            color: #aab3bf;
            font-size: 12px;
        }

        .acc-remove-file {
            position: absolute;
            right: 10px;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 27px;
            height: 27px;
            border: 0;
            border-radius: 50%;
            background: #fee9e9;
            color: #e74646;
            cursor: pointer;
            font-size: 10px;
        }

        .acc-remove-file:hover {
            background: #ffd4d4;
        }

        .acc-new-preview {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 9px;
        }

        .acc-new-preview img {
            width: 45px;
            height: 45px;
            object-fit: cover;
            border: 1px solid #e0e5eb;
            border-radius: 8px;
        }

        .acc-new-preview div {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #1ba457;
            font-size: 9px;
            font-weight: 700;
        }

        .acc-existing-file {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            padding: 8px;
            border: 1px solid #e8ecf1;
            border-radius: 10px;
            background: #fafbfc;
        }

        .acc-existing-file > img,
        .acc-existing-pdf {
            width: 50px;
            height: 44px;
            min-width: 50px;
            object-fit: cover;
            border-radius: 7px;
        }

        .acc-existing-file > img {
            border: 1px solid #e1e6eb;
        }

        .acc-existing-pdf {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff0ed;
            color: #e45540;
            font-size: 17px;
        }

        .acc-existing-info {
            min-width: 0;
            flex: 1;
        }

        .acc-existing-info span {
            display: block;
            margin-bottom: 3px;
            color: #9ca5b0;
            font-size: 8px;
        }

        .acc-existing-info strong {
            display: block;
            overflow: hidden;
            color: #566272;
            font-size: 9px;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .acc-view-file {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 31px;
            height: 31px;
            min-width: 31px;
            border-radius: 8px;
            background: #fff2e8;
            color: #f2690b;
            text-decoration: none;
            font-size: 12px;
            transition: all .2s ease;
        }

        .acc-view-file:hover {
            background: #ff6b00;
            color: #fff;
        }

        .acc-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 22px 34px;
            background: #fbfcfd;
        }

        .acc-secure {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .acc-secure-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 39px;
            height: 39px;
            min-width: 39px;
            border-radius: 10px;
            background: #eaf9f0;
            color: #1aa65a;
            font-size: 15px;
        }

        .acc-secure strong {
            display: block;
            color: #4b5664;
            font-size: 10px;
            font-weight: 800;
        }

        .acc-secure span {
            display: block;
            margin-top: 3px;
            color: #9ba4af;
            font-size: 9px;
        }

        .acc-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .acc-cancel,
        .acc-submit {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 48px;
            padding: 0 20px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            transition: all .2s ease;
        }

        .acc-cancel {
            border: 1px solid #dce2e9;
            background: #fff;
            color: #697482;
        }

        .acc-cancel:hover {
            border-color: #cbd2da;
            background: #f7f9fb;
            color: #293544;
        }

        .acc-submit {
            min-width: 205px;
            border: 0;
            background: linear-gradient(135deg,#f45d00,#ff780f);
            color: #fff;
            box-shadow: 0 8px 20px rgba(255,107,0,.20);
        }

        .acc-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 11px 25px rgba(255,107,0,.28);
        }

        .acc-submit:active {
            transform: translateY(0);
        }

        .acc-cancel:disabled,
        .acc-submit:disabled {
            opacity: .65;
            cursor: not-allowed;
            transform: none;
        }

        .acc-spinner {
            width: 15px;
            height: 15px;
            border: 2px solid rgba(255,255,255,.35);
            border-top-color: #fff;
            border-radius: 50%;
            animation: accSpin .7s linear infinite;
        }

        .acc-loading-page {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: #f5f7fa;
        }

        .acc-loading-page h3 {
            margin: 17px 0 5px;
            color: #273444;
            font-size: 16px;
            font-weight: 800;
        }

        .acc-loading-page p {
            margin: 0;
            color: #98a2af;
            font-size: 11px;
        }

        .acc-loader {
            width: 42px;
            height: 42px;
            border: 3px solid #e7ebf0;
            border-top-color: #ff6b00;
            border-right-color: #263f53;
            border-radius: 50%;
            animation: accSpin .8s linear infinite;
        }

        @keyframes accSpin {
            to {
                transform: rotate(360deg);
            }
        }

        @media (max-width: 991px) {
            .acc-page {
                padding: 20px 14px 35px;
            }

            .acc-topbar h1 {
                font-size: 23px;
            }

            .acc-section {
                padding: 26px 25px 29px;
            }

            .acc-footer {
                padding: 20px 25px;
            }
        }

        @media (max-width: 767px) {
            .acc-page {
                padding: 12px 8px 25px;
            }

            .acc-topbar {
                align-items: flex-start;
                flex-direction: column;
                margin-bottom: 16px;
            }

            .acc-topbar h1 {
                font-size: 20px;
            }

            .acc-topbar p {
                font-size: 10px;
                line-height: 1.5;
            }

            .acc-status {
                display: none;
            }

            .acc-content {
                border-radius: 14px;
            }

            .acc-section {
                padding: 22px 16px 25px;
            }

            .acc-section-head {
                margin-bottom: 20px;
            }

            .acc-section-number {
                width: 35px;
                height: 35px;
                min-width: 35px;
                border-radius: 9px;
                font-size: 9px;
            }

            .acc-section-head h2 {
                font-size: 14px;
            }

            .acc-section-head p {
                font-size: 9px;
            }

            .acc-footer {
                align-items: stretch;
                flex-direction: column;
                padding: 18px 16px;
            }

            .acc-actions {
                width: 100%;
                flex-direction: column-reverse;
            }

            .acc-cancel,
            .acc-submit {
                width: 100%;
            }

            .acc-document-card {
                padding: 14px;
            }
        }

        @media (max-width: 420px) {
            .acc-page {
                padding: 8px 5px 20px;
            }

            .acc-topbar h1 {
                font-size: 18px;
            }

            .acc-section {
                padding: 19px 12px 22px;
            }

            .acc-input {
                height: 48px;
            }

            .acc-document-header h4 {
                font-size: 11px;
            }

            .acc-upload-box {
                min-height: 66px;
            }
        }
        `}</style>

            <div className="acc-page">
                <div className="acc-container">
                    
 
                    <form onSubmit={handleSubmit}>
                        <div className="acc-content">
                            <div className="acc-section">
                                <div className="acc-section-head">
                                    <div className="acc-section-number">01</div>
                                    <div>
                                        <h2>Personal Information</h2>
                                        <p>Basic consultant profile details</p>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-lg-6">
                                        <Field
                                            label="Institute Name"
                                            name="instituteName"
                                            icon="bi-building"
                                            placeholder="Enter institute name"
                                            required
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <Field
                                            label="Full Name"
                                            name="name"
                                            icon="bi-person"
                                            placeholder="Enter full name"
                                            required
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <Field
                                            label="Father's Name"
                                            name="fatherName"
                                            icon="bi-person-vcard"
                                            placeholder="Enter father's name"
                                            required
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <Field
                                            label="Date of Birth"
                                            name="dob"
                                            icon="bi-calendar3"
                                            type="date"
                                            placeholder="Select date of birth"
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="acc-section">
                                <div className="acc-section-head">
                                    <div className="acc-section-number">02</div>
                                    <div>
                                        <h2>Contact Information</h2>
                                        <p>Phone and email communication details</p>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-lg-4">
                                        <div className="acc-field">
                                            <label className="acc-label">
                                                Mobile Number <span>*</span>
                                            </label>

                                            <div className="acc-input-wrap">
                                                <i className="bi bi-phone"></i>

                                                <input
                                                    type="tel"
                                                    name="mobileNo"
                                                    className="acc-input"
                                                    placeholder="10 digit mobile number"
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

                                                        if (errors.mobileNo) {
                                                            setErrors((prev) => ({
                                                                ...prev,
                                                                mobileNo: ""
                                                            }));
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {errors.mobileNo && (
                                                <div className="acc-error">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.mobileNo}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="acc-field">
                                            <label className="acc-label">
                                                WhatsApp Number
                                            </label>

                                            <div className="acc-input-wrap">
                                                <i className="bi bi-whatsapp"></i>

                                                <input
                                                    type="tel"
                                                    name="whatsAppNo"
                                                    className="acc-input"
                                                    placeholder="WhatsApp number"
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

                                    <div className="col-lg-4">
                                        <Field
                                            label="Email Address"
                                            name="email"
                                            icon="bi-envelope"
                                            type="email"
                                            placeholder="Enter email address"
                                            required
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="acc-section">
                                <div className="acc-section-head">
                                    <div className="acc-section-number">03</div>
                                    <div>
                                        <h2>Professional Information</h2>
                                        <p>Professional background and admission details</p>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-lg-4">
                                        <Field
                                            label="Experience"
                                            name="experience"
                                            icon="bi-clock-history"
                                            placeholder="e.g. 3 Years"
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-lg-4">
                                        <Field
                                            label="Occupation"
                                            name="occupation"
                                            icon="bi-person-badge"
                                            placeholder="Enter occupation"
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-lg-4">
                                        <Field
                                            label="Expected Admissions"
                                            name="expectedAdmissions"
                                            icon="bi-people"
                                            type="number"
                                            placeholder="Expected admissions"
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="acc-section">
                                <div className="acc-section-head">
                                    <div className="acc-section-number">04</div>
                                    <div>
                                        <h2>Address Information</h2>
                                        <p>Location and communication address</p>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="acc-field">
                                            <label className="acc-label">
                                                Full Address <span>*</span>
                                            </label>

                                            <div className="acc-textarea-wrap">
                                                <i className="bi bi-house"></i>

                                                <textarea
                                                    name="address"
                                                    className="acc-textarea"
                                                    rows="4"
                                                    placeholder="Enter complete address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {errors.address && (
                                                <div className="acc-error">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="acc-field">
                                            <label className="acc-label">
                                                State <span>*</span>
                                            </label>

                                            <div className="acc-select-wrap">
                                               

                                                <Select
                                                    options={stateOptions}
                                                    value={selectedState}
                                                    onChange={handleStateChange}
                                                    placeholder="Search state..."
                                                    isSearchable
                                                    isClearable
                                                    noOptionsMessage={() =>
                                                        "State not found"
                                                    }
                                                    styles={selectStyles}
                                                />
                                            </div>

                                            {errors.stateId && (
                                                <div className="acc-error">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.stateId}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="acc-field">
                                            <label className="acc-label">
                                                District <span>*</span>
                                            </label>

                                            <div className="acc-select-wrap">
                                                

                                                <Select
                                                    options={districtOptions}
                                                    value={selectedDistrict}
                                                    onChange={handleDistrictChange}
                                                    placeholder={
                                                        formData.stateId
                                                            ? "Search district..."
                                                            : "Select state first"
                                                    }
                                                    isSearchable
                                                    isClearable
                                                    isDisabled={!formData.stateId}
                                                    noOptionsMessage={() =>
                                                        "District not found"
                                                    }
                                                    styles={selectStyles}
                                                />
                                            </div>

                                            {errors.districtId && (
                                                <div className="acc-error">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.districtId}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="acc-field">
                                            <label className="acc-label">
                                                City <span>*</span>
                                            </label>

                                            <div className="acc-select-wrap">
                                                

                                                <Select
                                                    options={cityOptions}
                                                    value={selectedCity}
                                                    onChange={handleCityChange}
                                                    placeholder={
                                                        formData.districtId
                                                            ? "Search city..."
                                                            : "Select district first"
                                                    }
                                                    isSearchable
                                                    isClearable
                                                    isDisabled={!formData.districtId}
                                                    noOptionsMessage={() =>
                                                        "City not found"
                                                    }
                                                    styles={selectStyles}
                                                />
                                            </div>

                                            {errors.locationId && (
                                                <div className="acc-error">
                                                    <i className="bi bi-exclamation-circle"></i>
                                                    {errors.locationId}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <Field
                                            label="Pin Code"
                                            name="pincode"
                                            icon="bi-mailbox"
                                            placeholder="6 digit pin code"
                                            type="text"
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-lg-8">
                                        <Field
                                            label="Remark"
                                            name="remark"
                                            icon="bi-chat-left-text"
                                            placeholder="Enter any additional remark"
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="acc-section acc-doc-section">
                                <div className="acc-section-head">
                                    <div className="acc-section-number">05</div>
                                    <div>
                                        <h2>Documents & Verification</h2>
                                        <p>Upload or replace consultant documents</p>
                                    </div>
                                </div>

                                <div className="acc-document-notice">
                                    <div className="acc-notice-icon">
                                        <i className="bi bi-shield-check"></i>
                                    </div>

                                    <div>
                                        <strong>Document verification</strong>
                                        <span>
                                            Select a new file only when you want to replace
                                            the existing document.
                                        </span>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-lg-6">
                                        <FileUpload
                                            name="passportPhoto"
                                            label="Passport Photo"
                                            icon={<FaCamera />}
                                            accept="image/*"
                                            description="JPG or PNG • Recommended passport size"
                                            formData={formData}
                                            previews={previews}
                                            handleFileChange={handleFileChange}
                                            removeFile={removeFile}
                                        />
                                        <ExistingFile
                                            file={formData.passportPhoto1}
                                            label="Passport Photo"
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <FileUpload
                                            name="authorizedSignature"
                                            label="Authorized Signature"
                                            icon={<FaSignature />}
                                            accept="image/*"
                                            description="JPG or PNG • Clear signature"
                                            formData={formData}
                                            previews={previews}
                                            handleFileChange={handleFileChange}
                                            removeFile={removeFile}
                                        />
                                        <ExistingFile
                                            file={formData.authorizedSignature1}
                                            label="Authorized Signature"
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <FileUpload
                                            name="instituteCertificate"
                                            label="Institute Certificate"
                                            icon={<FaIdCard />}
                                            accept="image/*,.pdf"
                                            description="JPG, PNG or PDF"
                                            formData={formData}
                                            previews={previews}
                                            handleFileChange={handleFileChange}
                                            removeFile={removeFile}
                                        />
                                        <ExistingFile
                                            file={formData.instituteCertificate1}
                                            label="Institute Certificate"
                                            type="pdf"
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <FileUpload
                                            name="aadhaarCard"
                                            label="Aadhaar Card"
                                            icon={<FaIdCard />}
                                            accept="image/*,.pdf"
                                            description="JPG, PNG or PDF"
                                            formData={formData}
                                            previews={previews}
                                            handleFileChange={handleFileChange}
                                            removeFile={removeFile}
                                        />
                                        <ExistingFile
                                            file={formData.aadhaarCard1}
                                            label="Aadhaar Card"
                                            type="pdf"
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <FileUpload
                                            name="panCard"
                                            label="PAN Card"
                                            icon={<FaFileInvoice />}
                                            accept="image/*,.pdf"
                                            description="JPG, PNG or PDF"
                                            formData={formData}
                                            previews={previews}
                                            handleFileChange={handleFileChange}
                                            removeFile={removeFile}
                                        />
                                        <ExistingFile
                                            file={formData.panCard1}
                                            label="PAN Card"
                                            type="pdf"
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <FileUpload
                                            name="buildingPhoto1"
                                            label="Building Photo 1"
                                            icon={<FaBuilding />}
                                            accept="image/*"
                                            description="JPG or PNG"
                                            formData={formData}
                                            previews={previews}
                                            handleFileChange={handleFileChange}
                                            removeFile={removeFile}
                                        />
                                        <ExistingFile
                                            file={formData.buildingPhoto11}
                                            label="Building Photo 1"
                                        />
                                    </div>

                                    <div className="col-lg-6">
                                        <FileUpload
                                            name="buildingPhoto2"
                                            label="Building Photo 2"
                                            icon={<FaBuilding />}
                                            accept="image/*"
                                            description="JPG or PNG"
                                            formData={formData}
                                            previews={previews}
                                            handleFileChange={handleFileChange}
                                            removeFile={removeFile}
                                        />
                                        <ExistingFile
                                            file={formData.buildingPhoto21}
                                            label="Building Photo 2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="acc-footer">
                                <div className="acc-secure">
                                    <div className="acc-secure-icon">
                                        <i className="bi bi-shield-lock"></i>
                                    </div>

                                    <div>
                                        <strong>Secure information</strong>
                                        <span>Your consultant data is protected.</span>
                                    </div>
                                </div>

                                <div className="acc-actions">
                                    <button
                                        type="button"
                                        className="acc-cancel"
                                        onClick={() => navigate(-1)}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-left"></i>
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="acc-submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="acc-spinner"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check2"></i>
                                                Update Consultant
                                                <i className="bi bi-arrow-right"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AccUpdate;