
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   RefreshCw,
//   Users,
//   ShieldCheck,
//   UserCheck,
//   UserX,
//   Mail,
//   Building2,
//   AlertCircle,
//   CheckCircle2,
//   Save,
//   ChevronDown,
// } from "lucide-react";

// type Role = "ADMIN" | "OPERATOR" | "EMPLOYEE";

// type AppUser = {
//   id: string;
//   name: string;
//   email: string | null;
//   username: string;
//   role: Role;
//   tenantId: string;
//   enabled: boolean;
// };

// const roles: Role[] = ["EMPLOYEE", "OPERATOR", "ADMIN"];

// export default function UserManagement() {
//   const [users, setUsers] = useState<AppUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [saving, setSaving] = useState<string | null>(null);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");

//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("ALL");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   // Tracks unsaved role selections separately from the saved user role.
//   const [roleDrafts, setRoleDrafts] = useState<Record<string, Role>>({});

//   const loadUsers = useCallback(async (isRefresh = false) => {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);

//     setError("");

//     try {
//       const response = await fetch("/api/admin/users", {
//         method: "GET",
//         cache: "no-store",
//       });

//       const data = await response.json().catch(() => null);

//       if (!response.ok) {
//         throw new Error(data?.message || `Could not load users (${response.status})`);
//       }

//       const list = Array.isArray(data) ? data : data?.users;

//       if (!Array.isArray(list)) {
//         throw new Error("Invalid users response from server.");
//       }

//       setUsers(list);
//       setRoleDrafts({});
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load users.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     void loadUsers();
//   }, [loadUsers]);

//   const stats = useMemo(() => ({
//     total: users.length,
//     admins: users.filter((u) => u.role === "ADMIN").length,
//     operators: users.filter((u) => u.role === "OPERATOR").length,
//     employees: users.filter((u) => u.role === "EMPLOYEE").length,
//     active: users.filter((u) => u.enabled).length,
//     disabled: users.filter((u) => !u.enabled).length,
//   }), [users]);

//   const filteredUsers = useMemo(() => {
//     const term = search.trim().toLowerCase();

//     return users.filter((user) => {
//       const matchesSearch =
//         !term ||
//         user.name?.toLowerCase().includes(term) ||
//         user.username?.toLowerCase().includes(term) ||
//         user.email?.toLowerCase().includes(term) ||
//         user.tenantId?.toLowerCase().includes(term);

//       const matchesRole =
//         roleFilter === "ALL" || user.role === roleFilter;

//       const matchesStatus =
//         statusFilter === "ALL" ||
//         (statusFilter === "ACTIVE" && user.enabled) ||
//         (statusFilter === "DISABLED" && !user.enabled);

//       return matchesSearch && matchesRole && matchesStatus;
//     });
//   }, [users, search, roleFilter, statusFilter]);

//   async function saveRole(user: AppUser) {
//     const newRole = roleDrafts[user.username] ?? user.role;

//     if (newRole === user.role) return;

//     if (!window.confirm(`Change ${user.username}'s role to ${newRole}?`)) {
//       setRoleDrafts((current) => {
//         const next = { ...current };
//         delete next[user.username];
//         return next;
//       });
//       return;
//     }

//     setSaving(user.username);
//     setError("");
//     setNotice("");

//     try {
//       const response = await fetch(
//         `/api/admin/users/${encodeURIComponent(user.username)}/role`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ role: newRole }),
//         }
//       );

//       const data = await response.json().catch(() => null);

//       if (!response.ok) {
//         throw new Error(data?.message || `Role update failed (${response.status})`);
//       }

//       setUsers((current) =>
//         current.map((item) =>
//           item.username === user.username
//             ? { ...item, role: newRole }
//             : item
//         )
//       );

//       setRoleDrafts((current) => {
//         const next = { ...current };
//         delete next[user.username];
//         return next;
//       });

//       setNotice(`${user.username}'s role updated to ${newRole}.`);

//       // Reload from backend so the UI reflects the actual saved data.
//       await loadUsers(true);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Could not update role.");
//     } finally {
//       setSaving(null);
//     }
//   }

//   async function toggleStatus(user: AppUser) {
//     const action = user.enabled ? "disable" : "enable";

//     if (!window.confirm(`Are you sure you want to ${action} ${user.username}?`)) {
//       return;
//     }

//     setSaving(user.username);
//     setError("");
//     setNotice("");

//     try {
//       const response = await fetch(
//         `/api/admin/users/${encodeURIComponent(user.username)}/status`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ enabled: !user.enabled }),
//         }
//       );

//       const data = await response.json().catch(() => null);

//       if (!response.ok) {
//         throw new Error(data?.message || `Status update failed (${response.status})`);
//       }

