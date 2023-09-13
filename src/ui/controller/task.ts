import { taskRepository } from "@ui/repository/task";

interface GetParams {
  page: number;
}

const get = async ({ page }: GetParams) => {
  // 2
  return taskRepository.get({
    page,
    limit: 2,
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
  onSuccess: (task: unknown) => void;
}

const create = ({ content, onError, onSuccess }: CreateParams) => {
  if (!content) return onError();
  const newTask = {
    id: "123456",
    content,
    date: new Date(),
    done: false,
  };
  onSuccess(newTask);
};

export const taskController = {
  get,
  filterTasksByContent,
  create,
};
