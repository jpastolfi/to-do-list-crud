import { Task, TaskSchema } from "@ui/schema/Task";
import { z as schema } from "zod";
interface GetParams {
  page: number;
  limit: number;
}

interface GetOutput {
  tasks: Task[];
  totalTasks: number;
  pages: number;
}

const parseTasksFromServer = (
  responseBody: unknown,
): { total: number; pages: number; tasks: Array<Task> } => {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "tasks" in responseBody &&
    "totalTasks" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.tasks)
  ) {
    return {
      total: Number(responseBody.totalTasks),
      pages: Number(responseBody.pages),
      tasks: responseBody.tasks.map((task: unknown) => {
        if (task === null && typeof task !== "object")
          throw new Error("Invalid task from the API");
        const { id, content, done, date } = task as {
          id: string;
          content: string;
          done: string;
          date: string;
        };
        return {
          id,
          content,
          done: String(done).toLowerCase() === "true",
          date: date,
        };
      }),
    };
  }
  return {
    pages: 1,
    total: 0,
    tasks: [],
  };
};

const get = ({ page, limit }: GetParams): Promise<GetOutput> => {
  return fetch(`/api/tasks?page=${page}&limit=${limit}`).then(
    async (response) => {
      const responseString = await response.text();
      const responseParsed = parseTasksFromServer(JSON.parse(responseString));
      return {
        tasks: responseParsed.tasks,
        totalTasks: responseParsed.total,
        pages: responseParsed.pages,
      };
    },
  );
};

const createByContent = async (content: string): Promise<Task> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });
  if (response.ok) {
    const serverResponse = await response.json();
    /* console.log(serverResponse);
    const serverResponseSchema = schema.object({
      task: TaskSchema,
    });
    const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);
    // Aqui dá success false
    console.log(serverResponseParsed);
    if (!serverResponseParsed.success) throw new Error("Failed to create task");
    const task = serverResponseParsed.data.task; */
    const task = serverResponse;
    return task;
  }
  throw new Error("Failed to create task");
};

const toggleDone = async (id: string): Promise<Task> => {
  const response = await fetch(`/api/tasks/${id}/toggle-done`, {
    method: "PUT",
  });
  if (response.ok) {
    const serverResponse = await response.json();
    /* const serverResponseSchema = schema.object({
      task: TaskSchema,
    });
    const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) throw new Error("Failed to update task");
    const updatedTask = serverResponseParsed.data.task; */
    const updatedTask = serverResponse;
    /* console.log(updatedTask.task.done); */

    return updatedTask;
  }
  throw new Error("Server error");
};

const deleteById = async (id: string) => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete");
  }
};

export const taskRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
