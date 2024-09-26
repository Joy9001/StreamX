import React from "react";
import Navbar from "../components/Navbar.jsx";
import Search from "../components/Search.jsx";
import Cards from "../components/Cards.jsx";

function HiredEditor() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Search />
      <Cards />
    </div>
  );
}

export default HiredEditor;
