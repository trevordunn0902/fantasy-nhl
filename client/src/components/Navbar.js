import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // basic styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Fantasy NHL</h1>
      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/create-league">Create League</Link></li>
        <li><Link to="/join-league">Join League</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
