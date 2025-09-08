package com.fantasynhl.server.league;

import com.fantasynhl.server.user.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LeagueService {

    private final LeagueRepository leagueRepository;

    public LeagueService(LeagueRepository leagueRepository) {
        this.leagueRepository = leagueRepository;
    }

    // Create a new league (admin only)
    public League createLeague(String name) {
        League league = new League();
        league.setName(name);
        league.setInviteCode(generateInviteCode());
        league.setMaxTeams(10); // fixed cap
        return leagueRepository.save(league);
    }

    public List<League> getAllLeagues() {
    return leagueRepository.findAll();
    }


    // User joins a league via invite code
    public Team joinLeague(String inviteCode, User user, String teamName) {
        League league = leagueRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("League not found"));

        if (league.getTeams().size() >= league.getMaxTeams()) {
            throw new RuntimeException("League is full");
        }

        Team team = new Team();
        team.setName(teamName);
        team.setOwner(user);

        league.getTeams().add(team);
        return team;
    }

    // Optional: fetch league info
    public Optional<League> getLeague(String inviteCode) {
        return leagueRepository.findByInviteCode(inviteCode);
    }

    // Generate a random 6-character invite code
    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
