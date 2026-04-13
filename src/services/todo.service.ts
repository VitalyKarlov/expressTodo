import { Todo } from "@/types/todo";
import { ITodoRepository } from "@/repositories/interfaces";
import { AppError } from "@/utils/AppError";

export class TodoService {
  constructor(private repo: ITodoRepository) {}

  getAll(filters?: { done?: boolean; search?: string }): Todo[] {
    return filters ? this.repo.findByFilters(filters) : this.repo.findAll();
  }

  getById(id: number): Todo {
    const todo = this.repo.findById(id);
    if (!todo) throw new AppError(404, "Todo not found");
    return todo;
  }

  create(title: string): Todo {
    // Бизнес-правило: название обязательно
    if (!title.trim()) {
      throw new AppError(400, "Title is required");
    }
    return this.repo.create(title.trim());
  }

  update(id: number, updates: Partial<Pick<Todo, "title" | "done">>): Todo {
    const todo = this.getById(id); // Проверка существования

    // Бизнес-правило: если меняем title, он не должен быть пустым
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new AppError(400, "Title cannot be empty");
    }

    const updated = this.repo.update(id, {
      ...updates,
      title: updates.title?.trim(),
    });

    if (!updated) throw new AppError(404, "Todo not found");
    return updated;
  }

  delete(id: number): void {
    const deleted = this.repo.delete(id);
    if (!deleted) throw new AppError(404, "Todo not found");
  }
}
