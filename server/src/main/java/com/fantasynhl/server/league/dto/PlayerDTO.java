package com.fantasynhl.server.league.dto;

import com.fantasynhl.server.league.Player;

public class PlayerDTO {
    private Long id;
    private String name;
    private String position;
    private String nhlTeam;

    public PlayerDTO(Player player) {
        this.id = player.getId();
        this.name = player.getName();
        this.position = player.getPosition();
        this.nhlTeam = player.getNhlTeam();
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPosition() { return position; }
    public String getNhlTeam() { return nhlTeam; }
}
