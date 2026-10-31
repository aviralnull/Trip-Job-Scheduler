
// "use client";

// import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
// import {
//   Activity,
//   CalendarClock,
//   CheckCircle2,
//   CircleAlert,
//   Clock3,
//   LayoutDashboard,
//   ListChecks,
//   Menu,
//   Pause,
//   Play,
//   Plus,
//   RefreshCw,
//   Search,
//   Settings,
//   ShieldCheck,
//   X,
//   Zap,
//   SlidersHorizontal,
//   UserCircle,
//   History,
//   LucideIcon
// } from "lucide-react";
// import {
 
//   Users,
// } from "lucide-react";
// import UserManagement from "@/components/admin/UserManagement";

// import { schedulerApi } from "@/lib/api";
// import type {
//   CreateJobRequest,
//   Job,
//   JobType,
//   Execution,
//   CurrentUser,
// } from "@/lib/types";

// import {
//   EmptyState,
//   MetricCard,
//   PageHeading,
//   StatusBadge,
// } from "@/components/ui";

// import SignOutButton from "@/components/SignOutButton";

// type Section = "Dashboard" | "Jobs" | "Executions" | "Settings" | "Users";


// function formatDate(value: string | null | undefined) {
//   if (!value) return "N/A";

//   const date = new Date(value);
//   return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
// }

// function executionStyle(status: string) {
//   switch (status.toUpperCase()) {
//     case "SUCCEEDED":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     case "RUNNING":
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     case "RETRYING":
//       return "bg-amber-50 text-amber-700 border-amber-200";
//     case "FAILED":
//     case "DEAD":
//     case "DEAD_LETTER":
//       return "bg-rose-50 text-rose-700 border-rose-200";
//     default:
//       return "bg-slate-100 text-slate-600 border-slate-200";
//   }
// }

// function JobTable({
//   jobs,
//   onRefresh,
// }: {
//   jobs: Job[];
//   onRefresh: () => void;
// }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[700px] text-left">
//         <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
//           <tr>
//             {["Job", "Type", "Status", "Next execution", "Job ID"].map((heading) => (
//               <th key={heading} className="px-5 py-4 font-semibold">
//                 {heading}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-slate-100">
//           {jobs.map((job) => (
//             <tr key={job.id} className="transition hover:bg-slate-50">
//               <td className="px-5 py-4">
//                 <p className="text-sm font-semibold text-slate-800">{job.name}</p>
//                 <p className="mt-1 text-xs text-slate-400">
//                   {job.type === "CRON" ? "Recurring schedule" : "One-time schedule"}
//                 </p>
//               </td>

//               <td className="px-5 py-4">
//                 <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs">
//                   {job.type}
//                 </span>
//               </td>

//               <td className="px-5 py-4">
//                 <StatusBadge status={job.status} />
//               </td>

//               <td className="px-5 py-4 text-xs text-slate-600">
//                 {formatDate(job.nextFireAt)}
//               </td>

