package com.moveinsync.scheduler.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdateManagedUserRequest(

    @NotBlank
    @Pattern(regexp = "ADMIN|OPERATOR|EMPLOYEE")
    String role,

    @NotNull
    Boolean enabled
) {}