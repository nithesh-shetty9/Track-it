import { useDispatch } from "react-redux";
import { FiCalendar } from "react-icons/fi";
import { openTask } from "../../../store/features/ui";
import { Avatar, Badge, Empty } from "../../../components/Common";
import { fmtDate } from "../../../utils/format";

const TimelineView = ({ tasks }) => {
  const dispatch = useDispatch();
  const dated = tasks.tasks.filter((task) => task.dueDate);
  const undated = tasks.tasks.filter((task) => !task.dueDate);

  if (tasks.tasks.length === 0) return <Empty icon={FiCalendar} title="Nothing to schedule" text="Add tasks with due dates to see them on the timeline." />;
  if (dated.length === 0) return <Empty icon={FiCalendar} title="No dated tasks" text="Give tasks a due date to place them on the timeline." />;

  const starts = dated.map((task) => Math.min(+new Date(task.createdAt), +new Date(task.dueDate)));
  const ends = dated.map((task) => +new Date(task.dueDate));
  const min = Math.min(...starts);
  const max = Math.max(...ends, min + 864e5);
  const span = max - min;
  const sorted = [...dated].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="stack">
      <div className="timeline">
        <div className="timeline-scale small muted">
          <span>{fmtDate(min)}</span>
          <span>{fmtDate(max)}</span>
        </div>
        {sorted.map((task) => {
          const start = Math.min(+new Date(task.createdAt), +new Date(task.dueDate));
          const left = ((start - min) / span) * 100;
          const width = Math.max(((+new Date(task.dueDate) - start) / span) * 100, 2);
          return (
            <div className="timeline-row" key={task._id}>
              <div className="timeline-label">
                <button className="link-btn" onClick={() => dispatch(openTask(task._id))}>
                  {task.title}
                </button>
                <span className="row small muted">
                  {task.assignee && <Avatar name={task.assignee.name} size={18} />}
                  {fmtDate(start)} → {fmtDate(task.dueDate)}
                </span>
              </div>
              <div className="timeline-track">
                <span className={`bar ${task.status}`} style={{ left: `${left}%`, width: `${width}%` }} />
              </div>
              <Badge kind="status" value={task.status} />
            </div>
          );
        })}
      </div>
      {undated.length > 0 && (
        <p className="muted small">
          {undated.length} {undated.length === 1 ? "task has" : "tasks have"} no due date and {undated.length === 1 ? "isn't" : "aren't"} shown.
        </p>
      )}
    </div>
  );
};

export default TimelineView;
