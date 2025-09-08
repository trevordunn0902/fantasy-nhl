import React from "react";

const LeagueCard = ({ league, onView }) => (
  <div className="league-card" style={{border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "6px"}}>
    <h4>{league.name}</h4>
    <p>Invite Code: {league.inviteCode}</p>
    <p>Teams: {league.teams.length}/{league.maxTeams}</p>
    <button onClick={onView}>View</button>
  </div>
);

export default LeagueCard;
