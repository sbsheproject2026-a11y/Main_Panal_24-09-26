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
  getStudentData,
  getStudentdetailById,
} from "../AllServicesFiles/StudentService";
import { FILE_URL } from "../api";

import logo from "/assets/img/Logo.png";

function AdmissionFormPrint() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [citys, setCitys] = useState([]);
  const [genders, setGenders] = useState([]);
  const [casteCategory, setCasteCategory] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [course, setCourse] = useState([]);
  const [masterSession, setMasterSession] = useState([]);
  const [academicDetails, setAcademicDetails] = useState([]);
  const [franchise, setFranchise] = useState({});
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
    casteCategoryId: null,
    courseTypeId: 0,
    courseCategoryId: 0,
    courseId: 0,
    courseCode: "",
    examSessionId: 0,
    genderId: null,
    stateId: 0,
    districtId: 0,
    locationId: 0,
    address: "",
    pincode: "",
    selfImageShow: "",
    signatureImageShow: "",
    aadhaarCardFrantShow: "",
    aadhaarCardBackShow: "",
    duration: "",
    medium: "",
    isActive: 1,
  });

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadState(),
        loadGender(),
        loadCasteCategory(),
        loadCourseType(),
        loadMasterSession(),
      ]);
      if (id) await handleEdit(id);
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
    } catch (e) { console.log(e); }
  };

  const loadGender = async () => {
    try {
      const result = await getStudentData(17);
      setGenders(result.data || []);
    } catch (e) { console.log(e); }
  };

  const loadCasteCategory = async () => {
    try {
      const result = await getStudentData(21);
      setCasteCategory(result.data || []);
    } catch (e) { console.log(e); }
  };

  const loadMasterSession = async () => {
    try {
      const result = await getMasterSession();
      setMasterSession(result.data || []);
    } catch (e) { console.log(e); }
  };

  const loadState = async () => {
    try {
      const result = await getState();
      setStates(result.data || []);
    } catch (e) { console.log(e); }
  };

  const loadDistrict = async (stateId) => {
    try {
      const result = await getDistrict(stateId);
      setDistricts(result.data || []);
    } catch (e) { console.log(e); }
  };

  const loadCity = async (districtId) => {
    try {
      const result = await getCity(districtId);
      setCitys(result.data || []);
    } catch (e) { console.log(e); }
  };

  const loadCourseCategory = async (courseTypeId) => {
    try {
      const result = await getCourseCategory(courseTypeId);
      const raw = result.data || [];
      const unique = [];
      const seen = new Set();
      raw.forEach((item) => {
        const key = String(item.id);
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      });
      setCourseCategories(unique);
    } catch (e) { console.log(e); }
  };

  const loadCourse = async (courseCategoryId) => {
    try {
      const result = await getCourse(courseCategoryId);
      setCourse(result.data || []);
    } catch (e) { console.log(e); }
  };

  const loadAcademicDetails = async (studentId) => {
    try {
      const result = await getStudentAcademicDetails(studentId);
      const data = result.data || result;
      setAcademicDetails(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      setAcademicDetails([]);
    }
  };

  const handleEdit = async (studentId) => {
    try {
      const [studentResult] = await Promise.all([
        getStudentdetailById(studentId),
        loadAcademicDetails(studentId),
      ]);

      const response = studentResult.data || studentResult;
      const student = response.studentdata || response;
      const academicList = response.academicDetails || [];
      const franchiseData = response.franchise || {};

      setFormData({
        id: student.id ?? 0,
        examSessionId: student.examSessionId ?? 0,
        code: student.code ?? "",
        name: student.name ?? "",
        studentNameHindi: student.studentNameHindi ?? "",
        fatherNameHindi: student.fatherNameHindi ?? "",
        fatherName: student.fatherName ?? "",
        motherName: student.motherName ?? "",
        locationId: student.locationId ?? 0,
        districtId: student.districtId ?? 0,
        genderId: student.genderId ?? 0,
        courseTypeId: student.courseTypeId ?? 0,
        courseCategoryId: student.courseCategoryId ?? 0,
        courseId: student.courseId ?? 0,
        courseCode: student.courseCode ?? "",
        casteCategoryId: student.casteCategoryId ?? 0,
        stateId: student.stateId ?? 0,
        dateOfBirth: student.dob ?? student.doB1 ?? "",
        address: student.address ?? "",
        pincode: student.pincode ?? "",
        mobileNo: student.mobileNo ?? "",
        selfImageShow: student.selfImageShow ?? student.selfImage ?? "",
        signatureImageShow:
          student.signatureImageShow ?? student.signatureImage ?? "",
        aadhaarCardFrantShow:
          student.aadhaarCardFrantShow ?? student.aadhaarCardFrant ?? "",
        aadhaarCardBackShow:
          student.aadhaarCardBackShow ?? student.aadhaarCardBack ?? "",
        idNumber: student.idNumber ?? "",
        whatsAppNo: student.whatsAppNo ?? "",
        email: student.email ?? "",
        duration: student.duration ?? student.courseDuration ?? "",
        medium: student.medium ?? student.courseMedium ?? "",
        isActive: student.isActive ?? 1,
      });

      if (Array.isArray(academicList) && academicList.length > 0) {
        setAcademicDetails(academicList);
      }
      setFranchise(franchiseData || {});

      if (student.stateId > 0) await loadDistrict(student.stateId);
      if (student.districtId > 0) await loadCity(student.districtId);
      if (student.courseTypeId > 0)
        await loadCourseCategory(student.courseTypeId);
      if (student.courseCategoryId > 0)
        await loadCourse(student.courseCategoryId);
    } catch (error) {
      console.log(error);
    }
  };

  const value = (d) =>
    d !== null && d !== undefined && String(d).trim() !== "" ? d : "";

  const getName = (list, val) => {
    const item = list?.find((x) => Number(x.id) === Number(val));
    return item?.name || "";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const imgUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${FILE_URL}${path}`;
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const matchId = (a, b) =>
    String(a ?? "").trim() === String(b ?? "").trim();

  const normStr = (v) =>
    String(v ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/s$/, "");

  const isDurationChecked = (opt) => {
    if (!formData.duration) return false;
    return normStr(formData.duration) === normStr(opt);
  };

  const isMediumChecked = (opt) => {
    if (!formData.medium) return false;
    return normStr(formData.medium) === normStr(opt);
  };

  const handlePrint = () => {
    const toolbar = document.querySelector(".afp-toolbar");
    if (toolbar) toolbar.style.display = "none";
    window.print();
    setTimeout(() => {
      if (toolbar) toolbar.style.display = "";
    }, 500);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f8fb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 42,
              height: 42,
              border: "4px solid #e8ebf5",
              borderTopColor: "#0b4a8f",
              borderRadius: "50%",
              margin: "0 auto 12px",
              animation: "spin .8s linear infinite",
            }}
          />
          <div style={{ color: "#667085", fontSize: 14 }}>
            Loading admission form...
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .afp-wrap {
          background: #eef1f5;
          min-height: 100vh;
          padding: 20px 10px 40px;
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
          color: #1a1a1a;
        }
        .afp-toolbar {
          max-width: 900px;
          margin: 0 auto 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .afp-toolbar h1 {
          font-size: 18px;
          margin: 0;
          color: #0b4a8f;
        }
        .afp-btn {
          border: none;
          border-radius: 6px;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .afp-btn-back { background: #fff; color: #0b4a8f; border: 1px solid #cfd7e3; }
        .afp-btn-print { background: #0b4a8f; color: #fff; }
        .afp-btn-print:hover { background: #093a70; }

        .afp-page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: #fff;
          padding: 12mm 12mm 10mm;
          box-shadow: 0 4px 24px rgba(0,0,0,.12);
          color: #111;
          font-size: 11.5px;
          line-height: 1.35;
        }

        /* ==========================================
           LETTERHEAD — LOGO TOP CENTER, TEXT BELOW CENTER
           ========================================== */
        .afp-head {
          position: relative;
          border-bottom: 2px solid #0b4a8f;
          padding-bottom: 10px;
          margin-bottom: 8px;
          min-height: 105px;
        }

        /* Center block — logo + text, sab center */
        .afp-head-center-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        .afp-head-logo-wrap {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .afp-head-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .afp-head-info {
          text-align: center;
        }
        .afp-head-title {
          font-size: 20px;
          font-weight: 800;
          color: #0b4a8f;
          margin: 0;
          line-height: 1.2;
        }
        .afp-head-sub {
          font-size: 11.5px;
          font-weight: 700;
          color: #0b4a8f;
          margin: 2px 0 0;
        }
        .afp-head-approved {
          font-size: 9px;
          color: #333;
          margin: 3px 0 0;
        }
        .afp-head-approved b { color: #0b4a8f; }
        .afp-head-reg {
          font-size: 9px;
          color: #444;
          margin: 1px 0 0;
        }
        .afp-head-code {
          font-size: 11px;
          font-weight: 800;
          color: #0b4a8f;
          margin-top: 3px;
          letter-spacing: 1px;
        }

        /* Student photo — right corner */
        .afp-photo-box {
          position: absolute;
          right: 0;
          top: 0;
          width: 80px;
          height: 100px;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8.5px;
          color: #555;
          text-align: center;
          overflow: hidden;
          background: #fafafa;
        }
        .afp-photo-box img { width: 100%; height: 100%; object-fit: cover; }

        .afp-form-title {
          text-align: center;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #0b4a8f;
          margin: 6px 0 2px;
          text-decoration: underline;
        }
        .afp-form-session {
          text-align: center;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .afp-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          margin: 8px 0 6px;
          gap: 10px;
        }
        .afp-top-row span { white-space: nowrap; }
        .afp-dotted {
          display: inline-block;
          border-bottom: 1px dotted #333;
          min-width: 130px;
          padding: 0 4px;
          font-weight: 600;
        }

        .afp-sec {
          background: #0b4a8f !important;
          color: #fff !important;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 8px;
          margin-top: 10px;
        }

        .afp-row {
          display: flex;
          border: 1px solid #333;
          border-top: none;
        }
        .afp-row > div {
          padding: 5px 8px;
          min-height: 26px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
        }
        .afp-row > div + div { border-left: 1px solid #333; }
        .afp-lbl { font-weight: 700; color: #222; white-space: nowrap; }
        .afp-val { flex: 1; color: #000; font-weight: 500; word-break: break-word; }

        .afp-cb-line {
          border: 1px solid #333;
          border-top: none;
          padding: 6px 8px;
          font-size: 11px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 18px;
          align-items: center;
        }
        .afp-cb-line b { font-weight: 700; }
        .afp-cb { display: inline-flex; align-items: center; gap: 4px; }
        .afp-cb-box {
          width: 11px; height: 11px;
          border: 1px solid #333;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
        }

        .afp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .afp-table th, .afp-table td {
          border: 1px solid #333;
          padding: 5px 7px;
          text-align: left;
          vertical-align: middle;
          min-height: 24px;
        }
        .afp-table th {
          background: #f0f4fa !important;
          font-weight: 700;
          text-align: center;
          font-size: 10.5px;
        }
        .afp-table td { height: 26px; }

        .afp-docs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 20px;
          border: 1px solid #333;
          border-top: none;
          padding: 8px 10px;
          font-size: 11px;
        }

        .afp-doc-img-grid {
          border: 1px solid #333;
          border-top: none;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          background: #fafbfc !important;
        }
        .afp-doc-card {
          border: 1px solid #cfd5df;
          border-radius: 6px;
          background: #fff !important;
          padding: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .afp-doc-title {
          font-size: 10px;
          font-weight: 700;
          color: #0b4a8f;
          text-align: center;
        }
        .afp-doc-img-box {
          width: 100%;
          height: 90px;
          border: 1px dashed #c7cdd6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #f6f8fb !important;
        }
        .afp-doc-img-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .afp-doc-img-empty {
          font-size: 9px;
          color: #98a2b3;
          text-align: center;
          padding: 4px;
        }

        .afp-decl {
          border: 1px solid #333;
          border-top: none;
          padding: 8px 10px;
          font-size: 11px;
          line-height: 1.5;
          text-align: justify;
        }
        .afp-sign-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border: 1px solid #333;
          border-top: none;
          padding: 10px 14px 6px;
          gap: 20px;
          font-size: 11px;
        }
        .afp-sign-box { text-align: center; min-width: 160px; }
        .afp-sign-line {
          border-top: 1px solid #333;
          margin-top: 34px;
          padding-top: 3px;
          font-weight: 700;
        }

        .afp-office .afp-table th { background: #eef1f5 !important; }
        .afp-office .afp-table td { font-size: 10.5px; }

        .afp-footer {
          text-align: center;
          font-size: 10px;
          color: #555;
          margin-top: 10px;
          border-top: 1px dashed #bbb;
          padding-top: 6px;
        }

        @media print {
          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          .afp-page,
          .afp-page * {
            visibility: visible !important;
          }

          .afp-page {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 8mm 10mm !important;
            box-shadow: none !important;
            min-height: auto !important;
          }

          .afp-toolbar {
            display: none !important;
          }

          .afp-wrap {
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
          }

          .afp-sec {
            background: #0b4a8f !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .afp-table th {
            background: #f0f4fa !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .afp-doc-img-grid {
            background: #fafbfc !important;
          }

          .afp-sec {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .afp-sec + * {
            page-break-before: avoid !important;
            break-before: avoid !important;
          }
          .afp-cb-line,
          .afp-row,
          .afp-table,
          .afp-docs,
          .afp-doc-img-grid,
          .afp-doc-card,
          .afp-decl,
          .afp-sign-row,
          .afp-table tr,
          .afp-table thead,
          .afp-table tbody {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .afp-table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .afp-doc-img-box {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }

        @media (max-width: 820px) {
          .afp-page { width: 100%; padding: 14px; }
          .afp-doc-img-grid { grid-template-columns: repeat(2, 1fr); }
          .afp-head-title { font-size: 16px; }
          .afp-head-sub { font-size: 10px; }
          .afp-head-logo-wrap { width: 60px; height: 60px; }
          .afp-photo-box { width: 65px; height: 85px; }
        }
      `}</style>

      <div className="afp-wrap">
        <div className="afp-toolbar">
          <h1>Admission Form Preview</h1>
          <div style={{ display: "flex", gap: 8 }}>

            <button
              type="button"
              className="afp-btn afp-btn-back"
              onClick={() => window.location.href = "/"}
            >
              <i className="bi bi-house-fill"></i>
              Go to Home
            </button>
            <button
              className="afp-btn afp-btn-print"
              onClick={handlePrint}
            >
              🖨 Print Form
            </button>
          </div>
        </div>

        <div className="afp-page" id="admission-form-print">
          {/* ---------- HEADER — LOGO TOP CENTER + TEXT BELOW CENTER ---------- */}
          <div className="afp-head">
            <div className="afp-head-center-block">
              <div className="afp-head-logo-wrap">
                <img
                  src={logo}
                  alt="SBSHE Logo"
                  className="afp-head-logo"
                />
              </div>

              <div className="afp-head-info">
                <h1 className="afp-head-title">
                  शहीद भगत सिंह स्वास्थ्य एवं शिक्षा
                </h1>
                <div className="afp-head-sub">
                  SHAHEED BHAGAT SINGH HEALTH AND EDUCATION
                </div>
                <div className="afp-head-approved">
                  <b>Approved By :</b> Government Of The NCT Of Delhi / M/o
                  Education
                </div>
                <div className="afp-head-reg">
                  Niti Aayog, Quality Council Of India, ISO (9001:2015),
                  Ministry Of MSME, Govt. Of India
                </div>
                <div className="afp-head-code">(SBSHE)</div>
              </div>
            </div>

            {/* Student photo — absolute right corner */}
            <div className="afp-photo-box">
              {formData.selfImageShow ? (
                <img src={imgUrl(formData.selfImageShow)} alt="Student" />
              ) : (
                <>
                  Paste recent
                  <br />
                  passport-size
                  <br />
                  photograph
                  <br />
                  (self-attested)
                </>
              )}
            </div>
          </div>

          <div className="afp-form-title">ADMISSION FORM</div>
          <div className="afp-form-session">
            Academic Session:{" "}
            <span className="afp-dotted">
              {getName(masterSession, formData.examSessionId)}
            </span>
          </div>

          <div className="afp-top-row">
            <span>
              Application / Form No.:{" "}
              <span className="afp-dotted">{value(formData.code)}</span>
            </span>
            <span>
              Date of Application:{" "}
              <span className="afp-dotted" style={{ minWidth: 110 }}>
                {today}
              </span>
            </span>
          </div>

          {/* ---------- 1. PROGRAMME DETAILS ---------- */}
          <div className="afp-sec">1. PROGRAMME DETAILS</div>

          <div className="afp-cb-line">
            <b>School:</b>
            {courseTypes && courseTypes.length > 0 ? (
              courseTypes.map((item, idx) => {
                const isChecked = matchId(item.id, formData.courseTypeId);
                return (
                  <span key={`school-${item.id}-${idx}`} className="afp-cb">
                    <span className="afp-cb-box">
                      {isChecked ? "✓" : ""}
                    </span>
                    {item.name}
                  </span>
                );
              })
            ) : (
              <span style={{ color: "#888" }}>
                No programme types available
              </span>
            )}
          </div>

          <div className="afp-cb-line">
            <b>Programme Applied For:</b>
            {courseCategories && courseCategories.length > 0 ? (
              courseCategories.map((item, idx) => {
                const isChecked = matchId(
                  item.id,
                  formData.courseCategoryId
                );
                return (
                  <span key={`cat-${item.id}-${idx}`} className="afp-cb">
                    <span className="afp-cb-box">
                      {isChecked ? "✓" : ""}
                    </span>
                    {item.name}
                  </span>
                );
              })
            ) : (
              <span style={{ color: "#888" }}>No categories available</span>
            )}
          </div>

          <div className="afp-row">
            <div style={{ flex: 1 }}>
              <span className="afp-lbl">Name of Course:</span>
              <span className="afp-val">
                {getName(course, formData.courseId)}
              </span>
            </div>
            <div
              style={{
                flexShrink: 0,
                minWidth: 200,
                borderLeft: "1px solid #333",
              }}
            >
              <span className="afp-lbl">Course Code:</span>
              <span className="afp-val">{value(formData.courseCode)}</span>
            </div>
          </div>

          <div className="afp-row">
            <div style={{ flex: 1, gap: 16 }}>
              <span className="afp-lbl">Duration:</span>
              {["6 Months", "1 Year", "2 Year"].map((d) => (
                <span key={d} className="afp-cb">
                  <span className="afp-cb-box">
                    {isDurationChecked(d) ? "✓" : ""}
                  </span>
                  {d}
                </span>
              ))}
              <span className="afp-lbl" style={{ marginLeft: 12 }}>
                Medium:
              </span>
              {["English", "Hindi"].map((m) => (
                <span key={m} className="afp-cb">
                  <span className="afp-cb-box">
                    {isMediumChecked(m) ? "✓" : ""}
                  </span>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* ---------- 2. STUDY CENTRE DETAILS ---------- */}
          <div className="afp-sec">2. STUDY CENTRE DETAILS</div>
          <table className="afp-table" style={{ borderTop: "1px solid #333" }}>
            <tbody>
              <tr>
                <td style={{ width: "28%" }}>
                  <b>Study Centre Name</b>
                </td>
                <td style={{ width: "32%" }}>{value(franchise.name)}</td>
                <td style={{ width: "20%" }}>
                  <b>Study Centre Code</b>
                </td>
                <td>{value(franchise.code)}</td>
              </tr>
              <tr>
                <td>
                  <b>Study Centre Address</b>
                </td>
                <td colSpan={3}>{value(franchise.address)}</td>
              </tr>
              <tr>
                <td>
                  <b>Village / City</b>
                </td>
                <td>{value(franchise.cityName)}</td>
                <td>
                  <b>District</b>
                </td>
                <td>{value(franchise.districtName)}</td>
              </tr>
              <tr>
                <td>
                  <b>State</b>
                </td>
                <td>{value(franchise.stateName)}</td>
                <td>
                  <b>PIN Code</b>
                </td>
                <td>{value(franchise.pincode)}</td>
              </tr>
              <tr>
                <td>
                  <b>Centre Coordinator / Director</b>
                </td>
                <td>{value(franchise.fatherName)}</td>
                <td>
                  <b>Coordinator Mobile No.</b>
                </td>
                <td>{value(franchise.mobileNo)}</td>
              </tr>
              <tr>
                <td>
                  <b>Centre Email ID</b>
                </td>
                <td>{value(franchise.email)}</td>
                <td>
                  <b>Date of Admission at Centre</b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* ---------- 3. PERSONAL DETAILS ---------- */}
          <div className="afp-sec">3. PERSONAL DETAILS</div>
          <table className="afp-table" style={{ borderTop: "1px solid #333" }}>
            <tbody>
              <tr>
                <td style={{ width: "28%" }}>
                  <b>Full Name (in BLOCK letters)</b>
                </td>
                <td style={{ width: "32%" }}>{value(formData.name)}</td>
                <td style={{ width: "20%" }}>
                  <b>Mother's Name</b>
                </td>
                <td>{value(formData.motherName)}</td>
              </tr>
              <tr>
                <td>
                  <b>Father's Name</b>
                </td>
                <td>{value(formData.fatherName)}</td>
                <td>
                  <b>Gender</b>
                </td>
                <td>{getName(genders, formData.genderId)}</td>
              </tr>
              <tr>
                <td>
                  <b>Date of Birth (DD/MM/YYYY)</b>
                </td>
                <td>{formatDate(formData.dateOfBirth)}</td>
                <td>
                  <b>Religion (optional)</b>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>Nationality</b>
                </td>
                <td>Indian</td>
                <td>
                  <b>Blood Group</b>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>Category (Gen/OBC/SC/ST/EWS)</b>
                </td>
                <td>{getName(casteCategory, formData.casteCategoryId)}</td>
                <td>
                  <b>Marital Status</b>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>Aadhaar No.</b>
                </td>
                <td>{value(formData.idNumber)}</td>
                <td>
                  <b>Alternate Mobile No.</b>
                </td>
                <td>{value(formData.whatsAppNo)}</td>
              </tr>
              <tr>
                <td>
                  <b>Mobile No.</b>
                </td>
                <td>{value(formData.mobileNo)}</td>
                <td>
                  <b>Email ID</b>
                </td>
                <td>{value(formData.email)}</td>
              </tr>
            </tbody>
          </table>

          {/* ---------- 4. ADDRESS & CONTACT DETAILS ---------- */}
          <div className="afp-sec">4. ADDRESS &amp; CONTACT DETAILS</div>
          <table className="afp-table" style={{ borderTop: "1px solid #333" }}>
            <tbody>
              <tr>
                <td style={{ width: "28%" }}>
                  <b>Permanent Address</b>
                </td>
                <td colSpan={3}>{value(formData.address)}</td>
              </tr>
              <tr>
                <td>
                  <b>Village / City</b>
                </td>
                <td style={{ width: "32%" }}>
                  {getName(citys, formData.locationId)}
                </td>
                <td style={{ width: "20%" }}>
                  <b>Post Office</b>
                </td>
                <td colSpan={3}>{value(formData.address)}</td>
              </tr>
              <tr>
                <td>
                  <b>District</b>
                </td>
                <td>{getName(districts, formData.districtId)}</td>
                <td>
                  <b>State</b>
                </td>
                <td>{getName(states, formData.stateId)}</td>
              </tr>
              <tr>
                <td>
                  <b>PIN Code</b>
                </td>
                <td>{value(formData.pincode)}</td>
                <td>
                  <b>Police Station</b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* ---------- 5. EDUCATIONAL QUALIFICATION ---------- */}
          <div className="afp-sec">5. EDUCATIONAL QUALIFICATION</div>
          <table className="afp-table" style={{ borderTop: "1px solid #333" }}>
            <thead>
              <tr>
                <th style={{ width: "22%" }}>Examination</th>
                <th style={{ width: "24%" }}>
                  Board / University / Council
                </th>
                <th style={{ width: "12%" }}>Year of Passing</th>
                <th style={{ width: "12%" }}>Roll No.</th>
                <th style={{ width: "15%" }}>Marks Obtained / Total</th>
                <th style={{ width: "15%" }}>% / Grade</th>
              </tr>
            </thead>
            <tbody>
              {academicDetails && academicDetails.length > 0 ? (
                academicDetails.map((r, idx) => (
                  <tr key={r.id || idx}>
                    <td>
                      <b>
                        {value(r.levelName) ||
                          `Level ${r.levelTypeId || ""}`}
                      </b>
                    </td>
                    <td>{value(r.boardUniversity)}</td>
                    <td>{value(r.yearOfPassing || r.passingYear)}</td>
                    <td>{value(r.rollNo)}</td>
                    <td>{value(r.marksObtained || r.totalMarks)}</td>
                    <td>
                      {value(r.percentageCgpa || r.percentage || r.grade)}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td>
                      <b>10th (Matriculation)</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <b>12th (Intermediate)</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <b>Graduation (if any)</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <b>Other / Professional</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* ---------- 6. DOCUMENTS ENCLOSED ---------- */}
          <div className="afp-sec">6. DOCUMENTS ENCLOSED</div>

          <div className="afp-docs">
            <span className="afp-cb">
              <span className="afp-cb-box"></span> Photocopy of 10th / 12th
              marksheet and certificate
            </span>
            <span className="afp-cb">
              <span className="afp-cb-box"></span> Caste / Category Certificate
              (if applicable)
            </span>
            <span className="afp-cb">
              <span className="afp-cb-box"></span> Photocopy of Aadhaar Card
            </span>
            <span className="afp-cb">
              <span className="afp-cb-box"></span> 4 passport-size photographs
            </span>
            <span className="afp-cb">
              <span className="afp-cb-box"></span> Transfer / Character
              Certificate
            </span>
            <span className="afp-cb">
              <span className="afp-cb-box"></span> Any other relevant
              certificate: ______________
            </span>
          </div>

          <div className="afp-doc-img-grid">
            <div className="afp-doc-card">
              <div className="afp-doc-title">Student Photo</div>
              <div className="afp-doc-img-box">
                {formData.selfImageShow ? (
                  <img src={imgUrl(formData.selfImageShow)} alt="Student" />
                ) : (
                  <div className="afp-doc-img-empty">Not Available</div>
                )}
              </div>
            </div>

            <div className="afp-doc-card">
              <div className="afp-doc-title">Signature</div>
              <div className="afp-doc-img-box">
                {formData.signatureImageShow ? (
                  <img
                    src={imgUrl(formData.signatureImageShow)}
                    alt="Signature"
                  />
                ) : (
                  <div className="afp-doc-img-empty">Not Available</div>
                )}
              </div>
            </div>

            <div className="afp-doc-card">
              <div className="afp-doc-title">Aadhaar Front</div>
              <div className="afp-doc-img-box">
                {formData.aadhaarCardFrantShow ? (
                  <img
                    src={imgUrl(formData.aadhaarCardFrantShow)}
                    alt="Aadhaar Front"
                  />
                ) : (
                  <div className="afp-doc-img-empty">Not Available</div>
                )}
              </div>
            </div>

            <div className="afp-doc-card">
              <div className="afp-doc-title">Aadhaar Back</div>
              <div className="afp-doc-img-box">
                {formData.aadhaarCardBackShow ? (
                  <img
                    src={imgUrl(formData.aadhaarCardBackShow)}
                    alt="Aadhaar Back"
                  />
                ) : (
                  <div className="afp-doc-img-empty">Not Available</div>
                )}
              </div>
            </div>
          </div>

          {/* ---------- 7. DECLARATION ---------- */}
          <div className="afp-sec">7. DECLARATION</div>
          <div className="afp-decl">
            I hereby declare that the information furnished above is true and
            correct to the best of my knowledge and belief. I agree to abide by
            the rules, regulations and discipline of Shaheed Bhagat Singh Health
            &amp; Education. If any information is found false or incorrect, my
            admission may be cancelled at any time without prior notice.
          </div>
          <div className="afp-sign-row">
            <div>
              <div>Place: ___________________</div>
              <div style={{ marginTop: 8 }}>Date:____________________</div>
            </div>
            <div className="afp-sign-box">
              <div className="afp-sign-line">Signature of Applicant</div>
            </div>
            <div className="afp-sign-box">
              <div className="afp-sign-line">
                Signature of Parent / Guardian
              </div>
            </div>
          </div>

          {/* ---------- FOR OFFICE USE ONLY ---------- */}
          <div className="afp-sec" style={{ marginTop: 12 }}>
            FOR OFFICE USE ONLY
          </div>
          <table
            className="afp-table afp-office"
            style={{ borderTop: "1px solid #333" }}
          >
            <tbody>
              <tr>
                <td style={{ width: "28%" }}>
                  <b>Documents Verified</b>
                </td>
                <td style={{ width: "32%" }}>
                  <span className="afp-cb">
                    <span className="afp-cb-box"></span> Yes
                  </span>
                  <span className="afp-cb" style={{ marginLeft: 20 }}>
                    <span className="afp-cb-box"></span> No
                  </span>
                </td>
                <td style={{ width: "20%" }}>
                  <b>Admission Status</b>
                </td>
                <td>
                  <span className="afp-cb">
                    <span className="afp-cb-box"></span> Approved
                  </span>
                  <span className="afp-cb" style={{ marginLeft: 20 }}>
                    <span className="afp-cb-box"></span> Rejected
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <b>Enrollment / Reg. No.</b>
                </td>
                <td></td>
                <td>
                  <b>Fee Receipt No. &amp; Date</b>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>Fee Paid (Rs.)</b>
                </td>
                <td></td>
                <td>
                  <b>Remarks</b>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>Study Centre Coordinator (Sign &amp; Seal)</b>
                </td>
                <td style={{ height: 52 }}></td>
                <td>
                  <b>Date of Forwarding to Head Office</b>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>Verified by (Admission In-charge)</b>
                </td>
                <td style={{ height: 52 }}></td>
                <td>
                  <b>Director / Principal (Sign &amp; Seal)</b>
                </td>
                <td style={{ height: 52 }}></td>
              </tr>
            </tbody>
          </table>

          <div className="afp-footer">
            www.shaheebhagatsinghhealthandeducation.com
          </div>
        </div>
      </div>
    </>
  );
}

export default AdmissionFormPrint;