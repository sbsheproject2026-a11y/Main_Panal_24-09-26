import api from "../api";

 

 
 

export const getEmployees = (pageNo, pageSize, search) => {
    return api.get(
      `/Employee/employee-getall?referenceId=1&pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`
    );
};


export const createEmployee = async (formData) => {
  const data = new FormData();

  data.append("code", formData.code);
  data.append("name", formData.name);
  data.append("fatherName", formData.fatherName);
  data.append("mobileNo", formData.mobileNo);
  data.append("whatsAppNo", formData.whatsAppNo);
  data.append("email", formData.email);
  data.append("idNumber", formData.idNumber);

  // Image
  if (formData.selfImage1) {
    data.append("selfImage1", formData.selfImage1);
  }
  data.append("employeeTypeId", formData.employeeTypeId);
  data.append("designationId", formData.designationId);
  data.append("genderId", formData.genderId);
  data.append("departmentId", formData.departmentId);
  data.append("dateOfJoining", formData.dateOfJoining);
  data.append("stateId", formData.stateId);
  data.append("districtId", formData.districtId);
  data.append("locationId", formData.locationId);
  data.append("address", formData.address);
  data.append("pincode", formData.pincode);
  data.append("isActive", formData.isActive);

  const response = await api.post(
    "/Employee/employee-create",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getEmployeeById = async (id) => {
    const response = await api.get(
        `/Employee/employee-getbyid/${id}`
    );

    return response.data;
};
 

export const updateEmployee = async (formData) => {
  const data = new FormData();

  data.append("id", formData.id);
  data.append("code", formData.code);
  data.append("name", formData.name);
  data.append("fatherName", formData.fatherName);
  data.append("mobileNo", formData.mobileNo);
  data.append("whatsAppNo", formData.whatsAppNo);
  data.append("email", formData.email);
  data.append("idNumber", formData.idNumber);
  data.append("selfImage", formData.selfImage);

  // Image
  if (formData.selfImage1) {
    data.append("selfImage1", formData.selfImage1);
  }

  data.append("employeeTypeId", formData.employeeTypeId);
  data.append("designationId", formData.designationId);
  data.append("genderId", formData.genderId);
  data.append("departmentId", formData.departmentId);
  data.append("dateOfJoining", formData.dateOfJoining);
  data.append("stateId", formData.stateId);
  data.append("districtId", formData.districtId);
  data.append("locationId", formData.locationId);
  data.append("address", formData.address);
  data.append("pincode", formData.pincode);
  data.append("isActive", formData.isActive);

  const response = await api.put(
    "/Employee/employee-update",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getEmployeeDelete = async (id) => {
    const response = await api.delete(
        `/Employee/employee-delete/${id}`
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

  
 export const getGender = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};
 export const getEmployeeType = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};

 export const getDepartment = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};

 export const getDesignation = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};


export const getEmployeesAssign = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-entityuser/${id}`
    );

    return response.data;
};

export const getFrenchisesAssign = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-entityuser/${id}`
    );

    return response.data;
};
export const getFrenchisesAssignDelete = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-entityuser/${id}`
    );

    return response.data;
};

export const createAssignFrenchise = async (data) => {
    const response = await api.post(
        "/Employee/employee-assignfrenchise",
        data
    );

    return response.data;
};

export const getAssignFrenchises = (pageNo, pageSize, search) => {
    return api.get(
      `/Employee/employee-getassignfrenchise?referenceId=1&pageNo=${pageNo}&pageSize=${pageSize}&search=${search}`
    );
};

export const getFrenchiseAssignDelete = async (id) => {
    const response = await api.delete(
        `/Employee/employee-deleteassignfrenchise/${id}`
    );

    return response.data;
};


export const getEnquiries = (id) => {
    return api.get(
      `/Enquiries/Enquiries-getall?id=${id} `
    );
};
export const deleteEnquiry = async (id) => {
    const response = await api.delete(
        `/Enquiries/Enquiries-delete/${id}`
    );

    return response.data;
};