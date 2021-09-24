export function unknownEndpoint(req, res) {
  return res.status(404).json({ error: "Unknown Endpoint" });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }
  if (/^(development|test)$/.test(process.env.NODE_ENV)) {
    return res.status(error.status || 500).json({
      errors: error.errors
        ? error.errors.map((error) => error.message)
        : [{ message: error.message ?? "Something went wrong" }],
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
    return res.status(400).json({
      errors: [{ message: "Invalid parameter ID" }],
    });
  } else {
    res.locals.id = id;
    return next();
  }
}

export function handleValidationError(error, res) {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      errors: error.errors.map((error) => error.message),
    });
  }
}
