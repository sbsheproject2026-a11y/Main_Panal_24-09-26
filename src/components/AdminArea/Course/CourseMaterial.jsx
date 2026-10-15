 import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getDuration,
    createCourseMaterial,
    getCoursematerial,
    deleteCourseMetrial,
} from "../../AllServicesFiles/CourseService";
import { FILE_URL } from "../../api";

function CourseMaterial() {
    const { id } = useParams();
    const productId = Number(id) || 0;

    const fileInputRefs = useRef({});

    // =========================================================
    // STATES
    // =========================================================

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [documentTypes, setDocumentTypes] = useState([]);
    const [documentExtensionTypes, setDocumentExtensionTypes] = useState([]);
    const [documentTypeLoading, setDocumentTypeLoading] = useState(false);
    const [documentExtensionLoading, setDocumentExtensionLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [deleteId, setDeleteId] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const totalRecords = data.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalRecords / recordsPerPage)
    );

    const startIndex = (currentPage - 1) * recordsPerPage;

    const endIndex = Math.min(
        startIndex + recordsPerPage,
        totalRecords
    );

    const paginatedData = data.slice(startIndex, endIndex);

    // =========================================================
    // EMPTY MATERIAL
    // =========================================================

    const getEmptyMaterial = (srNo = 0) => ({
        id: 0,
        name: "",
        productId,
        documentTypeId: 0,
        docExtensionId: 0,
        srNo,
        altTag: "",
        fileupload1: null,
        fileupload: "",
    });

    // =========================================================
    // CREATE FORM
    // =========================================================

    const [formData, setFormData] = useState(getEmptyMaterial(0));

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadDocumentTypes();
        loadDocumentExtensionTypes();

        setCurrentPage(1);

        if (productId > 0) {
            loadCourseMaterials(productId);
        } else {
            setData([]);
        }
    }, [productId]);

    // =========================================================
    // KEEP PAGINATION VALID
    // =========================================================

    useEffect(() => {
        const pages = Math.max(
            1,
            Math.ceil(data.length / recordsPerPage)
        );

        if (currentPage > pages) {
            setCurrentPage(pages);
        }
    }, [data.length, currentPage]);

    // =========================================================
    // LOAD DOCUMENT TYPES
    // =========================================================

    const loadDocumentTypes = async () => {
        try {
            setDocumentTypeLoading(true);

            const result = await getDuration(34);

            setDocumentTypes(
                Array.isArray(result?.data) ? result.data : []
            );
        } catch (error) {
            console.error("Document Type Error:", error);
            setDocumentTypes([]);
        } finally {
            setDocumentTypeLoading(false);
        }
    };

    // =========================================================
    // LOAD DOCUMENT EXTENSION TYPES
    // =========================================================

    const loadDocumentExtensionTypes = async () => {
        try {
            setDocumentExtensionLoading(true);

            const result = await getDuration(38);

            setDocumentExtensionTypes(
                Array.isArray(result?.data) ? result.data : []
            );
        } catch (error) {
            console.error("Document Extension Type Error:", error);
            setDocumentExtensionTypes([]);
        } finally {
            setDocumentExtensionLoading(false);
        }
    };

    // =========================================================
    // LOAD COURSE MATERIALS
    // =========================================================

    const loadCourseMaterials = async (courseProductId) => {
        try {
            setLoading(true);

            const result = await getCoursematerial(courseProductId);

            setData(
                Array.isArray(result?.data) ? result.data : []
            );
        } catch (error) {
            console.error("Load Course Material Error:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // CREATE FIELD CHANGE
    // =========================================================

    const handleMaterialChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            productId,
        }));
    };

    // =========================================================
    // CREATE FILE CHANGE
    // =========================================================

    const handleFileChange = (file) => {
        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            fileupload1: file,
            productId,
        }));
    };

    // =========================================================
    // REMOVE CREATE FILE
    // =========================================================

    const removeFile = () => {
        setFormData((prev) => ({
            ...prev,
            fileupload1: null,
        }));

        if (fileInputRefs.current.create) {
            fileInputRefs.current.create.value = "";
        }
    };

    // =========================================================
    // OPEN CREATE
    // =========================================================

    const openCreate = () => {
        if (productId <= 0) {
            alert("Invalid Product ID.");
            return;
        }

        setFormData(getEmptyMaterial(0));
        setShowForm(true);
    };

    // =========================================================
    // CLOSE FORM
    // =========================================================

    const closeForm = () => {
        if (loading) return;

        setShowForm(false);
        setFormData(getEmptyMaterial(0));
        fileInputRefs.current = {};
    };

    // =========================================================
    // VALIDATE CREATE
    // =========================================================

    const validateCreate = () => {
        if (!formData.name?.trim()) {
            alert("Please enter Material Name.");
            return false;
        }

        if (!Number(formData.documentTypeId)) {
            alert("Please select Document Type.");
            return false;
        }

        if (!Number(formData.docExtensionId)) {
            alert("Please select Document Extension Type.");
            return false;
        }

        if (!(formData.fileupload1 instanceof File)) {
            alert("Please upload file.");
            return false;
        }

        return true;
    };

    // =========================================================
    // CREATE MATERIAL
    // =========================================================

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!validateCreate()) return;

        if (!productId || productId <= 0) {
            alert("Invalid Product ID.");
            return;
        }

        try {
            setLoading(true);

            const material = {
                id: 0,
                name: formData.name?.trim() || "",
                productId: Number(productId),
                documentTypeId: Number(formData.documentTypeId) || 0,
                docExtensionId: Number(formData.docExtensionId) || 0,
                srNo: Number(formData.srNo) || 0,
                altTag: formData.altTag?.trim() || "",
                fileupload1: formData.fileupload1 || null,
                fileupload: "",
            };

            console.log("CREATE MATERIAL DATA:", material);

            await createCourseMaterial(material);

            alert("Course Material created successfully.");

            setShowForm(false);
            setFormData(getEmptyMaterial(0));

            await loadCourseMaterials(productId);

        } catch (error) {
            console.error("Create Course Material Error:", error);
            showApiError(
                error,
                "Something went wrong while creating Course Material."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const openDelete = (materialId) => {
        if (!materialId) return;

        setDeleteId(Number(materialId));
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) return;

        setShowDeleteModal(false);
        setDeleteId(0);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleteLoading(true);

            await deleteCourseMetrial(deleteId);

            alert("Course Material deleted successfully.");

            setShowDeleteModal(false);
            setDeleteId(0);

            await loadCourseMaterials(productId);

        } catch (error) {
            console.error("Delete Course Material Error:", error);
            showApiError(
                error,
                "Something went wrong while deleting Course Material."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // =========================================================
    // API ERROR
    // =========================================================

    const showApiError = (error, defaultMessage) => {
        const apiError = error?.response?.data;

        let message = defaultMessage;

        if (apiError?.errors) {
            const messages = Object.entries(apiError.errors).map(
                ([field, values]) =>
                    `${field}: ${
                        Array.isArray(values) ? values.join(", ") : values
                    }`
            );
            message = messages.join("\n");
        } else if (typeof apiError === "string") {
            message = apiError;
        } else if (apiError?.message) {
            message = apiError.message;
        } else if (apiError?.title) {
            message = apiError.title;
        } else if (error?.message) {
            message = error.message;
        }

        alert(message);
    };

    // =========================================================
    // HELPERS
    // =========================================================

    const getDocumentTypeName = (documentTypeId, documentType) => {
        if (documentType) return documentType;

        const found = documentTypes.find(
            (item) => Number(item.id) === Number(documentTypeId)
        );

        return found?.name || "-";
    };

    const getDocumentExtensionName = (docExtensionId, docExtension) => {
        if (docExtension) return docExtension;

        const found = documentExtensionTypes.find(
            (item) => Number(item.id) === Number(docExtensionId)
        );

        return found?.name || "-";
    };

    const getFileValue = (item) =>
        item?.fileupload ||
        item?.fileupload1 ||
        item?.Fileupload1 ||
        item?.fileUpload1 ||
        item?.fileName ||
        "";

    const formatFileName = (file) => {
        if (!file) return "";

        if (typeof file === "string") {
            return file.split("/").pop().split("\\").pop();
        }

        return file.name || "";
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="course-material-page">
            <div className="course-material-container">

                {/* HEADER */}
                <div className="material-page-header">
                    <div className="material-header-left">
                        <div className="material-header-icon">
                            <i className="bi bi-journal-richtext"></i>
                        </div>
                        <div>
                            <h2>Course Material</h2>
                            <p>Manage course materials and documents</p>
                        </div>
                    </div>

                    {!showForm && (
                        <div className="material-header-right">
                            <div className="material-total">
                                <span>
                                    <i className="bi bi-collection"></i>
                                </span>
                                <div>
                                    <strong>{data.length}</strong>
                                    <small>Materials</small>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="material-primary-btn"
                                onClick={openCreate}
                            >
                                <i className="bi bi-plus-lg"></i>
                                Add Course Material
                            </button>
                        </div>
                    )}
                </div>

                {/* ✅ REDESIGNED CREATE FORM */}
                {showForm && (
                    <form onSubmit={handleCreate}>
                        <div className="material-form-wrapper">

                            {/* ============================================
                                FORM HERO / BANNER
                            ============================================ */}
                            <div className="material-form-hero">
                                <div className="hero-left">
                                    <div className="hero-icon">
                                        <i className="bi bi-cloud-plus-fill"></i>
                                    </div>
                                    <div>
                                        <h3>Add New Course Material</h3>
                                        <p>
                                            Fill in the details below to upload a new
                                            study material for this course
                                        </p>
                                    </div>
                                </div>

                                <div className="hero-badge">
                                    <i className="bi bi-hash"></i>
                                    <span>Product ID: <strong>{productId}</strong></span>
                                </div>
                            </div>

                            {/* ============================================
                                SECTION 1 — BASIC INFORMATION
                            ============================================ */}
                            <div className="material-form-card">
                                <div className="material-card-header">
                                    <div className="header-icon-wrap blue">
                                        <i className="bi bi-info-circle-fill"></i>
                                    </div>
                                    <div className="header-text">
                                        <h4>Basic Information</h4>
                                        <span>Material details and category</span>
                                    </div>
                                </div>

                                <div className="material-card-body">
                                    <div className="row g-4">

                                        {/* Document Type */}
                                        <div className="col-lg-4 col-md-6">
                                            <label className="material-field-label">
                                                Document Type <span>*</span>
                                            </label>
                                            <div className="material-input-wrap">
                                                <i className="bi bi-file-earmark-text input-prefix"></i>
                                                <select
                                                    className="material-input with-icon"
                                                    value={formData.documentTypeId}
                                                    onChange={(e) =>
                                                        handleMaterialChange(
                                                            "documentTypeId",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={documentTypeLoading}
                                                >
                                                    <option value="0">
                                                        {documentTypeLoading
                                                            ? "Loading..."
                                                            : "Select Document Type"}
                                                    </option>
                                                    {documentTypes.map((type) => (
                                                        <option key={type.id} value={type.id}>
                                                            {type.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Document Extension Type */}
                                        <div className="col-lg-4 col-md-6">
                                            <label className="material-field-label">
                                                Document Extension Type <span>*</span>
                                            </label>
                                            <div className="material-input-wrap">
                                                <i className="bi bi-filetype-pdf input-prefix"></i>
                                                <select
                                                    className="material-input with-icon"
                                                    value={formData.docExtensionId}
                                                    onChange={(e) =>
                                                        handleMaterialChange(
                                                            "docExtensionId",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={documentExtensionLoading}
                                                >
                                                    <option value="0">
                                                        {documentExtensionLoading
                                                            ? "Loading..."
                                                            : "Select Document Extension"}
                                                    </option>
                                                    {documentExtensionTypes.map((type) => (
                                                        <option key={type.id} value={type.id}>
                                                            {type.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Sr No */}
                                        <div className="col-lg-4 col-md-6">
                                            <label className="material-field-label">
                                                Sr No
                                            </label>
                                            <div className="material-input-wrap">
                                                <i className="bi bi-123 input-prefix"></i>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="material-input with-icon"
                                                    value={formData.srNo}
                                                    onChange={(e) =>
                                                        handleMaterialChange(
                                                            "srNo",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter serial number"
                                                />
                                            </div>
                                        </div>

                                        {/* Material Name */}
                                        <div className="col-lg-6 col-md-6">
                                            <label className="material-field-label">
                                                Material Name <span>*</span>
                                            </label>
                                            <div className="material-input-wrap">
                                                <i className="bi bi-type input-prefix"></i>
                                                <input
                                                    type="text"
                                                    className="material-input with-icon"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        handleMaterialChange(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. Chapter 1 - Introduction"
                                                />
                                            </div>
                                        </div>

                                        {/* Alt Tag */}
                                        <div className="col-lg-6 col-md-6">
                                            <label className="material-field-label">
                                                Alt Tag
                                            </label>
                                            <div className="material-input-wrap">
                                                <i className="bi bi-tag input-prefix"></i>
                                                <input
                                                    type="text"
                                                    className="material-input with-icon"
                                                    value={formData.altTag}
                                                    onChange={(e) =>
                                                        handleMaterialChange(
                                                            "altTag",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter alt tag for SEO"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* ============================================
                                SECTION 2 — FILE UPLOAD
                            ============================================ */}
                            <div className="material-form-card">
                                <div className="material-card-header">
                                    <div className="header-icon-wrap green">
                                        <i className="bi bi-cloud-arrow-up-fill"></i>
                                    </div>
                                    <div className="header-text">
                                        <h4>File Upload</h4>
                                        <span>Upload the material file (required)</span>
                                    </div>
                                </div>

                                <div className="material-card-body">
                                    <input
                                        type="file"
                                        className="d-none"
                                        ref={(el) =>
                                            (fileInputRefs.current.create = el)
                                        }
                                        onChange={(e) =>
                                            handleFileChange(
                                                e.target.files?.[0]
                                            )
                                        }
                                    />

                                    {!formData.fileupload1 ? (
                                        <div
                                            className="material-upload-zone"
                                            onClick={() =>
                                                fileInputRefs.current.create?.click()
                                            }
                                        >
                                            <div className="upload-zone-icon">
                                                <i className="bi bi-cloud-arrow-up"></i>
                                            </div>
                                            <h5>Click to upload or drag & drop</h5>
                                            <p>
                                                Supported formats: PDF, DOC, DOCX,
                                                XLS, XLSX, JPG, PNG
                                            </p>
                                            <button
                                                type="button"
                                                className="upload-zone-btn"
                                            >
                                                <i className="bi bi-folder2-open"></i>
                                                Browse Files
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="material-file-preview">
                                            <div className="file-preview-icon">
                                                <i className="bi bi-file-earmark-check-fill"></i>
                                            </div>

                                            <div className="file-preview-info">
                                                <span className="file-preview-tag">
                                                    Ready to upload
                                                </span>
                                                <strong>{formData.fileupload1.name}</strong>
                                                <small>
                                                    {(
                                                        formData.fileupload1.size / 1024
                                                    ).toFixed(1)}{" "}
                                                    KB
                                                </small>
                                            </div>

                                            <button
                                                type="button"
                                                className="file-preview-remove"
                                                onClick={removeFile}
                                                title="Remove file"
                                            >
                                                <i className="bi bi-trash3"></i>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ============================================
                                FOOTER ACTIONS
                            ============================================ */}
                            <div className="material-form-footer">
                                <div className="footer-note">
                                    <i className="bi bi-info-circle"></i>
                                    <span>
                                        Fields marked with <b>*</b> are required
                                    </span>
                                </div>

                                <div className="material-footer-actions">
                                    <button
                                        type="button"
                                        className="material-cancel-btn"
                                        onClick={closeForm}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="material-save-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check2-circle"></i>
                                                Save Material
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* LIST */}
                {!showForm && (
                    <div className="material-list-card">
                        <div className="material-list-header">
                            <div>
                                <h4>Course Materials</h4>
                                <span>All materials added to this course</span>
                            </div>
                        </div>

                        <div className="material-table-wrapper">
                            <table className="material-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Document Type</th>
                                        <th>Extension</th>
                                        <th>Material Name</th>
                                        <th>Alt Tag</th>
                                        <th>File</th>
                                        <th>View</th>
                                        <th className="action-column">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="material-table-loading">
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Loading Course Materials...
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="material-empty-cell">
                                                <div className="material-empty-state">
                                                    <div className="material-empty-icon">
                                                        <i className="bi bi-journal-x"></i>
                                                    </div>
                                                    <h4>No Course Material Found</h4>
                                                    <p>Start by adding your first course material.</p>
                                                    <button
                                                        type="button"
                                                        className="material-primary-btn"
                                                        onClick={openCreate}
                                                    >
                                                        <i className="bi bi-plus-lg"></i>
                                                        Add Course Material
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((item, index) => {
                                            const file = getFileValue(item);

                                            return (
                                                <tr key={item.id || index}>
                                                    <td>
                                                        <span className="sr-badge">
                                                            {item.srNo ?? startIndex + index + 1}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="document-type-badge">
                                                            {getDocumentTypeName(
                                                                item.documentTypeId,
                                                                item.documentType || item.documentTypeName
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="document-type-badge extension-badge">
                                                            {getDocumentExtensionName(
                                                                item.docExtensionId,
                                                                item.docExtension || item.docExtensionName
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="material-name-cell">
                                                            <strong>{item.name || "-"}</strong>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="table-text">
                                                            {item.altTag || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {file ? (
                                                            <div className="table-file">
                                                                <i className="bi bi-file-earmark-text"></i>
                                                                <span title={formatFileName(file)}>
                                                                    {formatFileName(file)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="no-file">No File</span>
                                                        )}
                                                    </td>
                                                    <td>
    {file ? (
        <button
            type="button"
            className="table-view-btn"
            onClick={() =>
                window.open(
                    `${FILE_URL}${file}`,
                    "_blank",
                    "noopener,noreferrer"
                )
            }
            title="View File"
        >
            <i className="bi bi-file-earmark-text"></i>
            <span>View</span>
        </button>
    ) : (
        <span className="no-file">No File</span>
    )}
</td>

                                                    <td>
                                                        <div className="table-actions">
                                                            <button
                                                                type="button"
                                                                className="table-delete-btn"
                                                                title="Delete"
                                                                onClick={() => openDelete(item.id)}
                                                            >
                                                                <i className="bi bi-trash3"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalRecords > 0 && (
                            <div className="material-pagination">
                                <div className="material-pagination-info">
                                    Showing <strong>{startIndex + 1}</strong> to{" "}
                                    <strong>{endIndex}</strong> of{" "}
                                    <strong>{totalRecords}</strong> materials
                                </div>

                                <div className="material-pagination-controls">
                                    <button
                                        type="button"
                                        className="material-pagination-btn"
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.max(1, prev - 1))
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                        Previous
                                    </button>

                                    <span className="material-pagination-page">
                                        Page <strong>{currentPage}</strong> of{" "}
                                        <strong>{totalPages}</strong>
                                    </span>

                                    <button
                                        type="button"
                                        className="material-pagination-btn"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(totalPages, prev + 1)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div className="material-modal-overlay">
                    <div className="material-delete-modal">
                        <div className="delete-modal-header">
                            <div className="delete-title">
                                <div className="delete-title-icon">
                                    <i className="bi bi-trash3"></i>
                                </div>
                                <div>
                                    <h4>Delete Course Material</h4>
                                    <span>This action requires confirmation</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="delete-modal-close"
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="delete-modal-content">
                            <div className="delete-warning-icon">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                            <h5>Are you sure?</h5>
                            <p>
                                This Course Material will be permanently deleted.
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="delete-modal-footer">
                            <button
                                type="button"
                                className="material-cancel-btn"
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="material-delete-confirm-btn"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3"></i>
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STYLE */}
            <style>{`
                .course-material-page {
                    min-height: 100vh;
                    padding: 24px;
                    background: #f6f8fb;
                }

                .course-material-container {
                    width: 100%;
                    max-width: 1800px;
                    margin: 0 auto;
                }

                /* ============================================
                   PAGE HEADER
                ============================================ */
                .material-page-header {
                    background: #fff;
                    border: 1px solid #e8edf3;
                    border-radius: 16px;
                    padding: 20px 22px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    box-shadow: 0 4px 18px rgba(25,45,75,.05);
                }

                .material-header-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .material-header-icon {
                    width: 52px;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 13px;
                    background: #fff3e9;
                    color: #ff6600;
                    font-size: 25px;
                }

                .material-header-left h2 {
                    margin: 0 0 3px;
                    color: #172033;
                    font-size: 22px;
                    font-weight: 700;
                }

                .material-header-left p {
                    margin: 0;
                    color: #7a8496;
                    font-size: 13px;
                }

                .material-header-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .material-total {
                    min-width: 110px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 13px;
                    border: 1px solid #e8edf3;
                    border-radius: 11px;
                    background: #fafbfc;
                }

                .material-total > span {
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9px;
                    background: #fff3e9;
                    color: #ff6600;
                }

                .material-total strong {
                    display: block;
                    line-height: 17px;
                    font-size: 15px;
                    color: #172033;
                }

                .material-total small {
                    display: block;
                    color: #8791a3;
                    font-size: 11px;
                }

                .material-primary-btn {
                    border: 0;
                    border-radius: 10px;
                    padding: 11px 17px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    background: #ff6600;
                    color: #fff;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all .2s ease;
                }

                .material-primary-btn:hover {
                    background: #e85d00;
                    transform: translateY(-1px);
                }

                .material-primary-btn:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                /* ============================================
                   ✅ NEW FORM DESIGN
                ============================================ */
                .material-form-wrapper {
                    width: 100%;
                }

                /* ---- HERO / BANNER ---- */
                .material-form-hero {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 22px 26px;
                    margin-bottom: 18px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #ff6600 0%, #ff8c38 60%, #ffb066 100%);
                    color: #fff;
                    box-shadow: 0 10px 30px rgba(255,102,0,.25);
                    position: relative;
                    overflow: hidden;
                }

                .material-form-hero::before {
                    content: "";
                    position: absolute;
                    top: -60%;
                    right: -10%;
                    width: 260px;
                    height: 260px;
                    background: rgba(255,255,255,.12);
                    border-radius: 50%;
                }

                .material-form-hero::after {
                    content: "";
                    position: absolute;
                    bottom: -80%;
                    left: -5%;
                    width: 220px;
                    height: 220px;
                    background: rgba(255,255,255,.08);
                    border-radius: 50%;
                }

                .hero-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    position: relative;
                    z-index: 1;
                }

                .hero-icon {
                    width: 56px;
                    height: 56px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 14px;
                    background: rgba(255,255,255,.22);
                    backdrop-filter: blur(4px);
                    color: #fff;
                    font-size: 26px;
                }

                .material-form-hero h3 {
                    margin: 0 0 4px;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: .2px;
                }

                .material-form-hero p {
                    margin: 0;
                    font-size: 12.5px;
                    color: rgba(255,255,255,.9);
                }

                .hero-badge {
                    position: relative;
                    z-index: 1;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 999px;
                    background: rgba(255,255,255,.2);
                    backdrop-filter: blur(6px);
                    border: 1px solid rgba(255,255,255,.3);
                    font-size: 12px;
                    white-space: nowrap;
                }

                .hero-badge strong {
                    color: #fff;
                }

                /* ---- FORM CARD ---- */
                .material-form-card {
                    overflow: hidden;
                    margin-bottom: 16px;
                    background: #fff;
                    border: 1px solid #e4e9f0;
                    border-radius: 14px;
                    box-shadow: 0 4px 18px rgba(25,45,75,.045);
                    transition: box-shadow .25s ease;
                }

                .material-form-card:hover {
                    box-shadow: 0 6px 24px rgba(25,45,75,.07);
                }

                .material-card-header {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    padding: 16px 22px;
                    background: linear-gradient(180deg, #fbfcfe 0%, #f7f9fc 100%);
                    border-bottom: 1px solid #eef1f6;
                }

                .header-icon-wrap {
                    width: 42px;
                    height: 42px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 11px;
                    font-size: 19px;
                }

                .header-icon-wrap.blue {
                    background: #eef4ff;
                    color: #2563eb;
                }

                .header-icon-wrap.green {
                    background: #ecfdf3;
                    color: #16a34a;
                }

                .header-text h4 {
                    margin: 0 0 2px;
                    color: #172033;
                    font-size: 14.5px;
                    font-weight: 700;
                }

                .header-text span {
                    color: #8a94a6;
                    font-size: 11.5px;
                }

                .material-card-body {
                    padding: 22px;
                }

                /* ---- FIELD LABEL ---- */
                .material-field-label {
                    display: block;
                    margin-bottom: 8px;
                    color: #344054;
                    font-size: 12px;
                    font-weight: 650;
                    letter-spacing: .15px;
                }

                .material-field-label span {
                    margin-left: 3px;
                    color: #ef4444;
                }

                /* ---- INPUT WRAP (with icon prefix) ---- */
                .material-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .material-input-wrap .input-prefix {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #98a2b3;
                    font-size: 15px;
                    pointer-events: none;
                    transition: color .2s ease;
                    z-index: 2;
                }

                .material-input-wrap:focus-within .input-prefix {
                    color: #ff6600;
                }

                .material-input {
                    width: 100%;
                    min-height: 46px;
                    padding: 10px 14px;
                    border: 1.5px solid #e1e6ed;
                    border-radius: 10px;
                    background: #fff;
                    color: #273142;
                    font-size: 13px;
                    outline: none;
                    transition: all .2s ease;
                    font-family: inherit;
                }

                .material-input.with-icon {
                    padding-left: 42px;
                }

                .material-input::placeholder {
                    color: #a0a8b5;
                }

                .material-input:hover:not(:disabled) {
                    border-color: #cbd5e1;
                }

                .material-input:focus {
                    border-color: #ff6600;
                    box-shadow: 0 0 0 4px rgba(255,102,0,.1);
                    background: #fffdfb;
                }

                .material-input:disabled {
                    background: #f5f6f8;
                    cursor: not-allowed;
                    color: #98a2b3;
                }

                /* ============================================
                   ✅ NEW UPLOAD ZONE
                ============================================ */
                .material-upload-zone {
                    width: 100%;
                    min-height: 220px;
                    padding: 30px 20px;
                    border: 2px dashed #cfd7e3;
                    border-radius: 14px;
                    background: linear-gradient(180deg, #fbfcfe 0%, #f8fafc 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    cursor: pointer;
                    transition: all .25s ease;
                    position: relative;
                }

                .material-upload-zone:hover {
                    border-color: #ff6600;
                    background: linear-gradient(180deg, #fffaf6 0%, #fff6ee 100%);
                    transform: translateY(-1px);
                }

                .upload-zone-icon {
                    width: 68px;
                    height: 68px;
                    margin-bottom: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #fff3e9;
                    color: #ff6600;
                    font-size: 30px;
                    transition: transform .25s ease;
                    box-shadow: 0 4px 14px rgba(255,102,0,.15);
                }

                .material-upload-zone:hover .upload-zone-icon {
                    transform: scale(1.08) translateY(-3px);
                }

                .material-upload-zone h5 {
                    margin: 0 0 6px;
                    color: #273142;
                    font-size: 15px;
                    font-weight: 700;
                }

                .material-upload-zone p {
                    margin: 0 0 16px;
                    color: #8a94a6;
                    font-size: 12px;
                    line-height: 1.5;
                }

                .upload-zone-btn {
                    padding: 9px 18px;
                    border: 1.5px solid #ff6600;
                    border-radius: 8px;
                    background: #fff;
                    color: #ff6600;
                    font-size: 12.5px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all .2s ease;
                }

                .upload-zone-btn:hover {
                    background: #ff6600;
                    color: #fff;
                }

                /* ---- FILE PREVIEW ---- */
                .material-file-preview {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 18px 20px;
                    border: 1.5px solid #bbf7d0;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf3 100%);
                    position: relative;
                    overflow: hidden;
                }

                .material-file-preview::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #16a34a;
                }

                .file-preview-icon {
                    width: 54px;
                    height: 54px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    background: #16a34a;
                    color: #fff;
                    font-size: 26px;
                    box-shadow: 0 4px 14px rgba(22,163,74,.25);
                }

                .file-preview-info {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .file-preview-tag {
                    font-size: 10.5px;
                    font-weight: 700;
                    color: #15803d;
                    text-transform: uppercase;
                    letter-spacing: .5px;
                }

                .file-preview-info strong {
                    color: #172033;
                    font-size: 13.5px;
                    font-weight: 650;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .file-preview-info small {
                    color: #6b7280;
                    font-size: 11.5px;
                }

                .file-preview-remove {
                    flex-shrink: 0;
                    padding: 8px 14px;
                    border: 1.5px solid #fecaca;
                    border-radius: 8px;
                    background: #fff;
                    color: #dc2626;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all .2s ease;
                }

                .file-preview-remove:hover {
                    background: #dc2626;
                    color: #fff;
                    border-color: #dc2626;
                }

                /* ============================================
                   FORM FOOTER
                ============================================ */
                .material-form-footer {
                    min-height: 74px;
                    padding: 16px 22px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    background: #fff;
                    border: 1px solid #e4e9f0;
                    border-radius: 14px;
                    box-shadow: 0 4px 15px rgba(25,45,75,.04);
                }

                .footer-note {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #667085;
                    font-size: 12px;
                }

                .footer-note i {
                    color: #ff6600;
                    font-size: 15px;
                }

                .footer-note b {
                    color: #ef4444;
                    font-weight: 700;
                }

                .material-footer-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .material-cancel-btn,
                .material-save-btn,
                .material-delete-confirm-btn {
                    min-height: 44px;
                    padding: 10px 20px;
                    border-radius: 9px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all .2s ease;
                    font-family: inherit;
                }

                .material-cancel-btn {
                    border: 1.5px solid #dce2e9;
                    background: #fff;
                    color: #475467;
                }

                .material-cancel-btn:hover:not(:disabled) {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .material-save-btn {
                    border: 0;
                    background: linear-gradient(135deg, #ff6600 0%, #ff8c38 100%);
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(255,102,0,.3);
                }

                .material-save-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(255,102,0,.4);
                }

                .material-save-btn:disabled,
                .material-cancel-btn:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                /* ============================================
                   LIST
                ============================================ */
                .material-list-card {
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid #e4e9f0;
                    border-radius: 15px;
                    box-shadow: 0 4px 18px rgba(25,45,75,.045);
                }

                .material-list-header {
                    min-height: 74px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #e9edf3;
                }

                .material-list-header h4 {
                    margin: 0 0 3px;
                    color: #172033;
                    font-size: 15px;
                    font-weight: 700;
                }

                .material-list-header span {
                    color: #8a94a6;
                    font-size: 11px;
                }

                .material-table-wrapper {
                    width: 100%;
                    overflow-x: auto;
                }

                .material-table {
                    width: 100%;
                    min-width: 950px;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-size: 12px;
                }

                .material-table thead th {
                    padding: 12px 13px;
                    background: #f8fafc;
                    border-bottom: 1px solid #e4e9f0;
                    color: #667085;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .material-table tbody td {
                    padding: 13px;
                    border-bottom: 1px solid #edf0f4;
                    color: #475467;
                    vertical-align: middle;
                }

                .material-table tbody tr:hover {
                    background: #fffaf6;
                }

                .material-table tbody tr:last-child td {
                    border-bottom: 0;
                }

                .sr-badge {
                    width: 27px;
                    height: 27px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 7px;
                    background: #f3f5f8;
                    color: #475467;
                    font-size: 11px;
                    font-weight: 700;
                }

                .document-type-badge {
                    display: inline-flex;
                    padding: 5px 8px;
                    border: 1px solid #ffd9c2;
                    border-radius: 6px;
                    background: #fff8f3;
                    color: #d95700;
                    font-size: 10px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .document-type-badge.extension-badge {
                    border-color: #c7d2fe;
                    background: #eef2ff;
                    color: #4338ca;
                }

                .material-name-cell {
                    max-width: 280px;
                }

                .material-name-cell strong {
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #273142;
                    font-size: 12px;
                }

                .table-text {
                    display: block;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .table-file {
                    max-width: 230px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #2563eb;
                }

                .table-file i {
                    flex-shrink: 0;
                    font-size: 17px;
                }

                .table-file span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 11px;
                }

                .no-file {
                    color: #98a2b3;
                    font-size: 11px;
                }

                .action-column {
                    width: 80px;
                    text-align: center;
                }

                .table-actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .table-delete-btn {
                    width: 32px;
                    height: 32px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #f3c7c7;
                    border-radius: 7px;
                    background: #fff5f5;
                    color: #dc3545;
                    cursor: pointer;
                    transition: all .2s ease;
                }

                .table-delete-btn:hover {
                    background: #ffe8e8;
                    transform: translateY(-1px);
                }

                .material-table-loading {
                    height: 180px;
                    color: #667085;
                    text-align: center;
                }

                .material-table-loading .spinner-border {
                    margin-right: 8px;
                }

                .material-empty-cell {
                    padding: 0 !important;
                }

                .material-empty-state {
                    min-height: 350px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }

                .material-empty-icon {
                    width: 68px;
                    height: 68px;
                    margin-bottom: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 18px;
                    background: #fff3e9;
                    color: #ff6600;
                    font-size: 29px;
                }

                .material-empty-state h4 {
                    margin: 0 0 5px;
                    color: #273142;
                    font-size: 16px;
                }

                .material-empty-state p {
                    margin: 0 0 17px;
                    color: #8a94a6;
                    font-size: 12px;
                }

                .material-pagination {
                    min-height: 68px;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    border-top: 1px solid #e8edf3;
                    background: #fff;
                }

                .material-pagination-info {
                    color: #667085;
                    font-size: 12px;
                }

                .material-pagination-info strong {
                    color: #344054;
                }

                .material-pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .material-pagination-btn {
                    min-height: 36px;
                    padding: 7px 12px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    border: 1px solid #e1e6ed;
                    border-radius: 8px;
                    background: #fff;
                    color: #344054;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .material-pagination-btn:hover:not(:disabled) {
                    border-color: #ff6600;
                    color: #ff6600;
                    background: #fff8f3;
                }

                .material-pagination-btn:disabled {
                    color: #aab2bf;
                    background: #fafbfc;
                    cursor: not-allowed;
                }

                .material-pagination-page {
                    min-width: 82px;
                    text-align: center;
                    color: #667085;
                    font-size: 12px;
                }

                .material-pagination-page strong {
                    color: #344054;
                }

                .material-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(15,23,42,.52);
                    backdrop-filter: blur(3px);
                }

                .material-delete-modal {
                    width: 100%;
                    max-width: 450px;
                    overflow: hidden;
                    background: #fff;
                    border-radius: 15px;
                    box-shadow: 0 25px 70px rgba(15,23,42,.22);
                    animation: materialModalIn .18s ease-out;
                }

                @keyframes materialModalIn {
                    from {
                        opacity: 0;
                        transform: translateY(8px) scale(.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .delete-modal-header {
                    padding: 17px 19px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #edf0f4;
                }

                .delete-title {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .delete-title-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #fff0f0;
                    color: #dc3545;
                }

                .delete-title h4 {
                    margin: 0 0 2px;
                    color: #273142;
                    font-size: 14px;
                    font-weight: 700;
                }

                .delete-title span {
                    color: #98a2b3;
                    font-size: 10px;
                }

                .delete-modal-close {
                    width: 31px;
                    height: 31px;
                    border: 0;
                    border-radius: 7px;
                    background: #f5f6f8;
                    color: #667085;
                    cursor: pointer;
                }

                .delete-modal-content {
                    padding: 29px 25px 23px;
                    text-align: center;
                }

                .delete-warning-icon {
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #fff5e8;
                    color: #ff6600;
                    font-size: 25px;
                }

                .delete-modal-content h5 {
                    margin: 0 0 7px;
                    color: #273142;
                    font-size: 16px;
                    font-weight: 700;
                }

                .delete-modal-content p {
                    max-width: 340px;
                    margin: 0 auto;
                    color: #7a8496;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .delete-modal-footer {
                    padding: 14px 19px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    background: #fafbfc;
                    border-top: 1px solid #edf0f4;
                }

                .material-delete-confirm-btn {
                    border: 0;
                    background: #dc3545;
                    color: #fff;
                }

                .material-delete-confirm-btn:hover:not(:disabled) {
                    background: #bb2d3b;
                }

                .material-delete-confirm-btn:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                .material-table-wrapper::-webkit-scrollbar {
                    height: 7px;
                }

                .material-table-wrapper::-webkit-scrollbar-track {
                    background: #f1f3f6;
                    border-radius: 10px;
                }

                .material-table-wrapper::-webkit-scrollbar-thumb {
                    background: #cbd2dc;
                    border-radius: 10px;
                }

                /* ============================================
                   RESPONSIVE
                ============================================ */
                @media (max-width: 900px) {
                    .course-material-page {
                        padding: 15px;
                    }

                    .material-page-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .material-header-right {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .material-form-hero {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 20px;
                    }

                    .material-card-body {
                        padding: 18px;
                    }
                }

                @media (max-width: 600px) {
                    .course-material-page {
                        padding: 10px;
                    }

                    .material-page-header {
                        padding: 16px;
                        border-radius: 12px;
                    }

                    .material-header-left {
                        align-items: flex-start;
                    }

                    .material-header-icon {
                        width: 43px;
                        height: 43px;
                        font-size: 20px;
                    }

                    .material-header-left h2 {
                        font-size: 18px;
                    }

                    .material-header-right {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .material-total {
                        width: 100%;
                    }

                    .material-primary-btn {
                        width: 100%;
                    }

                    .material-form-hero h3 {
                        font-size: 17px;
                    }

                    .hero-icon {
                        width: 48px;
                        height: 48px;
                        font-size: 22px;
                    }

                    .material-card-body {
                        padding: 15px;
                    }

                    .material-form-footer {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .material-footer-actions {
                        width: 100%;
                    }

                    .material-footer-actions button {
                        flex: 1;
                    }

                    .material-file-preview {
                        flex-direction: column;
                        align-items: flex-start;
                        text-align: left;
                    }

                    .file-preview-remove {
                        align-self: flex-end;
                    }

                    .material-pagination {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .material-pagination-controls {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
                        /* ✅ TABLE VIEW BUTTON */
    .table-view-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 7px;
        border: 1px solid #dce2ea;
        background: #fff;
        color: #f56600;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .table-view-btn > i {
        font-size: 13px;
    }

    .table-view-btn:hover {
        background: #f56600;
        border-color: #f56600;
        color: #fff;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(245, 102, 0, 0.22);
    }

    .table-view-btn:active {
        transform: translateY(0) scale(0.98);
    }

    .no-file {
        color: #9aa3b2;
        font-size: 11px;
        font-style: italic;
    }
            `}</style>
        </div>
    );
}

export default CourseMaterial;