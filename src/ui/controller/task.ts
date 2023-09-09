import { taskRepository } from "@ui/repository/task";

interface GetParams {
  page: number;
}

const get = async ({ page }: GetParams) => {
  return taskRepository.get({
    page: page || 1,
    limit: 1,
  });
};

export const todoController = {
  get,
};
