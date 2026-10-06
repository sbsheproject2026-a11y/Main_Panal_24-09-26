 import EmployeeDashboard from "./EmployeeDashboard";
import EmpFranchiseList from "./EmpFranchise/EmpFranchiseList";
import SendToConfirm from "./Students/SendToConfirm";
import StudentCreate from "./Students/StudentCreate";
import StudentList from "./Students/StudentList";
import StudentUpdate from "./Students/StudentUpdate";
import Profile from "./EmployeePage/Profile";
import NeedHelp from "./EmployeePage/NeedHelp";
import ViewDetails from "./Students/ViewDetails";
import AcademicDetailsupdate from "./Students/AcademicDetailsupdate";

import WalletList from "./WalletWorking/WalletList";
import AuthorityLetterPrint1 from "./DocumentPrintFiles/AuthorityLetterPrint1";
import StudyCentreUpdate1 from "./EmployeePage/StudyCentreUpdate1";
import UpdatePassword from "./EmployeePage/UpdatePassword";
import WalletRecharge1 from "./WalletWorking/WalletRecharge1";
import FranchiseIdCard from "./DocumentPrintFiles/FranchiseIdCard";
import AddressPrint from "./EmpFranchise/AddressPrint";
import SetMarksStudent from "./Students/SetMarksStudent";
import ConfirmStudent from "./Students/ConfirmStudent";
 
 


const employeeRoutes = [
    // ===== Common Routes (6, 90, 33 sab ke liye) =====
    { path: "/employee-dashboard", element: <EmployeeDashboard />, role: ["6", "90", "33"] },
    { path: "/student-create", element: <StudentCreate />, role: ["6", "90", "33"] },
    { path: "/student-list", element: <StudentList />, role: ["6", "90", "33"] },
    { path: "/student-to-confirm", element: <SendToConfirm />, role: ["6", "90", "33"] },
    { path: "/profile", element: <Profile />, role: ["6", "90", "33"] },
    { path: "/help", element: <NeedHelp />, role: ["6", "90", "33"] },
    { path: "/update-password", element: <UpdatePassword />, role: ["6", "90", "33"] },
    { path: "/wallet-recharge", element: <WalletRecharge1 />, role: ["6", "90", "33"] },
    { path: "/wallet-history", element: <WalletList />, role: ["6", "90", "33"] },
    { path: "/student-update/:id", element: <StudentUpdate />, role: ["6", "90", "33"] },
    { path: "/academic-update/:id", element: <AcademicDetailsupdate />, role: ["6", "90", "33"] },
    { path: "/details-update/:id", element: <StudyCentreUpdate1 />, role: ["6", "90", "33"] },
    { path: "/authority-letterPrint/:id", element: <AuthorityLetterPrint1 />, role: ["6", "90", "33"] },
    { path: "/franchise-id-card/:id", element: <FranchiseIdCard />, role: ["6", "90", "33"] },
    { path: "/student-view/:id", element: <ViewDetails />, role: ["6", "90", "33"] },

    // ===== Sirf Role 33 (Franchise) ke liye =====
    { path: "/emp-franchise-list", element: <EmpFranchiseList />, role: ["33"] },
    { path: "/address-print", element: <AddressPrint  />, role: ["33"] },
    { path: "/set-marks", element: <SetMarksStudent  />, role: ["33"] },
    { path: "/student-print-list", element: <ConfirmStudent  />, role: ["33"] },
    

     
];

export default employeeRoutes;