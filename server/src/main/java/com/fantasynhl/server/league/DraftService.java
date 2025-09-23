package com.fantasynhl.server.league;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DraftService {

    private final LeagueRepository leagueRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final DraftPickRepository draftPickRepository;

    public DraftService(
            LeagueRepository leagueRepository,
            TeamRepository teamRepository,
            PlayerRepository playerRepository,
            DraftPickRepository draftPickRepository
    ) {
        this.leagueRepository = leagueRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.draftPickRepository = draftPickRepository;
    }

    // Start the draft for a league
    public void startDraft(Long leagueId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found"));

        // Reset draft if already started
        if (league.isDraftStarted()) {
            draftPickRepository.deleteAll(draftPickRepository.findByLeague(league));
            league.setCurrentTurnIndex(0);
        }

        List<Team> teams = new ArrayList<>(league.getTeams());
        if (teams.isEmpty()) {
            throw new RuntimeException("Cannot start draft with no teams");
        }

        Collections.shuffle(teams);
        league.setDraftOrder(teams);
        league.setDraftStarted(true);

        // Persist draft order IDs
        String ids = teams.stream()
                .map(t -> t.getId().toString())
                .collect(Collectors.joining(","));
        league.setDraftOrderIds(ids);

        leagueRepository.save(league);
    }

    // Make a draft pick
    public DraftPick draftPlayer(Long leagueId, Long teamId, Long playerId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found"));

        if (!league.isDraftStarted()) {
            throw new RuntimeException("Draft has not started");
        }

        // Rebuild draftOrder from IDs if needed
        league.reconstructDraftOrder();
        if (league.getDraftOrder() == null || league.getDraftOrder().isEmpty()) {
            throw new RuntimeException("Draft order is empty, cannot pick");
        }

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        // Check if it's the team's turn
        Team currentTeam = league.getDraftOrder().get(league.getCurrentTurnIndex());
        if (!currentTeam.getId().equals(teamId)) {
            throw new RuntimeException("Not your turn to pick");
        }

        // Check if player is already drafted in the league
        boolean drafted = draftPickRepository.existsByLeagueAndPlayer(league, player);
        if (drafted) {
            throw new RuntimeException("Player already drafted in this league");
        }

        // Enforce positional limits per team
        Map<String, Long> positionCount = draftPickRepository.findByLeagueAndTeam(league, team)
                .stream()
                .collect(
                        HashMap::new,
                        (m, p) -> m.put(p.getPosition(), m.getOrDefault(p.getPosition(), 0L) + 1),
                        HashMap::putAll
                );

        switch (player.getPosition()) {
            case "G":
                if (positionCount.getOrDefault("G", 0L) >= 2) {
                    throw new RuntimeException("Cannot draft more than 2 goalies");
                }
                break;
            case "D":
                if (positionCount.getOrDefault("D", 0L) >= 6) {
                    throw new RuntimeException("Cannot draft more than 6 defensemen");
                }
                break;
            case "C":
                if (positionCount.getOrDefault("C", 0L) >= 4) {
                    throw new RuntimeException("Cannot draft more than 4 centers");
                }
                break;
            case "LW":
                if (positionCount.getOrDefault("LW", 0L) >= 4) {
                    throw new RuntimeException("Cannot draft more than 4 left wings");
                }
                break;
            case "RW":
                if (positionCount.getOrDefault("RW", 0L) >= 4) {
                    throw new RuntimeException("Cannot draft more than 4 right wings");
                }
                break;
            default:
                throw new RuntimeException("Unknown player position: " + player.getPosition());
        }

        // Create DraftPick
        DraftPick pick = new DraftPick();
        pick.setLeague(league);
        pick.setTeam(team);
        pick.setPlayer(player);
        pick.setPosition(player.getPosition());
        pick.setPickOrder(league.getCurrentTurnIndex() + 1);
        draftPickRepository.save(pick);

        // Add player to team's roster
        team.getRoster().add(player);
        teamRepository.save(team);

        // Move to next turn
        league.setCurrentTurnIndex((league.getCurrentTurnIndex() + 1) % league.getTeams().size());

        // Persist updated draft order IDs
        String ids = league.getDraftOrder().stream()
                .map(t -> t.getId().toString())
                .collect(Collectors.joining(","));
        league.setDraftOrderIds(ids);

        leagueRepository.save(league);

        return pick;
    }

    // Get available players for draft
    public List<Player> getAvailablePlayers(Long leagueId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found"));

        List<Player> allPlayers = playerRepository.findAll();
        List<Player> draftedPlayers = draftPickRepository.findByLeague(league)
                .stream()
                .map(DraftPick::getPlayer)
                .collect(Collectors.toList());

        allPlayers.removeAll(draftedPlayers);
        return allPlayers;
    }

    // Get team picks
    public List<DraftPick> getTeamPicks(Long leagueId, Long teamId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        return draftPickRepository.findByLeagueAndTeam(league, team);
    }

    // Get draft status
    public Map<String, Object> getLeagueDraftStatus(Long leagueId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found"));

        // Rebuild draftOrder from IDs if null/empty
        league.reconstructDraftOrder();

        Map<String, Object> status = new HashMap<>();
        status.put("draftStarted", league.isDraftStarted());
        if (league.isDraftStarted() && !league.getDraftOrder().isEmpty()) {
            status.put("currentTeam", league.getDraftOrder().get(league.getCurrentTurnIndex()).getName());
        }
        status.put("teams", league.getTeams());

        return status;
    }
}
