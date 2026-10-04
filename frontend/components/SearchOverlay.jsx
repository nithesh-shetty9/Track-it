import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FiSearch, FiX } from "react-icons/fi";
import api, { errorMessage } from "../api/index";
import { closeOverlay, openTask } from "../store/features/ui";
import { Avatar, Empty } from "./Common";

const RECENT_KEY = "trackit-recent-searches";

const readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
};

const SearchBox = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [state, setState] = useState({ loading: false, results: null, error: "" });
  const [recent, setRecent] = useState(readRecent);

  useEffect(() => {
    const text = query.trim();
    if (!text) return undefined;
    let live = true;
    const timer = setTimeout(() => {
      setState({ loading: true, results: null, error: "" });
      api
        .search(text)
        .then((results) => live && setState({ loading: false, results, error: "" }))
        .catch((failure) => live && setState({ loading: false, results: null, error: errorMessage(failure) }));
    }, 250);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [query]);

  const remember = () => {
    const text = query.trim();
    if (!text) return;
    const next = [text, ...recent.filter((item) => item !== text)].slice(0, 5);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const go = (action) => {
    remember();
    onClose();
    action();
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const { loading, results, error } = state;
  const hasQuery = Boolean(query.trim());
  const total = results ? results.tasks.length + results.projects.length + results.members.length : 0;

  return (
    <div className="palette" role="dialog" aria-modal="true" aria-label="Search" onClick={(event) => event.stopPropagation()}>
      <div className="palette-search">
        <FiSearch aria-hidden="true" />
        <input autoFocus placeholder="Search tasks, projects and members" aria-label="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
        {query && (
          <button className="icon-btn" aria-label="Clear search" onClick={() => setQuery("")}>
            <FiX />
          </button>
        )}
      </div>
      <div className="palette-results">
        {!hasQuery && recent.length > 0 && (
          <section>
            <div className="row between">
              <h4>Recent searches</h4>
              <button className="link-btn" onClick={clearRecent}>
                Clear
              </button>
            </div>
            {recent.map((item) => (
              <button key={item} className="result" onClick={() => setQuery(item)}>
                <FiSearch /> {item}
              </button>
            ))}
          </section>
        )}
        {!hasQuery && recent.length === 0 && <p className="muted pad">Type to search across your tasks, projects and teammates.</p>}
        {hasQuery && loading && <p className="muted pad">Searching…</p>}
        {hasQuery && error && <p className="form-error pad">{error}</p>}
        {hasQuery && results && total === 0 && <Empty icon={FiSearch} title="No results" text={`Nothing matches “${query.trim()}”.`} />}
        {results?.tasks.length > 0 && (
          <section>
            <h4>Tasks</h4>
            {results.tasks.map((task) => (
              <button key={task._id} className="result" onClick={() => go(() => dispatch(openTask(task._id)))}>
                {task.title}
                {task.project && <span className="muted small">{task.project.name}</span>}
              </button>
            ))}
          </section>
        )}
        {results?.projects.length > 0 && (
          <section>
            <h4>Projects</h4>
            {results.projects.map((project) => (
              <button key={project._id} className="result" onClick={() => go(() => navigate(`/projects/${project._id}`))}>
                <span className="dot" style={{ "--accent": project.color }} /> {project.name}
              </button>
            ))}
          </section>
        )}
        {results?.members.length > 0 && (
          <section>
            <h4>Members</h4>
            {results.members.map((member) => (
              <button key={member._id} className="result" onClick={() => go(() => navigate(`/projects/${member.project._id}`))}>
                <Avatar name={member.name} size={22} /> {member.name}
                <span className="muted small">{member.email}</span>
              </button>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

const SearchOverlay = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.overlay?.name === "search");
  const close = () => dispatch(closeOverlay());
  if (!open) return null;
  return (
    <div className="modal-backdrop top" onClick={close} onKeyDown={(event) => event.key === "Escape" && close()}>
      <SearchBox onClose={close} />
    </div>
  );
};

export default SearchOverlay;
