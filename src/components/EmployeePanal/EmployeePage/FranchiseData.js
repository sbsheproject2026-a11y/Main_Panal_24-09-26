import api from "../../api";

export const getFrenchiseById = async (id) => {
    const response = await api.get(
        `/Home/emp-frenchise-getbyid/${id}`
    );

    return response.data;
};

  export const updateStudyCentre = async (formData) => {
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