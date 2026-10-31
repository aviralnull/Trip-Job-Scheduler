export type JobStatus =
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";
export type JobType = "ONE_OFF" | "CRON";

export interface Job {
  id: string;
  name: string;
  type: JobType;
  status: JobStatus;
  nextFireAt: string | null;
  partitionId: number;
}

export interface CreateJobRequest {
  name: string;
  type: JobType;
  cronExpression: string | null;
  payload: string;
  zoneId: string;
  fireAt: string | null;
  priority: number;
  maxRuntimeSeconds: number;
 misfirePolicy: MisfirePolicy;
}

export type UpdateJobRequest = CreateJobRequest;
export interface Execution {
  id: string;
  jobId: string;
  status: string;
  attempts: number;
  scheduledAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  lastError: string | null;
}

export interface CurrentUser {
  username: string;
  role: "ADMIN" | "OPERATOR" | "EMPLOYEE";
  tenantId: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string | null;
  username: string;
  role: "ADMIN" | "OPERATOR" | "EMPLOYEE";
  enabled: boolean;
  createdAt: string;
}
export type MisfirePolicy = "FIRE_NOW" | "SKIP" | "COALESCE";