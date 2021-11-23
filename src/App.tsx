import React from "react";
import { Routes, Route } from "react-router-dom";

// import logo from "./logo.svg";
import { AppNavbar } from "./components";
import { About, Home, Search } from "./pages";
import "./App.css";

export const App: React.FC = () => (
  <div>
    <AppNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  </div>
);
