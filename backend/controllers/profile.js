import UserProfile from '../model/UserProfile.js'; 
import axios from "axios";


export const saveUserProfile = async (req, res) => {
  const { userId, github, leetcode, linkedin } = req.body;

  try {
    let profile = await UserProfile.findOne({ userId });

    if (profile) {
      profile.github = github || profile.github;
      profile.leetcode = leetcode || profile.leetcode;
      profile.linkedin = linkedin || profile.linkedin;
      await profile.save();
      return res.status(200).json({ message: "Profile updated", profile });
    }

    const newProfile = new UserProfile({ userId, github, leetcode, linkedin });
    await newProfile.save();
    return res.status(201).json({ message: "Profile created", profile: newProfile });
  } catch (err) {
    console.error("Error saving profile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



export const updateGitHubData = async (req, res) => {
  const { userId, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ message: "userId and username are required" });
  }

  try {
    const { data } = await axios.get(`https://api.github.com/users/${username}`);
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);

    const languageCount = {};
    let totalStars = 0;
    let totalForks = 0;
    let reposWithReadme = 0;

    for (const repo of reposRes.data) {
      const lang = repo.language;
      if (lang) {
        languageCount[lang] = (languageCount[lang] || 0) + 1;
      }
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      
      if (repo.description && repo.description.length > 10) {
        reposWithReadme++;
      }
    }

    const topLanguages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    const calculateGitHubScore = (profileData, repoData) => {
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

      const avgStarsPerRepo = profileData.public_repos > 0 ? totalStars / profileData.public_repos : 0;
      const activityScore = Math.min((avgStarsPerRepo / 2) * 15, 15);
      score += activityScore;

      const diversityScore = Math.min((topLanguages.length / 5) * 10, 10);
      score += diversityScore;

      return Math.round(Math.min(score, 100));
    };

    const score = calculateGitHubScore(data, reposRes.data);

    const githubData = {
      username: data.login,
      avatarUrl: data.avatar_url,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      stars: totalStars,
      totalCommits: 0,
      score: score,
      languagesUsed: topLanguages,
    };

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { github: githubData } },
      { new: true, upsert: true }
    );

    res.status(200).json({ 
      message: "GitHub data saved successfully", 
      user: updatedProfile,
      score: score 
    });
  } catch (error) {
    console.error("GitHub fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch GitHub data" });
  }
};


export const getUserProfile =  async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await UserProfile.findOne({ userId });
    return res.status(200).json(profile);
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateLeetCodeProfile = async (req, res) => {
  
  const { userId, username, profileData } = req.body;

  if (!userId || !username || !profileData) {
    
    return res.status(400).json({ 
      error: 'userId, username and profileData are required',
      received: { 
        userId: !!userId, 
        username: !!username,
        profileData: !!profileData,
        bodyKeys: Object.keys(req.body)
      }
    });
  }

  try {
    
    let profile = await UserProfile.findOne({ userId });
    
    if (!profile) {
      profile = new UserProfile({ userId });
    }

    profile.leetcode = {
      username: username,
      profileUrl: profileData.profileUrl || `https://leetcode.com/${username}`,
      totalSolved: profileData.totalSolved || 0,
      easySolved: profileData.easySolved || 0,
      mediumSolved: profileData.mediumSolved || 0,
      hardSolved: profileData.hardSolved || 0,
      // totalQuestions: profileData.totalQuestions || 0,
      // totalEasy: profileData.totalEasy || 0,
      // totalMedium: profileData.totalMedium || 0,
      // totalHard: profileData.totalHard || 0,
      // acceptanceRate: profileData.acceptanceRate || 0,
      ranking: profileData.ranking || null,
      contestRating: profileData.contestRating || null,
      // score: profileData.score || 0,
      // lastUpdated: new Date()
    };

    await profile.save();


    res.status(200).json({
      message: "LeetCode profile updated successfully",
      leetcode: profile.leetcode,
      success: true
    });
  } catch (error) {
    console.error("❌ Error updating LeetCode profile:", error);
    
    res.status(500).json({ 
      error: "Failed to update LeetCode profile",
      details: error.message 
    });
  }
};



export const saveLinkedInData = async (req, res) => {
  try {
    
    const { userId, username, profileUrl, headline, followers, connections, skills } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!username) {
      return res.status(400).json({ error: 'username is required' });
    }

    let user = await UserProfile.findOne({ userId });

    const linkedinData = {
      username: username || "",
      profileUrl: profileUrl || "",
      headline: headline || "",
      followers: parseInt(followers) || 0,
      connections: parseInt(connections) || 0,
      skills: parseInt(skills) || 0
    };


    if (!user) {
      console.log("Creating new user profile");
      user = new UserProfile({
        userId,
        linkedin: linkedinData
      });
    } else {
      user.linkedin = linkedinData;
    }

    const savedUser = await user.save();

    res.status(200).json({ 
      message: 'LinkedIn data saved successfully', 
      linkedin: savedUser.linkedin,
      success: true
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.message 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid data format', 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
