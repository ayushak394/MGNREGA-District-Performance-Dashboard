import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { fetchAndSaveData } from "./services/fetchData.js";
import DistrictData from "./models/DistrictData.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// 🧩 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🏠 Default route
app.get("/", (req, res) => {
  res.send("🚀 MGNREGA Backend is Running...");
});

// 📊 Get list of all districts
// ✅ server.js or routes file
app.get("/api/districts", async (req, res) => {
  try {
    // Use distinct() to get unique district names
    const districts = await DistrictData.distinct("districtName");

    if (!districts || districts.length === 0) {
      return res.status(404).json({ message: "No district data available." });
    }

    // Sort alphabetically (optional)
    const sortedDistricts = districts.sort((a, b) => a.localeCompare(b));

    // Return as objects for frontend consistency
    res.json(sortedDistricts.map((d) => ({ districtName: d })));
  } catch (err) {
    console.error("❌ Error fetching districts:", err.message);
    res.status(500).json({ error: "Server error while fetching districts." });
  }
});

// 📈 Get performance data for a specific district (with optional month/year)
app.get("/api/performance/:district", async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { districtName: req.params.district.toUpperCase() };

    if (month) filter.month = new RegExp(month, "i");
    if (year) filter.year = new RegExp(year, "i");

    const data = await DistrictData.findOne(filter).sort({ lastUpdated: -1 });

    if (!data) {
      return res.status(404).json({
        message: "No data found for this district and time period.",
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching performance:", err.message);
    res.status(500).json({
      error: "Server error while fetching performance data.",
    });
  }
});

app.get("/api/performance/history/:district", async (req, res) => {
  try {
    const raw = await DistrictData.find({
      districtName: req.params.district.toUpperCase(),
    }).lean();

    if (!raw || raw.length === 0) {
      return res
        .status(404)
        .json({ message: "No historical data found for this district." });
    }

    // canonical month order relative to financial year (Apr -> Mar)
    const monthOrder = {
      Apr: 1,
      May: 2,
      Jun: 3,
      Jul: 4,
      Aug: 5,
      Sep: 6,
      Oct: 7,
      Nov: 8,
      Dec: 9,
      Jan: 10,
      Feb: 11,
      Mar: 12,
    };

    // helper to extract numeric fiscal start year
    const fiscalStart = (yearRaw) => {
      if (!yearRaw) return Number.MIN_SAFE_INTEGER;
      // common format "2024-2025" -> 2024
      const hyphenMatch = String(yearRaw).match(/^(\d{4})\s*-/);
      if (hyphenMatch) return parseInt(hyphenMatch[1], 10);
      // sometimes saved as "2025" -> treat as calendar year (use as-is)
      const num = parseInt(yearRaw, 10);
      if (!isNaN(num) && String(yearRaw).length === 4) return num;
      // fallback
      return Number.MIN_SAFE_INTEGER;
    };

    const standardized = raw.map((r) => {
      return {
        ...r,
        _monthOrder: monthOrder[r.month] || 999,
        _fiscalStart: fiscalStart(r.year || r.fin_year || ""),
        // user-friendly label for x-axis
        _label: `${r.month} ${
          r.year && String(r.year).includes("-")
            ? String(r.year).split("-")[0]
            : r.year || r.fin_year || ""
        }`,
      };
    });

    standardized.sort((a, b) => {
      if (a._fiscalStart !== b._fiscalStart)
        return a._fiscalStart - b._fiscalStart;
      if (a._monthOrder !== b._monthOrder) return a._monthOrder - b._monthOrder;
      // final deterministic tie-breaker on lastUpdated
      if (a.lastUpdated && b.lastUpdated)
        return new Date(a.lastUpdated) - new Date(b.lastUpdated);
      return 0;
    });

    // strip helper fields before returning (if you want)
    const out = standardized.map(
      ({ _monthOrder, _fiscalStart, _label, ...rest }) => ({
        ...rest,
        label: _label || `${rest.month} ${rest.year || rest.fin_year || ""}`,
      })
    );

    res.json(out);
  } catch (err) {
    console.error("Error fetching historical data:", err.message);
    res.status(500).json({ error: "Server error while fetching history." });
  }
});

// 🔁 CRON Job — Refresh daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Scheduled daily data refresh...");
  await fetchAndSaveData();
});

// 🕓 Backup auto-refresh every 6 hours (in case cron fails)
setInterval(fetchAndSaveData, 6 * 60 * 60 * 1000);

// 🚀 Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // 🧠 On first boot, ensure DB has data
  const count = await DistrictData.countDocuments();
  if (count === 0) {
    console.log("📦 No local data found — fetching initial dataset...");
    await fetchAndSaveData();
  } else {
    console.log(`📦 Found ${count} cached records. Skipping fresh fetch.`);
  }
});
