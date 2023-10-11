import { db } from "../db/db";

export const coursesRepository = {
  fountCourses(title: string) {
    let courses = db.courses;
    if (title) {
      courses = courses.filter((el) => {
        return el.title.indexOf(title) > -1;
      });
    }
    return courses;
  },
  fountCourseById(id: number) {
    return db.courses.find((el) => el.id === id);
  },
  removeCourse(id: number) {
    let indexCourse = db.courses.findIndex((course) => {
      return course.id === id;
    });
    if (indexCourse === -1) {
      return null;
    }
    return db.courses.splice(indexCourse, 1);
  },
  updateCourse(id: number, title: string) {
    const fountCourses = db.courses.find((el) => el.id === id);
    if (!fountCourses) {
      return null;
    } else {
      fountCourses.title = title;
      return fountCourses;
    }
  },
  addCourse(title: string) {
    const createdCourse = {
      id: +new Date(),
      title,
    };
    db.courses.push(createdCourse);
    return createdCourse;
  },
};
