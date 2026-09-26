 import React, { useEffect, useState } from "react";
import {
  getState,
  getDistrict,
  getCity,
  getGender,
  getEmployeeType,
  getDesignation,
  getDepartment,
  createEmployee
} from "./EmployeeService";
import { useNavigate } from "react-router-dom";

function EmployeeCreate() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [citys, setCitys] = useState([]);
  const [genders, setGenders] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    fatherName: "",
    mobileNo: "",
    whatsAppNo: "",
    email: "",
    idNumber: "",
    selfImage1: null,
    employeeTypeId: 0,
    designationId: 0,
    genderId: 0,
    departmentId: 0,
    dateOfJoining: "",
    stateId: 0,
    districtId: 0,
    locationId: 0,
    address: "",
    pincode: "",
    isActive: 1
  });

  useEffect(() => {
    loadState();
    loadGender();
    loadEmployeeType();
    loadDepartment();
    loadDesignation();
  }, []);

  const loadState = async () => {
    try {
      const result = await getState();
      setStates(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadGender = async () => {
    try {
      const result = await getGender(17);
      setGenders(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadEmployeeType = async () => {
    try {
      const result = await getEmployeeType(19);
      setEmployeeTypes(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDepartment = async () => {
    try {
      const result = await getDepartment(20);
      setDepartments(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDesignation = async () => {
    try {
      const result = await getDesignation(16);
      setDesignations(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDistrict = async (id) => {
    try {
      const result = await getDistrict(id);
      setDistricts(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCity = async (id) => {
    try {
      const result = await getCity(id);
      setCitys(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father Name is required";
    if (!formData.mobileNo.trim()) newErrors.mobileNo = "Mobile No is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const result = await createEmployee(formData);
      alert(result.message);
      navigate("/employee-list");
    } catch (error) {
      console.log(error);
      alert("Unable to create employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="employee-page-header">
        <div>
          <h2>
            <i className="bi bi-person-plus-fill me-2"></i>
            Add Employee
          </h2>
          <p>Enter employee information and create a new employee record.</p>
        </div>
        <button
          type="button"
          className="btn btn-light back-btn"
          onClick={() => navigate("/employee-list")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      <nav className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard">
              <i className="bi bi-house-door me-1"></i>
              Dashboard
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="/employee-list">Employee</a>
          </li>
          <li className="breadcrumb-item active">Add Employee</li>
        </ol>
      </nav>

      <section className="section">
        <div className="employee-card">
          <div className="card-title-area">
            <div className="title-icon">
              <i className="bi bi-person-vcard-fill"></i>
            </div>
            <div>
              <h5>Employee Information</h5>
              <span>Personal, professional and address details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-heading">
                <i className="bi bi-person-fill"></i>
                Personal Information
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <label>Employee Code / Employee ID</label>
                  <div className="input-wrap">
                    <i className="bi bi-upc-scan"></i>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      placeholder="Enter employee code"
                      value={formData.code}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Name <span>*</span></label>
                  <div className="input-wrap">
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Enter employee name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <small className="error">{errors.name}</small>}
                </div>

                <div className="col-md-4 mb-4">
                  <label>Father Name <span>*</span></label>
                  <div className="input-wrap">
                    <i className="bi bi-person-badge"></i>
                    <input
                      type="text"
                      name="fatherName"
                      className={`form-control ${errors.fatherName ? "is-invalid" : ""}`}
                      placeholder="Enter father name"
                      value={formData.fatherName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.fatherName && <small className="error">{errors.fatherName}</small>}
                </div>

                <div className="col-md-4 mb-4">
                  <label>Mobile No <span>*</span></label>
                  <div className="input-wrap">
                    <i className="bi bi-phone"></i>
                    <input
                      type="text"
                      name="mobileNo"
                      className={`form-control ${errors.mobileNo ? "is-invalid" : ""}`}
                      placeholder="Enter mobile number"
                      value={formData.mobileNo}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.mobileNo && <small className="error">{errors.mobileNo}</small>}
                </div>

                <div className="col-md-4 mb-4">
                  <label>Alternate Mobile</label>
                  <div className="input-wrap">
                    <i className="bi bi-whatsapp"></i>
                    <input
                      type="text"
                      name="whatsAppNo"
                      className="form-control"
                      placeholder="Enter alternate mobile"
                      value={formData.whatsAppNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Email <span>*</span></label>
                  <div className="input-wrap">
                    <i className="bi bi-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <small className="error">{errors.email}</small>}
                </div>

                <div className="col-md-4 mb-4">
                  <label>Aadhaar Number / PAN Number</label>
                  <div className="input-wrap">
                    <i className="bi bi-card-text"></i>
                    <input
                      type="text"
                      name="idNumber"
                      className="form-control"
                      placeholder="Enter ID number"
                      value={formData.idNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Profile Photo</label>
                  <div className="input-wrap">
                    <i className="bi bi-camera"></i>
                    <input
                      type="file"
                      name="selfImage1"
                      className="form-control"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Gender</label>
                  <select
                    className="form-select"
                    value={formData.genderId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        genderId: Number(e.target.value)
                      })
                    }
                  >
                    <option value={0}>Select Gender</option>
                    {genders.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-heading">
                <i className="bi bi-briefcase-fill"></i>
                Employment Information
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <label>Employee Type</label>
                  <select
                    className="form-select"
                    value={formData.employeeTypeId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employeeTypeId: Number(e.target.value)
                      })
                    }
                  >
                    <option value={0}>Select Employee Type</option>
                    {employeeTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Department</label>
                  <select
                    className="form-select"
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departmentId: Number(e.target.value)
                      })
                    }
                  >
                    <option value={0}>Select Department</option>
                    {departments.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Designation</label>
                  <select
                    className="form-select"
                    value={formData.designationId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        designationId: Number(e.target.value)
                      })
                    }
                  >
                    <option value={0}>Select Designation</option>
                    {designations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Date of Joining</label>
                  <div className="input-wrap">
                    <i className="bi bi-calendar3"></i>
                    <input
                      type="date"
                      name="dateOfJoining"
                      className="form-control"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label>Employment Status</label>
                  <div className="status-box">
                    <div>
                      <strong>
                        {formData.isActive === 1 ? "Active" : "Inactive"}
                      </strong>
                      <small>
                        {formData.isActive === 1
                          ? "Employee is currently active"
                          : "Employee is currently inactive"}
                      </small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input status-switch"
                        type="checkbox"
                        checked={formData.isActive === 1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked ? 1 : 0
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-heading">
                <i className="bi bi-geo-alt-fill"></i>
                Address Information
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <label>State</label>
                  <select
                    className="form-select"
                    value={formData.stateId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setFormData({
                        ...formData,
                        stateId: id,
                        districtId: 0,
                        locationId: 0
                      });
                      setCitys([]);
                      if (id > 0) loadDistrict(id);
                      else setDistricts([]);
                    }}
                  >
                    <option value={0}>Select State</option>
                    {states.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-4">
                  <label>District</label>
                  <select
                    className="form-select"
                    value={formData.districtId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setFormData({
                        ...formData,
                        districtId: id,
                        locationId: 0
                      });
                      if (id > 0) loadCity(id);
                      else setCitys([]);
                    }}
                  >
                    <option value={0}>Select District</option>
                    {districts.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-4">
                  <label>City</label>
                  <select
                    className="form-select"
                    value={formData.locationId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locationId: Number(e.target.value)
                      })
                    }
                  >
                    <option value={0}>Select City</option>
                    {citys.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-8 mb-4">
                  <label>Address <span>*</span></label>
                  <div className="input-wrap">
                    <i className="bi bi-geo-alt"></i>
                    <input
                      type="text"
                      name="address"
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.address && <small className="error">{errors.address}</small>}
                </div>

                <div className="col-md-4 mb-4">
                  <label>Pincode <span>*</span></label>
                  <div className="input-wrap">
                    <i className="bi bi-pin-map"></i>
                    <input
                      type="text"
                      name="pincode"
                      className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.pincode && <small className="error">{errors.pincode}</small>}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-light cancel-btn"
                onClick={() => navigate("/employee-list")}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Save Employee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        .employee-page-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        }

        .employee-page-header h2 {
          margin:0;
          color:#1e293b;
          font-size:26px;
          font-weight:700;
        }

        .employee-page-header h2 i {
          color:#0d6efd;
        }

        .employee-page-header p {
          margin:6px 0 0;
          color:#64748b;
          font-size:14px;
        }

        .back-btn {
          border:1px solid #e2e8f0;
          border-radius:9px;
          padding:9px 18px;
          color:#475569;
        }

        .breadcrumb {
          font-size:13px;
        }

        .breadcrumb a {
          color:#0d6efd;
          text-decoration:none;
        }

        .employee-card {
          background:#fff;
          border:0;
          border-radius:16px;
          box-shadow:0 5px 25px rgba(15,23,42,.07);
          overflow:hidden;
        }

        .card-title-area {
          display:flex;
          align-items:center;
          gap:14px;
          padding:24px 28px;
          border-bottom:1px solid #eef2f7;
          background:linear-gradient(135deg,#ffffff,#f8fbff);
        }

        .title-icon {
          width:48px;
          height:48px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:12px;
          background:#eaf2ff;
          color:#0d6efd;
          font-size:21px;
        }

        .card-title-area h5 {
          margin:0 0 4px;
          font-weight:700;
          color:#1e293b;
        }

        .card-title-area span {
          color:#94a3b8;
          font-size:13px;
        }

        .form-section {
          padding:26px 28px 8px;
        }

        .section-heading {
          display:flex;
          align-items:center;
          gap:9px;
          color:#1e293b;
          font-size:15px;
          font-weight:700;
          margin-bottom:22px;
          padding-bottom:12px;
          border-bottom:1px solid #edf1f5;
        }

        .section-heading i {
          color:#0d6efd;
        }

        .form-section label {
          display:block;
          font-size:13px;
          font-weight:600;
          color:#334155;
          margin-bottom:8px;
        }

        .form-section label span {
          color:#dc3545;
        }

        .form-control,
        .form-select {
          min-height:43px;
          border:1px solid #dce3eb;
          border-radius:8px;
          color:#334155;
          font-size:14px;
          box-shadow:none;
          transition:.2s;
        }

        .form-control:focus,
        .form-select:focus {
          border-color:#86b7fe;
          box-shadow:0 0 0 3px rgba(13,110,253,.08);
        }

        .input-wrap {
          position:relative;
        }

        .input-wrap > i {
          position:absolute;
          left:13px;
          top:50%;
          transform:translateY(-50%);
          color:#94a3b8;
          z-index:2;
          pointer-events:none;
        }

        .input-wrap .form-control {
          padding-left:38px;
        }

        .input-wrap input[type="file"] {
          padding-left:38px;
        }

        .error {
          display:block;
          color:#dc3545;
          font-size:12px;
          margin-top:5px;
        }

        .status-box {
          min-height:43px;
          border:1px solid #dce3eb;
          border-radius:8px;
          padding:7px 12px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          background:#fafcff;
        }

        .status-box strong {
          display:block;
          font-size:13px;
          color:#334155;
        }

        .status-box small {
          display:block;
          color:#94a3b8;
          font-size:10px;
        }

        .status-switch {
          width:42px !important;
          height:22px;
          cursor:pointer;
        }

        .form-actions {
          display:flex;
          justify-content:flex-end;
          gap:10px;
          padding:20px 28px 26px;
          margin-top:10px;
          border-top:1px solid #eef2f7;
          background:#fbfcfe;
        }

        .cancel-btn,
        .submit-btn {
          min-width:130px;
          min-height:42px;
          border-radius:8px;
          font-size:14px;
          font-weight:600;
        }

        .cancel-btn {
          border:1px solid #dce3eb;
          color:#475569;
        }

        .submit-btn {
          box-shadow:0 5px 12px rgba(13,110,253,.18);
        }

        @media(max-width:768px) {
          .employee-page-header {
            align-items:flex-start;
            gap:15px;
          }

          .employee-page-header h2 {
            font-size:21px;
          }

          .back-btn {
            padding:7px 12px;
          }

          .card-title-area,
          .form-section,
          .form-actions {
            padding-left:18px;
            padding-right:18px;
          }

          .form-actions {
            flex-direction:column-reverse;
          }

          .cancel-btn,
          .submit-btn {
            width:100%;
          }
        }
      `}</style>
    </>
  );
}

export default EmployeeCreate;
