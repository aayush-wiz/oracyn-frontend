import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import PromptArea from './PromptArea';
import FileProcessingStatus from './FileProcessingStatus';
import DataVisualization from './DataVisualization';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Upload and analyze your documents with AI-powered insights
          </p>
        </div>

        <div className="space-y-6">
          <PromptArea />
          <FileProcessingStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 