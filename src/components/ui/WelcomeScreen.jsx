import {
  MessageCircle,
  FileText,
  Brain,
  Sparkles,
  ArrowRight,
  Upload,
  Search,
  Zap,
} from "lucide-react";

const WelcomeScreen = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Documents",
      description:
        "Support for PDF, Word, Excel, PowerPoint, CSV, and text files",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description:
        "Advanced AI processing to understand and analyze your content",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Ask questions and get precise answers from your documents",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Zap,
      title: "Real-time Chat",
      description:
        "Interactive conversation with your documents using natural language",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const exampleQueries = [
    "Summarize the key findings in my research paper",
    "What are the main financial metrics in the quarterly report?",
    "Compare the proposals in these documents",
    "Extract all action items from the meeting notes",
    "What are the compliance requirements mentioned?",
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DocumentChat
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your documents into intelligent conversations. Upload,
                analyze, and chat with your files using advanced AI technology.
              </p>
            </div>
          </div>

          {/* Getting Started Steps */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Create or Select Chat
              </h3>
              <p className="text-sm text-gray-600">
                Start by creating a new chat or selecting an existing one from
                the sidebar
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Documents
              </h3>
              <p className="text-sm text-gray-600">
                Upload your files and let our AI process and understand the
                content
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Start Chatting
              </h3>
              <p className="text-sm text-gray-600">
                Ask questions and get intelligent responses based on your
                document content
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Example Queries */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Example Queries
              </h2>
            </div>
            <div className="grid gap-3 max-w-2xl mx-auto">
              {exampleQueries.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-left">{query}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">
                    Ready to get started?
                  </h3>
                </div>
                <p className="text-blue-100">
                  Select a chat from the sidebar to begin uploading documents
                  and start your AI-powered analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">
          Powered by advanced AI • Secure document processing • Real-time
          analysis
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
