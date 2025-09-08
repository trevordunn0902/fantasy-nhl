import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./LeagueDetails.css";

const LeagueDetails = () => {
  const { inviteCode } = useParams();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/league?inviteCode=${inviteCode}`)
      .then(res => {
        setLeague(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch league details.");
        setLoading(false);
      });
  }, [inviteCode]);

  if (loading) return <p>Loading league details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!league) return <p>League not found.</p>;

  return (
    <div>
      <h2>League: {league.name}</h2>
      <p>Invite Code: {league.inviteCode}</p>
      <p>Invite Only: {league.inviteOnly ? "Yes" : "No"}</p>
      <p>Max Teams: {league.maxTeams}</p>

      <h3>Teams</h3>
      {league.teams.length === 0 && <p>No teams have joined this league yet.</p>}
      <ul>
        {league.teams.map(team => (
          <li key={team.id}>
            <strong>{team.name}</strong> (Owner: {team.owner.email})
            {team.roster.length > 0 && (
              <ul>
                {team.roster.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeagueDetails;
