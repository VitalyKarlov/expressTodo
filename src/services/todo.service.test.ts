import { describe, it, expect, beforeEach } from "vitest";
import { TodoService } from "./todo.service";
import { ITodoRepository } from "@/repositories/interfaces";
import { Todo } from "@/types/todo";
import { AppError } from "@/utils/AppError";

// Мок-репозиторий
function createMockRepo(): ITodoRepository & { calls: Record<string, number> } {
  const todos: Todo[] = [
    { id: 1, title: "Test todo", done: false },
    { id: 2, title: "Done task", done: true },
  ];
  const calls = {
    create: 0,
    update: 0,
    delete: 0,
    findById: 0,
    findAll: 0,
    findByFilters: 0,
  };

  return {
    calls,
    findAll: () => {
      calls.findAll++;
      return [...todos];
    },
    findById: (id: number) => {
      calls.findById++;
      return todos.find((t) => t.id === id);
    },
    create: (title: string) => {
      calls.create++;
      const todo: Todo = { id: todos.length + 1, title, done: false };
      todos.push(todo);
      return todo;
    },
    update: (id: number, updates: Partial<Omit<Todo, "id">>) => {
      calls.update++;
      const todo = todos.find((t) => t.id === id);
      if (!todo) return undefined;
      Object.assign(todo, updates);
      return todo;
    },
    delete: (id: number) => {
      calls.delete++;
      const idx = todos.findIndex((t) => t.id === id);
      if (idx === -1) return false;
      todos.splice(idx, 1);
      return true;
    },
    findByFilters: (filters: { done?: boolean; search?: string }) => {
      calls.findByFilters++;
      let result = [...todos];
      if (filters.done !== undefined)
        result = result.filter((t) => t.done === filters.done);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((t) => t.title.toLowerCase().includes(q));
      }
      return result;
    },
  };
}

describe("TodoService", () => {
  let repo: ReturnType<typeof createMockRepo>;
  let service: TodoService;

  beforeEach(() => {
    repo = createMockRepo();
    service = new TodoService(repo);
  });

  describe("getAll", () => {
    it("возвращает все todos без фильтров", () => {
      const todos = service.getAll();
      expect(todos).toHaveLength(2);
      expect(repo.calls.findAll).toBe(1);
    });

    it("фильтрует по done", () => {
      const todos = service.getAll({ done: true });
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe("Done task");
    });

    it("фильтрует по search", () => {
      const todos = service.getAll({ search: "test" });
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe("Test todo");
    });
  });

  describe("getById", () => {
    it("возвращает todo по id", () => {
      const todo = service.getById(1);
      expect(todo).toEqual({ id: 1, title: "Test todo", done: false });
    });

    it("бросает 404 если не найден", () => {
      expect(() => service.getById(999)).toThrow(AppError);
      expect(() => service.getById(999)).toThrow("Todo not found");
    });
  });

  describe("create", () => {
    it("создаёт todo и возвращает его", () => {
      const todo = service.create("New task");
      expect(todo.title).toBe("New task");
      expect(todo.done).toBe(false);
      expect(repo.calls.create).toBe(1);
    });

    it("обрезает пробелы", () => {
      const todo = service.create("  trimmed  ");
      expect(todo.title).toBe("trimmed");
    });

    it("бросает 400 если пустой title", () => {
      expect(() => service.create("")).toThrow(AppError);
      expect(() => service.create("")).toThrow("Title is required");
      expect(() => service.create("   ")).toThrow(AppError);
    });
  });

  describe("update", () => {
    it("обновляет title", () => {
      const updated = service.update(1, { title: "Updated" });
      expect(updated.title).toBe("Updated");
    });

    it("обновляет done", () => {
      const updated = service.update(1, { done: true });
      expect(updated.done).toBe(true);
    });

    it("бросает 400 если пустой title", () => {
      expect(() => service.update(1, { title: "" })).toThrow(AppError);
      expect(() => service.update(1, { title: "" })).toThrow(
        "Title cannot be empty",
      );
    });

    it("бросает 404 если не найден", () => {
      expect(() => service.update(999, { title: "Nope" })).toThrow(AppError);
    });
  });

  describe("delete", () => {
    it("удаляет todo", () => {
      expect(() => service.delete(1)).not.toThrow();
      expect(repo.calls.delete).toBe(1);
    });

    it("бросает 404 если не найден", () => {
      expect(() => service.delete(999)).toThrow(AppError);
      expect(() => service.delete(999)).toThrow("Todo not found");
    });
  });
});
