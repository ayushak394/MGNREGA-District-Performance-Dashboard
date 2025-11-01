import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./PerformanceChart.css";

const PerformanceHistoryChart = ({ district }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!district) return;
    setLoading(true);

    axios
      .get(`http://localhost:8080/api/performance/history/${district}`)
      .then((res) => {
        const data = res.data || [];

        // ✅ Group and aggregate duplicate entries by (month, year)
        const grouped = data.reduce((acc, curr) => {
          const key = `${curr.month}-${curr.year}`;
          if (!acc[key]) {
            acc[key] = {
              month: curr.month,
              year: curr.year, // e.g., "2023-2024"
              expenditure: 0,
              personDaysGenerated: 0,
              totalWorks: 0,
              count: 0,
            };
          }
          acc[key].expenditure += curr.expenditure || 0;
          acc[key].personDaysGenerated += curr.personDaysGenerated || 0;
          acc[key].totalWorks += curr.totalWorks || 0;
          acc[key].count += 1;
          return acc;
        }, {});

        // ✅ Format and sort by chronological order
        const monthOrder = [
          "Apr", "May", "Jun", "Jul", "Aug", "Sep",
          "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
        ];

        const formatted = Object.values(grouped)
          .map((d) => {
            const month = d.month;
            const yearParts = d.year.split("-"); // e.g., ["2023", "2024"]
            const yearStart = parseInt(yearParts[0]);
            const yearEnd = parseInt(yearParts[1]);

            // **CRITICAL FIX:** Determine the true calendar year for sorting
            const chronologicalYear = ['Jan', 'Feb', 'Mar'].includes(month) ? yearEnd : yearStart;
            
            return {
              // Use a clean label for display
              label: `${month} '${chronologicalYear.toString().slice(2)}`, // e.g., Aug '23, Jan '24
              // Use the numerical year for accurate sorting
              sortYear: chronologicalYear,
              expenditure: d.expenditure,
              personDaysGenerated: d.personDaysGenerated,
              totalWorks: d.totalWorks,
            };
          })
          .sort((a, b) => {
            // 1. Sort by the true chronological year (e.g., all 2023 data before 2024)
            const yearA = a.sortYear;
            const yearB = b.sortYear;
            
            // 2. Then, sort by month within the year, using the custom financial year order
            const monthA = monthOrder.indexOf(a.label.split(" ")[0]);
            const monthB = monthOrder.indexOf(b.label.split(" ")[0]);
            
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setHistory(formatted);
      })
      .catch((err) =>
        console.error("❌ Error fetching historical data:", err)
      )
      .finally(() => setLoading(false));
  }, [district]);

  if (loading)
    return (
      <p className="chart-message">
        ⏳ Loading performance trends for **{district}**...
      </p>
    );

  if (!history.length)
    return (
      <p className="chart-message">
        ⚠️ No historical data available for **{district}**.
      </p>
    );

  return (
    <div className="trend-section">
      <h2 className="trend-title">📊 Past Performance Trends for {district}</h2>

      {/* 🔸 Expenditure (Using a stronger amber/orange color) */}
      <div className="trend-chart-box">
        <h3>💰 Expenditure (₹ Lakhs)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={70} style={{ fontSize: '0.9rem' }} />
            <YAxis style={{ fontSize: '0.9rem' }} tickFormatter={(value) => value.toLocaleString('en-IN')} />
            <Tooltip wrapperClassName="recharts-default-tooltip" />
            <Legend />
            {/* Darker Amber/Orange line color for better contrast */}
            <Line type="monotone" dataKey="expenditure" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} name="Expenditure" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔸 Person Days (Using a strong primary blue color) */}
      <div className="trend-chart-box">
        <h3>👥 Person Days Generated</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={70} style={{ fontSize: '0.9rem' }} />
            <YAxis style={{ fontSize: '0.9rem' }} tickFormatter={(value) => value.toLocaleString('en-IN')} />
            <Tooltip wrapperClassName="recharts-default-tooltip" />
            <Legend />
            {/* Primary Blue line color */}
            <Line type="monotone" dataKey="personDaysGenerated" stroke="#007bff" strokeWidth={3} dot={{ r: 4 }} name="Person Days" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔸 Total Works (Using a deep green color) */}
      <div className="trend-chart-box">
        <h3>🔨 Total Works Taken Up</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={70} style={{ fontSize: '0.9rem' }} />
            <YAxis style={{ fontSize: '0.9rem' }} tickFormatter={(value) => value.toLocaleString('en-IN')} />
            <Tooltip wrapperClassName="recharts-default-tooltip" />
            <Legend />
            {/* Deep Green line color */}
            <Line type="monotone" dataKey="totalWorks" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Total Works" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceHistoryChart;