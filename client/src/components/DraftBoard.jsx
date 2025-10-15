import React from "react";
import PlayerCard from "./PlayerCard";

const DraftBoard = ({ draftStatus, onDraftPick, userTeamId, availablePlayers }) => {
  if (!draftStatus) return null;

  return (
    <div className="draft-board">
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availablePlayers.map((player) => {
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
                onClick={() => onDraftPick(player.playerId)}
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
    </div>
  );
};

export default DraftBoard;
