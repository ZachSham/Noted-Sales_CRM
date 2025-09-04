import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the meetings.
router.get("/", async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).send("userId is required");
    }
    
    const collection = await db.collection("meetings");
    const results = await collection.find({ userId: req.query.userId }).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching meetings");
  }
});

// This section will help you get a single meeting by id
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("meetings");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching meeting");
  }
});

// This section will help you create or update a meeting.
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId) {
      return res.status(400).send("userId is required");
    }
    
    if (!req.body.title || req.body.title.trim() === "") {
      return res.status(400).send("Meeting title is required");
    }
    
    if (!req.body.meetingAt) {
      return res.status(400).send("Meeting date/time is required");
    }

    const collection = await db.collection("meetings");
    
    // If id is provided, update existing meeting
    if (req.body.id) {
      const query = { _id: new ObjectId(req.body.id) };
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
      const result = await collection.updateOne(query, updates);
      
      if (result.matchedCount === 0) {
        return res.status(404).send("Meeting not found");
      }
      
      res.send(result).status(200);
    } else {
      // Create new meeting
      const newDocument = {
        userId: req.body.userId,
        clientId: req.body.clientId || null,
        title: req.body.title,
        meetingAt: req.body.meetingAt,
        notes: req.body.notes || "",
        meetingLink: req.body.meetingLink || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await collection.insertOne(newDocument);
      res.send(result).status(201);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving meeting");
  }
});

// This section will help you delete a meeting
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("meetings");
    const result = await collection.deleteOne(query);

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