//       setUsers((current) =>
//         current.map((item) =>
//           item.username === user.username
//             ? { ...item, enabled: !user.enabled }
//             : item
//         )
//       );

//       setNotice(`${user.username} has been ${action}d.`);
//       await loadUsers(true);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Could not update status.");
//     } finally {
//       setSaving(null);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

//         {/* Header */}
//         <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
//               <ShieldCheck size={16} />
//               Administration
//             </div>
//             <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
//               User Management
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Manage users, permissions and account access.
//             </p>
//           </div>

//           <button
//             onClick={() => void loadUsers(true)}
//             disabled={refreshing || loading}
//             className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
//           >
//             <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* Alerts */}
//         {error && (
//           <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             <AlertCircle size={18} className="mt-0.5 shrink-0" />
//             <div>
//               <p className="font-semibold">Something went wrong</p>
//               <p className="mt-1">{error}</p>
//             </div>
//           </div>
//         )}

//         {notice && (
//           <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
//             <CheckCircle2 size={18} />
//             {notice}
//           </div>
//         )}

//         {/* Statistics */}
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
//           <Stat title="Total users" value={stats.total} icon={Users} />
//           <Stat title="Administrators" value={stats.admins} icon={ShieldCheck} />
//           <Stat title="Operators" value={stats.operators} icon={UserCheck} />
//           <Stat title="Employees" value={stats.employees} icon={Users} />
//           <Stat title="Active" value={stats.active} icon={CheckCircle2} />
//           <Stat title="Disabled" value={stats.disabled} icon={UserX} />
//         </div>

//         {/* Role overview */}
//         <div className="grid gap-4 md:grid-cols-3">
//           <RoleSummary
//             title="Administrators"
//             description="Full administrative access"
//             count={stats.admins}
//             color="violet"
//           />
//           <RoleSummary
//             title="Operators"
//             description="Operational controls and job management"
//             count={stats.operators}
//             color="blue"
//           />
//           <RoleSummary
//             title="Employees"
//             description="Standard application access"
//             count={stats.employees}
//             color="emerald"
//           />
//         </div>

//         {/* Users table */}
//         <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-200 p-5">
//             <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//               <div>
//                 <h2 className="font-bold text-slate-900">All users</h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {filteredUsers.length} of {users.length} users
//                 </p>
//               </div>

//               <div className="grid gap-3 sm:grid-cols-3">
//                 <div className="relative sm:col-span-1">
//                   <Search
//                     size={17}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                   />
//                   <input
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder="Search users..."
//                     className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>

//                 <select
//                   value={roleFilter}
//                   onChange={(e) => setRoleFilter(e.target.value)}
//                   className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
//                 >
//                   <option value="ALL">All roles</option>
//                   <option value="ADMIN">Admin</option>
//                   <option value="OPERATOR">Operator</option>
//                   <option value="EMPLOYEE">Employee</option>
//                 </select>

//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
//                 >
//                   <option value="ALL">All statuses</option>
//                   <option value="ACTIVE">Active</option>
//                   <option value="DISABLED">Disabled</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="space-y-3 p-6">
//               {[1, 2, 3, 4].map((item) => (
//                 <div
//                   key={item}
//                   className="h-16 animate-pulse rounded-lg bg-slate-100"
//                 />
//               ))}
//             </div>
//           ) : filteredUsers.length === 0 ? (
//             <div className="px-6 py-16 text-center">
//               <Users className="mx-auto text-slate-300" size={36} />
//               <h3 className="mt-3 font-semibold text-slate-800">
//                 No users found
//               </h3>
//               <p className="mt-1 text-sm text-slate-500">
//                 Try changing your search or filters.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[850px] text-left text-sm">
//                 <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                   <tr>
//                     <th className="px-5 py-4 font-semibold">User</th>
//                     <th className="px-5 py-4 font-semibold">Tenant</th>
//                     <th className="px-5 py-4 font-semibold">Role</th>
//                     <th className="px-5 py-4 font-semibold">Status</th>
//                     <th className="px-5 py-4 text-right font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {filteredUsers.map((user) => {
//                     const selectedRole = roleDrafts[user.username] ?? user.role;
//                     const isSaving = saving === user.username;

//                     return (
//                       <tr key={user.id} className="transition hover:bg-slate-50">
//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
//                               {(user.name || user.username || "U")
//                                 .charAt(0)
//                                 .toUpperCase()}
//                             </div>
//                             <div className="min-w-0">
//                               <p className="font-semibold text-slate-900">
//                                 {user.name || user.username}
//                               </p>
//                               <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
//                                 <Mail size={12} />
//                                 {user.email || "No email"}
//                               </p>
//                               <p className="mt-0.5 text-xs text-slate-400">
//                                 @{user.username}
//                               </p>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-2 text-slate-600">
//                             <Building2 size={15} className="text-slate-400" />
//                             <span>{user.tenantId || "—"}</span>
//                           </div>
//                         </td>

