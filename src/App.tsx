import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import logo from "./logo.svg";
import { AppNavbar } from "./components";
import { About, Home, Search } from "./pages";
import "./App.css";
import { ChakraUI } from "./ui/ChakraUI";
import { MainLayout } from "./ui/MainLayout";

export const App: React.FC = () => (
  <BrowserRouter>
    <ChakraUI>
      <AppNavbar />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </MainLayout>
    </ChakraUI>
  </BrowserRouter>
);
