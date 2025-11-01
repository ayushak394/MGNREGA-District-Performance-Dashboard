import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import DistrictData from "../models/DistrictData.js";

dotenv.config();

const months = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const finYears = ["2023-2024", "2024-2025"];

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

export const fetchAndSaveData = async () => {
  console.log(
    "📡 Fetching MGNREGA data for multiple financial years and months..."
  );

  for (const finYear of finYears) {
    for (const month of months) {
      try {
        const url = `${process.env.DATA_API}&filters[state_name]=UTTAR%20PRADESH&filters[month]=${month}&filters[fin_year]=${finYear}`;
        console.log(`📅 Fetching data for ${month} ${finYear}...`);

        const response = await axios.get(url, { timeout: 20000 });
        const records = response.data.records;

        if (!records || records.length === 0) {
          console.log(`⚠️ No data found for ${month} ${finYear}`);
          continue;
        }

        const formatted = records.map((r) => ({
          districtName: r.district_name,
          stateName: r.state_name,
          month: r.month,
          year: r.fin_year,
          totalWorks: Number(r.Total_No_of_Works_Takenup) || 0,
          personDaysGenerated:
            Number(r.Persondays_of_Central_Liability_so_far) || 0,
          expenditure: Number(r.Total_Exp) || 0,
          lastUpdated: new Date(),
        }));

        // Upsert each record
        for (const record of formatted) {
          await DistrictData.updateOne(
            {
              districtName: record.districtName,
              month: record.month,
              year: record.year,
            },
            { $set: record },
            { upsert: true }
          );
        }

        console.log(
          `✅ Stored ${formatted.length} records for ${month} ${finYear}`
        );
      } catch (err) {
        console.error(`❌ Error fetching ${month} ${finYear}:`, err.message);
      }
    }
  }

  console.log("🎉 Finished fetching all data!");
};

