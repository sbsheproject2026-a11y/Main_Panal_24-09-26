import api from "../api";

 

 
export const getStudents = (userId,pageNo, pageSize, search) => {
    const token = localStorage.getItem("token");

    return api.get(
        `/Student/student-getall?referenceId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};
export const GetEmpConfirmAddmissions = (pageNo, pageSize, search) => {
    const token = localStorage.getItem("token");

    return api.get(
        `/StudentApproval/emp-student-confirm-print?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};
export const GetEmpunsetmarks = (pageNo, pageSize, search) => {
    const token = localStorage.getItem("token");

    return api.get(
        `/StudentApproval/emp-student-unsetmarks?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

 

export const getStudentsSendToConfirm = (userId,pageNo, pageSize, search) => {
    const token = localStorage.getItem("token");

    return api.get(
        `/StudentApproval/student-senttoconfirm?referenceId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
        {
            headers: {
                
                Authorization: `Bearer ${token}`
            }
        }
    );
};
 

export const createStudent = async (formData) => {
    const data = new FormData();

    
    data.append("name", formData.name);
    data.append("studentNameHindi", formData.studentNameHindi);
    data.append("fatherName", formData.fatherName);
    data.append("fatherNameHindi", formData.fatherNameHindi);
    data.append("motherName", formData.motherName);
    data.append("mobileNo", formData.mobileNo);
    
    data.append("email", formData.email);
    data.append("idNumber", formData.idNumber);
    data.append("referenceId", formData.referenceId);

    // Images
    if (formData.selfImage1) {
        data.append("selfImage1", formData.selfImage1);
    }

    if (formData.signatureImage1) {
        data.append("signatureImage1", formData.signatureImage1);
    }

    if (formData.aadhaarCardFrant1) {
        data.append("aadhaarCardFrant1", formData.aadhaarCardFrant1);
    }

    if (formData.aadhaarCardBack1) {
        data.append("aadhaarCardBack1", formData.aadhaarCardBack1);
    }

    data.append("casteCategory", formData.casteCategoryId);
    data.append("courseId", formData.courseId);
    data.append("examSessionId", formData.examSessionId);
     
    data.append("genderId", formData.genderId);
    data.append("studyModeId", formData.studyModeId);
    data.append("dOB", formData.dateOfBirth);
    data.append("stateId", formData.stateId);
    data.append("districtId", formData.districtId);
    data.append("locationId", formData.locationId);
    data.append("address", formData.address);
    data.append("pincode", formData.pincode);
    data.append("isActive", formData.isActive);
// =========================================================
    // Academic Details
    // =========================================================

    if (
        Array.isArray(formData.academicDetails) &&
        formData.academicDetails.length > 0
    ) {
        formData.academicDetails.forEach((academic, index) => {

            data.append(
                `AcademicDetails[${index}].Index`,
                index
            );

             
           
                data.append(
                    `AcademicDetails[${index}].LevelTypeId`,
                    academic.levelTypeId
                );
           
 
            data.append(
                `AcademicDetails[${index}].SchoolCollege`,
                academic.schoolCollege || ""
            );

            data.append(
                `AcademicDetails[${index}].RollNo`,
                academic.rollNo || ""
            );

            data.append(
                `AcademicDetails[${index}].BoardUniversity`,
                academic.boardUniversity || ""
            );

            data.append(
                `AcademicDetails[${index}].PercentageCgpa`,
                academic.percentageCgpa || ""
            );

            // Academic document
            if (academic.file) {
                data.append(
                    `AcademicDetails[${index}].File`,
                    academic.file
                );
            }
        });
    }
    // Token
    const token = localStorage.getItem("token");

    const response = await api.post(
        "/Student/student-create",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};
 


export const getStudentById = async (id) => {
    const response = await api.get(
        `/Student/student-getbyid/${id}`
    );

    return response.data;
};
export const getStudentdetailById = async (id) => {
    const response = await api.get(
        `/Home/student-details-print/${id}`
    );

    return response.data;
};
 
export const getStudentAcademicDetails = async (id) => {
    const response = await api.get(
        `/Student/student-academic-details/${id}`
    );

    return response.data;
};
 

export const updateStudent = async (formData) => {
    const data = new FormData();

   
    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("studentNameHindi", formData.studentNameHindi);
    data.append("fatherName", formData.fatherName);
    data.append("fatherNameHindi", formData.fatherNameHindi);
    data.append("motherName", formData.motherName);
    data.append("mobileNo", formData.mobileNo);
    data.append("whatsAppNo", formData.whatsAppNo);
    data.append("email", formData.email);
    data.append("idNumber", formData.idNumber);
    data.append("selfImage", formData.selfImage);
    data.append("signatureImage", formData.signatureImage);``
    data.append("AadhaarCardFrant", formData.aadhaarCardFront);
    data.append("aadhaarCardBack", formData.aadhaarCardBack);

    // Images
    if (formData.selfImage1) {
        data.append("selfImage1", formData.selfImage1);
    }

    if (formData.signatureImage1) {
        data.append("signatureImage1", formData.signatureImage1);
    }

    if (formData.aadhaarCardFrant1) {
        data.append("aadhaarCardFrant1", formData.aadhaarCardFrant1);
    }

    if (formData.aadhaarCardBack1) {
        data.append("aadhaarCardBack1", formData.aadhaarCardBack1);
    }

    data.append("casteCategory", formData.casteCategoryId);
    data.append("courseId", formData.courseId);
    data.append("examSessionId", formData.examSessionId);
    data.append("genderId", formData.genderId);
    data.append("dOB", formData.dateOfBirth);
    data.append("stateId", formData.stateId);
    data.append("districtId", formData.districtId);
    data.append("locationId", formData.locationId);
    data.append("address", formData.address);
    data.append("pincode", formData.pincode);
    data.append("isActive", formData.isActive);

 

    const response = await api.put(
        "/Student/student-update",
        data,
        {
            headers: {
                
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};



 
export const CreateacademicDetails = async (formData) => {
    const data = new FormData();

    data.append("EntityId", formData.EntityId);
    data.append("Index", formData.Index || 0);
    data.append("LevelTypeId", formData.LevelTypeId || 0);
    data.append("SchoolCollege", formData.SchoolCollege || "");
    data.append("RollNo", formData.RollNo || "");
    data.append("BoardUniversity", formData.BoardUniversity || "");
    data.append("PercentageCgpa", formData.PercentageCgpa || "");

    if (formData.File) {
        data.append("File", formData.File);
    }

    const response = await api.post(
        "/Student/create-academicdetails",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};
 

 
export const getStudentDelete = async (id) => {
    const response = await api.delete(
        `/Student/student-delete/${id}`
    );

    return response.data;
};

export const sendToConfirmStatus = async (ids, userId) => {
    const token = localStorage.getItem("token") || localStorage.getItem("Token");

    const response = await api.put(
        `/StudentApproval/SendToRequest`,
        ids,                             // ⬅️ body me list
        {
            params: { userId: userId },  // ⬅️ query me userId
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


 export const getFranchiseList = async () => {
    const token = localStorage.getItem("token");

    const response = await api.get(
        "/DropDownEmployee/dropdown-emp-getEmployeeFranchiselist",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getMasterSession = async () => {
    const response = await api.get(
        "/DropDownEmployee/dropdown-emp-getmastersession"
    );

    return response.data;
};
export const getState = async () => {
    const response = await api.get(
        "/DropDownEmployee/dropdown-emp-getstate"
    );

    return response.data;
};
export const getDistrict = async (id) => {
    const response = await api.get(
        `/DropDownEmployee/dropdown-emp-getdistrict/${id}`
    );

    return response.data;
};

export const getCity = async (id) => {
    const response = await api.get(
        `/DropDownEmployee/dropdown-emp-getcity/${id}`
    );

    return response.data;
};
 
export const getStudentData = async (id) => {
    const response = await api.get(
        `/DropDownEmployee/dropdown-emp-getmastertypes/${id}`
    );

    return response.data;
};
 
 

export const getCourseCategory = async (id) => {
    const response = await api.get(
        `/DropDownEmployee/dropdown-emp-getCourseCategory/${id}`
    );

    return response.data;
};
export const getCourse = async (id) => {
    const response = await api.get(
        `/DropDownEmployee/dropdown-emp-getCourse/${id}`
    );

    return response.data;
};

export const translateToHindi = async (text) => {
    const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`
    );

    const data = await res.json();

    return data[0][0][0];
};