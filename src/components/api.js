import axios from "axios";

const api = axios.create({
//baseURL: "https://api.shaheedbhagatsinghhealthandeducation.com/api",
    baseURL: "http://localhost:5188/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export const FILE_URL = "http://localhost:5188/uploads/";
//export const FILE_URL = "https://api.shaheedbhagatsinghhealthandeducation.com/Uploads/";

export default api;
