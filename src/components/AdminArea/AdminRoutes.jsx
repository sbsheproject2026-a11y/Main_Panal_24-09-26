import Dashboard from "./Dashboard";
import MasterType from "./MasterDetail/MasterType";
import MasterTypeDetails from "./MasterDetail/MasterTypeDetails";
import CourseCreate from "./Course/CourseCreate";
import CourseList from "./Course/CourseList";
import FrenchiseCreate from "./Frenchise/FrenchiseCreate";
import FrenchiseList from "./Frenchise/FrenchiseList";
import FrenchiseUpdate from "./Frenchise/FrenchiseUpdate";
import State from "./Location/State";
import District from "./Location/District";
import City from "./Location/City";
import CourseUpdate from "./Course/CourseUpdate";
import MasterSession from "./MasterDetail/MasterSession";
import EmployeeCreate from "./Employee/EmployeeCreate";
import EmployeeList from "./Employee/EmployeeList";
import EmployeeFrenchiseAssing from "./Employee/EmployeeFrenchiseAssing";
import EmployeeUpdate from "./Employee/EmployeeUpdate";
import Usersprofile from "./Employee/Usersprofile";
 
import SendToConfirmStudent from "./AdminStudent/SendToConfirmStudent";
import ConfirmStudent from "./AdminStudent/ConfirmStudent";
import SubjectCreate from "./Course/SubjectCreate";
import SetMarksStudent from "./AdminStudent/SetMarksStudent";
import UpgradeStudent from "./AdminStudent/UpgradeStudent";
import RollNoList from "./AdminStudent/RollNoList";
import DiplomaPrint from "../DocumentPrintFiles/AllDocumentsPrint/DiplomaPrint";
import MarksheetPrint from "../DocumentPrintFiles/AllDocumentsPrint/MarksheetPrint";
import MigrationCertificate from "../DocumentPrintFiles/AllDocumentsPrint/MigrationCertificate";
import IdCard from "../DocumentPrintFiles/AllDocumentsPrint/IdCard";
import AdmitCardPrint from "../DocumentPrintFiles/AllDocumentsPrint/AdmitCardPrint";
import EnquiriesList from "./EnquiriesList";
import AccRegisterList from "./Frenchise/AccRegisterList";
import StudyCentreUpdate from "./Frenchise/StudyCentreUpdate";
import WalletList from "./WalletWorking/WalletList";
import WalletRecharge from "./WalletWorking/WalletRecharge";
import ProductAmountAdd from "./Course/ProductAmountAdd";
import AuthorityLetterPrint from "../DocumentPrintFiles/AllDocumentsPrint/AuthorityLetterPrint";
import AccUpdate from "./Frenchise/AccUpdate";
import CourseCategory from "./Course/CourseCategory";
import Department from "./Course/Department";
import CourseMaterial from "./Course/CourseMaterial";
import WebsiteContent from "./WebsiteContentData/WebsiteContent";
import AccPendingList from "./Frenchise/AccPendingList";
import PendingWalletRequest from "./WalletWorking/PendingWalletRequest";
import FranchiseCommission from "./Course/FranchiseCommission";
import SetCourseCommission from "./Course/SetCourseCommission";
import FranchiseIdCard from "../DocumentPrintFiles/AllDocumentsPrint/FranchiseIdCard";
import CourierReceipt from "./CourierReceipt";
 
 
 
 

const adminRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/courier", element: <CourierReceipt /> },
    { path: "/website-content", element: <WebsiteContent /> },
    { path: "/mastertype", element: <MasterType /> },
    { path: "/mastertypeDetails", element: <MasterTypeDetails /> },
    { path: "/course-category", element: <CourseCategory /> },
    { path: "/department", element: <Department /> },
    { path: "/mastersession", element: <MasterSession /> },
    { path: "/course-create", element: <CourseCreate /> },
    { path: "/course-list", element: <CourseList /> },
    { path: "/course-update/:id", element: <CourseUpdate /> },
    { path: "/franchise-create", element: <FrenchiseCreate /> },
    { path: "/franchise-list", element: <FrenchiseList /> },
    { path: "/acc-pending", element: <AccPendingList /> },
    { path: "/acc-list", element: <AccRegisterList /> },
    { path: "/pending-wallet-request", element: <PendingWalletRequest /> },
    { path: "/franchise-commission", element: <FranchiseCommission /> },
    { path: "/Course-commission", element: <SetCourseCommission /> },
    { path: "/admin-wallet-list", element: <WalletList /> },
    { path: "/admin-wallet-recharge", element: <WalletRecharge /> },
    { path: "/frenchise-update/:id", element: <FrenchiseUpdate /> },
    { path: "/acc-update/:id", element: <AccUpdate /> },
    { path: "/study-centre-update/:id", element: <StudyCentreUpdate /> },
    { path: "/employee-create", element: <EmployeeCreate /> },
    { path: "/employee-list", element: <EmployeeList /> },
    { path: "/enquiries-list", element: <EnquiriesList /> },
    { path: "/employee-update/:id", element: <EmployeeUpdate /> },
    { path: "/users-profile", element: <Usersprofile /> },
    { path: "/employee-frenchise-assign", element: <EmployeeFrenchiseAssing /> },
    { path: "/state", element: <State /> },
    { path: "/district", element: <District /> },
    { path: "/city", element: <City /> },
    { path: "/confirm-addmissions", element: <ConfirmStudent /> },
    { path: "/send-to-confirm-student", element: <SendToConfirmStudent /> },
    { path: "/subject-create/:id", element: <SubjectCreate /> },
    { path: "/course-amount/:id", element: <ProductAmountAdd /> },
    { path: "/course-material/:id", element: <CourseMaterial /> },
    { path: "/student-setmarks", element: <SetMarksStudent /> },
    { path: "/student-upgrade", element: <UpgradeStudent /> },
    { path: "/student-rollno-list", element: <RollNoList /> },
    { path: "/diploma-print/:id", element: <DiplomaPrint /> },
    { path: "/migration-certificate/:id", element: <MigrationCertificate /> },
    { path: "/marksheet-print/:id", element: <MarksheetPrint /> },
    { path: "/authority-letterPrint-print/:id", element: <AuthorityLetterPrint /> },
    { path: "/id-card-print/:id", element: <FranchiseIdCard /> },
    { path: "/admit-card-print/:id", element: <AdmitCardPrint /> },
    { path: "/id-card/:id", element: <IdCard /> }
     
    
];

export default adminRoutes;