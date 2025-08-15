import express from "express";
import { fetchLeetcodeProfile, githubAnalys, leetcodeAnalys, linkdinGenerate } from "../controllers/analaye.js"; // Make sure path is correct
import {  resumeAnalyze, uploadMiddleware } from "../controllers/resumeController.js";


const router = express.Router();

// router.post("/save",ProfileSection)


router.post("/analyze/github", githubAnalys); 

router.post("/resume-analyze", uploadMiddleware, resumeAnalyze);


router.get("/leetcode/:username", fetchLeetcodeProfile); // <-- handles profile fetch
router.post("/analyze/leetcode", leetcodeAnalys); // <-- handles AI analysis

router.post("/linkedin/generate",linkdinGenerate)


// router.get("/profile/:userId",profileRoutes);


export default router;
