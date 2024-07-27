import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const prisma = new PrismaClient();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post("/task/create", async (req: Request, res: Response) => {
  const body = req.body.body;
  const Priority = +req.body.Priority; //Convert to number data type

  if (!body || !Priority) {
    res.status(400).send({
      error: "Request payload is not valid. Body and Priority are required. ",
    });
  }

  const newTask = await prisma.task.create({
    data: {
      body,
      Priority,
      Completed: false,
    },
  });

  return res.send(newTask);
});

app.patch("/task/edit/:id", async (req: Request, res: Response) => {
  const id = +req.params.id; //Convert to number
  const Completed = req.body.Completed;

  if (Completed === undefined) {
    return res.status(400).send({
      error: "Request payload is not valid. Completed is required.",
    });
  }

  const result = await prisma.task.update({
    where: {
      id,
    },
    data: {
      Completed,
    },
  });

  return res.send(result);
});

app.delete("/task/delete/:id", async (req: Request, res: Response) => {
  const id = +req.params.id; // Convert to number

  try {
    // Attempt to delete the task
    const result = await prisma.task.delete({
      where: {
        id,
      },
    });

    // Send the deleted task data as a response
    return res.send(result);
  } catch (error) {
    // Handle errors, such as when the task is not found
    return res.status(404).send({
      error: "Task not found or could not be deleted.",
    });
  }
});

// Delete all tasks controller
app.delete("/tasks/deleteAll", async (req: Request, res: Response) => {
  try {
    // Attempt to delete all tasks
    const result = await prisma.task.deleteMany({});

    // Send the result of the deletion as a response
    return res.send({
      message: "All tasks have been deleted.",
      count: result.count,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).send({
      error: "An error occurred while trying to delete all tasks.",
    });
  }
});
app.listen(PORT, () => {
  console.log(`API service is running on http://localhost:${PORT}`);
});
