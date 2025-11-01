import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  districtName: String,
  stateName: String,
  month: String,
  year: String,
  totalWorks: Number,
  personDaysGenerated: Number,
  expenditure: Number,
  lastUpdated: { type: Date, default: Date.now },
});

// 🧱 Prevent duplicate (districtName, month, year)
districtSchema.index({ districtName: 1, month: 1, year: 1 }, { unique: true });


export default mongoose.model("DistrictData", districtSchema);
