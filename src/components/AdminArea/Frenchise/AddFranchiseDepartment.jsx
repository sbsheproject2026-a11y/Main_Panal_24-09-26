 import React, { useEffect, useState } from "react";

import {
    FaUniversity,
    FaBookOpen,
    FaPaperPlane,
    FaCheckCircle,
    FaTimes,
    FaTrash,
    FaExclamationTriangle,
    FaMapMarkerAlt,
    FaMapPin,
    FaPlus,
} from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";

import {
    createStudyCentreDepartment,
    GetStudyCentreDepartmentData,
    GetStudyCentreDepartmentDelete,
} from "../../AllServicesFiles/FrenchiseService";
import {
    getStudentData,
    getStudyCentreCourse,
} from "../../AllServicesFiles/StudentService";

const AddFranchiseDepartment = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    // ✅ Departments
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

    // ✅ Courses
    const [courses, setCourses] = useState([]);
    const [courseLoading, setCourseLoading] = useState(false);
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);

    // ✅ Existing List
    const [existingList, setExistingList] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    // ✅ Add Form Toggle — false = list, true = form
    const [showAddForm, setShowAddForm] = useState(false);

    // ✅ Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        departments: [],
        departmentIds: [],
        isActive: 1,
    });

    /* ================================
       INITIAL LOAD
    ================================= */

    useEffect(() => {
        loadDepartments();
        if (id) {
            loadExistingList();
        }
    }, [id]);

    const loadDepartments = async () => {
        try {
            const result = await getStudentData(13);
            setDepartments(result?.data || []);
        } catch (error) {
            console.error("Department Load Error:", error);
            setDepartments([]);
        }
    };

    /* ============================================================
       ✅ LOAD EXISTING ASSIGNED LIST
    ============================================================ */

    const loadExistingList = async () => {
        try {
            setListLoading(true);

            const result = await GetStudyCentreDepartmentData(id);

            const data = result?.data || result || [];

            const normalized = Array.isArray(data)
                ? data.map((item) => ({
                      id: item.Id ?? item.id ?? 0,
                      name: item.Name ?? item.name ?? "—",
                      address: item.Address ?? item.address ?? "—",
                      pincode: item.Pincode ?? item.PinCode ?? item.pincode ?? "—",
                  }))
                : [];

            setExistingList(normalized);
        } catch (error) {
            console.error("Existing List Error:", error);
            setExistingList([]);
        } finally {
            setListLoading(false);
        }
    };

    /* ============================================================
       ✅ ADD FORM — OPEN / CLOSE
    ============================================================ */

    const handleOpenAddForm = () => {
        setShowAddForm(true);
        setTimeout(() => {
            document
                .querySelector(".scr-add-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleCloseAddForm = () => {
        setSelectedDepartments([]);
        setFormData({
            departments: [],
            departmentIds: [],
            isActive: 1,
        });
        setCourses([]);
        setErrors({});
        setShowDepartmentDropdown(false);
        setShowCourseDropdown(false);
        setShowAddForm(false);
    };

    /* ============================================================
       ✅ DELETE FLOW
    ============================================================ */

    const handleDeleteClick = (item) => {
        setDeleteItem(item);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setDeleteItem(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
        if (!deleteItem) return;

        try {
            setDeleteLoading(true);

            const recordId = deleteItem.id;
            const result = await GetStudyCentreDepartmentDelete(recordId);

            if (result) {
                setExistingList((prev) =>
                    prev.filter((x) => Number(x.id) !== Number(recordId))
                );
                setShowDeleteModal(false);
                setDeleteItem(null);
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    /* ============================================================
       LOAD COURSES FOR SELECTED DEPARTMENTS
    ============================================================ */

    const loadCoursesForDepartments = async (deptIds) => {
        try {
            setCourseLoading(true);

            if (!deptIds || deptIds.length === 0) {
                setCourses([]);
                return;
            }

            const responses = await Promise.all(
                deptIds.map(async (deptId) => {
                    const res = await getStudyCentreCourse(deptId);
                    const list = res?.data || [];
                    return list.map((course) => ({
                        ...course,
                        _deptId: Number(deptId),
                    }));
                })
            );

            const merged = responses.flat();

            const uniqueMap = new Map();
            merged.forEach((c) => {
                const key = `${c._deptId}-${c.id}`;
                if (!uniqueMap.has(key)) uniqueMap.set(key, c);
            });

            setCourses(Array.from(uniqueMap.values()));
        } catch (error) {
            console.error("Course Fetch Error:", error);
            setCourses([]);
        } finally {
            setCourseLoading(false);
        }
    };

    /* ================================
       ERROR HELPERS
    ================================= */

    const clearError = (fieldName) => {
        setErrors((prev) => {
            if (!prev[fieldName]) return prev;
            const updatedErrors = { ...prev };
            delete updatedErrors[fieldName];
            return updatedErrors;
        });
    };

    /* ================================
       DEPARTMENT MULTI-SELECT
    ================================= */

    const getDeptId = (dept) => Number(dept?.id);
    const getDeptName = (dept) => dept?.name || "";

    const handleDepartmentSelect = async (dept) => {
        const deptId = getDeptId(dept);
        if (selectedDepartments.includes(deptId)) return;

        const updated = [...selectedDepartments, deptId];

        setSelectedDepartments(updated);
        setFormData((prev) => ({ ...prev, departments: updated }));

        clearError("departments");
        clearError("departmentIds");

        await loadCoursesForDepartments(updated);
    };

    const handleDepartmentRemove = async (deptId) => {
        const numericId = Number(deptId);
        const updated = selectedDepartments.filter((id) => id !== numericId);

        setSelectedDepartments(updated);
        setFormData((prev) => ({
            ...prev,
            departments: updated,
            departmentIds: prev.departmentIds.filter(
                (item) => Number(item.departmentId) !== numericId
            ),
        }));

        await loadCoursesForDepartments(updated);
    };

    /* ================================
       COURSE MULTI-SELECT
    ================================= */

    const getCourseId = (course) => Number(course?.id);
    const getCourseName = (course) => course?.name || "";
    const getCourseDeptId = (course) => Number(course?._deptId);

    const isCourseSelected = (course) =>
        formData.departmentIds.some(
            (item) =>
                Number(item.departmentId) === getCourseDeptId(course) &&
                Number(item.courseId) === getCourseId(course)
        );

    const handleCourseSelect = (course) => {
        const courseId = getCourseId(course);
        const departmentId = getCourseDeptId(course);

        if (!courseId || !departmentId) return;

        setFormData((prev) => {
            const exists = prev.departmentIds.some(
                (item) =>
                    Number(item.departmentId) === departmentId &&
                    Number(item.courseId) === courseId
            );
            if (exists) return prev;

            return {
                ...prev,
                departmentIds: [
                    ...prev.departmentIds,
                    { departmentId, courseId },
                ],
            };
        });

        clearError("departmentIds");
    };

    const handleCourseRemove = (courseId, deptId) => {
        setFormData((prev) => ({
            ...prev,
            departmentIds: prev.departmentIds.filter(
                (item) =>
                    !(
                        Number(item.courseId) === Number(courseId) &&
                        Number(item.departmentId) === Number(deptId)
                    )
            ),
        }));
    };

    const selectedDepartmentObjects = departments.filter((dept) =>
        selectedDepartments.includes(getDeptId(dept))
    );

    const availableDepartments = departments.filter(
        (dept) => !selectedDepartments.includes(getDeptId(dept))
    );

    const selectedCourses = courses.filter((course) => isCourseSelected(course));
    const availableCourses = courses.filter((course) => !isCourseSelected(course));

    /* ================================
       VALIDATION
    ================================= */

    const validateForm = () => {
        const newErrors = {};

        if (!selectedDepartments || selectedDepartments.length === 0) {
            newErrors.departments = "Please select at least one department";
        }

        if (!formData.departmentIds || formData.departmentIds.length === 0) {
            newErrors.departmentIds = "Please select at least one course";
        }

        return newErrors;
    };

    /* ================================
       SUBMIT
    ================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => {
                const firstErrorField = document.querySelector(".scr-error");
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            }, 100);
            return;
        }

        try {
            setSubmitting(true);

            const submitData = {
                referenceId: id ? String(id) : "",
                departmentIds: formData.departmentIds.map((d) => ({
                    departmentId: d.departmentId,
                    courseId: d.courseId,
                })),
            };

            console.log("Submit Data:", submitData);

            const result = await createStudyCentreDepartment(submitData);

            console.log("Response:", result);

            if (result?.message === "Successfully" || result?.success) {
                // ✅ Reset + CLOSE FORM (wapas list pe jao)
                setSelectedDepartments([]);
                setFormData({
                    departments: [],
                    departmentIds: [],
                    isActive: 1,
                });
                setCourses([]);
                setShowAddForm(false);

                // ✅ Refresh list
                if (id) await loadExistingList();

                return;
            }

            alert(result?.message || "Registration failed");
        } catch (error) {
            console.error("Franchise Department Error:", error);
            alert(
                error?.response?.data?.message ||
                    "Unable to save. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* ================================
       RENDER
    ================================= */

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
                                <h2>Assign Departments & Courses</h2>
                                <p>
                                    {id
                                        ? `Franchise ID: ${id}`
                                        : "Select the departments and courses you want to assign"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="scr-form">

                        {/* =====================================================
                            ✅ SWAP: Agar showAddForm === false → List dikhao
                                     Agar showAddForm === true → Form dikhao
                        ===================================================== */}

                        {!showAddForm ? (
                            /* ============ LIST VIEW ============ */
                            <div className="scr-section">
                                <div className="scr-section-head">
                                    <div className="scr-section-icon">
                                        <FaCheckCircle />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3>Assigned Departments & Courses</h3>
                                        <p>
                                            Already assigned to this franchise — click trash icon to remove
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="scr-add-btn"
                                        onClick={handleOpenAddForm}
                                    >
                                        <FaPlus />
                                        Add
                                    </button>
                                </div>

                                {listLoading ? (
                                    <div className="list-loader">
                                        <span className="spinner-border spinner-border-sm"></span>
                                        <span>Loading existing assignments...</span>
                                    </div>
                                ) : existingList.length === 0 ? (
                                    <div className="list-empty">
                                        <FaCheckCircle />
                                        <strong>No departments assigned yet</strong>
                                        <small>
                                            Click <b>"Add"</b> button above to assign departments and courses.
                                        </small>
                                    </div>
                                ) : (
                                    <div className="existing-list">
                                        {existingList.map((item, index) => (
                                            <div key={item.id || index} className="existing-row">
                                                <div className="existing-index">
                                                    {index + 1}
                                                </div>

                                                <div className="existing-icon dept">
                                                    <FaUniversity />
                                                </div>

                                                <div className="existing-info">
                                                    <div className="existing-dept">
                                                        {item.name || "—"}
                                                    </div>

                                                    <div className="existing-course">
                                                        <FaMapMarkerAlt />
                                                        <span>{item.address || "—"}</span>
                                                    </div>

                                                    <div className="existing-course">
                                                        <FaMapPin />
                                                        <span>{item.pincode || "—"}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="existing-delete-btn"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(item)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ============ ADD FORM VIEW ============ */
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="scr-add-section"
                            >
                                <div className="scr-section">
                                    <div className="scr-section-head">
                                        <div className="scr-section-icon">
                                            <FaPlus />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3>Add New Departments & Courses</h3>
                                            <p>
                                                Select one or more departments — courses will load automatically
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="scr-close-btn"
                                            onClick={handleCloseAddForm}
                                            title="Back to List"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>

                                    <div className="row">
                                        {/* DEPARTMENT */}
                                        <div className="col-md-6">
                                            <div className="scr-group">
                                                <label>Departments <span>*</span></label>

                                                {selectedDepartmentObjects.length > 0 && (
                                                    <div className="selected-courses-box">
                                                        <div className="selected-courses-title">
                                                            <div className="selected-title-left">
                                                                <FaCheckCircle />
                                                                <span>Selected Departments</span>
                                                            </div>
                                                            <span className="selected-count">
                                                                {selectedDepartmentObjects.length}
                                                            </span>
                                                        </div>
                                                        <div className="selected-courses-list">
                                                            {selectedDepartmentObjects.map((dept) => {
                                                                const deptId = getDeptId(dept);
                                                                const deptName = getDeptName(dept);
                                                                return (
                                                                    <div key={deptId} className="selected-course-item">
                                                                        <div className="selected-course-name">
                                                                            <span className="selected-course-check"><FaCheckCircle /></span>
                                                                            <span>{deptName}</span>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className="remove-course-btn"
                                                                            onClick={() => handleDepartmentRemove(deptId)}
                                                                        >
                                                                            <FaTimes />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="course-dropdown-wrapper">
                                                    <button
                                                        type="button"
                                                        className={errors.departments ? "course-dropdown-btn course-dropdown-error" : "course-dropdown-btn"}
                                                        onClick={() => setShowDepartmentDropdown((prev) => !prev)}
                                                    >
                                                        <span className="course-dropdown-left">
                                                            <span className="course-main-icon"><FaUniversity /></span>
                                                            <span>
                                                                {departments.length === 0
                                                                    ? "Loading Departments..."
                                                                    : availableDepartments.length > 0
                                                                        ? "Select Departments"
                                                                        : "All Departments Selected"}
                                                            </span>
                                                        </span>
                                                        <span className="course-dropdown-arrow">
                                                            {showDepartmentDropdown ? "▲" : "▼"}
                                                        </span>
                                                    </button>

                                                    {showDepartmentDropdown && availableDepartments.length > 0 && (
                                                        <div className="course-dropdown-menu">
                                                            <div className="course-dropdown-header">
                                                                <div>
                                                                    <strong>Available Departments</strong>
                                                                    <small>Click to add departments</small>
                                                                </div>
                                                                <span>{availableDepartments.length}</span>
                                                            </div>
                                                            <div className="course-options-list">
                                                                {availableDepartments.map((dept) => (
                                                                    <div
                                                                        key={getDeptId(dept)}
                                                                        className="picker-item"
                                                                        onClick={() => handleDepartmentSelect(dept)}
                                                                    >
                                                                        <div className="picker-item-left">
                                                                            <div className="picker-item-icon"><FaUniversity /></div>
                                                                            <div className="picker-item-text">
                                                                                <span className="picker-item-name">{getDeptName(dept)}</span>
                                                                                <span className="picker-item-hint">Department</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="picker-item-add">
                                                                            <span className="picker-item-plus">+</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {showDepartmentDropdown && availableDepartments.length === 0 && departments.length > 0 && (
                                                        <div className="course-dropdown-menu course-empty-menu">
                                                            <FaCheckCircle />
                                                            <strong>All departments have been selected</strong>
                                                            <small>Remove a selected department to add it again.</small>
                                                        </div>
                                                    )}
                                                </div>

                                                {errors.departments && <small className="scr-error">{errors.departments}</small>}
                                            </div>
                                        </div>

                                        {/* COURSES */}
                                        <div className="col-md-6">
                                            <div className="scr-group">
                                                <label>Courses Offered <span>*</span></label>

                                                {selectedDepartments.length === 0 ? (
                                                    <div className="scr-info-box scr-info-blue">
                                                        <FaUniversity />
                                                        <span>Please select department(s) first to load courses.</span>
                                                    </div>
                                                ) : courseLoading ? (
                                                    <div className="scr-info-box scr-info-grey">
                                                        <span className="spinner-border spinner-border-sm text-secondary"></span>
                                                        <span>Loading courses...</span>
                                                    </div>
                                                ) : courses.length === 0 ? (
                                                    <div className="scr-info-box scr-info-orange">
                                                        No courses found for selected department(s).
                                                    </div>
                                                ) : (
                                                    <>
                                                        {selectedCourses.length > 0 && (
                                                            <div className="selected-courses-box">
                                                                <div className="selected-courses-title">
                                                                    <div className="selected-title-left">
                                                                        <FaCheckCircle />
                                                                        <span>Selected Courses</span>
                                                                    </div>
                                                                    <span className="selected-count">{selectedCourses.length}</span>
                                                                </div>
                                                                <div className="selected-courses-list">
                                                                    {selectedCourses.map((course) => {
                                                                        const courseId = getCourseId(course);
                                                                        const courseName = getCourseName(course);
                                                                        const deptId = getCourseDeptId(course);
                                                                        return (
                                                                            <div key={`${deptId}-${courseId}`} className="selected-course-item">
                                                                                <div className="selected-course-name">
                                                                                    <span className="selected-course-check"><FaCheckCircle /></span>
                                                                                    <span>{courseName}</span>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="remove-course-btn"
                                                                                    onClick={() => handleCourseRemove(courseId, deptId)}
                                                                                >
                                                                                    <FaTimes />
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="course-dropdown-wrapper">
                                                            <button
                                                                type="button"
                                                                className={errors.departmentIds ? "course-dropdown-btn course-dropdown-error" : "course-dropdown-btn"}
                                                                onClick={() => setShowCourseDropdown((prev) => !prev)}
                                                            >
                                                                <span className="course-dropdown-left">
                                                                    <span className="course-main-icon"><FaBookOpen /></span>
                                                                    <span>
                                                                        {availableCourses.length > 0 ? "Select Courses" : "All Courses Selected"}
                                                                    </span>
                                                                </span>
                                                                <span className="course-dropdown-arrow">
                                                                    {showCourseDropdown ? "▲" : "▼"}
                                                                </span>
                                                            </button>

                                                            {showCourseDropdown && availableCourses.length > 0 && (
                                                                <div className="course-dropdown-menu">
                                                                    <div className="course-dropdown-header">
                                                                        <div>
                                                                            <strong>Available Courses</strong>
                                                                            <small>Click to add courses</small>
                                                                        </div>
                                                                        <span>{availableCourses.length}</span>
                                                                    </div>
                                                                    <div className="course-options-list">
                                                                        {availableCourses.map((course) => {
                                                                            const courseId = getCourseId(course);
                                                                            const deptId = getCourseDeptId(course);
                                                                            return (
                                                                                <div
                                                                                    key={`${deptId}-${courseId}`}
                                                                                    className="picker-item"
                                                                                    onClick={() => handleCourseSelect(course)}
                                                                                >
                                                                                    <div className="picker-item-left">
                                                                                        <div className="picker-item-icon"><FaBookOpen /></div>
                                                                                        <div className="picker-item-text">
                                                                                            <span className="picker-item-name">{getCourseName(course)}</span>
                                                                                            <span className="picker-item-hint">Course</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="picker-item-add">
                                                                                        <span className="picker-item-plus">+</span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {showCourseDropdown && availableCourses.length === 0 && (
                                                                <div className="course-dropdown-menu course-empty-menu">
                                                                    <FaCheckCircle />
                                                                    <strong>All courses have been selected</strong>
                                                                    <small>Remove a selected course to add it again.</small>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                {errors.departmentIds && <small className="scr-error">{errors.departmentIds}</small>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="scr-footer">
                                    <div className="scr-security">
                                        <div className="scr-security-icon"><FaCheckCircle /></div>
                                        <div>
                                            <strong>Your information is secure</strong>
                                            <span>We protect your information and respect your privacy.</span>
                                        </div>
                                    </div>

                                    <div className="scr-footer-actions">
                                        <button
                                            type="button"
                                            className="scr-cancel-btn"
                                            onClick={handleCloseAddForm}
                                            disabled={submitting}
                                        >
                                            <FaTimes />
                                            Cancel
                                        </button>

                                        <button type="submit" className="scr-submit" disabled={submitting}>
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPaperPlane />
                                                    Submit
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
            {showDeleteModal && deleteItem && (
                <div className="del-overlay" onClick={handleCancelDelete}>
                    <div className="del-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="del-icon">
                            <FaExclamationTriangle />
                        </div>

                        <h4 className="del-title">Confirm Delete</h4>

                        <p className="del-text">
                            Are you sure you want to delete this assignment?
                            This action cannot be undone.
                        </p>

                        <div className="del-info">
                            <div className="del-info-row">
                                <span>Name:</span>
                                <strong>{deleteItem.name || "—"}</strong>
                            </div>
                            <div className="del-info-row">
                                <span>Address:</span>
                                <strong>{deleteItem.address || "—"}</strong>
                            </div>
                            <div className="del-info-row">
                                <span>Pincode:</span>
                                <strong>{deleteItem.pincode || "—"}</strong>
                            </div>
                        </div>

                        <div className="del-actions">
                            <button
                                type="button"
                                className="del-cancel"
                                onClick={handleCancelDelete}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="del-confirm"
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash />
                                        Yes, Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
    /* ==========================================
       FRANCHISE DEPARTMENT ASSIGN
    ========================================== */

    .scr-page {
        min-height: 100vh;
        padding: 30px 15px;
        background: #f4f7fb;
        overflow: visible;
    }

    .scr-container {
        max-width: 1180px;
        margin: auto;
        overflow: visible;
    }

    .scr-card {
        background: #fff;
        border: 1px solid #e7ebf1;
        border-radius: 14px;
        overflow: visible;
        box-shadow: 0 8px 30px rgba(20, 40, 70, .07);
    }

    .scr-header {
        padding: 22px 28px;
        background: linear-gradient(135deg, #07567f, #f45100);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        color: #fff;
        border-radius: 14px 14px 0 0;
    }

    .scr-header-left { display: flex; align-items: center; gap: 15px; }

    .scr-icon {
        width: 54px; height: 54px; flex: 0 0 54px;
        border-radius: 12px;
        background: rgba(255, 255, 255, .16);
        border: 1px solid rgba(255, 255, 255, .22);
        display: flex; align-items: center; justify-content: center;
        font-size: 23px;
    }

    .scr-header h2 { margin: 0 0 4px; color: #fff; font-size: 23px; font-weight: 700; }
    .scr-header p { margin: 0; color: rgba(255, 255, 255, .9); font-size: 13px; }

    .scr-form { padding: 26px 28px; }

    .scr-section {
        margin-bottom: 24px; padding: 20px;
        border: 1px solid #e9edf3; border-radius: 11px; background: #fff;
        overflow: visible;
    }

    .scr-section:last-child { margin-bottom: 0; }

    .scr-section-head {
        display: flex; align-items: center; gap: 11px;
        padding-bottom: 15px; margin-bottom: 18px;
        border-bottom: 1px solid #edf0f4;
    }

    .scr-section-icon {
        width: 35px; height: 35px; flex: 0 0 35px;
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        background: #fff2e8; color: #f56600; font-size: 14px;
    }

    .scr-section-head h3 { margin: 0 0 2px; color: #202938; font-size: 15px; font-weight: 700; }
    .scr-section-head p { margin: 0; color: #8a94a6; font-size: 11px; }

    .scr-add-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 9px 16px;
        border-radius: 8px;
        border: 0;
        background: linear-gradient(135deg, #ff6b00, #f45100);
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(245, 81, 0, .22);
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .scr-add-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 7px 16px rgba(245, 81, 0, .3);
    }

    .scr-add-btn:active {
        transform: translateY(0) scale(0.98);
    }

    .scr-close-btn {
        width: 34px; height: 34px;
        flex-shrink: 0;
        border-radius: 8px;
        border: 1px solid #f1c7cb;
        background: #fff5f5;
        color: #dc3545;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
    }

    .scr-close-btn:hover {
        background: #dc3545;
        border-color: #dc3545;
        color: #fff;
        transform: scale(1.05);
    }

    .scr-add-section {
        animation: addFormIn .25s ease;
    }

    @keyframes addFormIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .row { overflow: visible; }
    .col-md-6 { overflow: visible; }

    .scr-group { margin-bottom: 16px; overflow: visible; }

    .scr-group label {
        display: block; margin-bottom: 6px;
        color: #374151; font-size: 12px; font-weight: 600;
    }

    .scr-group label span { color: #ef4444; margin-left: 3px; }

    .scr-error {
        display: block !important; margin-top: 5px !important;
        color: #ef4444 !important; font-size: 11px !important;
        font-weight: 500; line-height: 1.4;
    }

    .list-loader {
        display: flex; align-items: center; gap: 8px;
        padding: 20px; font-size: 12px; color: #475569;
        background: #f8fafc; border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    .list-empty {
        display: flex; flex-direction: column; align-items: center;
        gap: 6px; padding: 24px 16px;
        background: #f8fafc; border: 1px dashed #e2e8f0;
        border-radius: 10px; text-align: center;
    }

    .list-empty > svg { font-size: 22px; color: #22c55e; }
    .list-empty strong { color: #374151; font-size: 12.5px; font-weight: 700; }
    .list-empty small { color: #9aa3b2; font-size: 11px; }

    .existing-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .existing-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: #fafbfc;
        border: 1.5px solid #eef1f5;
        border-radius: 10px;
        transition: all 0.2s ease;
    }

    .existing-row:hover {
        border-color: #ffd2b8;
        background: #fff7f1;
        box-shadow: 0 4px 12px rgba(245, 102, 0, 0.06);
    }

    .existing-index {
        width: 24px; height: 24px;
        flex: 0 0 24px;
        border-radius: 50%;
        background: #fff1e8;
        color: #f56600;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700;
    }

    .existing-icon {
        width: 34px; height: 34px;
        flex: 0 0 34px;
        border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
        background: #fff; color: #f56600;
        border: 1px solid #ffe4d1;
        font-size: 14px;
    }

    .existing-info {
        flex: 1;
        min-width: 0;
    }

    .existing-dept {
        color: #1f2937;
        font-size: 12.5px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 2px;
    }

    .existing-course {
        display: flex; align-items: center; gap: 5px;
        margin-top: 2px;
        color: #6b7280;
        font-size: 11px;
    }

    .existing-course > svg {
        color: #f56600;
        font-size: 10px;
        flex-shrink: 0;
    }

    .existing-delete-btn {
        width: 34px; height: 34px;
        flex: 0 0 34px;
        border-radius: 9px;
        border: 1px solid #f1c7cb;
        background: #fff5f5;
        color: #dc3545;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
    }

    .existing-delete-btn:hover {
        background: #dc3545;
        border-color: #dc3545;
        color: #fff;
        transform: scale(1.05);
    }

    .selected-courses-box {
        margin-bottom: 10px; padding: 13px;
        background: linear-gradient(135deg, #fffaf6, #fff7f1);
        border: 1px solid #ffd9c2; border-radius: 10px;
        animation: courseBoxIn .2s ease;
    }

    @keyframes courseBoxIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .selected-courses-title {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 10px; color: #f56600;
        font-size: 11px; font-weight: 700;
    }

    .selected-title-left { display: flex; align-items: center; gap: 7px; }
    .selected-title-left svg { font-size: 13px; }

    .selected-count {
        min-width: 24px; height: 22px; padding: 0 7px;
        border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        background: #fff; border: 1px solid #ffd2b8;
        color: #f56600; font-size: 9px; font-weight: 700;
    }

    .selected-courses-list { display: flex; flex-wrap: wrap; gap: 8px; }

    .selected-course-item {
        display: flex; align-items: center; gap: 8px;
        min-height: 34px; padding: 5px 6px 5px 9px;
        background: #fff; border: 1px solid #ffc7a5;
        border-radius: 7px;
        box-shadow: 0 2px 6px rgba(245, 102, 0, .06);
        transition: .2s ease;
    }

    .selected-course-item:hover {
        border-color: #f56600;
        box-shadow: 0 4px 10px rgba(245, 102, 0, .10);
    }

    .selected-course-name {
        display: flex; align-items: center; gap: 6px;
        color: #374151; font-size: 11px; font-weight: 600; line-height: 1.3;
    }

    .selected-course-check {
        display: flex; align-items: center; justify-content: center;
        color: #f56600; font-size: 11px;
    }

    .remove-course-btn {
        width: 22px; height: 22px; padding: 0;
        border: 0; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: #fff0e8; color: #f56600;
        font-size: 9px; cursor: pointer; transition: .2s ease;
    }

    .remove-course-btn:hover {
        background: #f56600; color: #fff; transform: rotate(90deg);
    }

    .scr-info-box {
        display: flex; align-items: center; gap: 8px;
        padding: 14px; border-radius: 8px; font-size: 12px;
    }

    .scr-info-blue { background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; }
    .scr-info-blue > svg { font-size: 14px; flex-shrink: 0; }
    .scr-info-grey { background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; }
    .scr-info-orange { background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c; }

    .course-dropdown-wrapper {
        position: relative;
        width: 100%;
        overflow: visible;
    }

    .course-dropdown-btn {
        width: 100%; min-height: 44px; padding: 8px 12px;
        border: 1px solid #dce2ea; border-radius: 7px;
        background: #fff; color: #374151;
        display: flex; align-items: center; justify-content: space-between;
        cursor: pointer; font-size: 12px; font-weight: 500;
        transition: .2s ease; outline: none;
    }

    .course-dropdown-btn:hover {
        border-color: #ff720d;
        box-shadow: 0 0 0 3px rgba(255, 102, 0, .06);
    }

    .course-dropdown-btn:focus {
        border-color: #ff720d;
        box-shadow: 0 0 0 3px rgba(255, 102, 0, .08);
    }

    .course-dropdown-error { border-color: #ef4444 !important; background: #fffafa; }

    .course-dropdown-left { display: flex; align-items: center; gap: 9px; }

    .course-main-icon {
        width: 28px; height: 28px; border-radius: 6px;
        display: flex; align-items: center; justify-content: center;
        background: #fff1e8; color: #f56600; font-size: 12px;
    }

    .course-dropdown-arrow { color: #f56600; font-size: 9px; }

    .course-dropdown-menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        z-index: 9999;
        overflow: visible;
        background: #fff;
        border: 1px solid #e2e6ec;
        border-radius: 10px;
        box-shadow: 0 12px 35px rgba(20, 40, 70, .14);
        animation: dropdownIn .18s ease;
    }

    @keyframes dropdownIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .course-dropdown-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 11px 13px; background: #fffaf6;
        border-bottom: 1px solid #f1e6df;
        border-radius: 10px 10px 0 0;
    }

    .course-dropdown-header strong,
    .course-dropdown-header small { display: block; }

    .course-dropdown-header strong {
        color: #374151; font-size: 11px; margin-bottom: 2px;
    }

    .course-dropdown-header small { color: #9aa3b2; font-size: 9px; }

    .course-dropdown-header > span {
        min-width: 23px; height: 23px; padding: 0 6px;
        border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        background: #f56600; color: #fff; font-size: 9px; font-weight: 700;
    }

    .course-options-list {
        max-height: 420px;
        overflow-y: auto;
        padding: 8px;
        scroll-behavior: smooth;
    }

    .course-options-list::-webkit-scrollbar { width: 6px; }
    .course-options-list::-webkit-scrollbar-track { background: #f7f7f7; border-radius: 10px; }
    .course-options-list::-webkit-scrollbar-thumb {
        background: #ffc29f; border-radius: 10px;
    }
    .course-options-list::-webkit-scrollbar-thumb:hover { background: #f56600; }

    .picker-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        margin-bottom: 6px;
        border: 1.5px solid #eef1f5;
        border-radius: 10px;
        background: #fafbfc;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
    }

    .picker-item:last-child { margin-bottom: 0; }

    .picker-item:hover {
        border-color: #ffd2b8;
        background: #fff7f1;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(245, 102, 0, 0.08);
    }

    .picker-item:active { transform: translateY(0) scale(0.99); }

    .picker-item-left {
        display: flex; align-items: center; gap: 10px;
        min-width: 0; flex: 1;
    }

    .picker-item-icon {
        width: 34px; height: 34px; flex: 0 0 34px;
        border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
        background: #fff; color: #f56600;
        font-size: 14px; border: 1px solid #ffe4d1;
        transition: all 0.2s ease;
    }

    .picker-item:hover .picker-item-icon {
        background: #f56600; color: #fff; border-color: #f56600;
    }

    .picker-item-text {
        display: flex; flex-direction: column; min-width: 0;
    }

    .picker-item-name {
        color: #1f2937; font-size: 12.5px; font-weight: 600;
        line-height: 1.35;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .picker-item-hint { color: #9aa3b2; font-size: 10px; margin-top: 1px; }

    .picker-item-add {
        width: 28px; height: 28px; flex: 0 0 28px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: #fff;
        border: 1.5px dashed #d5dce6;
        transition: all 0.25s ease;
    }

    .picker-item-plus {
        color: #9aa3b2; font-size: 16px; font-weight: 700; line-height: 1;
        margin-top: -2px;
        transition: all 0.25s ease;
    }

    .picker-item:hover .picker-item-add {
        background: #f56600;
        border: 1.5px solid #f56600;
        transform: rotate(90deg);
    }

    .picker-item:hover .picker-item-plus { color: #fff; }

    .course-empty-menu { padding: 22px 15px; text-align: center; }

    .course-empty-menu > svg {
        display: block; margin: 0 auto 7px;
        color: #22c55e; font-size: 22px;
    }

    .course-empty-menu strong,
    .course-empty-menu small { display: block; }

    .course-empty-menu strong {
        color: #374151; font-size: 11px; margin-bottom: 3px;
    }

    .course-empty-menu small { color: #9aa3b2; font-size: 9px; }

    .scr-footer {
        display: flex; align-items: center; justify-content: space-between;
        gap: 20px; padding: 20px 4px 0;
        border-top: 1px solid #edf0f4;
    }

    .scr-footer-actions {
        display: flex;
        gap: 10px;
    }

    .scr-security { display: flex; align-items: center; gap: 10px; }

    .scr-security-icon {
        width: 35px; height: 35px; border-radius: 8px;
        background: #ecfdf3; color: #16a34a;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px;
    }

    .scr-security strong,
    .scr-security span { display: block; }

    .scr-security strong {
        color: #374151; font-size: 11px; margin-bottom: 2px;
    }

    .scr-security span { color: #9aa3b2; font-size: 10px; }

    .scr-cancel-btn {
        display: inline-flex; align-items: center; justify-content: center;
        gap: 7px; min-width: 120px;
        padding: 12px 20px; border-radius: 7px;
        background: #f1f3f6;
        color: #5d6878;
        border: 1px solid #e1e5ec;
        font-size: 13px; font-weight: 600;
        cursor: pointer;
        transition: .2s ease;
    }

    .scr-cancel-btn:hover:not(:disabled) {
        background: #e6e9ee;
    }

    .scr-cancel-btn:disabled {
        opacity: 0.6; cursor: not-allowed;
    }

    .scr-submit {
        display: inline-flex; align-items: center; justify-content: center;
        gap: 8px; border: 0; min-width: 150px;
        padding: 12px 20px; border-radius: 7px;
        background: linear-gradient(135deg, #ff6b00, #f45100);
        color: #fff; font-size: 13px; font-weight: 600;
        cursor: pointer;
        box-shadow: 0 5px 14px rgba(245, 81, 0, .2);
        transition: .2s ease;
    }

    .scr-submit:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 7px 18px rgba(245, 81, 0, .28);
    }

    .scr-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    .del-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: delFadeIn .2s ease;
    }

    @keyframes delFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .del-modal {
        width: 100%;
        max-width: 440px;
        background: #fff;
        border-radius: 16px;
        padding: 28px 24px 22px;
        text-align: center;
        box-shadow: 0 25px 60px rgba(0, 0, 0, .28);
        animation: delPop .25s cubic-bezier(.18,.89,.32,1.28);
    }

    @keyframes delPop {
        from { opacity: 0; transform: scale(0.9) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .del-icon {
        width: 64px; height: 64px;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: #fff5f5;
        color: #dc3545;
        display: flex; align-items: center; justify-content: center;
        font-size: 26px;
        animation: delPulse 1.5s ease infinite;
    }

    @keyframes delPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, .18); }
        50% { box-shadow: 0 0 0 12px rgba(220, 53, 69, 0); }
    }

    .del-title {
        margin: 0 0 8px;
        color: #1f2937;
        font-size: 18px;
        font-weight: 700;
    }

    .del-text {
        margin: 0 0 18px;
        color: #6b7280;
        font-size: 13px;
        line-height: 1.55;
    }

    .del-info {
        background: #fafbfc;
        border: 1px solid #eef1f5;
        border-radius: 10px;
        padding: 12px 14px;
        margin-bottom: 22px;
        text-align: left;
    }

    .del-info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
        padding: 5px 0;
    }

    .del-info-row:not(:last-child) {
        border-bottom: 1px dashed #eef1f5;
    }

    .del-info-row > span {
        color: #9aa3b2;
        font-weight: 500;
    }

    .del-info-row > strong {
        color: #1f2937;
        font-weight: 600;
        text-align: right;
        max-width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .del-actions {
        display: flex;
        gap: 10px;
    }

    .del-cancel,
    .del-confirm {
        flex: 1;
        height: 42px;
        border-radius: 9px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        transition: all 0.2s ease;
        border: 0;
    }

    .del-cancel {
        background: #f1f3f6;
        color: #5d6878;
    }

    .del-cancel:hover:not(:disabled) {
        background: #e6e9ee;
    }

    .del-confirm {
        background: linear-gradient(135deg, #dc3545, #b02a37);
        color: #fff;
        box-shadow: 0 5px 14px rgba(220, 53, 69, .22);
    }

    .del-confirm:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(220, 53, 69, .3);
    }

    .del-cancel:disabled,
    .del-confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 991px) {
        .scr-header { padding: 20px; }
        .scr-form { padding: 20px; }
        .scr-section { padding: 18px; }
    }

    @media (max-width: 767px) {
        .scr-page { padding: 15px 8px; }
        .scr-header { padding: 18px; }
        .scr-header h2 { font-size: 18px; }
        .scr-header p { font-size: 11px; }
        .scr-icon { width: 46px; height: 46px; flex-basis: 46px; font-size: 19px; }
        .scr-form { padding: 15px; }
        .scr-section { padding: 15px; margin-bottom: 15px; }
        .scr-section-head { flex-wrap: wrap; }
        .scr-footer { flex-direction: column; align-items: stretch; }
        .scr-footer-actions { width: 100%; flex-direction: column; }
        .scr-submit, .scr-cancel-btn { width: 100%; }
        .selected-course-item { max-width: 100%; }
        .selected-course-name { max-width: calc(100vw - 110px); }
        .course-dropdown-menu { max-height: 320px; }
        .course-options-list { max-height: 260px; }
        .existing-row { padding: 9px 10px; gap: 10px; }
        .existing-icon { width: 30px; height: 30px; flex-basis: 30px; font-size: 12px; }
        .existing-delete-btn { width: 32px; height: 32px; flex-basis: 32px; }
    }
                `}
            </style>
        </div>
    );
};

export default AddFranchiseDepartment;