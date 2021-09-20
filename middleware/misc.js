export function unknownEndpoint(req, res) {
  return res.status(404).json({ error: "Unknown Endpoint" });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }
  if (process.env.NODE_ENV === "development") {
    return res.status(error.status || 500).json({
      errors: error.errors
        ? error.errors.map((error) => error.message)
        : [error],
    });
  }
  return res.status(500).json({
    errors: [{ message: "Something went wrong" }],
  });
}

export function throwTestError(req, res, next) {
  next(new Error("This is a test error"));
}

export function parseID(req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return next(new Error(`Invalid ID parameter ${req.params.id}`));
  } else {
    res.locals.id = id;
    return next();
  }
}
