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

      setAcademicDetails(
        Array.isArray(academicData) ? academicData : []
      );

      await Promise.all([
        loadStates(),
        loadGenders(),
        loadCasteCategories(),
        loadCourseTypes(),
        loadSessions(),
      ]);

      if (data.stateId > 0) {
        await loadDistricts(data.stateId);
      }

      if (data.districtId > 0) {
        await loadCities(data.districtId);
      }

      if (data.courseTypeId > 0) {
        await loadCourseCategories(data.courseTypeId);
      }

      if (data.courseCategoryId > 0) {
        await loadCourses(data.courseCategoryId);
      }
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

  const loadCourses = async (courseCategoryId) => {
    try {
      const result = await getCourse(courseCategoryId);
      setCourses(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getName = (list, id) => {
    const item = list.find(
      (x) => Number(x.id) === Number(id)
    );

    return item?.name || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const value = (data) => {
    return data !== null &&
      data !== undefined &&
      String(data).trim() !== ""
      ? data
      : "-";
  };

  const DetailItem = ({ label, value: itemValue }) => (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="text-muted small mb-1">
        {label}
      </div>

      <div
        className="fw-semibold"
        style={{
          color: "#1e293b",
          fontSize: "15px",
        }}
      >
        {value(itemValue)}
      </div>
    </div>
  );

  const Section = ({
    icon,
    title,
    color = "#198754",
    children,
  }) => (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">

        <div className="d-flex align-items-center mb-4">

          <div
            className="d-flex align-items-center justify-content-center me-3"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              background: `${color}15`,
              color: color,
              fontSize: "21px",
            }}
          >
            <i className={`bi ${icon}`}></i>
          </div>

          <div>
            <h5
              className="mb-1 fw-bold"
              style={{
                color: "#1e293b",
              }}
            >
              {title}
            </h5>

            <div
              style={{
                width: "40px",
                height: "3px",
                background: color,
                borderRadius: "5px",
              }}
            ></div>
          </div>

        </div>

        {children}

      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">

          <div
            className="spinner-border text-success"
            role="status"
          ></div>

          <p className="text-muted mt-3">
            Loading student details...
          </p>

        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container-fluid py-5">

        <div className="text-center">

          <div
            className="alert alert-danger"
            style={{
              borderRadius: "12px",
            }}
          >
            Student details not found.
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Go Back
          </button>

        </div>

      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h1 className="fw-bold mb-1">
              Student Details
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
                  View Details
                </li>

              </ol>
            </nav>

          </div>

        

        </div>

      </div>

      <section className="section">

        <div className="container-fluid px-0">

          {/* Profile Header */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                height: "110px",
                background:
                  "linear-gradient(135deg, #198754, #20c997)",
              }}
            ></div>

            <div className="card-body px-4 pb-4">

              <div
                className="d-flex flex-column flex-md-row align-items-center align-items-md-end"
                style={{
                  marginTop: "-65px",
                }}
              >

                <div
                  className="bg-white p-2 shadow"
                  style={{
                    borderRadius: "18px",
                  }}
                >

                  {student.selfImageShow ? (

                    <img
                         src={`${FILE_URL}${student.selfImageShow}`} 
                      alt="Student"
                      style={{
                        width: "125px",
                        height: "125px",
                        objectFit: "cover",
                        borderRadius: "14px",
                      }}
                    />

                  ) : (

                    <div
                      className="d-flex align-items-center justify-content-center bg-light"
                      style={{
                        width: "125px",
                        height: "125px",
                        borderRadius: "14px",
                      }}
                    >
                      <i
                        className="bi bi-person text-muted"
                        style={{
                          fontSize: "55px",
                        }}
                      ></i>
                    </div>

                  )}

                </div>

                <div className="ms-md-4 mt-3 mt-md-0 flex-grow-1">

                  <div className="d-flex align-items-center gap-2 flex-wrap">

                    <h2 className="fw-bold mb-1">
                      {value(student.name)}
                    </h2>

                    {student.isActive === 1 && (
                      <span className="badge bg-success">
                        Active
                      </span>
                    )}

                  </div>

                  <div className="text-muted">
                    {value(student.code)}
                  </div>

                  {student.studentNameHindi && (
                    <div
                      className="mt-1"
                      style={{
                        fontSize: "16px",
                        color: "#475569",
                      }}
                    >
                      {student.studentNameHindi}
                    </div>
                  )}

                </div>

                <div className="mt-3 mt-md-0">

                  <div
                    className="px-3 py-2"
                    style={{
                      background: "#f0fdf4",
                      color: "#198754",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    <i className="bi bi-person-badge me-2"></i>
                    Student
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Course Details */}
          <Section
            icon="bi-book"
            title="Course Details"
            color="#198754"
          >

            <div className="row">

              <DetailItem
                label="Programme"
                value={getName(
                  courseTypes,
                  student.courseTypeId
                )}
              />

              <DetailItem
                label="Course Category"
                value={getName(
                  courseCategories,
                  student.courseCategoryId
                )}
              />

              <DetailItem
                label="Course"
                value={getName(
                  courses,
                  student.courseId
                )}
              />

              <DetailItem
                label="Exam Session"
                value={getName(
                  sessions,
                  student.examSessionId
                )}
              />

              <DetailItem
                label="Student Code"
                value={student.code}
              />

            </div>

          </Section>

          {/* Personal Details */}
          <Section
            icon="bi-person"
            title="Personal Details"
            color="#0d6efd"
          >

            <div className="row">

              <DetailItem
                label="Full Name"
                value={student.name}
              />

              <DetailItem
                label="Name in Hindi"
                value={student.studentNameHindi}
              />

              <DetailItem
                label="Father Name"
                value={student.fatherName}
              />

              <DetailItem
                label="Father Name in Hindi"
                value={student.fatherNameHindi}
              />

              <DetailItem
                label="Mother Name"
                value={student.motherName}
              />

              <DetailItem
                label="Date of Birth"
                value={formatDate(student.doB1)}
              />

              <DetailItem
                label="Gender"
                value={getName(
                  genders,
                  student.genderId
                )}
              />

              <DetailItem
                label="Caste Category"
                value={getName(
                  casteCategories,
                  student.casteCategoryId
                )}
              />

              <DetailItem
                label="Aadhaar Number"
                value={student.idNumber}
              />

            </div>

          </Section>

          {/* Contact Details */}
          <Section
            icon="bi-telephone"
            title="Contact Details"
            color="#6f42c1"
          >

            <div className="row">

              <DetailItem
                label="Mobile Number"
                value={student.mobileNo}
              />

              <DetailItem
                label="WhatsApp Number"
                value={student.whatsAppNo}
              />

              <DetailItem
                label="Email ID"
                value={student.email}
              />

            </div>

          </Section>

          {/* Address Details */}
          <Section
            icon="bi-geo-alt"
            title="Address Details"
            color="#fd7e14"
          >

            <div className="row">

              <DetailItem
                label="State"
                value={getName(
                  states,
                  student.stateId
                )}
              />

              <DetailItem
                label="District"
                value={getName(
                  districts,
                  student.districtId
                )}
              />

              <DetailItem
                label="City"
                value={getName(
                  cities,
                  student.locationId
                )}
              />

              <DetailItem
                label="Pin Code"
                value={student.pincode}
              />

              <div className="col-md-12 mb-2">

                <div className="text-muted small mb-1">
                  Address
                </div>

                <div className="fw-semibold">
                  {value(student.address)}
                </div>

              </div>

            </div>

          </Section>

          {/* Academic Details */}
          <Section
            icon="bi-mortarboard-fill"
            title="Academic Details"
            color="#6610f2"
          >

            {academicDetails.length > 0 ? (

              <div className="table-responsive">

                <table
                  className="table table-bordered table-hover align-middle mb-0"
                >

                  <thead
                    style={{
                      background:
                        "linear-gradient(90deg, #6610f2, #8540f5)",
                      color: "#fff",
                    }}
                  >

 
                    <tr>

                      <th
                        style={{
                          width: "60px",
                        }}
                      >
                        #
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
                            item.id || index
                          }
                        >

                          <td className="fw-semibold">
                            {index + 1}
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
                                fontSize: "13px",
                                padding: "7px 12px",
                              }}
                            >
                              {value(
                                item.percentageCgpa
                              )}
                            </span>

                          </td>

                          <td>

                            {item.fileName ? (

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                               onClick={() => {
    window.open(`${FILE_URL}${item.fileName}`, "_blank", "noopener,noreferrer");
}}
                              >
                                <i className="bi bi-file-earmark-pdf me-1"></i>
                                View PDF
                              </button>

                            ) : (

                              <span className="text-muted">
                                No Document
                              </span>

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
                  borderRadius: "12px",
                }}
              >

                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#f1f5f9",
                  }}
                >

                  <i
                    className="bi bi-mortarboard text-muted"
                    style={{
                      fontSize: "28px",
                    }}
                  ></i>

                </div>

                <h6 className="fw-semibold">
                  No Academic Details Found
                </h6>

                <p className="text-muted small mb-0">
                  Academic information is not available
                  for this student.
                </p>

              </div>

            )}

          </Section>

          {/* Documents */}
          <Section
            icon="bi-file-earmark-image"
            title="Documents"
            color="#dc3545"
          >

            <div className="row g-4">

              {/* Student Photo */}
              <div className="col-md-6 col-lg-3">

                <div
                  className="border rounded-3 p-3 text-center h-100"
                  style={{
                    background: "#fafafa",
                  }}
                >

                  <div className="fw-semibold mb-3">
                    Student Photo
                  </div>

                  {student.selfImageShow ? (

                    <img
                     src={`${FILE_URL}${student.selfImageShow}`}
                   
                      alt="Student"
                      className="img-fluid"
                      style={{
                        height: "180px",
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />

                  ) : (

                    <div className="text-muted py-5">
                      No Image
                    </div>

                  )}

                </div>

              </div>

              {/* Signature */}
              <div className="col-md-6 col-lg-3">

                <div
                  className="border rounded-3 p-3 text-center h-100"
                  style={{
                    background: "#fafafa",
                  }}
                >

                  <div className="fw-semibold mb-3">
                    Signature
                  </div>

                  {student.signatureImageShow ? (

                    <img
                     
                        src={`${FILE_URL}${student.signatureImageShow}`}
                      alt="Signature"
                      className="img-fluid"
                      style={{
                        height: "180px",
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />

                  ) : (

                    <div className="text-muted py-5">
                      No Image
                    </div>

                  )}

                </div>

              </div>

              {/* Aadhaar Front */}
              <div className="col-md-6 col-lg-3">

                <div
                  className="border rounded-3 p-3 text-center h-100"
                  style={{
                    background: "#fafafa",
                  }}
                >

                  <div className="fw-semibold mb-3">
                    Aadhaar Front
                  </div>

                  {student.aadhaarCardFrantShow ? (

                    <img
                   
                       src={`${FILE_URL}${student.aadhaarCardFrantShow}`}
                      alt="Aadhaar Front"
                      className="img-fluid"
                      style={{
                        height: "180px",
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />

                  ) : (

                    <div className="text-muted py-5">
                      No Image
                    </div>

                  )}

                </div>

              </div>

              {/* Aadhaar Back */}
              <div className="col-md-6 col-lg-3">

                <div
                  className="border rounded-3 p-3 text-center h-100"
                  style={{
                    background: "#fafafa",
                  }}
                >

                  <div className="fw-semibold mb-3">
                    Aadhaar Back
                  </div>

                  {student.aadhaarCardBackShow ? (

                    <img
                    
                        src={`${FILE_URL}${student.aadhaarCardBackShow}`}
                      alt="Aadhaar Back"
                      className="img-fluid"
                      style={{
                        height: "180px",
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />

                  ) : (

                    <div className="text-muted py-5">
                      No Image
                    </div>

                  )}

                </div>

              </div>

            </div>

          </Section>

          

        </div>

      </section>
    </>
  );
}

export default ViewDetails;
