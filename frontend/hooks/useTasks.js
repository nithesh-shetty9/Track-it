import { useDispatch } from "react-redux";
import api, { errorMessage } from "../api/index.js";
import { bump } from "../store/features/workspace.js";
import { toast } from "../store/features/ui.js";
import { useResource } from "./useResource.js";

export const useToggleTask = () => {
  const dispatch = useDispatch();
  return async (task) => {
    try {
      await api.tasks.update(task._id, { status: task.status === "DONE" ? "TODO" : "DONE" });
    } catch (error) {
      dispatch(toast(errorMessage(error), "error"));
    }
    dispatch(bump());
  };
};

export const useTasks = (params) => {
  const dispatch = useDispatch();
  const resource = useResource(() => api.tasks.list(params), JSON.stringify(params));

  const run = async (action, success) => {
    try {
      await action();
      if (success) dispatch(toast(success));
    } catch (error) {
      dispatch(toast(errorMessage(error), "error"));
    }
    dispatch(bump());
  };

  const patch = (id, changes) => {
    if (!("assignee" in changes)) {
      resource.setData((data) => ({ ...data, tasks: data.tasks.map((task) => (task._id === id ? { ...task, ...changes } : task)) }));
    }
    return run(() => api.tasks.update(id, changes));
  };

  const remove = (id) => run(() => api.tasks.remove(id), "Task deleted");

  return { ...resource, tasks: resource.data?.tasks, patch, remove };
};
