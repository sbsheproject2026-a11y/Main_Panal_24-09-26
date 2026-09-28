 
import api from "../api";

export const getFrenchises = (typeid,pageNo, pageSize, search) => {
  return api.get(
    `/Frenchise/frenchise-getall?typeid=${typeid}&referenceId=1&pageNo=${pageNo}&pageSize=${pageSize}&search=${encodeURIComponent(search || "")}`
  );
};

 

export const createFrenchise = async (data) => {
    const response = await api.post(
        "/Frenchise/frenchise-create",
        data
    );

    return response.data;
};
export const getFrenchiseById = async (id) => {
    const response = await api.get(
        `/Frenchise/frenchise-getbyid/${id}`
    );

    return response.data;
};
export const updateFrenchise = async (data) => {

    const response = await api.put(
        "/Frenchise/frenchise-update",
        data
    );

    return response.data;
};

export const getFrenchiseDelete = async (id) => {
    const response = await api.delete(
        `/Frenchise/frenchise-delete/${id}`
    );

    return response.data;
};

export const getState = async () => {
    const response = await api.get(
        "/DropDown/dropdown-getstate"
    );

    return response.data;
};
export const getDistrict = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getdistrict/${id}`
    );

    return response.data;
};

export const getCity = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getcity/${id}`
    );

    return response.data;
};

export const getAccAcountLists = (typeid,pageNo, pageSize, search) => {
  return api.get(
    `/AdmissionConsultant/acc-getall?typeid=${typeid}&referenceId=1&pageNo=${pageNo}&pageSize=${pageSize}&search=${encodeURIComponent(search || "")}`
  );
};
export const getAccAcountPendingLists = (typeid,pageNo, pageSize, search) => {
  return api.get(
    `/AdmissionConsultant/franchise-penging-getall?typeid=${typeid}&referenceId=1&pageNo=${pageNo}&pageSize=${pageSize}&search=${encodeURIComponent(search || "")}`
  );
};

export const getAccAcountDelete = async (id) => {
    const response = await api.delete(
        `/Frenchise/frenchise-delete/${id}`
    );

    return response.data;
};


 export const updateStudyCentre = async (formData) => {
    const data = new FormData();

    // Personal / Basic Details
      data.append("id", formData.id);
    data.append("name", formData.centerName?.trim() || "");
    data.append("fatherName", formData.ownerName?.trim() || "");
    data.append("mobileNo", formData.mobile || "");
    data.append("email", formData.email?.trim() || "");
      data.append("whatsAppNo", formData.alternateMobile || "");

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
    data.append("aadhaarCardimage", formData.aadhaarCard1?.toUpperCase() || "");
    data.append("panCardimage", formData.panCard1?.toUpperCase() || "");
    data.append("passportPhoto", formData.passportPhoto1?.toUpperCase() || "");
    data.append("authorizedSignature", formData.authorizedSignature1?.toUpperCase() || "");
    data.append("instituteCertificate", formData.instituteCertificate1?.toUpperCase() || "");
    data.append("buildingPhoto1", formData.buildingPhoto11?.toUpperCase() || "");
    data.append("buildingPhoto2", formData.buildingPhoto21?.toUpperCase() || "");

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

    const response = await api.put("/Frenchise/frenchise-update", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};
 export const updateaccCentre = async (formData) => {
    const data = new FormData();

    // Personal / Basic Details
    data.append("id", formData.id);
    data.append("name", formData.name?.trim() || "");
    data.append("fatherName", formData.fatherName?.trim() || "");
    data.append("dob", formData.dob?.trim() || "");
    data.append("instituteName", formData.instituteName?.trim() || "");
    data.append("mobileNo", formData.mobileNo || "");
    data.append("whatsAppNo", formData.whatsAppNo || "");
    data.append("email", formData.email?.trim() || "");
    data.append("whatsAppNo", formData.alternateMobile || "");

    // Center / Institute Details
    data.append("experience", formData.experience?.trim() || "");
    data.append("occupation", formData.occupation?.trim() || "");
    data.append("expectedAdmissions", formData.expectedAdmissions?.trim() || "");

    // Location Details
    data.append("locationId", formData.locationId ?? "");
    data.append("address", formData.address?.trim() || "");
    data.append("pincode", formData.pincode || "");

     

    // Verification Details
   
    data.append("aadhaarCardimage", formData.aadhaarCard1?.toUpperCase() || "");
    data.append("panCardimage", formData.panCard1?.toUpperCase() || "");
    data.append("passportPhoto", formData.passportPhoto1?.toUpperCase() || "");
    data.append("authorizedSignature", formData.authorizedSignature1?.toUpperCase() || "");
    data.append("instituteCertificate", formData.instituteCertificate1?.toUpperCase() || "");
    data.append("buildingPhoto1", formData.buildingPhoto11?.toUpperCase() || "");
    data.append("buildingPhoto2", formData.buildingPhoto21?.toUpperCase() || "");

    // Course / Message Details
    //data.append("coursesOffered", formData.coursesOffered?.trim() || "");
    data.append("remark", formData.remark?.trim() || "");
  
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

    const response = await api.put("/AdmissionConsultant/acc-update", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};


export const getaccById = async (id) => {
    const response = await api.get(
        `/AdmissionConsultant/acc-getbyid/${id}`
    );

    return response.data;
};

export const sendToConfirmStatus = async (ids, code) => {
  const response = await api.put(
    `/AdmissionConsultant/request-ConfirmToAdmin?code=${code}`,
    ids
  );
  return response.data;
};


export const getEmpFrenchises = (pageNo, pageSize, search) => {
    const token = localStorage.getItem("token");

    return api.get(
        `/EmployeeFranchiseAssign/emp-franchise-list?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export const getFrenchiseByIdapi = async (id) => {
    const response = await api.get(
        `/Home/emp-frenchise-getbyid/${id}`
    );

    return response.data;
};

  export const updateStudyCentreapi = async (formData) => {
    const data = new FormData();

    // Personal / Basic Details
    data.append("id", formData.id || "");
     
    // Verification Details
    data.append("aadhaarCardNumber", formData.aadhaarNumber || "");
    data.append("pANCardNumber", formData.panNumber?.toUpperCase() || "");
    data.append("aadhaarCardimage", formData.aadhaarCard1?.toUpperCase() || "");
    data.append("panCardimage", formData.panCard1?.toUpperCase() || "");
    data.append("passportPhoto", formData.passportPhoto1?.toUpperCase() || "");
    data.append("authorizedSignature", formData.authorizedSignature1?.toUpperCase() || "");
    data.append("instituteCertificate", formData.instituteCertificate1?.toUpperCase() || "");
    data.append("buildingPhoto1", formData.buildingPhoto11?.toUpperCase() || "");
    data.append("buildingPhoto2", formData.buildingPhoto21?.toUpperCase() || "");
  
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

    const response = await api.put("/Home/emp-frenchise-update", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

export const updatePasswordapi = async (data) => {
  const response = await api.put(
    "/Home/emp-update-password",
    data
  );

  return response.data;
};