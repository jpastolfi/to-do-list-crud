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
): { allTasks: Array<Task> } => {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "allTasks" in responseBody &&
    Array.isArray(responseBody.allTasks)
  ) {
    return {
      allTasks: responseBody.allTasks.map((task: unknown) => {
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
    allTasks: [],
  };
};

const get = ({ page, limit }: GetParams): Promise<GetOutput> => {
  return fetch("/api/tasks").then(async (response) => {
    const responseString = await response.text();
    const responseFromServer = parseTasksFromServer(
      JSON.parse(responseString),
    ).allTasks;
    const allTasks = responseFromServer;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = allTasks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allTasks.length / limit);
    return {
      tasks: paginatedTasks,
      totalTasks: allTasks.length,
      pages: totalPages,
    };
  });
};

export const taskRepository = {
  get,
};
