 import React, { useEffect, useState } from "react";
import {
  getState,
  getDistrict,
  getCity,
  getGender,
  getEmployeeType,
  getDesignation,
  getDepartment,
  getEmployeeById,
  updateEmployee
} from "./EmployeeService";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [citys, setCitys] = useState([]);
  const [genders, setGenders] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    name: "",
    fatherName: "",
    mobileNo: "",
    whatsAppNo: "",
    email: "",
    idNumber: "",
    selfImage1: null,
    selfImage: "",
    selfImageShow: "",
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
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [
        stateResult,
        genderResult,
        employeeTypeResult,
        departmentResult,
        designationResult
      ] = await Promise.all([
        getState(),
        getGender(17),
        getEmployeeType(19),
        getDepartment(20),
        getDesignation(16)
      ]);

      setStates(stateResult?.data || []);
      setGenders(genderResult?.data || []);
      setEmployeeTypes(employeeTypeResult?.data || []);
      setDepartments(departmentResult?.data || []);
      setDesignations(designationResult?.data || []);

      if (id) {
        await loadEmployee(id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployee = async (employeeId) => {
    try {
      const result = await getEmployeeById(employeeId);

      const employee = result?.data || result;

      setFormData({
        id: employee?.id ?? 0,
        code: employee?.code ?? "",
        name: employee?.name ?? "",
        fatherName: employee?.fatherName ?? "",
        locationId: employee?.locationId ?? 0,
        districtId: employee?.districtId ?? 0,
        employeeTypeId: employee?.employeeTypeId ?? 0,
        departmentId: employee?.departmentId ?? 0,
        designationId: employee?.designationId ?? 0,
        genderId: employee?.genderId ?? 0,
        dateOfJoining: employee?.dateofJoining1 ?? employee?.dateOfJoining ?? "",
        stateId: employee?.stateId ?? 0,
        address: employee?.address ?? "",
        pincode: employee?.pincode ?? "",
        mobileNo: employee?.mobileNo ?? "",
        selfImage: employee?.selfImage ?? "",
        selfImageShow: employee?.selfImageShow ?? "",
        idNumber: employee?.idNumber ?? "",
        whatsAppNo: employee?.whatsAppNo ?? "",
        email: employee?.email ?? "",
        isActive: employee?.isActive ?? 1,
        selfImage1: null
      });

      if (employee?.stateId > 0) {
        await loadDistrict(employee.stateId);
      }

      if (employee?.districtId > 0) {
        await loadCity(employee.districtId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadDistrict = async (stateId) => {
    try {
      const result = await getDistrict(stateId);
      setDistricts(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCity = async (districtId) => {
    try {
      const result = await getCity(districtId);
      setCitys(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleNumberChange = (name, maxLength) => (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSelectChange = (name) => (e) => {
    const value = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.fatherName?.trim()) {
      newErrors.fatherName = "Father Name is required";
    }

    if (!formData.mobileNo?.trim()) {
      newErrors.mobileNo = "Mobile No is required";
    } else if (formData.mobileNo.length !== 10) {
      newErrors.mobileNo = "Enter valid 10 digit mobile number";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email Id is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter valid email address";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }

    if (formData.pincode && formData.pincode.length !== 6) {
      newErrors.pincode = "Enter valid 6 digit pincode";
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
      setSubmitting(true);

      const result = await updateEmployee(formData);

      alert(result.message);
      navigate("/employee-list");
    } catch (error) {
      console.log(error);
      alert("Unable to update employee.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="employee-page-header mb-4">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-person-vcard-fill text-primary me-2"></i>
            Update Employee
          </h2>
          <p className="text-muted mb-0">
            Update employee information and profile details
          </p>
        </div>

        <div className="employee-card">
          <div className="loading-box">
            <div className="spinner-border text-primary"></div>
            <div className="text-muted mt-3">Loading employee details...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="employee-page-header mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-person-vcard-fill text-primary me-2"></i>
            Update Employee
          </h2>
          <p className="text-muted mb-0">
            Update employee information and profile details
          </p>
        </div>

        <nav className="mt-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/dashboard" className="text-decoration-none">
                <i className="bi bi-house-door me-1"></i>
                Dashboard
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/employee-list" className="text-decoration-none">
                Employee
              </a>
            </li>
            <li className="breadcrumb-item active">Update</li>
          </ol>
        </nav>
      </div>

      <section>
        <div className="employee-card">
          <div className="employee-card-header">
            <div>
              <h5 className="mb-1 fw-bold">
                <i className="bi bi-pencil-square text-primary me-2"></i>
                Employee Information
              </h5>
              <span>
                Update the details below and save your changes
              </span>
            </div>

            <div className="employee-id-badge">
              <i className="bi bi-hash"></i>
              {formData.id}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="employee-form-body">
              <div className="form-section-title">
                <span className="section-icon">
                  <i className="bi bi-person-fill"></i>
                </span>
                Personal Information
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <label className="modern-label">Employee Code / ID</label>
                  <div className="input-wrapper">
                    <i className="bi bi-upc-scan"></i>
                    <input
                      type="text"
                      name="code"
                      className="modern-input"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="Enter employee code"
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">
                    Name <span>*</span>
                  </label>
                  <div className={`input-wrapper ${errors.name ? "input-error" : ""}`}>
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      name="name"
                      className="modern-input"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter employee name"
                    />
                  </div>
                  {errors.name && <div className="error-text">{errors.name}</div>}
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">
                    Father Name <span>*</span>
                  </label>
                  <div className={`input-wrapper ${errors.fatherName ? "input-error" : ""}`}>
                    <i className="bi bi-person-badge"></i>
                    <input
                      type="text"
                      name="fatherName"
                      className="modern-input"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="Enter father name"
                    />
                  </div>
                  {errors.fatherName && (
                    <div className="error-text">{errors.fatherName}</div>
                  )}
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">
                    Mobile No <span>*</span>
                  </label>
                  <div className={`input-wrapper ${errors.mobileNo ? "input-error" : ""}`}>
                    <i className="bi bi-telephone"></i>
                    <input
                      type="text"
                      name="mobileNo"
                      className="modern-input"
                      value={formData.mobileNo}
                      maxLength={10}
                      onChange={handleNumberChange("mobileNo", 10)}
                      placeholder="10 digit mobile number"
                    />
                  </div>
                  {errors.mobileNo && (
                    <div className="error-text">{errors.mobileNo}</div>
                  )}
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">Alternate Mobile</label>
                  <div className="input-wrapper">
                    <i className="bi bi-whatsapp"></i>
                    <input
                      type="text"
                      name="whatsAppNo"
                      className="modern-input"
                      value={formData.whatsAppNo}
                      maxLength={10}
                      onChange={handleNumberChange("whatsAppNo", 10)}
                      placeholder="Alternate mobile number"
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">
                    Email <span>*</span>
                  </label>
                  <div className={`input-wrapper ${errors.email ? "input-error" : ""}`}>
                    <i className="bi bi-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      className="modern-input"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <div className="error-text">{errors.email}</div>
                  )}
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">
                    Aadhaar / PAN Number
                  </label>
                  <div className="input-wrapper">
                    <i className="bi bi-credit-card-2-front"></i>
                    <input
                      type="text"
                      name="idNumber"
                      className="modern-input"
                      value={formData.idNumber}
                      maxLength={12}
                      onChange={handleNumberChange("idNumber", 12)}
                      placeholder="Enter ID number"
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">Gender</label>
                  <div className="select-wrapper">
                    <i className="bi bi-gender-ambiguous"></i>
                    <select
                      className="modern-select"
                      value={formData.genderId}
                      onChange={handleSelectChange("genderId")}
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

                <div className="col-md-4 mb-4">
                  <label className="modern-label">Date of Joining</label>
                  <div className="input-wrapper">
                    <i className="bi bi-calendar-event"></i>
                    <input
                      type="date"
                      name="dateOfJoining"
                      className="modern-input"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-title mt-2">
                <span className="section-icon">
                  <i className="bi bi-briefcase-fill"></i>
                </span>
                Employment Information
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <label className="modern-label">Employee Type</label>
                  <div className="select-wrapper">
                    <i className="bi bi-person-workspace"></i>
                    <select
                      className="modern-select"
                      value={formData.employeeTypeId}
                      onChange={handleSelectChange("employeeTypeId")}
                    >
                      <option value={0}>Select Employee Type</option>
                      {employeeTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">Department</label>
                  <div className="select-wrapper">
                    <i className="bi bi-diagram-3"></i>
                    <select
                      className="modern-select"
                      value={formData.departmentId}
                      onChange={handleSelectChange("departmentId")}
                    >
                      <option value={0}>Select Department</option>
                      {departments.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">Designation</label>
                  <div className="select-wrapper">
                    <i className="bi bi-award"></i>
                    <select
                      className="modern-select"
                      value={formData.designationId}
                      onChange={handleSelectChange("designationId")}
                    >
                      <option value={0}>Select Designation</option>
                      {designations.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">Employment Status</label>
                  <div className="status-card">
                    <div>
                      <div className="status-title">
                        {formData.isActive === 1 ? "Active" : "Inactive"}
                      </div>
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
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked ? 1 : 0
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section-title mt-2">
                <span className="section-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </span>
                Address Information
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <label className="modern-label">State</label>
                  <div className="select-wrapper">
                    <i className="bi bi-map"></i>
                    <select
                      className="modern-select"
                      value={formData.stateId}
                      onChange={async (e) => {
                        const stateId = Number(e.target.value);

                        setFormData((prev) => ({
                          ...prev,
                          stateId,
                          districtId: 0,
                          locationId: 0
                        }));

                        setCitys([]);

                        if (stateId > 0) {
                          await loadDistrict(stateId);
                        } else {
                          setDistricts([]);
                        }
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
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">District</label>
                  <div className="select-wrapper">
                    <i className="bi bi-pin-map"></i>
                    <select
                      className="modern-select"
                      value={formData.districtId}
                      onChange={async (e) => {
                        const districtId = Number(e.target.value);

                        setFormData((prev) => ({
                          ...prev,
                          districtId,
                          locationId: 0
                        }));

                        if (districtId > 0) {
                          await loadCity(districtId);
                        } else {
                          setCitys([]);
                        }
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
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">City</label>
                  <div className="select-wrapper">
                    <i className="bi bi-buildings"></i>
                    <select
                      className="modern-select"
                      value={formData.locationId}
                      onChange={handleSelectChange("locationId")}
                    >
                      <option value={0}>Select City</option>
                      {citys.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-8 mb-4">
                  <label className="modern-label">
                    Address <span>*</span>
                  </label>
                  <div className={`input-wrapper ${errors.address ? "input-error" : ""}`}>
                    <i className="bi bi-house"></i>
                    <input
                      type="text"
                      name="address"
                      className="modern-input"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                    />
                  </div>
                  {errors.address && (
                    <div className="error-text">{errors.address}</div>
                  )}
                </div>

                <div className="col-md-4 mb-4">
                  <label className="modern-label">PinCode</label>
                  <div className={`input-wrapper ${errors.pincode ? "input-error" : ""}`}>
                    <i className="bi bi-mailbox"></i>
                    <input
                      type="text"
                      name="pincode"
                      className="modern-input"
                      value={formData.pincode}
                      maxLength={6}
                      onChange={handleNumberChange("pincode", 6)}
                      placeholder="6 digit pincode"
                    />
                  </div>
                  {errors.pincode && (
                    <div className="error-text">{errors.pincode}</div>
                  )}
                </div>
              </div>

              <div className="form-section-title mt-2">
                <span className="section-icon">
                  <i className="bi bi-camera-fill"></i>
                </span>
                Profile Photo
              </div>

              <div className="row align-items-center">
                <div className="col-md-8 mb-4">
                  <label className="modern-label">Change Profile Photo</label>
                  <div className="upload-box">
                    <i className="bi bi-cloud-arrow-up"></i>
                    <div className="upload-content">
                      <input
                        type="file"
                        name="selfImage1"
                        className="form-control"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      <small>
                        Select a new image if you want to replace the existing
                        profile photo.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <div className="profile-preview">
                    {formData.selfImageShow ? (
                      <img
                        src={formData.selfImageShow}
                        alt="Profile"
                      />
                    ) : (
                      <div className="profile-placeholder">
                        <i className="bi bi-person"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="employee-card-footer">
              <button
                type="button"
                className="btn btn-light cancel-btn"
                onClick={() => navigate("/employee-list")}
                disabled={submitting}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary save-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Update Employee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        .employee-page-header h2 {
          color: #1e293b;
          letter-spacing: -0.5px;
        }

        .employee-page-header p {
          font-size: 14px;
        }

        .employee-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8edf3;
          box-shadow: 0 5px 25px rgba(15, 23, 42, 0.06);
          overflow: hidden;
        }

        .employee-card-header {
          padding: 22px 28px;
          border-bottom: 1px solid #edf0f4;
          background: linear-gradient(135deg, #ffffff, #f8fbff);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .employee-card-header h5 {
          color: #1e293b;
          font-size: 18px;
        }

        .employee-card-header span {
          color: #64748b;
          font-size: 13px;
        }

        .employee-id-badge {
          background: #eff6ff;
          color: #2563eb;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .employee-form-body {
          padding: 30px;
        }

        .form-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 22px;
          padding-bottom: 12px;
          border-bottom: 1px solid #edf0f4;
        }

        .section-icon {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #2563eb;
          background: #eff6ff;
        }

        .modern-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .modern-label span {
          color: #ef4444;
        }

        .input-wrapper,
        .select-wrapper {
          position: relative;
        }

        .input-wrapper > i,
        .select-wrapper > i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          z-index: 2;
          pointer-events: none;
        }

        .modern-input,
        .modern-select {
          width: 100%;
          height: 45px;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          background: #fff;
          color: #334155;
          font-size: 14px;
          outline: none;
          transition: .2s ease;
        }

        .modern-input {
          padding: 0 14px 0 42px;
        }

        .modern-select {
          padding: 0 35px 0 42px;
          appearance: auto;
        }

        .modern-input::placeholder {
          color: #a3adba;
        }

        .modern-input:focus,
        .modern-select:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, .08);
        }

        .input-error .modern-input {
          border-color: #ef4444;
        }

        .error-text {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
        }

        .status-card {
          min-height: 45px;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          padding: 7px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
        }

        .status-title {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .status-card small {
          color: #94a3b8;
          font-size: 10px;
        }

        .status-switch {
          width: 42px !important;
          height: 22px;
          cursor: pointer;
        }

        .upload-box {
          border: 1px dashed #cbd5e1;
          border-radius: 11px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f8fafc;
        }

        .upload-box > i {
          width: 45px;
          height: 45px;
          min-width: 45px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          font-size: 22px;
        }

        .upload-content {
          flex: 1;
        }

        .upload-content .form-control {
          border: 0;
          padding: 0;
          background: transparent;
          font-size: 13px;
        }

        .upload-content small {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          margin-top: 5px;
        }

        .profile-preview {
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-preview img,
        .profile-placeholder {
          width: 135px;
          height: 135px;
          object-fit: cover;
          border-radius: 16px;
          border: 4px solid #fff;
          box-shadow: 0 8px 25px rgba(15, 23, 42, .12);
        }

        .profile-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          color: #94a3b8;
          font-size: 45px;
        }

        .employee-card-footer {
          padding: 20px 30px;
          border-top: 1px solid #edf0f4;
          background: #fafbfc;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cancel-btn,
        .save-btn {
          min-width: 145px;
          height: 43px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
        }

        .save-btn {
          box-shadow: 0 5px 14px rgba(13, 110, 253, .2);
        }

        .loading-box {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .employee-form-body {
            padding: 20px;
          }

          .employee-card-header {
            padding: 20px;
            align-items: flex-start;
            flex-direction: column;
          }

          .employee-card-footer {
            padding: 18px 20px;
            flex-direction: column-reverse;
          }

          .cancel-btn,
          .save-btn {
            width: 100%;
          }

          .profile-preview {
            justify-content: flex-start;
          }
        }
      `}</style>
    </>
  );
}

export default EmployeeUpdate;
