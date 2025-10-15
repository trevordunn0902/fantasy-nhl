// src/components/PlayerCard.jsx
import React from "react";
import "../styles/pages.css";

const PlayerCard = ({ player, drafted, isMyTeam, children }) => {
  return (
    <div
      className={`player-card 
        ${drafted ? "drafted" : ""} 
        ${isMyTeam && drafted ? "my-team" : ""}`}
    >
      <h4>{player.playerName}</h4>
      <p>Position: {player.positionCode}</p>
      {player.teamName && <p>Team: {player.teamName}</p>}
      {player.pickOrder > 0 && <p>Pick Order: {player.pickOrder}</p>}
      {children && <div className="card-children">{children}</div>}
    </div>
  );
};

export default PlayerCard;
