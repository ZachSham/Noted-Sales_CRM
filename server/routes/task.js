import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /task.
const router = express.Router();

// This section will help you get a list of all the tasks.
router.get("/", async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).send("userId is required");
    }
    
    const collection = await db.collection("tasks");
    const results = await collection.find({ userId: req.query.userId }).sort({ dueAt: 1 }).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tasks");
  }
});

// This section will help you get a single task by id
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("tasks");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching task");
  }
});

// This section will help you create or update a task.
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId) {
      return res.status(400).send("userId is required");
    }
    
    if (!req.body.text || req.body.text.trim() === "") {
      return res.status(400).send("Task text is required");
    }
    
    if (!req.body.dueAt) {
      return res.status(400).send("Due date is required");
    }

    const collection = await db.collection("tasks");
    
    // If id is provided, update existing task
    if (req.body.id) {
      const query = { _id: new ObjectId(req.body.id) };
      const updates = {
        $set: {
          clientId: req.body.clientId !== undefined ? req.body.clientId : null,
          text: req.body.text,
          dueAt: req.body.dueAt ? new Date(req.body.dueAt) : undefined,
          status: req.body.status,
          updatedAt: new Date(),
        },
      };

      // Remove undefined fields
      Object.keys(updates.$set).forEach(key => {
        if (updates.$set[key] === undefined) {
          delete updates.$set[key];
        }
      });

      const result = await collection.updateOne(query, updates);
      
      if (result.matchedCount === 0) {
        return res.status(404).send("Task not found");
      }
      
      res.send(result).status(200);
    } else {
      // Create new task
      const newDocument = {
        userId: req.body.userId,
        clientId: req.body.clientId || null,
        text: req.body.text,
        dueAt: new Date(req.body.dueAt),
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await collection.insertOne(newDocument);
      res.send(result).status(201);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving task");
  }
});

// This section will help you delete a task
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("tasks");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("Task not found");
    }

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

export default router;
