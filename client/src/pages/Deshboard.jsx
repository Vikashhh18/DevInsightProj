import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profile/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!profile) return <ProfileSetup user={user} />;

  // Calculate profile completion
  const completionItems = [
    !!profile.github,
    !!profile.leetcode,
    !!profile.linkedin
  ];
  const completionPercent = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  // Calculate LeetCode percentages
  const leetCodeTotal = profile.leetcode?.totalSolved || 0;
  const leetCodeEasyPercent = leetCodeTotal > 0 ? Math.round((profile.leetcode?.easySolved / leetCodeTotal) * 100) : 0;
  const leetCodeMediumPercent = leetCodeTotal > 0 ? Math.round((profile.leetcode?.mediumSolved / leetCodeTotal) * 100) : 0;
  const leetCodeHardPercent = leetCodeTotal > 0 ? Math.round((profile.leetcode?.hardSolved / leetCodeTotal) * 100) : 0;

  // Calculate GitHub language distribution
  const totalLanguageBytes = profile.github?.languagesUsed?.reduce((sum, lang) => sum + lang.bytes, 0) || 1;
  const languageDistribution = profile.github?.languagesUsed?.map(lang => ({
    name: lang.name,
    percent: Math.round((lang.bytes / totalLanguageBytes) * 100)
  })) || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <WelcomeBanner 
        user={user} 
        profile={profile} 
        completionPercent={completionPercent}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GitHubProfileCard 
          profile={profile} 
          languageDistribution={languageDistribution}
        />
        <LeetCodeProfileCard 
          profile={profile}
          leetCodeTotal={leetCodeTotal}
          leetCodeEasyPercent={leetCodeEasyPercent}
          leetCodeMediumPercent={leetCodeMediumPercent}
          leetCodeHardPercent={leetCodeHardPercent}
        />
        <LinkedInProfileCard profile={profile} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsSection 
          profile={profile} 
          leetCodeTotal={leetCodeTotal}
          languageDistribution={languageDistribution}
        />
        <ProfileLinksSection profile={profile} />
      </div>

      {/* <ActivityVisualization profile={profile} /> */}
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="bg-gray-100 rounded-xl p-6 h-28"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-xl p-6 h-48"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-100 rounded-xl p-6 h-64"></div>
      <div className="bg-gray-100 rounded-xl p-6 h-64"></div>
    </div>
    <div className="bg-gray-100 rounded-xl p-6 h-64"></div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-semibold">Error Loading Profile</h3>
      </div>
      <p className="mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Profile Setup Component
