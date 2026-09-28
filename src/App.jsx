
import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './components/LoginFile/Login'

 

import ProtectedRoute from './components/LoginFile/ProtectedRoute'
import AdminLayout from './components/AdminArea/AllLayout/AdminLayout'
import EmployeeLayout from './components/EmployeeArea/EmployeeLayout/EmployeeLayout'
import adminRoutes from './components/AdminArea/AdminRoutes'

import employeeRoutes from './components/EmployeeArea/EmployeeRoute'
import StudentRoute from './components/StudentPanal/StudentRoute'
import AdmissionConsultantRegistration from './components/WebsiteForms/AdmissionConsultantRegistration'
import StudentRegistration from './components/WebsiteForms/StudentRegistration'
import StudyCenterRegistration from './components/WebsiteForms/StudyCenterRegistration'
import Success from './components/WebsiteForms/Success'




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


                {/* Admin */}
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
                {/* Franchise */}

                <Route element={<ProtectedRoute allowedRole={["6", "90"]} />}>
                    <Route element={<EmployeeLayout />}>

                        {employeeRoutes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}

                    </Route>
                </Route>
                {/* Student */}

                <Route element={<ProtectedRoute allowedRole="7" />}>
                    <Route element={<EmployeeLayout />}>
                        {StudentRoute.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </Route>


            </Routes>


        </>
    )
}

export default App
