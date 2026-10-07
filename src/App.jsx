import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './components/LoginFile/Login'

import ProtectedRoute from './components/LoginFile/ProtectedRoute'
import AdminLayout from './components/AdminArea/AllLayout/AdminLayout'
import EmployeeLayout from './components/EmployeeArea/EmployeeLayout/EmployeeLayout'

import adminRoutes from './components/AdminArea/AdminRoutes'
import employeeRoutes from './components/EmployeeArea/EmployeeRoute'
import studentRoute from './components/StudentArea/StudentRoute'

import AdmissionConsultantRegistration from './components/WebsiteForms/AdmissionConsultantRegistration'
import StudentRegistration from './components/WebsiteForms/StudentRegistration'
import StudyCenterRegistration from './components/WebsiteForms/StudyCenterRegistration'
import Success from './components/WebsiteForms/Success'

import DiplomaPrint from './components/DocumentPrintFiles/AllDocumentsPrint/DiplomaPrint'
import MigrationCertificate from './components/DocumentPrintFiles/AllDocumentsPrint/MigrationCertificate'
import MarksheetPrint from './components/DocumentPrintFiles/AllDocumentsPrint/MarksheetPrint'
import AdmitCardPrint from './components/DocumentPrintFiles/AllDocumentsPrint/AdmitCardPrint'
import IdCard from './components/DocumentPrintFiles/AllDocumentsPrint/IdCard'
import AuthorityLetterPrint from './components/DocumentPrintFiles/AllDocumentsPrint/AuthorityLetterPrint'
import FranchiseIdCard from './components/EmployeeArea/DocumentPrintFiles/FranchiseIdCard'
import AdmissionFormPrint from './components/WebsiteForms/AdmissionFormPrint'
import ViewDetails from './components/EmployeeArea/Students/ViewDetails'


function App() {

    return (
        <>
            <Routes>

                {/* ================= Public Routes ================= */}
                <Route path="/" element={<Login />} />
                <Route path="/acc-apply" element={<AdmissionConsultantRegistration />} />
                <Route path="/student-apply" element={<StudentRegistration />} />
                <Route path="/study-centre-apply" element={<StudyCenterRegistration />} />
              <Route path="/admission-form-print/:id" element={<AdmissionFormPrint />} />
           
            
                <Route path="/success" element={<Success />} />
 

                {/* ================= Admin (Role 5 only) ================= */}
                <Route element={<ProtectedRoute allowedRole={["5"]} />}>
                    <Route element={<AdminLayout />}>
                        {adminRoutes
                            .filter((route) =>
                                route.role?.some((r) => ["5"].includes(r))
                            )
                            .map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={route.element}
                                />
                            ))}
                    </Route>
                </Route>


                {/* ================= Common — Admin (5) + Franchise (33) ================= */}
                {/* 👇 Print pages — full screen, bina layout */}
                <Route element={<ProtectedRoute allowedRole={["5", "33"]} />}>
                    <Route path="/diploma-print/:id" element={<DiplomaPrint />} />
                    <Route path="/migration-certificate/:id" element={<MigrationCertificate />} />
                    <Route path="/marksheet-print/:id" element={<MarksheetPrint />} />
                    <Route path="/authority-letterPrint-print/:id" element={<AuthorityLetterPrint />} />
                    <Route path="/id-card-print/:id" element={<FranchiseIdCard />} />
                    <Route path="/admit-card-print/:id" element={<AdmitCardPrint />} />
                    <Route path="/id-card/:id" element={<IdCard />} />
                </Route>


                {/* ================= Employee + Franchise (Role 6, 90, 33) ================= */}
                <Route element={<ProtectedRoute allowedRole={["6", "90", "33"]} />}>
                    <Route element={<EmployeeLayout />}>
                        {employeeRoutes
                            .filter((route) =>
                                route.role?.some((r) => ["6", "90", "33"].includes(r))
                            )
                            .map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={route.element}
                                />
                            ))}
                    </Route>
                </Route>


                {/* ================= Student (Role 7) ================= */}
                <Route element={<ProtectedRoute allowedRole="7" />}>
                    {studentRoute.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Route>


                {/* ================= Fallback ================= */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </>
    )
}

export default App