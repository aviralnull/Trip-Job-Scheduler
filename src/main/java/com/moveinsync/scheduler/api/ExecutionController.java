package com.moveinsync.scheduler.api;

import com.moveinsync.scheduler.api.dto.ExecutionResponse;
import com.moveinsync.scheduler.domain.JobRun;
import com.moveinsync.scheduler.repository.JobRunRepository;
import com.moveinsync.scheduler.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/executions")
public class ExecutionController {

    private final JobRunRepository jobRunRepository;
    private final UserRepository userRepository;

    public ExecutionController(
        JobRunRepository jobRunRepository,
        UserRepository userRepository
    ) {
        this.jobRunRepository = jobRunRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<ExecutionResponse> getExecutions() {

        String username = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

        String tenantId = userRepository
            .findByUsernameIgnoreCase(username)
            .orElseThrow(() ->
                new IllegalStateException("Authenticated user not found")
            )
            .getTenantId();

        return jobRunRepository
            .findTop100ByTenantIdOrderByCreatedAtDesc(tenantId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    private ExecutionResponse toResponse(JobRun run) {
        return new ExecutionResponse(
            run.getId(),
            run.getJobId(),
            run.getStatus(),
            run.getAttempts(),
            run.getScheduledAt(),
            run.getStartedAt(),
            run.getFinishedAt(),
            run.getLastError()
        );
    }
}