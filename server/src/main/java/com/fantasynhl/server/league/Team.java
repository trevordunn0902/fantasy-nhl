package com.fantasynhl.server.league;

import com.fantasynhl.server.user.User;
import java.util.ArrayList;
import java.util.List;

public class Team {
    private Long id;
    private String name;
    private User owner; // user who owns this team
    private List<String> roster = new ArrayList<>(); // for now, just player names

    public Team() {}

    public Team(Long id, String name, User owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public List<String> getRoster() { return roster; }
    public void setRoster(List<String> roster) { this.roster = roster; }
}
