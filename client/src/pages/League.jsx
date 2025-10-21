// src/pages/League.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeagueByInviteCode, startDraft, getDraftStatus } from "../api/api";
import TeamCard from "../components/TeamCard";
import { AuthContext } from "../context/AuthContext";
import "../styles/pages.css";

const League = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [league, setLeague] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftStarted, setDraftStarted] = useState(false);

  const fetchLeague = async () => {
    try {
      const res = await getLeagueByInviteCode(inviteCode);
      setLeague(res);
      const draftStatus = await getDraftStatus(res.id);
      setDraftStarted(Boolean(draftStatus?.started));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch league");
    }
  };

  useEffect(() => {
    if (inviteCode) fetchLeague();
  }, [inviteCode]);

  const handleStartDraft = async () => {
    if (!league || draftStarted) return;
    const isMember = league.teams.some((t) => t.owner.id === user?.id);
    if (!isMember) {
      setError("Only members can start draft");
      return;
    }
    setLoading(true);
    try {
      await startDraft(league.id);
      await fetchLeague(); // refresh state
      navigate(`/draft/${league.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to start draft");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="error-text p-4">{error}</p>;
  if (!league) return <p className="p-4">Loading...</p>;

  const isMember = league.teams.some((t) => t.owner.id === user?.id);

  return (
    <div className="page-container p-4">
      <h1 className="page-title">{league.name}</h1>
      <p>
        Invite Code: <span>{league.inviteCode}</span>
      </p>

      <h2 className="section-title">Teams</h2>
      <div className="card-grid">
        {league.teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          className={`px-4 py-2 rounded-md text-white ${
            !isMember || draftStarted || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={!isMember || draftStarted || loading}
          onClick={handleStartDraft}
        >
          {loading
            ? "Starting..."
            : draftStarted
            ? "Draft Started"
            : "Start Draft"}
        </button>

        <button
          className={`px-4 py-2 rounded-md text-white ${
            !isMember
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={!isMember}
          onClick={() => navigate(`/draft/${league.id}`)}
        >
          View Draft
        </button>
      </div>

      {draftStarted && (
        <p className="text-sm text-gray-500 mt-2">
          Draft has already started for this league.
        </p>
      )}

      {!isMember && (
        <p className="error-text mt-2">
          You must be a member to view or start the draft.
        </p>
      )}
    </div>
  );
};

export default League;
