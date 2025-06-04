import { useState } from 'react';
import PromptArea from '../interactive/PromptArea';
import DataVisualization from '../views/DataVisualization';

const Dashboard = () => {
  const [filesToVisualize, setFilesToVisualize] = useState(null);

  const handleVisualize = (files) => {
    setFilesToVisualize(files);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <PromptArea onVisualize={handleVisualize} />
      {/* Divider */}
      <div className="w-px h-screen bg-gray-500 flex-shrink-0"></div>
      <DataVisualization files={filesToVisualize} />
    </div>
  );
};

export default Dashboard; 