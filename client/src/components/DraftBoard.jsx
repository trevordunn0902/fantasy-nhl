// src/components/DraftBoard.jsx
import React, { useEffect, useState, useContext } from "react";
import PlayerCard from "./PlayerCard";
import { AuthContext } from "../context/AuthContext";
import { getAvailablePlayers, getDraftStatus } from "../api/api";
import "../styles/pages.css";

const DraftBoard = ({ leagueId, draftStatus, onDraftPick, userTeamId }) => {
  const { user } = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPlayers = async () => {
    try {
      const res = await getAvailablePlayers(leagueId);
      // Ensure positionCode is available and consistent
      const uniquePlayers = Array.from(new Map(res.map((p) => [p.playerId, p])).values());
      setPlayers(uniquePlayers);
      setFilteredPlayers(uniquePlayers);
    } catch (err) {
      setError("Failed to fetch players.");
    }
  };

  const fetchDraftStatus = async () => {
    try {
      await getDraftStatus(leagueId); // ✅ Fixed function name
    } catch (err) {
      setError("Failed to fetch draft status.");
    }
  };

  const handleDraft = async (playerId) => {
    if (!draftStatus?.draftStarted || draftStatus.currentTeamId !== userTeamId) return;
    try {
      setLoading(true);
      await onDraftPick(playerId);
    } catch (err) {
      setError(err.message || "Draft error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterPlayers(term, positionFilter);
  };

  const handlePositionChange = (e) => {
    const pos = e.target.value;
    setPositionFilter(pos);
    filterPlayers(searchTerm, pos);
  };

  const filterPlayers = (searchTerm, position) => {
    let filtered = [...players];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.playerName.toLowerCase().includes(searchTerm)
      );
    }

    if (position !== "All") {
      // Map frontend selection (LW/RW) to backend codes (L/R)
      let positionCode = position;
      if (position === "LW") positionCode = "L";
      if (position === "RW") positionCode = "R";

      filtered = filtered.filter((p) => p.positionCode === positionCode);
    }

    filtered.sort((a, b) => {
      const pickA = a.pickOrder || 0;
      const pickB = b.pickOrder || 0;
      if (pickA === 0 && pickB === 0) return 0;
      if (pickA === 0) return 1;
      if (pickB === 0) return -1;
      return pickA - pickB;
    });

    setFilteredPlayers(filtered);
  };

  useEffect(() => {
    if (!leagueId) return;
    fetchPlayers();

    const interval = setInterval(fetchDraftStatus, 5000);
    return () => clearInterval(interval);
  }, [leagueId]);

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-3">
        {error}
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Draft Board</h2>

      {draftStatus?.draftStarted ? (
        <p className="mb-4">
          Current Turn: {draftStatus.currentTeamId || "Loading..."}{" "}
          {draftStatus.currentTeamId === userTeamId && (
            <span className="text-green-600 font-semibold"> (Your Turn!)</span>
          )}
        </p>
      ) : (
        <p className="text-gray-500 mb-4">Draft has not started yet.</p>
      )}

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search player..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded p-2 w-full md:w-1/2"
        />
        <select
          value={positionFilter}
          onChange={handlePositionChange}
          className="border rounded p-2 w-full md:w-1/4"
        >
          <option value="All">All Positions</option>
          <option value="C">C</option>
          <option value="LW">LW</option>
          <option value="RW">RW</option>
          <option value="D">D</option>
          <option value="G">G</option>
        </select>
      </div>

      {/* Player grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPlayers.map((player) => {
          const drafted = player.pickOrder > 0;
          const isMyTeam = player.teamId === userTeamId;
          return (
            <PlayerCard
              key={player.playerId}
              player={player}
              drafted={drafted}
              isMyTeam={isMyTeam}
            >
              <button
                onClick={() => handleDraft(player.playerId)}
                disabled={
                  !draftStatus?.draftStarted ||
                  draftStatus.currentTeamId !== userTeamId ||
                  drafted
                }
                className={`mt-2 w-full px-2 py-1 rounded text-white font-semibold transition ${
                  !drafted && draftStatus?.currentTeamId === userTeamId
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {drafted ? `Drafted (#${player.pickOrder})` : "Draft"}
              </button>
            </PlayerCard>
          );
        })}
      </div>

      {loading && <p className="mt-2">Processing draft...</p>}
    </div>
  );
};

export default DraftBoard;
