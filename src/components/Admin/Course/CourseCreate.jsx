import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCourse,
  getCourseCategory,
  getCourseType,
  getDuration,
  getDurationType,
  getParentCourse,
  translateToHindi,
} from "./CourseService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function CourseCreate() {
  const navigate = useNavigate();

  const [durations, setDurations] = useState([]);
  const [durationTypes, setDurationTypes] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [parentCourses, setParentCourses] = useState([]);
  const [amountTypes, setAmountTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    code: "",
    shortName: "",
    name: "",
    nameHindi: "",
    shortDescription: "",
    descrption: "",
    eligbilty: "",
    duration: 0,
    durationTypeId: 0,
    parentId: 0,
    categoryId: 0,
    departmentId: 0,
    totalClass: 0,
    classNo: 0,
    isActive: 1,
  });

  const [amounts, setAmounts] = useState([
    {
      amountTypeId: 0,
      name: "",
      amount: "",
    },
  ]);

  const [studyMaterials, setStudyMaterials] = useState([
    {
      materialTypeId: 0,
      name: "",
      file: null,
      altTag: "",
    },
  ]);

  useEffect(() => {
    loadCourseType();
    loadCourseCategory();
    loadDuration();
    loadDurationType();
    loadParentCourses();
    loadAmountTypes();
    loadMaterialTypes();
  }, []);

  const loadDuration = async () => {
    try {
      const result = await getDuration(11);
      setDurations(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDurationType = async () => {
    try {
      const result = await getDurationType(12);
      setDurationTypes(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCourseType = async () => {
    try {
      const result = await getCourseType(13);
      setCourseTypes(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCourseCategory = async () => {
    try {
      const result = await getCourseCategory(14);
      setCourseCategories(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadParentCourses = async () => {
    try {
      const result = await getParentCourse();
      setParentCourses(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAmountTypes = async () => {
    try {
      const result = await getCourseType(31);
      setAmountTypes(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMaterialTypes = async () => {
    try {
      const result = await getCourseType(34);
      setMaterialTypes(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "name" && value.trim() !== "") {
      try {
        const hindi = await translateToHindi(value);

        setFormData((prev) => ({
          ...prev,
          name: value,
          nameHindi: hindi,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSelectChange = (e, field) => {
    const value = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleMaterialChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Course Name is required";
    }

    if (!formData.duration || formData.duration === 0) {
      newErrors.duration = "Duration is required";
    }

    if (!formData.durationTypeId || formData.durationTypeId === 0) {
      newErrors.durationTypeId = "Duration Type is required";
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = "Course Category is required";
    }

    if (!formData.departmentId || formData.departmentId === 0) {
      newErrors.departmentId = "Course Type is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        ProductAmounts: amounts,
        ProductCategoryDocuments: studyMaterials,
      };

      console.log("COURSE SUBMIT DATA:", submitData);

      const result = await createCourse(submitData);

      if (result?.success) {
        alert(result.message);
        navigate("/course-list");
      } else {
        alert(result?.message || "Unable to create course.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const addAmount = () => {
    setAmounts((prev) => [
      ...prev,
      {
        amountTypeId: 0,
        name: "",
        amount: "",
      },
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
              field === "amountTypeId"
                ? Number(value)
                : value,
          }
          : item
      )
    );
  };

  const addStudyMaterial = () => {
    setStudyMaterials((prev) => [
      ...prev,
      {
        materialTypeId: 0,
        name: "",
        file: null,
        altTag: "",
      },
    ]);
  };

  const removeStudyMaterial = (index) => {
    setStudyMaterials((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleStudyMaterialChange = (
    index,
    field,
    value
  ) => {
    setStudyMaterials((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]: value,
          }
          : item
      )
    );
  };

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

  return (
    <>
      <style>{`
        .course-page-header {
          margin-bottom: 25px;
        }

        .course-page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .course-breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
        }

        .course-card {
          border: none;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(15, 23, 42, 0.08);
        }

        .course-card-header {
          padding: 22px 25px;
          background: linear-gradient(135deg, #4154f1, #6f42c1);
          color: white;
        }

        .course-card-header h5 {
          margin: 0;
          font-size: 19px;
          font-weight: 600;
        }

        .course-card-header p {
          margin: 5px 0 0;
          font-size: 13px;
          opacity: 0.85;
        }

        .course-card-body {
          padding: 30px;
        }

        .course-field {
          margin-bottom: 22px;
        }

        .course-label {
          display: block;
          margin-bottom: 8px;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
        }

        .course-label span {
          color: #ef4444;
          margin-left: 3px;
        }

        .course-input,
        .course-select {
          width: 100%;
          height: 46px;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          padding: 0 14px;
          background-color: #fff;
          color: #334155;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .course-input {
          cursor: text;
        }

        .course-select {
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 42px;
          background-image:
            linear-gradient(
              45deg,
              transparent 50%,
              #64748b 50%
            ),
            linear-gradient(
              135deg,
              #64748b 50%,
              transparent 50%
            );
          background-position:
            calc(100% - 18px) 19px,
            calc(100% - 13px) 19px;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }

        .course-input::placeholder {
          color: #94a3b8;
        }

        .course-input:focus,
        .course-select:focus {
          border-color: #4154f1;
          box-shadow: 0 0 0 3px rgba(65, 84, 241, 0.10);
        }

        .course-select:hover {
          border-color: #aab5c5;
        }

        .course-select option {
          color: #334155;
          background: white;
        }

        .course-error {
          display: block;
          margin-top: 6px;
          color: #dc2626;
          font-size: 12px;
          font-weight: 500;
        }

        .course-input-error,
        .course-select-error {
          border-color: #ef4444 !important;
          background-color: #fffafa;
        }

        .course-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 5px 0 25px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .course-section-title::before {
          content: "";
          width: 4px;
          height: 22px;
          border-radius: 5px;
          background: linear-gradient(
            180deg,
            #4154f1,
            #6f42c1
          );
        }

        .course-section-title h6 {
          margin: 0;
          color: #1e293b;
          font-size: 16px;
          font-weight: 700;
        }

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
          background: linear-gradient(
            135deg,
            #4154f1,
            #6f42c1
          );
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(65, 84, 241, 0.18);
          transition: all 0.2s ease;
        }

        .course-add-more-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(65, 84, 241, 0.25);
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
          grid-template-columns:
            35px
            1fr
            1fr
            1fr
            35px;
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
          box-shadow:
            0 4px 15px
            rgba(15, 23, 42, 0.05);
        }

        .course-row-number {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(
            135deg,
            #4154f1,
            #6f42c1
          );
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .course-repeat-field {
          min-width: 0;
        }

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
          border-color: #4154f1;
          box-shadow:
            0 0 0 3px
            rgba(65, 84, 241, 0.10);
        }

        .course-file-input::file-selector-button {
          height: 32px;
          margin-right: 8px;
          border: none;
          border-radius: 6px;
          padding: 0 10px;
          background: #eef2ff;
          color: #4154f1;
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

        .course-switch-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          margin-top: 5px;
        }

        .course-switch-label {
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .course-switch {
          width: 48px !important;
          height: 24px !important;
          cursor: pointer;
        }

        .course-submit-area {
          margin-top: 10px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
          text-align: right;
        }

        .course-submit-btn {
          min-width: 150px;
          height: 45px;
          border: none;
          border-radius: 9px;
          background: linear-gradient(
            135deg,
            #4154f1,
            #6f42c1
          );
          color: white;
          font-size: 14px;
          font-weight: 600;
          padding: 0 25px;
          box-shadow:
            0 5px 12px
            rgba(65, 84, 241, 0.20);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .course-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 7px 16px
            rgba(65, 84, 241, 0.28);
        }

        @media (max-width: 1100px) {
          .course-repeat-row {
            grid-template-columns:
              35px
              1fr
              1fr;
          }
        }

        @media (max-width: 767px) {
          .course-card-body {
            padding: 20px 15px;
          }

          .course-page-header h1 {
            font-size: 24px;
          }

          .course-section-with-action {
            align-items: flex-start;
            gap: 12px;
          }

          .course-add-more-btn {
            height: 35px;
            padding: 0 12px;
            font-size: 11px;
          }

          .course-repeat-row {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 18px 40px 15px 15px;
          }

          .course-row-number {
            margin-bottom: 0;
          }

          .course-repeat-field .course-label {
            font-size: 11px;
          }

          .course-submit-area {
            text-align: center;
          }

          .course-submit-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="course-page-header">
        <h1>Course</h1>

        <nav>
          <ol className="breadcrumb course-breadcrumb">
            <li className="breadcrumb-item">
              <a href="/dashboard">Dashboard</a>
            </li>

            <li className="breadcrumb-item">
              Course Detail
            </li>

            <li className="breadcrumb-item active">
              Course Add
            </li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card course-card">
              <div className="course-card-header">
                <h5>Course Details</h5>
                <p>
                  Add and manage course information
                </p>
              </div>

              <div className="course-card-body">
                <form onSubmit={handleSubmit}>
                  <div className="course-section-title">
                    <h6>Basic Course Information</h6>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Course Type<span>*</span>
                        </label>

                        <select
                          className={`course-select ${errors.departmentId
                              ? "course-select-error"
                              : ""
                            }`}
                          value={formData.departmentId}
                          onChange={(e) =>
                            handleSelectChange(
                              e,
                              "departmentId"
                            )
                          }
                        >
                          <option value={0}>
                            Select Course Type
                          </option>

                          {courseTypes.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>

                        {errors.departmentId && (
                          <span className="course-error">
                            {errors.departmentId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Course Category<span>*</span>
                        </label>

                        <select
                          className={`course-select ${errors.categoryId
                              ? "course-select-error"
                              : ""
                            }`}
                          value={formData.categoryId}
                          onChange={(e) =>
                            handleSelectChange(
                              e,
                              "categoryId"
                            )
                          }
                        >
                          <option value={0}>
                            Select Course Category
                          </option>

                          {courseCategories.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>

                        {errors.categoryId && (
                          <span className="course-error">
                            {errors.categoryId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Parent Course
                        </label>

                        <select
                          className="course-select"
                          value={formData.parentId}
                          onChange={(e) =>
                            handleSelectChange(
                              e,
                              "parentId"
                            )
                          }
                        >
                          <option value={0}>
                            Select Parent Course
                          </option>

                          {parentCourses.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Course / Class Code
                        </label>

                        <input
                          type="text"
                          name="code"
                          className="course-input"
                          placeholder="Enter course code"
                          value={formData.code}
                          onChange={handleChange}
                        />

                        {errors.code && (
                          <span className="course-error">
                            {errors.code}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Course / Class Name<span>*</span>
                        </label>

                        <input
                          type="text"
                          name="name"
                          className={`course-input ${errors.name
                              ? "course-input-error"
                              : ""
                            }`}
                          placeholder="Enter course name"
                          value={formData.name}
                          onChange={handleChange}
                        />

                        {errors.name && (
                          <span className="course-error">
                            {errors.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Course / Class Name (Hindi)
                        </label>

                        <input
                          type="text"
                          name="nameHindi"
                          className="course-input"
                          placeholder="हिंदी में कोर्स का नाम"
                          value={formData.nameHindi}
                          onChange={handleChange}
                        />

                        {errors.nameHindi && (
                          <span className="course-error">
                            {errors.nameHindi}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Duration<span>*</span>
                        </label>

                        <select
                          className={`course-select ${errors.duration
                              ? "course-select-error"
                              : ""
                            }`}
                          value={formData.duration}
                          onChange={(e) =>
                            handleSelectChange(
                              e,
                              "duration"
                            )
                          }
                        >
                          <option value={0}>
                            Select Duration
                          </option>

                          {durations.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>

                        {errors.duration && (
                          <span className="course-error">
                            {errors.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Duration Type<span>*</span>
                        </label>

                        <select
                          className={`course-select ${errors.durationTypeId
                              ? "course-select-error"
                              : ""
                            }`}
                          value={formData.durationTypeId}
                          onChange={(e) =>
                            handleSelectChange(
                              e,
                              "durationTypeId"
                            )
                          }
                        >
                          <option value={0}>
                            Select Duration Type
                          </option>

                          {durationTypes.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>

                        {errors.durationTypeId && (
                          <span className="course-error">
                            {errors.durationTypeId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Total Class
                        </label>

                        <select
                          className="course-select"
                          value={formData.totalClass}
                          onChange={(e) =>
                            handleSelectChange(
                              e,
                              "totalClass"
                            )
                          }
                        >
                          <option value={0}>
                            Select Total Class
                          </option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                        </select>
                      </div>
                    </div>

                 

                    <div className="col-md-4">
                      <div className="course-field">
                        <label className="course-label">
                          Eligbilty<span>*</span>
                        </label>

                        <input
                          type="text"
                          name="eligbilty"
                          className="course-input"
                          placeholder="Eligbilty"
                          value={formData.eligbilty}
                          onChange={handleChange}
                        />

                        {errors.eligbilty && (
                          <span className="course-error">
                            {errors.eligbilty}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="course-field">
                        <label className="course-label">
                          Short Description
                        </label>

                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
                          data={
                            formData.shortDescription || ""
                          }
                          onChange={(event, editor) =>
                            handleMaterialChange(
                              "shortDescription",
                              editor.getData()
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="course-field">
                        <label className="course-label">
                          Description
                        </label>

                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
                          data={formData.descrption || ""}
                          onChange={(event, editor) =>
                            handleMaterialChange(
                              "descrption",
                              editor.getData()
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="course-section-title course-section-with-action">
                    <div>
                      <h6>Course Amount</h6>
                      <p>
                        Add different amounts for this
                        course
                      </p>
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
                      <div
                        className="course-repeat-row"
                        key={index}
                      >
                        <div className="course-row-number">
                          {index + 1}
                        </div>

                        <div className="course-repeat-field">
                          <label className="course-label">
                            Amount Type
                          </label>

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
                            <option value={0}>
                              Select Amount Type
                            </option>

                            {amountTypes.map((type) => (
                              <option
                                key={type.id}
                                value={type.id}
                              >
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="course-repeat-field">
                          <label className="course-label">
                            Name
                          </label>

                          <input
                            type="text"
                            className="course-input"
                            placeholder="Enter amount name"
                            value={item.name}
                            onChange={(e) =>
                              handleAmountChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="course-repeat-field">
                          <label className="course-label">
                            Amount
                          </label>

                          <input
                            type="number"
                            className="course-input"
                            placeholder="Enter amount"
                            value={item.amount}
                            onChange={(e) =>
                              handleAmountChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {amounts.length > 1 && (
                          <button
                            type="button"
                            className="course-delete-btn"
                            onClick={() =>
                              removeAmount(index)
                            }
                            title="Remove"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="course-section-title course-section-with-action">
                    <div>
                      <h6>Study Material</h6>
                      <p>
                        Add course study materials and
                        files
                      </p>
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
                      <div
                        className="course-repeat-row material-row"
                        key={index}
                      >
                        <div className="course-row-number">
                          {index + 1}
                        </div>

                        <div className="course-repeat-field">
                          <label className="course-label">
                            Material Type
                          </label>

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
                            <option value={0}>
                              Select Material Type
                            </option>

                            {materialTypes.map((type) => (
                              <option
                                key={type.id}
                                value={type.id}
                              >
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="course-repeat-field">
                          <label className="course-label">
                            Name
                          </label>

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
                          <label className="course-label">
                            File
                          </label>

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
                        </div>

                        <div className="course-repeat-field">
                          <label className="course-label">
                            Alt Tag
                          </label>

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
                            onClick={() =>
                              removeStudyMaterial(index)
                            }
                            title="Remove"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="course-section-title">
                    <h6>Course Status</h6>
                  </div>

                  <div className="course-switch-box">
                    <label className="course-switch-label">
                      Course Active Status
                    </label>

                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input course-switch"
                        type="checkbox"
                        checked={formData.isActive === 1}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked
                              ? 1
                              : 0,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="course-submit-area">
                    <button
                      type="submit"
                      className="course-submit-btn"
                    >
                      Submit Course
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CourseCreate;