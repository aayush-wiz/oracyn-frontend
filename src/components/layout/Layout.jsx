import { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { LoadingCenter } from "../ui/Loading.jsx";

const Layout = () => {
  console.log("Layout component is rendering");

  const { token, user, isLoading } = useAuth();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const handleSelectAnalysis = (analysisId) => {
    console.log("Analysis selected:", analysisId);
    setSelectedAnalysisId(analysisId);
  };

  const handleCreateNewChat = () => {
    // This will be handled by the Sidebar component directly
    // but we keep this method for potential future use
    console.log("Create new chat triggered from layout");
  };

  useEffect(() => {
    // Simulate layout initialization or wait for auth to be fully ready
    const initializeLayout = async () => {
      // If auth is still loading, wait for it
      if (isLoading) return;

      // If we have token and user, layout is ready
      if (token && user) {
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setIsLayoutReady(true);
        }, 500);
      }
    };

    initializeLayout();
  }, [token, user, isLoading]);

  // Show loading screen while auth is loading or layout is initializing
  if (isLoading || !isLayoutReady) {
    return (
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <LoadingCenter
          message="Loading your workspace..."
          fullHeight
          size="lg"
          color="blue"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onSelectAnalysis={handleSelectAnalysis}
        selectedAnalysisId={selectedAnalysisId}
      />
      <Outlet
        context={{
          selectedAnalysisId,
          onSelectAnalysis: handleSelectAnalysis,
          onCreateNewChat: handleCreateNewChat,
        }}
      />
    </div>
  );
};

export default Layout;
