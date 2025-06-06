import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/ui/Dashboard";
import Settings from "./components/ui/Settings.jsx";
import Profile from "./components/user/Profile.jsx";
import Data from "./components/user/Data.jsx";
import Security from "./components/user/Security.jsx";
import Integrations from "./components/user/Integrations.jsx";
import Layout from "./components/layout/Layout.jsx";
import "./App.css";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes with shared Layout (Sidebar) */}
              <Route
                path="/"
                element={
                  // <ProtectedRoute>
                  // </ProtectedRoute>
                  <Layout />
                }
              >
                {/* Dashboard route */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Settings routes with nested routes */}
                <Route path="settings" element={<Settings />}>
                  {/* Nested routes for settings */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="data" element={<Data />} />
                  <Route path="security" element={<Security />} />
                  <Route path="integrations" element={<Integrations />} />
                </Route>

                {/* Redirect root to dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* Catch all other routes and redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
