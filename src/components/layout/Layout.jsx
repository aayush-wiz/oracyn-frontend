import { useState } from "react";
import Sidebar from "../ui/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  console.log("Layout component is rendering");

  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);

  const handleSelectAnalysis = (analysisId) => {
    console.log("Analysis selected:", analysisId);
    setSelectedAnalysisId(analysisId);
  };

  return (
    <div className="bg-[#ffffe5] flex h-screen overflow-hidden">
      <Sidebar onSelectAnalysis={handleSelectAnalysis} />
      <Outlet context={{ selectedAnalysisId }} />
    </div>
  );
};

export default Layout;
