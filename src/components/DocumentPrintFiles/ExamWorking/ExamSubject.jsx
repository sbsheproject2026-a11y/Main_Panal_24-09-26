 import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { 
    getSubjects, 
    createNewExam, 
    getSubjectexamlist,
    getSubjectexambyid,
    updateNewExam,
    getSubjectexamdelete
} from "../../AllServicesFiles/CourseService";

function ExamSubjectAndPaper() {
    const { id } = useParams(); 

    const [screen, setScreen] = useState("list"); 
    
    // Subject List States
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Exam List States
    const [examListData, setExamListData] = useState([]);
    const [examLoading, setExamLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // ✅ Modal States
    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [modalQuestionsData, setModalQuestionsData] = useState({ title: "", questions: [] });

    // Paper Form States
    const [paperLoading, setPaperLoading] = useState(false);
    const [editExamId, setEditExamId] = useState(null);
    const [paperFormData, setPaperFormData] = useState({
        title: "", subTitle: "", description: "",
        startTime: "", endTime: "", entryTime: "",
        paperDate: "", totalTimeInMinute: "",
        cousreId: id ? Number(id) : 0,
        subjectId: 0, 
        isActive: 0,
        questiones: [{ question: "", questionMarks: "" }]
    });

    useEffect(() => {
        if (id) {
            setPaperFormData((prev) => ({ ...prev, cousreId: Number(id) }));
            loadSubjects(id);
        }
    }, [id]);

    const totalQuestions = paperFormData.questiones.length;
    const totalMark = useMemo(() => {
        return paperFormData.questiones.reduce(
            (sum, q) => sum + (Number(q.questionMarks) || 0), 
            0
        );
    }, [paperFormData.questiones]);

    // ==========================================
    // API CALLS
    // ==========================================

    const loadSubjects = async (courseId) => {
        try {
            setLoading(true);
            const result = await getSubjects(courseId);
            setData(result?.data || []);
        } catch (error) {
            console.error("List Error:", error);
            alert(error?.response?.data?.message || "Unable to load subjects.");
        } finally {
            setLoading(false);
        }
    };

    const loadSubjectExams = async (subject) => {
        try {
            setExamLoading(true);
            setSelectedSubject(subject);
            const result = await getSubjectexamlist(subject.id);
            setExamListData(result?.data || []);
            setScreen("examList");
        } catch (error) {
            console.error("Exam List Error:", error);
            alert(error?.response?.data?.message || "Unable to load exams.");
        } finally {
            setExamLoading(false);
        }
    };

    const handleEditExam = async (examId) => {
        try {
            setPaperLoading(true);
            const result = await getSubjectexambyid(examId);
            
            const examData = result?.data || result; 

            if (!examData || !examData.id) {
                setPaperLoading(false);
                return alert("Exam data not found. Check console for API response.");
            }

            let formattedDate = "";
            if (examData.paperDate) {
                formattedDate = examData.paperDate.split("T")[0];
            }

            const mappedQuestions = examData.questiones?.map(q => ({
                question: q.question,
                questionMarks: q.questionMarks
            })) || [{ question: "", questionMarks: "" }];

            setPaperFormData({
                title: examData.title || "",
                subTitle: examData.subTitle || "",
                description: examData.description || "",
                startTime: examData.startTime || "",
                endTime: examData.endTime || "",
                entryTime: examData.entryTime || "",
                paperDate: formattedDate,
                totalTimeInMinute: examData.totalTimeInMinute || "",
                cousreId: examData.cousreId || id,
                subjectId: examData.subjectId || selectedSubject?.id,
                isActive: examData.isActive || 0,
                questiones: mappedQuestions.length > 0 ? mappedQuestions : [{ question: "", questionMarks: "" }]
            });

            setEditExamId(examId);
            setScreen("paperForm");
        } catch (error) {
            console.error("Edit Fetch Error:", error);
            alert("Unable to fetch exam details for edit.");
        } finally {
            setPaperLoading(false);
        }
    };

    const handleDeleteExam = async (examId) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        
        try {
            const result = await getSubjectexamdelete(examId);
            alert(result?.message || "Exam deleted successfully!");
            await loadSubjectExams(selectedSubject);
        } catch (error) {
            console.error("Delete Error:", error);
            alert(error?.response?.data?.message || "Failed to delete exam.");
        }
    };

    // ✅ Modal Open Handler
    const handleOpenQuestions = (exam) => {
        setModalQuestionsData({
            title: exam.title,
            questions: exam.questiones || []
        });
        setShowQuestionsModal(true);
    };

    // ==========================================
    // NAVIGATION HANDLERS
    // ==========================================

    const handleViewExams = (subject) => {
        loadSubjectExams(subject);
    };

    const handleOpenCreateForm = () => {
        setEditExamId(null);
        setPaperFormData({
            title: "", subTitle: "", description: "",
            startTime: "", endTime: "", entryTime: "",
            paperDate: "", totalTimeInMinute: "",
            cousreId: id ? Number(id) : 0,
            subjectId: selectedSubject.id,
            isActive: 0,
            questiones: [{ question: "", questionMarks: "" }]
        });
        setScreen("paperForm");
    };

    // ==========================================
    // PAPER FORM HANDLERS
    // ==========================================

    const handlePaperChange = (e) => {
        const { name, value } = e.target;
        setPaperFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (event, editor) => {
        const data = editor.getData();
        setPaperFormData(prev => ({ ...prev, description: data }));
    };

    const handleQuestionChange = (index, field, value) => {
        setPaperFormData(prev => {
            const updated = [...prev.questiones];
            updated[index][field] = value;
            return { ...prev, questiones: updated };
        });
    };

    const addQuestion = () => {
        setPaperFormData(prev => ({ ...prev, questiones: [...prev.questiones, { question: "", questionMarks: "" }] }));
    };

    const removeQuestion = (index) => {
        if (paperFormData.questiones.length === 1) return alert("At least one question required.");
        setPaperFormData(prev => ({ ...prev, questiones: prev.questiones.filter((_, i) => i !== index) }));
    };

    const handlePaperSubmit = async (e) => {
        e.preventDefault();

        if (!paperFormData.title.trim()) return alert("Title is required");
        if (!paperFormData.paperDate) return alert("Paper Date is required");
        if (!paperFormData.startTime) return alert("Start Time is required");
        if (!paperFormData.endTime) return alert("End Time is required");

        const hasEmpty = paperFormData.questiones.some(q => !q.question.trim() || q.questionMarks === "");
        if (hasEmpty) return alert("Please fill all question details and marks.");

        const formatTime = (timeString) => {
            if (!timeString) return null; 
            if (timeString.length === 8) return timeString; 
            return `${timeString}:00`; 
        };

        const payload = {
            id: editExamId || 0,
            title: paperFormData.title,
            subTitle: paperFormData.subTitle,
            description: paperFormData.description,
            startTime: formatTime(paperFormData.startTime),
            endTime: formatTime(paperFormData.endTime),
            entryTime: formatTime(paperFormData.entryTime),
            paperDate: new Date(paperFormData.paperDate).toISOString(),
            totalQuestions: totalQuestions,
            totalMark: totalMark,
            cousreId: Number(paperFormData.cousreId) || 0,
            subjectId: Number(paperFormData.subjectId) || 0, 
            isActive: Number(paperFormData.isActive) || 0,
            totalTimeInMinute: paperFormData.totalTimeInMinute,
            questiones: paperFormData.questiones.map(q => ({
                question: q.question.trim(),
                questionMarks: Number(q.questionMarks)
            }))
        };

        try {
            setPaperLoading(true);
            
            let result;
            if (editExamId) {
                result = await updateNewExam(payload);
            } else {
                result = await createNewExam(payload);
            }
            
            alert(result?.message || (editExamId ? "Exam updated successfully!" : "Exam created successfully!"));
            
            await loadSubjectExams(selectedSubject);
            
        } catch (error) {
            console.error("Submit Error:", error);
            const errMsg = error?.response?.data?.errors 
                ? JSON.stringify(error.response.data.errors) 
                : error?.response?.data?.message || "Failed to save paper.";
            alert(errMsg);
        } finally {
            setPaperLoading(false);
        }
    };

    // ==========================================
    // RENDER: SUBJECT LIST VIEW
    // ==========================================
    if (screen === "list") {
        return (
            <div className="subject-create-page container-fluid py-4">
                <style>{`
                    html, body, #root { width: 100%; max-width: 100%; overflow-x: hidden !important; }
                    .modern-table-responsive { display: block !important; width: 0 !important; min-width: 100% !important; overflow-x: auto !important; border-radius: 8px; }
                    .modern-table-responsive::-webkit-scrollbar { height: 9px; }
                    .modern-table-responsive::-webkit-scrollbar-thumb { background: #c9ced8; border-radius: 10px; }
                    .table { width: auto !important; min-width: 100% !important; table-layout: auto !important; }
                    .table th, .table td { white-space: nowrap !important; vertical-align: middle; }
                    .btn-add-exam { background: #0d6efd; color: white; border: none; border-radius: 6px; font-size: 12px; padding: 6px 12px; font-weight: 500; transition: 0.2s; }
                    .btn-add-exam:hover { background: #0b5ed7; transform: translateY(-1px); color: white; }
                `}</style>

                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <div>
                                <h5 className="card-title mb-1">Exam Subject List</h5>
                                <small className="text-muted">Select a subject to view or add exam papers</small>
                            </div>
                        </div>

                        <div className="modern-table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Code</th>
                                        <th>Title</th>
                                         
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="9" className="text-center py-4">Loading...</td></tr>
                                    ) : data.length === 0 ? (
                                        <tr><td colSpan="9" className="text-center text-muted py-4">No subjects found.</td></tr>
                                    ) : (
                                        data.map((item, index) => (
                                            <tr key={item.id || index}>
                                                <td>{index + 1}</td>
                                                <td>{item.code}</td>
                                                <td className="fw-semibold">{item.title}</td>
                                                 
                                                <td className="text-center">
                                                    <button 
                                                        className="btn-add-exam" 
                                                        onClick={() => handleViewExams(item)}
                                                    >
                                                        <i className="bi bi-journal-text me-1"></i> View / Add Exams
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
        );
    }

    // ==========================================
    // RENDER: EXAM LIST VIEW
    // ==========================================
    if (screen === "examList") {
        return (
            <div className="container-fluid py-4">
                <style>{`
                    .btn-action { height: 32px; width: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; }
                    .modal-questions-list { max-height: 60vh; overflow-y: auto; }
                    .question-item { transition: 0.2s; border-left: 4px solid transparent; }
                    .question-item:hover { background: #f8fafc; border-left-color: #0d6efd; }
                `}</style>
                
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h4 className="fw-bold mb-1">Exams for: <span className="text-primary">{selectedSubject?.title}</span></h4>
                        <p className="text-muted mb-0">Manage all exam papers for this subject</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-light border" onClick={() => setScreen("list")}>
                            <i className="bi bi-arrow-left me-1"></i> Back to Subjects
                        </button>
                        <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                            <i className="bi bi-plus-lg me-1"></i> Create New Exam
                        </button>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        <div className="modern-table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Exam Title</th>
                                        <th>Schedule</th>
                                        <th>Summary</th>
                                        <th>Status</th>
                                        <th className="text-center">Questions</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examLoading ? (
                                        <tr><td colSpan="7" className="text-center py-4">Loading exams...</td></tr>
                                    ) : examListData.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center text-muted py-4">No exams found for this subject. Create a new one!</td></tr>
                                    ) : (
                                        examListData.map((exam, idx) => (
                                            <tr key={exam.id}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                    <div className="fw-semibold text-primary">{exam.title}</div>
                                                    <small className="text-muted">{exam.subTitle}</small>
                                                </td>
                                                <td>
                                                    <div className="small"><i className="bi bi-calendar-event me-1"></i> {exam.paperDate ? new Date(exam.paperDate).toLocaleDateString() : "-"}</div>
                                                    <div className="small text-muted mt-1">
                                                        <i className="bi bi-clock me-1"></i> {exam.startTime} - {exam.endTime}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="badge bg-success mb-1">{exam.totalMark} Marks</div>
                                                    <div className="badge bg-info text-dark">{exam.totalQuestions} Qs</div>
                                                </td>
                                                <td>
                                                    {exam.isActive === 1 ? (
                                                        <span className="badge bg-primary">Active</span>
                                                    ) : (
                                                        <span className="badge bg-secondary">Inactive</span>
                                                    )}
                                                </td>
                                                
                                                {/* ✅ Yahan Button laga diya hai Modal kholne ke liye */}
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-sm btn-outline-info fw-semibold"
                                                        onClick={() => handleOpenQuestions(exam)}
                                                        disabled={!exam.questiones || exam.questiones.length === 0}
                                                    >
                                                        <i className="bi bi-eye me-1"></i> View Qs
                                                    </button>
                                                </td>
                                                
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-outline-primary btn-action me-1" 
                                                        onClick={() => handleEditExam(exam.id)}
                                                        title="Edit Exam"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline-danger btn-action" 
                                                        onClick={() => handleDeleteExam(exam.id)}
                                                        title="Delete Exam"
                                                    >
                                                        <i className="bi bi-trash"></i>
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

                {/* ✅ NAYA: Questions Modal */}
                {showQuestionsModal && (
                    <>
                        <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}></div>
                        <div className="modal fade show d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    
                                    {/* Modal Header */}
                                    <div className="modal-header border-bottom px-4 py-3" style={{ background: "#f8fafc" }}>
                                        <div>
                                            <h5 className="modal-title fw-bold mb-1" style={{ color: "#1e293b" }}>
                                                <i className="bi bi-journal-text text-primary me-2"></i>
                                                {modalQuestionsData.title}
                                            </h5>
                                            <small className="text-muted">Questions List Details</small>
                                        </div>
                                        <button type="button" className="btn-close" onClick={() => setShowQuestionsModal(false)}></button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="modal-body p-4 bg-white">
                                        
                                        {/* Summary Strip */}
                                        <div className="d-flex justify-content-between bg-light p-3 rounded-3 mb-4 border">
                                            <span className="fw-semibold">Total Questions: <span className="text-primary">{modalQuestionsData.questions.length}</span></span>
                                            <span className="fw-semibold">Total Marks: <span className="text-success">
                                                {modalQuestionsData.questions.reduce((sum, q) => sum + (Number(q.questionMarks) || 0), 0)}
                                            </span></span>
                                        </div>

                                        {/* Questions List */}
                                        <div className="modal-questions-list pe-2">
                                            {modalQuestionsData.questions.length > 0 ? (
                                                <div className="d-flex flex-column gap-2">
                                                    {modalQuestionsData.questions.map((q, i) => (
                                                        <div key={i} className="question-item d-flex align-items-start p-3 border rounded-3">
                                                            <div className="me-3 mt-1">
                                                                <span className="badge bg-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "26px", height: "26px" }}>
                                                                    {i + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="fw-semibold text-dark" style={{ fontSize: "14.5px", lineHeight: "1.5" }}>
                                                                    {q.question}
                                                                </div>
                                                            </div>
                                                            <div className="ms-3">
                                                                <span className="badge bg-success" style={{ fontSize: "12.5px" }}>
                                                                    {q.questionMarks} Marks
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-muted py-5">
                                                    <i className="bi bi-inbox fs-1 mb-2 d-block"></i>
                                                    No questions added for this exam yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer border-top px-4 py-3" style={{ background: "#f8fafc" }}>
                                        <button type="button" className="btn btn-secondary px-4" onClick={() => setShowQuestionsModal(false)}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ==========================================
    // RENDER: PAPER FORM VIEW (CREATE / UPDATE)
    // ==========================================
    if (screen === "paperForm") {
        return (
            <div className="paper-create-page container-fluid py-4">
                <style>{`
                    .paper-create-page { background: #f8f9fc; min-height: 100vh; padding-bottom: 50px; }
                    .form-card { border: 0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; }
                    .form-card .card-header { background: #fff; border-bottom: 1px solid #edf0f5; border-radius: 16px 16px 0 0 !important; padding: 18px 24px; }
                    .section-icon { width: 42px; height: 42px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 20px; margin-right: 12px; }
                    .form-control, .form-select { border-radius: 10px; padding: 10px 15px; font-size: 14px; border: 1px solid #e2e8f0; }
                    .table-responsive-custom { overflow-x: auto; border-radius: 10px; border: 1px solid #edf0f5; }
                    .question-table th { background: #f8f9fc; font-size: 12px; text-transform: uppercase; color: #64748b; }
                    .sticky-footer { position: sticky; bottom: 0; background: #fff; padding: 20px 24px; border-top: 1px solid #edf0f5; border-radius: 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.04); display: flex; justify-content: space-between; align-items: center; z-index: 10; }
                    
                    .ck-editor__editable_inline { min-height: 120px; border-radius: 0 0 10px 10px !important; }
                    .ck-toolbar { border-radius: 10px 10px 0 0 !important; }
                `}</style>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                            {editExamId ? "Update Exam Paper" : "Create Exam Paper"}
                        </h3>
                        <p className="text-muted mb-0">
                            For Subject: <span className="text-primary fw-bold">{selectedSubject?.title}</span>
                        </p>
                    </div>
                    <button type="button" className="btn btn-light border" onClick={() => setScreen("examList")}>
                        <i className="bi bi-arrow-left me-2"></i> Back to Exams
                    </button>
                </div>

                <form onSubmit={handlePaperSubmit}>
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="card form-card">
                                <div className="card-header d-flex align-items-center">
                                    <div className="section-icon bg-primary-subtle text-primary"><i className="bi bi-file-earmark-text"></i></div>
                                    <h5 className="mb-0 fw-semibold">Basic Information</h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold">Title <span className="text-danger">*</span></label>
                                            <input type="text" className="form-control" name="title" value={paperFormData.title} onChange={handlePaperChange} placeholder="e.g. Mid-Term Physics Exam" required />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold">Sub Title</label>
                                            <input type="text" className="form-control" name="subTitle" value={paperFormData.subTitle} onChange={handlePaperChange} placeholder="e.g. Session 2026" />
                                        </div>
                                        
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold">Description / Instructions</label>
                                            <div style={{ borderRadius: "10px" }}>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={paperFormData.description}
                                                    onChange={handleDescriptionChange}
                                                    config={{ placeholder: 'Type instructions for students here...' }}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Course ID</label>
                                            <input type="number" className="form-control bg-light" name="cousreId" value={paperFormData.cousreId} readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Subject ID</label>
                                            <input type="number" className="form-control bg-light" name="subjectId" value={paperFormData.subjectId} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card form-card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="section-icon bg-success-subtle text-success"><i className="bi bi-list-check"></i></div>
                                        <h5 className="mb-0 fw-semibold">Questions</h5>
                                    </div>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={addQuestion}>
                                        <i className="bi bi-plus-lg me-1"></i> Add Question
                                    </button>
                                </div>
                                <div className="card-body p-4">
                                    <div className="table-responsive-custom">
                                        <table className="table question-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th width="50">#</th>
                                                    <th>Question Text <span className="text-danger">*</span></th>
                                                    <th width="120">Marks <span className="text-danger">*</span></th>
                                                    <th width="60" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paperFormData.questiones.map((q, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center fw-bold text-muted">{index + 1}</td>
                                                        <td>
                                                            <input type="text" className="form-control" placeholder="Enter question here..." value={q.question} onChange={(e) => handleQuestionChange(index, "question", e.target.value)} required />
                                                        </td>
                                                        <td>
                                                            <input type="number" className="form-control" placeholder="0" min="1" value={q.questionMarks} onChange={(e) => handleQuestionChange(index, "questionMarks", e.target.value)} required />
                                                        </td>
                                                        <td className="text-center">
                                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeQuestion(index)} disabled={paperFormData.questiones.length === 1}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="card form-card">
                                <div className="card-header d-flex align-items-center">
                                    <div className="section-icon bg-warning-subtle text-warning"><i className="bi bi-calendar-event"></i></div>
                                    <h5 className="mb-0 fw-semibold">Schedule & Timing</h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold">Paper Date <span className="text-danger">*</span></label>
                                            <input type="date" className="form-control" name="paperDate" value={paperFormData.paperDate} onChange={handlePaperChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Start Time <span className="text-danger">*</span></label>
                                            <input type="time" step="1" className="form-control" name="startTime" value={paperFormData.startTime} onChange={handlePaperChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">End Time <span className="text-danger">*</span></label>
                                            <input type="time" step="1" className="form-control" name="endTime" value={paperFormData.endTime} onChange={handlePaperChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Entry Time</label>
                                            <input type="time" step="1" className="form-control" name="entryTime" value={paperFormData.entryTime} onChange={handlePaperChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Duration (Minutes)</label>
                                            <input type="text" className="form-control" name="totalTimeInMinute" value={paperFormData.totalTimeInMinute} onChange={handlePaperChange} placeholder="e.g. 180" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card form-card">
                                <div className="card-header d-flex align-items-center">
                                    <div className="section-icon bg-info-subtle text-info"><i className="bi bi-gear"></i></div>
                                    <h5 className="mb-0 fw-semibold">Paper Summary & Status</h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-3 mb-4">
                                        <div className="col-6">
                                            <div className="p-3 rounded-3 text-center" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                                <h3 className="mb-1 fw-bold text-dark">{totalQuestions}</h3>
                                                <span className="text-muted small">Total Questions</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 rounded-3 text-center" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                                <h3 className="mb-1 fw-bold text-success">{totalMark}</h3>
                                                <span className="text-muted small">Total Marks</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold">Status</label>
                                            <select className="form-select" name="isActive" value={paperFormData.isActive} onChange={handlePaperChange}>
                                                <option value={0}>Inactive</option>
                                                <option value={1}>Active</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sticky-footer mt-4">
                        <div className="text-muted small">
                            <i className="bi bi-info-circle me-1"></i> Please review all details before saving.
                        </div>
                        <div>
                            <button type="button" className="btn btn-light border me-3 px-4" onClick={() => setScreen("examList")}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-success px-4" disabled={paperLoading}>
                                {paperLoading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                ) : (
                                    <><i className="bi bi-check2-circle me-2"></i>{editExamId ? "Update Paper" : "Create Paper"}</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    return null;
}

export default ExamSubjectAndPaper;