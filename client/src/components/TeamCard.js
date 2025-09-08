import React from "react";

const TeamCard = ({ team }) => (
  <div className="team-card" style={{border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "6px"}}>
    <h4>{team.name}</h4>
    <p>Owner: {team.owner?.email || "N/A"}</p>
    <p>Players: {team.roster.length}</p>
  </div>
);

export default TeamCard;
