import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaHammer,
  FaUsers,
  FaRupeeSign,
  FaQuestionCircle,
} from "react-icons/fa";
import "./PerformanceChart.css";
import { API_BASE } from "../api.js";


const SummaryCard = ({
  value,
  icon: Icon,
  colorClass,
  labelHindi,
  labelEnglish,
  tooltipText,
}) => (
  <div className={`summary-card ${colorClass}-card`} tabIndex="0">
    <div>
      <div className="card-label-group">
        <p className="card-label">{labelHindi}</p>
        <FaQuestionCircle className="help-icon" title={tooltipText} />
      </div>
      <p className="card-label-english">{labelEnglish}</p>
      <h2 className="card-value">
        {value ? value.toLocaleString("en-IN") : "—"}
      </h2>
    </div>
    <Icon className={`card-icon ${colorClass}-icon`} />
  </div>
);

const PerformanceChart = ({ selection }) => {
  const { district, month, year } = selection;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!district) return;
    setLoading(true);
    setError("");
    setData(null);

    axios
      .get(
        `${API_BASE}/api/performance/${district}?month=${month}&year=${year}`
      )
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("❌ Error fetching district data:", err);
        setError("Unable to fetch data at the moment.");
      })
      .finally(() => setLoading(false));
  }, [district, month, year]);

  if (!district)
    return (
      <p className="chart-message">
        कृपया ऊपर एक ज़िला चुनें / Please select a district above.
      </p>
    );

  if (loading)
    return (
      <p className="chart-message">
        ⏳ Loading data for {district} ({month} {year})...
      </p>
    );

  if (error)
    return (
      <p className="chart-message" style={{ color: "red" }}>
        ⚠️ {error}
      </p>
    );

  if (!data)
    return (
      <p className="chart-message">
        ⚠️ No data available for {district} ({month} {year}).
      </p>
    );

  const { totalWorks, personDaysGenerated, expenditure, lastUpdated } = data;

  return (
    <div className="chart-container">
      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          value={totalWorks}
          icon={FaHammer}
          colorClass="green"
          labelHindi="कुल कार्य"
          labelEnglish="Total Works"
          tooltipText="कुल कार्यों की संख्या (Total number of works started)"
        />
        <SummaryCard
          value={personDaysGenerated}
          icon={FaUsers}
          colorClass="blue"
          labelHindi="मानव-दिवस"
          labelEnglish="Person Days"
          tooltipText="योजना के तहत रोजगार दिवस (Total person-days generated)"
        />
        <SummaryCard
          value={expenditure}
          icon={FaRupeeSign}
          colorClass="yellow"
          labelHindi="कुल व्यय (₹ लाख)"
          labelEnglish="Expenditure (₹ Lakhs)"
          tooltipText="कुल व्यय राशि (Total expenditure in lakhs)"
        />
      </div>
      </div>
  );
};

export default PerformanceChart;
