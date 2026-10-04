import { Link } from "react-router";
import { AvatarStack, Progress } from "./Common";
import { ago, fmtDate } from "../utils/format";

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project._id}`} className="card project-card" style={{ "--accent": project.color }}>
    <div className="row between">
      <span className="dot" />
      <span className={`badge type-${project.type}`}>{project.type === "TEAM" ? "Team" : "Personal"}</span>
    </div>
    <h3>{project.name}</h3>
    <p className="muted clamp">{project.description || "No description"}</p>
    <Progress value={project.progress} color={project.color} />
    <div className="row between small">
      <span>
        {project.doneCount}/{project.taskCount} tasks · {project.progress}%
      </span>
      <span className="muted">{project.dueDate ? `Due ${fmtDate(project.dueDate)}` : "No due date"}</span>
    </div>
    <div className="row between">
      <AvatarStack members={project.members} />
      <span className="muted small">Updated {ago(project.updatedAt)}</span>
    </div>
  </Link>
);

export default ProjectCard;
