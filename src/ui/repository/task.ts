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

const get = ({ page, limit }: GetParams): Promise<GetOutput> => {
  return fetch("/api/tasks").then(async (response) => {
    const responseString = await response.text();
    const responseFromServer = JSON.parse(responseString).allTasks;
    console.log('page', page);
    console.log('limit', limit);
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
