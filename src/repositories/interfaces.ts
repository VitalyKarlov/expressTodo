import { Todo } from "@/types/todo";

export interface ITodoRepository {
  findAll(): Todo[];
  findById(id: number): Todo | undefined;
  create(title: string): Todo;
  update(id: number, updates: Partial<Omit<Todo, "id">>): Todo | undefined;
  delete(id: number): boolean;
  findByFilters(filters: { done?: boolean; search?: string }): Todo[];
}
