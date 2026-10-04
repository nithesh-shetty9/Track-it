import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FiCopy } from "react-icons/fi";
import Drawer from "./Drawer";
import api, { errorMessage } from "../api/index";
import { bump } from "../store/features/workspace";
import { closeOverlay, toast } from "../store/features/ui";
import { COLORS, fromInput, toInput } from "../utils/format";

export const CopyCode = ({ code }) => {
  const dispatch = useDispatch();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      dispatch(toast("Join code copied"));
    } catch {
      dispatch(toast("Copy failed. Select the code and copy it manually.", "error"));
    }
  };
  return (
    <div className="code-box">
      <code>{code}</code>
      <button className="btn" onClick={copy}>
        <FiCopy /> Copy
      </button>
    </div>
  );
};

const ProjectForm = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editing = Boolean(project);
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    type: project?.type || "PERSONAL",
    startDate: toInput(project?.startDate),
    dueDate: toInput(project?.dueDate),
    color: project?.color || COLORS[0],
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (form.startDate && form.dueDate && form.startDate > form.dueDate) return setError("Due date must be after the start date");
    setBusy(true);
    setError("");
    const body = { ...form, startDate: fromInput(form.startDate), dueDate: fromInput(form.dueDate) };
    try {
      if (editing) {
        await api.projects.update(project._id, body);
        dispatch(toast("Project updated"));
        dispatch(bump());
        onClose();
      } else {
        const result = await api.projects.create(body);
        dispatch(bump());
        if (result.joinCode) setCreated(result);
        else {
          onClose();
          navigate(`/projects/${result.project._id}`);
        }
      }
    } catch (failure) {
      setError(errorMessage(failure));
    }
    setBusy(false);
  };

  if (created) {
    return (
      <div className="stack">
        <h3>{created.project.name} is ready</h3>
        <p className="muted">Share this join code with teammates. You can find it again from the project menu.</p>
        <CopyCode code={created.joinCode} />
        <button
          className="btn primary"
          onClick={() => {
            onClose();
            navigate(`/projects/${created.project._id}`);
          }}
        >
          Open project
        </button>
      </div>
    );
  }

  return (
    <form className="stack" onSubmit={submit}>
      <label className="field">
        Project name
        <input className="input" required maxLength={80} autoFocus value={form.name} onChange={set("name")} />
      </label>
      <label className="field">
        Description
        <textarea className="textarea" rows={3} maxLength={500} value={form.description} onChange={set("description")} />
      </label>
      {!editing && (
        <fieldset className="field">
          <legend>Project type</legend>
          <div className="seg">
            {[["PERSONAL", "Personal"], ["TEAM", "Team"]].map(([key, text]) => (
              <button type="button" key={key} className={form.type === key ? "on" : ""} aria-pressed={form.type === key} onClick={() => setForm({ ...form, type: key })}>
                {text}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <div className="grid-2">
        <label className="field">
          Start date
          <input type="date" className="input" value={form.startDate} onChange={set("startDate")} />
        </label>
        <label className="field">
          Due date
          <input type="date" className="input" value={form.dueDate} min={form.startDate} onChange={set("dueDate")} />
        </label>
      </div>
      <fieldset className="field">
        <legend>Color</legend>
        <div className="swatches">
          {COLORS.map((color) => (
            <button
              type="button"
              key={color}
              aria-label={`Color ${color}`}
              aria-pressed={form.color === color}
              className={form.color === color ? "on" : ""}
              style={{ background: color }}
              onClick={() => setForm({ ...form, color })}
            />
          ))}
        </div>
      </fieldset>
      {error && <p className="form-error">{error}</p>}
      <button className="btn primary" disabled={busy || !form.name.trim()}>
        {busy ? "Saving…" : editing ? "Save changes" : "Create project"}
      </button>
    </form>
  );
};

const JoinForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { project } = await api.projects.join(code);
      dispatch(bump());
      dispatch(toast(`Joined ${project.name}`));
      onClose();
      navigate(`/projects/${project._id}`);
    } catch (failure) {
      setError(errorMessage(failure));
    }
    setBusy(false);
  };

  return (
    <form className="stack" onSubmit={submit}>
      <label className="field">
        Join code
        <input className="input mono" required autoFocus value={code} onChange={(event) => setCode(event.target.value)} />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="btn primary" disabled={busy || !code.trim()}>
        {busy ? "Joining…" : "Join project"}
      </button>
    </form>
  );
};

const ProjectDrawers = () => {
  const dispatch = useDispatch();
  const overlay = useSelector((state) => state.ui.overlay);
  const close = () => dispatch(closeOverlay());
  const isProject = overlay?.name === "project";
  return (
    <>
      <Drawer open={isProject} onClose={close} title={overlay?.data ? "Edit project" : "Create project"}>
        {isProject && <ProjectForm key={overlay.data?._id || "new"} project={overlay.data} onClose={close} />}
      </Drawer>
      <Drawer open={overlay?.name === "join"} onClose={close} title="Join a team project">
        {overlay?.name === "join" && <JoinForm onClose={close} />}
      </Drawer>
    </>
  );
};

export default ProjectDrawers;
