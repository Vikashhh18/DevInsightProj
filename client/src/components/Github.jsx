import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { baseUrl } from "../utils/baseurl";

const Github = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sampleProfiles, setSampleProfiles] = useState([]);
  const [githubScore, setGithubScore] = useState(null);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    setSampleProfiles([
      { username: "torvalds", name: "Linus Torvalds" },
      { username: "gaearon", name: "Dan Abramov" },
      { username: "sindresorhus", name: "Sindre Sorhus" }
    ]);
    const timer = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const calculateDisplayScore = (profileData, totalStars = 0) => {
    let score = 0;


    const repoScore = Math.min((profileData.public_repos / 20) * 25, 25);
    score += repoScore;


    const followerScore = Math.min((profileData.followers / 100) * 20, 20);
    score += followerScore;


    const starScore = Math.min((totalStars / 50) * 15, 15);
    score += starScore;


    let profileScore = 0;
    if (profileData.bio) profileScore += 5;
    if (profileData.company) profileScore += 3;
    if (profileData.location) profileScore += 3;
    if (profileData.blog) profileScore += 2;
    if (profileData.twitter_username) profileScore += 2;
    score += profileScore;


    const activityScore = Math.min(((profileData.public_repos * 0.5 + profileData.followers * 0.1) / 10) * 25, 25);
    score += activityScore;

    return Math.round(Math.min(score, 100));
  };

  const fetchProfile = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);
    setProfile(null);
    setGithubScore(null);
    setShowWelcome(false);

    try {

      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("GitHub user not found");
      const data = await response.json();
      setProfile(data);


      const displayScore = calculateDisplayScore(data);
      setGithubScore(displayScore);


      const saveRes = await fetch(`${baseUrl}api/profile/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "guest",
          username: username
        })
      });

      if (!saveRes.ok) {
        const saveErr = await saveRes.json();
        console.error("Save Error:", saveErr);
      } else {
        const saveData = await saveRes.json();

        if (saveData.score) {
          setGithubScore(saveData.score);
        }
      }


      const aiRes = await fetch(`${baseUrl}api/analyze/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: `You are an expert in evaluating GitHub profiles. Analyze the following GitHub profile JSON and return ONLY a valid JSON in this exact structure:

{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."]
}

GitHub profile data:
${JSON.stringify(data)}`
        }),
      });

      const aiData = await aiRes.json();

      try {
        const parsed = JSON.parse(aiData.text);
        setAnalysis(parsed);
      } catch {
        console.error("Failed to parse AI response:", aiData.text);
        setError("AI returned data that couldn't be parsed. Try again.");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleSampleClick = (sampleUsername) => {
    setUsername(sampleUsername);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-5 m-5 items-center bg-white shadow-lg rounded-xl min-h-[600px]">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">GitHub Profile Analyzer</h1>

      {showWelcome && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">👋 Welcome!</h2>
          <p className="text-gray-700 mb-4">
            Get instant insights about any GitHub profile. Discover strengths, weaknesses,
            and personalized recommendations to improve your coding profile.
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Try analyzing your own profile or explore these examples:
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && fetchProfile()}
          />
          <button
            onClick={fetchProfile}
            disabled={loading || !username.trim()}
            className={`px-6 py-3 cursor-pointer rounded-lg font-medium ${loading || !username.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : 'Analyze'}
          </button>
        </div>

        {!profile && !loading && (
          <div className="flex flex-wrap gap-2 justify-center">
            {sampleProfiles.map((sample) => (
              <button
                key={sample.username}
                onClick={() => handleSampleClick(sample.username)}
                className="px-3 py-1.5 cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
                {sample.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
      </div>

      {loading && !profile && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )}

      {profile && (
        <div className="mt-6 p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
          <div className="flex items-start gap-5">
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="w-20 h-20 rounded-full border-2 border-white shadow"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{profile.name || profile.login}</h2>
                {githubScore !== null && (
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(githubScore)}`}>
                    {githubScore}/100 • {getScoreLabel(githubScore)}
                  </div>
                )}
              </div>
              {profile.bio && <p className="mt-1 text-gray-600">{profile.bio}</p>}
              <div className="mt-3 flex flex-wrap gap-4">
                <span className="inline-flex items-center text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  {profile.followers} followers
                </span>
                <span className="inline-flex items-center text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {profile.public_repos} public repos
                </span>
                {profile.company && (
                  <span className="inline-flex items-center text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    {profile.company}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Profile Analysis</h3>

          <div className="bg-green-50 p-5 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-green-800">Strengths</h4>
            </div>
            <ul className="space-y-2 pl-2">
              {analysis.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-yellow-800">Areas for Improvement</h4>
            </div>
            <ul className="space-y-2 pl-2">
              {analysis.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-blue-800">Recommendations</h4>
            </div>
            <ul className="space-y-2 pl-2">
              {analysis.recommendations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Github;