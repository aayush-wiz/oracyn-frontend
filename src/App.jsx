import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.jsx";
import Layout from "./components/layout/Layout.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Dashboard from "./components/main/Dashboard.jsx";
import DocumentProcessor from "./components/main/DocumentProcessor.jsx";
import Settings from "./components/settings/Settings.jsx";
import { ToastProvider, Toaster } from "./components/common/Toast.jsx";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router
            future={{
              v7_relativeSplatPath: true,
              v7_startTransition: true,
            }}
          >
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  {/* Nested routes within the layout */}
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="analyze" element={<DocumentProcessor />} />
                  <Route
                    path="analyze/:documentId"
                    element={<DocumentProcessor />}
                  />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>

              {/* Global Toast Notifications */}
              <Toaster />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;