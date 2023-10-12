import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";
import express, { Response } from "express";
import { CreateCourseModel } from "../models/CreateCourseModel";
import { dbType } from "../db/db";
import { HTTP_STATUSES } from "./utils";
import { coursesRepository } from "../repository/courses-repository";
import { body } from "express-validator";
import { InputValidationMiddleware } from "../middlewares/input-validation-middleware";

export type CourseType = {
  id: number;
  title: string;
};

const titleValidation = body("title")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Title length should be from 3 to 10 symbols");

export const getCoursesRoutes = (db: dbType) => {
  const coursesRouter = express.Router();

  coursesRouter.get(
    "/",
    (req: RequestWithQuery<{ title: string }>, res: Response<CourseType[]>) => {
      let courses = coursesRepository.fountCourses(req.query.title);
      res.json(courses);
    },
  );

  coursesRouter.get("/:id", (req: RequestWithParams<{ id: string }>, res) => {
    const course = coursesRepository.fountCourseById(+req.params.id);
    if (!course) {
      res.sendStatus(404);
    } else {
      res.json(course);
    }
  });

  coursesRouter.put(
    "/:id",
    titleValidation,
    InputValidationMiddleware,
    (req: RequestWithParams<{ id: string }>, res) => {
      if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      const updatedCourse = coursesRepository.updateCourse(
        +req.params.id,
        req.body.title,
      );
      if (!updatedCourse) {
        res.sendStatus(404);
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      }
    },
  );

  coursesRouter.delete(
    "/:id",
    (req: RequestWithParams<{ id: string }>, res) => {
      const courses = coursesRepository.removeCourse(+req.params.id);
      if (!courses) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404);
      } else {
        res.json(db.courses);
      }
    },
  );

  coursesRouter.post(
    "/",
    titleValidation,
    InputValidationMiddleware,

    (
      req: RequestWithBody<CreateCourseModel>,
      res: Response<CourseType | { message: string } | { errors: any }>,
    ) => {
      if (!req.body.title.trim()) {
        res
          .status(HTTP_STATUSES.BAD_REQUEST_400)
          .send({ message: "title is required" });
        return;
      }
      const addedCourse = coursesRepository.addCourse(req.body.title);
      res.status(201).json(addedCourse);
    },
  );

  return coursesRouter;
};
