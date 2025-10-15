import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getDraftStatus, getAvailablePlayers, draftPlayer } from "../api/api";
import DraftBoard from "../components/DraftBoard";
import RosterSidebar from "../components/RosterSidebar";
import "../styles/pages.css";

const Draft = () => {
  const { user } = useContext(AuthContext);
  const { leagueId } = useParams();

  const [draftStatus, setDraftStatus] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDraftStatus = async () => {
    try {
      const status = await getDraftStatus(leagueId);
      setDraftStatus(status);
    } catch (err) {
      console.error("Error fetching draft status:", err);
      setError("Failed to fetch draft status. Make sure you are part of this league.");
    }
  };

  const fetchAvailablePlayersList = async () => {
    try {
      const players = await getAvailablePlayers(leagueId);
      setAvailablePlayers(players);
    } catch (err) {
      console.error("Error fetching available players:", err);
      setError("Failed to fetch available players.");
    }
  };

  const handleDraftPick = async (playerId) => {
    try {
      if (!draftStatus?.teams) return;
      const myTeam = draftStatus.teams.find((t) => t.owner?.id === user.id);
      if (!myTeam) return;

      await draftPlayer(leagueId, myTeam.id, playerId);
      await Promise.all([fetchDraftStatus(), fetchAvailablePlayersList()]);
      setError("");
    } catch (err) {
      console.error("Draft error:", err);
      const message =
        err.message || "Failed to make draft pick. Please ensure you haven't exceeded position limits.";
      setError(message);
      alert(message);
    }
  };

  useEffect(() => {
    if (!leagueId) return;
    setLoading(true);
    Promise.all([fetchDraftStatus(), fetchAvailablePlayersList()]).finally(() =>
      setLoading(false)
    );

    const interval = setInterval(fetchDraftStatus, 5000);
    return () => clearInterval(interval);
  }, [leagueId]);

  if (loading) return <p className="draft-loading">Loading draft...</p>;
  if (!draftStatus || !Array.isArray(draftStatus.teams))
    return <p className="draft-loading">Loading teams...</p>;

  const myTeam = draftStatus.teams.find((t) => t.owner?.id === user.id);
  const myTeamId = myTeam?.id || null;

  return (
    <div className="draft-page">
      <h1 className="page-title mb-4">Draft Board</h1>

      <div className="draft-layout">
        {/* Left side: Draft Board */}
        <div className="draft-board-section">
          <DraftBoard
            draftStatus={draftStatus}
            onDraftPick={handleDraftPick}
            userTeamId={myTeamId}
            availablePlayers={availablePlayers}
          />
        </div>

        {/* Right side: Roster Sidebar */}
        {myTeamId && <RosterSidebar teamId={myTeamId} />}
      </div>

      {/* League Teams (moved below main layout) */}
      <h2 className="section-title mt-6 mb-2">League Teams</h2>
      <div className="card-grid">
        {draftStatus.teams.map((team) => (
          <div key={team.id} className="team-card">
            <h3>{team.teamName}</h3>
            <p>Owner: {team.owner?.email || "Unknown"}</p>
            <Link
              to={`/league/${leagueId}/team/${team.id}`}
              className="btn btn-blue mt-2"
            >
              View Roster
            </Link>
          </div>
        ))}
      </div>

      {error && <p className="error-text mt-4">{error}</p>}
    </div>
  );
};

export default Draft;
