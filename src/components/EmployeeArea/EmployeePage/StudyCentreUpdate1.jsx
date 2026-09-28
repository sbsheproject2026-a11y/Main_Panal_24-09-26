 import React, { useEffect, useState } from "react";

import {
    FaUniversity,
    FaShieldAlt,
    FaFileInvoice,
    FaIdCard,
    FaCamera,
    FaSignature,
    FaBuilding,
    FaUpload,
    FaCheckCircle,
    FaTimes,
    FaPaperPlane,
    FaLock,
    FaEye,
    FaSyncAlt
} from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";

import {
    getFrenchiseByIdapi,
    updateStudyCentreapi
} from "../../AllServicesFiles/FrenchiseService";

import { FILE_URL } from "../../api";


const StudyCentreUpdate1 = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const userId = localStorage.getItem("UserId") || "";

    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({});
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: userId,

        // NEW FILES
        aadhaarCard: null,
        panCard: null,
        passportPhoto: null,
        authorizedSignature: null,
        instituteCertificate: null,
        buildingPhoto1: null,
        buildingPhoto2: null,

        // EXISTING FILE PATHS
        aadhaarCard1: "",
        panCard1: "",
        passportPhoto1: "",
        authorizedSignature1: "",
        instituteCertificate1: "",
        buildingPhoto11: "",
        buildingPhoto21: "",

        isActive: 1
    });


    // ================================
    // GET EXISTING DATA
    // ================================

    useEffect(() => {

        if (id) {
            handleEdit(id);
        }

    }, [id]);


    const handleEdit = async (editId) => {

        try {

            setLoading(true);

            const result = await getFrenchiseByIdapi(editId);

            console.log("Existing Study Centre Data:", result);

            setFormData({
                id: result.id ?? editId,

                // New files remain null
                aadhaarCard: null,
                panCard: null,
                passportPhoto: null,
                authorizedSignature: null,
                instituteCertificate: null,
                buildingPhoto1: null,
                buildingPhoto2: null,

                // Existing files
                aadhaarCard1: result.aadhaarCardimage ?? "",
                panCard1: result.panCardimage ?? "",
                passportPhoto1: result.passportPhoto ?? "",
                authorizedSignature1: result.authorizedSignature ?? "",
                instituteCertificate1: result.instituteCertificate ?? "",
                buildingPhoto11: result.buildingPhoto1 ?? "",
                buildingPhoto21: result.buildingPhoto2 ?? "",

                isActive: result.isActive ?? 1
            });

        } catch (error) {

            console.error("Get Study Centre Error:", error);

        } finally {

            setLoading(false);

        }

    };


    // ================================
    // CLEAR ERROR
    // ================================

    const clearError = (fieldName) => {

        setErrors((prev) => {

            if (!prev[fieldName]) {
                return prev;
            }

            const updatedErrors = { ...prev };

            delete updatedErrors[fieldName];

            return updatedErrors;

        });

    };


    // ================================
    // FILE CHANGE
    // ================================

    const handleFileChange = (e, fieldName) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Old preview remove
        if (previews[fieldName]) {
            URL.revokeObjectURL(previews[fieldName]);
        }

        setFormData((prev) => ({
            ...prev,
            [fieldName]: file
        }));

        clearError(fieldName);

        // Image preview
        if (file.type.startsWith("image/")) {

            const previewUrl = URL.createObjectURL(file);

            setPreviews((prev) => ({
                ...prev,
                [fieldName]: previewUrl
            }));

        } else {

            setPreviews((prev) => ({
                ...prev,
                [fieldName]: null
            }));

        }

    };


    // ================================
    // REMOVE FILE
    // ================================

    const removeFile = (fieldName, oldFieldName) => {

        // Remove new preview
        if (previews[fieldName]) {
            URL.revokeObjectURL(previews[fieldName]);
        }

        setPreviews((prev) => ({
            ...prev,
            [fieldName]: null
        }));

        setFormData((prev) => ({
            ...prev,

            // New file remove
            [fieldName]: null,

            // Existing file remove
            ...(oldFieldName
                ? { [oldFieldName]: "" }
                : {})
        }));

        clearError(fieldName);

    };


    // ================================
    // OPEN EXISTING DOCUMENT
    // ================================

    const openExistingFile = (filePath) => {

        if (!filePath) {
            return;
        }

        const fileUrl = `${FILE_URL}${filePath}`;

        window.open(fileUrl, "_blank");

    };


    // ================================
    // FILE UPLOAD COMPONENT
    // ================================

    const FileUpload = ({
        name,
        oldName,
        label,
        icon,
        accept = "image/*,.pdf",
        description
    }) => {

        const selectedFile = formData[name];

        const oldFile = formData[oldName];

        const preview = previews[name];

        const hasNewFile =
            selectedFile instanceof File;

        const hasOldFile =
            oldFile &&
            typeof oldFile === "string";


        return (
            <div className="col-md-6 mb-3">

                <div className="scr-upload-group">

                    <label>
                        {label}
                    </label>


                    {/* EXISTING DOCUMENT */}

                    {hasOldFile && !hasNewFile && (

                        <div className="scr-existing-file">

                            <div className="scr-existing-left">

                                <FaCheckCircle />

                                <div>

                                    <strong>
                                        Existing Document
                                    </strong>

                                    <small>
                                        Already uploaded
                                    </small>

                                </div>

                            </div>


                            <div className="scr-existing-actions">

                                <button
                                    type="button"
                                    className="scr-view-btn"
                                    onClick={() =>
                                        openExistingFile(oldFile)
                                    }
                                    title="View Document"
                                >
                                    <FaEye />
                                </button>

                                <button
                                    type="button"
                                    className="scr-replace-btn"
                                    onClick={() => {
                                        document
                                            .getElementById(`file-${name}`)
                                            ?.click();
                                    }}
                                    title="Replace Document"
                                >
                                    <FaSyncAlt />
                                </button>

                            </div>

                        </div>

                    )}


                    {/* UPLOAD / NEW FILE */}

                    <div
                        className={
                            hasNewFile
                                ? "scr-upload-box selected"
                                : "scr-upload-box"
                        }
                    >

                        <input
                            id={`file-${name}`}
                            type="file"
                            name={name}
                            accept={accept}
                            onChange={(e) =>
                                handleFileChange(e, name)
                            }
                        />


                        <div className="scr-upload-icon">
                            {icon}
                        </div>


                        <div className="scr-upload-content">

                            {hasNewFile ? (

                                <>
                                    <strong>
                                        {selectedFile.name}
                                    </strong>

                                    <small>
                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                    </small>
                                </>

                            ) : (

                                <>
                                    <strong>
                                        {hasOldFile
                                            ? "Replace Document"
                                            : "Click to upload"}
                                    </strong>

                                    <small>
                                        {description ||
                                            "PDF / JPG / PNG"}
                                    </small>
                                </>

                            )}

                        </div>


                        {hasNewFile ? (

                            <button
                                type="button"
                                className="scr-remove-file"
                                onClick={() =>
                                    removeFile(
                                        name,
                                        oldName
                                    )
                                }
                            >
                                <FaTimes />
                            </button>

                        ) : (

                            <div className="scr-upload-action">
                                <FaUpload />
                            </div>

                        )}

                    </div>


                    {/* NEW IMAGE PREVIEW */}

                    {preview && (

                        <div className="scr-file-preview">

                            <img
                                src={preview}
                                alt={label}
                            />

                            <div>
                                <FaCheckCircle />
                                <span>
                                    New file selected
                                </span>
                            </div>

                        </div>

                    )}

                    {errors[name] && (
                        <small className="scr-error">
                            {errors[name]}
                        </small>
                    )}

                </div>

            </div>
        );
    };


    // ================================
    // SUBMIT
    // ================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            /*
             IMPORTANT:

             Existing files:
             aadhaarCard1
             panCard1
             etc.

             New files:
             aadhaarCard
             panCard
             etc.

             Only new selected files will be File objects.
            */

            const result = await updateStudyCentreapi(formData);

            console.log(
                "Study Centre Updated:",
                result
            );


            if (result?.message === "Successfully") {

                alert(
                    "Study Centre updated successfully!"
                );

                navigate("/employee-dashboard");

                return;
            }


            alert(
                result?.message ||
                "Study Centre update failed!"
            );

        } catch (error) {

            console.error(
                "Study Centre Update Error:",
                error
            );

            alert(
                "Something went wrong while updating!"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="scr-page">

            <div className="scr-container">

                <div className="scr-card">


                    {/* HEADER */}

                    <div className="scr-header">

                        <div className="scr-header-left">

                            <div className="scr-icon">
                                <FaUniversity />
                            </div>

                            <div>

                                <h2>
                                    Update Study Centre
                                </h2>

                                <p>
                                    Update your study centre documents
                                </p>

                            </div>

                        </div>


                        <div className="scr-header-badge">

                            <FaShieldAlt />

                            Secure Update

                        </div>

                    </div>


                    {/* FORM */}

                    <form
                        className="scr-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >


                        {/* DOCUMENT SECTION */}

                        <div className="scr-section">


                            <div className="scr-section-head">

                                <div className="scr-section-icon">
                                    <FaFileInvoice />
                                </div>

                                <div>

                                    <h3>
                                        Documents & Verification
                                    </h3>

                                    <p>
                                        View existing documents or upload new documents
                                    </p>

                                </div>

                            </div>


                            <div className="scr-document-note">

                                <FaShieldAlt />

                                <div>

                                    <strong>
                                        Document Update Guidelines
                                    </strong>

                                    <span>
                                        Existing documents are shown below. You can view them or replace them with new files.
                                    </span>

                                </div>

                            </div>


                            <div className="row">


                                {/* AADHAAR */}

                                <FileUpload
                                    name="aadhaarCard"
                                    oldName="aadhaarCard1"
                                    label="Aadhaar Card"
                                    icon={<FaIdCard />}
                                    accept="image/*,.pdf"
                                    description="JPG, PNG or PDF"
                                />


                                {/* PAN */}

                                <FileUpload
                                    name="panCard"
                                    oldName="panCard1"
                                    label="PAN Card"
                                    icon={<FaFileInvoice />}
                                    accept="image/*,.pdf"
                                    description="JPG, PNG or PDF"
                                />


                                {/* PASSPORT */}

                                <FileUpload
                                    name="passportPhoto"
                                    oldName="passportPhoto1"
                                    label="Passport Size Photo"
                                    icon={<FaCamera />}
                                    accept="image/*"
                                    description="JPG / PNG image"
                                />


                                {/* SIGNATURE */}

                                <FileUpload
                                    name="authorizedSignature"
                                    oldName="authorizedSignature1"
                                    label="Authorized Signature"
                                    icon={<FaSignature />}
                                    accept="image/*"
                                    description="JPG / PNG image"
                                />


                                {/* INSTITUTE CERTIFICATE */}

                                <FileUpload
                                    name="instituteCertificate"
                                    oldName="instituteCertificate1"
                                    label="Institute Registration Certificate / Building Photo"
                                    icon={<FaBuilding />}
                                    accept="image/*,.pdf"
                                    description="Certificate PDF or Building Photo"
                                />


                                {/* BUILDING PHOTO 1 */}

                                <FileUpload
                                    name="buildingPhoto1"
                                    oldName="buildingPhoto11"
                                    label="Building Photo 1"
                                    icon={<FaBuilding />}
                                    accept="image/*"
                                    description="Front / Outside View"
                                />


                                {/* BUILDING PHOTO 2 */}

                                <FileUpload
                                    name="buildingPhoto2"
                                    oldName="buildingPhoto21"
                                    label="Building Photo 2"
                                    icon={<FaBuilding />}
                                    accept="image/*"
                                    description="Inside / Classroom View"
                                />

                            </div>

                        </div>


                        {/* FOOTER */}

                        <div className="scr-footer">


                            <div className="scr-security">

                                <div className="scr-security-icon">
                                    <FaLock />
                                </div>

                                <div>

                                    <strong>
                                        Your information is secure
                                    </strong>

                                    <span>
                                        Existing documents will remain unchanged unless replaced.
                                    </span>

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="scr-submit"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        Update Registration
                                    </>
                                )}

                            </button>

                        </div>


                    </form>

                </div>

            </div>


            <style>{`

                .scr-page{
                    min-height:100vh;
                    padding:30px 15px;
                    background:#f4f7fb;
                }

                .scr-container{
                    max-width:1180px;
                    margin:auto;
                }

                .scr-card{
                    background:#fff;
                    border:1px solid #e7ebf1;
                    border-radius:14px;
                    overflow:hidden;
                    box-shadow:0 8px 30px rgba(20,40,70,.07);
                }

                .scr-header{
                    padding:22px 28px;
                    background:linear-gradient(135deg,#ff6b00,#f45100);
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    color:#fff;
                }

                .scr-header-left{
                    display:flex;
                    align-items:center;
                    gap:15px;
                }

                .scr-icon{
                    width:54px;
                    height:54px;
                    flex:0 0 54px;
                    border-radius:12px;
                    background:rgba(255,255,255,.16);
                    border:1px solid rgba(255,255,255,.22);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:23px;
                }

                .scr-header h2{
                    margin:0 0 4px;
                    color:#fff;
                    font-size:23px;
                    font-weight:700;
                }

                .scr-header p{
                    margin:0;
                    color:rgba(255,255,255,.9);
                    font-size:13px;
                }

                .scr-header-badge{
                    display:flex;
                    align-items:center;
                    gap:7px;
                    padding:8px 13px;
                    border-radius:20px;
                    background:rgba(255,255,255,.14);
                    border:1px solid rgba(255,255,255,.2);
                    font-size:11px;
                    font-weight:600;
                    white-space:nowrap;
                }

                .scr-form{
                    padding:26px 28px;
                }

                .scr-section{
                    margin-bottom:24px;
                    padding:20px;
                    border:1px solid #e9edf3;
                    border-radius:11px;
                    background:#fff;
                }

                .scr-section-head{
                    display:flex;
                    align-items:center;
                    gap:11px;
                    padding-bottom:15px;
                    margin-bottom:18px;
                    border-bottom:1px solid #edf0f4;
                }

                .scr-section-icon{
                    width:35px;
                    height:35px;
                    flex:0 0 35px;
                    border-radius:8px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#fff2e8;
                    color:#f56600;
                    font-size:14px;
                }

                .scr-section-head h3{
                    margin:0 0 2px;
                    color:#202938;
                    font-size:15px;
                    font-weight:700;
                }

                .scr-section-head p{
                    margin:0;
                    color:#8a94a6;
                    font-size:11px;
                }

                .scr-document-note{
                    display:flex;
                    align-items:center;
                    gap:10px;
                    padding:12px 14px;
                    margin-bottom:20px;
                    border-radius:8px;
                    background:#fff8f2;
                    border:1px solid #ffe2cd;
                    color:#f56600;
                }

                .scr-document-note>svg{
                    font-size:16px;
                    flex-shrink:0;
                }

                .scr-document-note strong,
                .scr-document-note span{
                    display:block;
                }

                .scr-document-note strong{
                    font-size:11px;
                    margin-bottom:2px;
                }

                .scr-document-note span{
                    color:#8a94a6;
                    font-size:10px;
                }

                .scr-upload-group{
                    margin-bottom:18px;
                }

                .scr-upload-group label{
                    display:block;
                    margin-bottom:6px;
                    color:#374151;
                    font-size:12px;
                    font-weight:600;
                }

                .scr-upload-box{
                    position:relative;
                    min-height:74px;
                    width:100%;
                    padding:10px 42px 10px 12px;
                    display:flex;
                    align-items:center;
                    gap:12px;
                    border:1px dashed #d5dce6;
                    border-radius:8px;
                    background:#fafbfc;
                    cursor:pointer;
                    transition:.2s ease;
                }

                .scr-upload-box:hover{
                    border-color:#ff720d;
                    background:#fffaf6;
                }

                .scr-upload-box.selected{
                    border-color:#22c55e;
                    background:#f5fff8;
                    border-style:solid;
                }

                .scr-upload-box input[type=file]{
                    position:absolute;
                    inset:0;
                    width:100%;
                    height:100%;
                    opacity:0;
                    cursor:pointer;
                    z-index:3;
                }

                .scr-upload-icon{
                    width:40px;
                    height:40px;
                    flex:0 0 40px;
                    border-radius:8px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#fff0e5;
                    color:#f56600;
                    font-size:16px;
                }

                .scr-upload-content{
                    min-width:0;
                    flex:1;
                }

                .scr-upload-content strong,
                .scr-upload-content small{
                    display:block;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }

                .scr-upload-content strong{
                    color:#374151;
                    font-size:11px;
                    margin-bottom:3px;
                }

                .scr-upload-content small{
                    color:#9aa3b2;
                    font-size:9px;
                }

                .scr-upload-action{
                    position:absolute;
                    right:13px;
                    color:#f56600;
                    font-size:13px;
                    z-index:2;
                }

                .scr-remove-file{
                    position:absolute;
                    right:10px;
                    top:50%;
                    transform:translateY(-50%);
                    width:25px;
                    height:25px;
                    border:0;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#fee2e2;
                    color:#ef4444;
                    cursor:pointer;
                    z-index:5;
                }

                .scr-existing-file{
                    min-height:58px;
                    padding:10px 12px;
                    margin-bottom:8px;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:10px;
                    border:1px solid #d9f2e3;
                    border-radius:8px;
                    background:#f5fff8;
                }

                .scr-existing-left{
                    display:flex;
                    align-items:center;
                    gap:9px;
                    min-width:0;
                }

                .scr-existing-left>svg{
                    color:#16a34a;
                    flex-shrink:0;
                }

                .scr-existing-left strong,
                .scr-existing-left small{
                    display:block;
                }

                .scr-existing-left strong{
                    color:#374151;
                    font-size:11px;
                }

                .scr-existing-left small{
                    color:#8a94a6;
                    font-size:9px;
                    margin-top:2px;
                }

                .scr-existing-actions{
                    display:flex;
                    gap:5px;
                }

                .scr-view-btn,
                .scr-replace-btn{
                    width:30px;
                    height:30px;
                    border:0;
                    border-radius:6px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    cursor:pointer;
                }

                .scr-view-btn{
                    background:#eaf2ff;
                    color:#2563eb;
                }

                .scr-replace-btn{
                    background:#fff0e5;
                    color:#f56600;
                }

                .scr-view-btn:hover{
                    background:#dbeafe;
                }

                .scr-replace-btn:hover{
                    background:#ffe4d0;
                }

                .scr-file-preview{
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-top:6px;
                }

                .scr-file-preview img{
                    width:38px;
                    height:38px;
                    object-fit:cover;
                    border-radius:5px;
                    border:1px solid #e5e7eb;
                }

                .scr-file-preview div{
                    display:flex;
                    align-items:center;
                    gap:5px;
                    color:#16a34a;
                    font-size:10px;
                }

                .scr-error{
                    display:block!important;
                    margin-top:5px!important;
                    color:#ef4444!important;
                    font-size:11px!important;
                    font-weight:500;
                }

                .scr-footer{
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:20px;
                    padding:20px 4px 0;
                    border-top:1px solid #edf0f4;
                }

                .scr-security{
                    display:flex;
                    align-items:center;
                    gap:10px;
                }

                .scr-security-icon{
                    width:35px;
                    height:35px;
                    border-radius:8px;
                    background:#ecfdf3;
                    color:#16a34a;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:13px;
                }

                .scr-security strong,
                .scr-security span{
                    display:block;
                }

                .scr-security strong{
                    color:#374151;
                    font-size:11px;
                    margin-bottom:2px;
                }

                .scr-security span{
                    color:#9aa3b2;
                    font-size:10px;
                }

                .scr-submit{
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;
                    gap:8px;
                    border:0;
                    min-width:205px;
                    padding:12px 20px;
                    border-radius:7px;
                    background:linear-gradient(135deg,#ff6b00,#f45100);
                    color:#fff;
                    font-size:13px;
                    font-weight:600;
                    cursor:pointer;
                    box-shadow:0 5px 14px rgba(245,81,0,.2);
                }

                .scr-submit:disabled{
                    opacity:.65;
                    cursor:not-allowed;
                    transform:none;
                }

                @media(max-width:767px){

                    .scr-page{
                        padding:15px 8px;
                    }

                    .scr-header{
                        padding:18px;
                    }

                    .scr-header-badge{
                        display:none;
                    }

                    .scr-header h2{
                        font-size:18px;
                    }

                    .scr-header p{
                        font-size:11px;
                    }

                    .scr-form{
                        padding:15px;
                    }

                    .scr-section{
                        padding:15px;
                    }

                    .scr-footer{
                        flex-direction:column;
                        align-items:stretch;
                    }

                    .scr-submit{
                        width:100%;
                    }

                }

            `}</style>

        </div>

    );

};

export default StudyCentreUpdate1;