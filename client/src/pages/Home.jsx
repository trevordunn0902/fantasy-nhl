// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import LeagueCard from "../components/LeagueCard";
import { AuthContext } from "../context/AuthContext";
import { getAllLeagues } from "../api/api";
import "../styles/pages.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await getAllLeagues();

        console.log("API response for leagues:", res); // <-- Log API response

        // Check if response is an array or wrapped in an object
        if (Array.isArray(res)) {
          setLeagues(res);
        } else if (res && Array.isArray(res.leagues)) {
          setLeagues(res.leagues);
        } else {
          setLeagues([]);
          console.warn("Unexpected API response format:", res);
        }
      } catch (err) {
        console.error("Error fetching leagues:", err);
        setError("Failed to fetch leagues");
      }
    };
    fetchLeagues();
  }, []);

  return (
    <div className="page-container p-4">
      <h1 className="page-title">Welcome {user ? user.email : "Guest"}</h1>

      {error && <p className="error-text">{error}</p>}

      <div className="card-grid">
        {leagues.map((league) => (
          <LeagueCard key={league.id} league={league} />
        ))}
      </div>
    </div>
  );
};

export default Home;
