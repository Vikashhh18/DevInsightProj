import { useState } from "react";
import { Loader2, Copy, Check, Linkedin } from "lucide-react";
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
        console.log("Save response status:", saveRes.status);
        console.log("Save response raw:", saveResult);

        if (!saveRes.ok) {
          console.error("Save failed with status:", saveRes.status);
          console.error("Save error response:", saveResult);
          toast.error("Profile suggestions generated but failed to save to database");
        } else {
          try {
            const saveJson = JSON.parse(saveResult);
            console.log("Save success:", saveJson);
            toast.success("Profile suggestions generated and saved successfully!");
          } catch (parseError) {
            console.error("Failed to parse save response:", parseError);
            toast.success("Profile suggestions generated successfully!");
          }
        }
      } else {
        console.log("No userId available, skipping database save");
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
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0"
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <Linkedin className="text-blue-600" size={24} /> LinkedIn Optimizer
            </h2>
            <button 
              onClick={openLinkedIn}
              disabled={!formData.linkedinUrl}
              className={`flex items-center cursor-pointer gap-1 text-sm ${formData.linkedinUrl ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
            >
              Visit Profile
            </button>
          </div>

          <div className="space-y-4">
            {[
              { field: "name", placeholder: "Your Full Name", required: true },
              { field: "degree", placeholder: "Degree/Education" },
              { field: "skills", placeholder: "Skills (comma separated)", required: true },
              { field: "linkedinUrl", placeholder: "LinkedIn Profile URL" },
            ].map((item, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {item.placeholder} {item.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={item.field}
                  value={formData[item.field]}
                  placeholder={item.placeholder}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                  onChange={handleChange}
                  required={item.required}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience or Projects
              </label>
              <textarea
                name="experience"
                rows={4}
                value={formData.experience}
                placeholder="Describe your work experience or projects..."
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !formData.name || !formData.skills}
            className={`w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2
              ${(loading || !formData.name || !formData.skills) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              "Generate LinkedIn Suggestions"
            )}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-6 overflow-auto">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <Check className="text-blue-600" size={24} /> Suggestions Generated
          </h2>

          {!generated ? (
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">
                Fill out the form to generate personalized LinkedIn optimization suggestions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <span className="text-blue-600">🔹</span> Headline
                  </h3>
                  <button
                    onClick={() => copyToClipboard(generated.headline, 'headline')}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="Copy to clipboard"
                  >
                    {copied.headline ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-gray-700">{generated.headline}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <span className="text-blue-600">🔹</span> About Section
                  </h3>
                  <button
                    onClick={() => copyToClipboard(generated.about, 'about')}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="Copy to clipboard"
                  >
                    {copied.about ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-gray-700">{generated.about}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <span className="text-blue-600">🔹</span> Suggested Skills
                  </h3>
                  <button
                    onClick={() => copyToClipboard(generated.skillsArray?.join(', '), 'skills')}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="Copy to clipboard"
                  >
                    {copied.skills ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(generated.skillsArray) && generated.skillsArray.length > 0 ? (
                    generated.skillsArray.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills found.</span>
                  )}
                </div>
              </div>

              {generated.featuredLink && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1 mb-2">
                    <span className="text-blue-600">🔹</span> Featured Link
                  </h3>
                  <a
                    href={generated.featuredLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {generated.featuredLink}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Linkdin;