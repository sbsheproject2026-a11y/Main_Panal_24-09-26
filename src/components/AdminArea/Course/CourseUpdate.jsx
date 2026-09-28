 import React, { useEffect, useState } from "react";
import {
  getCourseById,
  getCourseCategory,
  getCourseType,
  getDuration,
  getDurationType,
  getParentCourse,
  translateToHindi,
  updateCourse,
} from "../../AllServicesFiles/CourseService";
import { useNavigate, useParams } from "react-router-dom";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

 

function CourseUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==============================
  // STATES
  // ==============================

  const [durations, setDurations] = useState([]);
  const [durationTypes, setDurationTypes] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [parentCourses, setParentCourses] = useState([]);
  const [amountTypes, setAmountTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    code: "",
    shortName: "",
    name: "",
    nameHindi: "",
    shortDescription: "",
    descrption: "",
    eligbilty: "",
    duration: 0,
    durationTypeId: 0,
    parentId: null,
    categoryId: 0,
    departmentId: 0,
    totalClass: 0,
    classNo: 0,
    isActive: 1,
    isHighlight: 0,   // ✅ NEW
  });

  // ✅ NEW: Amounts
  const [amounts, setAmounts] = useState([
    { amountTypeId: 0, name: "", amount: "" },
  ]);

  // ✅ NEW: Study Materials
  const [studyMaterials, setStudyMaterials] = useState([
    { materialTypeId: 0, name: "", file: null, altTag: "" },
  ]);

  // ==============================
  // CKEDITOR CONFIG
  // ==============================

  const editorConfig = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "undo",
      "redo",
    ],
  };

  // ==============================
  // CKEDITOR CHANGE
  // ==============================

  const handleMaterialChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ==============================
  // LOAD ALL DATA
  // ==============================

  useEffect(() => {
    loadAllData();
  }, [id]);

  const loadAllData = async () => {
    try {
      setPageLoading(true);

      await Promise.all([
        loadCourseType(),
        loadCourseCategory(),
        loadDuration(),
        loadDurationType(),
        loadParentCourses(),
        loadAmountTypes(),
        loadMaterialTypes(),
      ]);

      if (id) {
        await handleEdit(id);
      }
    } catch (error) {
      console.error("Page loading error:", error);
    } finally {
      setPageLoading(false);
    }
  };

  // ==============================
  // LOADERS
  // ==============================

  const loadCourseType = async () => {
    try {
      const result = await getCourseType(13);
      setCourseTypes(result?.data || []);
    } catch (error) {
      console.error("Course type loading error:", error);
    }
  };

  const loadCourseCategory = async () => {
    try {
      const result = await getCourseCategory(14);
      setCourseCategories(result?.data || []);
    } catch (error) {
      console.error("Course category loading error:", error);
    }
  };

  const loadDuration = async () => {
    try {
      const result = await getDuration(11);
      setDurations(result?.data || []);
    } catch (error) {
      console.error("Duration loading error:", error);
    }
  };

  const loadDurationType = async () => {
    try {
      const result = await getDurationType(12);
      setDurationTypes(result?.data || []);
    } catch (error) {
      console.error("Duration type loading error:", error);
    }
  };

  const loadParentCourses = async () => {
    try {
      const result = await getParentCourse();
      setParentCourses(result?.data || []);
    } catch (error) {
      console.error("Parent course loading error:", error);
    }
  };

  const loadAmountTypes = async () => {
    try {
      const result = await getCourseType(31);
      setAmountTypes(result?.data || []);
    } catch (error) {
      console.error("Amount type loading error:", error);
    }
  };

  const loadMaterialTypes = async () => {
    try {
      const result = await getCourseType(34);
      setMaterialTypes(result?.data || []);
    } catch (error) {
      console.error("Material type loading error:", error);
    }
  };

  // ==============================
  // GET COURSE BY ID
  // ==============================

  const handleEdit = async (courseId) => {
    try {
      const result = await getCourseById(courseId);

      if (!result) {
        alert("Course not found.");
        navigate("/course-list");
        return;
      }

      setFormData({
        id: result.id ?? courseId,
        code: result.code ?? "",
        shortName: result.shortName ?? "",
        name: result.name ?? "",
        nameHindi: result.nameHindi ?? "",
        shortDescription: result.shortDescription ?? "",
        descrption: result.descrption ?? "",
        eligbilty: result.eligbilty ?? "",
        duration: Number(result.duration ?? 0),
        durationTypeId: Number(result.durationTypeId ?? 0),
        parentId:
          result.parentId === null ||
          result.parentId === undefined ||
          result.parentId === 0
            ? null
            : Number(result.parentId),
        categoryId: Number(result.categoryId ?? 0),
        departmentId: Number(result.departmentId ?? 0),
        totalClass: Number(result.totalClass ?? 0),
        classNo: Number(result.classNo ?? 0),
        isActive:
          result.isActive === 1 || result.isActive === true ? 1 : 0,
        isHighlight:
          result.isHighlight === 1 || result.isHighlight === true ? 1 : 0,
      });

      // ✅ Load existing amounts
      if (
        Array.isArray(result.productAmounts) &&
        result.productAmounts.length > 0
      ) {
        setAmounts(
          result.productAmounts.map((a) => ({
            id: a.id ?? null,
            amountTypeId: Number(a.amountTypeId ?? 0),
            name: a.name ?? "",
            amount: a.amount ?? "",
          }))
        );
      } else {
        setAmounts([{ amountTypeId: 0, name: "", amount: "" }]);
      }

      // ✅ Load existing study materials
      if (
        Array.isArray(result.productCategoryDocuments) &&
        result.productCategoryDocuments.length > 0
      ) {
        setStudyMaterials(
          result.productCategoryDocuments.map((m) => ({
            id: m.id ?? null,
            materialTypeId: Number(m.materialTypeId ?? 0),
            name: m.name ?? "",
            file: null,
            filePath: m.fileupload ?? "",
            altTag: m.altTag ?? "",
          }))
        );
      } else {
        setStudyMaterials([
          { materialTypeId: 0, name: "", file: null, altTag: "" },
        ]);
      }
    } catch (error) {
      console.error("Get course error:", error);
      alert("Unable to load course details.");
    }
  };

  // ==============================
  // NORMAL INPUT CHANGE
  // ==============================

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "name") {
      if (value.trim() === "") {
        setFormData((prev) => ({
          ...prev,
          name: value,
          nameHindi: "",
        }));
        return;
      }

      try {
        setTranslating(true);
        const hindi = await translateToHindi(value);

        setFormData((prev) => ({
          ...prev,
          name: value,
          nameHindi: hindi || prev.nameHindi,
        }));
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setTranslating(false);
      }
    }
  };

  // ==============================
  // SELECT CHANGE
  // ==============================

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: Number(value) }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==============================
  // PARENT COURSE CHANGE
  // ==============================

  const handleParentChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      parentId:
        value === "" || value === "0" ? null : Number(value),
    }));

    if (errors.parentId) {
      setErrors((prev) => ({ ...prev, parentId: "" }));
    }
  };

  // ==============================
  // ✅ AMOUNT HANDLERS
  // ==============================

  const addAmount = () => {
    setAmounts((prev) => [
      ...prev,
      { amountTypeId: 0, name: "", amount: "" },
    ]);
  };

  const removeAmount = (index) => {
    setAmounts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAmountChange = (index, field, value) => {
    setAmounts((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "amountTypeId" ? Number(value) : value,
            }
          : item
      )
    );
  };

  // ==============================
  // ✅ STUDY MATERIAL HANDLERS
  // ==============================

  const addStudyMaterial = () => {
    setStudyMaterials((prev) => [
      ...prev,
      { materialTypeId: 0, name: "", file: null, altTag: "" },
    ]);
  };

  const removeStudyMaterial = (index) => {
    setStudyMaterials((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleStudyMaterialChange = (index, field, value) => {
    setStudyMaterials((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // ==============================
  // VALIDATION
  // ==============================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.departmentId || formData.departmentId === 0)
      newErrors.departmentId = "Course Type is required";

    if (!formData.categoryId || formData.categoryId === 0)
      newErrors.categoryId = "Course Category is required";

    if (!formData.name || formData.name.trim() === "")
      newErrors.name = "Course Name is required";

    if (!formData.duration || formData.duration === 0)
      newErrors.duration = "Duration is required";

    if (!formData.durationTypeId || formData.durationTypeId === 0)
      newErrors.durationTypeId = "Duration Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        parentId:
          formData.parentId === 0 ||
          formData.parentId === "0" ||
          formData.parentId === ""
            ? null
            : formData.parentId,
        productAmounts: amounts,
        productCategoryDocuments: studyMaterials,
      };

      const result = await updateCourse(payload);

      if (result?.success) {
        alert(result.message || "Course updated successfully.");
        navigate("/course-list");
        return;
      }

      alert(result?.message || "Unable to update the course.");
    } catch (error) {
      console.error("Update course error:", error);
      alert("Something went wrong while updating the course.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // PAGE LOADING
  // ==============================

  if (pageLoading) {
    return (
      <div className="course-loading-page">
        <div className="course-loader-box">
          <div className="course-spinner"></div>
          <div className="course-loader-text">
            Loading course details...
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // JSX
  // ==============================

  return (
    <div className="course-page">
      <div className="course-container">
        <div className="course-card">

          {/* HEADER */}
          <div className="course-header">
            <div className="course-header-icon">✎</div>
            <div className="course-header-content">
              <h2>Update Course</h2>
              <p>Update course information and academic details</p>
            </div>
          </div>

          <form className="course-form" onSubmit={handleSubmit}>

            {/* ===== 01 BASIC INFO ===== */}
            <div className="course-section">
              <div className="course-section-title">
                <div className="course-section-number">01</div>
                <h3>Course Information</h3>
              </div>

              <div className="course-grid">

                {/* Course Type */}
                <div className="course-field">
                  <label className="course-label">
                    Course Type<span>*</span>
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleSelectChange}
                    className={`course-select ${
                      errors.departmentId ? "course-select-error" : ""
                    }`}
                  >
                    <option value={0}>Select Course Type</option>
                    {courseTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <div className="course-error">{errors.departmentId}</div>
                  )}
                </div>

                {/* Course Category */}
                <div className="course-field">
                  <label className="course-label">
                    Course Category<span>*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleSelectChange}
                    className={`course-select ${
                      errors.categoryId ? "course-select-error" : ""
                    }`}
                  >
                    <option value={0}>Select Course Category</option>
                    {courseCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <div className="course-error">{errors.categoryId}</div>
                  )}
                </div>

                {/* Parent Course */}
                <div className="course-field">
                  <label className="course-label">Parent Course</label>
                  <select
                    name="parentId"
                    value={formData.parentId ?? ""}
                    onChange={handleParentChange}
                    className="course-select"
                  >
                    <option value="">Select Parent Course</option>
                    {parentCourses.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Code */}
                <div className="course-field">
                  <label className="course-label">Course / Class Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter course code"
                    className="course-input"
                  />
                </div>

                {/* Name */}
                <div className="course-field">
                  <label className="course-label">
                    Course / Class Name<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter course name"
                    className={`course-input ${
                      errors.name ? "course-input-error" : ""
                    }`}
                  />
                  {errors.name && (
                    <div className="course-error">{errors.name}</div>
                  )}
                </div>

                {/* Hindi Name */}
                <div className="course-field">
                  <label className="course-label">Course Name (Hindi)</label>
                  <div className="course-hindi-wrapper">
                    <input
                      type="text"
                      name="nameHindi"
                      value={formData.nameHindi}
                      onChange={handleChange}
                      placeholder="Course name in Hindi"
                      className="course-input"
                    />
                    {translating && (
                      <span className="course-translate-loader">
                        Translating...
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ===== 02 DURATION ===== */}
            <div className="course-section">
              <div className="course-section-title">
                <div className="course-section-number">02</div>
                <h3>Duration & Class Details</h3>
              </div>

              <div className="course-grid">

                {/* Duration */}
                <div className="course-field">
                  <label className="course-label">Duration<span>*</span></label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleSelectChange}
                    className={`course-select ${
                      errors.duration ? "course-select-error" : ""
                    }`}
                  >
                    <option value={0}>Select Duration</option>
                    {durations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.duration && (
                    <div className="course-error">{errors.duration}</div>
                  )}
                </div>

                {/* Duration Type */}
                <div className="course-field">
                  <label className="course-label">
                    Duration Type<span>*</span>
                  </label>
                  <select
                    name="durationTypeId"
                    value={formData.durationTypeId}
                    onChange={handleSelectChange}
                    className={`course-select ${
                      errors.durationTypeId ? "course-select-error" : ""
                    }`}
                  >
                    <option value={0}>Select Duration Type</option>
                    {durationTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.durationTypeId && (
                    <div className="course-error">{errors.durationTypeId}</div>
                  )}
                </div>

                {/* Total Class */}
                <div className="course-field">
                  <label className="course-label">Total Classes</label>
                  <input
                    type="number"
                    name="totalClass"
                    value={formData.totalClass}
                    onChange={handleChange}
                    placeholder="Enter total classes"
                    min="0"
                    className="course-input"
                  />
                </div>

                {/* Class No */}
                <div className="course-field">
                  <label className="course-label">Class Number</label>
                  <input
                    type="number"
                    name="classNo"
                    value={formData.classNo}
                    onChange={handleChange}
                    placeholder="Enter class number"
                    min="0"
                    className="course-input"
                  />
                </div>

              </div>

              {/* Eligibility */}
              <div className="course-field-full">
                <label className="course-label">Eligibility</label>
                <input
                  type="text"
                  name="eligbilty"
                  value={formData.eligbilty}
                  onChange={handleChange}
                  placeholder="Enter eligibility"
                  className="course-input"
                />
              </div>
            </div>

            {/* ===== 03 DESCRIPTION ===== */}
            <div className="course-section">
              <div className="course-section-title">
                <div className="course-section-number">03</div>
                <h3>Course Description</h3>
              </div>

              <div className="course-field">
                <label className="course-label">Short Description</label>
                <div className="course-editor">
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={formData.shortDescription}
                    onChange={(event, editor) => {
                      handleMaterialChange(
                        "shortDescription",
                        editor.getData()
                      );
                    }}
                  />
                </div>
              </div>

              <div
                className="course-field"
                style={{ marginTop: "20px" }}
              >
                <label className="course-label">Description</label>
                <div className="course-editor">
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={formData.descrption}
                    onChange={(event, editor) => {
                      handleMaterialChange("descrption", editor.getData());
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ===== 04 COURSE AMOUNT ===== */}
            <div className="course-section">
              <div className="course-section-title course-section-with-action">
                <div>
                  <h3>Course Amount</h3>
                  <p>Add different amounts for this course</p>
                </div>
                <button
                  type="button"
                  className="course-add-more-btn"
                  onClick={addAmount}
                >
                  <span>+</span>
                  Add More
                </button>
              </div>

              <div className="course-repeat-box">
                {amounts.map((item, index) => (
                  <div className="course-repeat-row" key={index}>
                    <div className="course-row-number">{index + 1}</div>

                    <div className="course-repeat-field">
                      <label className="course-label">Amount Type</label>
                      <select
                        className="course-select"
                        value={item.amountTypeId}
                        onChange={(e) =>
                          handleAmountChange(
                            index,
                            "amountTypeId",
                            e.target.value
                          )
                        }
                      >
                        <option value={0}>Select Amount Type</option>
                        {amountTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="course-repeat-field">
                      <label className="course-label">Name</label>
                      <input
                        type="text"
                        className="course-input"
                        placeholder="Enter amount name"
                        value={item.name}
                        onChange={(e) =>
                          handleAmountChange(index, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="course-repeat-field">
                      <label className="course-label">Amount</label>
                      <input
                        type="number"
                        className="course-input"
                        placeholder="Enter amount"
                        value={item.amount}
                        onChange={(e) =>
                          handleAmountChange(index, "amount", e.target.value)
                        }
                      />
                    </div>

                    {amounts.length > 1 && (
                      <button
                        type="button"
                        className="course-delete-btn"
                        onClick={() => removeAmount(index)}
                        title="Remove"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ===== 05 STUDY MATERIAL ===== */}
            <div className="course-section">
              <div className="course-section-title course-section-with-action">
                <div>
                  <h3>Study Material</h3>
                  <p>Add course study materials and files</p>
                </div>
                <button
                  type="button"
                  className="course-add-more-btn"
                  onClick={addStudyMaterial}
                >
                  <span>+</span>
                  Add More
                </button>
              </div>

              <div className="course-repeat-box">
                {studyMaterials.map((item, index) => (
                  <div className="course-repeat-row" key={index}>
                    <div className="course-row-number">{index + 1}</div>

                    <div className="course-repeat-field">
                      <label className="course-label">Material Type</label>
                      <select
                        className="course-select"
                        value={item.materialTypeId}
                        onChange={(e) =>
                          handleStudyMaterialChange(
                            index,
                            "materialTypeId",
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value={0}>Select Material Type</option>
                        {materialTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="course-repeat-field">
                      <label className="course-label">Name</label>
                      <input
                        type="text"
                        className="course-input"
                        placeholder="Enter material name"
                        value={item.name}
                        onChange={(e) =>
                          handleStudyMaterialChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="course-repeat-field">
                      <label className="course-label">File</label>
                      <input
                        type="file"
                        className="course-file-input"
                        onChange={(e) =>
                          handleStudyMaterialChange(
                            index,
                            "file",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                      {item.file && (
                        <small className="selected-file">
                          {item.file.name}
                        </small>
                      )}
                      {!item.file && item.filePath && (
                        <small className="selected-file">
                          Existing: {item.filePath}
                        </small>
                      )}
                    </div>

                    <div className="course-repeat-field">
                      <label className="course-label">Alt Tag</label>
                      <input
                        type="text"
                        className="course-input"
                        placeholder="Enter alt tag"
                        value={item.altTag}
                        onChange={(e) =>
                          handleStudyMaterialChange(
                            index,
                            "altTag",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {studyMaterials.length > 1 && (
                      <button
                        type="button"
                        className="course-delete-btn"
                        onClick={() => removeStudyMaterial(index)}
                        title="Remove"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ===== 06 STATUS ===== */}
            <div className="course-section">
              <div className="course-section-title">
                <div className="course-section-number">06</div>
                <h3>Course Status</h3>
              </div>

              <div className="course-status-box">
                <div className="course-status-info">
                  <strong>Active Status</strong>
                  <small>Enable or disable this course</small>
                </div>
                <label className="course-switch">
                  <input
                    type="checkbox"
                    checked={formData.isActive === 1}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked ? 1 : 0,
                      }));
                    }}
                  />
                  <span className="course-slider"></span>
                </label>
              </div>

              {/* ✅ Highlight toggle */}
              <div
                className="course-status-box"
                style={{ marginTop: "12px" }}
              >
                <div className="course-status-info">
                  <strong>Highlight Course</strong>
                  <small>Show this course in highlights section</small>
                </div>
                <label className="course-switch">
                  <input
                    type="checkbox"
                    checked={formData.isHighlight === 1}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        isHighlight: e.target.checked ? 1 : 0,
                      }));
                    }}
                  />
                  <span className="course-slider"></span>
                </label>
              </div>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="course-actions">
              <button
                type="button"
                className="course-back-btn"
                onClick={() => navigate("/course-list")}
                disabled={loading}
              >
                ← Back
              </button>

              <button
                type="submit"
                className="course-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="course-submit-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>✓ Update Course</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
      <style>{`
      
      * {
  box-sizing: border-box;
}

.course-page {
  min-height: 100vh;
  padding: 30px 15px 45px;
  background: linear-gradient(135deg, #fff8f2 0%, #f6f8fb 48%, #fff 100%);
}

.course-container {
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;
}

.course-card {
  background: #ffffff;
  border: 1px solid #eceff3;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(24, 39, 75, .08), 0 3px 10px rgba(24, 39, 75, .04);
}

.course-header {
  position: relative;
  padding: 25px 30px;
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #eeeeee;
  background: #fff;
}

.course-header::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(180deg, #ff6600, #f45100);
}

.course-header-icon {
  width: 55px;
  height: 55px;
  min-width: 55px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #ff6600, #f45100);
  font-size: 24px;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(255, 102, 0, .22);
}

.course-header-content h2 {
  margin: 0 0 5px;
  color: #1d2733;
  font-size: 23px;
  font-weight: 800;
}

.course-header-content p {
  margin: 0;
  color: #7b8490;
  font-size: 14px;
}

.course-form { padding: 30px; }

.course-section { margin-bottom: 30px; }
.course-section:last-child { margin-bottom: 0; }

.course-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  padding-bottom: 11px;
  border-bottom: 1px solid #edf0f3;
}

.course-section-number {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff1e8;
  color: #ff6600;
  font-size: 13px;
  font-weight: 800;
}

.course-section-title h3 {
  margin: 0;
  color: #27313d;
  font-size: 16px;
  font-weight: 750;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.course-field { min-width: 0; }

.course-field-full {
  width: 100%;
  margin-top: 20px;
}

.course-label {
  display: block;
  margin-bottom: 8px;
  color: #303944;
  font-size: 13px;
  font-weight: 700;
}

.course-label span {
  color: #ff6600;
  margin-left: 3px;
}

.course-input,
.course-select {
  width: 100%;
  height: 45px;
  padding: 0 14px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  outline: none;
  background: #fff;
  color: #252d36;
  font-size: 14px;
  transition: all .2s ease;
}

.course-input::placeholder { color: #a6adb6; }

.course-input:hover,
.course-select:hover { border-color: #ffb98c; }

.course-input:focus,
.course-select:focus {
  border-color: #ff6600;
  box-shadow: 0 0 0 3px rgba(255, 102, 0, .10);
}

.course-input-error,
.course-select-error { border-color: #dc3545 !important; }

.course-error {
  margin-top: 6px;
  color: #dc3545;
  font-size: 12px;
  font-weight: 600;
}

.course-hindi-wrapper { position: relative; }

.course-translate-loader {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff6600;
  font-size: 12px;
  font-weight: 700;
}

.course-editor { width: 100%; }
.course-editor .ck.ck-editor { width: 100%; }

.course-editor .ck.ck-toolbar {
  border-color: #dfe4ea !important;
  border-radius: 10px 10px 0 0 !important;
  background: #fafbfc !important;
}

.course-editor .ck.ck-editor__main > .ck-editor__editable {
  min-height: 145px;
  border-color: #dfe4ea !important;
  border-radius: 0 0 10px 10px !important;
  box-shadow: none !important;
  font-size: 14px;
}

.course-editor .ck.ck-editor__main > .ck-editor__editable:focus {
  border-color: #ff6600 !important;
  box-shadow: 0 0 0 3px rgba(255, 102, 0, .10) !important;
}

.course-editor .ck.ck-button:hover,
.course-editor .ck.ck-button.ck-on {
  color: #ff6600 !important;
}

/* =========================================================
   ✅ ADD MORE / REPEAT ROW
========================================================= */

.course-section-with-action {
  justify-content: space-between;
  align-items: center;
}

.course-section-with-action > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.course-section-with-action p {
  margin: 0;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 400;
}

.course-add-more-btn {
  height: 38px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6600, #f45100);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 102, 0, 0.18);
  transition: all 0.2s ease;
}

.course-add-more-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(255, 102, 0, 0.25);
}

.course-add-more-btn span {
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 1;
}

.course-repeat-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.course-repeat-row {
  position: relative;
  display: grid;
  grid-template-columns: 35px 1fr 1fr 1fr 35px;
  align-items: end;
  gap: 12px;
  padding: 18px 45px 16px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.course-repeat-row:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
}

.course-row-number {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6600, #f45100);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 7px;
}

.course-repeat-field { min-width: 0; }

.course-repeat-field .course-label {
  margin-bottom: 6px;
  font-size: 12px;
}

.course-delete-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: 1px solid #fecaca;
  border-radius: 7px;
  background: #fff1f2;
  color: #dc2626;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.course-delete-btn:hover {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}

.course-file-input {
  width: 100%;
  height: 46px;
  border: 1px solid #dbe2ea;
  border-radius: 9px;
  padding: 0 8px;
  background: #fff;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
}

.course-file-input:focus {
  outline: none;
  border-color: #ff6600;
  box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.10);
}

.course-file-input::file-selector-button {
  height: 32px;
  margin-right: 8px;
  border: none;
  border-radius: 6px;
  padding: 0 10px;
  background: #fff1e8;
  color: #ff6600;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.selected-file {
  display: block;
  margin-top: 5px;
  color: #64748b;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* =========================================================
   STATUS
========================================================= */

.course-status-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 17px;
  border: 1px solid #e3e7eb;
  border-radius: 12px;
  background: #fbfcfd;
}

.course-status-info strong {
  display: block;
  margin-bottom: 3px;
  color: #303944;
  font-size: 14px;
}

.course-status-info small {
  color: #8b949e;
  font-size: 12px;
}

.course-switch {
  position: relative;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}

.course-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.course-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  border-radius: 30px;
  background: #cbd1d8;
  transition: .25s;
}

.course-slider::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  left: 3px;
  top: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0,0,0,.2);
  transition: .25s;
}

.course-switch input:checked + .course-slider {
  background: #ff6600;
}

.course-switch input:checked + .course-slider::before {
  transform: translateX(22px);
}

/* =========================================================
   ACTIONS
========================================================= */

.course-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 25px;
  margin-top: 5px;
  border-top: 1px solid #edf0f3;
}

.course-back-btn,
.course-submit-btn {
  min-height: 44px;
  padding: 0 23px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
  transition: all .2s ease;
}

.course-back-btn {
  border: 1px solid #dfe4e9;
  background: #fff;
  color: #4e5965;
}

.course-back-btn:hover {
  border-color: #ff6600;
  color: #ff6600;
  transform: translateY(-1px);
}

.course-submit-btn {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #ff6600, #f45100);
  box-shadow: 0 7px 18px rgba(255, 102, 0, .22);
}

.course-submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 102, 0, .28);
}

.course-submit-btn:disabled {
  opacity: .7;
  cursor: not-allowed;
  transform: none;
}

.course-submit-spinner {
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 8px;
  vertical-align: -3px;
  border: 2px solid rgba(255,255,255,.45);
  border-top-color: #fff;
  border-radius: 50%;
  animation: courseSpin .7s linear infinite;
}

/* =========================================================
   LOADING
========================================================= */

.course-loading-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff7f0 0%, #f7f9fc 55%, #fff 100%);
}

.course-loader-box {
  background: #fff;
  padding: 35px 45px;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(0,0,0,.08);
  text-align: center;
}

.course-spinner {
  width: 45px;
  height: 45px;
  border: 4px solid #ffe0cc;
  border-top-color: #ff6600;
  border-radius: 50%;
  animation: courseSpin .8s linear infinite;
  margin: auto auto 15px;
}

.course-loader-text {
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

@keyframes courseSpin {
  to { transform: rotate(360deg); }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .course-repeat-row { grid-template-columns: 35px 1fr 1fr; }
}

@media (max-width: 950px) {
  .course-form { padding: 23px; }
  .course-grid { grid-template-columns: 1fr; }
}

@media (max-width: 767px) {
  .course-repeat-row {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 18px 40px 15px 15px;
  }

  .course-row-number { margin-bottom: 0; }
  .course-repeat-field .course-label { font-size: 11px; }
}

@media (max-width: 650px) {
  .course-page { padding: 15px 10px 30px; }
  .course-header { padding: 20px; }
  .course-header-icon { width: 47px; height: 47px; min-width: 47px; font-size: 20px; }
  .course-header-content h2 { font-size: 19px; }
  .course-form { padding: 18px; }
  .course-actions { flex-direction: column-reverse; align-items: stretch; }
  .course-back-btn, .course-submit-btn { width: 100%; }
}

@media (max-width: 420px) {
  .course-header { gap: 12px; padding: 17px; }
  .course-header-icon { width: 42px; height: 42px; min-width: 42px; border-radius: 11px; }
  .course-header-content h2 { font-size: 17px; }
  .course-header-content p { font-size: 12px; }
  .course-form { padding: 15px; }
}
      `}</style>
    </div>
  );
}

export default CourseUpdate;