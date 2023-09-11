import { taskRepository } from "@ui/repository/task";

interface GetParams {
  page: number;
}

const get = async ({ page }: GetParams) => {
  // 2
  return taskRepository.get({
    page,
    limit: 10,
  });
};

export const todoController = {
  get,
};
