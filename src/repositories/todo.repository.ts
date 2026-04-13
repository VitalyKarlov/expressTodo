import { Todo } from "@/types/todo";
import { ITodoRepository } from "@/repositories/interfaces";

export class TodoRepository implements ITodoRepository {
  private todos: Todo[] = [
    { id: 1, title: "Изучить Express", done: false },
    { id: 2, title: "Написать API", done: true },
  ];
  private nextId = 3;

  findAll(): Todo[] {
    return [...this.todos]; // Возвращаем копию, чтобы не мутировали снаружи
  }

  findById(id: number): Todo | undefined {
    return this.todos.find((t) => t.id === id);
  }

  create(title: string): Todo {
    const newTodo: Todo = { id: this.nextId++, title, done: false };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, updates: Partial<Omit<Todo, "id">>): Todo | undefined {
    const todo = this.findById(id);
    if (!todo) return undefined;

    Object.assign(todo, updates);
    return todo;
  }

  delete(id: number): boolean {
    const idx = this.todos.findIndex((t) => t.id === id);
    if (idx === -1) return false;

    this.todos.splice(idx, 1);
    return true;
  }

  // Для фильтров (расширяемо)
  findByFilters(filters: { done?: boolean; search?: string }): Todo[] {
    let result = this.findAll();
    if (filters.done !== undefined) {
      result = result.filter((t) => t.done === filters.done);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    return result;
  }
}
