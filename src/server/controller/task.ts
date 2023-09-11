import { taskRepository } from "@server/repository/task";
import { NextApiRequest, NextApiResponse } from "next";

const get = (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);
  if (query.page && isNaN(page)) {
    return res.status(400).json({
      error: {
        message: "Page must be a number",
      },
    });
  }
  if (query.limit && isNaN(limit)) {
    return res.status(400).json({
      error: {
        message: "Limit must be a number",
      },
    });
  }

  const { totalTasks, tasks, pages } = taskRepository.get({
    page,
    limit,
  });

  return res.status(200).json({
    totalTasks,
    pages,
    tasks,
  });
};

export const taskController = {
  get,
};
