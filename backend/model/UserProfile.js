import mongoose from 'mongoose';

const GitHubSchema = new mongoose.Schema({
  username: { type: String, required: true },
  avatarUrl: String,
  publicRepos: Number,
  followers: Number,
  following: Number,
  stars: Number,
  totalCommits: Number,
  score: { type: Number, min: 0, max: 100 },
  languagesUsed: [String],
}, { _id: false });

const LeetCodeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profileUrl: String,
  totalSolved: Number,
  easySolved: Number,
  mediumSolved: Number,
  hardSolved: Number,
  ranking: Number,
  contestRating: Number,
}, { _id: false });

const LinkedInSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profileUrl: String,
  headline: String,
  followers: Number,
  connections: Number,
  skills:Number
}, { _id: false });

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  github: GitHubSchema,
  leetcode: LeetCodeSchema,
  linkedin: LinkedInSchema,
}, { timestamps: true });


const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

export default UserProfile;
