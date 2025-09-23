package com.fantasynhl.server.league.dto;

import com.fantasynhl.server.league.Team;
import java.util.List;
import java.util.stream.Collectors;

public class TeamDTO {
    private Long id;
    private String name;
    private UserDTO owner;
    private LeagueDTO league;
    private List<PlayerDTO> roster;

    public TeamDTO(Team team) {
        this(team, true);
    }

    // Constructor with flag to prevent infinite loop
    public TeamDTO(Team team, boolean includeLeague) {
        this.id = team.getId();
        this.name = team.getName();
        this.owner = new UserDTO(team.getOwner());

        if (includeLeague && team.getLeague() != null) {
            this.league = new LeagueDTO(team.getLeague(), false);
        }

        this.roster = team.getRoster().stream()
                          .map(PlayerDTO::new)
                          .collect(Collectors.toList());
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public UserDTO getOwner() { return owner; }
    public LeagueDTO getLeague() { return league; }
    public List<PlayerDTO> getRoster() { return roster; }
}
