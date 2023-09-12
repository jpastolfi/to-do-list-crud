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

export const taskController = {
  get,
  filterTasksByContent,
};
