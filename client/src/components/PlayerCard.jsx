import React from "react";
import "../styles/pages.css";

const PlayerCard = ({ player, drafted, isMyTeam, children, showPoints = true }) => {
  return (
    <div
      className={`player-card 
        ${drafted ? "drafted" : ""} 
        ${isMyTeam && drafted ? "my-team" : ""}`}
    >
      {/* Name */}
      <h4>{player.playerName || player.name}</h4>

      {/* Optional children (like position/NHL team or buttons) */}
      {children && <div className="card-children">{children}</div>}

      {/* Points */}
      {showPoints && player.points !== undefined && (
        <p><strong>Points:</strong> {player.points}</p>
      )}
    </div>
  );
};

export default PlayerCard;
