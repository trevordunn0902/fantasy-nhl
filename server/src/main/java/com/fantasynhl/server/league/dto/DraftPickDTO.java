package com.fantasynhl.server.league.dto;

public class DraftPickDTO {
    private Long playerId;
    private String playerName;
    private String position;
    private Long teamId;
    private String teamName;
    private int pickOrder;

    public DraftPickDTO() {}

    public DraftPickDTO(Long playerId, String playerName, String position, Long teamId, String teamName, int pickOrder) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.position = position;
        this.teamId = teamId;
        this.teamName = teamName;
        this.pickOrder = pickOrder;
    }

    // Getters / setters
    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public int getPickOrder() { return pickOrder; }
    public void setPickOrder(int pickOrder) { this.pickOrder = pickOrder; }
}
