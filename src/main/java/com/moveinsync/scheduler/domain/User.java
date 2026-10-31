
package com.moveinsync.scheduler.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "app_users")
public class User {

    @Id
    private UUID id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(nullable = false, length = 160)
private String name;

@Column(length = 254)
private String email;

    @Column(name = "tenant_id", nullable = false, length = 100)
    private String tenantId;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected User() {
    }

 public User(
    UUID id,
    String name,
    String email,
    String username,
    String passwordHash,
    String role,
    String tenantId
) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
    this.tenantId = tenantId;
    this.enabled = true;
    this.createdAt = Instant.now();
}

    public UUID getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getRole() {
        return role;
    }

    public String getTenantId() {
        return tenantId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getName() {
    return name;
}

public String getEmail() {
    return email;
}

public void setRole(String role) {
    this.role = role;
}

public void setEnabled(boolean enabled) {
    this.enabled = enabled;
}
}
