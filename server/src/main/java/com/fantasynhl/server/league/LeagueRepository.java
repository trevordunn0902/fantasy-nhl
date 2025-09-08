package com.fantasynhl.server.league;

import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class LeagueRepository {

    private final Map<Long, League> leaguesById = new HashMap<>();
    private final Map<String, League> leaguesByInviteCode = new HashMap<>();
    private Long idCounter = 1L;

    // Save a new league
    public League save(League league) {
        league.setId(idCounter++);
        leaguesById.put(league.getId(), league);
        leaguesByInviteCode.put(league.getInviteCode(), league);
        return league;
    }

    // Find a league by ID
    public Optional<League> findById(Long id) {
        return Optional.ofNullable(leaguesById.get(id));
    }

    // Find a league by invite code
    public Optional<League> findByInviteCode(String inviteCode) {
        return Optional.ofNullable(leaguesByInviteCode.get(inviteCode));
    }

    // Return all leagues
    public List<League> findAll() {
        return new ArrayList<>(leaguesById.values());
    }
}
