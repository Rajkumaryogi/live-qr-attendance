import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ProfessorDashboard from './pages/ProfessorDashboard';
import SessionHistory from './pages/SessionHistory';
import StudentAttendance from './pages/StudentAttendance';

const Docs = lazy(() => import('./pages/Docs'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));

function ProtectedRoute({ children, requireProfessor = false }) {
  const { isAuthenticated, isProfessor } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireProfessor && !isProfessor) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/professor/dashboard' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/professor/dashboard"
          element={
            <ProtectedRoute requireProfessor>
              <ProfessorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/history"
          element={
            <ProtectedRoute requireProfessor>
              <SessionHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/attend" element={<StudentAttendance />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/api" element={<ApiDocs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontSize: '14px', borderRadius: '8px' },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
