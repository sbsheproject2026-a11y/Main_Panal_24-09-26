import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './components/LoginFile/Login'

import ProtectedRoute from './components/LoginFile/ProtectedRoute'
import AdminLayout from './components/AdminArea/AllLayout/AdminLayout'
import EmployeeLayout from './components/EmployeeArea/EmployeeLayout/EmployeeLayout'

import adminRoutes from './components/AdminArea/AdminRoutes'

import employeeRoutes from './components/EmployeeArea/EmployeeRoute'

import AdmissionConsultantRegistration from './components/WebsiteForms/AdmissionConsultantRegistration'
import StudentRegistration from './components/WebsiteForms/StudentRegistration'
import StudyCenterRegistration from './components/WebsiteForms/StudyCenterRegistration'
import Success from './components/WebsiteForms/Success'
import FranchiseLayout from './components/EmployeeArea/FranchiseLayout/FranchiseLayout'
import studentRoute from './components/StudentArea/StudentRoute'


function App() {

    return (
        <>
            <Routes>

                {/* Login */}
                <Route path="/" element={<Login />} />
                <Route path="/acc-apply" element={<AdmissionConsultantRegistration />} />
                <Route path="/student-apply" element={<StudentRegistration />} />
                <Route path="/study-centre-apply" element={<StudyCenterRegistration />} />
                <Route path="/success" element={<Success />} />


                {/* ================= Admin (Role 5) ================= */}
                <Route element={<ProtectedRoute allowedRole="5" />}>
                    <Route element={<AdminLayout />}>
                        {adminRoutes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </Route>


                {/* ================= Employee (Role 6, 90) ================= */}
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


                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </>
    )
}

export default App