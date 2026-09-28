
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
    getStudentAcademicDetails,
    getStudentData,
    CreateacademicDetails
} from "../../AllServicesFiles/StudentService";
import { FILE_URL } from "../../api";

function AcademicDetailsupdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [academicDetails, setAcademicDetails] = useState([]);
    const [educationlevel, setEducationlevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adding, setAdding] = useState(false);

    const [newAcademic, setNewAcademic] = useState({
        levelTypeId: 0,
        schoolCollege: "",
        rollNo: "",
        boardUniversity: "",
        percentageCgpa: "",
        file: null
    });

    useEffect(() => {
        loadAcademicDetails();
        loadEducationlevels();
    }, [id]);

    const loadAcademicDetails = async () => {
        try {
            setLoading(true);

            const result = await getStudentAcademicDetails(id);
            const data = result?.data || result;

            setAcademicDetails(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error("Academic Details Error:", error);
        } finally {
            setLoading(false);
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

    const value = (data) => {
        return data !== null &&
            data !== undefined &&
            String(data).trim() !== ""
            ? data
            : "-";
    };

    const makeOptions = (data) => {
        return data.map((item) => ({
            value: item.id,
            label: item.name
        }));
    };

    const getSelected = (data, selectedId) => {
        const item = data.find(
            (x) => Number(x.id) === Number(selectedId)
        );

        return item
            ? {
                value: item.id,
                label: item.name
            }
            : null;
    };

    const resetForm = () => {
        setNewAcademic({
            levelTypeId: 0,
            schoolCollege: "",
            rollNo: "",
            boardUniversity: "",
            percentageCgpa: "",
            file: null
        });

        setAdding(false);
    };

    const handleNewAcademicChange = (e) => {
        const {
            name,
            value,
            files,
            type
        } = e.target;

        setNewAcademic((prev) => ({
            ...prev,
            [name]:
                type === "file"
                    ? files?.[0] || null
                    : value
        }));
    };

    const handleLevelChange = (selectedOption) => {
        setNewAcademic((prev) => ({
            ...prev,
            levelTypeId:
                selectedOption?.value || 0
        }));
    };

    const handleAddQualification = () => {
        setNewAcademic({
            levelTypeId: 0,
            schoolCollege: "",
            rollNo: "",
            boardUniversity: "",
            percentageCgpa: "",
            file: null
        });

        setAdding(true);

        setTimeout(() => {
            document
                .getElementById("new-academic-form")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }, 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newAcademic.levelTypeId) {
            alert("Please select Level");
            return;
        }

        if (!newAcademic.schoolCollege.trim()) {
            alert("Please enter School / College");
            return;
        }

        if (!newAcademic.rollNo.trim()) {
            alert("Please enter Roll No");
            return;
        }

        if (!newAcademic.boardUniversity.trim()) {
            alert("Please enter Board / University");
            return;
        }

        if (!newAcademic.percentageCgpa.trim()) {
            alert("Please enter Percentage / CGPA");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                EntityId: Number(id),
                Index: 0,
                LevelTypeId: newAcademic.levelTypeId,
                SchoolCollege: newAcademic.schoolCollege,
                RollNo: newAcademic.rollNo,
                BoardUniversity: newAcademic.boardUniversity,
                PercentageCgpa: newAcademic.percentageCgpa,
                File: newAcademic.file
            };

            const result = await CreateacademicDetails(payload);

            alert(
                result?.message ||
                "Academic details created successfully"
            );

            resetForm();

            await loadAcademicDetails();
        } catch (error) {
            console.error(
                "Academic Save Error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to create academic details"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid py-5">
                <div className="text-center">
                    <div
                        className="spinner-border text-success"
                        role="status"
                    ></div>

                    <p className="text-muted mt-3">
                        Loading academic details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="fw-bold mb-1">
                            Academic Details
                        </h1>

                        <nav>
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">
                                        Dashboard
                                    </a>
                                </li>

                                <li className="breadcrumb-item">
                                    Student
                                </li>

                                <li className="breadcrumb-item active">
                                    Academic Details
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <button
                        className="btn btn-light border"
                        onClick={() => navigate(-1)}
                        style={{
                            borderRadius: "10px"
                        }}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back
                    </button>
                </div>
            </div>

            <section>
                <div className="container-fluid px-0">
                    <div
                        className="card border-0 shadow-sm mb-4"
                        style={{
                            borderRadius: "18px"
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center">
                                    <div
                                        className="d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "12px",
                                            background: "#f0eaff",
                                            color: "#6610f2",
                                            fontSize: "22px"
                                        }}
                                    >
                                        <i className="bi bi-mortarboard-fill"></i>
                                    </div>

                                    <div>
                                        <h5
                                            className="mb-1 fw-bold"
                                            style={{
                                                color: "#1e293b"
                                            }}
                                        >
                                            Academic Details
                                        </h5>

                                        <div
                                            style={{
                                                width: "45px",
                                                height: "3px",
                                                background: "#6610f2",
                                                borderRadius: "5px"
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleAddQualification}
                                    style={{
                                        borderRadius: "9px",
                                        fontWeight: 600
                                    }}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add Qualification
                                </button>
                            </div>

                            {adding && (
                                <div
                                    id="new-academic-form"
                                    className="border rounded-3 p-4 mb-4"
                                    style={{
                                        background: "#faf8ff",
                                        borderColor: "#d8c9ff"
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6
                                                className="fw-bold mb-1"
                                                style={{
                                                    color: "#6610f2"
                                                }}
                                            >
                                                Add New Qualification
                                            </h6>

                                            <small className="text-muted">
                                                Enter student's academic details
                                            </small>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light border"
                                            onClick={resetForm}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Level
                                                    <span className="text-danger">
                                                        {" "}*
                                                    </span>
                                                </label>

                                                <Select
                                                    options={makeOptions(
                                                        educationlevel
                                                    )}
                                                    value={getSelected(
                                                        educationlevel,
                                                        newAcademic.levelTypeId
                                                    )}
                                                    onChange={
                                                        handleLevelChange
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
                                                        menuPortal:
                                                            (base) => ({
                                                                ...base,
                                                                zIndex: 9999
                                                            }),
                                                        menu:
                                                            (base) => ({
                                                                ...base,
                                                                zIndex: 9999
                                                            })
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    School / College
                                                    <span className="text-danger">
                                                        {" "}*
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    name="schoolCollege"
                                                    className="form-control"
                                                    placeholder="School / College"
                                                    value={
                                                        newAcademic.schoolCollege
                                                    }
                                                    onChange={
                                                        handleNewAcademicChange
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Roll No
                                                    <span className="text-danger">
                                                        {" "}*
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    name="rollNo"
                                                    className="form-control"
                                                    placeholder="Roll No"
                                                    value={
                                                        newAcademic.rollNo
                                                    }
                                                    onChange={
                                                        handleNewAcademicChange
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Board / University
                                                    <span className="text-danger">
                                                        {" "}*
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    name="boardUniversity"
                                                    className="form-control"
                                                    placeholder="Board / University"
                                                    value={
                                                        newAcademic.boardUniversity
                                                    }
                                                    onChange={
                                                        handleNewAcademicChange
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Percentage / CGPA
                                                    <span className="text-danger">
                                                        {" "}*
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    name="percentageCgpa"
                                                    className="form-control"
                                                    placeholder="Percentage / CGPA"
                                                    value={
                                                        newAcademic.percentageCgpa
                                                    }
                                                    onChange={
                                                        handleNewAcademicChange
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Document
                                                </label>

                                                <input
                                                    type="file"
                                                    name="file"
                                                    className="form-control"
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                    onChange={
                                                        handleNewAcademicChange
                                                    }
                                                />

                                                {newAcademic.file && (
                                                    <small className="text-success mt-1 d-block">
                                                        <i className="bi bi-check-circle-fill me-1"></i>
                                                        {
                                                            newAcademic.file.name
                                                        }
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-end mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-light border me-2"
                                                onClick={resetForm}
                                                disabled={saving}
                                                style={{
                                                    borderRadius: "9px"
                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                disabled={saving}
                                                style={{
                                                    borderRadius: "9px",
                                                    fontWeight: 600
                                                }}
                                            >
                                                {saving ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                        ></span>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check2-circle me-2"></i>
                                                        Save Qualification
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {academicDetails.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover align-middle mb-0">
                                        <thead
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, #6610f2, #8540f5)",
                                                color: "#fff"
                                            }}
                                        >
                                            <tr>
                                                <th
                                                    style={{
                                                        width: "60px"
                                                    }}
                                                >
                                                    #
                                                </th>

                                                <th>
                                                    Level
                                                </th>

                                                <th>
                                                    School / College
                                                </th>

                                                <th>
                                                    Roll No
                                                </th>

                                                <th>
                                                    Board / University
                                                </th>

                                                <th>
                                                    Percentage / CGPA
                                                </th>

                                                <th>
                                                    Document
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {academicDetails.map(
                                                (item, index) => (
                                                    <tr
                                                        key={
                                                            item.id ||
                                                            index
                                                        }
                                                    >
                                                        <td className="fw-semibold">
                                                            {index + 1}
                                                        </td>

                                                        <td>
                                                            {value(
                                                                {
                                                                    92: "10th",
                                                                    93: "12th",
                                                                    94: "Other"
                                                                }[item.levelTypeId]
                                                            )}
                                                        </td>

                                                        <td>
                                                            <div className="fw-semibold">
                                                                {value(
                                                                    item.schoolCollege
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span className="badge bg-primary">
                                                                {value(
                                                                    item.rollNo
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {value(
                                                                item.boardUniversity
                                                            )}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className="badge bg-success"
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                    padding:
                                                                        "7px 12px"
                                                                }}
                                                            >
                                                                {value(
                                                                    item.percentageCgpa
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {item.fileName ? (
                                                                (() => {
                                                                    const fileUrl = `${FILE_URL}${item.fileName}`;
                                                                    const extension = item.fileName.split(".").pop()?.toLowerCase();

                                                                    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
                                                                    const isPdf = extension === "pdf";

                                                                    return (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() => window.open(fileUrl, "_blank")}
                                                                        >
                                                                            <i
                                                                                className={`bi ${isImage
                                                                                        ? "bi-image"
                                                                                        : isPdf
                                                                                            ? "bi-file-earmark-pdf"
                                                                                            : "bi-file-earmark"
                                                                                    } me-1`}
                                                                            ></i>
                                                                            {isImage ? "View Image" : isPdf ? "View PDF" : "View File"}
                                                                        </button>
                                                                    );
                                                                })()
                                                            ) : (
                                                                <span className="text-muted">No Document</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div
                                    className="text-center py-5"
                                    style={{
                                        background: "#fafafa",
                                        borderRadius: "12px"
                                    }}
                                >
                                    <div
                                        className="d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            background: "#f1f5f9"
                                        }}
                                    >
                                        <i
                                            className="bi bi-mortarboard text-muted"
                                            style={{
                                                fontSize: "28px"
                                            }}
                                        ></i>
                                    </div>

                                    <h6 className="fw-semibold">
                                        No Academic Details Found
                                    </h6>

                                    <p className="text-muted small mb-3">
                                        Academic information is not available
                                        for this student.
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={
                                            handleAddQualification
                                        }
                                        style={{
                                            borderRadius: "9px"
                                        }}
                                    >
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Add Qualification
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </section>
        </>
    );
}

export default AcademicDetailsupdate;
