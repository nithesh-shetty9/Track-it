import { useDispatch, useSelector } from "react-redux";
import { closeOverlay } from "../store/features/ui";

const SHORTCUTS = [
  ["Ctrl / ⌘ + K", "Search"],
  ["Ctrl / ⌘ + J", "Quick add"],
  ["?", "Keyboard shortcuts"],
  ["Esc", "Close dialogs and drawers"],
];

const Shortcuts = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.overlay?.name === "shortcuts");
  if (!open) return null;
  const close = () => dispatch(closeOverlay());
  return (
    <div className="modal-backdrop" onClick={close} onKeyDown={(event) => event.key === "Escape" && close()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onClick={(event) => event.stopPropagation()}>
        <h2>Keyboard shortcuts</h2>
        <dl className="fields">
          {SHORTCUTS.map(([keys, text]) => (
            <div key={keys} className="shortcut">
              <dt>
                <kbd>{keys}</kbd>
              </dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        <button className="btn" autoFocus onClick={close}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Shortcuts;
