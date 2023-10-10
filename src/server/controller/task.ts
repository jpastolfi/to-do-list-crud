import { HttpNotFoundError } from "@server/infra/errors";
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

  const { totalTasks, tasks, pages } = await taskRepository.get({
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
  try {
    const createdTask = await taskRepository.createByContent(body.data.content);
    return res.status(201).json(createdTask);
  } catch {
    return res
      .status(400)
      .json({ error: { message: "Failed to create task" } });
  }
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

const deleteById = async (req: NextApiRequest, res: NextApiResponse) => {
  const QuerySchema = schema.object({
    id: schema.string().uuid().nonempty(),
  });
  const parsedQuery = QuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      error: {
        message: "You must provide a valid id",
      },
    });
  }
  try {
    const id = parsedQuery.data.id;
    await taskRepository.deleteById(id);
    res.status(204).end();
  } catch (e) {
    if (e instanceof HttpNotFoundError)
      return res.status(400).json({
        error: {
          message: e.message,
        },
      });
    return res.status(500).json({
      error: {
        message: `Internal server error`,
      },
    });
  }
};

export const taskController = {
  get,
  create,
  toggleDone,
  deleteById,
};
