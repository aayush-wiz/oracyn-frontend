import { FileText, MessageCircle, Eye, Zap, Shield, Clock } from "lucide-react";

const WelcomeScreen = () => {
  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Multi-format Support",
      description:
        "Upload and analyze PDF, Word, Excel, PowerPoint, CSV, and text files",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      title: "AI-Powered Chat",
      description:
        "Ask questions about your documents and get intelligent answers",
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Document Visualization",
      description:
        "Preview and explore your documents with our built-in viewer",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Fast Processing",
      description: "Get insights from your documents in seconds, not hours",
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Secure & Private",
      description: "Your documents are encrypted and stored securely",
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      title: "Chat History",
      description: "Access your previous analyses and continue conversations",
    },
  ];

  const recentUpdates = [
    "🎉 New: Support for PowerPoint presentations",
    "⚡ Improved: Faster document processing",
    "🔧 Fixed: Better handling of large CSV files",
    "✨ Enhanced: More accurate AI responses",
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DocAnalyzer
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your documents into insights with AI-powered analysis.
            Upload your files and start asking questions to unlock the knowledge
            within.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Ready for your first analysis
            </div>
            <div className="text-sm text-gray-500">
              Select "New Analysis" from the sidebar to get started
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Powerful Features for Document Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Upload Documents
              </h3>
              <p className="text-gray-600 text-sm">
                Drag and drop your files or click to browse. We support all
                major document formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ask Questions
              </h3>
              <p className="text-gray-600 text-sm">
                Type your questions or describe what you want to analyze. Our AI
                will understand and help.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Get Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Receive detailed answers, summaries, and insights based on your
                document content.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="mb-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What's New
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-lg">{update.split(" ")[0]}</div>
                  <div className="text-sm text-gray-700">
                    {update.substring(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Quick Tips for Better Results
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">📋 Document Preparation</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• Ensure documents are clear and readable</li>
                <li>• Remove unnecessary pages to focus analysis</li>
                <li>• Use descriptive file names</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">💬 Asking Questions</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• Be specific about what you want to know</li>
                <li>• Ask follow-up questions to dive deeper</li>
                <li>• Use natural language - no special formatting needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Ready to analyze your documents? Click "New Analysis" in the sidebar
            to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
