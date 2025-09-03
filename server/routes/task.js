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
    let collection = await db.collection("tasks");
    let results = await collection.find({ userId: req.query.userId }).sort({ dueAt: 1 }).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tasks");
  }
});

// This section will help you get a single task by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("tasks");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching task");
  }
});

// This section will help you create a new task.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      userId: req.body.userId,
      clientId: req.body.clientId || null,
      text: req.body.text,
      dueAt: new Date(req.body.dueAt),
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let collection = await db.collection("tasks");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding task");
  }
});

// This section will help you update a task by id.
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
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

    let collection = await db.collection("tasks");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating task");
  }
});

// This section will help you delete a task
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("tasks");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

export default router;
