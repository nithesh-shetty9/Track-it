import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { FiBell, FiCheck } from "react-icons/fi";
import api, { errorMessage } from "../../../api/index";
import { useResource } from "../../../hooks/useResource";
import { bump } from "../../../store/features/workspace";
import { openTask, toast } from "../../../store/features/ui";
import { Empty, ErrorState, Skeleton } from "../../../components/Common";
import { ago } from "../../../utils/format";

const TYPES = {
  TASK_ASSIGNED: "Task assigned",
  TASK_COMPLETED: "Task completed",
  ADDED_TO_PROJECT: "Added to project",
  REMOVED_FROM_PROJECT: "Removed from project",
  PROJECT_JOINED: "New member",
  DEADLINE: "Upcoming deadline",
};

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, error, loading, reload } = useResource(() => api.notifications(), "notifications");

  const markRead = async (id) => {
    try {
      await api.markRead(id);
      dispatch(bump());
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
  };

  const open = async (item) => {
    if (!item.read) await markRead(item._id);
    if (item.task && item.type !== "TASK_COMPLETED") dispatch(openTask(item.task));
    else if (item.project && item.type !== "REMOVED_FROM_PROJECT") navigate(`/projects/${item.project}`);
  };

  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  if (loading) return <Skeleton rows={5} />;

  return (
    <div className="stack gap-lg narrow">
      <header className="row between wrap">
        <div>
          <h1>Notifications</h1>
          <p className="muted">{data.unread ? `${data.unread} unread` : "You're all caught up"}</p>
        </div>
        <button className="btn" disabled={!data.unread} onClick={() => markRead()}>
          <FiCheck /> Mark all as read
        </button>
      </header>
      {data.notifications.length === 0 ? (
        <Empty icon={FiBell} title="No notifications" text="Assignments, completions and deadlines will show up here." />
      ) : (
        <ul className="card list">
          {data.notifications.map((item) => (
            <li key={item._id} className={item.read ? "" : "unread"}>
              <span className="unread-dot" aria-label={item.read ? "Read" : "Unread"} />
              <button className="grow text-btn" onClick={() => open(item)}>
                <strong>{TYPES[item.type]}</strong>
                <span>{item.message}</span>
              </button>
              <span className="muted small">{ago(item.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
