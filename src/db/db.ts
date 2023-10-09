export type dbType = {
  courses: Array<{ id: number; title: string }>;
};
export const db: dbType = {
  courses: [
    { id: 1, title: "Frontend" },
    { id: 2, title: "Backend" },
    { id: 3, title: "QA" },
    { id: 4, title: "devops" },
  ],
};
