package com.fantasynhl.server.league;

import com.fantasynhl.server.league.dto.DraftPickDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/draft")
public class DraftController {

    private final DraftService draftService;

    public DraftController(DraftService draftService) {
        this.draftService = draftService;
    }

    // Start draft
    @PostMapping("/start")
    public ResponseEntity<String> startDraft(@RequestParam Long leagueId) {
        try {
            draftService.startDraft(leagueId);
            return ResponseEntity.ok("Draft started");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get available players for a league (not yet drafted in this league)
    @GetMapping("/available")
    public ResponseEntity<List<DraftPickDTO>> getAvailablePlayers(@RequestParam Long leagueId) {
        try {
            List<Player> players = draftService.getAvailablePlayers(leagueId);
            List<DraftPickDTO> playerDTOs = players.stream()
                    .map(p -> new DraftPickDTO(
                            p.getId(),
                            p.getName(),
                            p.getPosition(),
                            null,
                            null,
                            0))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(playerDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Draft a player
    @PostMapping("/pick")
    public ResponseEntity<?> draftPlayer(
            @RequestParam Long leagueId,
            @RequestParam Long teamId,
            @RequestParam Long playerId
    ) {
        try {
            DraftPick pick = draftService.draftPlayer(leagueId, teamId, playerId);
            DraftPickDTO dto = new DraftPickDTO(
                    pick.getPlayer().getId(),
                    pick.getPlayer().getName(),
                    pick.getPlayer().getPosition(),
                    pick.getTeam().getId(),
                    pick.getTeam().getName(),
                    pick.getPickOrder()
            );
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get team roster for a league
    @GetMapping("/team")
    public ResponseEntity<?> getTeamRoster(
            @RequestParam Long leagueId,
            @RequestParam Long teamId
    ) {
        try {
            List<DraftPick> roster = draftService.getTeamPicks(leagueId, teamId);
            List<DraftPickDTO> rosterDTOs = roster.stream()
                    .map(p -> new DraftPickDTO(
                            p.getPlayer().getId(),
                            p.getPlayer().getName(),
                            p.getPlayer().getPosition(),
                            p.getTeam().getId(),
                            p.getTeam().getName(),
                            p.getPickOrder()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(rosterDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get league draft status
    @GetMapping("/status")
    public ResponseEntity<?> getLeagueDraftStatus(@RequestParam Long leagueId) {
        try {
            return ResponseEntity.ok(draftService.getLeagueDraftStatus(leagueId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
