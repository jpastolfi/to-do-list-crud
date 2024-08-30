import { taskRepository } from "@ui/repository/task";
import { Task } from "@ui/schema/Task";
import { z as schema } from "zod";

interface GetParams {
  page: number;
}

const get = async ({ page }: GetParams) => {
  // 2
  return taskRepository.get({
    page,
    limit: 6,
  });
};

const filterTasksByContent = <Task>(
  searchTerm: string,
  tasks: Array<Task & { content: string }>,
): Array<Task> => {
  return tasks.filter(({ content }) => {
    const searchTermNormalized = searchTerm.toLowerCase();
    const contentNormalized = content.toLowerCase();
    return contentNormalized.includes(searchTermNormalized);
  });
};

interface CreateParams {
  content?: string;
  onError: () => void;
  onSuccess: (task: Task) => void;
}

const create = ({ content, onError, onSuccess }: CreateParams) => {
  const parsedParams = schema.string().nonempty().safeParse(content);
  if (!parsedParams.success) return onError();
  taskRepository
    .createByContent(parsedParams.data)
    .then((newTask) => {
      onSuccess(newTask);
    })
    .catch(() => {
      onError();
    });
};

interface ToggleDoneParams {
  id: string;
  updateTasksOnScreen: () => void;
  onError: () => void;
}

const toggleDone = ({ id, updateTasksOnScreen, onError }: ToggleDoneParams) => {
  taskRepository
    .toggleDone(id)
    .then(() => {
      updateTasksOnScreen();
    })
    .catch(() => {
      onError();
    });
};

const deleteById = async (id: string) => {
  taskRepository.deleteById(id);
};

export const taskController = {
  get,
  filterTasksByContent,
  create,
  toggleDone,
  deleteById,
};
