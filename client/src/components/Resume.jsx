import React, { useState } from "react";
import { Upload, Loader2, FileText, CheckCircle, Briefcase } from "lucide-react";

const Resume = () => {
  const [step, setStep] = useState(1);
  const [jobTitle, setJobTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");
    
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file only.");
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobTitle.trim()) {
      setError("Please fill job title and upload resume first!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("jobTitle", jobTitle);
      formData.append("resume", file);

      const res = await fetch("http://localhost:3000/api/resume-analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setAnalysis({
        atsScore: data.analysis.atsScore || 0,
        missingSkills: data.analysis.missingSkills || [],
        suggestions: data.analysis.suggestions || [],
      });

      setStep(3);
    } catch (error) {
      console.error("Analysis error:", error);
      setError(error.message || "Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFile(null);
    setJobTitle("");
    setAnalysis(null);
    setError("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 to-blue-50 flex items-start justify-center pb-4 pt-4 sm:pt-8">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden min-h-[85vh] mx-4 sm:mx-6 my-0">
        {/* Header with gradient text */}
        <div className="bg-white p-6 sm:p-8 border-b border-gray-100">
          <h1 className="text-3xl sm:text-4xl font-bold text-center">
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Resume Analyzer
            </span>
          </h1>
          <p className="text-center text-blue-500 mt-2 sm:mt-3 text-sm sm:text-base">
            Optimize your resume for better ATS performance
          </p>
        </div>

        {/* Step Indicator - Mobile responsive */}
        <div className="flex items-center justify-between px-4 sm:px-12 py-4 sm:py-6 bg-blue-50">
          {[1, 2, 3].map((stepNum) => (
            <div 
              key={stepNum} 
              className={`flex flex-col items-center ${step >= stepNum ? "text-blue-600" : "text-gray-400"}`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                step >= stepNum ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-100"
              }`}>
                {stepNum === 1 && <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />}
                {stepNum === 2 && <Upload className="w-4 h-4 sm:w-5 sm:h-5" />}
                {stepNum === 3 && <FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <span className="text-xs sm:text-sm font-medium">
                {stepNum === 1 && "Job Role"}
                {stepNum === 2 && "Upload"}
                {stepNum === 3 && "Result"}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Step 1: Job Title - Mobile responsive */}
          {step === 1 && (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Target Job Role</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Enter the job title or category you want to apply for.
              </p>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer, Data Scientist"
                className="w-full px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base sm:text-lg"
              />
              <div className="mt-8 sm:mt-10">
                <button
                  onClick={() => setStep(2)}
                  disabled={!jobTitle.trim()}
                  className="px-8 py-2 cursor-pointer sm:px-10 sm:py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg font-medium transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload Resume - Mobile responsive */}
          {step === 2 && (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Upload Resume</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Upload your resume in PDF format (max 10MB).
              </p>
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 bg-blue-50">
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto text-blue-400 mb-3 sm:mb-4" />
                <p className="text-gray-700 mb-2 sm:mb-3 text-base sm:text-lg font-medium">
                  {file ? (
                    <span className="text-blue-600">{file.name}</span>
                  ) : (
                    "Drag & drop your resume or click to upload"
                  )}
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resumeUpload"
                />
                <label
                  htmlFor="resumeUpload"
                  className="inline-block px-5 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg cursor-pointer hover:from-sky-600 hover:to-blue-700 text-base sm:text-lg font-medium transition-all"
                >
                  Choose PDF File
                </label>
              </div>
              <div className="flex justify-center gap-3 sm:gap-4 md:gap-5">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 sm:px-7 cursor-pointer sm:py-2.5 md:px-8 md:py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-base sm:text-lg font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className="px-6 py-2 cursor-pointer sm:px-7 sm:py-2.5 md:px-8 md:py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg font-medium transition-all"
                >
                  {loading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />}
                  {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Result - Mobile responsive */}
          {step === 3 && analysis && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Analysis Result</h2>
              <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-xl space-y-6 sm:space-y-8">
                {/* ATS Score */}
                <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                  <CheckCircle className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-lg sm:text-xl font-semibold text-gray-800">
                      ATS Score for "{jobTitle}": 
                      <span className={`ml-2 ${
                        analysis.atsScore >= 80 ? 'text-blue-600' :
                        analysis.atsScore >= 60 ? 'text-sky-500' :
                        'text-blue-400'
                      }`}>
                        {analysis.atsScore}/100
                      </span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 mt-3 sm:mt-4">
                      <div 
                        className={`h-2.5 sm:h-3 rounded-full bg-gradient-to-r ${
                          analysis.atsScore >= 80 ? 'from-blue-500 to-blue-600' :
                          analysis.atsScore >= 60 ? 'from-sky-400 to-blue-500' :
                          'from-blue-300 to-blue-400'
                        }`}
                        style={{ width: `${analysis.atsScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Missing Skills */}
                {analysis.missingSkills.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Missing Skills:</p>
                    <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                      {analysis.missingSkills.map((skill, index) => (
                        <li key={index} className="text-gray-700 text-sm sm:text-base md:text-lg relative pl-3 sm:pl-4 before:absolute before:left-0 before:top-2 sm:before:top-3 before:w-1.5 sm:before:w-2 before:h-1.5 sm:before:h-2 before:rounded-full before:bg-blue-400">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Improvement Suggestions:</p>
                    <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                      {analysis.suggestions.map((tip, index) => (
                        <li key={index} className="text-gray-700 text-sm sm:text-base md:text-lg relative pl-3 sm:pl-4 before:absolute before:left-0 before:top-2 sm:before:top-3 before:w-1.5 sm:before:w-2 before:h-1.5 sm:before:h-2 before:rounded-full before:bg-sky-400">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-8 sm:mt-10 flex justify-center">
                <button
                  onClick={resetForm}
                  className="px-8 cursor-pointer py-2.5 sm:px-10 sm:py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 text-base sm:text-lg font-medium transition-all"
                >
                  Analyze Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;