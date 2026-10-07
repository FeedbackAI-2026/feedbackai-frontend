"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { subscribeFeedback, type Feedback } from "@/lib/feedback";
import AdminGuard from "@/components/AdminGuard";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  FileSpreadsheet,
  Loader2,
  LogOut,
  Mail,
  MessageSquareText,
  Sparkles,
  Brain,
  Flag,
} from "lucide-react";

type AnalysisStatus = "NEW" | "ANALYZED" | string;

const STATUS_META: Record<
  string,
  {
    label: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  NEW: {
    label: "New",
    badge: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
    icon: AlertCircle,
  },
  ANALYZED: {
    label: "Analyzed",
    badge: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
    icon: Brain,
  },
  nouveau: {
    label: "New",
    badge: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
    icon: AlertCircle,
  },
  en_cours: {
    label: "In progress",
    badge: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
    icon: Clock3,
  },
  resolu: {
    label: "Resolved",
    badge: "bg-green-50 text-green-600 ring-1 ring-green-200",
    icon: CheckCircle2,
  },
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "#3b82f6",
  ANALYZED: "#8b5cf6",
  nouveau: "#3b82f6",
  en_cours: "#f59e0b",
  resolu: "#22c55e",
};

const CATEGORY_COLORS = [
  "#E60000",
  "#f59e0b",
  "#3b82f6",
  "#22c55e",
  "#8b5cf6",
  "#64748b",
  "#ec4899",
  "#06b6d4",
];

