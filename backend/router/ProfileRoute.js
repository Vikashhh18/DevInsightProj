import express from 'express'
import {updateGitHubData,saveUserProfile, getUserProfile, updateLeetCodeProfile, saveLinkedInData } from '../controllers/profile.js'

const profileRoute=express.Router();

profileRoute.post('/github',updateGitHubData)
profileRoute.post('/leetcode',updateLeetCodeProfile)
profileRoute.post('/linkdin',saveLinkedInData)

profileRoute.post('/',saveUserProfile)

profileRoute.get("/:userId",getUserProfile);




export default profileRoute;