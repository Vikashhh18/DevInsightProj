import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { baseUrl } from "../utils/baseurl";

const Leetcode = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sampleProfiles] = useState([
    { username: "NeetCode", name: "Neetcode" },
    { username: "vikass0898", name: "Vikash sharma" },
    { username: "lee215", name: "Lee Chan" }
  ]);

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");
    setProfile(null);
    setAnalysis(null);
    setShowWelcome(false);

    try {
      const res = await fetch(`${baseUrl}api/leetcode/${username}`);
      if (!res.ok) throw new Error("LeetCode user not found.");
      const profileData = await res.json();

      let score = 0;


if (profileData.totalQuestions > 0) {
  score += (profileData.totalSolved / profileData.totalQuestions) * 100;
}

const difficultyScore =
  (profileData.hardSolved * 3 + profileData.mediumSolved * 2 + profileData.easySolved * 1) /
  ((profileData.totalHard * 3 || 1) +
   (profileData.totalMedium * 2 || 1) +
   (profileData.totalEasy * 1 || 1));
score += difficultyScore * 10;

if (profileData.acceptanceRate) {
  score += (profileData.acceptanceRate / 100) * 5;
}

if (profileData.ranking) {
  const rankFactor = Math.max(0, (200000 - profileData.ranking) / 200000);
  score += rankFactor * 5;
}

if (profileData.totalSolved >= 100 && score < 40) {
  score+= 50;
}
else if (profileData.totalSolved >= 100 && score < 50) {
  score+= 45;
}
else if (profileData.totalSolved >= 100 && score < 60) {
  score+= 40;
}

score = Math.round(Math.min(score, 100));


      setProfile({ ...profileData, score });

    const aiRes = await fetch(`${baseUrl}api/analyze/leetcode`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    data: `You are an expert in competitive programming. Analyze this LeetCode profile and return ONLY a VALID JSON object with EXACTLY these 3 fields:

DO NOT return explanation, markdown, or extra text — only return the JSON object directly.

LeetCode data:
${JSON.stringify(profileData)}`
  }),
});

if (!aiRes.ok) {
  const errorText = await aiRes.text();
  console.error("AI API Error:", aiRes.status, errorText);
  throw new Error(`AI analysis failed: ${aiRes.status} - Check if the API endpoint exists`);
}

const contentType = aiRes.headers.get("content-type");
if (!contentType || !contentType.includes("application/json")) {
  const responseText = await aiRes.text();
  console.error("Non-JSON response:", responseText);
  throw new Error("Server returned HTML instead of JSON - check your API endpoint");
}

const aiData = await aiRes.json();

      let cleanedText = aiData?.text?.trim();
      if (cleanedText?.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanedText);

      if (
        parsed &&
        Array.isArray(parsed.strengths) &&
        Array.isArray(parsed.weaknesses) &&
        Array.isArray(parsed.nextRecommendedQuestions)
      ) {
        setAnalysis(parsed);
      } else {
        throw new Error("AI returned an unexpected structure.");
      }

    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  const handleSampleClick = (sampleUsername) => {
    setUsername(sampleUsername);
    setShowWelcome(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-5 mb-5 bg-white rounded-xl shadow-md min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">LeetCode Profile Analyzer</h2>
        <p className="text-gray-600">Unlock insights to level up your coding skills</p>
      </div>

      {showWelcome && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">👋 Welcome Code Warrior!</h2>
              <p className="text-gray-700 mb-4">
                Get a detailed analysis of your LeetCode profile. Discover your strengths, 
                identify areas to improve, and receive personalized problem recommendations.
              </p>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            Try analyzing your profile or explore these examples:
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleProfiles.map((sample) => (
              <button
                key={sample.username}
                onClick={() => {
                  handleSampleClick(sample.username);
                  setShowWelcome(false);
                }}
                className="px-3 cursor-pointer
                 py-1.5 text-sm bg-white hover:bg-gray-100 text-gray-700 rounded-full transition-colors flex items-center shadow-sm border border-gray-200"
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex gap-3">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Enter LeetCode username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <button
            className={`px-6 py-3 rounded-lg cursor-pointer font-medium text-white transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Profile"}
          </button>
        </div>
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {loading && !profile && (
        <div className="space-y-6">
          <div className="animate-pulse bg-gray-200 rounded-xl h-64"></div>
          <div className="animate-pulse bg-gray-200 rounded-xl h-48"></div>
          <div className="animate-pulse bg-gray-200 rounded-xl h-48"></div>
        </div>
      )}

      {profile && (
        <div className="mt-6 p-5 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Profile Overview</h3>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {username}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm">Rank</div>
              <div className="text-2xl font-bold text-gray-800">
                {profile.ranking || 'N/A'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm">Solved</div>
              <div className="text-2xl font-bold text-green-600">
                {profile.totalSolved || 0}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm">Acceptance</div>
              <div className="text-2xl font-bold text-blue-600">
                {profile.acceptanceRate ? `${profile.acceptanceRate}%` : 'N/A'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm">Score</div>
              <div className="text-2xl font-bold text-purple-600">
                {profile.score || 0} / 100
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-medium text-gray-700 mb-2">Problem Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-sm text-gray-500">Easy</div>
                <div className="text-lg font-bold text-green-500">
                  {profile.easySolved || 0}/{profile.totalEasy || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Medium</div>
                <div className="text-lg font-bold text-yellow-500">
                  {profile.mediumSolved || 0}/{profile.totalMedium || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Hard</div>
                <div className="text-lg font-bold text-red-500">
                  {profile.hardSolved || 0}/{profile.totalHard || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-bold text-gray-800">
                  {profile.totalSolved || 0}/{profile.totalQuestions || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Detailed Analysis</h3>
          <div className="bg-green-50 p-5 rounded-xl border border-green-100">
            <h4 className="text-lg font-semibold text-green-800">Strengths</h4>
            <ul className="space-y-2 pl-2">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
            <h4 className="text-lg font-semibold text-yellow-800">Areas for Improvement</h4>
            <ul className="space-y-2 pl-2">
              {analysis.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h4 className="text-lg font-semibold text-blue-800">Recommended Problems</h4>
            <ul className="space-y-2 pl-2">
              {analysis.nextRecommendedQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leetcode;
