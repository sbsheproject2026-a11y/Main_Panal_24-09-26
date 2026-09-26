import api from "../../api";
//---------------------State Apis Start -------------------//
export const getStates = async () => {
    const response = await api.get(
        "/State/state-getall"
    );

    return response.data;
};


export const createStates = async (data) => {
    const response = await api.post(
        "/State/state-create",
        data
    );

    return response.data;
};
export const getStatesById = async (id) => {
    const response = await api.get(
        `/State/state-getbyid/${id}`
    );

    return response.data;
};



export const updateStates = async (data) => {
    const response = await api.put(
        "/State/state-update",
        data
    );

    return response.data;
};

export const getStatesDelete = async (id) => {
    const response = await api.delete(
        `/State/state-delete/${id}`
    );

    return response.data;
};

//---------------------State Apis End -------------------//

//---------------------District Apis Start -------------------//

export const getDistricts = async () => {
    const response = await api.get(
        "/District/district-getall"
    );

    return response.data;
};


export const createDistricts = async (data) => {
    const response = await api.post(
        "/District/district-create",
        data
    );

    return response.data;
};
export const getDistrictsById = async (id) => {
    const response = await api.get(
        `/District/district-getbyid/${id}`
    );

    return response.data;
};



export const updateDistricts = async (data) => {
    const response = await api.put(
        "/District/district-update",
        data
    );

    return response.data;
};

export const getDistrictsDelete = async (id) => {
    const response = await api.delete(
        `/District/district-delete/${id}`
    );

    return response.data;
};
export const getState = async () => {
    const response = await api.get(
        "/DropDownEmployee/dropdown-emp-getstate"
    );

    return response.data;
};

//---------------------District Apis End -------------------//


//---------------------City Apis Start -------------------//

export const getCitys = async () => {
    const response = await api.get(
        "/City/city-getall"
    );

    return response.data;
};


export const createCitys = async (data) => {
    const response = await api.post(
        "/City/city-create",
        data
    );

    return response.data;
};
export const getCitysById = async (id) => {
    const response = await api.get(
        `/City/city-getbyid/${id}`
    );

    return response.data;
};



export const updateCitys = async (data) => {
    const response = await api.put(
        "/City/city-update",
        data
    );

    return response.data;
};

export const getCitysDelete = async (id) => {
    const response = await api.delete(
        `/City/city-delete/${id}`
    );

    return response.data;
};

export const getDistrict = async (id) => {
    const response = await api.get(
        `/DropDownEmployee/dropdown-emp-getdistrict/${id}`
    );

    return response.data;
};
//---------------------City Apis End -------------------//