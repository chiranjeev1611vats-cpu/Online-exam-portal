import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import ExamRunner from './pages/ExamRunner.jsx';
import ResultSummary from './pages/ResultSummary.jsx';
import CertificateView from './pages/CertificateView.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ExamManager from './pages/admin/ExamManager.jsx';
import QuestionBankManager from './pages/admin/QuestionBankManager.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:examId"
        element={
          <ProtectedRoute roles={['student']}>
            <ExamRunner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result/:resultId"
        element={
          <ProtectedRoute>
            <ResultSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificate/:certId"
        element={
          <ProtectedRoute>
            <CertificateView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin', 'faculty']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams"
        element={
          <ProtectedRoute roles={['admin', 'faculty']}>
            <ExamManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute roles={['admin', 'faculty']}>
            <QuestionBankManager />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
