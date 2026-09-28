 
 
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
import FranchiseDashboard from "./FranchiseDashboard";




const franchiseRoutes = [
    { path: "/franchise-dashboard", element: <FranchiseDashboard /> },
    {
        path: "/student-create", element: <StudentCreate />
    },
    {
        path: "/student-list", element: <StudentList />
    },
    {
        path: "/student-to-confirm", element: <SendToConfirm />
    },

    {
        path: "/profile", element: <Profile />

    },
     
    { path: "/help", element: <NeedHelp /> },
    { path: "/update-password", element: <UpdatePassword /> },
    { path: "/wallet-recharge", element: <WalletRecharge1 /> },
    { path: "/wallet-history", element: <WalletList /> },
    { path: "/student-update/:id", element: <StudentUpdate /> },
    { path: "/academic-update/:id", element: <AcademicDetailsupdate /> },
    { path: "/details-update/:id", element: <StudyCentreUpdate1 /> },
    { path: "/authority-letterPrint/:id", element: <AuthorityLetterPrint1 /> },
    { path: "/franchise-id-card/:id", element: <FranchiseIdCard /> },
    { path: "/student-view/:id", element: <ViewDetails /> }


];

export default franchiseRoutes;