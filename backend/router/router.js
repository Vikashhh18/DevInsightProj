import express from "express";
import { fetchLeetcodeProfile, githubAnalys, leetcodeAnalys, linkdinGenerate } from "../controllers/analaye.js"; // Make sure path is correct
import {  resumeAnalyze, uploadMiddleware } from "../controllers/resumeController.js";


const router = express.Router();

router.post("/analyze/github", githubAnalys); 

router.post("/resume-analyze", uploadMiddleware, resumeAnalyze);

router.get("/leetcode/:username", fetchLeetcodeProfile);
router.post("/analyze/leetcode", leetcodeAnalys);

router.post("/linkedin/generate",linkdinGenerate);


export default router;
