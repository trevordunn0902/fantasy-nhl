// src/pages/ViewRoster.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamRoster, assignPlayerRole } from "../api/api";
import PlayerCard from "../components/PlayerCard";
import "../styles/pages.css";

const ViewRoster = () => {
  const { leagueId, teamId } = useParams();
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState({});

  const roleCounts = {
    Captain: Object.values(roles).filter((r) => r === "Captain").length,
    Assistant: Object.values(roles).filter((r) => r === "Assistant").length,
  };

  const captainPlayer = players.find((p) => roles[p.playerId] === "Captain");
  const assistantPlayers = players.filter((p) => roles[p.playerId] === "Assistant");

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const roster = await getTeamRoster(leagueId, teamId);
        setPlayers(roster);
        if (roster.length > 0 && roster[0].teamName) setTeamName(roster[0].teamName);
        const initialRoles = {};
        roster.forEach((p) => (initialRoles[p.playerId] = p.role || "None"));
        setRoles(initialRoles);
      } catch {
        setError("Failed to load roster");
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [leagueId, teamId]);

  const handleRoleChange = async (playerId, newRole) => {
    if (newRole === "Captain" && roleCounts.Captain >= 1) {
      alert("Only 1 Captain allowed.");
      return;
    }
    if (newRole === "Assistant" && roleCounts.Assistant >= 2) {
      alert("Only 2 Assistants allowed.");
      return;
    }
    try {
      await assignPlayerRole(teamId, playerId, newRole.toUpperCase());
      setRoles((prev) => ({ ...prev, [playerId]: newRole }));
    } catch {
      alert("Failed to assign role");
    }
  };

  if (loading) return <p>Loading roster...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="page-container p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">{teamName ? `${teamName} Roster` : "Team Roster"}</h1>
        <Link to={`/draft/${leagueId}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Back to Draft
        </Link>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded shadow-sm">
        <h2 className="section-title mb-2">Role Summary</h2>
        <p><strong>Captain:</strong> {captainPlayer ? captainPlayer.playerName : "None"}</p>
        <p><strong>Assistants:</strong> {assistantPlayers.length ? assistantPlayers.map((p) => p.playerName).join(", ") : "None"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.length ? (
          players.map((player) => (
            <PlayerCard key={player.playerId} player={player}>
              <div className="card-children">
                <label className="block text-sm font-semibold mb-1">Role:</label>
                <select
                  value={roles[player.playerId] || "None"}
                  onChange={(e) => handleRoleChange(player.playerId, e.target.value)}
                  className="border rounded p-1 w-full"
                >
                  <option value="None">None</option>
                  <option value="Captain">Captain</option>
                  <option value="Assistant">Assistant</option>
                </select>
              </div>
            </PlayerCard>
          ))
        ) : (
          <p className="text-gray-500">No players drafted yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewRoster;
