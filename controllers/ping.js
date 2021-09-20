import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", async function ping(req, res) {
  return res.json({ success: true });
});

export default pingRouter;
