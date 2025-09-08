package com.fantasynhl.server.league;

import com.fantasynhl.server.user.Role;
import com.fantasynhl.server.user.User;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/league")
public class LeagueController {

    private final LeagueService leagueService;

    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @PostMapping("/create")
    public ResponseEntity<League> createLeague(@RequestParam String name) {
        League league = leagueService.createLeague(name);
        return ResponseEntity.ok(league);
    }

    @PostMapping("/join")
    public ResponseEntity<Team> joinLeague(
            @RequestParam String inviteCode,
            @RequestParam String teamName
    ) {
        // Temporary test user
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setRole(Role.USER);

        Team team = leagueService.joinLeague(inviteCode, user, teamName);
        return ResponseEntity.ok(team);
    }

    // Optional: get league info by invite code
    @GetMapping
    public ResponseEntity<League> getLeague(@RequestParam String inviteCode) {
        return leagueService.getLeague(inviteCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // New endpoint: fetch all leagues
    @GetMapping("/all")
    public ResponseEntity<List<League>> getAllLeagues() {
        return ResponseEntity.ok(leagueService.getAllLeagues());
    }
}
