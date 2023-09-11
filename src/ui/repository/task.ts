interface GetParams {
  page: number;
  limit: number;
}

interface Task {
  content: string;
  date: Date;
  done: boolean;
  id: string;
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
          date: new Date(date),
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

export const taskRepository = {
  get,
};
