import { taskController } from "@server/controller/task";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  /* res.status(200).json({ message: "Toggle done" }); */
  if (req.method === "PUT") return taskController.toggleDone(req, res);
  return res.status(405).json({ error: { message: "Method not allowed" } });
}
