import React from "react";
import Navbar from "./components/navbar";
import Search from "./components/Search";
import { Route, Routes } from "react-router-dom";
import Cards from "./components/Cards";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar></Navbar>
      <Search></Search>
      <Cards></Cards>
    </div>
  );
}

export default App;
