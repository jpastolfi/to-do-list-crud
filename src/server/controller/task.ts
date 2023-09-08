import { read } from "@db-crud-task";
import { NextApiRequest, NextApiResponse } from "next";

const get = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const allTasks = read();
    return res.status(200).json({ allTasks });
  }
  res.status(405).json({ message: "Method not allowed " });
};

export const taskController = {
  get,
};
