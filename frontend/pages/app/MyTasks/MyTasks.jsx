import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiCheckSquare, FiPlus } from "react-icons/fi";
import { useTasks } from "../../../hooks/useTasks";
import { useConfirm } from "../../../hooks/useConfirm";
import { openOverlay } from "../../../store/features/ui";
import { Empty, ErrorState, Select, Skeleton } from "../../../components/Common";
import TaskTable from "../../../components/TaskTable";
import { dayRange, PRIORITIES, STATUSES } from "../../../utils/format";

const TABS = [
  ["all", "All"],
  ["personal", "Personal"],
  ["assigned", "Assigned"],
  ["completed", "Completed"],
];

const SORTS = [
  ["dueDate", "Due date"],
  ["priority", "Priority"],
  ["createdAt", "Created date"],
  ["updatedAt", "Updated date"],
];

const DUE = [
  ["", "Any due date"],
  ["today", "Due today"],
  ["week", "Next 7 days"],
  ["overdue", "Overdue"],
];

const dueParams = (due) => {
  if (due === "today") return dayRange();
  if (due === "week") return dayRange(0, 7);
  if (due === "overdue") return { dueTo: new Date(Date.parse(dayRange().from) - 1).toISOString(), open: 1 };
  return {};
};

const rename = ({ from, to, ...rest }) => (from ? { ...rest, dueFrom: from, dueTo: to } : rest);

const MyTasks = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.workspace.projects);
  const [ask, dialog] = useConfirm();
  const [tab, setTab] = useState("all");
  const [filters, setFilters] = useState({ status: "", priority: "", filterProject: "", assignee: "", due: "" });
  const [sort, setSort] = useState({ sort: "dueDate", order: "asc" });
  const set = (key) => (value) => setFilters({ ...filters, [key]: value });

  const { due, ...plain } = filters;
  const params = Object.fromEntries(
    Object.entries({ scope: tab === "all" ? "" : tab, ...plain, ...sort, ...rename(dueParams(due)) }).filter(([, value]) => value !== "")
  );
  const { tasks, error, loading, reload, patch, remove } = useTasks(params);
  const filtered = Object.values(filters).some(Boolean);

  const confirmRemove = async (task) => {
    if (await ask(`Delete "${task.title}"?`)) remove(task._id);
  };

  return (
    <div className="stack gap-lg">
      <header className="row between wrap">
        <div>
          <h1>My tasks</h1>
          <p className="muted">{tasks ? `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}` : "Loading tasks"}</p>
        </div>
        <button className="btn primary" onClick={() => dispatch(openOverlay("quick"))}>
          <FiPlus /> Quick add
        </button>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map(([key, text]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
            {text}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <Select label="Status" value={filters.status} options={[["", "Any status"], ...STATUSES]} onChange={set("status")} />
        <Select label="Priority" value={filters.priority} options={[["", "Any priority"], ...PRIORITIES]} onChange={set("priority")} />
        <Select
          label="Project"
          value={filters.filterProject}
          options={[["", "Any project"], ["none", "Personal"], ...projects.map((p) => [p._id, p.name])]}
          onChange={set("filterProject")}
        />
        <Select label="Assignee" value={filters.assignee} options={[["", "Any assignee"], ["me", "Assigned to me"], ["none", "Unassigned"]]} onChange={set("assignee")} />
        <Select label="Due date" value={filters.due} options={DUE} onChange={set("due")} />
        <span className="grow" />
        <Select label="Sort by" value={sort.sort} options={SORTS} onChange={(value) => setSort({ ...sort, sort: value })} />
        <button className="btn" onClick={() => setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" })}>
          {sort.order === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {error && !tasks ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <Skeleton rows={5} />
      ) : tasks.length === 0 ? (
        filtered || tab !== "all" ? (
          <Empty
            icon={FiCheckSquare}
            title="No matching tasks"
            text="Try a different tab or clear your filters."
            action={
              <button
                className="btn"
                onClick={() => {
                  setTab("all");
                  setFilters({ status: "", priority: "", filterProject: "", assignee: "", due: "" });
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <Empty
            icon={FiCheckSquare}
            title="No tasks yet"
            text="Add a task to start tracking your work."
            action={
              <button className="btn primary" onClick={() => dispatch(openOverlay("quick"))}>
                Add your first task
              </button>
            }
          />
        )
      ) : (
        <TaskTable tasks={tasks} onPatch={patch} onRemove={confirmRemove} />
      )}
      {dialog}
    </div>
  );
};

export default MyTasks;
