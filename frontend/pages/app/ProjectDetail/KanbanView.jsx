import { useState } from "react";
import { useDispatch } from "react-redux";
import { openTask } from "../../../store/features/ui";
import { Avatar, Badge, Select } from "../../../components/Common";
import { fmtDate, isOverdue, STATUSES } from "../../../utils/format";

const KanbanView = ({ project, tasks, canManage, me }) => {
  const dispatch = useDispatch();
  const [over, setOver] = useState(null);
  const locked = project.isArchived;

  const drop = (status) => (event) => {
    event.preventDefault();
    setOver(null);
    const id = event.dataTransfer.getData("text/plain");
    const task = tasks.tasks.find((item) => item._id === id);
    if (task && task.status !== status && !locked && (canManage || task.assignee?._id === me?._id)) tasks.patch(id, { status });
  };

  return (
    <div className="kanban">
      {STATUSES.map(([status, text]) => {
        const items = tasks.tasks.filter((task) => task.status === status);
        return (
          <section
            key={status}
            className={`column ${over === status ? "over" : ""}`}
            aria-label={text}
            onDragOver={(event) => {
              event.preventDefault();
              setOver(status);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={drop(status)}
          >
            <h3>
              {text} <span className="count">{items.length}</span>
            </h3>
            {items.length === 0 && <p className="muted small">No tasks</p>}
            {items.map((task) => (
              <article key={task._id} className="card kcard" draggable={!locked && (canManage || task.assignee?._id === me?._id)} onDragStart={(event) => event.dataTransfer.setData("text/plain", task._id)}>
                <button className="link-btn" onClick={() => dispatch(openTask(task._id))}>
                  {task.title}
                </button>
                <div className="row between small">
                  <Badge kind="priority" value={task.priority} />
                  <span className={isOverdue(task) ? "overdue-text" : "muted"}>{fmtDate(task.dueDate)}</span>
                </div>
                <div className="row between small">
                  <span className="row muted">
                    {task.assignee ? <Avatar name={task.assignee.name} size={22} /> : null}
                    {task.assignee ? task.assignee.name : "Unassigned"}
                  </span>
                  <Select label="Move to" value={task.status} options={STATUSES} disabled={locked || (!canManage && task.assignee?._id !== me?._id)} onChange={(next) => tasks.patch(task._id, { status: next })} />
                </div>
                <span className="muted small">by {task.createdBy?.name}</span>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
};

export default KanbanView;
