export const STATUSES = [
  ["TODO", "To do"],
  ["IN_PROGRESS", "In progress"],
  ["DONE", "Done"],
];

export const PRIORITIES = [
  ["HIGH", "High"],
  ["MEDIUM", "Medium"],
  ["LOW", "Low"],
];

export const COLORS = ["#14845b", "#d17b50", "#597db5", "#b2923c", "#8668a9", "#398f98"];

export const label = (pairs, value) => pairs.find(([key]) => key === value)?.[1] || value;

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const fmtDate = (value, fallback = "No date") =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : fallback;

export const fmtDateTime = (value) =>
  value ? new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

export const ago = (value) => {
  const seconds = Math.round((new Date(value) - Date.now()) / 1000);
  const units = [["day", 86400], ["hour", 3600], ["minute", 60]];
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return "just now";
};

export const toInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const fromInput = (value) => (value ? new Date(`${value}T12:00:00`).toISOString() : null);

export const dayRange = (offsetDays = 0, spanDays = 1) => {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() + offsetDays);
  const to = new Date(from);
  to.setDate(to.getDate() + spanDays);
  to.setMilliseconds(-1);
  return { from: from.toISOString(), to: to.toISOString() };
};

export const isOverdue = (task) =>
  Boolean(task.dueDate) && task.status !== "DONE" && new Date(task.dueDate) < new Date(dayRange().from);

export const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
};
