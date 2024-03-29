import { NextApiRequest, NextApiResponse } from "next";
import { taskController } from "@server/controller/task";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return taskController.get(req, res);
  if (req.method === "POST") return taskController.create(req, res);
  return res.status(405).json({ error: { message: "Method not allowed" } });
}
