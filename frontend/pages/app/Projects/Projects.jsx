import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiFolder, FiKey, FiPlus, FiSearch } from "react-icons/fi";
import api from "../../../api/index";
import { useResource } from "../../../hooks/useResource";
import { openOverlay } from "../../../store/features/ui";
import { Empty, ErrorState, Select, Skeleton } from "../../../components/Common";
import ProjectCard from "../../../components/ProjectCard";

const TABS = [
  ["all", "All"],
  ["personal", "Personal"],
  ["team", "Team"],
  ["archived", "Archived"],
];

const PROGRESS = [
  ["", "Any progress"],
  ["notstarted", "Not started"],
  ["inprogress", "In progress"],
  ["completed", "Completed"],
];

const matchesProgress = (project, filter) =>
  !filter ||
  (filter === "notstarted" && project.doneCount === 0) ||
  (filter === "inprogress" && project.doneCount > 0 && project.progress < 100) ||
  (filter === "completed" && project.taskCount > 0 && project.progress === 100);

const Projects = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState("");
  const archived = tab === "archived";
  const { data, error, loading, reload } = useResource(() => api.projects.list(archived), `projects-${archived}`);

  const projects = (data?.projects || []).filter(
    (project) =>
      (tab !== "personal" || project.type === "PERSONAL") &&
      (tab !== "team" || project.type === "TEAM") &&
      project.name.toLowerCase().includes(search.trim().toLowerCase()) &&
      matchesProgress(project, progress)
  );

  return (
    <div className="stack gap-lg">
      <header className="row between wrap">
        <h1>Projects</h1>
        <div className="row">
          <button className="btn" onClick={() => dispatch(openOverlay("join"))}>
            <FiKey /> Join with code
          </button>
          <button className="btn primary" onClick={() => dispatch(openOverlay("project"))}>
            <FiPlus /> Create project
          </button>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map(([key, text]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
            {text}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <label className="search-field">
          <FiSearch aria-hidden="true" />
          <input placeholder="Search projects" aria-label="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <Select label="Progress" value={progress} options={PROGRESS} onChange={setProgress} />
      </div>

      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <Skeleton rows={3} />
      ) : projects.length === 0 ? (
        data.projects.length === 0 ? (
          <Empty
            icon={FiFolder}
            title={archived ? "No archived projects" : "No projects yet"}
            text={archived ? "Archived projects will appear here." : "Create your first project to get started."}
            action={
              !archived && (
                <button className="btn primary" onClick={() => dispatch(openOverlay("project"))}>
                  Create project
                </button>
              )
            }
          />
        ) : (
          <Empty icon={FiSearch} title="No matching projects" text="Try a different search or filter." />
        )
      ) : (
        <div className="grid-cards">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
