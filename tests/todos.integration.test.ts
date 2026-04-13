import express from "express";
import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { createTodoModule } from "@/modules/todo/todo.di";
import { errorHandler } from "@/middleware/errorHandler";
import { AppError } from "@/utils/AppError";

let app: ReturnType<typeof express>;

beforeAll(() => {
  app = express();
  app.use(express.json());
  const { router } = createTodoModule();
  app.use("/todos", router);
  app.use((_, __, next) => next(new AppError(404, "Not found")));
  app.use(errorHandler);
});

describe("GET /todos", () => {
  it("возвращает массив todos", async () => {
    const res = await supertest(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(2);
  });

  it("фильтрует по done", async () => {
    const res = await supertest(app).get("/todos?done=true");
    expect(res.status).toBe(200);
    res.body.forEach((t: { done: boolean }) => expect(t.done).toBe(true));
  });

  it("фильтрует по search", async () => {
    const res = await supertest(app).get("/todos?search=Express");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Изучить Express");
  });
});

describe("GET /todos/:id", () => {
  it("возвращает todo по id", async () => {
    const res = await supertest(app).get("/todos/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("404 если не найден", async () => {
    const res = await supertest(app).get("/todos/999");
    expect(res.status).toBe(404);
  });

  it("400 если невалидный id", async () => {
    const res = await supertest(app).get("/todos/abc");
    expect(res.status).toBe(400);
  });
});

describe("POST /todos", () => {
  it("создаёт todo", async () => {
    const res = await supertest(app)
      .post("/todos")
      .send({ title: "Integration test" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Integration test");
    expect(res.body).toHaveProperty("done", false);
  });

  it("400 если нет title", async () => {
    const res = await supertest(app).post("/todos").send({});
    expect(res.status).toBe(400);
  });

  it("400 если пустой title", async () => {
    const res = await supertest(app).post("/todos").send({ title: "" });
    expect(res.status).toBe(400);
  });
});

describe("PUT /todos/:id", () => {
  it("обновляет todo", async () => {
    const res = await supertest(app).put("/todos/1").send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("done", true);
  });

  it("404 если не найден", async () => {
    const res = await supertest(app).put("/todos/999").send({ title: "Nope" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /todos/:id", () => {
  it("удаляет todo", async () => {
    const res = await supertest(app).delete("/todos/2");
    expect(res.status).toBe(204);
  });

  it("404 если не найден", async () => {
    const res = await supertest(app).delete("/todos/999");
    expect(res.status).toBe(404);
  });
});
