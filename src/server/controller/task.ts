import { taskRepository } from "@server/repository/task";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

const TaskCreationBodySchema = schema.object({
  content: schema.string(),
});

const get = async (req: NextApiRequest, res: NextApiResponse) => {
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

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = TaskCreationBodySchema.safeParse(req.body);
  if (!body.success)
    return res.status(400).json({
      error: {
        message: "A content is required to create a task",
        description: body.error.issues,
      },
    });
  const createdTask = await taskRepository.createByContent(body.data.content);
  return res.status(201).json(createdTask);
};

const toggleDone = async (req: NextApiRequest, res: NextApiResponse) => {
  const taskId = req.query.id;

  if (!taskId || typeof taskId !== "string")
    return res
      .status(400)
      .json({ error: { message: "You must provide a string Id" } });
  try {
    const updatedTask = await taskRepository.toggleDone(taskId);
    res.status(200).json({
      task: updatedTask,
    });
  } catch (e) {
    if (e instanceof Error)
      return res.status(404).json({ error: { message: e.message } });
  }
};

export const taskController = {
  get,
  create,
  toggleDone,
};
