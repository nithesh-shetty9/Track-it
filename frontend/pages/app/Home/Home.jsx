import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { FiAlertTriangle, FiCalendar, FiCheckCircle, FiClock, FiFolder, FiList } from "react-icons/fi";
import api from "../../../api/index";
import { useResource } from "../../../hooks/useResource";
import { useToggleTask } from "../../../hooks/useTasks";
import { openOverlay, openTask } from "../../../store/features/ui";
import { Avatar, AvatarStack, Badge, Empty, ErrorState, Progress, Skeleton } from "../../../components/Common";
import { ago, dayRange, fmtDate, greeting, isOverdue } from "../../../utils/format";
import "./Home.css";

const STAT_CARDS = [
  ["total", "Total tasks", FiList],
  ["completed", "Completed", FiCheckCircle],
  ["inProgress", "In progress", FiClock],
  ["projects", "Projects", FiFolder],
];

const Section = ({ title, action, children }) => (
  <section className="card">
    <div className="row between">
      <h2>{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const toggle = useToggleTask();
  const range = useMemo(() => dayRange(), []);
  const { data, error, loading, reload } = useResource(() => api.dashboard(range), "home");

  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  if (loading) return <Skeleton rows={6} />;

  const { stats, today, upcoming, projects } = data;
  const pending = today.filter((task) => task.status !== "DONE").length;

  return (
    <div className="stack gap-lg">
      <header className="row between wrap">
        <div className="home-intro">
          <span className="home-kicker">Workspace overview</span>
          <h1>
            {greeting()}, {user.name.split(" ")[0]}
          </h1>
          <p className="muted">
            {pending ? `You have ${pending} ${pending === 1 ? "task" : "tasks"} that need attention today.` : "You're all caught up for today."}
          </p>
        </div>
        <span className="chip-date">
          <FiCalendar /> {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </header>

      <div className="grid-4">
        {STAT_CARDS.map(([key, text, Icon]) => (
          <div className="card stat" key={key}>
            <Icon aria-hidden="true" />
            <strong>{stats[key]}</strong>
            <span className="muted">{text}</span>
          </div>
        ))}
      </div>

      <section className="card home-pulse" aria-label="Workspace pulse">
        <div className="pulse-copy">
          <span className="home-kicker">Momentum</span>
          <h2>Your work at a glance</h2>
          <p>
            Keep the important work moving. Your live project progress and task counts are summarized here so you can decide what deserves attention next.
          </p>
        </div>
        <div className="pulse-chart" aria-label="Project progress chart">
          {projects.slice(0, 5).map((project) => (
            <div className="pulse-bar" key={project._id} title={`${project.name}: ${project.progress}%`}>
              <span style={{ "--bar-height": `${Math.max(project.progress, 8)}%` }} />
              <small>{project.progress}%</small>
            </div>
          ))}
          {projects.length === 0 && <p className="muted small">Create a project to see progress here.</p>}
        </div>
      </section>

      <div className="grid-2 wide-left">
        <Section
          title="Today's tasks"
          action={
            <Link className="link-btn" to="/tasks">
              View all
            </Link>
          }
        >
          {today.length === 0 ? (
            <Empty icon={FiCheckCircle} title="No tasks for today" text="You're all caught up." />
          ) : (
            <ul className="list">
              {today.map((task) => (
                <li key={task._id} className={task.status === "DONE" ? "done" : ""}>
                  <input type="checkbox" aria-label={`Mark ${task.title} complete`} checked={task.status === "DONE"} onChange={() => toggle(task)} />
                  <div className="grow">
                    <button className="link-btn" onClick={() => dispatch(openTask(task._id))}>
                      {task.title}
                    </button>
                    <div className="muted small">{task.project ? task.project.name : "Personal"}</div>
                  </div>
                  <Badge kind="priority" value={task.priority} />
                  <Badge kind="status" value={task.status} />
                  <span className={`small ${isOverdue(task) ? "overdue-text" : "muted"}`}>{fmtDate(task.dueDate)}</span>
                  {task.assignee && <Avatar name={task.assignee.name} size={24} />}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Project progress">
          {projects.length === 0 ? (
            <Empty
              icon={FiFolder}
              title="No projects yet"
              text="Create your first project to get started."
              action={
                <button className="btn primary" onClick={() => dispatch(openOverlay("project"))}>
                  Create project
                </button>
              }
            />
          ) : (
            <ul className="list">
              {projects.slice(0, 5).map((project) => (
                <li key={project._id} className="col">
                  <div className="row between full">
                    <span className="row">
                      <span className="dot" style={{ "--accent": project.color }} /> {project.name}
                    </span>
                    <Link className="link-btn" to={`/projects/${project._id}`}>
                      Open
                    </Link>
                  </div>
                  <Progress value={project.progress} color={project.color} />
                  <span className="muted small">
                    {project.doneCount}/{project.taskCount} tasks · {project.progress}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="grid-2">
        <Section title="Recent projects">
          {projects.length === 0 ? (
            <Empty icon={FiFolder} title="No recent projects" text="Projects you work on will show up here." />
          ) : (
            <ul className="list">
              {projects.slice(0, 4).map((project) => (
                <li key={project._id}>
                  <div className="grow">
                    <Link className="link-btn" to={`/projects/${project._id}`}>
                      {project.name}
                    </Link>
                    <div className="muted small">
                      {project.type === "TEAM" ? "Team" : "Personal"} · {project.progress}% · Updated {ago(project.updatedAt)}
                    </div>
                  </div>
                  <AvatarStack members={project.members} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Upcoming deadlines">
          {upcoming.length === 0 ? (
            <Empty icon={FiCalendar} title="No upcoming deadlines" text="Tasks with due dates will appear here." />
          ) : (
            <ul className="list">
              {upcoming.map((task) => (
                <li key={task._id}>
                  <div className="grow">
                    <button className="link-btn" onClick={() => dispatch(openTask(task._id))}>
                      {task.title}
                    </button>
                    <div className="muted small">{task.project ? task.project.name : "Personal"}</div>
                  </div>
                  <Badge kind="priority" value={task.priority} />
                  {isOverdue(task) && (
                    <span className="overdue-text small row">
                      <FiAlertTriangle /> Overdue
                    </span>
                  )}
                  <span className={`small ${isOverdue(task) ? "overdue-text" : "muted"}`}>{fmtDate(task.dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
};

export default Home;
