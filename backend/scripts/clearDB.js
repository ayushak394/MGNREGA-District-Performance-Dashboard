import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await mongoose.connection.db.collection("districtdatas").deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} records successfully!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error clearing DB:", err.message);
  }
};

clearDatabase();
