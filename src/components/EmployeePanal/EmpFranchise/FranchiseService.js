import api from "../../api";
 
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