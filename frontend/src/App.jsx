import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ClassManagement from "./pages/admin/ClassManagement";
import AttendanceTracker from "./pages/teacher/AttendanceTracker";
import UserManagement from "./pages/admin/UserManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import AttendanceReports from "./pages/admin/AttendanceReports";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]} />}
          >
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/classes" element={<ClassManagement />} />
                <Route path="/admin/students" element={<StudentManagement />} />
                <Route
                  path="/admin/attendance"
                  element={<AttendanceReports />}
                />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
                <Route
                  path="/teacher/dashboard"
                  element={<TeacherDashboard />}
                />
                <Route
                  path="/teacher/attendance"
                  element={<AttendanceTracker />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
