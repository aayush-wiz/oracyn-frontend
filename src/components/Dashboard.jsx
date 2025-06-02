import Sidebar from './Sidebar';
import PromptArea from './PromptArea';
import FileProcessingStatus from './FileProcessingStatus';
import DataVisualization from './DataVisualization';

const Dashboard = () => {


  return (
    <div className="bg-[#ffffe5] flex">
      <Sidebar/>
      {/* Divider */}
      <div className="w-px h-screen bg-gray-500"></div>

      <div className="w-screen">
        <div className="flex">
          <PromptArea />
          {/* Divider */}
          <div className="w-px h-screen bg-gray-500"></div>
          <DataVisualization />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 