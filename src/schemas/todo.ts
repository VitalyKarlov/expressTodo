import { z } from "zod";

// ─── CREATE ──────────────────────────────────────
export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
});
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

// ─── UPDATE ──────────────────────────────────────
export const updateTodoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  done: z.boolean().optional(),
});
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

// ─── ID PARAM (для GET/PUT/DELETE /:id) ──────────
export const getTodoByIdSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive integer"),
});
export type IdParams = z.infer<typeof getTodoByIdSchema>;

// ─── QUERY FILTERS (для GET /todos) ──────────────
export const getTodosQuerySchema = z.object({
  done: z.coerce.boolean().optional(),
  search: z.string().trim().optional(),
});
export type GetTodosQuery = z.infer<typeof getTodosQuerySchema>;

// ─── ALIAS для читаемости в контроллерах ─────────
export type GetTodoByIdParams = IdParams;
