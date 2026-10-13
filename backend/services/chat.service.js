const { EventEmitter } = require("events");
const events = new EventEmitter();
events.setMaxListeners(0);
const publish = (projectId, message) => events.emit(String(projectId), message);
const subscribe = (projectId, listener) => {
  const key = String(projectId);
  events.on(key, listener);
  return () => events.off(key, listener);
};
module.exports = { publish, subscribe };
