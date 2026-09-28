import React, { useEffect, useState } from "react";
import {
    FaUniversity, FaSchool, FaUserTie, FaHistory, FaMobileAlt, FaPhoneAlt,
    FaEnvelope, FaHandshake, FaMapMarkedAlt, FaMap, FaCity, FaMapPin,
    FaChalkboardTeacher, FaDoorOpen, FaDesktop, FaConciergeBell,
    FaGraduationCap, FaBookOpen, FaCommentAlt, FaPaperPlane, FaLock,
    FaShieldAlt, FaIdCard, FaFileInvoice, FaCamera, FaSignature, FaBuilding,
    FaUpload, FaCheckCircle, FaTimes, FaGlobe, FaRulerCombined, FaLaptop
} from "react-icons/fa";


import { getStudentData } from "../../AllServicesFiles/StudentService";
import { useNavigate, useParams } from "react-router-dom";
import { getCity, getDistrict, getFrenchiseById, getState, updateStudyCentre } from "../../AllServicesFiles/FrenchiseService";
import { FILE_URL } from "../../api";



const StudyCentreUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [citys, setCitys] = useState([]);
    const [instituteTypes, setInstituteTypes] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({});
    const [formData, setFormData] = useState({
        centerName: "", ownerName: "", experience: "", instituteType: "",
        mobile: "", alternateMobile: "", email: "", affiliation: "", website: "",
        aadhaarNumber: "", panNumber: "", stateId: 0, districtId: 0, locationId: 0,
        address: "", pinCode: "", totalArea: "", classrooms: "", computerLab: "",
        numberOfComputers: "", otherFacilities: "", message: "",
        aadhaarCard: null, 
        panCard: null, 
        passportPhoto: null,
        authorizedSignature: null,
         instituteCertificate: null,
        buildingPhoto1: null, 
        buildingPhoto2: null, 
        aadhaarCard1: null, 
        panCard1: null, 
        passportPhoto1: null,
        authorizedSignature1: null,
        instituteCertificate1: null,
        buildingPhoto11: null, 
        buildingPhoto21: null, 
        isActive: 1
    });

    useEffect(() => {
        loadState();
        loadInstituteType();
        if (id) {
            handleEdit(id);
        }
    }, []);

    const handleEdit = async (id) => {

        try {

            const result = await getFrenchiseById(id);

            setFormData({

                id: result.id ?? 0,

                centerName: result.name ?? "",
                ownerName: result.fatherName ?? "",
                experience: result.experience ?? "",
                instituteType: result.instituteTypeId ?? "",
                locationId: result.locationId ?? 0,
                districtId: result.districtId ?? 0,
                stateId: result.stateId ?? 0,
                address: result.address ?? "",
                pinCode: result.pincode ?? "",
                mobile: result.mobileNo ?? "",
                alternateMobile: result.whatsAppNo ?? "",
                email: result.email ?? "",
                affiliation: result.affiliation ?? "",
                website: result.website ?? "",
                aadhaarNumber: result.aadhaarCardNumber ?? "",
                panNumber: result.panCardNumber ?? "",
                totalArea: result.totalArea ?? "",
                classrooms: result.numberofClassrooms ?? "",
                computerLab: result.computerLabAvailable ?? "",
                numberOfComputers: result.numberofComputers ?? "",
                otherFacilities: result.otherFacilities ?? "",
                passportPhoto1: result.passportPhoto ?? "",
                authorizedSignature1: result.authorizedSignature ?? "",
                aadhaarCard1: result.aadhaarCardimage ?? "",
                panCard1: result.panCardimage ?? "",
                instituteCertificate1: result.instituteCertificate ?? "",
                buildingPhoto11: result.buildingPhoto1 ?? "",
                buildingPhoto21: result.buildingPhoto2 ?? "",
                message: result.remark ?? "",
                isActive: result.isActive ?? 1

            });

            // District load
            if (result.stateId > 0) {
                await loadDistrict(result.stateId);
            }


            // City load
            if (result.districtId > 0) {
                await loadCity(result.districtId);
            }

        }
        catch (error) {
            console.log(error);
        }

    };
    
    const loadInstituteType = async () => {
        try {
            const result = await getStudentData(25);
            setInstituteTypes(result?.data || []);
        } catch (error) {
            console.error("Gender Error:", error);
        }
    };

    const loadState = async () => {
        try {
            setLoadingStates(true);
            const result = await getState();
            setStates(result?.data || []);
        } catch (error) {
            console.error(error);
            setStates([]);
        } finally {
            setLoadingStates(false);
        }
    };

    const loadDistrict = async (stateId) => {
        try {
            setLoadingDistricts(true);
            const result = await getDistrict(stateId);
            setDistricts(result?.data || []);
        } catch (error) {
            console.error(error);
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    const loadCity = async (districtId) => {
        try {
            setLoadingCities(true);
            const result = await getCity(districtId);
            setCitys(result?.data || []);
        } catch (error) {
            console.error(error);
            setCitys([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const clearError = (fieldName) => {
        setErrors((prev) => {
            if (!prev[fieldName]) return prev;
            const updatedErrors = { ...prev };
            delete updatedErrors[fieldName];
            return updatedErrors;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        clearError(name);
    };

    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        setSelectedState(stateId);
        setSelectedDistrict("");
        setSelectedCity("");
        setDistricts([]);
        setCitys([]);
        setFormData((prev) => ({ ...prev, stateId, districtId: "", locationId: "" }));
        clearError("stateId");
        clearError("districtId");
        clearError("locationId");
        if (stateId) await loadDistrict(stateId);
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setSelectedCity("");
        setCitys([]);
        setFormData((prev) => ({ ...prev, districtId, locationId: "" }));
        clearError("districtId");
        clearError("locationId");
        if (districtId) await loadCity(districtId);
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setFormData((prev) => ({ ...prev, locationId: cityId }));
        clearError("locationId");
    };

    const getStateId = (item) => item?.id;
    const getStateName = (item) => item?.name;
    const getDistrictId = (item) => item?.id;
    const getDistrictName = (item) => item?.name;
    const getCityId = (item) => item?.id;
    const getCityName = (item) => item?.name;

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (previews[fieldName]) URL.revokeObjectURL(previews[fieldName]);

        setFormData((prev) => ({ ...prev, [fieldName]: file }));
        clearError(fieldName);

        if (file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [fieldName]: previewUrl }));
        } else {
            setPreviews((prev) => ({ ...prev, [fieldName]: null }));
        }
    };

    const getFileErrorMessage = (fieldName) => {
        const messages = {
            aadhaarCard: "Aadhaar Card is required",
            panCard: "PAN Card is required",
            passportPhoto: "Passport size photo is required",
            authorizedSignature: "Authorized signature is required"
        };
        return messages[fieldName] || "This file is required";
    };

    const removeFile = (fieldName) => {
        if (previews[fieldName]) URL.revokeObjectURL(previews[fieldName]);

        setFormData((prev) => ({ ...prev, [fieldName]: null }));
        setPreviews((prev) => ({ ...prev, [fieldName]: null }));
        setErrors((prev) => ({ ...prev, [fieldName]: getFileErrorMessage(fieldName) }));
    };

    const validateForm = (data) => {
        const newErrors = {};

        if (!data.centerName.trim()) newErrors.centerName = "Center / Institute name is required";
        if (!data.ownerName.trim()) newErrors.ownerName = "Owner name is required";
        if (!data.instituteType) newErrors.instituteType = "Institute type is required";

        if (!data.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(data.mobile)) {
            newErrors.mobile = "Enter a valid 10 digit mobile number";
        }

        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!data.address.trim()) newErrors.address = "Full address is required";
        if (!data.stateId) newErrors.stateId = "State is required";
        if (!data.districtId) newErrors.districtId = "District is required";
        if (!data.locationId) newErrors.locationId = "City is required";
        if (!data.totalArea.trim()) newErrors.totalArea = "Total area is required";
if (data.classrooms === "" || data.classrooms == null) {
  newErrors.classrooms = "Number of classrooms is required";
}

        if (!data.computerLab) newErrors.computerLab = "Please select whether computer lab is available";

        if (data.computerLab === "yes" && !data.numberOfComputers.trim()) {
            newErrors.numberOfComputers = "Number of computers is required";
        }

        if (!data.aadhaarNumber.trim()) {
            newErrors.aadhaarNumber = "Aadhaar Card number is required";
        } else if (!/^[0-9]{12}$/.test(data.aadhaarNumber)) {
            newErrors.aadhaarNumber = "Enter a valid 12 digit Aadhaar number";
        }

        if (!data.panNumber.trim()) {
            newErrors.panNumber = "PAN Card number is required";
        } else if (!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(data.panNumber)) {
            newErrors.panNumber = "Enter a valid 10 character PAN number";
        }

          
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => {
                const firstErrorField = document.querySelector(".scr-error");

                if (firstErrorField) {
                    firstErrorField.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }, 100);

            return;
        }

        try {
            const result = await updateStudyCentre(formData);

             

              if (result?.message === "Successfully") {
                navigate("/franchise-list");

                return;
            }

            console.log("Study Centre Created:", result);

        } catch (error) {
            console.error("Study Centre Registration Error:", error);
        }
    };


    const FileUpload = ({ name, label, icon, accept = "image/*,.pdf", required = false, description }) => {
        const selectedFile = formData[name];
        const preview = previews[name];

        return (
            <div className="col-md-6">
                <div className="scr-upload-group">
                    <label>{label}{required && <span>*</span>}</label>
                    <div className={selectedFile ? "scr-upload-box selected" : "scr-upload-box"}>
                        <input type="file" name={name} accept={accept} onChange={(e) => handleFileChange(e, name)} />
                        <div className="scr-upload-icon">{icon}</div>
                        <div className="scr-upload-content">
                            {selectedFile ? (
                                <>
                                    <strong>{selectedFile.name}</strong>
                                    <small>{(selectedFile.size / 1024).toFixed(1)} KB</small>
                                </>
                            ) : (
                                <>
                                    <strong>Click to upload</strong>
                                    <small>{description || "PDF / JPG / PNG"}</small>
                                </>
                            )}
                        </div>
                        {selectedFile ? (
                            <button type="button" className="scr-remove-file" onClick={() => removeFile(name)}><FaTimes /></button>
                        ) : (
                            <div className="scr-upload-action"><FaUpload /></div>
                        )}
                    </div>
                    {errors[name] && <small className="scr-error">{errors[name]}</small>}
                    {preview && (
                        <div className="scr-file-preview">
                            <img src={preview} alt={label} />
                            <div><FaCheckCircle /><span>File selected</span></div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="scr-page">
            <div className="scr-container">
                <div className="scr-card">
                    <div className="scr-header">
                        <div className="scr-header-left">
                            <div className="scr-icon"><FaUniversity /></div>
                            <div>
                                <h2>Study Center Registration</h2>
                                <p>Register your institute as an authorized study center</p>
                            </div>
                        </div>
                        <div className="scr-header-badge"><FaShieldAlt /> Secure Registration</div>
                    </div>

                    <form className="scr-form" onSubmit={handleSubmit} noValidate>
                        <div className="scr-section">
                            <div className="scr-section-head">
                                <div className="scr-section-icon"><FaUniversity /></div>
                                <div><h3>Center Information</h3><p>Provide basic information about your study center</p></div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Center / Institute Name<span>*</span></label>
                                        <div className="scr-input"><FaUniversity /><input type="text" name="centerName" className={errors.centerName ? "form-control scr-input-error" : "form-control"} placeholder="Enter center / institute name" value={formData.centerName} onChange={handleChange} /></div>
                                        {errors.centerName && <small className="scr-error">{errors.centerName}</small>}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Owner Name<span>*</span></label>
                                        <div className="scr-input"><FaUserTie /><input type="text" name="ownerName" className={errors.ownerName ? "form-control scr-input-error" : "form-control"} placeholder="Enter owner name" value={formData.ownerName} onChange={handleChange} /></div>
                                        {errors.ownerName && <small className="scr-error">{errors.ownerName}</small>}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Experience</label>
                                        <div className="scr-input"><FaHistory /><input type="text" name="experience" className="form-control" placeholder="e.g. 5 Years" value={formData.experience} onChange={handleChange} /></div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>
                                            Institute Type<span>*</span>
                                        </label>

                                        <div className="scr-input">
                                            <FaSchool />

                                            <select
                                                name="instituteType"
                                                className={
                                                    errors.instituteType
                                                        ? "form-control scr-input-error"
                                                        : "form-control"
                                                }
                                                value={formData.instituteType}
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Select Institute Type
                                                </option>

                                                {instituteTypes.map((item, index) => {
                                                    const id = item?.id;
                                                    const name = item?.name;

                                                    return (
                                                        <option
                                                            key={id || index}
                                                            value={id}
                                                        >
                                                            {name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        {errors.instituteType && (
                                            <small className="scr-error">
                                                {errors.instituteType}
                                            </small>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className="scr-section">
                            <div className="scr-section-head">
                                <div className="scr-section-icon"><FaEnvelope /></div>
                                <div><h3>Contact Information</h3><p>Enter contact details for communication</p></div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Mobile No<span>*</span></label>
                                        <div className="scr-input">
                                            <FaMobileAlt />
                                            <input type="tel" name="mobile" className={errors.mobile ? "form-control scr-input-error" : "form-control"} placeholder="Enter 10 digit mobile number" maxLength="10" inputMode="numeric" value={formData.mobile} onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, "");
                                                setFormData((prev) => ({ ...prev, mobile: value }));
                                                clearError("mobile");
                                            }} />
                                        </div>
                                        {errors.mobile && <small className="scr-error">{errors.mobile}</small>}
                                        <small>Enter a valid 10 digit mobile number</small>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Alternate Mobile No</label>
                                        <div className="scr-input">
                                            <FaPhoneAlt />
                                            <input type="tel" name="alternateMobile" className="form-control" placeholder="Enter alternate mobile" maxLength="10" inputMode="numeric" value={formData.alternateMobile} onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, "");
                                                setFormData((prev) => ({ ...prev, alternateMobile: value }));
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Email<span>*</span></label>
                                        <div className="scr-input"><FaEnvelope /><input type="email" name="email" className={errors.email ? "form-control scr-input-error" : "form-control"} placeholder="Enter email address" value={formData.email} onChange={handleChange} /></div>
                                        {errors.email && <small className="scr-error">{errors.email}</small>}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Affiliation</label>
                                        <div className="scr-input"><FaHandshake /><input type="text" name="affiliation" className="form-control" placeholder="Enter affiliation details" value={formData.affiliation} onChange={handleChange} /></div>
                                        <small>University, board, organization or other affiliation</small>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Website</label>
                                        <div className="scr-input"><FaGlobe /><input type="url" name="website" className="form-control" placeholder="https://www.example.com" value={formData.website} onChange={handleChange} /></div>
                                        <small>Enter institute website URL, if available</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="scr-section">
                            <div className="scr-section-head">
                                <div className="scr-section-icon"><FaMapMarkedAlt /></div>
                                <div><h3>Address Information</h3><p>Provide the complete location of your center</p></div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="scr-group">
                                        <label>Full Address<span>*</span></label>
                                        <div className="scr-textarea"><FaMapMarkedAlt /><textarea name="address" className={errors.address ? "form-control scr-input-error" : "form-control"} rows="3" placeholder="Enter complete center address" value={formData.address} onChange={handleChange} /></div>
                                        {errors.address && <small className="scr-error">{errors.address}</small>}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="scr-group">
                                        <label>State<span>*</span></label>
                                        <div className="scr-input">
                                            <FaMap />
                                            <select name="stateId" className={errors.stateId ? "form-control scr-input-error" : "form-control"} value={formData.stateId} onChange={handleStateChange}>
                                                <option value="">{loadingStates ? "Loading States..." : "Select State"}</option>
                                                {states.map((state, index) => {
                                                    const id = getStateId(state);
                                                    const name = getStateName(state);
                                                    return <option key={id || index} value={id}>{name}</option>;
                                                })}
                                            </select>
                                        </div>
                                        {errors.stateId && <small className="scr-error">{errors.stateId}</small>}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="scr-group">
                                        <label>District<span>*</span></label>
                                        <div className="scr-input">
                                            <FaCity />
                                            <select name="districtId" className={errors.districtId ? "form-control scr-input-error" : "form-control"} value={formData.districtId} onChange={handleDistrictChange} disabled={!selectedState || loadingDistricts}>
                                                <option value="">{!selectedState ? "Select State First" : loadingDistricts ? "Loading Districts..." : "Select District"}</option>
                                                {districts.map((district, index) => {
                                                    const id = getDistrictId(district);
                                                    const name = getDistrictName(district);
                                                    return <option key={id || index} value={id}>{name}</option>;
                                                })}
                                            </select>
                                        </div>
                                        {errors.districtId && <small className="scr-error">{errors.districtId}</small>}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="scr-group">
                                        <label>City<span>*</span></label>
                                        <div className="scr-input">
                                            <FaCity />
                                            <select name="locationId" className={errors.locationId ? "form-control scr-input-error" : "form-control"} value={formData.locationId} onChange={handleCityChange} disabled={!selectedDistrict || loadingCities}>
                                                <option value="">{!selectedState ? "Select State First" : !selectedDistrict ? "Select District First" : loadingCities ? "Loading Cities..." : "Select City"}</option>
                                                {citys.map((city, index) => {
                                                    const id = getCityId(city);
                                                    const name = getCityName(city);
                                                    return <option key={id || index} value={id}>{name}</option>;
                                                })}
                                            </select>
                                        </div>
                                        {errors.locationId && <small className="scr-error">{errors.locationId}</small>}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="scr-group">
                                        <label>Pin Code</label>
                                        <div className="scr-input">
                                            <FaMapPin />
                                            <input type="text" name="pinCode" className="form-control" placeholder="Enter 6 digit pin code" maxLength="6" inputMode="numeric" value={formData.pinCode} onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, "");
                                                setFormData((prev) => ({ ...prev, pinCode: value }));
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="scr-section">
                            <div className="scr-section-head">
                                <div className="scr-section-icon"><FaChalkboardTeacher /></div>
                                <div><h3>Infrastructure</h3><p>Tell us about the facilities available at your center</p></div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="scr-group">
                                        <label>Total Area (Sq Ft)<span>*</span></label>
                                        <div className="scr-input"><FaRulerCombined /><input type="number" name="totalArea" className={errors.totalArea ? "form-control scr-input-error" : "form-control"} placeholder="Enter total area" min="0" step="0.01" value={formData.totalArea} onChange={handleChange} /></div>
                                        {errors.totalArea && <small className="scr-error">{errors.totalArea}</small>}
                                        <small>Total available area of the center</small>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="scr-group">
                                        <label>Number of Classrooms<span>*</span></label>
                                        <div className="scr-input"><FaDoorOpen /><input type="number" name="classrooms" className={errors.classrooms ? "form-control scr-input-error" : "form-control"} placeholder="Enter number of classrooms" min="1" step="1" value={formData.classrooms} onChange={handleChange} /></div>
                                        {errors.classrooms && <small className="scr-error">{errors.classrooms}</small>}
                                        <small>Total number of classrooms available</small>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="scr-group">
                                        <label>Computer Lab Available<span>*</span></label>
                                        <div className="scr-input">
                                            <FaDesktop />
                                            <select name="computerLab" className={errors.computerLab ? "form-control scr-input-error" : "form-control"} value={formData.computerLab} onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData((prev) => ({ ...prev, computerLab: value, numberOfComputers: value === "1" ? prev.numberOfComputers : "" }));
                                                clearError("computerLab");
                                                if (value !== "1") clearError("numberOfComputers");
                                            }}>
                                                <option value="">Select</option>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        </div>
                                        {errors.computerLab && <small className="scr-error">{errors.computerLab}</small>}
                                    </div>
                                </div>

                                {formData.computerLab === "1" && (
                                    <div className="col-md-4">
                                        <div className="scr-group scr-conditional-field">
                                            <label>Number of Computers<span>*</span></label>
                                            <div className="scr-input"><FaLaptop /><input type="number" name="numberOfComputers" className={errors.numberOfComputers ? "form-control scr-input-error" : "form-control"} placeholder="Enter number of computers" min="1" step="1" value={formData.numberOfComputers} onChange={handleChange} /></div>
                                            {errors.numberOfComputers && <small className="scr-error">{errors.numberOfComputers}</small>}
                                            <small>Number of computers available in the lab</small>
                                        </div>
                                    </div>
                                )}

                                <div className="col-md-12">
                                    <div className="scr-group">
                                        <label>Other Facilities</label>
                                        <div className="scr-input"><FaConciergeBell /><input type="text" name="otherFacilities" className="form-control" placeholder="Library, Lab, Parking, Smart Class..." value={formData.otherFacilities} onChange={handleChange} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="scr-section">
                            <div className="scr-section-head">
                                <div className="scr-section-icon"><FaFileInvoice /></div>
                                <div><h3>Documents & Verification</h3><p>Upload required documents for study center verification</p></div>
                            </div>

                            <div className="scr-document-note">
                                <FaShieldAlt />
                                <div><strong>Document Upload Guidelines</strong><span>Upload clear and readable documents. JPG, PNG or PDF files are accepted.</span></div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>Aadhaar Card Number<span>*</span></label>
                                        <div className="scr-input">
                                            <FaIdCard />
                                            <input type="text" name="aadhaarNumber" className={errors.aadhaarNumber ? "form-control scr-input-error" : "form-control"} placeholder="Enter 12 digit Aadhaar number" maxLength="12" inputMode="numeric" value={formData.aadhaarNumber} onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, "");
                                                setFormData((prev) => ({ ...prev, aadhaarNumber: value }));
                                                clearError("aadhaarNumber");
                                            }} />
                                        </div>
                                        {errors.aadhaarNumber && <small className="scr-error">{errors.aadhaarNumber}</small>}
                                        <small>Enter valid 12 digit Aadhaar number</small>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="scr-group">
                                        <label>PAN Card Number<span>*</span></label>
                                        <div className="scr-input">
                                            <FaFileInvoice />
                                            <input type="text" name="panNumber" className={errors.panNumber ? "form-control scr-input-error" : "form-control"} placeholder="Enter PAN e.g. ABCDE1234F" maxLength="10" value={formData.panNumber} onChange={(e) => {
                                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                                                setFormData((prev) => ({ ...prev, panNumber: value }));
                                                clearError("panNumber");
                                            }} />
                                        </div>
                                        {errors.panNumber && <small className="scr-error">{errors.panNumber}</small>}
                                        <small>Enter valid 10 character PAN number</small>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="flex-grow-1">
                                            <FileUpload name="aadhaarCard" label="Aadhaar Card" icon={<FaIdCard />} accept="image/*,.pdf" required description="JPG, PNG or PDF" /></div><img src={`${FILE_URL}${formData.aadhaarCard1}`} alt="Aadhaar Card" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} /></div></div>
                                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><div className="flex-grow-1"><FileUpload name="panCard" label="PAN Card" icon={<FaFileInvoice />} accept="image/*,.pdf" required description="JPG, PNG or PDF" /></div><img src={`${FILE_URL}${formData.panCard1}`} alt="PAN Card" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} /></div></div>
                                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><div className="flex-grow-1"><FileUpload name="passportPhoto" label="Passport Size Photo" icon={<FaCamera />} accept="image/*" required description="JPG / PNG image" /></div>
                                <img src={`${FILE_URL}${formData.passportPhoto1}`} alt="Passport Photo" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} />
                                
                                </div></div>
                                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><div className="flex-grow-1"><FileUpload name="authorizedSignature" label="Authorized Signature" icon={<FaSignature />} accept="image/*" required description="JPG / PNG image" /></div><img src={`${FILE_URL}${formData.authorizedSignature1}`} alt="Authorized Signature" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} /></div></div>
                                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><div className="flex-grow-1"><FileUpload name="instituteCertificate" label="Institute Registration Certificate / Building Photo" icon={<FaBuilding />} accept="image/*,.pdf" description="Certificate PDF or Building Photo" /></div><img src={`${FILE_URL}${formData.instituteCertificate1}`} alt="Institute Certificate" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} /></div></div>
                                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><div className="flex-grow-1"><FileUpload name="buildingPhoto1" label="Building Photo 1" icon={<FaBuilding />} accept="image/*" description="Front / Outside View" /></div><img src={`${FILE_URL}${formData.buildingPhoto11}`} alt="Building Photo 1" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} /></div></div>
                                <div className="col-md-6"><div className="d-flex align-items-center gap-2"><div className="flex-grow-1"><FileUpload name="buildingPhoto2" label="Building Photo 2" icon={<FaBuilding />} accept="image/*" description="Inside / Classroom View" /></div><img src={`${FILE_URL}${formData.buildingPhoto21}`} alt="Building Photo 2" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} /></div></div>

                                <div className="col-md-6" hidden>
                                    <input type="text" name="formData.aadhaarCard1" className="form-control" value={formData.aadhaarCard1 || ""} readOnly />
                                    <input type="text" name="formData.panCard1" className="form-control" value={formData.panCard1 || ""} readOnly />
                                    <input type="text" name="formData.passportPhoto1" className="form-control" value={formData.passportPhoto1 || ""} readOnly />
                                    <input type="text" name="formData.authorizedSignature1" className="form-control" value={formData.authorizedSignature1 || ""} readOnly />
                                    <input type="text" name="formData.instituteCertificate1" className="form-control" value={formData.instituteCertificate1 || ""} readOnly />
                                    <input type="text" name="formData.buildingPhoto11" className="form-control" value={formData.buildingPhoto11 || ""} readOnly />
                                    <input type="text" name="formData.buildingPhoto21" className="form-control" value={formData.buildingPhoto21 || ""} readOnly />
                                </div>
                            </div>

                        </div>

                        <div className="scr-section">
                            <div className="scr-section-head">
                                <div className="scr-section-icon"><FaGraduationCap /></div>
                                <div><h3>Other Information</h3><p>Provide details about the courses offered & etc.</p></div>
                            </div>

                            <div className="row">
                                {/* <div className="col-md-12">
                                    <div className="scr-group">
                                        <label>Courses Offered</label>
                                        <div className="scr-textarea"><FaBookOpen /><textarea name="coursesOffered" className="form-control" rows="3" placeholder="Enter courses offered by the center" value={formData.coursesOffered} onChange={handleChange} /></div>
                                    </div>
                                </div> */}

                                <div className="col-md-12">
                                    <div className="scr-group">
                                        <label>Message</label>
                                        <div className="scr-textarea"><FaCommentAlt /><textarea name="message" className="form-control" rows="3" placeholder="Enter your message" value={formData.message} onChange={handleChange} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="scr-footer">
                            <div className="scr-security">
                                <div className="scr-security-icon"><FaLock /></div>
                                <div><strong>Your information is secure</strong><span>We protect your information and respect your privacy.</span></div>
                            </div>
                            <button type="submit" className="scr-submit"><FaPaperPlane /> Update</button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .scr-page{min-height:100vh;padding:30px 15px;background:#f4f7fb}
                .scr-container{max-width:1180px;margin:auto}
                .scr-card{background:#fff;border:1px solid #e7ebf1;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(20,40,70,.07)}
                .scr-header{padding:22px 28px;background:linear-gradient(135deg,#ff6b00,#f45100);display:flex;align-items:center;justify-content:space-between;gap:20px;color:#fff}
                .scr-header-left{display:flex;align-items:center;gap:15px}
                .scr-icon{width:54px;height:54px;flex:0 0 54px;border-radius:12px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:23px}
                .scr-header h2{margin:0 0 4px;color:#fff;font-size:23px;font-weight:700}
                .scr-header p{margin:0;color:rgba(255,255,255,.9);font-size:13px}
                .scr-header-badge{display:flex;align-items:center;gap:7px;padding:8px 13px;border-radius:20px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);font-size:11px;font-weight:600;white-space:nowrap}
                .scr-form{padding:26px 28px}
                .scr-section{margin-bottom:24px;padding:20px;border:1px solid #e9edf3;border-radius:11px;background:#fff}
                .scr-section:last-child{margin-bottom:0}
                .scr-section-head{display:flex;align-items:center;gap:11px;padding-bottom:15px;margin-bottom:18px;border-bottom:1px solid #edf0f4}
                .scr-section-icon{width:35px;height:35px;flex:0 0 35px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#fff2e8;color:#f56600;font-size:14px}
                .scr-section-head h3{margin:0 0 2px;color:#202938;font-size:15px;font-weight:700}
                .scr-section-head p{margin:0;color:#8a94a6;font-size:11px}
                .scr-group{margin-bottom:16px}
                .scr-group label,.scr-upload-group label{display:block;margin-bottom:6px;color:#374151;font-size:12px;font-weight:600}
                .scr-group label span,.scr-upload-group label span{color:#ef4444;margin-left:3px}
                .scr-input,.scr-textarea{position:relative}
                .scr-input>svg,.scr-textarea>svg{position:absolute;left:13px;color:#f56600;font-size:13px;z-index:2;pointer-events:none}
                .scr-input>svg{top:50%;transform:translateY(-50%)}
                .scr-textarea>svg{top:14px}
                .scr-input .form-control{padding-left:39px}
                .scr-textarea .form-control{padding:11px 12px 11px 39px}
                .scr-input .form-control,.scr-textarea .form-control{border:1px solid #dce2ea;border-radius:7px;color:#374151;font-size:12px;box-shadow:none;transition:.2s ease}
                .scr-input .form-control{height:42px}
                .scr-input .form-control:focus,.scr-textarea .form-control:focus{border-color:#ff720d;box-shadow:0 0 0 3px rgba(255,102,0,.08)}
                .scr-input-error{border-color:#ef4444!important;background:#fffafa}
                .scr-input-error:focus{border-color:#ef4444!important;box-shadow:0 0 0 3px rgba(239,68,68,.08)!important}
                .scr-error{display:block!important;margin-top:5px!important;color:#ef4444!important;font-size:11px!important;font-weight:500;line-height:1.4}
                .scr-input select.form-control{cursor:pointer}
                .scr-input select.form-control:disabled{background:#f3f4f6;color:#9ca3af;cursor:not-allowed}
                .scr-textarea .form-control{resize:vertical;min-height:85px}
                .scr-group small{display:block;margin-top:5px;color:#9aa3b2;font-size:10px}
                .scr-conditional-field{padding:12px;border-radius:8px;background:#fffaf6;border:1px solid #ffe2cd;animation:scrFadeIn .2s ease}
                @keyframes scrFadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
                .scr-document-note{display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:20px;border-radius:8px;background:#fff8f2;border:1px solid #ffe2cd;color:#f56600}
                .scr-document-note>svg{font-size:16px;flex-shrink:0}
                .scr-document-note strong,.scr-document-note span{display:block}
                .scr-document-note strong{font-size:11px;margin-bottom:2px}
                .scr-document-note span{color:#8a94a6;font-size:10px}
                .scr-upload-group{margin-bottom:18px}
                .scr-upload-box{position:relative;min-height:74px;width:300px;padding:10px 42px 10px 12px;display:flex;align-items:center;gap:12px;border:1px dashed #d5dce6;border-radius:8px;background:#fafbfc;cursor:pointer;transition:.2s ease}
                .scr-upload-box:hover{border-color:#ff720d;background:#fffaf6}
                .scr-upload-box.selected{border-color:#22c55e;background:#f5fff8;border-style:solid}
                .scr-upload-box input[type=file]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:3}
                .scr-upload-icon{width:40px;height:40px;flex:0 0 40px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#fff0e5;color:#f56600;font-size:16px}
                .scr-upload-content{min-width:0;flex:1}
                .scr-upload-content strong,.scr-upload-content small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
                .scr-upload-content strong{color:#374151;font-size:11px;margin-bottom:3px}
                .scr-upload-content small{color:#9aa3b2;font-size:9px}
                .scr-upload-action{position:absolute;right:13px;color:#f56600;font-size:13px;z-index:2}
                .scr-remove-file{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:25px;height:25px;border:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fee2e2;color:#ef4444;cursor:pointer;z-index:5}
                .scr-remove-file:hover{background:#fecaca}
                .scr-file-preview{display:flex;align-items:center;gap:8px;margin-top:6px}
                .scr-file-preview img{width:38px;height:38px;object-fit:cover;border-radius:5px;border:1px solid #e5e7eb}
                .scr-file-preview div{display:flex;align-items:center;gap:5px;color:#16a34a;font-size:10px}
                .scr-footer{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 4px 0;border-top:1px solid #edf0f4}
                .scr-security{display:flex;align-items:center;gap:10px}
                .scr-security-icon{width:35px;height:35px;border-radius:8px;background:#ecfdf3;color:#16a34a;display:flex;align-items:center;justify-content:center;font-size:13px}
                .scr-security strong,.scr-security span{display:block}
                .scr-security strong{color:#374151;font-size:11px;margin-bottom:2px}
                .scr-security span{color:#9aa3b2;font-size:10px}
                .scr-submit{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;min-width:205px;padding:12px 20px;border-radius:7px;background:linear-gradient(135deg,#ff6b00,#f45100);color:#fff;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 5px 14px rgba(245,81,0,.2);transition:.2s ease}
                .scr-submit:hover{transform:translateY(-1px);box-shadow:0 7px 18px rgba(245,81,0,.28)}
                @media(max-width:991px){.scr-header{padding:20px}.scr-form{padding:20px}.scr-section{padding:18px}}
                @media(max-width:767px){.scr-page{padding:15px 8px}.scr-header{padding:18px}.scr-header-badge{display:none}.scr-header h2{font-size:18px}.scr-header p{font-size:11px}.scr-icon{width:46px;height:46px;flex-basis:46px;font-size:19px}.scr-form{padding:15px}.scr-section{padding:15px;margin-bottom:15px}.scr-footer{flex-direction:column;align-items:stretch}.scr-submit{width:100%}}
            `}</style>
        </div>
    );
};

export default StudyCentreUpdate;
