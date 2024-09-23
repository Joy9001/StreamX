import React from "react";
import Navbar from "./components/navbar";
import Search from "./components/Search";
import Card from "./components/Card";
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar></Navbar>
      <Search></Search>
      <Card></Card>
    </div>
  );
}

export default App;
