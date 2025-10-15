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
      {/* Name */}
      <h4>{player.name || player.playerName}</h4>

      {/* Position */}
      {player.positionCode && <p><strong>Position:</strong> {player.positionCode}</p>}

      {/* NHL Team */}
      {player.nhlTeam && <p><strong>NHL Team:</strong> {player.nhlTeam}</p>}

      {/* Points */}
      {player.points !== undefined && <p><strong>Points:</strong> {player.points}</p>}

      {/* Team Name */}
      {player.teamName && <p><strong>Team:</strong> {player.teamName}</p>}

      {/* Optional children (like role selector) */}
      {children && <div className="card-children">{children}</div>}
    </div>
  );
};

export default PlayerCard;
