import { useState } from "react";
import { Presentation } from "lucide-react";

const PowerPointViewer = ({ file }) => {
  const mockSlides = [
    { id: 1, title: "Introduction", content: "Welcome to our presentation" },
    { id: 2, title: "Overview", content: "Key points and objectives" },
    { id: 3, title: "Analysis", content: "Data and insights" },
    { id: 4, title: "Conclusion", content: "Summary and next steps" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">{file.name}</h3>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
              {file.name.endsWith(".pptx") ? "PPTX" : "PPT"}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Slide {currentSlide + 1} of {mockSlides.length}
          </div>
        </div>
      </div>

      <div className="h-full flex">
        {/* Slide Thumbnails */}
        <div className="w-48 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Slides</h4>
          <div className="space-y-2">
            {mockSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  currentSlide === index
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white hover:border-orange-300"
                }`}
              >
                <div className="text-xs font-medium text-gray-900">
                  {index + 1}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {slide.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Slide View */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center min-h-96 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {mockSlides[currentSlide]?.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {mockSlides[currentSlide]?.content}
              </p>
              <div className="text-xs text-gray-400">
                PowerPoint slide content will be rendered here
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentSlide(
                    Math.min(mockSlides.length - 1, currentSlide + 1)
                  )
                }
                disabled={currentSlide === mockSlides.length - 1}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PowerPointViewer;
