import React, { useState } from "react";
import axios from "axios";
import "./JoinLeague.css";

const JoinLeague = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("Please login first.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8080/api/league/join?inviteCode=${inviteCode}&teamName=${teamName}`,
        user
      );
      setMessage(`Joined league! Your team: ${res.data.name}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to join league. Check invite code or team name.");
    }
  };

  return (
    <div>
      <h2>Join League</h2>
      <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        /><br/>
        <input
          type="text"
          placeholder="Your Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        /><br/>
        <button type="submit">Join League</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JoinLeague;
