
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BarChart from "./components/Barcharts";
import Statistics from "./components/Statistics";
import Navbar from "./components/Navbar";
import Transactions from "./components/Transaction";

const App = () => {
  return (
    <Router>
      <div>
        {/* Render the Navbar */}
        <Navbar />

        {/* Define the Routes */}
        <Routes>
          <Route path="/" element={<Transactions />} />
          <Route path="/barchart" element={<BarChart />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
