import { useRef, useState } from "react";

export const useConfirm = () => {
  const [message, setMessage] = useState(null);
  const resolver = useRef(null);

  const ask = (text) =>
    new Promise((resolve) => {
      resolver.current = resolve;
      setMessage(text);
    });

  const answer = (value) => {
    resolver.current?.(value);
    setMessage(null);
  };

  const dialog = message && (
    <div className="modal-backdrop" onClick={() => answer(false)}>
      <div className="dialog" role="alertdialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <p>{message}</p>
        <div className="row end">
          <button className="btn" autoFocus onClick={() => answer(false)}>
            Cancel
          </button>
          <button className="btn danger" onClick={() => answer(true)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return [ask, dialog];
};
