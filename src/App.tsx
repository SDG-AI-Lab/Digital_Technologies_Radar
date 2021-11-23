import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import logo from "./logo.svg";
import { AppNavbar } from "./components";
import { About, Home, Search } from "./pages";
import "./App.css";
import { ChakraUI } from "./ui/ChakraUI";
import { MainLayout } from "./ui/MainLayout";
import { AppRadarProvider } from "./radar/RadarProvider";

export const App: React.FC = () => (
  <AppRadarProvider>
    <ChakraUI>
      <BrowserRouter>
        <AppNavbar />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ChakraUI>
  </AppRadarProvider>
);
