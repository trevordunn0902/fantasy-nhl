package com.fantasynhl.server.user;

import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class UserRepository {

    // In-memory storage for users
    private final Map<String, User> usersByEmail = new HashMap<>();
    private Long idCounter = 1L;

    // Save a new user
    public User save(User user) {
        user.setId(idCounter++);
        usersByEmail.put(user.getEmail(), user);
        return user;
    }

    // Find a user by email
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email));
    }
}
