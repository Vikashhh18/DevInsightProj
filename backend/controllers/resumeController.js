import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/x-pdf",
      "application/acrobat",
      "applications/vnd.pdf",
      "text/pdf",
      "text/x-pdf"
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { 
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadMiddleware = upload.single("resume");

const extractTextFromPDF = async (buffer) => {
  try {
    const options = {
      version: 'v1.10.100',
      max: 0,
    };
    
    const data = await pdfParse(buffer, options);
    
    let text = data.text;
    
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim();
    
    return text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

export const resumeAnalyze = async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const resumeFile = req.file;

    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Job title is required and must be a non-empty string."
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        error: "Resume PDF file is required."
      });
    }

    if (resumeFile.size === 0) {
      return res.status(400).json({
        success: false,
        error: "Uploaded file is empty."
      });
    }

    let resumeText;
    try {
      resumeText = await extractTextFromPDF(resumeFile.buffer);
    } catch (parseError) {
      console.error("PDF parsing error:", parseError);
      return res.status(400).json({
        success: false,
        error: "Failed to parse PDF. Please ensure the file is a valid PDF document."
      });
    }

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        error: "Resume content is too short or unreadable. Please upload a detailed resume."
      });
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume for the job title "${jobTitle}".

Provide a comprehensive analysis and return ONLY valid JSON in this exact format:
{
  "atsScore": number (0-100),
  "missingSkills": ["skill1", "skill2", "skill3"],
  "suggestions": ["specific improvement suggestion1", "specific improvement suggestion2", "specific improvement suggestion3"]
}

Analysis Guidelines:
- ATS score should reflect how well the resume matches the "${jobTitle}" position requirements
- Missing skills should be relevant technical and soft skills for "${jobTitle}"
- Suggestions should be specific, actionable improvements
- Consider industry standards and common requirements for "${jobTitle}"
- Focus on keywords, skills, experience relevance, and resume structure

Resume Content:
${resumeText.substring(0, 4000)}

Return only the JSON object, no other text.`;
    const response = await cohere.chat({
      message: prompt,
      model: "command-r-plus",
      temperature: 0.1,
      maxTokens: 1500,
    });


    // Parse AI response
    let analysis;
    try {
      // Clean the response text and extract JSON
      let responseText = response.text.trim();
      
      // Try to extract JSON from response if it's wrapped in other text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }
      
      const parsedData = JSON.parse(responseText);
      
      // Validate required fields and set defaults
      analysis = {
        atsScore: typeof parsedData.atsScore === 'number' ? 
          Math.min(100, Math.max(0, Math.round(parsedData.atsScore))) : 65,
        missingSkills: Array.isArray(parsedData.missingSkills) ? 
          parsedData.missingSkills.slice(0, 8) : ["Industry-specific skills", "Technical certifications"],
        suggestions: Array.isArray(parsedData.suggestions) ? 
          parsedData.suggestions.slice(0, 8) : [
            "Add more relevant keywords for the position",
            "Include quantifiable achievements",
            "Improve resume formatting for ATS compatibility"
          ]
      };
      
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw AI response:", response.text);
      
      // Fallback analysis if parsing fails
      analysis = {
        atsScore: 65,
        missingSkills: [
          "Industry-specific technical skills",
          "Relevant certifications",
          "Keywords matching job description"
        ],
        suggestions: [
          "Include more relevant keywords for the position",
          "Add quantifiable achievements and results",
          "Ensure resume format is ATS-friendly",
          "Include relevant certifications and skills section"
        ]
      };
    }

    // Return successful response in the format your frontend expects
    res.status(200).json({
      success: true,
      jobTitle: jobTitle.trim(),
      analysis: analysis,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Error in resume analysis:", error);
    
    // Handle different types of errors
    if (error.message?.includes('API') || error.message?.includes('cohere')) {
      return res.status(503).json({
        success: false,
        error: "AI service temporarily unavailable. Please try again later."
      });
    }
    
    if (error.name === 'MulterError') {
      return res.status(400).json({
        success: false,
        error: `File upload error: ${error.message}`
      });
    }
    
    // Generic server error
    res.status(500).json({
      success: false,
      error: "Something went wrong while analyzing the resume. Please try again."
    });
  }
};
