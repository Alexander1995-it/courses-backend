import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";
import express, { Response } from "express";
import { CreateCourseModel } from "../models/CreateCourseModel";
import { dbType } from "../db/db";
import { HTTP_STATUSES } from "./utils";

export type CourseType = {
  id: number;
  title: string;
};

export const getCoursesRoutes = (db: dbType) => {
  const coursesRouter = express.Router();

  coursesRouter.get(
    "/",
    (req: RequestWithQuery<{ title: string }>, res: Response<CourseType[]>) => {
      let courses = db.courses;
      if (req.query.title) {
        courses = courses.filter((el) => {
          return el.title.indexOf(req.query.title) > -1;
        });
      }
      res.json(courses);
    },
  );

  coursesRouter.get("/:id", (req: RequestWithParams<{ id: string }>, res) => {
    const fountCourses = db.courses.find((el) => el.id === +req.params.id);
    if (!fountCourses) {
      res.sendStatus(404);
    } else {
      res.json(fountCourses);
    }
  });

  coursesRouter.put("/:id", (req: RequestWithParams<{ id: string }>, res) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }
    const fountCourses = db.courses.find((el) => el.id === +req.params.id);
    if (!fountCourses) {
      res.sendStatus(404);
    } else {
      fountCourses.title = req.body.title;
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
  });

  coursesRouter.delete(
    "/:id",
    (req: RequestWithParams<{ id: string }>, res) => {
      const fountCourses = db.courses.filter((el) => el.id !== +req.params.id);
      db.courses = fountCourses;
      if (!fountCourses) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404);
      } else {
        res.json(db.courses);
      }
    },
  );

  coursesRouter.post(
    "/",
    (req: RequestWithBody<CreateCourseModel>, res: Response<CourseType>) => {
      if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      const createdCourse = {
        id: +new Date(),
        title: req.body.title,
      };
      db.courses.push(createdCourse);
      res.status(201).json(createdCourse);
    },
  );

  return coursesRouter;
};
