import type { ReactNode } from "react";
import { Activity, AlertCircle, CheckCircle2, Clock3, PauseCircle } from "lucide-react";
import type { JobStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    ACTIVE: {
      label: "ACTIVE",
      className: "bg-green-50 text-green-700 ring-green-200",
      icon: "●",
    },
    PAUSED: {
      label: "PAUSED",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
      icon: "Ⅱ",
    },
    COMPLETED: {
      label: "COMPLETED",
      className: "bg-blue-50 text-blue-700 ring-blue-200",
      icon: "✓",
    },
    CANCELLED: {
      label: "CANCELLED",
      className: "bg-slate-100 text-slate-600 ring-slate-200",
      icon: "×",
    },
    FAILED: {
      label: "FAILED",
      className: "bg-red-50 text-red-700 ring-red-200",
      icon: "!",
    },
    RUNNING: {
      label: "RUNNING",
      className: "bg-blue-50 text-blue-700 ring-blue-200",
      icon: "●",
    },
  };

  const current = config[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    icon: "•",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${current.className}`}
    >
      <span>{current.icon}</span>
      {current.label}
    </span>
  );
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-500">
        <Clock3 size={27} />
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}