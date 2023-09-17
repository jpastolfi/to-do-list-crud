import {
  read,
  create,
  update,
  deleteById as DBdeleteById,
} from "@db-crud-task";
import { HttpNotFoundError } from "@server/infra/errors";

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
  const allTasks = read().reverse();
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

const toggleDone = async (taskId: string): Promise<Task> => {
  const allTasks = read();
  const task = allTasks.find(({ id }) => id === taskId);
  if (!task) throw new HttpNotFoundError(`Id ${taskId} not found`);

  const updatedTask = update(taskId, {
    done: !task.done,
  });
  return updatedTask;
};

const deleteById = async (id: string) => {
  const allTasks = read();
  const task = allTasks.find((task) => task.id === id);
  if (!task) throw new HttpNotFoundError(`Task with id ${id} not found`);
  DBdeleteById(id);
};

export const taskRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
