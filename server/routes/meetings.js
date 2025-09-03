import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the meetings.
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("meetings");
    let results = await collection.find({ userId: req.query.userId }).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching meetings");
  }
});

// This section will help you get a single meeting by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("meetings");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching meeting");
  }
});

// This section will help you create a new meeting.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      userId: req.body.userId,
      clientId: req.body.clientId || null,
      title: req.body.title,
      meetingAt: req.body.meetingAt,
      notes: req.body.notes || "",
      meetingLink: req.body.meetingLink || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let collection = await db.collection("meetings");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding meeting");
  }
});

// This section will help you update a meeting by id.
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        clientId: req.body.clientId || null,
        title: req.body.title,
        meetingAt: req.body.meetingAt,
        notes: req.body.notes || "",
        meetingLink: req.body.meetingLink || "",
        updatedAt: new Date(),
      },
    };

    let collection = await db.collection("meetings");
    let result = await collection.updateOne(query, updates);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating meeting");
  }
});

// This section will help you delete a meeting
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("meetings");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      res.status(404).send("Meeting not found");
    } else {
      res.send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting meeting");
  }
});

export default router;
