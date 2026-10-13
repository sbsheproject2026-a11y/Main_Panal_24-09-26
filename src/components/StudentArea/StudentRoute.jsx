 import UpdatePassword from "../EmployeeArea/EmployeePage/UpdatePassword";
import ViewDetails from "../EmployeeArea/Students/ViewDetails";
import StudentDashboard from "./StudentsData/StudentDashboard";
 
 
 

const studentRoute = [
    { path: "/student-dashboard", element: <StudentDashboard /> },

 

    // ✅ Update Password route
    { path: "/update-password-student", element: <UpdatePassword /> },
    { path: "/student-view-profile/:id", element: <ViewDetails /> },
];

export default studentRoute;