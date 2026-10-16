 import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentCourseById } from "../../AllServicesFiles/CourseService";
import { FILE_URL } from "../../api";

function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
 
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const result = await getStudentCourseById(id);

      // ✅ Response ke different possible structures handle
      let courseData = null;

      if (Array.isArray(result)) {
        courseData = result[0] || null;
      } else if (Array.isArray(result?.data)) {
        courseData = result.data[0] || null;
      } else if (Array.isArray(result?.data?.data)) {
        courseData = result.data.data[0] || null;
      } else if (result?.data && typeof result.data === "object") {
        courseData = result.data;
      } else if (result && typeof result === "object") {
        courseData = result;
      }

      if (!courseData) {
        setError("Course not found.");
        setCourse(null);
      } else {
        setCourse(courseData);
      }
    } catch (err) {
      console.log("Course Error:", err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (fileName) => {
    if (!fileName) return "#";
    if (fileName.startsWith("http")) return encodeURI(fileName);
    const base = FILE_URL.replace(/\/+$/, "");
    return encodeURI(`${base}/${fileName}`);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <style>{`
          .cd-load {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f7f8fc;
          }
          .cd-spinner {
            width: 46px;
            height: 46px;
            border: 4px solid #e0e3ff;
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: cdSpin .8s linear infinite;
          }
          @keyframes cdSpin { to { transform: rotate(360deg); } }
          .cd-load p {
            margin-top: 16px;
            color: #6b7280;
            font-size: 14px;
          }
        `}</style>
        <div className="cd-load">
          <div className="cd-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !course) {
    return (
      <>
        <style>{`
          .cd-err {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
            text-align: center;
            background: #f7f8fc;
          }
          .cd-err-icon {
            width: 80px; height: 80px;
            border-radius: 50%;
            background: #fff0f0;
            color: #e5484d;
            display: flex; align-items: center; justify-content: center;
            font-size: 34px;
            margin-bottom: 18px;
          }
          .cd-err h3 {
            color: #1e293b;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 8px;
          }
          .cd-err p {
            color: #8a94a6;
            font-size: 14px;
            margin: 0 0 20px;
          }
          .cd-err button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 11px 24px;
            background: #6366f1;
            color: #fff;
            border: 0;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(99,102,241,.3);
          }
        `}</style>

        <div className="cd-err">
          <div className="cd-err-icon">
            <i className="fa fa-exclamation-triangle"></i>
          </div>
          <h3>{error || "Course Not Found"}</h3>
          <p>The course you are looking for is not available.</p>
          <button onClick={() => navigate(-1)}>
            <i className="fa fa-arrow-left"></i> Go Back
          </button>
        </div>
      </>
    );
  }

  // =========================
  // MAIN
  // =========================
  const documents = course.productCategoryDocuments || [];

  return (
    <>
      <style>{`
        html, body { background: #f7f8fc; }

        .cstack {
          width: 100%;
          background: #f7f8fc;
          padding: 40px 20px 70px;
          box-sizing: border-box;
        }
        .cstack-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        /* BACK */
        .cstack-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 9px 16px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all .25s ease;
        }
        .cstack-back:hover {
          color: #6366f1;
          border-color: #6366f1;
          transform: translateX(-3px);
        }
        .cstack-back i { color: inherit; }

        /* HERO */
        .cstack-hero {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 22px;
          padding: 38px 34px;
          box-shadow: 0 18px 40px rgba(99,102,241,.28);
          margin-bottom: 22px;
          position: relative;
          overflow: hidden;
        }
        .cstack-hero::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(255,255,255,.22), transparent 70%);
          border-radius: 50%;
        }
        .cstack-hero::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(255,255,255,.14), transparent 70%);
          border-radius: 50%;
        }

        .cstack-hero,
        .cstack-hero * {
          color: #ffffff !important;
        }

        .cstack-hero-inner { position: relative; z-index: 1; }

        .cstack-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,.2);
          border: 1px solid rgba(255,255,255,.35);
          backdrop-filter: blur(6px);
          padding: 7px 15px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .cstack-badge i { font-size: 12px; }

        .cstack-title {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -.3px;
          text-shadow: 0 1px 2px rgba(0,0,0,.12);
        }
        .cstack-hindi {
          margin: 0 0 20px;
          font-size: 14px;
          font-weight: 500;
          opacity: .95;
          line-height: 1.5;
        }

        .cstack-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cstack-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,.2);
          border: 1px solid rgba(255,255,255,.35);
          backdrop-filter: blur(6px);
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
        }
        .cstack-chip i { font-size: 12px; opacity: .95; }

        /* CARD */
        .cstack-card {
          background: #fff;
          border-radius: 18px;
          padding: 26px;
          border: 1px solid #eef1f6;
          box-shadow: 0 6px 22px rgba(15,23,42,.05);
          margin-bottom: 18px;
        }

        .cstack-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid #eef1f6;
        }
        .cstack-head-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .ic-purple { background: #eef1ff; color: #6366f1; }
        .ic-blue   { background: #eaf3ff; color: #2563eb; }
        .ic-green  { background: #e8f8ef; color: #16a34a; }

        .cstack-head h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }

        .cstack-text {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.8;
        }

        /* INFO GRID */
        .cstack-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .cstack-info-box {
          background: #f8fafc;
          border: 1px solid #eef1f6;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all .25s ease;
        }
        .cstack-info-box:hover {
          background: #fff;
          border-color: #c7c9f7;
          box-shadow: 0 6px 16px rgba(99,102,241,.08);
        }
        .cstack-info-box-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #eef1ff;
          color: #6366f1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }
        .cstack-info-box-body { min-width: 0; }
        .cstack-info-box-label {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .5px;
          margin-bottom: 3px;
        }
        .cstack-info-box-value {
          color: #1e293b;
          font-size: 13.5px;
          font-weight: 700;
          line-height: 1.4;
          word-break: break-word;
        }

        /* DOC LIST */
        .cstack-doc {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #eef1f6;
          border-radius: 12px;
          margin-bottom: 10px;
          transition: all .25s ease;
        }
        .cstack-doc:last-child { margin-bottom: 0; }
        .cstack-doc:hover {
          background: #fff;
          border-color: #c7c9f7;
          box-shadow: 0 8px 20px rgba(99,102,241,.1);
          transform: translateY(-2px);
        }
        .cstack-doc-left {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          flex: 1;
        }
        .cstack-doc-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #fff0f0;
          color: #e53935;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .cstack-doc-body { min-width: 0; flex: 1; }
        .cstack-doc-name {
          margin: 0 0 4px;
          color: #1e293b;
          font-size: 13.5px;
          font-weight: 700;
          line-height: 1.4;
        }
        .cstack-doc-file {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* VIEW PDF BUTTON */
        .cstack-view-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          padding: 8px 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff !important;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 30px;
          text-decoration: none !important;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(99,102,241,.3);
          transition: all .3s ease;
          white-space: nowrap;
        }
        .cstack-view-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          transition: left .55s ease;
        }
        .cstack-view-btn:hover::before { left: 100%; }
        .cstack-view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,.5);
        }
        .cstack-view-btn i { color: #fff !important; }

        /* MOBILE */
        @media (max-width: 640px) {
          .cstack { padding: 24px 14px 50px; }
          .cstack-hero { padding: 26px 20px; border-radius: 18px; }
          .cstack-title { font-size: 22px; }
          .cstack-hindi { font-size: 13px; }
          .cstack-badge { font-size: 10px; padding: 6px 12px; }
          .cstack-chip { padding: 7px 12px; font-size: 11.5px; }

          .cstack-card { padding: 20px 18px; border-radius: 14px; }
          .cstack-head h3 { font-size: 14.5px; }
          .cstack-head-icon { width: 36px; height: 36px; font-size: 14px; }

          .cstack-info-grid { grid-template-columns: 1fr; }
          .cstack-info-box { padding: 12px 14px; }

          .cstack-doc {
            flex-direction: column;
            align-items: stretch;
          }
          .cstack-doc-right {
            display: flex;
            justify-content: flex-end;
          }
        }
      `}</style>

      <div className="cstack">
        <div className="cstack-inner">

          {/* BACK */}
          <div className="cstack-back" onClick={() => navigate(-1)}>
            <i className="fa fa-arrow-left"></i>
            Back
          </div>

          {/* HERO */}
          <div className="cstack-hero">
            <div className="cstack-hero-inner">
              <div className="cstack-badge">
                <i className="fa fa-graduation-cap"></i>
                Course Details
              </div>

              <h1 className="cstack-title">{course.name}</h1>

              {course.nameHindi && (
                <p className="cstack-hindi">{course.nameHindi}</p>
              )}

              <div className="cstack-meta">
                {course.code && (
                  <div className="cstack-chip">
                    <i className="fa fa-hashtag"></i>
                    {course.code}
                  </div>
                )}
                {course.durationName && (
                  <div className="cstack-chip">
                    <i className="fa fa-clock-o"></i>
                    Duration: {course.durationName}
                  </div>
                )}
                {course.eligbilty && (
                  <div className="cstack-chip">
                    <i className="fa fa-check-circle"></i>
                    {course.eligbilty}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="cstack-card">
            <div className="cstack-head">
              <span className="cstack-head-icon ic-purple">
                <i className="fa fa-file-text-o"></i>
              </span>
              <h3>Course Overview</h3>
            </div>
            <p className="cstack-text">
              {course.descrption ||
                course.shortDescription ||
                "No overview available for this course."}
            </p>
          </div>

          {/* INFO */}
          <div className="cstack-card">
            <div className="cstack-head">
              <span className="cstack-head-icon ic-blue">
                <i className="fa fa-info-circle"></i>
              </span>
              <h3>Course Information</h3>
            </div>

            <div className="cstack-info-grid">
              <div className="cstack-info-box">
                <div className="cstack-info-box-icon">
                  <i className="fa fa-hashtag"></i>
                </div>
                <div className="cstack-info-box-body">
                  <span className="cstack-info-box-label">Course Code</span>
                  <div className="cstack-info-box-value">
                    {course.code || "-"}
                  </div>
                </div>
              </div>

              <div className="cstack-info-box">
                <div className="cstack-info-box-icon">
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className="cstack-info-box-body">
                  <span className="cstack-info-box-label">Duration</span>
                  <div className="cstack-info-box-value">
                    {course.durationName || "-"}
                  </div>
                </div>
              </div>

              <div className="cstack-info-box">
                <div className="cstack-info-box-icon">
                  <i className="fa fa-check-circle"></i>
                </div>
                <div className="cstack-info-box-body">
                  <span className="cstack-info-box-label">Eligibility</span>
                  <div className="cstack-info-box-value">
                    {course.eligbilty || "-"}
                  </div>
                </div>
              </div>

              <div className="cstack-info-box">
                <div className="cstack-info-box-icon">
                  <i className="fa fa-tag"></i>
                </div>
                <div className="cstack-info-box-body">
                  <span className="cstack-info-box-label">Short Name</span>
                  <div className="cstack-info-box-value">
                    {course.shortName || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SYLLABUS */}
          <div className="cstack-card">
            <div className="cstack-head">
              <span className="cstack-head-icon ic-green">
                <i className="fa fa-book"></i>
              </span>
              <h3>Syllabus & Study Material</h3>
            </div>

            {documents.length > 0 ? (
              documents.map((doc, i) => (
                <div className="cstack-doc" key={doc.id || i}>
                  <div className="cstack-doc-left">
                    <div className="cstack-doc-icon">
                      <i className="fa fa-file-pdf-o"></i>
                    </div>
                    <div className="cstack-doc-body">
                      <h5 className="cstack-doc-name">
                        {doc.name || `Document ${i + 1}`}
                      </h5>
                      {doc.fileupload && (
                        <small className="cstack-doc-file">
                          {doc.fileupload}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="cstack-doc-right">
                    {doc.fileupload ? (
                      <a
                        href={getFileUrl(doc.fileupload)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cstack-view-btn"
                      >
                        <i className="fa fa-eye"></i>
                        View PDF
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>
                        N/A
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="cstack-text">No syllabus available.</p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default CourseDetails;               