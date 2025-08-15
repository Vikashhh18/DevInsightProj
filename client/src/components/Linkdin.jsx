import { useState } from "react";
import { Loader2, Copy, Check, Linkedin, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { baseUrl } from "../utils/baseurl";

const Linkdin = () => {
  const { user } = useUser();
  const userId = user?.id;
  
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    skills: "",
    experience: "",
    linkedinUrl: "",
  });

  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({
    headline: false,
    about: false,
    skills: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.skills) {
      toast.error("Please fill at least name and skills fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Generating LinkedIn suggestions...");
      const res = await fetch(`${baseUrl}api/linkedin/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Generated data:", data);
      setGenerated(data);

      if (userId) {
        console.log("Saving to database...");
        
        const saveData = {
          userId: userId,
          username: formData.name,
          profileUrl: formData.linkedinUrl || "",
          headline: data.headline || "",
          followers: data.followers || 0,
          connections: data.connections || 0,
          skills: Array.isArray(data.skillsArray) ? data.skillsArray.length : 0
        };

        console.log("Data to save:", saveData);

        const saveRes = await fetch(`${baseUrl}api/profile/linkdin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saveData),
        });

        const saveResult = await saveRes.text();

        if (!saveRes.ok) {
          toast.error("Profile suggestions generated but failed to save to database");
        } else {
          try {
            const saveJson = JSON.parse(saveResult);
            toast.success("Profile suggestions generated and saved successfully!");
          } catch (parseError) {
            toast.success("Profile suggestions generated successfully!");
          }
        }
      } else {
        toast.success("Profile suggestions generated successfully!");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to generate suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, section) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [section]: true });
    toast.success(`Copied ${section} to clipboard!`);
    
    setTimeout(() => {
      setCopied({ ...copied, [section]: false });
    }, 2000);
  };

  const openLinkedIn = () => {
    if (formData.linkedinUrl) {
      window.open(
        formData.linkedinUrl.startsWith('http') 
          ? formData.linkedinUrl 
          : `https://${formData.linkedinUrl}`,
        '_blank'
      );
    } else {
      toast.error("No LinkedIn URL provided");
    }
  };

  return (

    <div className="py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            LinkedIn Profile Optimizer
          </h1>
          <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your LinkedIn profile with AI-powered suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Linkedin className="text-blue-600" size={24} />
                Your Information
              </h2>
              <button 
                onClick={openLinkedIn}
                disabled={!formData.linkedinUrl}
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md transition-all ${
                  formData.linkedinUrl 
                    ? 'text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                Visit Profile <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {[
                { field: "name", placeholder: "Your Full Name", required: true },
                { field: "degree", placeholder: "Degree/Education" },
                { field: "skills", placeholder: "Skills (comma separated)", required: true },
                { field: "linkedinUrl", placeholder: "LinkedIn Profile URL" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {item.placeholder} {item.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name={item.field}
                    value={formData[item.field]}
                    placeholder={item.placeholder}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    onChange={handleChange}
                    required={item.required}
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Experience or Projects
                </label>
                <textarea
                  name="experience"
                  rows={4}
                  value={formData.experience}
                  placeholder="Describe your work experience or projects..."
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !formData.name || !formData.skills}
              className={`mt-6 w-full bg-gradient-to-r from-sky-500 to-blue-600 cursor-pointer text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                ${(loading || !formData.name || !formData.skills) 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:opacity-90 hover:shadow-md'}`}
>>>>>>> ffcfce3 (add frontend url)
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  Generate Suggestions
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 overflow-auto">
            <h2 className="text-2xl font-bold cursor-pointer
             text-gray-800 flex items-center gap-2 mb-6">
              <Check className="text-green-500" size={24} />
              Optimization Suggestions
            </h2>

            {!generated ? (
              <div className="bg-blue-50/50 rounded-xl p-8 text-center border-2 border-dashed border-blue-100">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Linkedin className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Your LinkedIn Suggestions Await
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Fill out the form with your details to receive personalized LinkedIn optimization suggestions.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Headline */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">1</span>
                      Profile Headline
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generated.headline, 'headline')}
                      className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-gray-100"
                      title="Copy to clipboard"
                    >
                      {copied.headline ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                    {generated.headline}
                  </p>
                </div>

                {/* About Section */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">2</span>
                      About Section
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generated.about, 'about')}
                      className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-gray-100"
                      title="Copy to clipboard"
                    >
                      {copied.about ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="whitespace-pre-wrap text-gray-700">{generated.about}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">3</span>
                      Recommended Skills
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generated.skillsArray?.join(', '), 'skills')}
                      className="text-gray-500 hover:text-blue-600 transition p-1 rounded hover:bg-gray-100"
                      title="Copy to clipboard"
                    >
                      {copied.skills ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(generated.skillsArray) && generated.skillsArray.length > 0 ? (
                        generated.skillsArray.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No skills found.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Featured Link */}
                {generated.featuredLink && (
                  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">4</span>
                      Featured Link Suggestion
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <a
                        href={generated.featuredLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all inline-flex items-center gap-1"
                      >
                        {generated.featuredLink} <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Linkdin;
