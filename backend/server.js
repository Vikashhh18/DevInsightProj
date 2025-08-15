import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/router.js";
import connectDB from "./utils/dbConnection.js";
import profileRoute from "./router/ProfileRoute.js";

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use("/api",router);
app.use("/api/profile",profileRoute)

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
