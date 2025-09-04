import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /auth.
const router = express.Router();

// This section will help you create a new user account.
router.post("/register", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.username || !req.body.password) {
      return res.status(400).send("Username and password are required");
    }
    
    if (req.body.password.length < 8) {
      return res.status(400).send("Password must be at least 8 characters");
    }

    const newDocument = {
      username: req.body.username,
      password: req.body.password,
      createdAt: new Date(),
    };
    const collection = await db.collection("users");
    const result = await collection.insertOne(newDocument);
    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    // Check if it's a duplicate key error (username already exists)
    if (err.code === 11000) {
      res.status(400).send("Username already exists");
    } else {
      res.status(500).send("Error creating user");
    }
  }
});

// This section will help you login a user.
router.post("/login", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.username || !req.body.password) {
      return res.status(400).send("Username and password are required");
    }

    const query = { 
      username: req.body.username,
      password: req.body.password
    };
    const collection = await db.collection("users");
    const result = await collection.findOne(query);

    if (!result) res.send("Invalid credentials").status(401);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

export default router;