//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-2">
//                             <div className="relative">
//                               <select
//                                 value={selectedRole}
//                                 disabled={isSaving}
//                                 onChange={(e) =>
//                                   setRoleDrafts((current) => ({
//                                     ...current,
//                                     [user.username]: e.target.value as Role,
//                                   }))
//                                 }
//                                 className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
//                               >
//                                 {roles.map((role) => (
//                                   <option key={role} value={role}>
//                                     {role}
//                                   </option>
//                                 ))}
//                               </select>
//                               <ChevronDown
//                                 size={13}
//                                 className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
//                               />
//                             </div>

//                             {selectedRole !== user.role && (
//                               <button
//                                 onClick={() => void saveRole(user)}
//                                 disabled={isSaving}
//                                 title="Save role"
//                                 className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
//                               >
//                                 <Save size={13} />
//                                 Save
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         <td className="px-5 py-4">
//                           <span
//                             className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
//                               user.enabled
//                                 ? "bg-emerald-50 text-emerald-700"
//                                 : "bg-red-50 text-red-700"
//                             }`}
//                           >
//                             <span
//                               className={`h-1.5 w-1.5 rounded-full ${
//                                 user.enabled ? "bg-emerald-500" : "bg-red-500"
//                               }`}
//                             />
//                             {user.enabled ? "Active" : "Disabled"}
//                           </span>
//                         </td>

//                         <td className="px-5 py-4 text-right">
//                           <button
//                             onClick={() => void toggleStatus(user)}
//                             disabled={isSaving}
//                             className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
//                               user.enabled
//                                 ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
//                                 : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
//                             }`}
//                           >
//                             {isSaving
//                               ? "Saving..."
//                               : user.enabled
//                                 ? "Disable"
//                                 : "Enable"}
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <div className="flex flex-col justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:flex-row">
//             <span>Changes are saved to the server.</span>
//             <span>{users.length} registered accounts</span>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// function Stat({
//   title,
//   value,
//   icon: Icon,
// }: {
//   title: string;
//   value: number;
//   icon: React.ElementType;
// }) {
//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="flex items-center justify-between">
//         <span className="text-xs font-medium text-slate-500">{title}</span>
//         <Icon size={17} className="text-slate-400" />
//       </div>
//       <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }

// function RoleSummary({
//   title,
//   description,
//   count,
//   color,
// }: {
//   title: string;
//   description: string;
//   count: number;
//   color: "violet" | "blue" | "emerald";
// }) {
//   const styles = {
//     violet: "border-violet-100 bg-violet-50 text-violet-700",
//     blue: "border-blue-100 bg-blue-50 text-blue-700",
//     emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <p className="font-semibold text-slate-900">{title}</p>
//           <p className="mt-1 text-xs text-slate-500">{description}</p>
//         </div>
//         <span className={`rounded-lg border px-3 py-2 text-lg font-bold ${styles[color]}`}>
//           {count}
//         </span>
//       </div>
//     </div>
//   );
// }



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Building2,
  AlertCircle,
  CheckCircle2,
  Save,
  ChevronDown,
  Shield,
  BriefcaseBusiness,
} from "lucide-react";

type Role = "ADMIN" | "OPERATOR" | "EMPLOYEE";

type AppUser = {
  id: string;
  name: string;
  email: string | null;
  username: string;
  role: Role;
  tenantId: string;
  enabled: boolean;
};

const ROLE_OPTIONS: Role[] = [
  "EMPLOYEE",
  "OPERATOR",
  "ADMIN",
];

