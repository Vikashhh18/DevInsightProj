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

    const text = response.text || "";
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
  try {
    
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Data is required for analysis" });
    }


    let analysisPrompt;
    if (typeof data === "string") {
      analysisPrompt = data;
    } else if (typeof data === "object") {

      analysisPrompt = `You are an expert in competitive programming. Analyze this LeetCode profile and return ONLY a VALID JSON object with EXACTLY these 3 fields:
- strengths: array of strings
- weaknesses: array of strings  
- nextRecommendedQuestions: array of strings

DO NOT return explanation, markdown, or extra text — only return the JSON object directly.

LeetCode Profile Data:
Total Solved: ${data.totalSolved || 0}
Easy Solved: ${data.easySolved || 0}/${data.totalEasy || 0}
Medium Solved: ${data.mediumSolved || 0}/${data.totalMedium || 0}
Hard Solved: ${data.hardSolved || 0}/${data.totalHard || 0}
Acceptance Rate: ${data.acceptanceRate || 'N/A'}%
Ranking: ${data.ranking || 'Unranked'}
Contribution Points: ${data.contributionPoints || 0}

Based on this data, provide insights about strengths, areas to improve, and specific problem recommendations.`;
    } else {
      return res.status(400).json({ error: "Invalid data format" });
    }

    if (analysisPrompt.trim() === "") {
      return res.status(400).json({ error: "Empty data provided" });
    }



    const response = await cohere.chat({
      model: "command-r-plus",
      temperature: 0.3,
      message: analysisPrompt,
    });



    const text = response.text || "";

    if (!text || text.trim() === "") {
      console.error("No text content found in response");
      return res.status(500).json({ error: "No analysis content received from AI" });
    }



    let cleanedText = text.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "").replace(/```$/, "").trim();
    }


    try {
      const parsed = JSON.parse(cleanedText);
      

      if (!parsed.strengths || !parsed.weaknesses || !parsed.nextRecommendedQuestions) {
        throw new Error("AI response missing required fields");
      }
      
      if (!Array.isArray(parsed.strengths) || !Array.isArray(parsed.weaknesses) || !Array.isArray(parsed.nextRecommendedQuestions)) {
        throw new Error("AI response fields are not arrays");
      }


      res.status(200).json({ 
        text: cleanedText,
        success: true 
      });

    } catch (parseError) {
      console.error("JSON parsing failed:", parseError.message);
      console.error("Cleaned text:", cleanedText);
      

      const fallbackResponse = {
        strengths: [
          data.totalSolved >= 100 ? "Consistent problem solver with good volume" : "Getting started with problem solving",
          data.acceptanceRate >= 50 ? "Good problem-solving accuracy" : "Working on problem-solving approach",
          data.mediumSolved > data.easySolved ? "Comfortable with medium difficulty" : "Building foundation with easier problems"
        ].filter(Boolean),
        weaknesses: [
          data.hardSolved < 10 ? "Limited experience with hard problems" : null,
          data.acceptanceRate < 60 ? "Can improve solution efficiency" : null,
          data.totalSolved < 200 ? "Could benefit from more practice volume" : null
        ].filter(Boolean),
        nextRecommendedQuestions: [
          "Two Sum", "Valid Parentheses", "Merge Two Sorted Lists",
          "Binary Tree Inorder Traversal", "Maximum Subarray", "Climbing Stairs"
        ]
      };
      
      res.status(200).json({ 
        text: JSON.stringify(fallbackResponse),
        success: true,
        fallback: true
      });
    }

  } catch (error) {
    console.error("LeetCode analysis error:", error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: "Request timeout" });
    }
    
    if (error.response) {
      console.error("Cohere API error response:", error.response.data);
      return res.status(500).json({ 
        error: "AI service error", 
        details: error.response.data?.message || error.message 
      });
    }
    
    res.status(500).json({ 
      error: "Analysis failed", 
      details: error.message || "Unknown error occurred"
    });
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
      model: "command-xlarge",
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


