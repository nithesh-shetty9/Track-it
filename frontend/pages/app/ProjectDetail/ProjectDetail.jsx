import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { FiArchive, FiArrowLeft, FiEdit2, FiKey, FiMoreHorizontal, FiRotateCcw } from "react-icons/fi";
import api, { errorMessage } from "../../../api/index";
import { useResource } from "../../../hooks/useResource";
import { useTasks } from "../../../hooks/useTasks";
import { useConfirm } from "../../../hooks/useConfirm";
import { bump } from "../../../store/features/workspace";
import { openOverlay, toast } from "../../../store/features/ui";
import { AvatarStack, ErrorState, Progress, Skeleton } from "../../../components/Common";
import { CopyCode } from "../../../components/ProjectDrawers";
import { fmtDate } from "../../../utils/format";
import ListView from "./ListView";
import KanbanView from "./KanbanView";
import TimelineView from "./TimelineView";
import TeamView from "./TeamView";
import "./ProjectDetail.css";

const VIEWS = [
  ["list", "List"],
  ["kanban", "Kanban"],
  ["timeline", "Timeline"],
  ["team", "Team"],
];

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const me = useSelector((state) => state.auth.user);
  const [ask, dialog] = useConfirm();
  const [view, setView] = useState("list");
  const [code, setCode] = useState(null);
  const project = useResource(() => api.projects.get(id), id);
  const people = useResource(() => api.projects.members(id), id);
  const tasks = useTasks({ project: id });

  const info = project.data?.project;
  const members = people.data?.members || [];
  const role = info?.role;
  const canManage = role === "OWNER" || role === "ADMIN";

  const act = async (work, message) => {
    try {
      await work();
      dispatch(toast(message));
      dispatch(bump());
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
  };

  const archive = async () => {
    if (!(await ask("Archive this project? It will be hidden from your active lists and become read-only."))) return;
    await act(() => api.projects.archive(id), "Project archived");
  };

  const showCode = async () => {
    try {
      setCode((await api.projects.joinCode(id)).joinCode);
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
    }
  };

  const createTask = (body) => act(() => api.tasks.create({ ...body, project: id }), "Task created");

  if (project.error && !info) {
    return <ErrorState message={project.error} onRetry={project.reload} />;
  }
  if (!info) return <Skeleton rows={6} />;

  const shared = { project: info, tasks, members, me, role, canManage };

  return (
    <div className="stack gap-lg">
      <header className="project-head" style={{ "--accent": info.color }}>
        <Link className="link-btn row" to="/projects">
          <FiArrowLeft /> Projects
        </Link>
        <div className="row between wrap">
          <div className="row">
            <span className="dot big" />
            <div>
              <h1>{info.name}</h1>
              <p className="muted">{info.description || "No description"}</p>
            </div>
          </div>
          <details className="menu">
            <summary className="btn" aria-label="Project actions">
              <FiMoreHorizontal /> Actions
            </summary>
            <div className="menu-list">
              {canManage && !info.isArchived && (
                <button onClick={() => dispatch(openOverlay({ name: "project", data: info }))}>
                  <FiEdit2 /> Edit project
                </button>
              )}
              {role === "OWNER" && info.type === "TEAM" && !info.isArchived && (
                <button onClick={showCode}>
                  <FiKey /> Show join code
                </button>
              )}
              {role === "OWNER" && !info.isArchived && (
                <button onClick={archive}>
                  <FiArchive /> Archive project
                </button>
              )}
              {role === "OWNER" && info.isArchived && (
                <button onClick={() => act(() => api.projects.update(id, { isArchived: false }), "Project restored")}>
                  <FiRotateCcw /> Restore project
                </button>
              )}
              {!canManage && !info.isArchived && <span className="muted pad small">No actions available for your role</span>}
            </div>
          </details>
        </div>
        {info.isArchived && <p className="notice">This project is archived and read-only.</p>}
        {code && (
          <div className="notice">
            <p>Share this code to invite teammates.</p>
            <CopyCode code={code} />
          </div>
        )}
        <div className="row wrap small">
          <span className={`badge type-${info.type}`}>{info.type === "TEAM" ? "Team" : "Personal"}</span>
          <span>
            {info.doneCount}/{info.taskCount} tasks complete
          </span>
          <span className="muted">
            {fmtDate(info.startDate, "No start")} – {fmtDate(info.dueDate, "No due date")}
          </span>
          <AvatarStack members={info.members} max={6} />
        </div>
        <Progress value={info.progress} color={info.color} />
        <span className="muted small">{info.progress}% complete</span>
      </header>

      <div className="tabs" role="tablist">
        {VIEWS.map(([key, text]) => (
          <button key={key} role="tab" aria-selected={view === key} className={view === key ? "on" : ""} onClick={() => setView(key)}>
            {text}
          </button>
        ))}
      </div>

      {tasks.error && !tasks.tasks && view !== "team" ? (
        <ErrorState message={tasks.error} onRetry={tasks.reload} />
      ) : view !== "team" && tasks.loading ? (
        <Skeleton rows={4} />
      ) : view === "list" ? (
        <ListView {...shared} onCreate={createTask} ask={ask} />
      ) : view === "kanban" ? (
        <KanbanView {...shared} />
      ) : view === "timeline" ? (
        <TimelineView {...shared} />
      ) : people.error && !people.data ? (
        <ErrorState message={people.error} onRetry={people.reload} />
      ) : (
        <TeamView {...shared} ask={ask} act={act} onLeave={() => navigate("/projects")} />
      )}
      {dialog}
    </div>
  );
};

export default ProjectDetail;
