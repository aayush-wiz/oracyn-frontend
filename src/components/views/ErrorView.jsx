const ErrorView = ({ fileData }) => {
  if (!fileData || !fileData.data.error) {
    return null;
  }

  return (
    <div className="h-full p-6">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {fileData.name}
          </h3>
          <p className="text-sm text-red-600">
            Error processing Excel file
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Excel Processing Error
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {fileData.data.error}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Please ensure the Excel file is not corrupted and
                contains readable data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorView; 