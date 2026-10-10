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
 
import AccRegisterList from "./Frenchise/AccRegisterList";
import StudyCentreUpdate from "./Frenchise/StudyCentreUpdate";
import WalletList from "./WalletWorking/WalletList";
import WalletRecharge from "./WalletWorking/WalletRecharge";
import ProductAmountAdd from "./Course/ProductAmountAdd";
import AccUpdate from "./Frenchise/AccUpdate";
import CourseCategory from "./Course/CourseCategory";
import Department from "./Course/Department";
import CourseMaterial from "./Course/CourseMaterial";
import WebsiteContent from "./WebsiteContentData/WebsiteContent";
import AccPendingList from "./Frenchise/AccPendingList";
import PendingWalletRequest from "./WalletWorking/PendingWalletRequest";
import FranchiseCommission from "./Course/FranchiseCommission";
import SetCourseCommission from "./Course/SetCourseCommission";
import RejectList from "./Frenchise/RejectList";
import ViewDetails from "../EmployeeArea/Students/ViewDetails";
import StudentUpdate from "../EmployeeArea/Students/StudentUpdate";
import EnquiriesList from "./Enquiries/EnquiriesList";
import RTIList from "./Enquiries/RTIList";
import OfflinePaymentList from "./CommanList/OfflinePaymentList";
 


const adminRoutes = [
    { path: "/dashboard", element: <Dashboard />, role: ["5"] },
    { path: "/website-content", element: <WebsiteContent />, role: ["5"] },
    { path: "/mastertype", element: <MasterType />, role: ["5"] },
    { path: "/mastertypeDetails", element: <MasterTypeDetails />, role: ["5"] },
    { path: "/course-category", element: <CourseCategory />, role: ["5"] },
    { path: "/department", element: <Department />, role: ["5"] },
    { path: "/mastersession", element: <MasterSession />, role: ["5"] },
    { path: "/course-create", element: <CourseCreate />, role: ["5"] },
    { path: "/course-list", element: <CourseList />, role: ["5"] },
    { path: "/course-update/:id", element: <CourseUpdate />, role: ["5"] },
    { path: "/franchise-create", element: <FrenchiseCreate />, role: ["5"] },
    { path: "/franchise-list", element: <FrenchiseList />, role: ["5"] },
    { path: "/reject-list", element: <RejectList />, role: ["5"] },
    { path: "/acc-pending", element: <AccPendingList />, role: ["5"] },
    { path: "/acc-list", element: <AccRegisterList />, role: ["5"] },
    { path: "/pending-wallet-request", element: <PendingWalletRequest />, role: ["5"] },
    { path: "/franchise-commission", element: <FranchiseCommission />, role: ["5"] },
    { path: "/Course-commission", element: <SetCourseCommission />, role: ["5"] },
    { path: "/admin-wallet-list", element: <WalletList />, role: ["5"] },
    { path: "/admin-wallet-recharge", element: <WalletRecharge />, role: ["5"] },
    { path: "/frenchise-update/:id", element: <FrenchiseUpdate />, role: ["5"] },
    { path: "/acc-update/:id", element: <AccUpdate />, role: ["5"] },
    { path: "/study-centre-update/:id", element: <StudyCentreUpdate />, role: ["5"] },
    { path: "/employee-create", element: <EmployeeCreate />, role: ["5"] },
    { path: "/employee-list", element: <EmployeeList />, role: ["5"] },
    { path: "/enquiries-list", element: <EnquiriesList />, role: ["5"] },
    { path: "/r-t-i-list", element: <RTIList />, role: ["5"] },
    { path: "/employee-update/:id", element: <EmployeeUpdate />, role: ["5"] },
    { path: "/users-profile", element: <Usersprofile />, role: ["5"] },
    { path: "/employee-frenchise-assign", element: <EmployeeFrenchiseAssing />, role: ["5"] },
    { path: "/student-view1/:id", element: <ViewDetails />, role: ["5"] },
    { path: "/student-update1/:id", element: <StudentUpdate />, role: ["5"] },
    { path: "/state", element: <State />, role: ["5"] },
    { path: "/district", element: <District />, role: ["5"] },
    { path: "/city", element: <City />, role: ["5"] },
    { path: "/confirm-addmissions", element: <ConfirmStudent />, role: ["5"] },
    { path: "/send-to-confirm-student", element: <SendToConfirmStudent />, role: ["5"] },
    { path: "/subject-create/:id", element: <SubjectCreate />, role: ["5"] },
    { path: "/course-amount/:id", element: <ProductAmountAdd />, role: ["5"] },
    { path: "/course-material/:id", element: <CourseMaterial />, role: ["5"] },
    { path: "/student-setmarks", element: <SetMarksStudent />, role: ["5"] },
    { path: "/student-upgrade", element: <UpgradeStudent />, role: ["5"] },
    { path: "/student-rollno-list", element: <RollNoList />, role: ["5"] },
    { path: "/offline-payments", element: <OfflinePaymentList  />, role: ["5"] },
    
];

export default adminRoutes;