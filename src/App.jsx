import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/main/Dashboard";
import Chat from "./components/main/chat/Chat";
import Charts from "./components/main/ChartGallery";
import Settings from "./components/settings/Settings";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<Layout />}>
          {/* Main routes */}

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="charts" element={<Charts />} />
          <Route path="settings" element={<Settings />} />

          {/* Catch all - redirect to dashboard */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
