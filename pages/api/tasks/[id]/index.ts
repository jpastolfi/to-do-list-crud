import { taskController } from "@server/controller/task";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") return taskController.deleteById(req, res);
  return res.status(405).json({ error: { message: "Method not allowed" } });
}
