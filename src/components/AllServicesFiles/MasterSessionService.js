import api from "../api";

export const getMasterSession = async () => {
    const response = await api.get(
        "/MasterSession/mastersession-getall"
    );

    return response.data;
};

export const createMasterSession = async (data) => {
    const response = await api.post(
        "/MasterSession/mastersession-create",
        data
    );

    return response.data;
};
export const getMasterSessionById = async (id) => {
    const response = await api.get(
        `/MasterSession/mastersession-getbyid/${id}`
    );

    return response.data;
};



export const updateMasterSession = async (data) => {
    const response = await api.put(
        "/MasterSession/mastersession-update",
        data
    );

    return response.data;
};

export const getMasterSessionDelete = async (id) => {
    const response = await api.delete(
        `/MasterSession/mastersession-delete/${id}`
    );

    return response.data;
};


  
export const getStudentMasterSessions = async (id) => {
    const response = await api.get(
        `/DropDown/dropdown-getmastertypes/${id}`
    );

    return response.data;
};
