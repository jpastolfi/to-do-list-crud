import { z as schema } from "zod";

export const TaskSchema = schema.object({
  id: schema.string().uuid(),
  content: schema.string(),
  date: schema.string().datetime(),
  done: schema.boolean(),
});

export type Task = schema.infer<typeof TaskSchema>;
