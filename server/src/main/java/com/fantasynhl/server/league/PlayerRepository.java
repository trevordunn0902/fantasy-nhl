package com.fantasynhl.server.league;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    // No extra methods for now; basic CRUD is sufficient for v2
}
