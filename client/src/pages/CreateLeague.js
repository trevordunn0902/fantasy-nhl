import React, { useState } from "react";
import axios from "axios";
import "./CreateLeague.css";

const CreateLeague = () => {
  const [name, setName] = useState("");
  const [league, setLeague] = useState(null);
  const [teamName, setTeamName] = useState(""); // Added for user's team
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Please login first.");
      return;
    }

    if (!teamName.trim()) {
      setError("Please provide a team name.");
      return;
    }

    try {
      // 1. Create league
      const leagueRes = await axios.post(
        `http://localhost:8080/api/league/create?name=${name}`
      );
      const createdLeague = leagueRes.data;

      // 2. Automatically create first team for the logged-in user
      const teamRes = await axios.post(
        `http://localhost:8080/api/league/join?inviteCode=${createdLeague.inviteCode}&teamName=${teamName}`,
        user
      );

      setLeague({
        ...createdLeague,
        firstTeam: teamRes.data
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create league.");
    }
  };

  return (
    <div>
      <h2>Create League</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="League Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br/>
        <input
          type="text"
          placeholder="Your Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        /><br/>
        <button type="submit">Create League</button>
      </form>
      {league && (
        <div>
          <p>League created! Invite Code: {league.inviteCode}</p>
          <p>Your team "{league.firstTeam.name}" has been added to the league.</p>
        </div>
      )}
      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  );
};

export default CreateLeague;
