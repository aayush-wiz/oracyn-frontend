import { useState, useEffect } from 'react';
import webSocketService from '../services/websocket';
import { fileAPI } from '../services/api';

const FileProcessingStatus = ({ files, onProcessingComplete }) => {
  const [processingFiles, setProcessingFiles] = useState({});
  const [processingHistory, setProcessingHistory] = useState([]);

  useEffect(() => {
    // Subscribe to file processing events
    const unsubscribeStart = webSocketService.on('file_processing_started', (data) => {
      setProcessingFiles(prev => ({
        ...prev,
        [data.fileId]: {
          ...data,
          status: 'processing',
          progress: 0,
          startTime: new Date(),
        }
      }));
    });

    const unsubscribeProgress = webSocketService.on('file_processing_progress', (data) => {
      setProcessingFiles(prev => ({
        ...prev,
        [data.fileId]: {
          ...prev[data.fileId],
          progress: data.progress,
          currentStep: data.currentStep,
          eta: data.eta,
        }
      }));
    });

    const unsubscribeCompleted = webSocketService.on('file_processing_completed', (data) => {
      setProcessingFiles(prev => {
        const updated = { ...prev };
        const fileInfo = updated[data.fileId];
        delete updated[data.fileId];
        
        // Add to history
        setProcessingHistory(prevHistory => [
          {
            ...fileInfo,
            ...data,
            status: 'completed',
            endTime: new Date(),
            duration: fileInfo?.startTime ? new Date() - fileInfo.startTime : null,
          },
          ...prevHistory.slice(0, 9) // Keep last 10 items
        ]);

        return updated;
      });
      
      onProcessingComplete?.(data);
    });

    const unsubscribeFailed = webSocketService.on('file_processing_failed', (data) => {
      setProcessingFiles(prev => {
        const updated = { ...prev };
        const fileInfo = updated[data.fileId];
        delete updated[data.fileId];
        
        // Add to history
        setProcessingHistory(prevHistory => [
          {
            ...fileInfo,
            ...data,
            status: 'failed',
            endTime: new Date(),
            duration: fileInfo?.startTime ? new Date() - fileInfo.startTime : null,
          },
          ...prevHistory.slice(0, 9)
        ]);

        return updated;
      });
    });

    return () => {
      unsubscribeStart();
      unsubscribeProgress();
      unsubscribeCompleted();
      unsubscribeFailed();
    };
  }, [onProcessingComplete]);

  const startProcessing = async (fileIds) => {
    try {
      await fileAPI.startProcessing(fileIds);
      // Subscribe to each file's processing updates
      fileIds.forEach(fileId => {
        webSocketService.subscribeToFileProcessing(fileId);
      });
    } catch (error) {
      console.error('Failed to start processing:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return 'N/A';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const formatETA = (eta) => {
    if (!eta) return '';
    const minutes = Math.floor(eta / 60);
    const seconds = eta % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s remaining` : `${seconds}s remaining`;
  };

  const activeProcessing = Object.values(processingFiles);
  const hasActiveProcessing = activeProcessing.length > 0;

  if (!hasActiveProcessing && processingHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          File Processing Status
          {hasActiveProcessing && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {activeProcessing.length} processing
            </span>
          )}
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Processing */}
        {activeProcessing.map((file) => (
          <div key={file.fileId} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(file.status)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                  <p className="text-xs text-gray-500">{file.currentStep || 'Processing...'}</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 font-medium">
                {file.progress}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${file.progress}%` }}
              ></div>
            </div>
            
            {file.eta && (
              <p className="text-xs text-gray-500">{formatETA(file.eta)}</p>
            )}
          </div>
        ))}

        {/* Processing History */}
        {processingHistory.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
              Recent Activity
            </h4>
            <div className="space-y-2">
              {processingHistory.slice(0, 5).map((file, index) => (
                <div key={`${file.fileId}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(file.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {file.status === 'completed' ? 'Successfully processed' : file.error || 'Processing failed'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDuration(file.duration)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {file.endTime?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {files && files.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => startProcessing(files.map(f => f.id))}
              disabled={hasActiveProcessing}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {hasActiveProcessing ? 'Processing...' : 'Process All Files'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileProcessingStatus; 