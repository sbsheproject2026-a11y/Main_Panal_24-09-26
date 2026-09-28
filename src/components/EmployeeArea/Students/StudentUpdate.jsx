 
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCity,
  getCourse,
  getCourseCategory,
  getDistrict,
  getMasterSession,
  getState,
  getStudentAcademicDetails,
  getStudentById,
  getStudentData,
  translateToHindi,
  updateStudent
} from "../../AllServicesFiles/StudentService";
import { FILE_URL } from "../../api";

function StudentUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [citys, setCitys] = useState([]);
  const [errors, setErrors] = useState({});
  const [genders, setGenders] = useState([]);
  const [casteCategory, setCasteCategory] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [course, setCourse] = useState([]);
  const [masterSession, setMasterSession] = useState([]);
  const [academicDetails, setAcademicDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: 0,
    dateOfBirth: "",
    code: "",
    name: "",
    studentNameHindi: "",
    fatherName: "",
    fatherNameHindi: "",
    motherName: "",
    mobileNo: "",
    whatsAppNo: "",
    email: "",
    idNumber: "",
    selfImage1: null,
    signatureImage1: null,
    aadhaarCardFrant1: null,
    aadhaarCardBack1: null,
    casteCategoryId: null,
    courseTypeId: 0,
    courseCategoryId: 0,
    courseId: 0,
    examSessionId: 0,
    genderId: null,
    stateId: 0,
    districtId: 0,
    locationId: 0,
    address: "",
    pincode: "",
    selfImage: "",
    signatureImage: "",
    aadhaarCardFront: "",
    aadhaarCardBack: "",
    selfImageShow: "",
    signatureImageShow: "",
    aadhaarCardFrantShow: "",
    aadhaarCardBackShow: "",
    isActive: 1
  });

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadState(),
        loadGender(),
        loadCasteCategory(),
        loadCourseType(),
        loadMasterSession()
      ]);

      if (id) {
        await handleEdit(id);
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseType = async () => {
    try {
      const result = await getStudentData(13);
      setCourseTypes(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadGender = async () => {
    try {
      const result = await getStudentData(17);
      setGenders(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCasteCategory = async () => {
    try {
      const result = await getStudentData(21);
      setCasteCategory(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMasterSession = async () => {
    try {
      const result = await getMasterSession();
      setMasterSession(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadState = async () => {
    try {
      const result = await getState();
      setStates(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDistrict = async (stateId) => {
    try {
      const result = await getDistrict(stateId);
      setDistricts(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCity = async (districtId) => {
    try {
      const result = await getCity(districtId);
      setCitys(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCourseCategory = async (courseTypeId) => {
    try {
      const result = await getCourseCategory(courseTypeId);
      setCourseCategories(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCourse = async (courseCategoryId) => {
    try {
      const result = await getCourse(courseCategoryId);
      setCourse(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAcademicDetails = async (studentId) => {
    try {
      const result = await getStudentAcademicDetails(studentId);
      const data = result.data || result;
      setAcademicDetails(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setAcademicDetails([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;

      setFormData((prev) => ({
        ...prev,
        [name]: file
      }));

      if (file) {
        const preview = URL.createObjectURL(file);

        if (name === "selfImage1") {
          setFormData((prev) => ({
            ...prev,
            selfImage1: file,
            selfImageShow: preview
          }));
        }

        if (name === "signatureImage1") {
          setFormData((prev) => ({
            ...prev,
            signatureImage1: file,
            signatureImageShow: preview
          }));
        }

        if (name === "aadhaarCardFrant1") {
          setFormData((prev) => ({
            ...prev,
            aadhaarCardFrant1: file,
            aadhaarCardFrantShow: preview
          }));
        }

        if (name === "aadhaarCardBack1") {
          setFormData((prev) => ({
            ...prev,
            aadhaarCardBack1: file,
            aadhaarCardBackShow: preview
          }));
        }
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "name" && value.trim() !== "") {
      try {
        const hindi = await translateToHindi(value);
        setFormData((prev) => ({
          ...prev,
          name: value,
          studentNameHindi: hindi
        }));
      } catch (err) {
        console.log(err);
      }
    }

    if (name === "fatherName" && value.trim() !== "") {
      try {
        const hindi = await translateToHindi(value);
        setFormData((prev) => ({
          ...prev,
          fatherName: value,
          fatherNameHindi: hindi
        }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = async (studentId) => {
    try {
      const [studentResult] = await Promise.all([
        getStudentById(studentId),
        loadAcademicDetails(studentId)
      ]);

      const result = studentResult.data || studentResult;
 
      setFormData({
        id: result.id,
        examSessionId: result.examSessionId ?? 0,
        code: result.code ?? "",
        name: result.name ?? "",
        studentNameHindi: result.studentNameHindi ?? "",
        fatherNameHindi: result.fatherNameHindi ?? "",
        fatherName: result.fatherName ?? "",
        motherName: result.motherName ?? "",
        locationId: result.locationId ?? 0,
        districtId: result.districtId ?? 0,
        genderId: result.genderId ?? 0,
        courseTypeId: result.courseTypeId ?? 0,
        courseCategoryId: result.courseCategoryId ?? 0,
        courseId: result.courseId ?? 0,
        casteCategoryId: result.casteCategoryId ?? 0,
        stateId: result.stateId ?? 0,
        dateOfBirth: result.doB1 ?? "",
        address: result.address ?? "",
        pincode: result.pincode ?? "",
        mobileNo: result.mobileNo ?? "",
        selfImage: result.selfImage ?? "",
        signatureImage: result.signatureImage ?? "",
        aadhaarCardFront: result.aadhaarCardFrant ?? "",
        aadhaarCardBack: result.aadhaarCardBack ?? "",
        selfImageShow: result.selfImageShow ?? "",
        signatureImageShow: result.signatureImageShow ?? "",
        aadhaarCardFrantShow: result.aadhaarCardFrantShow ?? "",
        aadhaarCardBackShow: result.aadhaarCardBackShow ?? "",
        idNumber: result.idNumber ?? "",
        whatsAppNo: result.whatsAppNo ?? "",
        email: result.email ?? "",
        isActive: result.isActive ?? 1
      });

      if (result.stateId > 0) {
        await loadDistrict(result.stateId);
      }

      if (result.districtId > 0) {
        await loadCity(result.districtId);
      }

      if (result.courseTypeId > 0) {
        await loadCourseCategory(result.courseTypeId);
      }

      if (result.courseCategoryId > 0) {
        await loadCourse(result.courseCategoryId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father Name is required";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile No is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Id is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.courseTypeId) {
      newErrors.courseTypeId = "Programme is required";
    }

    if (!formData.courseCategoryId) {
      newErrors.courseCategoryId = "Course Category is required";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Course is required";
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
      const result = await updateStudent(formData);
      alert(result.message);
      navigate("/student-list");
    } catch (error) {
      console.log(error);
    }
  };

  const getName = (list, value) => {
    const item = list?.find((x) => Number(x.id) === Number(value));
    return item?.name || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const value = (data) => {
    return data !== null &&
      data !== undefined &&
      String(data).trim() !== ""
      ? data
      : "-";
  };

  if (loading) {
    return (
      <>
        <style>{`
          .student-loading-page{
            min-height:100vh;
            background:#f6f8fb;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
            gap:12px;
          }
          .student-loader{
            width:42px;
            height:42px;
            border:4px solid #e8ebf5;
            border-top-color:#4154f1;
            border-radius:50%;
            animation:studentSpin .8s linear infinite;
          }
          .student-loading-text{
            color:#667085;
            font-size:14px;
            font-weight:500;
          }
          @keyframes studentSpin{
            to{transform:rotate(360deg)}
          }
        `}</style>
        <div className="student-loading-page">
          <div className="student-loader"></div>
          <div className="student-loading-text">Loading student details...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .student-update-page{
          background:#f6f8fb;
          min-height:100vh;
          padding:24px;
        }
        .student-page-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:22px;
          gap:15px;
        }
        .student-header-left{
          display:flex;
          align-items:center;
          gap:14px;
        }
        .student-title-icon{
          width:48px;
          height:48px;
          border-radius:12px;
          background:#4154f1;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:22px;
          box-shadow:0 5px 14px rgba(65,84,241,.22);
        }
        .student-page-title{
          margin:0;
          color:#263238;
          font-size:24px;
          font-weight:700;
        }
        .student-breadcrumb{
          display:flex;
          align-items:center;
          gap:7px;
          margin-top:5px;
          font-size:13px;
          color:#8993a4;
        }
        .student-breadcrumb a{
          color:#4154f1;
          text-decoration:none;
        }
        .student-back-btn{
          border:1px solid #dfe3eb;
          background:#fff;
          color:#4154f1;
          padding:10px 17px;
          border-radius:8px;
          font-size:14px;
          font-weight:600;
          display:flex;
          align-items:center;
          gap:7px;
          cursor:pointer;
          transition:.2s;
        }
        .student-back-btn:hover{
          background:#4154f1;
          color:#fff;
          border-color:#4154f1;
        }
        .student-profile-card{
          background:#fff;
          border:1px solid #edf0f5;
          border-radius:14px;
          overflow:hidden;
          box-shadow:0 4px 20px rgba(31,45,61,.07);
          margin-bottom:20px;
        }
        .student-profile-cover{
          height:125px;
          background:linear-gradient(135deg,#4154f1,#6575f4);
          position:relative;
        }
        .student-profile-body{
          padding:0 25px 22px;
          display:flex;
          align-items:flex-end;
          gap:18px;
          margin-top:-48px;
          position:relative;
        }
        .student-profile-image{
          width:96px;
          height:96px;
          border-radius:14px;
          border:5px solid #fff;
          background:#eef0ff;
          overflow:hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#4154f1;
          font-size:35px;
          box-shadow:0 5px 15px rgba(31,45,61,.12);
          flex-shrink:0;
        }
        .student-profile-image img{
          width:100%;
          height:100%;
          object-fit:cover;
        }
        .student-profile-info{
          padding-bottom:5px;
          min-width:0;
        }
        .student-profile-name{
          margin:0;
          font-size:22px;
          font-weight:700;
          color:#263238;
        }
        .student-profile-meta{
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          gap:8px;
          margin-top:7px;
          color:#7c8798;
          font-size:13px;
        }
        .student-active-badge{
          background:#e8f8ef;
          color:#198754;
          padding:5px 10px;
          border-radius:20px;
          font-size:11px;
          font-weight:700;
        }
        .student-inactive-badge{
          background:#fdebec;
          color:#dc3545;
          padding:5px 10px;
          border-radius:20px;
          font-size:11px;
          font-weight:700;
        }
        .student-profile-edit{
          margin-left:auto;
          align-self:center;
          border:1px solid #dfe3eb;
          background:#fff;
          color:#4154f1;
          border-radius:8px;
          padding:9px 15px;
          font-size:13px;
          font-weight:600;
          display:flex;
          align-items:center;
          gap:7px;
        }
        .student-form-card{
          background:#fff;
          border-radius:14px;
          border:1px solid #edf0f5;
          box-shadow:0 4px 20px rgba(31,45,61,.07);
          overflow:hidden;
        }
        .student-card-top{
          padding:20px 24px;
          border-bottom:1px solid #edf0f5;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:15px;
        }
        .student-card-heading{
          display:flex;
          align-items:center;
          gap:11px;
        }
        .student-card-heading-icon{
          width:38px;
          height:38px;
          background:#eef0ff;
          color:#4154f1;
          border-radius:9px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:18px;
        }
        .student-card-title{
          margin:0;
          font-size:18px;
          color:#263238;
          font-weight:700;
        }
        .student-card-subtitle{
          margin:3px 0 0;
          color:#8b95a5;
          font-size:13px;
        }
        .student-status-badge{
          background:#eef0ff;
          color:#4154f1;
          padding:7px 12px;
          border-radius:20px;
          font-size:12px;
          font-weight:600;
        }
        .student-form-body{
          padding:24px;
        }
        .student-form-section{
          border:1px solid #edf0f5;
          border-radius:12px;
          margin-bottom:20px;
          overflow:hidden;
        }
        .student-form-section:last-child{
          margin-bottom:0;
        }
        .student-section-header{
          background:#f8f9ff;
          border-bottom:1px solid #edf0f5;
          padding:14px 17px;
          display:flex;
          align-items:center;
          gap:10px;
        }
        .student-section-icon{
          width:32px;
          height:32px;
          border-radius:8px;
          background:#4154f1;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:15px;
        }
        .student-section-title{
          margin:0;
          font-size:15px;
          color:#303b4d;
          font-weight:700;
        }
        .student-section-subtitle{
          margin:2px 0 0;
          color:#98a2b3;
          font-size:11px;
        }
        .student-section-content{
          padding:20px 18px 6px;
        }
        .student-field{
          margin-bottom:17px;
        }
        .student-field label{
          display:block;
          margin-bottom:7px;
          color:#465266;
          font-size:13px;
          font-weight:600;
        }
        .student-required{
          color:#e74c3c;
        }
        .student-input,
        .student-select{
          width:100%;
          height:43px;
          border:1px solid #dfe4ec;
          border-radius:7px;
          padding:0 12px;
          background:#fff;
          color:#344054;
          font-size:13px;
          outline:none;
          transition:.2s;
        }
        .student-input:focus,
        .student-select:focus{
          border-color:#4154f1;
          box-shadow:0 0 0 3px rgba(65,84,241,.08);
        }
        textarea.student-input{
          height:92px;
          padding-top:11px;
          resize:vertical;
        }
        .student-invalid{
          border-color:#dc3545!important;
        }
        .student-error{
          color:#dc3545;
          font-size:11px;
          margin-top:5px;
          display:block;
        }
        .student-file-card{
          border:1px dashed #cfd5df;
          border-radius:10px;
          padding:15px;
          background:#fafbfc;
          min-height:220px;
          display:flex;
          flex-direction:column;
          transition:.2s;
        }
        .student-file-card:hover{
          border-color:#4154f1;
          background:#f9faff;
        }
        .student-file-title{
          display:flex;
          align-items:center;
          gap:8px;
          color:#465266;
          font-size:13px;
          font-weight:600;
          margin-bottom:12px;
        }
        .student-file-title i{
          color:#4154f1;
          font-size:17px;
        }
        .student-file-input{
          width:100%;
          font-size:11px;
          color:#667085;
          margin-bottom:12px;
        }
        .student-preview-box{
          flex:1;
          min-height:125px;
          border-radius:8px;
          background:#f1f3f7;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }
        .student-preview-box img{
          max-width:100%;
          max-height:125px;
          object-fit:contain;
        }
        .student-preview-empty{
          color:#a1aab8;
          font-size:12px;
          text-align:center;
        }
        .student-academic-wrapper{
          overflow-x:auto;
          width:100%;
        }
        .student-academic-table{
          width:100%;
          min-width:760px;
          border-collapse:separate;
          border-spacing:0;
          font-size:13px;
        }
        .student-academic-table th{
          background:#f8f9ff;
          color:#465266;
          font-weight:700;
          padding:13px 12px;
          border-bottom:1px solid #e8ebf2;
          white-space:nowrap;
        }
        .student-academic-table td{
          padding:13px 12px;
          color:#667085;
          border-bottom:1px solid #edf0f5;
          vertical-align:middle;
        }
        .student-academic-table tr:last-child td{
          border-bottom:none;
        }
        .student-academic-number{
          width:40px;
          height:28px;
          border-radius:6px;
          background:#eef0ff;
          color:#4154f1;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          font-size:11px;
          font-weight:700;
        }
        .student-document-btn{
          border:1px solid #dfe3eb;
          background:#fff;
          color:#4154f1;
          border-radius:6px;
          padding:6px 10px;
          font-size:11px;
          font-weight:600;
          text-decoration:none;
          display:inline-flex;
          align-items:center;
          gap:5px;
        }
        .student-document-btn:hover{
          background:#4154f1;
          color:#fff;
          border-color:#4154f1;
        }
        .student-no-document{
          color:#98a2b3;
          font-size:11px;
        }
        .student-empty-academic{
          text-align:center;
          padding:28px 10px;
          color:#98a2b3;
          font-size:13px;
        }
        .student-form-footer{
          border-top:1px solid #edf0f5;
          background:#fafbfc;
          padding:17px 24px;
          display:flex;
          justify-content:flex-end;
          gap:10px;
        }
        .student-cancel-btn,
        .student-update-btn{
          border-radius:7px;
          height:42px;
          padding:0 20px;
          font-size:13px;
          font-weight:600;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:7px;
          transition:.2s;
        }
        .student-cancel-btn{
          background:#fff;
          color:#5d6878;
          border:1px solid #dfe4ec;
        }
        .student-cancel-btn:hover{
          background:#f1f3f6;
        }
        .student-update-btn{
          background:#4154f1;
          color:#fff;
          border:1px solid #4154f1;
          box-shadow:0 4px 10px rgba(65,84,241,.2);
        }
        .student-update-btn:hover{
          background:#3043dc;
          transform:translateY(-1px);
        }
        @media(max-width:768px){
          .student-update-page{
            padding:15px;
          }
          .student-page-header{
            align-items:flex-start;
          }
          .student-page-title{
            font-size:20px;
          }
          .student-title-icon{
            width:42px;
            height:42px;
          }
          .student-back-btn{
            padding:9px 12px;
          }
          .student-profile-body{
            padding:0 16px 18px;
            gap:12px;
          }
          .student-profile-image{
            width:78px;
            height:78px;
          }
          .student-profile-name{
            font-size:18px;
          }
          .student-profile-edit{
            display:none;
          }
          .student-card-top{
            padding:16px;
          }
          .student-form-body{
            padding:15px;
          }
          .student-section-content{
            padding:17px 12px 3px;
          }
          .student-form-footer{
            padding:15px;
          }
          .student-cancel-btn,
          .student-update-btn{
            flex:1;
            justify-content:center;
          }
        }
        @media(max-width:480px){
          .student-page-header{
            flex-direction:column;
          }
          .student-back-btn{
            width:100%;
            justify-content:center;
          }
          .student-profile-cover{
            height:100px;
          }
          .student-profile-body{
            align-items:flex-start;
            flex-direction:column;
            margin-top:-42px;
          }
          .student-profile-image{
            width:84px;
            height:84px;
          }
          .student-card-top{
            align-items:flex-start;
          }
          .student-status-badge{
            display:none;
          }
          .student-form-footer{
            flex-direction:column;
          }
          .student-cancel-btn,
          .student-update-btn{
            width:100%;
          }
        }
      `}</style>

      <div className="student-update-page">
        <div className="student-page-header">
          <div className="student-header-left">
            <div className="student-title-icon">
              <i className="bi bi-person-vcard"></i>
            </div>
            <div>
              <h1 className="student-page-title">Update Student</h1>
              <div className="student-breadcrumb">
                <a href="/dashboard">Dashboard</a>
                <i className="bi bi-chevron-right"></i>
                <span>Student</span>
                <i className="bi bi-chevron-right"></i>
                <span>Update</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="student-back-btn"
            onClick={() => navigate("/student-list")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Students
          </button>
        </div>

        <div className="student-profile-card">
          <div className="student-profile-cover"></div>

          <div className="student-profile-body">
            <div className="student-profile-image">
              {formData.selfImageShow ? (
                <img   src={`${FILE_URL}${formData.selfImageShow}`} alt="Student" />
              ) : (
                <i className="bi bi-person"></i>
              )}
            </div>

            <div className="student-profile-info">
              <h2 className="student-profile-name">
                {value(formData.name)}
              </h2>

              <div className="student-profile-meta">
                {formData.isActive ? (
                  <span className="student-active-badge">
                    <i className="bi bi-check-circle me-1"></i>
                    Active
                  </span>
                ) : (
                  <span className="student-inactive-badge">
                    <i className="bi bi-x-circle me-1"></i>
                    Inactive
                  </span>
                )}

                <span>
                  <i className="bi bi-person-badge me-1"></i>
                  {value(formData.code)}
                </span>

                <span>
                  <i className="bi bi-translate me-1"></i>
                  {value(formData.studentNameHindi)}
                </span>

                <span>
                  <i className="bi bi-mortarboard me-1"></i>
                  Student
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="student-form-card">
          <div className="student-card-top">
            <div className="student-card-heading">
              <div className="student-card-heading-icon">
                <i className="bi bi-pencil-square"></i>
              </div>
              <div>
                <h2 className="student-card-title">Student Details</h2>
                <p className="student-card-subtitle">
                  Update student information and documents
                </p>
              </div>
            </div>

            <span className="student-status-badge">
              <i className="bi bi-pencil me-1"></i>
              Edit Mode
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="student-form-body">
              <div className="student-form-section">
                <div className="student-section-header">
                  <div className="student-section-icon">
                    <i className="bi bi-book"></i>
                  </div>
                  <div>
                    <h3 className="student-section-title">Course Details</h3>
                    <div className="student-section-subtitle">
                      Programme and course information
                    </div>
                  </div>
                </div>

                <div className="student-section-content">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Programme <span className="student-required">*</span>
                        </label>
                        <select
                          name="courseTypeId"
                          className={`student-select ${errors.courseTypeId ? "student-invalid" : ""}`}
                          value={formData.courseTypeId ?? 0}
                          onChange={async (e) => {
                            const value = e.target.value;

                            setFormData((prev) => ({
                              ...prev,
                              courseTypeId: value,
                              courseCategoryId: 0,
                              courseId: 0
                            }));

                            if (value > 0) {
                              await loadCourseCategory(value);
                            } else {
                              setCourseCategories([]);
                              setCourse([]);
                            }
                          }}
                        >
                          <option value="0">Select Programme</option>
                          {courseTypes?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.courseTypeId && (
                          <span className="student-error">
                            {errors.courseTypeId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Course Category{" "}
                          <span className="student-required">*</span>
                        </label>
                        <select
                          name="courseCategoryId"
                          className={`student-select ${errors.courseCategoryId ? "student-invalid" : ""}`}
                          value={formData.courseCategoryId ?? 0}
                          onChange={async (e) => {
                            const value = e.target.value;

                            setFormData((prev) => ({
                              ...prev,
                              courseCategoryId: value,
                              courseId: 0
                            }));

                            if (value > 0) {
                              await loadCourse(value);
                            } else {
                              setCourse([]);
                            }
                          }}
                        >
                          <option value="0">Select Course Category</option>
                          {courseCategories?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.courseCategoryId && (
                          <span className="student-error">
                            {errors.courseCategoryId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Course <span className="student-required">*</span>
                        </label>
                        <select
                          name="courseId"
                          className={`student-select ${errors.courseId ? "student-invalid" : ""}`}
                          value={formData.courseId ?? 0}
                          onChange={handleChange}
                        >
                          <option value="0">Select Course</option>
                          {course?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.courseId && (
                          <span className="student-error">
                            {errors.courseId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Exam Session
                        </label>
                        <select
                          name="examSessionId"
                          className="student-select"
                          value={formData.examSessionId ?? 0}
                          onChange={handleChange}
                        >
                          <option value="0">Select Session</option>
                          {masterSession?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Student Code</label>
                        <input
                          type="text"
                          className="student-input"
                          value={formData.code ?? ""}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-form-section">
                <div className="student-section-header">
                  <div className="student-section-icon">
                    <i className="bi bi-person"></i>
                  </div>
                  <div>
                    <h3 className="student-section-title">Personal Details</h3>
                    <div className="student-section-subtitle">
                      Student personal and identification information
                    </div>
                  </div>
                </div>

                <div className="student-section-content">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Full Name <span className="student-required">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className={`student-input ${errors.name ? "student-invalid" : ""}`}
                          value={formData.name ?? ""}
                          onChange={handleChange}
                          placeholder="Enter student name"
                        />
                        {errors.name && (
                          <span className="student-error">{errors.name}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Name in Hindi</label>
                        <input
                          type="text"
                          name="studentNameHindi"
                          className="student-input"
                          value={formData.studentNameHindi ?? ""}
                          onChange={handleChange}
                          placeholder="नाम"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="student-input"
                          value={formData.dateOfBirth ?? ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Father Name <span className="student-required">*</span>
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          className={`student-input ${errors.fatherName ? "student-invalid" : ""}`}
                          value={formData.fatherName ?? ""}
                          onChange={handleChange}
                          placeholder="Enter father name"
                        />
                        {errors.fatherName && (
                          <span className="student-error">
                            {errors.fatherName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Father Name in Hindi</label>
                        <input
                          type="text"
                          name="fatherNameHindi"
                          className="student-input"
                          value={formData.fatherNameHindi ?? ""}
                          onChange={handleChange}
                          placeholder="पिता का नाम"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Mother Name</label>
                        <input
                          type="text"
                          name="motherName"
                          className="student-input"
                          value={formData.motherName ?? ""}
                          onChange={handleChange}
                          placeholder="Enter mother name"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Aadhaar Number</label>
                        <input
                          type="text"
                          name="idNumber"
                          maxLength="12"
                          className="student-input"
                          value={formData.idNumber ?? ""}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              handleChange(e);
                            }
                          }}
                          placeholder="Enter Aadhaar number"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Gender</label>
                        <select
                          name="genderId"
                          className="student-select"
                          value={formData.genderId ?? 0}
                          onChange={handleChange}
                        >
                          <option value="0">Select Gender</option>
                          {genders?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>Caste Category</label>
                        <select
                          name="casteCategoryId"
                          className="student-select"
                          value={formData.casteCategoryId ?? 0}
                          onChange={handleChange}
                        >
                          <option value="0">Select Category</option>
                          {casteCategory?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-form-section">
                <div className="student-section-header">
                  <div className="student-section-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div>
                    <h3 className="student-section-title">Contact Details</h3>
                    <div className="student-section-subtitle">
                      Student contact information
                    </div>
                  </div>
                </div>

                <div className="student-section-content">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Mobile No <span className="student-required">*</span>
                        </label>
                        <input
                          type="text"
                          name="mobileNo"
                          maxLength="10"
                          className={`student-input ${errors.mobileNo ? "student-invalid" : ""}`}
                          value={formData.mobileNo ?? ""}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              handleChange(e);
                            }
                          }}
                          placeholder="Enter mobile number"
                        />
                        {errors.mobileNo && (
                          <span className="student-error">
                            {errors.mobileNo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>WhatsApp No</label>
                        <input
                          type="text"
                          name="whatsAppNo"
                          maxLength="10"
                          className="student-input"
                          value={formData.whatsAppNo ?? ""}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              handleChange(e);
                            }
                          }}
                          placeholder="Enter WhatsApp number"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>
                          Email ID <span className="student-required">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className={`student-input ${errors.email ? "student-invalid" : ""}`}
                          value={formData.email ?? ""}
                          onChange={handleChange}
                          placeholder="Enter email address"
                        />
                        {errors.email && (
                          <span className="student-error">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student-form-section">
                <div className="student-section-header">
                  <div className="student-section-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <h3 className="student-section-title">Address Details</h3>
                    <div className="student-section-subtitle">
                      Residential address information
                    </div>
                  </div>
                </div>

                <div className="student-section-content">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>State</label>
                        <select
                          name="stateId"
                          className="student-select"
                          value={formData.stateId ?? 0}
                          onChange={async (e) => {
                            const value = e.target.value;

                            setFormData((prev) => ({
                              ...prev,
                              stateId: value,
                              districtId: 0,
                              locationId: 0
                            }));

                            if (value > 0) {
                              await loadDistrict(value);
                            } else {
                              setDistricts([]);
                              setCitys([]);
                            }
                          }}
                        >
                          <option value="0">Select State</option>
                          {states?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>District</label>
                        <select
                          name="districtId"
                          className="student-select"
                          value={formData.districtId ?? 0}
                          onChange={async (e) => {
                            const value = e.target.value;

                            setFormData((prev) => ({
                              ...prev,
                              districtId: value,
                              locationId: 0
                            }));

                            if (value > 0) {
                              await loadCity(value);
                            } else {
                              setCitys([]);
                            }
                          }}
                        >
                          <option value="0">Select District</option>
                          {districts?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div className="student-field">
                        <label>City</label>
                        <select
                          name="locationId"
                          className="student-select"
                          value={formData.locationId ?? 0}
                          onChange={handleChange}
                        >
                          <option value="0">Select City</option>
                          {citys?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-8 col-md-8">
                      <div className="student-field">
                        <label>
                          Address <span className="student-required">*</span>
                        </label>
                        <textarea
                          name="address"
                          className={`student-input ${errors.address ? "student-invalid" : ""}`}
                          value={formData.address ?? ""}
                          onChange={handleChange}
                          placeholder="Enter complete address"
                        ></textarea>
                        {errors.address && (
                          <span className="student-error">
                            {errors.address}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-4">
                      <div className="student-field">
                        <label>Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength="6"
                          className="student-input"
                          value={formData.pincode ?? ""}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              handleChange(e);
                            }
                          }}
                          placeholder="Enter pincode"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="student-form-section">
                <div className="student-section-header">
                  <div className="student-section-icon">
                    <i className="bi bi-mortarboard"></i>
                  </div>
                  <div>
                    <h3 className="student-section-title">Academic Details</h3>
                    <div className="student-section-subtitle">
                      Existing academic records
                    </div>
                  </div>
                </div>

                <div className="student-section-content">
                  {academicDetails.length > 0 ? (
                    <div className="student-academic-wrapper">
                      <table className="student-academic-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>School / College</th>
                            <th>Roll No</th>
                            <th>Board / University</th>
                            <th>Percentage / CGPA</th>
                            <th>Document</th>
                          </tr>
                        </thead>
                        <tbody>
                          {academicDetails.map((item, index) => (
                            <tr key={item.id || index}>
                              <td>
                                <span className="student-academic-number">
                                  {index + 1}
                                </span>
                              </td>
                              <td>{value(item.schoolCollege)}</td>
                              <td>{value(item.rollNo)}</td>
                              <td>{value(item.boardUniversity)}</td>
                              <td>{value(item.percentageCgpa)}</td>
                              <td>
                                {item.fileName ? (
                                  <a
                                    href={item.fileName}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="student-document-btn"
                                  >
                                    <i className="bi bi-file-earmark-pdf"></i>
                                    View
                                  </a>
                                ) : (
                                  <span className="student-no-document">
                                    No Document
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="student-empty-academic">
                      <i className="bi bi-mortarboard fs-3 d-block mb-2"></i>
                      No academic details available
                    </div>
                  )}
                </div>
              </div> */}

              <div className="student-form-section">
                <div className="student-section-header">
                  <div className="student-section-icon">
                    <i className="bi bi-file-earmark-image"></i>
                  </div>
                  <div>
                    <h3 className="student-section-title">Documents</h3>
                    <div className="student-section-subtitle">
                      Update student photo, signature and Aadhaar documents
                    </div>
                  </div>
                </div>

                <div className="student-section-content">
                  <div className="row">
                    <div className="col-lg-3 col-md-6">
                      <div className="student-field">
                        <div className="student-file-card">
                          <div className="student-file-title">
                            <i className="bi bi-person-bounding-box"></i>
                            Student Photo
                          </div>

                          <input
                            type="file"
                            name="selfImage1"
                            accept="image/*"
                            className="student-file-input"
                            onChange={handleChange}
                          />

                          <div className="student-preview-box">
                            {formData.selfImageShow ? (
                              <img
                             
                                 src={`${FILE_URL}${formData.selfImageShow}`}
                                alt="Student"
                              />
                            ) : (
                              <div className="student-preview-empty">
                                <i className="bi bi-image fs-3 d-block mb-1"></i>
                                No photo available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="student-field">
                        <div className="student-file-card">
                          <div className="student-file-title">
                            <i className="bi bi-pen"></i>
                            Signature
                          </div>

                          <input
                            type="file"
                            name="signatureImage1"
                            accept="image/*"
                            className="student-file-input"
                            onChange={handleChange}
                          />

                          <div className="student-preview-box">
                            {formData.signatureImageShow ? (
                              <img
                            
                                   src={`${FILE_URL}${formData.signatureImageShow}`}
                                alt="Signature"
                              />
                            ) : (
                              <div className="student-preview-empty">
                                <i className="bi bi-pen fs-3 d-block mb-1"></i>
                                No signature available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="student-field">
                        <div className="student-file-card">
                          <div className="student-file-title">
                            <i className="bi bi-credit-card-2-front"></i>
                            Aadhaar Front
                          </div>

                          <input
                            type="file"
                            name="aadhaarCardFrant1"
                            accept="image/*"
                            className="student-file-input"
                            onChange={handleChange}
                          />

                          <div className="student-preview-box">
                            {formData.aadhaarCardFrantShow ? (
                              <img
                         
                                 src={`${FILE_URL}${formData.aadhaarCardFrantShow}`}
                                alt="Aadhaar Front"
                              />
                            ) : (
                              <div className="student-preview-empty">
                                <i className="bi bi-card-image fs-3 d-block mb-1"></i>
                                No document available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="student-field">
                        <div className="student-file-card">
                          <div className="student-file-title">
                            <i className="bi bi-credit-card"></i>
                            Aadhaar Back
                          </div>

                          <input
                            type="file"
                            name="aadhaarCardBack1"
                            accept="image/*"
                            className="student-file-input"
                            onChange={handleChange}
                          />

                          <div className="student-preview-box">
                            {formData.aadhaarCardBackShow ? (
                              <img
                               
                                        src={`${FILE_URL}${formData.aadhaarCardBackShow}`}
                                alt="Aadhaar Back"
                              />
                            ) : (
                              <div className="student-preview-empty">
                                <i className="bi bi-card-image fs-3 d-block mb-1"></i>
                                No document available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="student-form-footer">
              <button
                type="button"
                className="student-cancel-btn"
                onClick={() => navigate("/student-list")}
              >
                <i className="bi bi-arrow-left"></i>
                Back
              </button>

              <button type="submit" className="student-update-btn">
                <i className="bi bi-check2-circle"></i>
                Update Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default StudentUpdate;
 
