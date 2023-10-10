import { z as schema } from "zod";

export const TaskSchema = schema.object({
  id: schema.string().uuid(),
  content: schema.string().nonempty(),
  date: schema.string().transform((date) => {
    return new Date(date).toISOString();
  }),
  done: schema.string().transform((done) => {
    if (done === "true") {
      return true;
    }
    return false;
  }),
});

export type Task = schema.infer<typeof TaskSchema>;