//               <td className="px-5 py-4 font-mono text-xs text-slate-400">
//                 {job.id.slice(0, 8)}...
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {jobs.length === 0 && (
//         <EmptyState
//           title="No jobs found"
//           description="Create a scheduled job to see it here."
//         />
//       )}

//       <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
//         <span className="text-xs text-slate-400">
//           {jobs.length} job(s) returned by backend
//         </span>
//         <button
//           onClick={onRefresh}
//           className="flex items-center gap-2 text-xs font-semibold text-blue-600"
//         >
//           <RefreshCw size={13} />
//           Refresh
//         </button>
//       </div>
//     </div>
//   );
// }

// function ExecutionTable({ executions }: { executions: Execution[] }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[850px] text-left">
//         <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
//           <tr>
//             {["Job ID", "Status", "Attempts", "Scheduled", "Started", "Finished"].map(
//               (heading) => (
//                 <th key={heading} className="px-5 py-4 font-semibold">
//                   {heading}
//                 </th>
//               )
//             )}
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-slate-100">
//           {executions.map((run) => (
//             <tr key={run.id} className="transition hover:bg-slate-50">
//               <td className="px-5 py-4 font-mono text-xs text-slate-600">
//                 {run.jobId.slice(0, 12)}...
//               </td>
//               <td className="px-5 py-4">
//                 <span
//                   className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${executionStyle(run.status)}`}
//                 >
//                   {run.status}
//                 </span>
//               </td>
//               <td className="px-5 py-4 text-sm text-slate-600">{run.attempts}</td>
//               <td className="px-5 py-4 text-xs text-slate-600">
//                 {formatDate(run.scheduledAt)}
//               </td>
//               <td className="px-5 py-4 text-xs text-slate-600">
//                 {formatDate(run.startedAt)}
//               </td>
//               <td className="px-5 py-4 text-xs text-slate-600">
//                 {formatDate(run.finishedAt)}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {executions.length === 0 && (
//         <EmptyState
//           title="No executions yet"
//           description="Execution records will appear here when jobs run."
//         />
//       )}
//     </div>
//   );
// }

// function CreateJobModal({
//   onClose,
//   onCreated,
// }: {
//   onClose: () => void;
//   onCreated: () => Promise<void>;
// }) {
//   const [type, setType] = useState<JobType>("ONE_OFF");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [payloadTemplate, setPayloadTemplate] = useState("notification");
//   const [cronExpression, setCronExpression] = useState("0 */5 * * * *");

//   const futureDate = new Date(Date.now() + 5 * 60 * 1000);
//   const defaultFireAt = new Date(
//     futureDate.getTime() - futureDate.getTimezoneOffset() * 60000
//   ).toISOString().slice(0, 16);

//   const templates: Record<string, string> = {
//     notification: JSON.stringify(
//       { message: "Hello from scheduler", type: "NOTIFICATION" },
//       null,
//       2
//     ),
//     trip: JSON.stringify(
//       {
//         tripId: "TRIP-1001",
//         passengerId: "USER-1001",
//         action: "SEND_TRIP_REMINDER",
//       },
//       null,
//       2
//     ),
//     email: JSON.stringify(
//       {
//         to: "user@example.com",
//         subject: "Trip reminder",
//         message: "Your trip is scheduled.",
//       },
//       null,
//       2
//     ),
//     custom: "{\n  \n}",
//   };

//   async function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setSaving(true);
//     setError("");

//     const form = new FormData(event.currentTarget);

//     const name = String(form.get("name") || "").trim();
//     const payload = String(form.get("payload") || "").trim();
//     const zoneId = String(form.get("zoneId") || "Asia/Kolkata");
//     const fireAtInput = String(form.get("fireAt") || "");
//     const cron = cronExpression.trim();
//     const priority = Number(form.get("priority") || 10);
//     const maxRuntimeSeconds = Number(form.get("maxRuntimeSeconds") || 60);
//     const misfirePolicy = String(form.get("misfirePolicy") || "FIRE_NOW") as
//       CreateJobRequest["misfirePolicy"];

//     if (name.length < 3) {
//       setError("Job name must contain at least 3 characters.");
//       setSaving(false);
//       return;
//     }

//     try {
//       JSON.parse(payload);
//     } catch {
//       setError("Payload must be valid JSON.");
//       setSaving(false);
//       return;
//     }

//     if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
//       setError("Priority must be between 0 and 100.");
//       setSaving(false);
//       return;
//     }

//     if (
//       !Number.isInteger(maxRuntimeSeconds) ||
//       maxRuntimeSeconds < 1 ||
//       maxRuntimeSeconds > 86400
//     ) {
//       setError("Maximum runtime must be between 1 and 86400 seconds.");
//       setSaving(false);
//       return;
//     }

//     if (type === "ONE_OFF") {
//       if (!fireAtInput || new Date(fireAtInput).getTime() <= Date.now()) {
//         setError("Please select a valid future date and time.");
//         setSaving(false);
//         return;
//       }
//     }

//     if (type === "CRON" && !cron) {
//       setError("Please enter a CRON expression.");
//       setSaving(false);
//       return;
//     }

//     const body: CreateJobRequest = {
//       name,
//       type,
//       cronExpression: type === "CRON" ? cron : null,
//       payload,
//       zoneId,
//       fireAt: type === "ONE_OFF" ? new Date(fireAtInput).toISOString() : null,
//       priority,
//       maxRuntimeSeconds,
//       misfirePolicy,
//     };

//     try {
//       await schedulerApi.createJob(body);
//       await onCreated();
//       onClose();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Could not create job.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
//       <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">Create scheduled job</h2>
//             <p className="mt-1 text-xs text-slate-500">
//               Configure a one-time or recurring job.
//             </p>
//           </div>
//           <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={submit} className="space-y-5 p-6">
//           <div>
//             <label className="mb-2 block text-sm font-semibold">Job name</label>
//             <input
//               name="name"
//               required
//               minLength={3}
//               maxLength={160}
//               placeholder="e.g. Trip reminder notification"
//               className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold">Schedule type</label>
//             <div className="grid grid-cols-2 gap-3">
//               {(["ONE_OFF", "CRON"] as JobType[]).map((item) => (
//                 <button
//                   key={item}
//                   type="button"
//                   onClick={() => setType(item)}
//                   className={`rounded-xl border p-4 text-left ${
//                     type === item
//                       ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                       : "border-slate-200 hover:border-slate-300"
//                   }`}
//                 >
//                   <p className="text-sm font-bold">
//                     {item === "ONE_OFF" ? "One-off job" : "Recurring job"}
//                   </p>
//                   <p className="mt-1 text-xs text-slate-500">
//                     {item === "ONE_OFF" ? "Run once at a specific time" : "Run using CRON"}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {type === "ONE_OFF" ? (
//             <div>
//               <label className="mb-2 block text-sm font-semibold">Fire date and time</label>
//               <input
//                 name="fireAt"
//                 type="datetime-local"
//                 defaultValue={defaultFireAt}
//                 min={defaultFireAt}
//                 required
//                 className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
//               />
//             </div>
//           ) : (
//             <div>
//               <label className="mb-2 block text-sm font-semibold">CRON expression</label>
//               <input
//                 name="cronExpression"
//                 value={cronExpression}
//                 onChange={(event) => setCronExpression(event.target.value)}
//                 required
//                 placeholder="0 */5 * * * *"
//                 className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm"
//               />
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {[
//                   { label: "Every minute", value: "0 * * * * *" },
//                   { label: "Every 5 minutes", value: "0 */5 * * * *" },
//                   { label: "Every hour", value: "0 0 * * * *" },
//                   { label: "Every day", value: "0 0 9 * * *" },
//                 ].map((preset) => (
//                   <button
//                     key={preset.value}
//                     type="button"
//                     onClick={() => setCronExpression(preset.value)}
//                     className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-blue-50"
//                   >
//                     {preset.label}
//                   </button>
//                 ))}
//               </div>
//               <p className="mt-2 text-xs text-slate-500">Spring six-field CRON expression.</p>
//             </div>
//           )}

//           <div>
//             <label className="mb-2 block text-sm font-semibold">Timezone</label>
//             <select name="zoneId" defaultValue="Asia/Kolkata" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
//               <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
//               <option value="UTC">UTC</option>
//               <option value="Europe/London">Europe/London</option>
//               <option value="Europe/Paris">Europe/Paris</option>
//               <option value="America/New_York">America/New_York</option>
//               <option value="America/Los_Angeles">America/Los_Angeles</option>
//               <option value="Asia/Singapore">Asia/Singapore</option>
//               <option value="Asia/Dubai">Asia/Dubai</option>
//               <option value="Australia/Sydney">Australia/Sydney</option>
//             </select>
//           </div>

//           <div className="grid gap-4 sm:grid-cols-3">
//             <div>
//               <label className="mb-2 block text-sm font-semibold">Priority</label>
//               <select name="priority" defaultValue="10" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
//                 <option value="0">0 - Lowest</option>
//                 <option value="5">5 - Low</option>
//                 <option value="10">10 - Normal</option>
//                 <option value="50">50 - High</option>
//                 <option value="100">100 - Critical</option>
//               </select>
//             </div>
//             <div>
//               <label className="mb-2 block text-sm font-semibold">Max runtime</label>
//               <select name="maxRuntimeSeconds" defaultValue="60" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
//                 <option value="30">30 seconds</option>
//                 <option value="60">1 minute</option>
//                 <option value="300">5 minutes</option>
//                 <option value="600">10 minutes</option>
//                 <option value="1800">30 minutes</option>
//                 <option value="3600">1 hour</option>
//                 <option value="86400">24 hours</option>
//               </select>
//             </div>
//             <div>
//               <label className="mb-2 block text-sm font-semibold">Misfire policy</label>
//               <select name="misfirePolicy" defaultValue="FIRE_NOW" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
//                 <option value="FIRE_NOW">Fire now</option>
//                 <option value="SKIP">Skip</option>
//                 <option value="COALESCE">Coalesce</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//               <label className="text-sm font-semibold">Job payload (JSON)</label>
//               <select
//                 value={payloadTemplate}
//                 onChange={(event) => setPayloadTemplate(event.target.value)}
//                 className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
//               >
//                 <option value="notification">Notification template</option>
//                 <option value="trip">Trip template</option>
//                 <option value="email">Email template</option>
//                 <option value="custom">Custom JSON</option>
//               </select>
//             </div>
//             <textarea
//               key={payloadTemplate}
//               name="payload"
//               required
//               rows={8}
//               defaultValue={templates[payloadTemplate]}
//               className="w-full rounded-xl border border-slate-200 bg-slate-950 px-4 py-3 font-mono text-sm text-emerald-300"
//             />
//             <p className="mt-2 text-xs text-slate-400">Payload must be valid JSON.</p>
//           </div>

//           {error && (
//             <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
//               {error}
//             </div>
//           )}

//           <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
//             <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold">
//               Cancel
//             </button>
//             <button disabled={saving} type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
//               {saving ? "Creating..." : "Create job"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   const [section, setSection] = useState<Section>("Dashboard");
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [executions, setExecutions] = useState<Execution[]>([]);
//   const [profile, setProfile] = useState<CurrentUser | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [actionBusy, setActionBusy] = useState(false);
//   const [showCreate, setShowCreate] = useState(false);
//   const [mobileNav, setMobileNav] = useState(false);

//   const [error, setError] = useState("");
//   const [executionError, setExecutionError] = useState("");
//   const [notice, setNotice] = useState("");
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("ALL");

//   const role = profile?.role ?? "EMPLOYEE";
//   const canControlTenant = role === "ADMIN" || role === "OPERATOR";

//   const initials = profile?.username
//     ? profile.username.slice(0, 2).toUpperCase()
//     : "U";

//   const loadJobs = useCallback(async (quiet = false) => {
//     if (quiet) setRefreshing(true);
//     else setLoading(true);

//     setError("");

//     try {
//       const data = await schedulerApi.getJobs();
//       setJobs(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unable to load jobs.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   const loadExecutions = useCallback(async () => {
//     try {
//       const data = await schedulerApi.getExecutions();
//       setExecutions(data);
//       setExecutionError("");
//     } catch (err) {
//       setExecutionError(err instanceof Error ? err.message : "Unable to load executions.");
//     }
//   }, []);

//   const loadProfile = useCallback(async () => {
//     try {
//       const data = await schedulerApi.getCurrentUser();
//       setProfile(data);
//     } catch {
//       setProfile(null);
//     }
//   }, []);

//   useEffect(() => {
//     void loadJobs();
//     void loadExecutions();
//     void loadProfile();
//   }, [loadJobs, loadExecutions, loadProfile]);

//   useEffect(() => {
//     const timer = window.setInterval(() => void loadExecutions(), 4000);
//     return () => window.clearInterval(timer);
//   }, [loadExecutions]);

//   useEffect(() => {
//     const timer = window.setInterval(() => void loadJobs(true), 15000);
//     return () => window.clearInterval(timer);
//   }, [loadJobs]);

//   async function tenantAction(action: "pause" | "resume") {
//     setActionBusy(true);
//     setNotice("");
//     setError("");

//     try {
//       if (action === "pause") await schedulerApi.pauseTenant();
//       else await schedulerApi.resumeTenant();

//       setNotice(
//         action === "pause"
//           ? "Tenant scheduling paused successfully."
//           : "Tenant scheduling resumed successfully."
//       );
//       await loadJobs(true);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Tenant action failed.");
//     } finally {
//       setActionBusy(false);
//     }
//   }

//   const visibleJobs = useMemo(() => {
//     const query = search.toLowerCase();

//     return jobs.filter((job) => {
//       const matchesSearch =
//         job.name.toLowerCase().includes(query) ||
//         job.id.toLowerCase().includes(query);

//       const matchesFilter = filter === "ALL" || job.type === filter;
//       return matchesSearch && matchesFilter;
//     });
//   }, [jobs, search, filter]);

//   const activeCount = jobs.filter((job) => job.status === "ACTIVE").length;
//   const runningCount = executions.filter((run) => run.status.toUpperCase() === "RUNNING").length;
//   const succeededCount = executions.filter((run) => run.status.toUpperCase() === "SUCCEEDED").length;
//   const failedCount = executions.filter((run) =>
//     ["FAILED", "DEAD", "DEAD_LETTER"].includes(run.status.toUpperCase())
//   ).length;

//  const navigation: {
//   label: string;
//   value: Section;
//   icon: LucideIcon;
// }[] = [
//   { label: "Dashboard", value: "Dashboard", icon: LayoutDashboard },
//   { label: "Jobs", value: "Jobs", icon: CalendarClock },
//   { label: "Executions", value: "Executions", icon: Activity },

//   ...(profile?.role === "ADMIN"
//     ? [{ label: "User Management", value: "Users" as Section, icon: Users }]
//     : []),

//   { label: "Settings", value: "Settings", icon: Settings },
// ];

//   return (
//     <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
//       {mobileNav && (
//         <button
//           aria-label="Close menu"
//           onClick={() => setMobileNav(false)}
//           className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
//         />
//       )}

//       <aside
//         className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#101a2c] text-white transition-transform lg:translate-x-0 ${
//           mobileNav ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
//             <Zap size={22} fill="white" />
//           </div>
//           <div>
//             <p className="text-sm font-bold tracking-wide">MoveSync</p>
//             <p className="mt-0.5 text-[11px] text-slate-400">Distributed Scheduler</p>
//           </div>
//           <button className="ml-auto lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation">
//             <X size={19} />
//           </button>
//         </div>

//         <div className="px-4 pt-7">
//           <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">
//             Workspace
//           </p>
//           <nav className="space-y-1">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.value}
//                   onClick={() => {
//                     setSection(item.value);
//                     setMobileNav(false);
//                   }}
//                   className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
//                     section === item.value
//                       ? "bg-blue-500/15 font-semibold text-blue-300"
//                       : "text-slate-400 hover:bg-white/5 hover:text-white"
//                   }`}
//                 >
//                   <Icon size={18} />
//                   {item.label}
//                   {item.value === "Jobs" && (
//                     <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{jobs.length}</span>
//                   )}
//                   {item.value === "Executions" && (
//                     <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{executions.length}</span>
//                   )}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="mt-auto p-4">
//           <div className="rounded-xl border border-white/10 bg-white/[.04] p-4">
//             <div className="flex items-center gap-2 text-xs font-semibold">
//               <ShieldCheck size={15} className="text-blue-300" />
//               Scheduler API
//             </div>
//             <p className="mt-2 text-[11px] leading-5 text-slate-400">
//               Authenticated job and execution data.
//             </p>
//             <button
//               onClick={() => {
//                 void loadJobs(true);
//                 void loadExecutions();
//                 void loadProfile();
//               }}
//               className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white"
//             >
//               <RefreshCw size={13} />
//               Refresh data
//             </button>
//           </div>

//           <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-2 pt-4">
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-200">
//               {initials}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-xs font-semibold">{profile?.username || "Loading account..."}</p>
//               <p className="mt-0.5 text-[10px] text-slate-500">{profile?.role || "Loading role..."}</p>
//             </div>
//             <SignOutButton />
//           </div>
//         </div>
//       </aside>

//       <main className="min-h-screen lg:pl-[258px]">
//         <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
//           <div className="flex items-center gap-3">
//             <button aria-label="Open menu" className="lg:hidden" onClick={() => setMobileNav(true)}>
//               <Menu size={22} />
//             </button>
//             <div>
//               <p className="text-[11px] text-slate-400">Workspace / {section}</p>
//               <p className="mt-0.5 text-sm font-bold">{section === "Dashboard" ? "Overview" : section}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500 sm:block">
//               {profile?.role || "Account"}
//             </span>
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
//               {initials}
//             </div>
//           </div>
//         </header>

//         <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
//           {notice && (
//             <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
//               <CheckCircle2 size={17} />
//               {notice}
//               <button className="ml-auto" onClick={() => setNotice("")} aria-label="Dismiss notification">
//                 <X size={15} />
//               </button>
//             </div>
//           )}

//           {error && (
//             <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
//               <CircleAlert size={17} />
//               {error}
//               <button className="ml-auto underline" onClick={() => void loadJobs()} type="button">Retry</button>
//             </div>
//           )}

//           {section === "Dashboard" && (
//             <>
//               <PageHeading
//                 title="Scheduler overview"
//                 description={
//                   role === "ADMIN"
//                     ? "Monitor your scheduler and manage administrative operations."
//                     : role === "OPERATOR"
//                       ? "Monitor scheduled jobs and manage tenant operations."
//                       : "Create jobs and monitor your scheduled work."
//                 }
//                 action={
//                   <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
//                     <Plus size={17} />
//                     Create new job
//                   </button>
//                 }
//               />

//               {loading ? (
//                 <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-sm text-slate-500">
//                   <RefreshCw className="mx-auto mb-3 animate-spin" size={22} />
//                   Loading scheduler data...
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                     <MetricCard title="Active jobs" value={activeCount} description="Active jobs returned by API" icon={CalendarClock} />
//                     <MetricCard title="Running" value={runningCount} description="Currently executing runs" icon={Activity} />
//                     <MetricCard title="Succeeded" value={succeededCount} description="Successful execution records" icon={CheckCircle2} />
//                     <MetricCard title="Failed / Dead" value={failedCount} description="Failed execution records" icon={CircleAlert} />
//                   </div>

//                   <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
//                     <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h2 className="font-bold">Recent executions</h2>
//                           <p className="mt-1 text-xs text-slate-500">Latest execution activity</p>
//                         </div>
//                         <History className="text-blue-600" size={21} />
//                       </div>

//                       {executions.length === 0 ? (
//                         <div className="py-8 text-center">
//                           <Clock3 className="mx-auto mb-3 text-slate-300" size={30} />
//                           <p className="text-sm font-semibold text-slate-700">No execution records</p>
//                           <p className="mt-1 text-xs text-slate-400">Run a scheduled job to see activity here.</p>
//                         </div>
//                       ) : (
//                         <div className="mt-5 space-y-3">
//                           {executions.slice(0, 5).map((run) => (
//                             <div key={run.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
//                               <div className="min-w-0">
//                                 <p className="truncate font-mono text-xs text-slate-700">{run.jobId.slice(0, 18)}...</p>
//                                 <p className="mt-1 text-[11px] text-slate-400">{formatDate(run.startedAt || run.scheduledAt)}</p>
//                               </div>
//                               <span className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-semibold ${executionStyle(run.status)}`}>
//                                 {run.status}
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       <button onClick={() => setSection("Executions")} className="mt-5 text-xs font-semibold text-blue-600 hover:text-blue-800">
//                         View all executions
//                       </button>
//                     </section>

//                     {canControlTenant && (
//                       <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                         <h2 className="font-bold">Tenant controls</h2>
//                         <p className="mt-1 text-xs leading-5 text-slate-500">Pause or resume scheduling for your tenant.</p>
//                         <button
//                           disabled={actionBusy}
//                           onClick={() => void tenantAction("pause")}
//                           className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
//                         >
//                           <Pause size={16} />
//                           Pause tenant jobs
//                         </button>
//                         <button
//                           disabled={actionBusy}
//                           onClick={() => void tenantAction("resume")}
//                           className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
//                         >
//                           <Play size={16} />
//                           Resume tenant jobs
//                         </button>
//                         {actionBusy && <p className="mt-3 text-center text-xs text-slate-400">Sending request...</p>}
//                       </section>
//                     )}
//                   </div>

//                   <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                     <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
//                       <div>
//                         <h2 className="font-bold">Scheduled jobs</h2>
//                         <p className="mt-1 text-xs text-slate-500">Jobs returned by your Spring Boot backend</p>
//                       </div>
//                       <button onClick={() => void loadJobs(true)} disabled={refreshing} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
//                         <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
//                         Refresh data
//                       </button>
//                     </div>
//                     <JobTable jobs={jobs.slice(0, 5)} onRefresh={() => void loadJobs(true)} />
//                   </section>
//                 </>
//               )}
//             </>
//           )}

//           {section === "Jobs" && (
//             <>
//               <PageHeading
//                 title="Job management"
//                 description="Search and inspect jobs returned by your scheduler."
//                 action={
//                   <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
//                     <Plus size={17} />
//                     Create job
//                   </button>
//                 }
//               />
//               <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-3 text-slate-400" size={16} />
//                     <input
//                       value={search}
//                       onChange={(event) => setSearch(event.target.value)}
//                       placeholder="Search by job name or ID..."
//                       className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
//                     />
//                   </div>
//                   <div className="relative">
//                     <SlidersHorizontal className="pointer-events-none absolute left-3 top-3 text-slate-400" size={15} />
//                     <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm">
//                       <option value="ALL">All types</option>
//                       <option value="ONE_OFF">One-off</option>
//                       <option value="CRON">Recurring</option>
//                     </select>
//                   </div>
//                 </div>
//                 {loading ? (
//                   <div className="p-12 text-center text-sm text-slate-500">Loading jobs...</div>
//                 ) : (
//                   <JobTable jobs={visibleJobs} onRefresh={() => void loadJobs(true)} />
//                 )}
//               </section>
//             </>
//           )}

//           {section === "Executions" && (
//             <>
//               <PageHeading
//                 title="Execution history"
//                 description="Review job runs, statuses, attempts and execution timestamps."
//                 action={
//                   <button onClick={() => void loadExecutions()} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
//                     <RefreshCw size={16} />
//                     Refresh
//                   </button>
//                 }
//               />

//               <div className="mb-5 grid gap-4 sm:grid-cols-3">
//                 <MetricCard title="Running" value={runningCount} description="Currently running" icon={Activity} />
//                 <MetricCard title="Succeeded" value={succeededCount} description="Successful runs" icon={CheckCircle2} />
//                 <MetricCard title="Failed / Dead" value={failedCount} description="Failed runs" icon={CircleAlert} />
//               </div>

//               {executionError && (
//                 <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
//                   {executionError}
//                   <button onClick={() => void loadExecutions()} className="ml-3 font-semibold underline">Retry</button>
//                 </div>
//               )}

//               <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <div className="flex items-center justify-between border-b border-slate-100 p-5">
//                   <div>
//                     <h2 className="font-bold">Recent job runs</h2>
//                     <p className="mt-1 text-xs text-slate-500">Latest 100 records. Auto-refreshes every 4 seconds.</p>
//                   </div>
//                   <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{executions.length} records</span>
//                 </div>
//                 <ExecutionTable executions={executions} />
//               </section>
//             </>
//           )}
//           {section === "Users" && profile?.role === "ADMIN" && (
//   <UserManagement />
// )}

//           {section === "Settings" && (
//             <>
//               <PageHeading
//                 title="Account settings"
//                 description="View your authenticated account and tenant permissions."
//               />

//               <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
//                 <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                   <div className="flex items-center gap-3">
//                     <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
//                       <UserCircle size={23} />
//                     </div>
//                     <div>
//                       <h3 className="font-bold">Account information</h3>
//                       <p className="mt-1 text-xs text-slate-500">Authenticated user profile</p>
//                     </div>
//                   </div>

//                   <div className="mt-6 space-y-4">
//                     <div>
//                       <p className="text-xs text-slate-400">Username</p>
//                       <p className="mt-1 text-sm font-semibold">{profile?.username || "Loading..."}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">Role</p>
//                       <p className="mt-1 inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{profile?.role || "Unknown"}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">Tenant ID</p>
//                       <p className="mt-1 break-all font-mono text-xs text-slate-600">{profile?.tenantId || "Unavailable"}</p>
//                     </div>
//                   </div>
//                 </section>

//                 <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//                   <div className="flex items-center gap-3">
//                     <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
//                       <ShieldCheck size={23} />
//                     </div>
//                     <div>
//                       <h3 className="font-bold">Tenant permissions</h3>
//                       <p className="mt-1 text-xs text-slate-500">Role-based access information</p>
//                     </div>
//                   </div>

//                   {canControlTenant ? (
//                     <>
//                       <p className="mt-5 text-sm leading-6 text-slate-600">
//                         Your {role} role can pause and resume scheduling for your tenant.
//                       </p>
//                       <div className="mt-5 flex flex-wrap gap-3">
//                         <button disabled={actionBusy} onClick={() => void tenantAction("pause")} className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50">
//                           Pause tenant
//                         </button>
//                         <button disabled={actionBusy} onClick={() => void tenantAction("resume")} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
//                           Resume tenant
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="mt-5 rounded-xl bg-slate-50 p-4">
//                       <p className="text-sm font-semibold text-slate-700">Read-only permissions</p>
//                       <p className="mt-1 text-xs leading-5 text-slate-500">
//                         Your EMPLOYEE role cannot control tenant scheduling. Contact an administrator if you need elevated access.
//                       </p>
//                     </div>
//                   )}
//                 </section>
//               </div>
//             </>
//           )}
//         </div>
//       </main>

//       {showCreate && (
//         <CreateJobModal
//           onClose={() => setShowCreate(false)}
//           onCreated={async () => {
//             await loadJobs(true);
//             await loadExecutions();
//           }}
//         />
//       )}
//     </div>
//   );
// }






"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock3,
  LayoutDashboard,
  Menu,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  X,
  Zap,
  SlidersHorizontal,
  UserCircle,
  History,
  Users,
  type LucideIcon,
} from "lucide-react";

import UserManagement from "@/components/admin/UserManagement";
import { schedulerApi } from "@/lib/api";
import type {
  CreateJobRequest,
  Job,
  JobType,
  Execution,
  CurrentUser,
} from "@/lib/types";

import {
  EmptyState,
  MetricCard,
  PageHeading,
  StatusBadge,
} from "@/components/ui";

import SignOutButton from "@/components/SignOutButton";

type Section = "Dashboard" | "Jobs" | "Executions" | "Settings" | "Users";

type DetailedJob = Job & {
  tenantId?: string;
  cronExpression?: string | null;
  payload?: string;
  zoneId?: string;
  priority?: number;
  maxRuntimeSeconds?: number;
  misfirePolicy?: string;
  createdAt?: string;
  version?: number;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function executionStyle(status: string) {
  switch (status.toUpperCase()) {
    case "SUCCEEDED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "RUNNING":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "RETRYING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "FAILED":
    case "DEAD":
    case "DEAD_LETTER":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

/* -------------------- JOB DETAILS MODAL -------------------- */

function JobDetailsModal({
  job,
  executions,
  onClose,
}: {
  job: Job;
  executions: Execution[];
  onClose: () => void;
}) {
  const details = job as DetailedJob;

  const relatedExecutions = executions.filter(
    (run) => run.jobId === job.id
  );

  const fields: [string, string][] = [
    ["Job name", details.name],
    ["Job ID", details.id],
    ["Tenant ID", details.tenantId || "Not provided by API"],
    ["Job type", details.type],
    ["Status", details.status],
    ["Cron expression", details.cronExpression || "Not applicable"],
    ["Timezone", details.zoneId || "Not provided"],
    ["Next execution", formatDate(details.nextFireAt)],
    ["Priority", String(details.priority ?? "Not provided")],
    [
      "Maximum runtime",
      details.maxRuntimeSeconds != null
        ? `${details.maxRuntimeSeconds} seconds`
        : "Not provided",
    ],
    ["Misfire policy", details.misfirePolicy || "Not provided"],
    ["Partition ID", String(details.partitionId)],
    ["Created at", formatDate(details.createdAt)],
    ["Version", String(details.version ?? "Not provided")],
  ];

  let formattedPayload = details.payload || "No payload returned by API";

  try {
    if (details.payload) {
      formattedPayload = JSON.stringify(
        JSON.parse(details.payload),
        null,
        2
      );
    }
  } catch {
    // Show original payload if it is not valid JSON.
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Job Details</h2>
            <p className="mt-1 text-xs text-slate-500">{details.name}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-800">
              General information
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Job payload</h3>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
                JSON
              </span>
            </div>
            <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 p-5 text-xs leading-6 text-emerald-300">
              {formattedPayload}
            </pre>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Execution history
              </h3>
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {relatedExecutions.length} runs
              </span>
            </div>

            {relatedExecutions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                <Clock3 className="mx-auto mb-2 text-slate-400" size={24} />
                <p className="text-sm font-semibold text-slate-700">
                  No executions found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Execution records for this job will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[600px] text-left">
                  <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                    <tr>
                      {["Status", "Attempts", "Scheduled", "Started", "Finished"].map(
                        (heading) => (
                          <th key={heading} className="px-4 py-3 font-semibold">
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {relatedExecutions.map((run) => (
                      <tr key={run.id}>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-lg border px-2 py-1 text-[11px] font-semibold ${executionStyle(run.status)}`}
                          >
                            {run.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">{run.attempts}</td>
                        <td className="px-4 py-3 text-xs">
                          {formatDate(run.scheduledAt)}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {formatDate(run.startedAt)}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {formatDate(run.finishedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- JOB TABLE -------------------- */

function JobTable({
  jobs,
  onRefresh,
  onSelect,
  selectedId,
}: {
  jobs: Job[];
  onRefresh: () => void;
  onSelect: (job: Job) => void;
  selectedId?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            {["Job", "Type", "Status", "Next execution", "Job ID", "Details"].map(
              (heading) => (
                <th key={heading} className="px-5 py-4 font-semibold">
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr
              key={job.id}
              onClick={() => onSelect(job)}
              className={`cursor-pointer transition hover:bg-blue-50 ${
                selectedId === job.id ? "bg-blue-50" : ""
              }`}
            >
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-800">{job.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {job.type === "CRON" ? "Recurring schedule" : "One-time schedule"}
                </p>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs">
                  {job.type}
                </span>
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={job.status} />
              </td>

              <td className="px-5 py-4 text-xs text-slate-600">
                {formatDate(job.nextFireAt)}
              </td>

              <td className="px-5 py-4 font-mono text-xs text-slate-400">
                {job.id.slice(0, 8)}...
              </td>

              <td className="px-5 py-4">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(job);
                  }}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  View details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {jobs.length === 0 && (
        <EmptyState
          title="No jobs found"
          description="Create a scheduled job to see it here."
        />
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <span className="text-xs text-slate-400">
          {jobs.length} job(s) returned by backend
        </span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-xs font-semibold text-blue-600"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>
    </div>
  );
}

/* -------------------- EXECUTION TABLE -------------------- */

function ExecutionTable({ executions }: { executions: Execution[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            {["Job ID", "Status", "Attempts", "Scheduled", "Started", "Finished"].map(
              (heading) => (
                <th key={heading} className="px-5 py-4 font-semibold">
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {executions.map((run) => (
            <tr key={run.id} className="transition hover:bg-slate-50">
              <td className="px-5 py-4 font-mono text-xs text-slate-600">
                {run.jobId.slice(0, 12)}...
              </td>
              <td className="px-5 py-4">
                <span
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${executionStyle(run.status)}`}
                >
                  {run.status}
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{run.attempts}</td>
              <td className="px-5 py-4 text-xs text-slate-600">
                {formatDate(run.scheduledAt)}
              </td>
              <td className="px-5 py-4 text-xs text-slate-600">
                {formatDate(run.startedAt)}
              </td>
              <td className="px-5 py-4 text-xs text-slate-600">
                {formatDate(run.finishedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {executions.length === 0 && (
        <EmptyState
          title="No executions yet"
          description="Execution records will appear here when jobs run."
        />
      )}
    </div>
  );
}

/* -------------------- CREATE JOB MODAL -------------------- */

function CreateJobModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [type, setType] = useState<JobType>("ONE_OFF");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [payloadTemplate, setPayloadTemplate] = useState("notification");
  const [cronExpression, setCronExpression] = useState("0 */5 * * * *");

  const futureDate = new Date(Date.now() + 5 * 60 * 1000);
  const defaultFireAt = new Date(
    futureDate.getTime() - futureDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  const templates: Record<string, string> = {
    notification: JSON.stringify(
      { message: "Hello from scheduler", type: "NOTIFICATION" },
      null,
      2
    ),
    trip: JSON.stringify(
      {
        tripId: "TRIP-1001",
        passengerId: "USER-1001",
        action: "SEND_TRIP_REMINDER",
      },
      null,
      2
    ),
    email: JSON.stringify(
      {
        to: "user@example.com",
        subject: "Trip reminder",
        message: "Your trip is scheduled.",
      },
      null,
      2
    ),
    custom: "{\n  \n}",
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "").trim();
    const payload = String(form.get("payload") || "").trim();
    const zoneId = String(form.get("zoneId") || "Asia/Kolkata");
    const fireAtInput = String(form.get("fireAt") || "");
    const cron = cronExpression.trim();
    const priority = Number(form.get("priority") || 10);
    const maxRuntimeSeconds = Number(form.get("maxRuntimeSeconds") || 60);
    const misfirePolicy = String(form.get("misfirePolicy") || "FIRE_NOW") as
      CreateJobRequest["misfirePolicy"];

    if (name.length < 3) {
      setError("Job name must contain at least 3 characters.");
      setSaving(false);
      return;
    }

    try {
      JSON.parse(payload);
    } catch {
      setError("Payload must be valid JSON.");
      setSaving(false);
      return;
    }

    if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
      setError("Priority must be between 0 and 100.");
      setSaving(false);
      return;
    }

    if (
      !Number.isInteger(maxRuntimeSeconds) ||
      maxRuntimeSeconds < 1 ||
      maxRuntimeSeconds > 86400
    ) {
      setError("Maximum runtime must be between 1 and 86400 seconds.");
      setSaving(false);
      return;
    }

    if (type === "ONE_OFF") {
      if (!fireAtInput || new Date(fireAtInput).getTime() <= Date.now()) {
        setError("Please select a valid future date and time.");
        setSaving(false);
        return;
      }
    }

    if (type === "CRON" && !cron) {
      setError("Please enter a CRON expression.");
      setSaving(false);
      return;
    }

    const body: CreateJobRequest = {
      name,
      type,
      cronExpression: type === "CRON" ? cron : null,
      payload,
      zoneId,
      fireAt: type === "ONE_OFF" ? new Date(fireAtInput).toISOString() : null,
      priority,
      maxRuntimeSeconds,
      misfirePolicy,
    };

    try {
      await schedulerApi.createJob(body);
      await onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create scheduled job
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure a one-time or recurring job.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold">Job name</label>
            <input
              name="name"
              required
              minLength={3}
              maxLength={160}
              placeholder="e.g. Trip reminder notification"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Schedule type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["ONE_OFF", "CRON"] as JobType[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setType(item)}
                  className={`rounded-xl border p-4 text-left ${
                    type === item
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-bold">
                    {item === "ONE_OFF" ? "One-off job" : "Recurring job"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item === "ONE_OFF"
                      ? "Run once at a specific time"
                      : "Run using CRON"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {type === "ONE_OFF" ? (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Fire date and time
              </label>
              <input
                name="fireAt"
                type="datetime-local"
                defaultValue={defaultFireAt}
                min={defaultFireAt}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                CRON expression
              </label>
              <input
                name="cronExpression"
                value={cronExpression}
                onChange={(event) => setCronExpression(event.target.value)}
                required
                placeholder="0 */5 * * * *"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { label: "Every minute", value: "0 * * * * *" },
                  { label: "Every 5 minutes", value: "0 */5 * * * *" },
                  { label: "Every hour", value: "0 0 * * * *" },
                  { label: "Every day", value: "0 0 9 * * *" },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setCronExpression(preset.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-blue-50"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Spring six-field CRON expression.
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold">Timezone</label>
            <select
              name="zoneId"
              defaultValue="Asia/Kolkata"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold">Priority</label>
              <select
                name="priority"
                defaultValue="10"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option value="0">0 - Lowest</option>
                <option value="5">5 - Low</option>
                <option value="10">10 - Normal</option>
                <option value="50">50 - High</option>
                <option value="100">100 - Critical</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Max runtime
              </label>
              <select
                name="maxRuntimeSeconds"
                defaultValue="60"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
                <option value="1800">30 minutes</option>
                <option value="3600">1 hour</option>
                <option value="86400">24 hours</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Misfire policy
              </label>
              <select
                name="misfirePolicy"
                defaultValue="FIRE_NOW"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option value="FIRE_NOW">Fire now</option>
                <option value="SKIP">Skip</option>
                <option value="COALESCE">Coalesce</option>
              </select>
            </div>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-semibold">Job payload (JSON)</label>
              <select
                value={payloadTemplate}
                onChange={(event) => setPayloadTemplate(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
              >
                <option value="notification">Notification template</option>
                <option value="trip">Trip template</option>
                <option value="email">Email template</option>
                <option value="custom">Custom JSON</option>
              </select>
            </div>

            <textarea
              key={payloadTemplate}
              name="payload"
              required
              rows={8}
              defaultValue={templates[payloadTemplate]}
              className="w-full rounded-xl border border-slate-200 bg-slate-950 px-4 py-3 font-mono text-sm text-emerald-300"
            />
            <p className="mt-2 text-xs text-slate-400">
              Payload must be valid JSON.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------- MAIN DASHBOARD -------------------- */

export default function Home() {
  const [section, setSection] = useState<Section>("Dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [profile, setProfile] = useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  const [error, setError] = useState("");
  const [executionError, setExecutionError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const role = profile?.role ?? "EMPLOYEE";
  const canControlTenant = role === "ADMIN" || role === "OPERATOR";

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "U";

  const loadJobs = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const data = await schedulerApi.getJobs();
      setJobs(data);

      // Keep selected job synchronized after refresh.
      setSelectedJob((current) =>
        current ? data.find((job) => job.id === current.id) || null : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load jobs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadExecutions = useCallback(async () => {
    try {
      const data = await schedulerApi.getExecutions();
      setExecutions(data);
      setExecutionError("");
    } catch (err) {
      setExecutionError(
        err instanceof Error ? err.message : "Unable to load executions."
      );
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const data = await schedulerApi.getCurrentUser();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
    void loadExecutions();
    void loadProfile();
  }, [loadJobs, loadExecutions, loadProfile]);

  useEffect(() => {
    const timer = window.setInterval(() => void loadExecutions(), 4000);
    return () => window.clearInterval(timer);
  }, [loadExecutions]);

  useEffect(() => {
    const timer = window.setInterval(() => void loadJobs(true), 15000);
    return () => window.clearInterval(timer);
  }, [loadJobs]);

  async function tenantAction(action: "pause" | "resume") {
    setActionBusy(true);
    setNotice("");
    setError("");

    try {
      if (action === "pause") await schedulerApi.pauseTenant();
      else await schedulerApi.resumeTenant();

      setNotice(
        action === "pause"
          ? "Tenant scheduling paused successfully."
          : "Tenant scheduling resumed successfully."
      );
      await loadJobs(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tenant action failed.");
    } finally {
      setActionBusy(false);
    }
  }

  const visibleJobs = useMemo(() => {
    const query = search.toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        job.name.toLowerCase().includes(query) ||
        job.id.toLowerCase().includes(query);

      const matchesFilter = filter === "ALL" || job.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filter]);

  const activeCount = jobs.filter((job) => job.status === "ACTIVE").length;
  const runningCount = executions.filter(
    (run) => run.status.toUpperCase() === "RUNNING"
  ).length;
  const succeededCount = executions.filter(
    (run) => run.status.toUpperCase() === "SUCCEEDED"
  ).length;
  const failedCount = executions.filter((run) =>
    ["FAILED", "DEAD", "DEAD_LETTER"].includes(run.status.toUpperCase())
  ).length;

  const navigation: {
    label: string;
    value: Section;
    icon: LucideIcon;
  }[] = [
    { label: "Dashboard", value: "Dashboard", icon: LayoutDashboard },
    { label: "Jobs", value: "Jobs", icon: CalendarClock },
    { label: "Executions", value: "Executions", icon: Activity },
    ...(profile?.role === "ADMIN"
      ? [{ label: "User Management", value: "Users" as Section, icon: Users }]
      : []),
    { label: "Settings", value: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {mobileNav && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#101a2c] text-white transition-transform lg:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
            <Zap size={22} fill="white" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide">MoveSync</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Distributed Scheduler
            </p>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">
            Workspace
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => {
                    setSection(item.value);
                    setMobileNav(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    section === item.value
                      ? "bg-blue-500/15 font-semibold text-blue-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                  {item.value === "Jobs" && (
                    <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                      {jobs.length}
                    </span>
                  )}
                  {item.value === "Executions" && (
                    <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                      {executions.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-xl border border-white/10 bg-white/[.04] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <ShieldCheck size={15} className="text-blue-300" />
              Scheduler API
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              Authenticated job and execution data.
            </p>
            <button
              onClick={() => {
                void loadJobs(true);
                void loadExecutions();
                void loadProfile();
              }}
              className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white"
            >
              <RefreshCw size={13} />
              Refresh data
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-2 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-200">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">
                {profile?.username || "Loading account..."}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {profile?.role || "Loading role..."}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[258px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              className="lg:hidden"
              onClick={() => setMobileNav(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <p className="text-[11px] text-slate-400">
                Workspace / {section}
              </p>
              <p className="mt-0.5 text-sm font-bold">
                {section === "Dashboard" ? "Overview" : section}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500 sm:block">
              {profile?.role || "Account"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {notice && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <CheckCircle2 size={17} />
              {notice}
              <button
                className="ml-auto"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <CircleAlert size={17} />
              {error}
              <button
                className="ml-auto underline"
                onClick={() => void loadJobs()}
                type="button"
              >
                Retry
              </button>
            </div>
          )}

          {/* DASHBOARD */}
          {section === "Dashboard" && (
            <>
              <PageHeading
                title="Scheduler overview"
                description={
                  role === "ADMIN"
                    ? "Monitor your scheduler and manage administrative operations."
                    : role === "OPERATOR"
                      ? "Monitor scheduled jobs and manage tenant operations."
                      : "Create jobs and monitor your scheduled work."
                }
                action={
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Plus size={17} />
                    Create new job
                  </button>
                }
              />

              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-sm text-slate-500">
                  <RefreshCw className="mx-auto mb-3 animate-spin" size={22} />
                  Loading scheduler data...
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                      title="Active jobs"
                      value={activeCount}
                      description="Active jobs returned by API"
                      icon={CalendarClock}
                    />
                    <MetricCard
                      title="Running"
                      value={runningCount}
                      description="Currently executing runs"
                      icon={Activity}
                    />
                    <MetricCard
                      title="Succeeded"
                      value={succeededCount}
                      description="Successful execution records"
                      icon={CheckCircle2}
                    />
                    <MetricCard
                      title="Failed / Dead"
                      value={failedCount}
                      description="Failed execution records"
                      icon={CircleAlert}
                    />
                  </div>

                  <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-bold">Recent executions</h2>
                          <p className="mt-1 text-xs text-slate-500">
                            Latest execution activity
                          </p>
                        </div>
                        <History className="text-blue-600" size={21} />
                      </div>

                      {executions.length === 0 ? (
                        <div className="py-8 text-center">
                          <Clock3 className="mx-auto mb-3 text-slate-300" size={30} />
                          <p className="text-sm font-semibold text-slate-700">
                            No execution records
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Run a scheduled job to see activity here.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-5 space-y-3">
                          {executions.slice(0, 5).map((run) => (
                            <div
                              key={run.id}
                              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-mono text-xs text-slate-700">
                                  {run.jobId.slice(0, 18)}...
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                  {formatDate(run.startedAt || run.scheduledAt)}
                                </p>
                              </div>
                              <span
                                className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-semibold ${executionStyle(run.status)}`}
                              >
                                {run.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => setSection("Executions")}
                        className="mt-5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View all executions
                      </button>
                    </section>

                    {canControlTenant && (
                      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="font-bold">Tenant controls</h2>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Pause or resume scheduling for your tenant.
                        </p>
                        <button
                          disabled={actionBusy}
                          onClick={() => void tenantAction("pause")}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                        >
                          <Pause size={16} />
                          Pause tenant jobs
                        </button>
                        <button
                          disabled={actionBusy}
                          onClick={() => void tenantAction("resume")}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Play size={16} />
                          Resume tenant jobs
                        </button>
                        {actionBusy && (
                          <p className="mt-3 text-center text-xs text-slate-400">
                            Sending request...
                          </p>
                        )}
                      </section>
                    )}
                  </div>

                  <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="font-bold">Scheduled jobs</h2>
                        <p className="mt-1 text-xs text-slate-500">
                          Click any job to inspect its full details.
                        </p>
                      </div>
                      <button
                        onClick={() => void loadJobs(true)}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                      >
                        <RefreshCw
                          size={14}
                          className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh data
                      </button>
                    </div>
                    <JobTable
                      jobs={jobs.slice(0, 5)}
                      onRefresh={() => void loadJobs(true)}
                      onSelect={setSelectedJob}
                      selectedId={selectedJob?.id}
                    />
                  </section>
                </>
              )}
            </>
          )}

          {/* JOB MANAGEMENT */}
          {section === "Jobs" && (
            <>
              <PageHeading
                title="Job management"
                description="Search and inspect jobs returned by your scheduler."
                action={
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Plus size={17} />
                    Create job
                  </button>
                }
              />

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-3 text-slate-400"
                      size={16}
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by job name or ID..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <SlidersHorizontal
                      className="pointer-events-none absolute left-3 top-3 text-slate-400"
                      size={15}
                    />
                    <select
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm"
                    >
                      <option value="ALL">All types</option>
                      <option value="ONE_OFF">One-off</option>
                      <option value="CRON">Recurring</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-sm text-slate-500">
                    Loading jobs...
                  </div>
                ) : (
                  <JobTable
                    jobs={visibleJobs}
                    onRefresh={() => void loadJobs(true)}
                    onSelect={setSelectedJob}
                    selectedId={selectedJob?.id}
                  />
                )}
              </section>
            </>
          )}

          {/* EXECUTIONS */}
          {section === "Executions" && (
            <>
              <PageHeading
                title="Execution history"
                description="Review job runs, statuses, attempts and execution timestamps."
                action={
                  <button
                    onClick={() => void loadExecutions()}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                }
              />

              <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <MetricCard
                  title="Running"
                  value={runningCount}
                  description="Currently running"
                  icon={Activity}
                />
                <MetricCard
                  title="Succeeded"
                  value={succeededCount}
                  description="Successful runs"
                  icon={CheckCircle2}
                />
                <MetricCard
                  title="Failed / Dead"
                  value={failedCount}
                  description="Failed runs"
                  icon={CircleAlert}
                />
              </div>

              {executionError && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {executionError}
                  <button
                    onClick={() => void loadExecutions()}
                    className="ml-3 font-semibold underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h2 className="font-bold">Recent job runs</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Latest records. Auto-refreshes every 4 seconds.
                    </p>
                  </div>
                  <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    {executions.length} records
                  </span>
                </div>
                <ExecutionTable executions={executions} />
              </section>
            </>
          )}

          {/* ADMIN USERS */}
          {section === "Users" && profile?.role === "ADMIN" && (
            <UserManagement />
          )}

          {/* SETTINGS */}
          {section === "Settings" && (
            <>
              <PageHeading
                title="Account settings"
                description="View your authenticated account and tenant permissions."
              />

              <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <UserCircle size={23} />
                    </div>
                    <div>
                      <h3 className="font-bold">Account information</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Authenticated user profile
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs text-slate-400">Username</p>
                      <p className="mt-1 text-sm font-semibold">
                        {profile?.username || "Loading..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Role</p>
                      <p className="mt-1 inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {profile?.role || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Tenant ID</p>
                      <p className="mt-1 break-all font-mono text-xs text-slate-600">
                        {profile?.tenantId || "Unavailable"}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                      <ShieldCheck size={23} />
                    </div>
                    <div>
                      <h3 className="font-bold">Tenant permissions</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Role-based access information
                      </p>
                    </div>
                  </div>

                  {canControlTenant ? (
                    <>
                      <p className="mt-5 text-sm leading-6 text-slate-600">
                        Your {role} role can pause and resume scheduling for
                        your tenant.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          disabled={actionBusy}
                          onClick={() => void tenantAction("pause")}
                          className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                        >
                          Pause tenant
                        </button>
                        <button
                          disabled={actionBusy}
                          onClick={() => void tenantAction("resume")}
                          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Resume tenant
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-700">
                        Read-only permissions
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your EMPLOYEE role cannot control tenant scheduling.
                        Contact an administrator if you need elevated access.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </main>

      {showCreate && (
        <CreateJobModal
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            await loadJobs(true);
            await loadExecutions();
          }}
        />
      )}

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          executions={executions}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
