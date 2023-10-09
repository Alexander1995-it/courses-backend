import express from "express";
import { dbType } from "../db/db";
import { HTTP_STATUSES } from "./utils";

export const getTestsRouter = (db: dbType) => {
  const router = express.Router();
  router.delete("/data", (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });
  return router;
};
