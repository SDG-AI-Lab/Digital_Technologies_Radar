import React from "react";
import { Routes, Route } from "react-router-dom";

import { AppNavbar } from "../components";
import { MainLayout } from "../ui/MainLayout";
import { About } from "../pages/about/About";
import { NotFound404, Radar, Search } from "../pages";
import { ROUTES } from "./routes";
import { BlipView, QuadrantView, RadarView } from "../pages/views";

// import { ROUTES } from "../routes";
// import { BlipView, QuadrantView, RadarView } from "../pages/views";

export const NavApp = () => {
  // let navigate = useNavigate();
  return (
    <>
      <AppNavbar />
      <MainLayout>
        <Routes>
          <Route path={ROUTES.RADAR} element={<Radar />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />

          <Route path={ROUTES.QUADRANT_PARAM} element={<QuadrantView />} />
          <Route path={ROUTES.BLIP_PARAM} element={<BlipView />} />
          <Route path={ROUTES.RADAR} element={<RadarView />} />
          {/* 

          <Route path="/">
            <>{navigate("/radar")}</>
          </Route> */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </MainLayout>
    </>
  );
};
