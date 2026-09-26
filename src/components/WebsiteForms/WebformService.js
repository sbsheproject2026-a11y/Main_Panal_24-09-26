import api from "../api";

export const createAccRegistration = async (formData) => {
    const data = new FormData();

    data.append("name", formData.name?.trim() || "");
    data.append("fatherName", formData.fatherName?.trim() || "");
    data.append("dob", formData.dob || "");
    data.append("instituteName", formData.instituteName?.trim() || "");
    data.append("experience", formData.experience?.trim() || "");
    data.append("occupation", formData.occupation?.trim() || "");
    data.append("expectedAdmissions", formData.expectedAdmissions ?? "");
    data.append("mobileNo", formData.mobileNo || "");
    data.append("whatsAppNo", formData.whatsAppNo || "");
    data.append("email", formData.email?.trim() || "");
    data.append("stateId", formData.stateId ?? 0);
    data.append("districtId", formData.districtId ?? 0);
    data.append("locationId", formData.locationId ?? 0);
    data.append("address", formData.address?.trim() || "");
    data.append("pincode", formData.pincode || "");
    data.append("remark", formData.remark?.trim() || "");
    data.append("isActive", formData.isActive ?? 1);

    const response = await api.post("/Home/acc-create", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};


export const createStudentfordata = async (formData) => {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("studentNameHindi", formData.studentNameHindi);
    data.append("fatherName", formData.fatherName);
    data.append("fatherNameHindi", formData.fatherNameHindi);
    data.append("motherName", formData.motherName);
    data.append("mobileNo", formData.mobileNo);
    data.append("email", formData.email);
    data.append("idNumber", formData.idNumber);

    // =========================================================
    // Images
    // =========================================================

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

    // =========================================================
    // API Request
    // Token removed
    // =========================================================

    const response = await api.post(
        "/Home/new-student-create",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


 

 export const createStudyCentre = async (formData) => {
    const data = new FormData();

    // Personal / Basic Details
    data.append("name", formData.centerName?.trim() || "");
    data.append("fatherName", formData.ownerName?.trim() || "");
    data.append("mobileNo", formData.mobile || "");
    data.append("email", formData.email?.trim() || "");
      data.append("whatsAppNo", formData.alternateMobile || "");
       // Department / Courses
    formData.departmentIds.forEach((department, index) => {

            data.append(
                `DepartmentIds[${index}].DepartmentId`,
                department.departmentId
            );

        });
          

    // Center / Institute Details
    data.append("experience", formData.experience?.trim() || "");
    data.append("InstituteTypeId", formData.instituteType || "");
    data.append("affiliation", formData.affiliation?.trim() || "");
    data.append("website", formData.website?.trim() || "");

    // Location Details
    data.append("locationId", formData.locationId ?? "");
    data.append("address", formData.address?.trim() || "");
    data.append("pincode", formData.pinCode || "");

    // Infrastructure Details
    data.append("totalArea", formData.totalArea ?? "");
    data.append("numberofClassrooms", formData.classrooms ?? "");
    data.append("computerLabAvailable", formData.computerLab || "");
    data.append("numberofComputers", formData.numberOfComputers ?? "");
    data.append("otherFacilities", formData.otherFacilities?.trim() || "");

    // Verification Details
    data.append("aadhaarCardNumber", formData.aadhaarNumber || "");
    data.append("pANCardNumber", formData.panNumber?.toUpperCase() || "");

    // Course / Message Details
    //data.append("coursesOffered", formData.coursesOffered?.trim() || "");
    data.append("remark", formData.message?.trim() || "");
  
    data.append("isActive", formData.isActive ?? 1);

    // Documents
    if (formData.passportPhoto) {
        data.append("PassportPhoto1", formData.passportPhoto);
    }

    if (formData.authorizedSignature) {
        data.append("AuthorizedSignature1", formData.authorizedSignature);
    }

    if (formData.aadhaarCard) {
        data.append("AadhaarCard1", formData.aadhaarCard);
    }

    if (formData.panCard) {
        data.append("PanCard1", formData.panCard);
    }
    if (formData.instituteCertificate) {
        data.append("instituteCertificate1", formData.instituteCertificate);
    }
    if (formData.buildingPhoto1) {
        data.append("buildingPhoto11", formData.buildingPhoto1);
    }
    if (formData.buildingPhoto2) {
        data.append("buildingPhoto22", formData.buildingPhoto2);
    }


      // ✅ YAHAN ADD KARO — api.post se pehle
    console.log("URL:", "/Home/study-center-create");
    console.log("Data size:", data);
    console.log("Entries:", [...data.entries()].length);
    const response = await api.post("/Home/study-center-create", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};
