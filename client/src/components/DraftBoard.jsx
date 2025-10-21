import React from "react";
import PlayerCard from "./PlayerCard";

// NHL teams mapping (abbrev → name)
const NHL_TEAMS = [
  { abbrev: "ANA", name: "Anaheim Ducks" },
  { abbrev: "BOS", name: "Boston Bruins" },
  { abbrev: "BUF", name: "Buffalo Sabres" },
  { abbrev: "CAR", name: "Carolina Hurricanes" },
  { abbrev: "CBJ", name: "Columbus Blue Jackets" },
  { abbrev: "CGY", name: "Calgary Flames" },
  { abbrev: "CHI", name: "Chicago Black Hawks" },
  { abbrev: "COL", name: "Colorado Avalanche" },
  { abbrev: "DAL", name: "Dallas Stars" },
  { abbrev: "DET", name: "Detroit Red Wings" },
  { abbrev: "EDM", name: "Edmonton Oilers" },
  { abbrev: "FLA", name: "Florida Panthers" },
  { abbrev: "LAK", name: "Los Angeles Kings" },
  { abbrev: "MIN", name: "Minnesota Wild" },
  { abbrev: "MTL", name: "Montreal Canadiens" },
  { abbrev: "NJD", name: "New Jersey Devils" },
  { abbrev: "NSH", name: "Nashville Predators" },
  { abbrev: "NYI", name: "New York Islanders" },
  { abbrev: "NYR", name: "New York Rangers" },
  { abbrev: "OTT", name: "Ottawa Senators" },
  { abbrev: "PHI", name: "Philadelphia Flyers" },
  { abbrev: "PIT", name: "Pittsburgh Penguins" },
  { abbrev: "SEA", name: "Seattle Kraken" },
  { abbrev: "SJS", name: "San Jose Sharks" },
  { abbrev: "STL", name: "St. Louis Blues" },
  { abbrev: "TBL", name: "Tampa Bay Lightning" },
  { abbrev: "TOR", name: "Toronto Maple Leafs" },
  { abbrev: "UTA", name: "Utah Mammoth" },
  { abbrev: "VAN", name: "Vancouver Canucks" },
  { abbrev: "VGK", name: "Vegas Golden Knights" },
  { abbrev: "WPG", name: "Winnipeg Jets" },
  { abbrev: "WSH", name: "Washington Capitals" },
];

const DraftBoard = ({ draftStatus, onDraftPick, userTeamId, availablePlayers }) => {
  if (!draftStatus) return null;

  const currentTeam = draftStatus.teams.find(
    (team) => team.id === draftStatus.currentTeamId
  );

  return (
    <div className="draft-board">
      {draftStatus?.started ? (
        <p
          className={`current-turn mb-4 ${
            draftStatus.currentTeamId === userTeamId ? "turn-highlight" : ""
          }`}
        >
          Current Turn: {currentTeam ? currentTeam.name : "Loading..."}{" "}
          {draftStatus.currentTeamId === userTeamId && (
            <span className="your-turn-text">(Your Turn!)</span>
          )}
        </p>
      ) : (
        <p className="text-gray-500 mb-4">Draft has not started yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availablePlayers.length === 0 ? (
          <p className="text-gray-400">
            No players match the current filter/search.
          </p>
        ) : (
          availablePlayers.map((player) => {
            const drafted = player.pickOrder > 0;
            const isMyTeam = player.teamId === userTeamId;

            // Use nhlTeam from API if available; fallback to abbreviation mapping
            const nhlTeam =
              player.nhlTeam ||
              (player.teamName
                ? NHL_TEAMS.find((t) => t.name === player.teamName)?.abbrev || "Unknown"
                : "Unknown");

            return (
              <PlayerCard
                key={player.playerId}
                player={{ ...player, nhlTeam }}
                drafted={drafted}
                isMyTeam={isMyTeam}
                showPoints={false} // hide points in draft
              >
                <div className="player-info mb-2 text-sm text-gray-600">
                  {player.positionCode && <span>Position: {player.positionCode}</span>}
                  {nhlTeam && <span> | Team: {nhlTeam}</span>}
                </div>
                <button
                  onClick={() => onDraftPick(player)}
                  disabled={
                    !draftStatus?.started ||
                    draftStatus.currentTeamId !== userTeamId ||
                    drafted
                  }
                  className={`mt-2 w-full px-2 py-1 rounded text-white font-semibold transition ${
                    !drafted && draftStatus.currentTeamId === userTeamId
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {drafted ? `Drafted (#${player.pickOrder})` : "Draft"}
                </button>
              </PlayerCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DraftBoard;
