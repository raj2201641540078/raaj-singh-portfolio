import React from "react";
import { Download, ExternalLink } from "lucide-react";

export default function Resume() {
  const resumePdfUrl = "/Raj_Resume.pdf";

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = resumePdfUrl;
    link.download = "Raj_Singh_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenResume = () => {
    window.open(resumePdfUrl, "_blank");
  };

  return (
    <main className="pt-24 lg:pt-20 bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 text-white min-h-screen">
      <section className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl md:text-4xl">📄</span> 
              <span>Resume</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-10">A quick glance at my journey.</p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <button
                onClick={handleDownloadResume}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Download size={18} className="sm:w-5 sm:h-5" />
                Download Resume
              </button>
              <button
                onClick={handleOpenResume}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                Open in New Tab
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl mb-8 sm:mb-12">
            {/* PDF Container - Responsive Height */}
            <div className="w-full bg-white/5" style={{ height: "clamp(400px, 60vh, 900px)" }}>
              <iframe
                src={resumePdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                className="w-full h-full"
                title="Raj Singh Resume"
              />
            </div>
          </div>

          {/* Download Button at Bottom */}
          <div className="text-center">
            <button
              onClick={handleDownloadResume}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Download size={20} className="sm:w-6 sm:h-6" />
              Download Resume
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
