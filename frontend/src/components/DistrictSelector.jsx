import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DistrictSelector.css";
import API_BASE from "../api"; // or correct relative path

const DistrictSelector = ({ selection, setSelection }) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch district list
  useEffect(() => {
    // NOTE: Consider adding a cleanup function to cancel the request if the component unmounts
    axios
      .get(`${API_BASE}/api/districts`)
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error("Error fetching districts:", err))
      .finally(() => setLoading(false));
  }, []);

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

  const years = ["2023", "2024", "2025"]; // ✅ Plain years only

  if (loading) return <p className="loading-text">Loading districts...</p>;

  return (
    <div className="selector-container">
      {/* District Selector */}
      <div className="form-group">
        <label className="selector-label" htmlFor="district-select">
          Select District / <span className="hindi-text">ज़िला चुनें</span>
        </label>
        <select
          id="district-select"
          className="selector-dropdown"
          value={selection.district}
          onChange={(e) =>
            setSelection((prev) => ({ ...prev, district: e.target.value }))
          }
        >
          <option value="">-- Select District --</option>
          {districts.map((d) => (
            <option key={d._id} value={d.districtName}>
              {d.districtName}
            </option>
          ))}
        </select>
      </div>

      {/* Group Month and Year selectors side-by-side */}
      <div className="date-selection-group">
        {/* Month Selector */}
        <div className="form-group month-selector">
          <label className="selector-label" htmlFor="month-select">
            Select Month / <span className="hindi-text">महीना चुनें</span>
          </label>
          <select
            id="month-select"
            className="selector-dropdown"
            value={selection.month}
            onChange={(e) =>
              setSelection((prev) => ({ ...prev, month: e.target.value }))
            }
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div className="form-group year-selector">
          <label className="selector-label" htmlFor="year-select">
            Select Year / <span className="hindi-text">वर्ष चुनें</span>
          </label>
          <select
            id="year-select"
            className="selector-dropdown"
            value={selection.year}
            onChange={(e) =>
              setSelection((prev) => ({ ...prev, year: e.target.value }))
            }
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Detect Automatically Button */}
      <button
        className="find-district-btn"
        onClick={async () => {
          if (!navigator.geolocation)
            return alert("Geolocation not supported.");
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;

              // Set a brief loading state on the button itself if possible, or a global spinner.
              // For now, an alert will suffice.
              const statusAlert = document.getElementById("status-alert");
              // statusAlert.textContent = "Detecting district...";

              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await res.json();

              // Heuristic for finding district name
              const district =
                data.address?.county ||
                data.address?.state_district ||
                data.address?.city;

              if (district) {
                setSelection((prev) => ({
                  ...prev,
                  district: district.toUpperCase(),
                }));
              } else {
                alert(
                  "Unable to detect your district. Please select it manually."
                );
              }
            },
            (error) => {
              // Handle geolocation errors (e.g., user denied access)
              alert(
                `Geolocation error: ${error.message}. Please select your district manually.`
              );
            }
          );
        }}
      >
        <span className="emoji">🗺️</span> Detect My District Automatically
      </button>

      {/* A place for status messages */}
      <p id="status-alert" className="status-alert"></p>
    </div>
  );
};

export default DistrictSelector;
