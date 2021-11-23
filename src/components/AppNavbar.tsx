import React from "react";
import { Link } from "react-router-dom";

export const AppNavbar: React.FC = () => (
  <>
    <h2>Welcome to React Router Tutorial</h2>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav mr-auto">
        <li>
          <Link to={"/"} className="nav-link">
            {" "}
            Home{" "}
          </Link>
        </li>
        <li>
          <Link to={"/about"} className="nav-link">
            About
          </Link>
        </li>
        <li>
          <Link to={"/search"} className="nav-link">
            Search
          </Link>
        </li>
      </ul>
    </nav>
    <hr />
  </>
);
