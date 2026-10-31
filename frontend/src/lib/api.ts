
import type {
  CreateJobRequest,
  Job,
  Execution,
  CurrentUser,
  ManagedUser,
} from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed: ${response.status}`);
  }

  return data as T;
}

export const schedulerApi = {
  getJobs: () => request<Job[]>("/api/jobs"),

  createJob: (body: CreateJobRequest) =>
    request<Job>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  pauseTenant: () =>
    request<{ status: string }>("/api/tenant/pause", {
      method: "POST",
    }),

  resumeTenant: () =>
    request<{ status: string }>("/api/tenant/resume", {
      method: "POST",
    }),
    getExecutions: () => request<Execution[]>("/api/executions"),

getCurrentUser: () => request<CurrentUser>("/api/auth/me"),


getUsers: () => request<ManagedUser[]>("/api/admin/users"),

updateUser: (
  id: string,
  role: ManagedUser["role"],
  enabled: boolean
) =>
  request<ManagedUser>(`/api/admin/users`, {
    method: "PATCH",
    body: JSON.stringify({ id, role, enabled }),
  }),
};