import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Dashboard from "./components/ui/Dashboard.jsx";
import Settings from "./components/ui/Settings.jsx";
import Profile from "./components/user/Profile.jsx";
import Data from "./components/user/Data.jsx";
import Security from "./components/user/Security.jsx";
import Integrations from "./components/user/Integrations.jsx";
import Layout from "./components/layout/Layout.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />}>
                <Route path="profile" element={<Profile />} />
                <Route path="data" element={<Data />} />
                <Route path="security" element={<Security />} />
                <Route path="integrations" element={<Integrations />} />
              </Route>
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
