import { fetchAndSaveData } from "../services/fetchData.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
await fetchAndSaveData();
await mongoose.disconnect();
console.log("✅ Data fetch complete!");
