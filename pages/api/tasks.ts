import { NextApiRequest, NextApiResponse } from "next";
import { taskController } from "@server/controller/task";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return taskController.get(req, res);
}
