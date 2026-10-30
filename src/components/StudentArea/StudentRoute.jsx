 import StudentPaymentHistory from "../AdminArea/CommanList/StudentPaymentHistory";
import NeedHelp from "../EmployeeArea/EmployeePage/NeedHelp";
import UpdatePassword from "../EmployeeArea/EmployeePage/UpdatePassword";
import ViewDetails from "../EmployeeArea/Students/ViewDetails";
import CourseDetails from "./StudentsData/CourseDetails";
import ReRegistration from "./StudentsData/ReRegistration";
import StudentDashboard from "./StudentsData/StudentDashboard";
 
import StudentExamList from "./StudentsData/StudentExamList";
import StudentExamQuestion from "./StudentsData/StudentExamQuestion";
 
 
 

const studentRoute = [
    { path: "/student-dashboard", element: <StudentDashboard /> },
    { path: "/update-password-student", element: <UpdatePassword /> },
    { path: "/student-courses/:id", element: <CourseDetails /> },
    { path: "/student-view-profile/:id", element: <ViewDetails /> },
 
    { path: "/help", element: <NeedHelp /> },
    { path: "/student-exam-list", element: <StudentExamList /> },
    { path: "/student-payments-view/:id", element: <StudentPaymentHistory /> },
    { path: "/re-registration/:id", element: <ReRegistration /> },
    { path: "/exam-question", element: <StudentExamQuestion /> },
    
];

export default studentRoute;