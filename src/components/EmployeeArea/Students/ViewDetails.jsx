 import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getStudentById,
  getStudentAcademicDetails,
  getStudentData,
  getState,
  getDistrict,
  getCity,
  getCourseCategory,
  getCourse,
  getMasterSession,
} from "../../AllServicesFiles/StudentService";
import { FILE_URL } from "../../api";

function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [academicDetails, setAcademicDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [genders, setGenders] = useState([]);
  const [casteCategories, setCasteCategories] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  // 👇 States for Modals
  const [lightbox, setLightbox] = useState(null);
  const [pdfModal, setPdfModal] = useState(null); // { url, title }

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);

      const result = await getStudentById(id);
      const academicResult = await getStudentAcademicDetails(id);

      const data = result.data || result;
      const academicData = academicResult.data || academicResult;

      setStudent(data);
      setAcademicDetails(Array.isArray(academicData) ? academicData : []);

      await Promise.all([
        loadStates(),
        loadGenders(),
        loadCasteCategories(),
        loadCourseTypes(),
        loadSessions(),
      ]);

      if (data.stateId > 0) await loadDistricts(data.stateId);
      if (data.districtId > 0) await loadCities(data.districtId);
      if (data.courseTypeId > 0) await loadCourseCategories(data.courseTypeId);
      if (data.courseCategoryId > 0)
        await loadCourse(data.courseCategoryId, data.courseTypeId);
    } catch (error) {
      console.log("Student Details Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async () => {
    try {
      const result = await getState();
      setStates(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDistricts = async (stateId) => {
    try {
      const result = await getDistrict(stateId);
      setDistricts(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCities = async (districtId) => {
    try {
      const result = await getCity(districtId);
      setCities(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadGenders = async () => {
    try {
      const result = await getStudentData(17);
      setGenders(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCasteCategories = async () => {
    try {
      const result = await getStudentData(21);
      setCasteCategories(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCourseTypes = async () => {
    try {
      const result = await getStudentData(13);
      setCourseTypes(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadSessions = async () => {
    try {
      const result = await getMasterSession();
      setSessions(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCourseCategories = async (courseTypeId) => {
    try {
      const result = await getCourseCategory(courseTypeId);
      setCourseCategories(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCourse = async (courseCategoryId, courseTypeId) => {
    try {
      const result = await getCourse(courseCategoryId, courseTypeId);
      setCourses(result?.data || []);
    } catch (error) {
      console.error("Course Error:", error);
      setCourses([]);
    }
  };

  const getName = (list, id) => {
    const item = list.find((x) => Number(x.id) === Number(id));
    return item?.name || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const value = (data) => {
    return data !== null && data !== undefined && String(data).trim() !== ""
      ? data
      : "-";
  };

  const DetailItem = ({ label, value: itemValue, icon }) => (
    <div className="vd-detail">
      <div className="vd-detail-label">
        {icon && <i className={`bi ${icon} vd-detail-ico`}></i>}
        {label}
      </div>
      <div className="vd-detail-value">{value(itemValue)}</div>
    </div>
  );

  const Section = ({ icon, title, subtitle, color = "#198754", children }) => (
    <div className="vd-section">
      <div className="vd-section-head">
        <div
          className="vd-section-icon"
          style={{ background: `${color}18`, color }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
        <div>
          <h5 className="vd-section-title">{title}</h5>
          {subtitle && <div className="vd-section-subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="vd-section-body">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="vd-loader-wrap">
        <div className="vd-loader-ring"></div>
        <p className="vd-loader-text">Loading student details…</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="vd-loader-wrap">
        <div className="vd-empty-card">
          <i className="bi bi-person-x"></i>
          <h5>Student not found</h5>
          <p>The student details you're looking for could not be loaded.</p>
          <button className="vd-btn-primary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ================= ROOT ================= */
        .vd-page {
          background:
            radial-gradient(1200px 600px at 10% -10%, #e8f7ee 0%, transparent 60%),
            radial-gradient(900px 500px at 100% 0%, #eef2ff 0%, transparent 55%),
            #f6f8fb;
          min-height: 100vh;
          padding: 28px 16px 60px;
          font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
        }
        .vd-container { max-width: 1000px; margin: 0 auto; }

        /* ================= PAGE HEADER ================= */
        .vd-page-head {
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 12px; margin-bottom: 22px;
        }
        .vd-page-title {
          font-size: 26px; font-weight: 800; color: #0f172a;
          margin: 0 0 4px 0; letter-spacing: -0.3px;
        }
        .vd-page-title span { color: #198754; }
        .vd-breadcrumb { display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #64748b; flex-wrap: wrap; }
        .vd-breadcrumb a { color: #198754; text-decoration: none; font-weight: 600; }
        .vd-breadcrumb a:hover { text-decoration: underline; }
        .vd-breadcrumb i { font-size: 10px; color: #cbd5e1; }

        .vd-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #198754, #20c997);
          color: #fff; border: none; padding: 10px 20px;
          border-radius: 10px; font-weight: 600; font-size: 13.5px;
          cursor: pointer; transition: .25s;
          box-shadow: 0 6px 16px rgba(25,135,84,.25);
        }
        .vd-btn-primary:hover { transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(25,135,84,.35); }

        /* ================= PROFILE CARD ================= */
        .vd-profile {
          border-radius: 20px; overflow: hidden; background: #fff;
          box-shadow: 0 10px 30px rgba(15,23,42,.06);
          margin-bottom: 22px; animation: vd-fade .5s ease;
        }
        .vd-profile-banner {
          height: 120px; position: relative; overflow: hidden;
          background: linear-gradient(120deg, #198754 0%, #20c997 55%, #5eead4 100%);
        }
        .vd-profile-banner::before,
        .vd-profile-banner::after {
          content: ""; position: absolute; border-radius: 50%;
          background: rgba(255,255,255,.14);
        }
        .vd-profile-banner::before { width: 220px; height: 220px; top: -80px; right: -60px; }
        .vd-profile-banner::after  { width: 160px; height: 160px; bottom: -70px; left: -40px; background: rgba(255,255,255,.10); }

        .vd-profile-status {
          position: absolute; top: 14px; right: 18px;
          background: rgba(255,255,255,.9);
          color: #065f46; font-weight: 700; font-size: 12px;
          padding: 6px 14px; border-radius: 999px;
          display: inline-flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,.12);
        }
        .vd-profile-status::before {
          content: ""; width: 8px; height: 8px; border-radius: 50%;
          background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.25);
        }

        .vd-profile-body { padding: 0 26px 24px; }
        
        .vd-profile-row {
          display: flex; 
          align-items: flex-start; 
          gap: 22px;
          flex-wrap: wrap;
        }
        
        .vd-avatar-box {
          background: #fff; padding: 8px; border-radius: 22px;
          box-shadow: 0 12px 28px rgba(15,23,42,.14);
          flex-shrink: 0;
          margin-top: -75px; 
          position: relative;
          z-index: 2;
        }
        .vd-avatar-img, .vd-avatar-ph {
          width: 130px; height: 130px; border-radius: 16px;
          object-fit: cover; display: block;
        }
        .vd-avatar-ph {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8; font-size: 62px;
        }

        .vd-profile-info { 
          flex: 1; min-width: 220px; 
          padding-top: 20px;
          padding-bottom: 5px;
        }
        .vd-profile-name {
          font-size: 24px; font-weight: 800; color: #0f172a;
          margin: 0 0 4px 0; letter-spacing: -0.3px;
        }
        .vd-profile-hindi { font-size: 15px; color: #475569; margin-bottom: 6px; }
        
        .vd-profile-meta { 
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; 
        }

        .vd-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 999px; font-size: 12.5px;
          font-weight: 600; background: #f1f5f9; color: #334155;
          border: 1px solid #e2e8f0;
        }
        .vd-chip.green { background: #ecfdf5; color: #047857; border-color: #bbf7d0; }
        .vd-chip.blue  { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .vd-chip.purple{ background: #f5f3ff; color: #6d28d9; border-color: #ddd6fe; }

        /* ================= SECTION CARD ================= */
        .vd-section {
          background: #fff; border-radius: 18px; padding: 22px 24px;
          margin-bottom: 20px; position: relative; overflow: hidden;
          box-shadow: 0 6px 20px rgba(15,23,42,.05);
          border: 1px solid #eef2f7;
          transition: .3s; animation: vd-fade .5s ease;
        }
        .vd-section:hover {
          box-shadow: 0 14px 34px rgba(15,23,42,.09);
          transform: translateY(-2px);
          border-color: #d7e5dd;
        }
        .vd-section::before {
          content: ""; position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px; background: linear-gradient(180deg, #198754, #20c997);
          opacity: .9;
        }
        .vd-section-head {
          display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
        }
        .vd-section-icon {
          width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .vd-section-title {
          font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;
          letter-spacing: -0.2px;
        }
        .vd-section-subtitle {
          font-size: 12px; color: #94a3b8; margin-top: 2px;
        }

        /* ================= DETAILS GRID ================= */
        .vd-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px 26px;
        }
        .vd-detail { padding: 6px 0; }
        .vd-detail-label {
          font-size: 12px; color: #94a3b8; font-weight: 600;
          text-transform: uppercase; letter-spacing: .4px;
          margin-bottom: 6px; display: flex; align-items: center; gap: 6px;
        }
        .vd-detail-ico { font-size: 12px; color: #94a3b8; }
        .vd-detail-value {
          font-size: 14.5px; font-weight: 600; color: #0f172a;
          line-height: 1.45; word-break: break-word;
        }
        .vd-detail.full { grid-column: 1 / -1; }

        /* ================= ACADEMIC TABLE ================= */
        .vd-acad-wrap {
          border-radius: 14px; overflow: hidden;
          border: 1px solid #eef2f7;
        }
        .vd-acad-table { width: 100%; border-collapse: collapse; }
        .vd-acad-table thead th {
          background: linear-gradient(90deg, #6610f2, #8540f5);
          color: #fff; font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .4px;
          padding: 14px 14px; text-align: left; white-space: nowrap;
        }
        .vd-acad-table tbody td {
          padding: 14px 14px; font-size: 13.5px; color: #334155;
          border-bottom: 1px solid #f1f5f9; vertical-align: middle;
        }
        .vd-acad-table tbody tr:last-child td { border-bottom: none; }
        .vd-acad-table tbody tr { transition: .2s; }
        .vd-acad-table tbody tr:hover { background: #f8fafc; }

        .vd-badge-num {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 26px; height: 26px; border-radius: 8px;
          background: #f1f5f9; color: #475569; font-weight: 700; font-size: 12px;
        }
        .vd-badge-roll {
          background: #eff6ff; color: #1d4ed8; font-weight: 700;
          padding: 5px 11px; border-radius: 999px; font-size: 12px;
          display: inline-block;
        }
        .vd-badge-pct {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          color: #047857; font-weight: 800;
          padding: 6px 12px; border-radius: 999px; font-size: 12.5px;
          display: inline-block;
        }
        .vd-pdf-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff; color: #dc3545; border: 1.5px solid #fecaca;
          padding: 6px 12px; border-radius: 8px; font-size: 12px;
          font-weight: 700; cursor: pointer; transition: .2s;
        }
        .vd-pdf-btn:hover {
          background: #dc3545; color: #fff; border-color: #dc3545;
          transform: translateY(-1px);
        }

        /* ================= EMPTY STATE ================= */
        .vd-empty-state {
          text-align: center; padding: 40px 20px;
          background: #f8fafc; border-radius: 14px;
          border: 1.5px dashed #e2e8f0;
        }
        .vd-empty-state .ico {
          width: 62px; height: 62px; margin: 0 auto 14px;
          border-radius: 50%; background: #eef2f7;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; color: #94a3b8;
        }
        .vd-empty-state h6 { font-size: 15px; font-weight: 700; color: #334155; margin: 0 0 6px; }
        .vd-empty-state p  { font-size: 13px; color: #94a3b8; margin: 0; }

        /* ================= DOCUMENTS ================= */
        .vd-docs-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        .vd-doc-card {
          background: #fff; border: 1.5px solid #eef2f7; border-radius: 14px;
          padding: 14px; text-align: center; cursor: pointer;
          transition: .25s; overflow: hidden; position: relative;
        }
        .vd-doc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(15,23,42,.1);
          border-color: #198754;
        }
        .vd-doc-card:hover .vd-doc-img { transform: scale(1.05); }
        .vd-doc-title {
          font-size: 12.5px; font-weight: 700; color: #334155;
          text-transform: uppercase; letter-spacing: .4px;
          margin-bottom: 10px;
        }
        .vd-doc-img {
          width: 100%; height: 150px; object-fit: contain;
          background: #f8fafc; border-radius: 10px;
          transition: .35s;
        }
        .vd-doc-empty {
          height: 150px; border-radius: 10px; background: #f8fafc;
          display: flex; align-items: center; justify-content: center;
          color: #cbd5e1; font-size: 40px;
        }

        /* ================= LIGHTBOX (For Images) ================= */
        .vd-lightbox {
          position: fixed; inset: 0; background: rgba(15,23,42,.85);
          backdrop-filter: blur(6px); z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 40px; animation: vd-fade .25s ease;
        }
        .vd-lightbox img {
          max-width: 92vw; max-height: 88vh; border-radius: 14px;
          box-shadow: 0 30px 80px rgba(0,0,0,.5);
        }
        .vd-lightbox-close {
          position: absolute; top: 22px; right: 26px;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
          color: #fff; font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: .2s;
        }
        .vd-lightbox-close:hover { background: rgba(255,255,255,.3); }

        /* ================= PDF MODAL ================= */
        .vd-pdf-modal {
          position: fixed; inset: 0; background: rgba(15,23,42,.85);
          backdrop-filter: blur(6px); z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: vd-fade .25s ease;
        }
        .vd-pdf-container {
          background: #fff;
          width: 90vw;
          height: 90vh;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 80px rgba(0,0,0,.5);
        }
        .vd-pdf-header {
          padding: 14px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .vd-pdf-header h5 { 
          margin: 0; font-size: 15px; font-weight: 700; color: #1e293b; 
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
        }
        .vd-pdf-actions { display: flex; align-items: center; gap: 12px; }
        .vd-pdf-ext-btn {
          background: #fff; color: #0d6efd; border: 1px solid #bfdbfe;
          padding: 6px 12px; border-radius: 6px; font-size: 12px;
          font-weight: 600; text-decoration: none; transition: .2s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .vd-pdf-ext-btn:hover { background: #eff6ff; color: #1d4ed8; }
        .vd-pdf-header .close-btn {
          background: transparent; border: none; font-size: 22px; color: #64748b;
          cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .vd-pdf-header .close-btn:hover { color: #ef4444; }
        .vd-pdf-body {
          flex: 1;
          background: #525659;
        }
        .vd-pdf-body iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        /* Mobile adjust for PDF Modal */
        @media (max-width: 640px) {
          .vd-pdf-container { width: 100vw; height: 100vh; border-radius: 0; }
          .vd-pdf-header { padding: 10px 14px; flex-wrap: wrap; gap: 10px; }
          .vd-pdf-header h5 { font-size: 13px; max-width: 160px; }
          .vd-pdf-ext-btn span { display: none; } /* Hide text, keep icon only on mobile */
        }

        /* ================= LOADER / NOT FOUND ================= */
        .vd-loader-wrap {
          min-height: 70vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 18px;
        }
        .vd-loader-ring {
          width: 56px; height: 56px; border-radius: 50%;
          border: 4px solid #d1fae5; border-top-color: #198754;
          animation: vd-spin .8s linear infinite;
        }
        .vd-loader-text { color: #64748b; font-weight: 500; font-size: 14px; }

        .vd-empty-card {
          background: #fff; padding: 40px; border-radius: 18px;
          text-align: center; box-shadow: 0 10px 30px rgba(15,23,42,.08);
          max-width: 400px;
        }
        .vd-empty-card i { font-size: 44px; color: #cbd5e1; margin-bottom: 12px; }
        .vd-empty-card h5 { font-weight: 700; color: #334155; margin: 0 0 6px; }
        .vd-empty-card p  { font-size: 13.5px; color: #94a3b8; margin: 0 0 20px; }

        /* ================= ANIMATIONS ================= */
        @keyframes vd-spin { to { transform: rotate(360deg); } }
        @keyframes vd-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 900px) {
          .vd-details-grid { grid-template-columns: repeat(2, 1fr); }
          .vd-docs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .vd-page { padding: 16px 10px 40px; }
          .vd-page-title { font-size: 21px; }
          .vd-details-grid { grid-template-columns: 1fr; }
          
          .vd-profile-row { 
            justify-content: center; 
            text-align: center;
            align-items: center; 
            gap: 12px;
          }
          .vd-avatar-box { margin-top: -65px; margin-bottom: 10px; }
          .vd-profile-info { padding-top: 0; }
          .vd-profile-meta { justify-content: center; }
          .vd-profile-name { font-size: 20px; }
          .vd-avatar-img, .vd-avatar-ph { width: 110px; height: 110px; }
          .vd-section { padding: 18px; }
          .vd-docs-grid { grid-template-columns: 1fr; }
          .vd-acad-wrap { overflow-x: auto; }
          .vd-acad-table { min-width: 640px; }
        }

        /* ================= PRINT ================= */
        @media print {
          .vd-page { background: #fff; padding: 0; }
          .vd-btn-primary, .vd-no-print { display: none !important; }
          .vd-profile, .vd-section { box-shadow: none !important;
            border: 1px solid #e5e7eb !important; page-break-inside: avoid; }
          .vd-lightbox, .vd-pdf-modal { display: none !important; }
        }
      `}</style>

      <div className="vd-page">
        <div className="vd-container">
          {/* ============ PAGE HEADER ============ */}
          <div className="vd-page-head vd-no-print">
            <div>
              <h1 className="vd-page-title">
                Student <span>Details</span>
              </h1>
              <div className="vd-breadcrumb">
                <a href="/dashboard">Dashboard</a>
                <i className="bi bi-chevron-right"></i>
                <span>Student</span>
                <i className="bi bi-chevron-right"></i>
                <span>View Details</span>
              </div>
            </div>

            {/* <button className="vd-btn-primary" onClick={() => window.print()}>
              <i className="bi bi-printer"></i> Print Details
            </button> */}
          </div>

          {/* ============ PROFILE CARD ============ */}
          <div className="vd-profile">
            <div className="vd-profile-banner">
              {student.isActive === 1 && (
                <div className="vd-profile-status">Active Student</div>
              )}
            </div>

            <div className="vd-profile-body">
              <div className="vd-profile-row">
                <div className="vd-avatar-box">
                  {student.selfImage ? (
                    <img
                      src={`${FILE_URL}${student.selfImage}`}
                      alt="Student"
                      className="vd-avatar-img"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="vd-avatar-ph">
                      <i className="bi bi-person"></i>
                    </div>
                  )}
                </div>

                <div className="vd-profile-info">
                  <h2 className="vd-profile-name">{value(student.name)}</h2>
                  {student.studentNameHindi && (
                    <div className="vd-profile-hindi">{student.studentNameHindi}</div>
                  )}

                  <div className="vd-profile-meta">
                    <span className="vd-chip green">
                      <i className="bi bi-hash"></i> {value(student.code)}
                    </span>
                    <span className="vd-chip blue">
                      <i className="bi bi-book"></i>{" "}
                      {getName(courseTypes, student.courseTypeId)}
                    </span>
                    <span className="vd-chip purple">
                      <i className="bi bi-calendar"></i>{" "}
                      {getName(sessions, student.examSessionId)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ COURSE DETAILS ============ */}
          <Section
            icon="bi-book-half"
            title="Course Details"
            subtitle="Programme, category & exam session information"
            color="#198754"
          >
            <div className="vd-details-grid">
              <DetailItem
                label="Programme"
                icon="bi-mortarboard"
                value={getName(courseTypes, student.courseTypeId)}
              />
              <DetailItem
                label="Course Category"
                icon="bi-collection"
                value={getName(courseCategories, student.courseCategoryId)}
              />
              <DetailItem
                label="Course"
                icon="bi-journal-bookmark"
                value={getName(courses, student.courseId)}
              />
              {/* <DetailItem
                label="Exam Session"
                icon="bi-calendar-range"
                value={getName(sessions, student.examSessionId)}
              /> */}
            </div>
          </Section>

          {/* ============ PERSONAL DETAILS ============ */}
          <Section
            icon="bi-person-vcard"
            title="Personal Details"
            subtitle="Identity & family information"
            color="#0d6efd"
          >
            <div className="vd-details-grid">
              <DetailItem label="Full Name" icon="bi-person" value={student.name} />
              <DetailItem label="Name in Hindi" icon="bi-translate" value={student.studentNameHindi} />
              <DetailItem label="Father Name" icon="bi-person-badge" value={student.fatherName} />
              <DetailItem label="Father Name (Hindi)" icon="bi-translate" value={student.fatherNameHindi} />
              <DetailItem label="Mother Name" icon="bi-person-heart" value={student.motherName} />
              <DetailItem label="Date of Birth" icon="bi-calendar-date" value={formatDate(student.doB1)} />
              <DetailItem label="Gender" icon="bi-gender-ambiguous" value={getName(genders, student.genderId)} />
              <DetailItem label="Caste Category" icon="bi-people" value={getName(casteCategories, student.casteCategoryId)} />
              <DetailItem label="Aadhaar Number" icon="bi-shield-check" value={student.idNumber} />
            </div>
          </Section>

          {/* ============ CONTACT DETAILS ============ */}
          <Section
            icon="bi-telephone-fill"
            title="Contact Details"
            subtitle="Reachable contact information"
            color="#6f42c1"
          >
            <div className="vd-details-grid">
              <DetailItem label="Mobile Number" icon="bi-phone" value={student.mobileNo} />
              <DetailItem label="WhatsApp Number" icon="bi-whatsapp" value={student.whatsAppNo} />
              <DetailItem label="Email ID" icon="bi-envelope" value={student.email} />
            </div>
          </Section>

          {/* ============ ADDRESS DETAILS ============ */}
          <Section
            icon="bi-geo-alt-fill"
            title="Address Details"
            subtitle="Permanent / Correspondence address"
            color="#fd7e14"
          >
            <div className="vd-details-grid">
              <DetailItem label="State" icon="bi-map" value={getName(states, student.stateId)} />
              <DetailItem label="District" icon="bi-building" value={getName(districts, student.districtId)} />
              <DetailItem label="City" icon="bi-geo" value={getName(cities, student.locationId)} />
              <DetailItem label="Pin Code" icon="bi-mailbox" value={student.pincode} />
              <div className="vd-detail full">
                <div className="vd-detail-label">
                  <i className="bi bi-house vd-detail-ico"></i> Address
                </div>
                <div className="vd-detail-value">{value(student.address)}</div>
              </div>
            </div>
          </Section>

          {/* ============ ACADEMIC DETAILS ============ */}
          <Section
            icon="bi-mortarboard-fill"
            title="Academic Details"
            subtitle="Previous qualifications & documents"
            color="#6610f2"
          >
            {academicDetails.length > 0 ? (
              <div className="vd-acad-wrap">
                <table className="vd-acad-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>#</th>
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
                          <span className="vd-badge-num">{index + 1}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: "#0f172a" }}>
                            {value(item.schoolCollege)}
                          </div>
                        </td>
                        <td>
                          <span className="vd-badge-roll">{value(item.rollNo)}</span>
                        </td>
                        <td>{value(item.boardUniversity)}</td>
                        <td>
                          <span className="vd-badge-pct">
                            {value(item.percentageCgpa)}
                          </span>
                        </td>
                        <td>
                          {item.fileName ? (
                            <button
                              type="button"
                              className="vd-pdf-btn vd-no-print"
                              onClick={() =>
                                setPdfModal({
                                  url: `${FILE_URL}${item.fileName}`,
                                  title: `Document - ${item.schoolCollege || "Academic"}`
                                })
                              }
                            >
                              <i className="bi bi-file-earmark-pdf"></i> View PDF
                            </button>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>
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
              <div className="vd-empty-state">
                <div className="ico">
                  <i className="bi bi-mortarboard"></i>
                </div>
                <h6>No Academic Details Found</h6>
                <p>Academic information is not available for this student.</p>
              </div>
            )}
          </Section>

          {/* ============ DOCUMENTS ============ */}
          <Section
            icon="bi-file-earmark-image-fill"
            title="Documents"
            subtitle="Click any document to view in fullscreen"
            color="#dc3545"
          >
            <div className="vd-docs-grid">
              {[
                {
                  title: "Student Photo",
                  src: student.selfImage,
                },
                {
                  title: "Signature",
                  src: student.signatureImage,
                },
                {
                  title: "Aadhaar Front",
                  src: student.aadhaarCardFrant,
                },
                {
                  title: "Aadhaar Back",
                  src: student.aadhaarCardBack,
                },
              ].map((doc, i) => (
                <div
                  key={i}
                  className="vd-doc-card"
                  onClick={() =>
                    doc.src &&
                    setLightbox(`${FILE_URL}${doc.src}`)
                  }
                >
                  <div className="vd-doc-title">{doc.title}</div>
                  {doc.src ? (
                    <img
                      src={`${FILE_URL}${doc.src}`}
                      alt={doc.title}
                      className="vd-doc-img"
                    />
                  ) : (
                    <div className="vd-doc-empty">
                      <i className="bi bi-image"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ============ IMAGE LIGHTBOX ============ */}
        {lightbox && (
          <div className="vd-lightbox" onClick={() => setLightbox(null)}>
            <button
              className="vd-lightbox-close"
              onClick={() => setLightbox(null)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <img src={lightbox} alt="Preview" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* ============ PDF MODAL ============ */}
        {pdfModal && (
          <div className="vd-pdf-modal" onClick={() => setPdfModal(null)}>
            <div className="vd-pdf-container" onClick={(e) => e.stopPropagation()}>
              <div className="vd-pdf-header">
                <h5><i className="bi bi-file-earmark-pdf me-2 text-danger"></i>{pdfModal.title}</h5>
                <div className="vd-pdf-actions">
                   
                  <button className="close-btn" onClick={() => setPdfModal(null)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="vd-pdf-body">
                <iframe src={pdfModal.url} title={pdfModal.title}></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewDetails;