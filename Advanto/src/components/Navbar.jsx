import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl font-bold">Dashboard</div>

        {/* Hamburger Button for Mobile */}
        <button onClick={toggleNavbar} className="text-white block md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Links for desktop and expanded mobile menu */}
        <div
          className={`flex-col md:flex-row md:flex items-center space-x-6 ${isOpen
            ? "flex"
            : "hidden"} md:block`}
        >
          <Link to="/" className="text-white">
            Home
          </Link>
          <Link to="/barChart" className="text-white">
            Bar Chart
          </Link>
          <Link to="/piechart" className="text-white">
            Pie Chart
          </Link>
          <Link to="/statistics" className="text-white">
            Statistics
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
