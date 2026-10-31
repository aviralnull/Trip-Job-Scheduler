package com.moveinsync.scheduler.api;
import com.moveinsync.scheduler.api.dto.*;
import com.moveinsync.scheduler.domain.JobStatus;
import com.moveinsync.scheduler.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/v1/jobs")
public class JobController {
 private final JobService service;
 public JobController(JobService service){this.service=service;}
 private String tenant(){return Optional.ofNullable(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication())
   .map(a->a.getName()).orElse("demo-tenant");}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public JobResponse create(@Valid @RequestBody CreateJobRequest request){return service.create(tenant(),request);}
 @GetMapping public List<JobResponse> list(){return service.list(tenant());}
 @GetMapping("/{id}") public JobResponse get(@PathVariable UUID id){return service.get(tenant(),id);}
 @PostMapping("/tenant/pause") @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')") public Map<String,String> pause(){service.tenantStatus(tenant(),JobStatus.PAUSED);return Map.of("status","paused");}
 @PostMapping("/tenant/resume") @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')") public Map<String,String> resume(){service.tenantStatus(tenant(),JobStatus.ACTIVE);return Map.of("status","active");}


 @PostMapping("/{id}/pause")
@PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
public Map<String, String> pauseJob(@PathVariable UUID id) {
    service.pauseJob(tenant(), id);
    return Map.of("status", "paused", "message", "Job paused successfully");
}

@PostMapping("/{id}/resume")
@PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
public Map<String, String> resumeJob(@PathVariable UUID id) {
    service.resumeJob(tenant(), id);
    return Map.of("status", "active", "message", "Job resumed successfully");
}
}
