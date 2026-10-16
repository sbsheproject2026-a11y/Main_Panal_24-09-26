 import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    createSubject,
    deleteSubject,
    getSubjects,
    getSubjectsById,
    updateSubject,
} from "../../AllServicesFiles/CourseService";

function SubjectCreate() {
    const { id } = useParams();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteTitle, setDeleteTitle] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [mode, setMode] = useState("create");
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        courseId: "",
        practicalMarks: "",
        assignmentMarks: "",
        theoryMarks: "",
        minMarks: "",
        maxMarks: "",
        subjects: [
            {
                subjectName: "",
                subjectCode: "",
            },
        ],
    });

    const [editForm, setEditForm] = useState({
        id: 0,
        courseId: "",
        title: "",
        code: "",
        theoryMarks: "",
        practicalMarks: "",
        assignmentMarks: "",
        minMarks: "",
        maxMarks: "",
        isActive: 1,
    });

    useEffect(() => {
        if (id) {
            setFormData((prev) => ({
                ...prev,
                courseId: id,
            }));
            loadSubjects(id);
        }
    }, [id]);

    const loadSubjects = async (courseId) => {
        try {
            setLoading(true);
            const result = await getSubjects(courseId);
            console.log("LIST:", result);
            setData(result?.data || []);
        } catch (error) {
            console.error("List Error:", error);
            alert(error?.response?.data?.message || "Unable to load subjects.");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setMode("create");
        setEditId(null);
        setFormData({
            courseId: id || "",
            practicalMarks: "",
            assignmentMarks: "",
            theoryMarks: "",
            minMarks: "",
            maxMarks: "",
            subjects: [
                {
                    subjectName: "",
                    subjectCode: "",
                },
            ],
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setMode("create");
        setEditId(null);
    };

    const handleMarksChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const addSubject = () => {
        if (formData.subjects.length >= 9) {
            alert("Maximum 9 subjects are allowed.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            subjects: [
                ...prev.subjects,
                {
                    subjectName: "",
                    subjectCode: "",
                },
            ],
        }));
    };

    const removeSubject = (index) => {
        if (formData.subjects.length === 1) {
            alert("At least one subject is required.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((_, i) => i !== index),
        }));
    };

    const handleSubjectChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.map((subject, i) =>
                i === index
                    ? {
                          ...subject,
                          [field]: value,
                      }
                    : subject
            ),
        }));
    };

    const handleEdit = async (recordId) => {
        try {
            setLoading(true);
            const result = await getSubjectsById(recordId);
            console.log("EDIT DATA:", result);
            const item = result?.data || result;

            setEditId(item.id);
            setMode("edit");
            setEditForm({
                id: item.id || 0,
                courseId: item.courseId || id || "",
                title: item.title || "",
                code: item.code || "",
                theoryMarks: item.theoryMarks ?? "",
                practicalMarks: item.practicalMarks ?? "",
                assignmentMarks: item.assignmentMarks ?? "",
                minMarks: item.minMarks ?? "",
                maxMarks: item.maxMarks ?? "",
                isActive: item.isActive ?? 1,
            });
            setShowForm(true);
        } catch (error) {
            console.error("Edit Error:", error);
            alert(error?.response?.data?.message || "Unable to load record.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (field, value) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        if (!formData.courseId) {
            alert("Course ID is required.");
            return;
        }
        if (formData.theoryMarks === "") {
            alert("Theory marks are required.");
            return;
        }
        if (formData.practicalMarks === "") {
            alert("Practical marks are required.");
            return;
        }
        if (formData.assignmentMarks === "") {
            alert("Assignment marks are required.");
            return;
        }
        if (formData.minMarks === "") {
            alert("Minimum marks are required.");
            return;
        }
        if (formData.maxMarks === "") {
            alert("Maximum marks are required.");
            return;
        }
        if (Number(formData.maxMarks) < Number(formData.minMarks)) {
            alert("Maximum marks cannot be less than minimum marks.");
            return;
        }
        if (!formData.subjects || formData.subjects.length === 0) {
            alert("At least one subject is required.");
            return;
        }
        if (formData.subjects.length > 9) {
            alert("Maximum 9 subjects are allowed.");
            return;
        }

        const invalid = formData.subjects.some(
            (subject) =>
                !subject.subjectName?.trim() || !subject.subjectCode?.trim()
        );

        if (invalid) {
            alert("Please enter Subject Name and Subject Code for all subjects.");
            return;
        }

        const payload = {
            courseId: Number(formData.courseId),
            practicalMarks: Number(formData.practicalMarks),
            assignmentMarks: Number(formData.assignmentMarks),
            theoryMarks: Number(formData.theoryMarks),
            minMarks: Number(formData.minMarks),
            maxMarks: Number(formData.maxMarks),
            subjects: formData.subjects.map((subject) => ({
                subjectName: subject.subjectName.trim(),
                subjectCode: subject.subjectCode.trim(),
            })),
        };

        console.log("CREATE PAYLOAD:", payload);

        try {
            setLoading(true);
            const result = await createSubject(payload);
            console.log("CREATE RESPONSE:", result);

            if (result.success) {
                alert(result.message || "Subjects created successfully.");
                closeForm();
                await loadSubjects(id);
            } else {
                alert(result.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("CREATE ERROR:", error);
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!editForm.title?.trim()) {
            alert("Title is required.");
            return;
        }
        if (!editForm.code?.trim()) {
            alert("Code is required.");
            return;
        }
        if (editForm.theoryMarks === "") {
            alert("Theory marks are required.");
            return;
        }
        if (editForm.practicalMarks === "") {
            alert("Practical marks are required.");
            return;
        }
        if (editForm.assignmentMarks === "") {
            alert("Assignment marks are required.");
            return;
        }
        if (editForm.minMarks === "") {
            alert("Minimum marks are required.");
            return;
        }
        if (editForm.maxMarks === "") {
            alert("Maximum marks are required.");
            return;
        }
        if (Number(editForm.maxMarks) < Number(editForm.minMarks)) {
            alert("Maximum marks cannot be less than minimum marks.");
            return;
        }

        const payload = {
            id: Number(editForm.id),
            courseId: Number(editForm.courseId),
            title: editForm.title.trim(),
            code: editForm.code.trim(),
            theoryMarks: Number(editForm.theoryMarks),
            practicalMarks: Number(editForm.practicalMarks),
            assignmentMarks: Number(editForm.assignmentMarks),
            minMarks: Number(editForm.minMarks),
            maxMarks: Number(editForm.maxMarks),
            isActive: Number(editForm.isActive || 1),
        };

        console.log("UPDATE PAYLOAD:", payload);

        try {
            setLoading(true);
            const result = await updateSubject(editForm.id, payload);
            console.log("UPDATE RESPONSE:", result);

            if (result.success) {
                alert(result.message || "Updated successfully.");
                closeForm();
                await loadSubjects(id);
            } else {
                alert(result.message || "Update failed.");
            }
        } catch (error) {
            console.error("UPDATE ERROR:", error);
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (item) => {
        setDeleteId(item.id);
        setDeleteTitle(item.title || item.code || "");
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!deleteId) {
            return;
        }

        setIsDeleting(true);

        try {
            const result = await deleteSubject(deleteId);
            console.log("DELETE RESPONSE:", result);

            if (result.success) {
                alert(result.message || "Subject deleted successfully.");
                setShowDeleteModal(false);
                setDeleteId(null);
                setDeleteTitle("");
                loadSubjects(formData.courseId);
            } else {
                alert(result.message || "Subject delete failed.");
            }
        } catch (error) {
            console.error("DELETE ERROR:", error);
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="subject-create-page">
            <style>{`
                /* ================= PAGE — NO SCROLL ================= */
                html, body, #root {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden !important;
                    box-sizing: border-box;
                }

                .subject-create-page {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    overflow-x: hidden;
                    box-sizing: border-box;
                }

                .subject-create-page .row,
                .subject-create-page .col-lg-12,
                .subject-create-page .card,
                .subject-create-page .card-body,
                .subject-create-page .card-header,
                .subject-create-page .card-footer {
                    min-width: 0;
                    max-width: 100%;
                    box-sizing: border-box;
                }

                /* =========================================================
                   ✅ VISIBLE SCROLLBAR — Employee style
                ========================================================= */
                .modern-table-responsive {
                    display: block !important;
                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    box-sizing: border-box !important;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                    scrollbar-color: #c9ced8 #eef1f5;
                    border-radius: 8px;
                }

                .modern-table-responsive::-webkit-scrollbar {
                    height: 9px;
                }

                .modern-table-responsive::-webkit-scrollbar-track {
                    background: #eef1f5;
                    border-radius: 10px;
                }

                .modern-table-responsive::-webkit-scrollbar-thumb {
                    background: #c9ced8;
                    border-radius: 10px;
                }

                .modern-table-responsive::-webkit-scrollbar-thumb:hover {
                    background: #aeb5c2;
                }

                /* Tables — auto width */
                .subject-create-page .table {
                    width: auto !important;
                    min-width: 100% !important;
                    max-width: none !important;
                    table-layout: auto !important;
                    margin: 0 !important;
                }

                .subject-create-page .table thead th {
                    white-space: nowrap !important;
                    vertical-align: middle;
                }

                .subject-create-page .table tbody td {
                    white-space: nowrap !important;
                    vertical-align: middle;
                }

                /* Subjects input table — allow wider inputs */
                .subject-create-page .subjects-table input {
                    min-width: 180px;
                }
            `}</style>

            <div className="container-fluid py-4">

                {/* =================================================
                    CREATE / EDIT FORM
                ================================================= */}

                {showForm && (
                    <div className="row">
                        <div className="col-lg-12">

                            {/* HEADER */}
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h4 className="fw-bold mb-1">
                                                {mode === "create"
                                                    ? "Create Subjects"
                                                    : "Edit Subject"}
                                            </h4>
                                            <p className="text-muted mb-0">
                                                {mode === "create"
                                                    ? "Configure marks and add subjects"
                                                    : "Update subject details"}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-light border"
                                            onClick={closeForm}
                                        >
                                            <i className="bi bi-arrow-left me-1"></i>
                                            Back to List
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                                CREATE FORM
                            ================================================= */}

                            {mode === "create" && (
                                <form onSubmit={handleCreateSubmit}>

                                    {/* MARKS */}
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-header bg-white py-3">
                                            <h5 className="mb-0 fw-semibold">
                                                Marks Configuration
                                            </h5>
                                        </div>

                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-md-12">
                                                    <label className="form-label fw-semibold">
                                                        Course ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.courseId}
                                                        readOnly
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Theory Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={formData.theoryMarks}
                                                        onChange={(e) =>
                                                            handleMarksChange(
                                                                "theoryMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Practical Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={formData.practicalMarks}
                                                        onChange={(e) =>
                                                            handleMarksChange(
                                                                "practicalMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Assignment Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={formData.assignmentMarks}
                                                        onChange={(e) =>
                                                            handleMarksChange(
                                                                "assignmentMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Min Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={formData.minMarks}
                                                        onChange={(e) =>
                                                            handleMarksChange(
                                                                "minMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Max Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={formData.maxMarks}
                                                        onChange={(e) =>
                                                            handleMarksChange(
                                                                "maxMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SUBJECTS */}
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 className="mb-1 fw-semibold">
                                                        Subjects
                                                    </h5>
                                                    <small className="text-muted">
                                                        Maximum 9 subjects
                                                    </small>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={addSubject}
                                                    disabled={
                                                        formData.subjects.length >= 9
                                                    }
                                                >
                                                    <i className="bi bi-plus-lg me-1"></i>
                                                    Add More
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-body p-0">
                                            {/* ✅ VISIBLE SCROLLBAR */}
                                            <div className="modern-table-responsive">
                                                <table className="table table-bordered align-middle mb-0 subjects-table">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Subject Name</th>
                                                            <th>Subject Code</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {formData.subjects.map(
                                                            (subject, index) => (
                                                                <tr key={index}>
                                                                    <td className="text-center">
                                                                        {index + 1}
                                                                    </td>

                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={subject.subjectName}
                                                                            onChange={(e) =>
                                                                                handleSubjectChange(
                                                                                    index,
                                                                                    "subjectName",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="Subject Name"
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={subject.subjectCode}
                                                                            onChange={(e) =>
                                                                                handleSubjectChange(
                                                                                    index,
                                                                                    "subjectCode",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="Subject Code"
                                                                        />
                                                                    </td>

                                                                    <td className="text-center">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-danger btn-sm"
                                                                            disabled={
                                                                                formData.subjects
                                                                                    .length === 1
                                                                            }
                                                                            onClick={() =>
                                                                                removeSubject(index)
                                                                            }
                                                                        >
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="card-footer bg-white">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">
                                                    Total Subjects:{" "}
                                                    <strong>
                                                        {formData.subjects.length}
                                                    </strong>
                                                    /9
                                                </span>

                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-light border me-2"
                                                        onClick={closeForm}
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        className="btn btn-success"
                                                        disabled={loading}
                                                    >
                                                        {loading
                                                            ? "Saving..."
                                                            : "Save Subjects"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* =================================================
                                EDIT FORM
                            ================================================= */}

                            {mode === "edit" && (
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white py-3">
                                            <h5 className="mb-0 fw-semibold">
                                                Edit Subject
                                            </h5>
                                        </div>

                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-md-12">
                                                    <label className="form-label fw-semibold">
                                                        Course ID
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editForm.courseId}
                                                        readOnly
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">
                                                        Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter title"
                                                        value={editForm.title}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                "title",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">
                                                        Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter code"
                                                        value={editForm.code}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                "code",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Theory Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editForm.theoryMarks}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                "theoryMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Practical Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editForm.practicalMarks}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                "practicalMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Assignment Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editForm.assignmentMarks}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                "assignmentMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Min Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editForm.minMarks}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                "minMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">
                                                        Max Marks
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editForm.maxMarks}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                "maxMarks",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-footer bg-white py-3">
                                            <div className="text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-light border me-2"
                                                    onClick={closeForm}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    disabled={loading}
                                                >
                                                    {loading ? "Updating..." : "Update"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* =================================================
                    LIST
                ================================================= */}

                {!showForm && (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h5 className="card-title mb-1">
                                                Subject List
                                            </h5>
                                            <small className="text-muted">
                                                Manage subjects
                                            </small>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={openCreate}
                                        >
                                            <i className="bi bi-plus-lg me-1"></i>
                                            Create Subjects
                                        </button>
                                    </div>

                                    {/* ✅ VISIBLE SCROLLBAR */}
                                    <div className="modern-table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Code</th>
                                                    <th>Title</th>
                                                    <th>Theory</th>
                                                    <th>Practical</th>
                                                    <th>Assignment</th>
                                                    <th>Min</th>
                                                    <th>Max</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="9" className="text-center">
                                                            Loading...
                                                        </td>
                                                    </tr>
                                                ) : data.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="9"
                                                            className="text-center text-muted"
                                                        >
                                                            No records found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    data.map((item, index) => (
                                                        <tr key={item.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.code}</td>
                                                            <td>{item.title}</td>
                                                            <td>{item.theoryMarks}</td>
                                                            <td>{item.practicalMarks}</td>
                                                            <td>{item.assignmentMarks}</td>
                                                            <td>{item.minMarks}</td>
                                                            <td>{item.maxMarks}</td>

                                                            <td className="text-center">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={() =>
                                                                        handleEdit(item.id)
                                                                    }
                                                                >
                                                                    <i className="bi bi-pencil-square me-1"></i>
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm ms-2"
                                                                    onClick={() =>
                                                                        openDeleteModal(item)
                                                                    }
                                                                >
                                                                    <i className="bi bi-trash me-1"></i>
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* =================================================
                    DELETE MODAL
                ================================================= */}

                {showDeleteModal && (
                    <>
                        <div
                            className="modal-backdrop fade show"
                            style={{
                                backgroundColor: "rgba(15, 23, 42, 0.65)",
                                backdropFilter: "blur(3px)",
                            }}
                        ></div>

                        <div
                            className="modal fade show d-block"
                            tabIndex="-1"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div
                                    className="modal-content border-0 shadow-lg"
                                    style={{
                                        borderRadius: "18px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "5px",
                                            background:
                                                "linear-gradient(90deg, #dc3545, #ff6b6b)",
                                        }}
                                    ></div>

                                    <div className="modal-header border-0 px-4 pt-4 pb-2">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#fff1f2",
                                                }}
                                            >
                                                <i
                                                    className="bi bi-trash3-fill text-danger"
                                                    style={{ fontSize: "21px" }}
                                                ></i>
                                            </div>

                                            <div>
                                                <h5 className="modal-title fw-bold mb-1">
                                                    Delete Subject
                                                </h5>
                                                <small className="text-muted">
                                                    Confirmation required
                                                </small>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setDeleteId(null);
                                                setDeleteTitle("");
                                            }}
                                            disabled={isDeleting}
                                        ></button>
                                    </div>

                                    <div className="modal-body px-4 py-4">
                                        <div
                                            className="p-3"
                                            style={{
                                                backgroundColor: "#f8fafc",
                                                borderRadius: "12px",
                                                border: "1px solid #e9ecef",
                                            }}
                                        >
                                            <div className="d-flex align-items-start">
                                                <i
                                                    className="bi bi-exclamation-circle-fill text-warning me-3 mt-1"
                                                    style={{ fontSize: "20px" }}
                                                ></i>

                                                <div>
                                                    <h6 className="fw-semibold mb-2">
                                                        Are you sure you want to delete
                                                        this subject?
                                                    </h6>
                                                    <p className="text-muted mb-0">
                                                        You are about to delete:
                                                    </p>

                                                    <div
                                                        className="mt-2 px-3 py-2"
                                                        style={{
                                                            backgroundColor: "#ffffff",
                                                            borderRadius: "8px",
                                                            border: "1px solid #e5e7eb",
                                                        }}
                                                    >
                                                        <strong className="text-dark">
                                                            {deleteTitle}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center mt-3">
                                            <small className="text-danger">
                                                <i className="bi bi-info-circle me-1"></i>
                                                This action cannot be undone.
                                            </small>
                                        </div>
                                    </div>

                                    <div className="modal-footer border-0 px-4 pb-4 pt-0">
                                        <button
                                            type="button"
                                            className="btn btn-light border px-4"
                                            style={{ borderRadius: "8px" }}
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setDeleteId(null);
                                                setDeleteTitle("");
                                            }}
                                            disabled={isDeleting}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger px-4"
                                            style={{
                                                borderRadius: "8px",
                                                minWidth: "125px",
                                            }}
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-trash3 me-2"></i>
                                                    Yes, Delete
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SubjectCreate;