export default function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [roleDrafts, setRoleDrafts] = useState<Record<string, Role>>({});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Load users
  const loadUsers = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || `Unable to load users (${response.status})`
        );
      }

      const list = Array.isArray(data) ? data : data?.users;

      if (!Array.isArray(list)) {
        throw new Error("Invalid users response from backend.");
      }

      setUsers(list);
      setRoleDrafts({});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  // Statistics
  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    operators: users.filter((u) => u.role === "OPERATOR").length,
    employees: users.filter((u) => u.role === "EMPLOYEE").length,
    active: users.filter((u) => u.enabled).length,
    disabled: users.filter((u) => !u.enabled).length,
  }), [users]);

  // Search and filters
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        (user.name || "").toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term) ||
        (user.tenantId || "").toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.enabled) ||
        (statusFilter === "DISABLED" && !user.enabled);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Single PATCH API for role and status updates
  async function updateUser(
    user: AppUser,
    changes: {
      role?: Role;
      enabled?: boolean;
    }
  ) {
    const updatedUser = {
      id: user.id,
      role: changes.role ?? user.role,
      enabled: changes.enabled ?? user.enabled,
    };

    setSaving(user.username);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || `Update failed (${response.status})`
        );
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                role: updatedUser.role,
                enabled: updatedUser.enabled,
              }
            : item
        )
      );

      setRoleDrafts((current) => {
        const next = { ...current };
        delete next[user.username];
        return next;
      });

      setNotice(
        data?.message || `${user.username} updated successfully.`
      );

      await loadUsers(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update user."
      );
    } finally {
      setSaving(null);
    }
  }

  function changeRole(user: AppUser, role: Role) {
    setRoleDrafts((current) => ({
      ...current,
      [user.username]: role,
    }));
  }

  function resetFilters() {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ShieldCheck size={17} />
              Administration
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              User Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage users, permissions and account access.
            </p>
          </div>

          <button
            onClick={() => void loadUsers(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {notice && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />
            {notice}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard title="Total Users" value={stats.total} icon={Users} />
          <StatCard title="Administrators" value={stats.admins} icon={ShieldCheck} />
          <StatCard title="Operators" value={stats.operators} icon={BriefcaseBusiness} />
          <StatCard title="Employees" value={stats.employees} icon={Users} />
          <StatCard title="Active" value={stats.active} icon={UserCheck} />
          <StatCard title="Disabled" value={stats.disabled} icon={UserX} />
        </div>

        {/* Role overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <RoleCard
            title="Administrators"
            description="Full administrative access"
            count={stats.admins}
            icon={ShieldCheck}
            color="violet"
          />

          <RoleCard
            title="Operators"
            description="Operational controls and job management"
            count={stats.operators}
            icon={BriefcaseBusiness}
            color="blue"
          />

          <RoleCard
            title="Employees"
            description="Standard application access"
            count={stats.employees}
            icon={Users}
            color="emerald"
          />
        </div>

        {/* Main table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Table heading */}
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Users
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredUsers.length} of {users.length} accounts
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users size={40} className="mx-auto text-slate-300" />

              <h3 className="mt-3 font-semibold text-slate-800">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={resetFilters}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">

                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Tenant</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const selectedRole =
                      roleDrafts[user.username] ?? user.role;

                    const hasRoleChanged =
                      selectedRole !== user.role;

                    const isSaving = saving === user.username;

                    return (
                      <tr
                        key={user.id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                              {(user.name || user.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900">
                                {user.name || user.username}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                <Mail size={12} />
                                {user.email || "No email"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tenant */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Building2
                              size={15}
                              className="shrink-0 text-slate-400"
                            />
                            <span>{user.tenantId || "—"}</span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <select
                                value={selectedRole}
                                disabled={isSaving}
                                onChange={(e) =>
                                  changeRole(
                                    user,
                                    e.target.value as Role
                                  )
                                }
                                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                              >
                                {ROLE_OPTIONS.map((role) => (
                                  <option key={role} value={role}>
                                    {role}
                                  </option>
                                ))}
                              </select>

                              <ChevronDown
                                size={13}
                                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                            </div>

                            {hasRoleChanged && (
                              <button
                                onClick={() =>
                                  void updateUser(user, {
                                    role: selectedRole,
                                  })
                                }
                                disabled={isSaving}
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                              >
                                <Save size={13} />
                                Save
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge enabled={user.enabled} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              const action = user.enabled
                                ? "disable"
                                : "enable";

                              if (
                                window.confirm(
                                  `Are you sure you want to ${action} ${user.username}?`
                                )
                              ) {
                                void updateUser(user, {
                                  enabled: !user.enabled,
                                });
                              }
                            }}
                            disabled={isSaving}
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                              user.enabled
                                ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                                : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {isSaving
                              ? "Saving..."
                              : user.enabled
                                ? "Disable"
                                : "Enable"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:flex-row">
            <span>Changes are saved to the server.</span>
            <span>{users.length} registered accounts</span>
          </div>
        </section>
      </div>
    </div>
  );
}

// Statistics card
function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: ElementType;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">
          {title}
        </span>
        <Icon size={17} className="text-slate-400" />
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

// Role overview card
function RoleCard({
  title,
  description,
  count,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  count: number;
  icon: ElementType;
  color: "violet" | "blue" | "emerald";
}) {
  const styles = {
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${styles[color]}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {count}
      </p>
      <p className="text-xs text-slate-500">Users assigned</p>
    </div>
  );
}

// Status badge
function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        enabled
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          enabled ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {enabled ? "Active" : "Disabled"}
    </span>
  );
}
