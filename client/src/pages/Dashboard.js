import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeagueCard from "../components/LeagueCard";
import TeamCard from "../components/TeamCard";
import "./Dashboard.css";

const Dashboard = () => {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  if (!user) {
    setError("Please log in to view your dashboard.");
    setLoading(false);
    return;
  }

  // Fetch all leagues from backend
  axios.get("http://localhost:8080/api/league/all")
    .then(res => {
      // Filter leagues where the user owns a team
      const userLeagues = res.data.filter(league =>
        league.teams.some(team => team.owner.id === user.id)
      );

      setLeagues(userLeagues);

      // Extract all teams owned by this user across leagues
      const userTeams = [];
      userLeagues.forEach(league => {
        league.teams.forEach(team => {
          if (team.owner.id === user.id) {
            userTeams.push(team);
          }
        });
      });

      setTeams(userTeams);

      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to fetch leagues.");
      setLoading(false);
    });
}, [user]);

  const handleView = (inviteCode) => {
    navigate(`/league/${inviteCode}`);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {loading && <p>Loading leagues...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && leagues.length === 0 && (
        <p>You are not part of any leagues yet.</p>
      )}

      {!loading && leagues.length > 0 && (
        <div>
          <h3>Your Leagues</h3>
          {leagues.map(league => (
            <LeagueCard
              key={league.id}
              league={league}
              onView={() => handleView(league.inviteCode)}
            />
          ))}

          <h3 style={{ marginTop: "20px" }}>Your Teams</h3>
          {teams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/create-league")}>Create League</button>
        <button onClick={() => navigate("/join-league")}>Join League</button>
      </div>
    </div>
  );
};

export default Dashboard;
