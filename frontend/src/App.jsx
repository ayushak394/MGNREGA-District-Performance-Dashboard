// // App.jsx
// import React, { useState } from "react";
// import DistrictSelector from "./components/DistrictSelector";
// import PerformanceChart from "./components/PerformanceChart";
// import PerformanceHistoryChart from "./components/PerformanceHistoryChart";

// import "./App.css";

// function App() {
//   const [district, setDistrict] = useState("");

//   return (
//     <div className="app-container">
//       {/* Header Section */}
//       <header className="header">
//         <img src="/emblem.png" alt="Government Emblem" className="emblem" />
//         <div className="header-text">
//           <h1>महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना</h1>
//           <h2>
//             Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
//           </h2>
//           <p>District Performance Dashboard / जिला प्रदर्शन डैशबोर्ड</p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main>
//         <DistrictSelector onSelect={setDistrict} />
//         <PerformanceChart district={district} />
//         <PerformanceHistoryChart district={district} />
//       </main>

//       {/* Info Section - Corrected Syntax */}
//       <section className="info-box">
//         <h3>💡 उपयोग के निर्देश / Usage Instructions:</h3>
//         <ul>
//           <li>
//             <strong>ज़िला चुनें:</strong> ऊपर दिए गए ड्रॉपडाउन से एक ज़िला
//             चुनें।
//           </li>
//           <li>
//             <strong>संकेतकों को समझें:</strong> प्रत्येक डेटा कार्ड पर **प्रश्न
//             चिह्न (?)** आइकन पर होवर (माउस ले जाएँ) या टैप करें, या कार्ड पर TAB
//             दबाएं, तो सरल हिंदी में जानकारी सामने आ जाएगी।
//           </li>
//           <li>
//             <strong>चार्ट:</strong> बार चार्ट तीनों मुख्य संकेतकों (कार्य,
//             मानव-दिवस, व्यय) का तुलनात्मक प्रदर्शन दिखाता है।
//           </li>
//         </ul>
//       </section>

//       <footer className="footer">
//         © 2025 Government of India | Data Source: data.gov.in
//       </footer>
//     </div>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import DistrictSelector from "./components/DistrictSelector";
// import PerformanceChart from "./components/PerformanceChart";
// import "./App.css";

// function App() {
//   const [selection, setSelection] = useState({
//     district: "",
//     month: "Dec",
//     year: "2025",
//   });

//   return (
//     <div className="app-container">
//       {/* Header Section */}
//       <header className="header">
//         <img src="/emblem.png" alt="Government Emblem" className="emblem" />
//         <div className="header-text">
//           <h1>महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना</h1>
//           <h2>
//             Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
//           </h2>
//           <p>District Performance Dashboard / जिला प्रदर्शन डैशबोर्ड</p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main>
//         <DistrictSelector onSelect={setSelection} />
//         <PerformanceChart selection={selection} setSelection={setSelection} />
//       </main>

//       {/* Info Section */}
//       <section className="info-box">
//         <h3>💡 उपयोग के निर्देश / Usage Instructions:</h3>
//         <ul>
//           <li>
//             <strong>ज़िला चुनें:</strong> ऊपर दिए गए ड्रॉपडाउन से एक ज़िला
//             चुनें।
//           </li>
//           <li>
//             <strong>संकेतकों को समझें:</strong> प्रत्येक डेटा कार्ड पर प्रश्न
//             चिह्न (?) आइकन पर होवर (माउस ले जाएँ) या टैप करें, या कार्ड पर TAB
//             दबाएं, तो सरल हिंदी में जानकारी सामने आ जाएगी।
//           </li>
//           <li>
//             <strong>चार्ट:</strong> बार चार्ट तीनों मुख्य संकेतकों (कार्य,
//             मानव-दिवस, व्यय) का तुलनात्मक प्रदर्शन दिखाता है।
//           </li>
//           <li>
//             <strong>समय चुनें:</strong> महीने और वर्ष बदलकर पिछला प्रदर्शन भी
//             देखें।
//           </li>
//         </ul>
//       </section>

//       <footer className="footer">
//         © 2025 Government of India | Data Source: data.gov.in
//       </footer>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import DistrictSelector from "./components/DistrictSelector";
import PerformanceChart from "./components/PerformanceChart";
import PerformanceHistoryChart from "./components/PerformanceHistoryChart";
import "./App.css";

function App() {
  const [selection, setSelection] = useState({
    district: "",
    month: "Dec",
    year: "2025",
  });
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="app-container">
      <header className="header">
        <img src="/emblem.png" alt="Government Emblem" className="emblem" />
        <div className="header-text">
          <h1>महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना</h1>
          <h2>MGNREGA District Performance Dashboard</h2>
        </div>
      </header>

      <main>
        {/* ✅ Pass both selection and setSelection */}
        <DistrictSelector selection={selection} setSelection={setSelection} />

        <PerformanceChart selection={selection} setSelection={setSelection} />

        {/* 📈 Toggle Button for Trend View */}
        {selection.district && (
          <button
            className="trend-toggle-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "⬆️ Hide Past Trends" : "📈 View Past Trends"}
          </button>
        )}

        {/* Trend Chart */}
        {showHistory && (
          <PerformanceHistoryChart district={selection.district} />
        )}
      </main>
    </div>
  );
}

export default App;
