import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiCheckSquare, FiFolder, FiLayers } from "react-icons/fi";
import api, { errorMessage } from "../api/index";
import { bump } from "../store/features/workspace";
import { closeOverlay, openOverlay, toast } from "../store/features/ui";
import { fromInput, PRIORITIES } from "../utils/format";
import { Select } from "./Common";

const MODES = [
  ["personal", "Personal task", FiCheckSquare],
  ["project", "Project task", FiLayers],
  ["new", "New project", FiFolder],
];

const QuickAddForm = ({ preset }) => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.workspace.projects);
  const [mode, setMode] = useState(preset ? "project" : "personal");
  const [form, setForm] = useState({ title: "", project: preset || projects[0]?._id || "", priority: "MEDIUM", dueDate: "" });
  const [busy, setBusy] = useState(false);

  const choose = (key) => {
    if (key === "new") {
      dispatch(openOverlay("project"));
      return;
    }
    setMode(key);
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await api.tasks.create({
        title: form.title,
        priority: form.priority,
        dueDate: fromInput(form.dueDate),
        project: mode === "project" ? form.project : null,
      });
      dispatch(toast("Task created"));
      dispatch(bump());
      dispatch(closeOverlay());
    } catch (failure) {
      dispatch(toast(errorMessage(failure), "error"));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="seg palette-modes">
        {MODES.map(([key, text, Icon]) => (
          <button type="button" key={key} className={mode === key ? "on" : ""} aria-pressed={mode === key} onClick={() => choose(key)}>
            <Icon /> {text}
          </button>
        ))}
      </div>
      <input
        className="palette-input"
        autoFocus
        required
        placeholder={mode === "project" ? "What needs to be done in this project?" : "What do you need to do?"}
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
      />
      {mode === "project" && projects.length === 0 ? (
        <p className="notice">Create a project first to add project tasks.</p>
      ) : (
        <div className="palette-foot">
          {mode === "project" && (
            <Select label="Project" value={form.project} options={projects.map((p) => [p._id, p.name])} onChange={(project) => setForm({ ...form, project })} />
          )}
          <Select label="Priority" value={form.priority} options={PRIORITIES} onChange={(priority) => setForm({ ...form, priority })} />
          <input type="date" className="date" aria-label="Due date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          <button className="btn primary" disabled={busy || !form.title.trim() || (mode === "project" && !form.project)}>
            Add task
          </button>
        </div>
      )}
    </form>
  );
};

const QuickAdd = () => {
  const dispatch = useDispatch();
  const overlay = useSelector((state) => state.ui.overlay);
  if (overlay?.name !== "quick") return null;
  const close = () => dispatch(closeOverlay());
  return (
    <div className="modal-backdrop top" onClick={close} onKeyDown={(event) => event.key === "Escape" && close()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Quick add" onClick={(event) => event.stopPropagation()}>
        <QuickAddForm preset={overlay.data?.project} />
      </div>
    </div>
  );
};

export default QuickAdd;