function formatDate(iso?: string) {
  if (!iso) return "—";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEnum(value?: string) {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusMeta(status?: string) {
  return (
    STATUS_META[status ?? ""] ?? {
      label: formatEnum(status) || "Unknown",
      badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      icon: AlertCircle,
    }
  );
}

function getSentimentMeta(sentiment?: string) {
  switch (sentiment) {
    case "POSITIVE":
      return {
        label: "Positive",
        className: "bg-green-50 text-green-600 ring-1 ring-green-200",
      };

    case "NEGATIVE":
      return {
        label: "Negative",
        className: "bg-red-50 text-red-600 ring-1 ring-red-200",
      };

    case "NEUTRAL":
      return {
        label: "Neutral",
        className: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
      };

    default:
      return {
        label: "—",
        className: "bg-slate-50 text-slate-400 ring-1 ring-slate-200",
      };
  }
}

function getPriorityMeta(priority?: string) {
  switch (priority) {
    case "HIGH":
      return {
        label: "High",
        className: "bg-red-50 text-red-600 ring-1 ring-red-200",
      };

    case "MEDIUM":
      return {
        label: "Medium",
        className: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
      };

    case "LOW":
      return {
        label: "Low",
        className: "bg-green-50 text-green-600 ring-1 ring-green-200",
      };

    default:
      return {
        label: "—",
        className: "bg-slate-50 text-slate-400 ring-1 ring-slate-200",
      };
  }
}

function Dashboard() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [ready, setReady] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeFeedback(
      (data) => {
        setItems(data);
        setReady(true);
        setApiError("");
      },
      (error) => {
        setApiError(error.message);
        setReady(true);
      },
    );

    return unsubscribe;
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        items
          .map((item) => item.category)
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return unique.sort();
  }, [items]);

  const statuses = useMemo(() => {
    const unique = Array.from(
      new Set(
        items
          .map((item) => item.status)
          .filter((status): status is string => Boolean(status)),
      ),
    );

    return unique.sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return items.filter((feedback) => {
      if (statusFilter !== "all" && feedback.status !== statusFilter) {
        return false;
      }

      if (categoryFilter !== "all" && feedback.category !== categoryFilter) {
        return false;
      }

      if (term) {
        const haystack = [
          feedback.name,
          feedback.email,
          feedback.message,
          feedback.category,
          feedback.sentiment,
          feedback.priority,
          feedback.mainIssue,
          feedback.aiResponse,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [items, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {};
    const categoriesMap: Record<string, number> = {};
    const sentimentsMap: Record<string, number> = {};
    const prioritiesMap: Record<string, number> = {};
    const dayMap: Record<string, number> = {};

    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);

      dayMap[date] = 0;
    }

    for (const feedback of items) {
      const status = feedback.status || "UNKNOWN";
      const category = feedback.category || "UNKNOWN";
      const sentiment = feedback.sentiment || "UNKNOWN";
      const priority = feedback.priority || "UNKNOWN";

      byStatus[status] = (byStatus[status] || 0) + 1;
      categoriesMap[category] = (categoriesMap[category] || 0) + 1;
      sentimentsMap[sentiment] = (sentimentsMap[sentiment] || 0) + 1;
      prioritiesMap[priority] = (prioritiesMap[priority] || 0) + 1;

      const dateKey = (feedback.createdAt || "").slice(0, 10);

      if (dateKey in dayMap) {
        dayMap[dateKey]++;
      }
    }

    const analyzed = items.filter(
      (feedback) =>
        feedback.status === "ANALYZED" ||
        Boolean(
          feedback.sentiment ||
          feedback.category ||
          feedback.priority ||
          feedback.mainIssue,
        ),
    ).length;

    return {
      total: items.length,
      analyzed,
      pendingAnalysis: items.length - analyzed,
      byStatus,
      categories: Object.entries(categoriesMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      sentiments: Object.entries(sentimentsMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      priorities: Object.entries(prioritiesMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      perDay: Object.entries(dayMap).map(([date, count]) => ({
        date: date.slice(5),
        count,
      })),
    };
  }, [items]);

  const pieData = Object.entries(stats.byStatus).map(([status, value]) => ({
    name: getStatusMeta(status).label,
    value,
    status,
  }));

  function exportExcel() {
    const rows = filtered.map((feedback) => ({
      Date: formatDate(feedback.createdAt),
      Name: feedback.name,
      Email: feedback.email,
      ID: feedback.id,
      Message: feedback.message,
      Sentiment: feedback.sentiment ?? "",
      Category: feedback.category ?? "",
      Priority: feedback.priority ?? "",
      "Main issue": feedback.mainIssue ?? "",
      Status: feedback.status ?? "",
      "AI response": feedback.aiResponse ?? "",
      "Human needed": feedback.needsHuman ? "Yes" : "No",
      "Email sent": feedback.emailSent ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 22 },
      { wch: 30 },
      { wch: 38 },
      { wch: 60 },
      { wch: 16 },
      { wch: 24 },
      { wch: 14 },
      { wch: 60 },
      { wch: 16 },
      { wch: 60 },
      { wch: 16 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");

    XLSX.writeFile(
      workbook,
      `feedback-ooredoo-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  }

  async function logout() {
    await signOut(auth);
    window.location.href = "/login";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-ooredoo-red">
            Administration
          </span>

          <h1 className="mt-1 text-3xl font-extrabold">Feedback Dashboard</h1>

          <p className="mt-1 text-sm text-slate-500">
            Data synchronized with the backend — automatic AI analysis of
            feedback.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 self-center rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            API connected
          </span>

          <button onClick={exportExcel} className="btn-primary !px-4">
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </button>

          <button
            onClick={logout}
            className="btn-outline !px-4"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-ooredoo-red">
          API error: {apiError}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: MessageSquareText,
            color: "bg-ooredoo-red text-white",
          },
          {
            label: "Analyzed",
            value: stats.analyzed,
            icon: Brain,
            color: "bg-violet-500 text-white",
          },
          {
            label: "Pending analysis",
            value: stats.pendingAnalysis,
            icon: Clock3,
            color: "bg-amber-500 text-white",
          },
          {
            label: "Negative",
            value:
              stats.sentiments.find((item) => item.name === "NEGATIVE")
                ?.value ?? 0,
            icon: AlertCircle,
            color: "bg-red-500 text-white",
          },
          {
            label: "High priority",
            value:
              stats.priorities.find((item) => item.name === "HIGH")?.value ?? 0,
            icon: Flag,
            color: "bg-ooredoo-ink text-white",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="card flex items-center gap-4 !p-5">
            <span className={`rounded-xl p-3 ${kpi.color}`}>
              <kpi.icon className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {kpi.label}
              </p>

              <p className="text-2xl font-extrabold">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-4 font-bold">Feedback received — last 14 days</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.perDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  stroke="#a1a1b3"
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  stroke="#a1a1b3"
                  width={28}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  name="Messages"
                  fill="#E60000"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 font-bold">Status distribution</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#64748b"}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI overview */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Sentiment
          </h2>

          <div className="space-y-3">
            {stats.sentiments.length === 0 ? (
              <p className="text-sm text-slate-400">No analysis available.</p>
            ) : (
              stats.sentiments.map((item) => {
                const meta = getSentimentMeta(item.name);

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}
                    >
                      {meta.label}
                    </span>

                    <span className="font-bold">{item.value}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            <Flag className="h-4 w-4 text-amber-500" />
            Priority
          </h2>

          <div className="space-y-3">
            {stats.priorities.length === 0 ? (
              <p className="text-sm text-slate-400">No analysis available.</p>
            ) : (
              stats.priorities.map((item) => {
                const meta = getPriorityMeta(item.name);

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}
                    >
                      {meta.label}
                    </span>

                    <span className="font-bold">{item.value}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card border-l-4 !border-l-violet-500">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4 text-violet-500" />
            AI Analysis
          </h2>

          <p className="text-sm leading-relaxed text-slate-500">
            Each feedback is sent to the backend and then automatically analyzed
            by the AI system.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet-50 p-3">
              <p className="text-xs text-violet-500">Analyzed</p>
              <p className="mt-1 text-xl font-extrabold text-violet-700">
                {stats.analyzed}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-amber-500">Pending</p>
              <p className="mt-1 text-xl font-extrabold text-amber-700">
                {stats.pendingAnalysis}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Table */}
        <div className="card lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h2 className="font-bold">Messages ({filtered.length})</h2>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSearch(searchInput);
                }}
                className="relative"
              >
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search…"
                  className="input-field !w-48 !rounded-full !py-2 !pl-4 text-xs"
                />
              </form>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="input-field !w-auto !rounded-full !py-2 text-xs font-semibold"
              >
                <option value="all">All statuses</option>

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusMeta(status).label}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="input-field !w-auto !rounded-full !py-2 text-xs font-semibold"
              >
                <option value="all">All categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatEnum(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!ready ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">
              No messages match the filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3 pr-4 font-semibold">Date</th>

                    <th className="pb-3 pr-4 font-semibold">Customer</th>

                    <th className="pb-3 pr-4 font-semibold">Category</th>

                    <th className="pb-3 pr-4 font-semibold">Sentiment</th>

                    <th className="pb-3 pr-4 font-semibold">Priority</th>

                    <th className="pb-3 pr-4 font-semibold">Status</th>

                    <th className="pb-3 font-semibold" />
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((feedback) => {
                    const statusMeta = getStatusMeta(feedback.status);

                    const sentimentMeta = getSentimentMeta(feedback.sentiment);

                    const priorityMeta = getPriorityMeta(feedback.priority);

                    return (
                      <tr
                        key={feedback.id}
                        className="cursor-pointer border-b border-slate-50 transition hover:bg-red-50/40"
                        onClick={() => {
                          setSelected(feedback);
                          setDetailOpen(true);
                        }}
                      >
                        <td className="whitespace-nowrap py-3 pr-4 text-xs text-slate-500">
                          {formatDate(feedback.createdAt)}
                        </td>

                        <td className="max-w-[220px] py-3 pr-4">
                          <p className="truncate font-semibold">
                            {feedback.name}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {feedback.email}
                          </p>
                        </td>

                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {formatEnum(feedback.category)}
                          </span>
                        </td>

                        <td className="py-3 pr-4">
                          {feedback.sentiment ? (
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${sentimentMeta.className}`}
                            >
                              {sentimentMeta.label}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>

                        <td className="py-3 pr-4">
                          {feedback.priority ? (
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityMeta.className}`}
                            >
                              {priorityMeta.label}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>

                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.badge}`}
                          >
                            <statusMeta.icon className="h-3.5 w-3.5" />
                            {statusMeta.label}
                          </span>
                        </td>

                        <td className="py-3 text-right">
                          <Eye className="inline h-4 w-4 text-slate-400" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category chart */}
        <div className="card">
          <h2 className="mb-4 font-bold">By category</h2>

          <div className="h-64">
            {stats.categories.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No categories available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categories}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {stats.categories.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {detailOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ooredoo-ink/50 p-4 backdrop-blur-sm"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {(() => {
                  const meta = getStatusMeta(selected.status);

                  return (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                    >
                      <meta.icon className="h-3.5 w-3.5" />
                      {meta.label}
                    </span>
                  );
                })()}

                <h3 className="mt-3 text-xl font-extrabold">
                  Customer feedback
                </h3>

                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  {selected.name}
                  {" · "}
                  <Mail className="h-3.5 w-3.5" />
                  {selected.email}
                </p>
              </div>

              <button
                onClick={() => setDetailOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Analysis cards */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Sentiment</p>

                <p className="mt-1 font-semibold">
                  {getSentimentMeta(selected.sentiment).label}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Category</p>

                <p className="mt-1 font-semibold">
                  {formatEnum(selected.category)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Priority</p>

                <p className="mt-1 font-semibold">
                  {getPriorityMeta(selected.priority).label}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Status</p>

                <p className="mt-1 font-semibold">
                  {getStatusMeta(selected.status).label}
                </p>
              </div>
            </div>

            {/* Date / ID */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Date</p>

                <p className="font-semibold">
                  {formatDate(selected.createdAt)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Feedback ID</p>

                <p className="truncate font-semibold" title={selected.id}>
                  {selected.id}
                </p>
              </div>
            </div>

            {/* Main issue */}
            {selected.mainIssue && (
              <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-violet-600">
                  <Brain className="h-3.5 w-3.5" />
                  AI Analysis — Main issue
                </p>

                <p className="text-sm leading-relaxed text-slate-700">
                  {selected.mainIssue}
                </p>
              </div>
            )}

            {/* Customer message */}
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Customer message
              </p>

              {selected.message}
            </div>

            {/* AI response */}
            <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-violet-600">
                <Sparkles className="h-3.5 w-3.5" />
                AI response
                {selected.emailSent && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                    Sent by email
                  </span>
                )}
              </p>

              {selected.aiResponse ? (
                <p className="text-sm leading-relaxed text-slate-700">
                  {selected.aiResponse}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  The AI response is not available yet.
                </p>
              )}
            </div>

            {/* Human escalation */}
            <div className="mt-4 flex flex-wrap gap-3">
              <div
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  selected.needsHuman
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {selected.needsHuman
                  ? "Human intervention required"
                  : "No human intervention required"}
              </div>

              <div
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  selected.emailSent
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {selected.emailSent ? "Email sent" : "Email not sent"}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${selected.email}`}
                className="btn-primary ml-auto !px-4 !py-2 text-xs"
              >
                <Mail className="h-3.5 w-3.5" />
                Reply manually
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  );
}
