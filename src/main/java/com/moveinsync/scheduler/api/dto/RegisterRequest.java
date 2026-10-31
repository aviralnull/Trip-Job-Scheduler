
package com.moveinsync.scheduler.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank
    @Size(min = 2, max = 160)
    String name,

    @NotBlank
    @Email
    @Size(max = 254)
    String email,

    @NotBlank
    @Size(min = 3, max = 100)
    String username,

    @NotBlank
    @Size(min = 8, max = 72)
    String password
) {}
