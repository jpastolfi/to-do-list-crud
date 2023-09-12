import { read, create } from "@db-crud-task";

interface GetParams {
  page?: number;
  limit?: number;
}

interface Task {
  id: string;
  content: string;
  date: string;
  done: boolean;
}

interface GetOutput {
  tasks: Task[];
  totalTasks: number;
  pages: number;
}

const get = ({ page, limit }: GetParams = {}): GetOutput => {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const allTasks = read();
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTasks = allTasks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allTasks.length / currentLimit);
  return {
    tasks: paginatedTasks,
    totalTasks: allTasks.length,
    pages: totalPages,
  };
};

const createByContent = async (content: string): Promise<Task> => {
  const newTask = create(content);
  return newTask;
};

export const taskRepository = {
  get,
  createByContent,
};
