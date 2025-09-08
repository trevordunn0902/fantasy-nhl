package com.fantasynhl.server.league;

import java.util.*;

public class League {
    private Long id;
    private String name;
    private String inviteCode; // unique code for joining
    private boolean inviteOnly = true;
    private List<Team> teams = new ArrayList<>();
    private int maxTeams = 10;

    public League() {}

    public League(Long id, String name, String inviteCode) {
        this.id = id;
        this.name = name;
        this.inviteCode = inviteCode;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getInviteCode() { return inviteCode; }
    public void setInviteCode(String inviteCode) { this.inviteCode = inviteCode; }

    public List<Team> getTeams() { return teams; }
    public void setTeams(List<Team> teams) { this.teams = teams; }

    public boolean isInviteOnly() { return inviteOnly; }
    public void setInviteOnly(boolean inviteOnly) { this.inviteOnly = inviteOnly; }

    public int getMaxTeams() { return maxTeams; }
    public void setMaxTeams(int maxTeams) { this.maxTeams = maxTeams; }
}
