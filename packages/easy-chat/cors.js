function parseAllowedOrigins(value = '*') {
  const origins = String(value)
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  return origins.length ? origins : ['*'];
}

function createCorsOriginOption(value) {
  const origins = parseAllowedOrigins(value);
  if (origins.includes('*')) {
    return '*';
  }

  const allowedOrigins = new Set(origins);
  return (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin is not allowed: ${origin}`));
  };
}

module.exports = {
  createCorsOriginOption,
  parseAllowedOrigins,
};
