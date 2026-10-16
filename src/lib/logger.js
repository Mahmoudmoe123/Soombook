// Structured logging: every event is one JSON line, so logs can be searched and filtered
// by field (level, route, requestId, status) in Vercel's log view or any log tool.

// LOG_LEVEL picks the quietest level that still gets written; "silent" turns logging off (used in tests).
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: Infinity };

function minimumLevel() {
  const name = String(process.env.LOG_LEVEL || "info").toLowerCase();
  return LEVELS[name] ?? LEVELS.info;
}

// Error objects turn into "{}" in JSON, so keep the parts that help when debugging.
function serializeError(error) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return error;
}

function write(level, message, fields = {}) {
  if (LEVELS[level] < minimumLevel()) return;

  const entry = { time: new Date().toISOString(), level, msg: message, ...fields };
  if ("error" in entry) entry.error = serializeError(entry.error);

  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

const logger = {
  debug: (message, fields) => write("debug", message, fields),
  info: (message, fields) => write("info", message, fields),
  warn: (message, fields) => write("warn", message, fields),
  error: (message, fields) => write("error", message, fields),
};

export default logger;
