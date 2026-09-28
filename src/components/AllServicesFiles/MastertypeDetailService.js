import api from "../api";

export const getMasterTypeDetails = async () => {
    const response = await api.get(
        "/MasterTypeDetail/mastertypedetail-getall"
    );

    return response.data;
};

// export const createMasterTypeDetail = async (data) => {
//     const response = await api.post(
//         "/MasterTypeDetail/mastertypedetail-create",
//         data
//     );

//     return response.data;
// };
 export const createMasterTypeDetail = async (formData) => {
  const data = new FormData();

  // =========================
  // Main Website Content
  // =========================

  data.append("Code", formData.code || "");
  data.append("Name", formData.name || "");
 if (formData.file instanceof File) {
    data.append("File", formData.file);
  }
  data.append("ParentId", formData.parentId || "");
  data.append("MasterTypeId", formData.masterTypeId || "");
  data.append(  "IsActive", formData.isActive ? "1" : "0");
   
  const response = await api.post(
     "/MasterTypeDetail/mastertypedetail-create",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const getMasterTypeDetailById = async (id) => {
    const response = await api.get(
        `/MasterTypeDetail/mastertypedetail-getbyid/${id}`
    );

    return response.data;
};



// export const updateMasterTypeDetail = async (data) => {
//     const response = await api.put(
//         "/MasterTypeDetail/mastertypedetail-update",
//         data
//     );

//     return response.data;
// };

 export const updateMasterTypeDetail = async (formData) => {
  const data = new FormData();

  // =========================
  // Main Website Content
  // =========================

  data.append("Id", formData.id || "");
  data.append("Code", formData.code || "");
  data.append("Name", formData.name || "");
 if (formData.file instanceof File) {
    data.append("File", formData.file);
  }
  data.append("ParentId", formData.parentId || "");
  data.append("MasterTypeId", formData.masterTypeId || "");
  data.append(  "IsActive", formData.isActive ? "1" : "0");
   
  const response = await api.put(
     "/MasterTypeDetail/mastertypedetail-update",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getMasterTypeDetailDelete = async (id) => {
    const response = await api.delete(
        `/MasterTypeDetail/mastertypedetail-delete/${id}`
    );

    return response.data;
};


export const getMasterTypes = async () => {
    const response = await api.get(
        "/DropDown/dropdown-getmastertype"
    );

    return response.data;
};
export const getMasterTypesdetails = async () => {
    const response = await api.get(
        "/DropDown/dropdown-getmastertypesdetail-parent"
    );

    return response.data;
};

