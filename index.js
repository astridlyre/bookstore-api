import buildServer from "./app.js";
import db from "./lib/db.js";
import config from "./config.js";
import gracefulShutdown from "http-graceful-shutdown";

async function cleanUp() {
  console.log("Closing Database connection and terminating...");
  await db.close();
  console.log("Terminated.");
}

async function startServer() {
  const app = buildServer();
  const server = app.listen(config.PORT, config.HOST);

  server.on(
    "listen",
    () => console.log(`Listening at ${config.HOST}:${config.PORT}`),
  );

  server.on("error", async (error) => {
    console.error(error);
    await cleanUp();
    process.exit(1);
  });

  gracefulShutdown(server, {
    signals: "SIGINT SIGTERM",
    onShutdown: cleanUp,
  });
}

db.sync().then(startServer);
