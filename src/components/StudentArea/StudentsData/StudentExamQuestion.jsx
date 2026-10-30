 import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStudentexamquestion, getStudentexamEnd } from "../../AllServicesFiles/StudentService";

function StudentExamQuestion() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const paperId = state.examId || sessionStorage.getItem("currentPaperId");
  const userId = state.userId || sessionStorage.getItem("currentUserId");
  const description = state.description || sessionStorage.getItem("currentDescription") || "";

  if (!paperId && !userId) {
    navigate("/student-dashboard", { replace: true });
  }

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [paperAttemptId, setPaperAttemptId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (paperId && userId) {
      sessionStorage.setItem("currentPaperId", paperId);
      sessionStorage.setItem("currentUserId", userId);
      if (description) sessionStorage.setItem("currentDescription", description);

      let cancelled = false;

      (async () => {
        try {
          setLoading(true);
          setError("");
          
          const res = await getStudentexamquestion(paperId, userId);
          
          if (!cancelled) {
            const fetchedQuestions = res?.Data || res?.data || [];
            setQuestions(fetchedQuestions);

            const entry = res?.Entrydata || res?.entrydata;
            const attemptId = entry?.Id || entry?.id || entry?.PaperAttemptId || entry?.paperAttemptId || entry?.AttemptId || entry?.attemptId;
            
            if (attemptId) setPaperAttemptId(attemptId);
          }
        } catch (err) {
          if (!cancelled) setError("Failed to load exam questions. Please check your connection.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();

      return () => { cancelled = true; };
    }
  }, [paperId, userId, description]);

  useEffect(() => {
    if (isSuccess) {
      window.history.pushState(null, "", window.location.href);

      const handleBackButton = (event) => {
        navigate("/student-dashboard", { replace: true });
      };

      window.addEventListener("popstate", handleBackButton);

      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }
  }, [isSuccess, navigate]);

  // ✅ 2MB File Size Check Handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 2MB = 2 * 1024 * 1024 bytes
      if (file.size > 2 * 1024 * 1024) {
        setSubmitMessage("File size exceeds the 2MB limit. Please upload a smaller file.");
        setSelectedFile(null); 
        e.target.value = null; 
        return;
      }

      setSelectedFile(file);
      setSubmitMessage(""); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setSubmitMessage("Please select a file before submitting.");
      return;
    }
    
    // Extra check (Submit karte waqt bhi 2MB check ho jaye)
    if (selectedFile.size > 2 * 1024 * 1024) {
      setSubmitMessage("File size exceeds the 2MB limit. Please upload a smaller file.");
      return;
    }

    if (!paperAttemptId) {
      setSubmitMessage("Paper Attempt ID is missing. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const formData = new FormData();
      formData.append("PaperId", paperId);
      formData.append("UserId", userId);
      formData.append("AttemptId", paperAttemptId); 
      formData.append("Path1", selectedFile);       

      const response = await getStudentexamEnd(formData);

      if (response.Success || response.success) {
        sessionStorage.removeItem("currentPaperId");
        sessionStorage.removeItem("currentUserId");
        sessionStorage.removeItem("currentDescription");
        setIsSuccess(true);
      } else {
        setSubmitMessage(response.Message || response.message || "Failed to submit exam.");
      }

    } catch (err) {
      console.error("Submit Error Details:", err.response?.data || err);
      const backendError = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(", ") 
        : "Failed to submit the exam. Please try again.";
      setSubmitMessage(backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div 
        style={{ 
          position: "fixed", 
          top: 0, left: 0, width: "100vw", height: "100vh", 
          backgroundColor: "#f4f7fb",
          zIndex: 9999, 
          display: "flex", justifyContent: "center", alignItems: "center" 
        }}
      >
        <div className="text-center p-4" style={{ maxWidth: "450px", width: "100%" }}>
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "7rem", filter: "drop-shadow(0px 4px 10px rgba(25, 135, 84, 0.3))" }}></i>
          </div>
          <h2 className="fw-bold mb-4 text-dark">Your Exam is successfully submitted</h2>
          <button 
            onClick={() => navigate("/student-dashboard", { replace: true })}
            className="btn btn-primary btn-lg w-100 fw-bold py-3 mt-3"
            style={{ borderRadius: "12px", fontSize: "1.1rem", boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)" }}
          >
            Go to Dashboard <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .exam-description-content { font-size: 0.95rem; line-height: 1.7; color: #444; }
        .exam-description-content h4, .exam-description-content strong { font-size: 1.05rem; color: #0d6efd; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 5px; }
        .exam-description-content p { margin-bottom: 10px; }
        .exam-description-content br { content: ""; display: block; margin-bottom: 5px; }
        .exam-table thead th { background-color: #f8f9fa; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; color: #555; border-bottom: 2px solid #dee2e6; }
        .exam-table tbody tr:hover { background-color: #f1f8ff; }
      `}</style>

      <div className="container py-4" style={{ maxWidth: "1000px", marginTop: "60px" }}>
        
        {/* DESCRIPTION CARD */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white border-bottom pt-3 pb-2">
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center">
              <i className="bi bi-journal-text text-primary me-2 fs-5"></i> 
              Exam Description / Instructions
            </h5>
          </div>
          <div className="card-body p-4">
            {description ? (
              <div className="exam-description-content" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-muted mb-0">No description provided for this exam.</p>
            )}
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Loading questions...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger shadow-sm border-0">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {!loading && !error && questions.length === 0 && (
          <div className="alert alert-info shadow-sm border-0">
            <i className="bi bi-info-circle me-2"></i> No questions available for this exam.
          </div>
        )}

        {/* QUESTIONS TABLE */}
        {!loading && !error && questions.length > 0 && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-0">
              <div className="table-responsive rounded">
                <table className="table table-bordered table-hover mb-0 align-middle exam-table">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center py-3" style={{ width: "80px" }}>Q. No.</th>
                      <th scope="col" className="py-3 ps-4">Question Details</th>
                      <th scope="col" className="text-center py-3" style={{ width: "120px" }}>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, index) => (
                      <tr key={q.id || index}>
                        <td className="text-center fw-bold text-primary py-3 fs-6">{index + 1}</td>
                        <td className="py-3 ps-4" style={{ fontSize: "1rem" }}>
                          <span dangerouslySetInnerHTML={{ __html: q.questionText || q.question || "Question" }} />
                        </td>
                        <td className="text-center fw-semibold text-dark py-3">
                          {q.questionMarks || q.marks || q.maxMarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD & SUBMIT SECTION */}
        {!loading && !error && questions.length > 0 && (
          <div className="card shadow-sm border-0 mb-5">
            <div className="card-body p-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-cloud-arrow-up text-primary me-2"></i> Submit Your Answers
              </h5>

              {paperAttemptId && (
                 <div className="alert alert-success py-2 mb-3 border-0">
                   <small><i className="bi bi-check-circle-fill me-1"></i> Ready to submit</small>
                 </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row align-items-end">
                  <div className="col-md-8 mb-3 mb-md-0">
                    <label htmlFor="answerFile" className="form-label fw-semibold text-muted">
                      {/* ✅ Label me 2MB kar diya */}
                      Upload Answer Sheet (PDF, DOCX, JPG - Max 2MB)
                    </label>
                    <input 
                      className="form-control form-control-lg" 
                      type="file" 
                      id="answerFile" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    {selectedFile && (
                      <small className="text-success mt-2 d-block fw-semibold">
                        <i className="bi bi-check-circle-fill me-1"></i> Selected: {selectedFile.name}
                      </small>
                    )}
                  </div>
                  <div className="col-md-4 text-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                      disabled={isSubmitting || !paperAttemptId}
                    >
                      {isSubmitting ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
                      ) : (
                        <>Submit Exam <i className="bi bi-send ms-2"></i></>
                      )}
                    </button>
                  </div>
                </div>
                {submitMessage && (
                  <div className={`alert mt-3 mb-0 ${submitMessage.includes("success") ? "alert-success" : "alert-danger"}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StudentExamQuestion;