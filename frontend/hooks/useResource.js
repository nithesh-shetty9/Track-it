import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { errorMessage } from "../api/index.js";

export const useResource = (fetcher, key = "") => {
  const version = useSelector((state) => state.workspace.version);
  const [state, setState] = useState({ data: null, error: null });
  const [tick, setTick] = useState(0);
  const latest = useRef(fetcher);
  const reload = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    latest.current = fetcher;
  });

  useEffect(() => {
    let live = true;
    latest
      .current()
      .then((data) => live && setState({ data, error: null }))
      .catch((error) => live && setState((previous) => ({ ...previous, error: errorMessage(error) })));
    return () => {
      live = false;
    };
  }, [key, version, tick]);

  const setData = useCallback((update) => setState((previous) => ({ ...previous, data: update(previous.data) })), []);

  return { ...state, loading: !state.data && !state.error, reload, setData };
};
