import { FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { openTask } from "../store/features/ui";
import { Avatar, Select } from "./Common";
import { fmtDate, fromInput, isOverdue, PRIORITIES, STATUSES, toInput } from "../utils/format";

const TaskTable = ({ tasks, onPatch, onRemove, members, showProject = true }) => {
  const dispatch = useDispatch();
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Due date</th>
            <th>Created by</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className={task.status === "DONE" ? "done" : ""}>
              <td>
                <div className="task-cell">
                  <input
                    type="checkbox"
                    aria-label={`Mark ${task.title} complete`}
                    checked={task.status === "DONE"}
                    onChange={(event) => onPatch(task._id, { status: event.target.checked ? "DONE" : "TODO" })}
                  />
                  <button className="link-btn" onClick={() => dispatch(openTask(task._id))}>
                    {task.title}
                  </button>
                  {showProject && task.project && (
                    <span className="chip" style={{ "--chip": task.project.color }}>
                      {task.project.name}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <Select label="Status" value={task.status} options={STATUSES} onChange={(status) => onPatch(task._id, { status })} />
              </td>
              <td>
                <Select label="Priority" value={task.priority} options={PRIORITIES} onChange={(priority) => onPatch(task._id, { priority })} />
              </td>
              <td>
                {members ? (
                  <Select
                    label="Assignee"
                    value={task.assignee?._id || ""}
                    options={[["", "Unassigned"], ...members.map((m) => [m.user._id, m.user.name])]}
                    onChange={(assignee) => onPatch(task._id, { assignee: assignee || null })}
                  />
                ) : task.assignee ? (
                  <Avatar name={task.assignee.name} />
                ) : (
                  <span className="muted">—</span>
                )}
              </td>
              <td>
                <input
                  type="date"
                  className={`date ${isOverdue(task) ? "overdue" : ""}`}
                  aria-label="Due date"
                  value={toInput(task.dueDate)}
                  onChange={(event) => onPatch(task._id, { dueDate: fromInput(event.target.value) })}
                />
              </td>
              <td className="muted">{task.createdBy?.name}</td>
              <td>
                <button className="icon-btn" aria-label={`Delete ${task.title}`} title={`Created ${fmtDate(task.createdAt)}`} onClick={() => onRemove(task)}>
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
