import { useDispatch, useSelector } from "react-redux";
import { FiCheckCircle, FiRotateCcw, FiTrash2 } from "react-icons/fi";
import Drawer from "./Drawer";
import { Avatar, ErrorState, Select, Skeleton } from "./Common";
import api, { errorMessage } from "../api/index";
import { bump } from "../store/features/workspace";
import { closeTask, toast } from "../store/features/ui";
import { useResource } from "../hooks/useResource";
import { useConfirm } from "../hooks/useConfirm";
import { fmtDateTime, fromInput, PRIORITIES, STATUSES, toInput } from "../utils/format";

const TaskBody = ({ id, onClose }) => {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.auth.user);
  const [ask, dialog] = useConfirm();
  const { data, error, reload } = useResource(() => api.tasks.get(id), id);
  const task = data?.task;
  const projectId = task?.project?._id;
  const people = useResource(() => (projectId ? api.projects.members(projectId) : Promise.resolve({ members: [] })), projectId || "none");
  const members = people.data?.members || [];
  const myRole = members.find((member) => member.user._id === me?._id)?.role;
  const assignable = myRole === "MEMBER" ? members.filter((member) => member.user._id === me._id) : members;
  const locked = Boolean(task?.project?.isArchived);

  const save = async (changes) => {
    try {
      await api.tasks.update(id, changes);
      dispatch(bump());
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
  };

  const remove = async () => {
    if (!(await ask("Delete this task? This cannot be undone."))) return;
    try {
      await api.tasks.remove(id);
      dispatch(toast("Task deleted"));
      dispatch(bump());
      onClose();
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
  };

  const onBlur = (field) => (event) => {
    const value = event.target.value.trim();
    if (value !== task[field] && (field !== "title" || value)) save({ [field]: value });
  };

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!task) return <Skeleton rows={5} />;

  return (
    <>
      {locked && <p className="notice">This project is archived. Restore it to edit tasks.</p>}
      <input key={`${task.updatedAt}t`} className="title-input" aria-label="Title" defaultValue={task.title} disabled={locked} onBlur={onBlur("title")} />
      <textarea
        key={`${task.updatedAt}d`}
        className="textarea"
        aria-label="Description"
        placeholder="Add a description"
        rows={4}
        defaultValue={task.description}
        disabled={locked}
        onBlur={onBlur("description")}
      />
      <dl className="fields">
        <dt>Status</dt>
        <dd>
          <Select label="Status" value={task.status} options={STATUSES} disabled={locked} onChange={(status) => save({ status })} />
        </dd>
        <dt>Priority</dt>
        <dd>
          <Select label="Priority" value={task.priority} options={PRIORITIES} disabled={locked} onChange={(priority) => save({ priority })} />
        </dd>
        <dt>Assignee</dt>
        <dd>
          {task.project ? (
            <Select
              label="Assignee"
              value={task.assignee?._id || ""}
              disabled={locked}
              options={[["", "Unassigned"], ...assignable.map((member) => [member.user._id, member.user.name])]}
              onChange={(assignee) => save({ assignee: assignee || null })}
            />
          ) : (
            <span className="muted">Personal task</span>
          )}
        </dd>
        <dt>Project</dt>
        <dd>{task.project ? task.project.name : <span className="muted">None</span>}</dd>
        <dt>Due date</dt>
        <dd>
          <input type="date" className="date" aria-label="Due date" disabled={locked} value={toInput(task.dueDate)} onChange={(event) => save({ dueDate: fromInput(event.target.value) })} />
        </dd>
        <dt>Created by</dt>
        <dd>
          <span className="row">
            <Avatar name={task.createdBy?.name} size={22} /> {task.createdBy?.name}
          </span>
        </dd>
        <dt>Created</dt>
        <dd>{fmtDateTime(task.createdAt)}</dd>
        <dt>Updated</dt>
        <dd>{fmtDateTime(task.updatedAt)}</dd>
        <dt>Completed</dt>
        <dd>{fmtDateTime(task.completedAt)}</dd>
      </dl>
      <div className="row end">
        <button className="btn danger" disabled={locked || myRole === "MEMBER"} onClick={remove}>
          <FiTrash2 /> Delete
        </button>
        <button className="btn primary" disabled={locked} onClick={() => save({ status: task.status === "DONE" ? "TODO" : "DONE" })}>
          {task.status === "DONE" ? <FiRotateCcw /> : <FiCheckCircle />} {task.status === "DONE" ? "Reopen" : "Complete"}
        </button>
      </div>
      {dialog}
    </>
  );
};

const TaskDrawer = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.ui.taskId);
  const close = () => dispatch(closeTask());
  return (
    <Drawer open={Boolean(id)} onClose={close} title="Task details">
      {id && <TaskBody key={id} id={id} onClose={close} />}
    </Drawer>
  );
};

export default TaskDrawer;
