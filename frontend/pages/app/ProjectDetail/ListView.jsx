import { useState } from "react";
import { FiCheckSquare } from "react-icons/fi";
import { Empty, Select } from "../../../components/Common";
import TaskTable from "../../../components/TaskTable";
import { PRIORITIES, STATUSES } from "../../../utils/format";

const SORTS = [
  ["dueDate", "Due date"],
  ["priority", "Priority"],
  ["createdAt", "Created date"],
  ["updatedAt", "Updated date"],
];

const RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const KEYS = {
  dueDate: (t) => (t.dueDate ? +new Date(t.dueDate) : Infinity),
  priority: (t) => RANK[t.priority],
  createdAt: (t) => +new Date(t.createdAt),
  updatedAt: (t) => +new Date(t.updatedAt),
};

const ListView = ({ project, tasks, members, onCreate, ask, canManage, me }) => {
  const [filters, setFilters] = useState({ status: "", priority: "", assignee: "" });
  const [sort, setSort] = useState("dueDate");
  const [title, setTitle] = useState("");
  const locked = project.isArchived;

  const visible = tasks.tasks
    .filter(
      (task) =>
        (!filters.status || task.status === filters.status) &&
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.assignee || (filters.assignee === "none" ? !task.assignee : task.assignee?._id === filters.assignee))
    )
    .sort((a, b) => (KEYS[sort](a) === KEYS[sort](b) ? 0 : KEYS[sort](a) < KEYS[sort](b) ? -1 : 1));

  const submit = async (event) => {
    event.preventDefault();
    await onCreate({ title });
    setTitle("");
  };

  const remove = async (task) => {
    if (await ask(`Delete "${task.title}"?`)) tasks.remove(task._id);
  };

  return (
    <div className="stack">
      {!locked && canManage && (
        <form className="row add-row" onSubmit={submit}>
          <input className="input grow" aria-label="New task title" placeholder="Add a task and press Enter" value={title} onChange={(event) => setTitle(event.target.value)} />
          <button className="btn primary" disabled={!title.trim()}>
            Add task
          </button>
        </form>
      )}
      <div className="toolbar">
        <Select label="Status" value={filters.status} options={[["", "Any status"], ...STATUSES]} onChange={(status) => setFilters({ ...filters, status })} />
        <Select label="Priority" value={filters.priority} options={[["", "Any priority"], ...PRIORITIES]} onChange={(priority) => setFilters({ ...filters, priority })} />
        <Select
          label="Assignee"
          value={filters.assignee}
          options={[["", "Anyone"], ["none", "Unassigned"], ...members.map((m) => [m.user._id, m.user.name])]}
          onChange={(assignee) => setFilters({ ...filters, assignee })}
        />
        <span className="grow" />
        <Select label="Sort by" value={sort} options={SORTS} onChange={setSort} />
      </div>
      {visible.length === 0 ? (
        <Empty
          icon={FiCheckSquare}
          title={tasks.tasks.length ? "No matching tasks" : "No tasks yet"}
          text={tasks.tasks.length ? "Try clearing your filters." : "Add the first task to this project."}
        />
      ) : (
        <TaskTable tasks={visible} members={locked ? undefined : members} showProject={false} canManage={canManage && !locked} me={me} onPatch={tasks.patch} onRemove={remove} />
      )}
    </div>
  );
};

export default ListView;
