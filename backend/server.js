import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/router.js";
import profileRoute from "./router/ProfileRoute.js";
import connectDB from "./utils/dbConnection.js";

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'production' === 'production'
    ? 'https://dev-insight-smoky.vercel.app'
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use("/api",router);
app.use("/api/profile",profileRoute)

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
