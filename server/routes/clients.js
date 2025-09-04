import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /clients.
const router = express.Router();

// This section will help you get a list of all the clients.
router.get("/", async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).send("userId is required");
    }
    
    const collection = await db.collection("records");
    const results = await collection.find({ userId: req.query.userId }).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching clients");
  }
});

// This section will help you get a single client by id
router.get("/:id", async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).send("userId is required");
    }

    const collection = await db.collection("records");
    const query = { 
      _id: new ObjectId(req.params.id),
      userId: req.query.userId
    };
    const result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching client");
  }
});

// This section will help you create or update a client.
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId) {
      return res.status(400).send("userId is required");
    }
    
    if (!req.body.client || req.body.client.trim() === "") {
      return res.status(400).send("Client name is required");
    }

    const collection = await db.collection("records");
    
    // If id is provided, check if client exists for update
    if (req.body.id) {
      const query = { 
        _id: new ObjectId(req.body.id),
        userId: req.body.userId
      };
      const updates = {
        $set: {
          client: req.body.client,
          email: req.body.email,
          phone: req.body.phone,
          notes: req.body.notes,
        },
      };
      const result = await collection.updateOne(query, updates);
      
      if (result.matchedCount === 0) {
        return res.status(404).send("Client not found");
      }
      
      res.send(result).status(200);
    } else {
      // Create new client
      const newDocument = {
        userId: req.body.userId,
        client: req.body.client,
        email: req.body.email,
        phone: req.body.phone,
        notes: req.body.notes,
      };
      const result = await collection.insertOne(newDocument);
      res.send(result).status(201);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving client");
  }
});

// This section will help you delete a client
router.delete("/:id", async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).send("userId is required");
    }

    const query = { 
      _id: new ObjectId(req.params.id),
      userId: req.query.userId
    };

    const collection = db.collection("records");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("Client not found");
    }

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting client");
  }
});

export default router;