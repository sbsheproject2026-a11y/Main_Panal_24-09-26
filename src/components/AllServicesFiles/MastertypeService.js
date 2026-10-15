import api from "../api";

export const getMasterTypes = async () => {
    const response = await api.get(
        "/MasterType/mastertype-getall"
    );

    return response.data;
};

export const createMasterType = async (data) => {
    const response = await api.post(
        "/MasterType/mastertype-create",
        data
    );

    return response.data;
};
export const getMasterTypeById = async (id) => {
    const response = await api.get(
        `/MasterType/mastertype-getbyid/${id}`
    );

    return response.data;
};



export const updateMasterType = async (data) => {
    const response = await api.put(
        "/MasterType/mastertype-update",
        data
    );

    return response.data;
};

export const getMasterTypeDelete = async (id) => {
    const response = await api.delete(
        `/MasterType/mastertype-delete/${id}`
    );

    return response.data;
};



export const getDashboard = async () => {
    const response = await api.get(
        "/DropDown/dashboard"
    );

    return response.data;
};
export const getEmpDashboard = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    "/DropDownEmployee/emp-dashboard",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};