import express from "express";
import { getCoursesRoutes } from "./routes/courses";
import { db } from "./db/db";
import { getTestsRouter } from "./routes/tests";

export const app = express();
export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use("/courses", getCoursesRoutes(db));
app.use("/__test__", getTestsRouter(db));
