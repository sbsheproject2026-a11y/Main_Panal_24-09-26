 import StudentPaymentHistory from "../AdminArea/CommanList/StudentPaymentHistory";
import NeedHelp from "../EmployeeArea/EmployeePage/NeedHelp";
import UpdatePassword from "../EmployeeArea/EmployeePage/UpdatePassword";
import ViewDetails from "../EmployeeArea/Students/ViewDetails";
import CourseDetails from "./StudentsData/CourseDetails";
import StudentDashboard from "./StudentsData/StudentDashboard";
 
 
 

const studentRoute = [
    { path: "/student-dashboard", element: <StudentDashboard /> },
    { path: "/update-password-student", element: <UpdatePassword /> },
    { path: "/student-courses/:id", element: <CourseDetails /> },
    { path: "/student-view-profile/:id", element: <ViewDetails /> },
    { path: "/help", element: <NeedHelp /> },
    { path: "/student-payments-view/:id", element: <StudentPaymentHistory /> },
    
];

export default studentRoute;