import db from "./db/connection.js";

async function setupIndexes() {
  try {
    console.log("Setting up database indexes...");
    
    const tasksCollection = await db.collection("tasks");
    
    // Create index on dueAt for efficient sorting
    await tasksCollection.createIndex({ dueAt: 1 });
    console.log("✓ Created index on dueAt field for tasks collection");
    
    console.log("Database indexes setup completed successfully!");
  } catch (error) {
    console.error("Error setting up indexes:", error);
  } finally {
    process.exit(0);
  }
}

setupIndexes();
