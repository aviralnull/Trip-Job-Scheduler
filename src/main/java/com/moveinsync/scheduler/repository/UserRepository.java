package com.moveinsync.scheduler.repository;

import com.moveinsync.scheduler.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findAllByTenantIdOrderByCreatedAtDesc(String tenantId);

    Optional<User> findByIdAndTenantId(UUID id, String tenantId);

    @org.springframework.data.jpa.repository.Modifying
@org.springframework.data.jpa.repository.Query(
    "UPDATE User u SET u.role = :role WHERE LOWER(u.username) = LOWER(:username)"
)
int updateRoleByUsername(
    @org.springframework.data.repository.query.Param("username") String username,
    @org.springframework.data.repository.query.Param("role") String role
);
  long countByRoleAndEnabledTrue(String role);

}