const mongoose = require("mongoose");

const fail = (status, message) => Object.assign(new Error(message), { status });

const need = (condition, status, message) => {
  if (!condition) throw fail(status, message);
};

const pick = (source, keys) =>
  Object.fromEntries(keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));

const tx = async (work) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
};

module.exports = { fail, need, pick, tx };
