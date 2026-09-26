import api from "../api";

export const createlogin = async (data) => {
    const response = await api.post("/Login/login", data);
    return response.data;
};