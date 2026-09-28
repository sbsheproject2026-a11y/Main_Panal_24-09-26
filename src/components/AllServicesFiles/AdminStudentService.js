import api from "../api";
 
export const GetConfirmToAdmin = (pageNo, pageSize, search) => {
    return api.get(
      `/RequestStudent/request-student-confirm-to-admin?spageNo=${pageNo}&pageSize=${pageSize}&search=${search}`
    );
};

export const GetConfirmAddmissions = (pageNo, pageSize, search) => {
    return api.get(
      `/RequestStudent/request-student-confirm-addmissions?spageNo=${pageNo}&pageSize=${pageSize}&search=${search}`
    );
};



export const sendToConfirmStatus = async (ids) => {
    const response = await api.put(
        `/RequestStudent/request-student-confirm`,
        ids
    );

    return response.data;
};

 
export const printAuthorityLetterApi = async (id) => {
    const response = await api.get(
        `/DocumentProfile/admin-authority-letter-print/${id}`
    );

    return response.data;
};

export const printDiplomaApi = async (id) => {
    const response = await api.get(
        `/DocumentProfile/diploma-print/${id}`
    );

    return response.data;
};
export const printMarksheetApi = async (id) => {
    const response = await api.get(
        `/DocumentProfile/document-print-Marksheet-print/${id}`
    );

    return response.data;
};
export const printAdmitCardApi = async (id) => {
    const response = await api.get(
        `/DocumentProfile/document-print-admitcard-print/${id}`
    );

    return response.data;
};

 



export const Getunsetmarks = (pageNo, pageSize, search) => {
    return api.get(
      `/RequestStudent/request-student-unsetmarks?spageNo=${pageNo}&pageSize=${pageSize}&search=${search}`
    );
};

export const getStudentSubjectMarks = async (id) => {
    const response = await api.get(
        `/RequestStudent/student-getsubject/${id}`
    );

    return response.data;
};

//Student Marks Add 
export const submitStudentMarks = async (data) => {
    const response = await api.post(
        "/RequestStudent/student-set-marks",
        data
    );

    return response.data;
};
export const getMasterSessionbyupgrade = async () => {
    const response = await api.get(
        "/DropDownEmployee/dropdown-emp-getmastersession"
    );

    return response.data;
};

export const getCourseClass = async () => {
    const response = await api.get(
        "/DropDown/dropdown-getcourseclass"
    );

    return response.data;
};
export const GetUpgradeStudentList = (pageNo, pageSize, search) => {
    return api.get(
      `/RequestStudent/request-upgrade-student-list?spageNo=${pageNo}&pageSize=${pageSize}&search=${search}`
    );
};

export const addStudentClass = async (data) => {
    const response = await api.post(
        `/RequestStudent/request-upgrade-addclass`,
        data
    );

    return response.data;
};