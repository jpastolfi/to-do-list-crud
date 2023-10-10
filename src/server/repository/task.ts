import { Task, TaskSchema } from "@server/schema/Task";
import { HttpNotFoundError } from "@server/infra/errors";
import supabase from "@server/infra/db/supabase";
// Supabase setup

//
interface GetParams {
  page?: number;
  limit?: number;
}

interface GetOutput {
  tasks: Task[];
  totalTasks: number;
  pages: number;
}

const get = async ({ page, limit }: GetParams = {}): Promise<GetOutput> => {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit - 1;
  const { data, error, count } = await supabase
    .from("Tasks")
    .select("*", {
      count: "exact",
    })
    .order("date", { ascending: false })
    .range(startIndex, endIndex);
  if (error) throw new Error("Failed to fetch data");
  const parsedData = TaskSchema.array().safeParse(data);
  if (!parsedData.success) throw parsedData.error;

  const tasks = parsedData.data;
  const totalTasks = count || tasks.length;
  const totalPages = Math.ceil(totalTasks / currentLimit);
  return {
    tasks,
    totalTasks,
    pages: totalPages,
  };
  /* const currentPage = page || 1;
  const currentLimit = limit || 10;
  const allTasks = read().reverse();
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTasks = allTasks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allTasks.length / currentLimit);
  return {
    tasks: paginatedTasks,
    totalTasks: allTasks.length,
    pages: totalPages,
  }; */
};

const createByContent = async (content: string): Promise<Task> => {
  const { data, error } = await supabase
    .from("Tasks")
    .insert([
      {
        content,
      },
    ])
    .select()
    .single();
  if (error) throw new Error("Failed to create task");

  const parsedData = TaskSchema.parse(data);
  return parsedData;
  /* const newTask = create(content);
  return newTask; */
};

const getById = async (id: string): Promise<Task> => {
  const { data, error } = await supabase
    .from("Tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Task with id ${id} not found`);
  const parsedData = TaskSchema.safeParse(data);
  if (!parsedData.success) throw new Error("Failed to parse created task");
  return parsedData.data;
};

const toggleDone = async (taskId: string): Promise<Task> => {
  const task = await getById(taskId);
  const { data, error } = await supabase
    .from("Tasks")
    .update({
      done: !task.done,
    })
    .eq("id", taskId)
    .select()
    .single();
  if (error) throw new Error("Failed to get task by Id");
  const parsedData = TaskSchema.parse(data);
  return parsedData;
  /* const allTasks = read();
  const task = allTasks.find(({ id }) => id === taskId);
  if (!task) throw new HttpNotFoundError(`Id ${taskId} not found`);

  const updatedTask = update(taskId, {
    done: !task.done,
  });
  return updatedTask; */
};

const deleteById = async (id: string) => {
  const { error } = await supabase.from("Tasks").delete().match({
    id,
  });
  if (error) throw new HttpNotFoundError(`Task with id ${id} not found`);
  /* const allTasks = read();
  const task = allTasks.find((task) => task.id === id);
  if (!task) throw new HttpNotFoundError(`Task with id ${id} not found`);
  DBdeleteById(id); */
};

export const taskRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