const ProfileSetup = ({ user }) => {
  const connectionCards = [
    {
      title: "GitHub",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      ),
      description: "Analyze repositories and coding activity",
      color: "bg-gray-800",
      route: "/github"
    },
    {
      title: "LeetCode",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
        </svg>
      ),
      description: "Track problem-solving progress",
      color: "bg-amber-500",
      route: "/leetcode"
    },
    {
      title: "LinkedIn",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      description: "Showcase professional experience",
      color: "bg-blue-600",
      route: "/linkedin"
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-8 md:p-10 text-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
              {user.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Hello, {user.firstName || 'there'}!
              </h1>
              <p className="text-sky-100 text-lg md:text-xl mt-2">
                Connect your profiles to unlock your developer dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {user.fullName || 'New User'}
            </h2>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
              </svg>
              {user.primaryEmailAddress?.emailAddress || 'user@example.com'}
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-medium text-gray-800 mb-6 text-center">
              Connect your professional profiles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {connectionCards.map((card, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${card.color} p-3 rounded-lg text-white`}>
                      {card.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">{card.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{card.description}</p>
                  <Link 
                    to={card.route} 
                    className={`w-full ${card.color} hover:${card.color.replace('500', '600').replace('600', '700').replace('800', '900')} text-white py-2 px-4 rounded-md font-medium transition-colors block text-center`}
                  >
                    Connect {card.title}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              I'll complete this later
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Welcome Banner Component
const WelcomeBanner = ({ user, profile, completionPercent }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
  >
    <div className="relative z-10">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img 
          src={profile.github?.avatarUrl || user.imageUrl || "https://via.placeholder.com/80"} 
          alt="Profile" 
          className="w-16 h-16 rounded-full border-2 border-white"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Developer'}!</h2>
              <p className="opacity-90">{profile.linkedin?.headline || "Your professional dashboard"}</p>
            </div>
            
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {completionPercent}% Complete
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox 
              label="Repos" 
              value={profile.github?.publicRepos || 0} 
              icon="📦"
              darkMode 
            />
            <StatBox 
              label="Followers" 
              value={profile.github?.followers || 0} 
              icon="👥"
              darkMode 
            />
            <StatBox 
              label="Solved" 
              value={profile.leetcode?.totalSolved || 0} 
              icon="✅"
              darkMode 
            />
            <StatBox 
              label="Connections" 
              value={profile.linkedin?.connections || 0} 
              icon="🤝"
              darkMode 
            />
          </div>
        </div>
      </div>
    </div>
    
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
    <div className="absolute -bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full"></div>
  </motion.div>
);

// GitHub Profile Card Component
const GitHubProfileCard = ({ profile, languageDistribution }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="text-blue-600 p-2 rounded-lg">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">GitHub</h3>
    </div>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Username</span>
        <a 
          href={`https://github.com/${profile.github?.username}`} 
          target="_blank" 
          rel="noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          {profile.github?.username || "N/A"}
        </a>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Public Repos" value={profile.github?.publicRepos || 0} icon="📦" />
        <StatBox label="Followers" value={profile.github?.followers || 0} icon="👥" />
        <StatBox label="Stars" value={profile.github?.stars || 0} icon="⭐" />
        <StatBox label="Score" value={profile.github?.score || 0} icon="🏆" />
      </div>
      
      {languageDistribution.length > 0 && (
        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Languages</h4>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden">
            {languageDistribution.slice(0, 5).map((lang, i) => (
              <div 
                key={i}
                className="h-full"
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor: [
                    '#2b7489', '#3572A5', '#f1e05a', '#b07219', '#dea584'
                  ][i % 5]
                }}
                title={`${lang.name} (${lang.percent}%)`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {languageDistribution.slice(0, 3).map((lang, i) => (
              <span key={i} className="text-xs bg-white px-2 py-1 rounded-md shadow-xs border">
                {lang.name} {lang.percent}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

// LeetCode Profile Card Component
const LeetCodeProfileCard = ({ 
  profile,
  leetCodeTotal,
  leetCodeEasyPercent,
  leetCodeMediumPercent,
  leetCodeHardPercent
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="text-amber-600 p-2 rounded-lg">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">LeetCode</h3>
    </div>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Username</span>
        <a 
          href={`https://leetcode.com/${profile.leetcode?.username}`} 
          target="_blank" 
          rel="noreferrer"
          className="font-medium text-amber-600 hover:underline"
        >
          {profile.leetcode?.username || "N/A"}
        </a>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Total Solved" value={leetCodeTotal} icon="✅" />
        <StatBox label="Ranking" value={profile.leetcode?.ranking ? `#${profile.leetcode.ranking}` : "N/A"} icon="🏅" />
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Problem Breakdown</h4>
        <div className="space-y-3">
          {[
            { label: "Easy", solved: profile.leetcode?.easySolved || 0, percent: leetCodeEasyPercent, color: "bg-green-500" },
            { label: "Medium", solved: profile.leetcode?.mediumSolved || 0, percent: leetCodeMediumPercent, color: "bg-yellow-500" },
            { label: "Hard", solved: profile.leetcode?.hardSolved || 0, percent: leetCodeHardPercent, color: "bg-red-500" }
          ].map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span>{item.solved} ({item.percent}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// LinkedIn Profile Card Component
const LinkedInProfileCard = ({ profile }) => {
  const skills = extractSkillsFromHeadline(profile.linkedin?.headline || "");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-sky-50 rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sky-600 p-2 rounded-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">LinkedIn</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Username</span>
          <a 
            href={profile.linkedin?.profileUrl} 
            target="_blank" 
            rel="noreferrer"
            className="font-medium text-sky-600 hover:underline"
          >
            {profile.linkedin?.username || "N/A"}
          </a>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Headline</h4>
          <p className="text-gray-800 font-medium">{profile.linkedin?.headline || "Not specified"}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Connections" value={profile.linkedin?.connections || 0} icon="🤝" />
          <StatBox label="Followers" value={profile.linkedin?.followers || 0} icon="👀" />
        </div>
        
        {skills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="bg-white px-2 py-1 rounded-md text-xs shadow-xs border">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Skills Section Component
const SkillsSection = ({ profile, leetCodeTotal, languageDistribution }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
  >
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Languages</h3>
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Programming Languages</h4>
        {languageDistribution.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {languageDistribution.slice(0, 5).map((lang, i) => (
                <div key={i} className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full mr-2" style={{
                    backgroundColor: [
                      '#2b7489', '#3572A5', '#f1e05a', '#b07219', '#dea584'
                    ][i % 5]
                  }}></span>
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-gray-500 ml-1">{lang.percent}%</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden">
              {languageDistribution.slice(0, 5).map((lang, i) => (
                <div 
                  key={i}
                  className="h-full"
                  style={{
                    width: `${lang.percent}%`,
                    backgroundColor: [
                      '#2b7489', '#3572A5', '#f1e05a', '#b07219', '#dea584'
                    ][i % 5]
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">No languages specified</p>
        )}
      </div>
      
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Problem Solving</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Problems Solved</span>
            <span className="font-medium">{leetCodeTotal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min((leetCodeTotal / 1000) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-2 rounded-lg">
              <div className="text-green-600 font-bold">{profile.leetcode?.easySolved || 0}</div>
              <div className="text-xs text-gray-600">Easy</div>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg">
              <div className="text-yellow-600 font-bold">{profile.leetcode?.mediumSolved || 0}</div>
              <div className="text-xs text-gray-600">Medium</div>
            </div>
            <div className="bg-red-50 p-2 rounded-lg">
              <div className="text-red-600 font-bold">{profile.leetcode?.hardSolved || 0}</div>
              <div className="text-xs text-gray-600">Hard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Profile Links Section Component
const ProfileLinksSection = ({ profile }) => {
  const socialLinks = [
    {
      condition: profile.github?.username,
      url: `https://github.com/${profile.github?.username}`,
      platform: "GitHub",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      ),
      color: "bg-gray-800 hover:bg-gray-900"
    },
    {
      condition: profile.leetcode?.username,
      url: `https://leetcode.com/${profile.leetcode?.username}`,
      platform: "LeetCode",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
        </svg>
      ),
      color: "bg-amber-500 hover:bg-amber-600"
    },
    {
      condition: profile.linkedin?.profileUrl,
      url: profile.linkedin?.profileUrl,
      platform: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: "bg-blue-600 hover:bg-blue-700"
    }
  ].filter(item => item.condition);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Profile Links</h3>
      
      {socialLinks.length > 0 ? (
        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`${link.color} text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 shadow-sm hover:shadow-md`}
            >
              {link.icon}
              <span>View {link.platform} Profile</span>
              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No profile links available</p>
      )}
    </motion.div>
  );
};

const StatBox = ({ label, value, icon, darkMode = false }) => (
  <div className={`${darkMode ? 'bg-white/10' : 'bg-white'} p-3 rounded-lg`}>
    <div className="flex items-center gap-2">
      <span className={`text-lg ${darkMode ? 'text-white' : 'text-gray-600'}`}>{icon}</span>
      <div>
        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{value}</div>
        <div className={`text-xs ${darkMode ? 'text-white/80' : 'text-gray-500'}`}>{label}</div>
      </div>
    </div>
  </div>
);

// Helper function to extract skills from LinkedIn headline
const extractSkillsFromHeadline = (headline) => {
  if (!headline) return [];
  
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 
    'Node.js', 'Data Science', 'Machine Learning', 'AI',
    'TypeScript', 'HTML', 'CSS', 'SQL', 'MongoDB', 'Express',
    'Django', 'Flask', 'Spring', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'REST API', 'GraphQL', 'Redux', 'Vue', 'Angular',
    'Swift', 'Kotlin', 'Go', 'Rust', 'PHP', 'Ruby', '.NET',
    'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SciPy',
    'Tableau', 'Power BI', 'Spark', 'Hadoop', 'Linux'
  ];

  return commonSkills.filter(skill => 
    headline.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 5);
};

export default Dashboard;