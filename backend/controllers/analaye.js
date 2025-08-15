import dotenv from "dotenv";
import axios from "axios";
import { CohereClient } from "cohere-ai";

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const githubAnalys = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== "string" || transcript.trim() === "") {
      return res.status(400).json({ error: "Transcript is required." });
    }

    const response = await cohere.chat({
      model: "command-r-plus",
      temperature: 0.3,
      message: transcript,
    });

    let text = response.text || "";
    
    // Clean the response to extract JSON from markdown code blocks
    text = text.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
    // Also handle cases where it might just be wrapped in ```
    text = text.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();

    res.status(200).json({ text });
  } catch (error) {
    console.error("Cohere API error:", error);
    res.status(500).json({ error: "Something went wrong with the analysis." });
  }
};
export const fetchLeetcodeProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
    if (!response.data || response.data.status === "error") {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(response.data);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const leetcodeAnalys = async (req, res) => {
  const profileData = req.body?.data || {};

  try {
    if (!profileData || Object.keys(profileData).length === 0) {
      return res.status(400).json({ error: "Data is required for analysis" });
    }

    let analysisPrompt;

    if (typeof profileData === "string") {
      analysisPrompt = profileData;
    } else if (typeof profileData === "object") {
      analysisPrompt = `You are an expert in competitive programming.
Analyze this LeetCode profile data and return ONLY valid JSON in this EXACT format:
{
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "nextRecommendedQuestions": ["string", ...]
}
Do not add any other keys, text, markdown, or explanation.

LeetCode Profile Data:
Total Solved: ${profileData.totalSolved || 0}
Easy Solved: ${profileData.easySolved || 0}/${profileData.totalEasy || 0}
Medium Solved: ${profileData.mediumSolved || 0}/${profileData.totalMedium || 0}
Hard Solved: ${profileData.hardSolved || 0}/${profileData.totalHard || 0}
Acceptance Rate: ${profileData.acceptanceRate || "N/A"}%
Ranking: ${profileData.ranking || "Unranked"}
Contribution Points: ${profileData.contributionPoints || 0}

Based on this data, provide insights about strengths, areas to improve, and specific problem recommendations.`;
    } else {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // FIXED: Use correct Cohere API format
    const response = await cohere.chat({
      model: "command-r-plus",
      temperature: 0.3,
      message: analysisPrompt,  // Use 'message' not 'messages'
    });

    let cleanedText = (response.text || "").trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "").replace(/```$/, "").trim();
    }

    // Try to extract JSON from the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log("No JSON found, using fallback");
      throw new Error("No JSON object found in AI output");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.weaknesses) ||
      !Array.isArray(parsed.nextRecommendedQuestions)
    ) {
      console.log("Invalid structure, using fallback");
      throw new Error("Invalid AI JSON structure");
    }

    // Success - return the AI analysis
    res.status(200).json({
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      nextRecommendedQuestions: parsed.nextRecommendedQuestions,
      success: true
    });

  } catch (error) {
    console.error("LeetCode analysis error:", error);

    // Enhanced fallback logic based on actual data
    const totalSolved = profileData.totalSolved || 0;
    const acceptanceRate = profileData.acceptanceRate || 0;
    const easySolved = profileData.easySolved || 0;
    const mediumSolved = profileData.mediumSolved || 0;
    const hardSolved = profileData.hardSolved || 0;
    const ranking = profileData.ranking || null;

    const strengths = [];
    const weaknesses = [];

    // Analyze strengths
    if (totalSolved >= 500) {
      strengths.push("Excellent problem-solving consistency with 500+ problems solved");
    } else if (totalSolved >= 200) {
      strengths.push("Strong problem-solving foundation with 200+ problems completed");
    } else if (totalSolved >= 100) {
      strengths.push("Good practice volume with 100+ problems solved");
    } else if (totalSolved >= 50) {
      strengths.push("Building momentum with 50+ problems completed");
    } else {
      strengths.push("Taking the first steps in competitive programming");
    }

    if (acceptanceRate >= 70) {
      strengths.push("Excellent code quality with high acceptance rate");
    } else if (acceptanceRate >= 50) {
      strengths.push("Good problem-solving accuracy and approach");
    }

    if (hardSolved >= 50) {
      strengths.push("Strong algorithmic skills with advanced problem solving");
    } else if (hardSolved >= 20) {
      strengths.push("Comfortable tackling challenging problems");
    }

    if (ranking && ranking <= 100000) {
      strengths.push("Strong competitive programming ranking");
    }

    // Analyze weaknesses
    if (acceptanceRate < 40) {
      weaknesses.push("Focus on understanding problem requirements before coding");
    }

    if (totalSolved < 200) {
      weaknesses.push("Increase practice frequency to build more problem-solving patterns");
    }

    if (hardSolved < 10 && totalSolved > 50) {
      weaknesses.push("Challenge yourself with more hard-difficulty problems");
    }

    if (mediumSolved < easySolved && totalSolved > 100) {
      weaknesses.push("Balance practice by focusing more on medium-difficulty problems");
    }

    if (acceptanceRate < 60 && totalSolved > 50) {
      weaknesses.push("Work on code efficiency and edge case handling");
    }

    // Ensure we have content
    if (strengths.length === 0) {
      strengths.push("Every coding journey begins with dedication - keep practicing!");
    }
    
    if (weaknesses.length === 0) {
      weaknesses.push("Continue consistent practice to unlock new growth opportunities");
    }

    const fallbackResponse = {
      strengths,
      weaknesses,
      nextRecommendedQuestions: [
        "Two Sum", 
        "Valid Parentheses", 
        "Merge Two Sorted Lists",
        "Maximum Subarray", 
        "Climbing Stairs",
        "Best Time to Buy and Sell Stock",
        "Binary Tree Inorder Traversal",
        "Symmetric Tree"
      ],
      success: true,
      fallback: true
    };

    res.status(200).json(fallbackResponse);
  }
};




export const linkdinGenerate = async (req, res) => {
  const { name, degree, skills, experience, linkedinUrl } = req.body;

  if (!name || !skills) {
    return res.status(400).json({ error: "Name and skills are required fields" });
  }


  const prompt = `Generate a professional LinkedIn profile optimization with the following structure:

  **Headline**: [Create a compelling 120-character headline for ${name} that incorporates their key skills: ${skills}]
  
  **About Section**: [Write a detailed 3-5 paragraph summary in first person that highlights:
  - Professional background
  - Key skills (${skills})
  - ${degree ? `Education (${degree})` : 'Relevant education'}
  - ${experience ? `Notable experience (${experience})` : 'Professional experience'}
  - Career objectives
  - Personal brand/value proposition
  ]
  
  **Skills**: [List the top 10 most relevant skills from: ${skills}]
  
  Name: ${name}
  ${degree ? `Degree: ${degree}` : ''}
  Skills: ${skills}
  ${experience ? `Experience: ${experience}` : ''}
  ${linkedinUrl ? `LinkedIn URL: ${linkedinUrl}` : ''}

  Return the response in this exact format:
  HEADLINE: [generated headline]
  ABOUT: [generated about section]
  SKILLS: [comma-separated list of top skills]`;

  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      max_tokens: 500,
      temperature: 0.6,
    });

    const output = response.generations[0].text.trim();


    const headlineMatch = output.match(/HEADLINE:\s*(.+)/i);
    const aboutMatch = output.match(/ABOUT:\s*([\s\S]+?)SKILLS:/i);
    const skillsMatch = output.match(/SKILLS:\s*(.+)/i);

    const headline = headlineMatch ? headlineMatch[1].trim() : "";
    let about = aboutMatch ? aboutMatch[1].trim() : "";
    

    about = about.replace(/\n+/g, '\n').trim();
    

    let skillsArray = skills.split(',').map(s => s.trim()).slice(0, 10);
    if (skillsMatch) {
      skillsArray = skillsMatch[1].split(',').map(s => s.trim()).filter(s => s);
    }

    res.json({
      headline: headline || `${name} | ${skills.split(',').slice(0, 3).join(', ')}`,
      about: about || `I'm ${name}, a professional with expertise in ${skills}. ${experience ? `My experience includes ${experience}.` : ''} ${degree ? `I hold a degree in ${degree}.` : ''}`,
      skillsArray,
      featuredLink: linkedinUrl || null,
    });

  } catch (err) {
    console.error("Cohere Error:", err);
    res.status(500).json({ 
      error: "Failed to generate using AI.",
      fallback: {
        headline: `${name} | ${skills.split(',').slice(0, 3).join(', ')}`,
        about: `I'm ${name}, a professional with expertise in ${skills}. ${experience ? `My experience includes ${experience}.` : ''} ${degree ? `I hold a degree in ${degree}.` : ''}`,
        skillsArray: skills.split(',').map(s => s.trim()).slice(0, 10),
        featuredLink: linkedinUrl || null
      }
    });
  }
};

export const ProfileSection =async (req, res) => {
  const { github, leetcode, linkedin, insights } = req.body;
  const userId = req.auth.userId;

  try {
    let profile = await Profile.findOne({ userId });

    if (profile) {
      profile.github = github || profile.github;
      profile.leetcode = leetcode || profile.leetcode;
      profile.linkedin = linkedin || profile.linkedin;
      profile.insights = insights || profile.insights;
      await profile.save();
      return res.status(200).json({ message: "Profile updated", profile });
    }


    profile = new Profile({
      userId,
      github,
      leetcode,
      linkedin,
      insights,
    });

    await profile.save();
    res.status(201).json({ message: "Profile created", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


