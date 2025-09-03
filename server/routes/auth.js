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
    let newDocument = {
      username: req.body.username,
      password: req.body.password,
      createdAt: new Date(),
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

// This section will help you login a user.
router.post("/login", async (req, res) => {
  try {
    const query = { 
      username: req.body.username,
      password: req.body.password
    };
    let collection = await db.collection("users");
    let result = await collection.findOne(query);

    if (!result) res.send("Invalid credentials").status(401);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

export default router;
