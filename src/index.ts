import express, { Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "./types";
import { CourseCreateModel } from "./models/CourseCreateModel";

export const app = express();
const port = process.env.PORT || 3000;

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  NOT_FOUNT: 404,
};

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

type CourseType = {
  id: number;
  title: string;
};

const bd = {
  courses: [
    { id: 1, title: "Frontend" },
    { id: 2, title: "Backend" },
    { id: 3, title: "QA" },
    { id: 4, title: "devops" },
  ],
};

app.get(
  "/courses",
  (req: RequestWithQuery<CourseCreateModel>, res: Response<CourseType[]>) => {
    let courses = bd.courses;
    if (req.query.title) {
      courses = courses.filter((el) => {
        return el.title.indexOf(req.query.title) > -1;
      });
    }
    res.json(courses);
  },
);

app.get("/courses/:id", (req: RequestWithParams<{ id: string }>, res) => {
  const fountCourses = bd.courses.find((el) => el.id === +req.params.id);
  if (!fountCourses) {
    res.sendStatus(404);
  } else {
    res.json(fountCourses);
  }
});

app.put("/courses/:id", (req: RequestWithParams<{ id: string }>, res) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const fountCourses = bd.courses.find((el) => el.id === +req.params.id);
  if (!fountCourses) {
    res.sendStatus(404);
  } else {
    fountCourses.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
});

app.delete("/courses/:id", (req: RequestWithParams<{ id: string }>, res) => {
  const fountCourses = bd.courses.filter((el) => el.id !== +req.params.id);
  if (!fountCourses) {
    res.sendStatus(404);
  } else {
    res.json(fountCourses);
  }
  res.json(bd.courses);
});

app.post(
  "/courses",
  (req: RequestWithBody<{ title: string }>, res: Response<CourseType>) => {
    if (!req.body.title) {
      res.sendStatus(400);
      return;
    }
    const createdCourse = {
      id: +new Date(),
      title: req.body.title,
    };
    bd.courses.push(createdCourse);
    res.status(201).json(createdCourse);
  },
);

app.delete("/__test__/data", (req, res) => {
  bd.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
