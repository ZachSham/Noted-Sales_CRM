import db from "./db/connection.js";

async function migrateRecords() {
  try {
    console.log("Starting migration...");
    
    const collection = await db.collection("records");
    
    // Find all records that have "name" field but no "client" field
    const recordsToUpdate = await collection.find({
      name: { $exists: true },
      client: { $exists: false }
    }).toArray();
    
    console.log(`Found ${recordsToUpdate.length} records to migrate`);
    
    if (recordsToUpdate.length === 0) {
      console.log("No records need migration");
      return;
    }
    
    // Update each record
    for (const record of recordsToUpdate) {
      await collection.updateOne(
        { _id: record._id },
        {
          $set: { client: record.name },
          $unset: { name: "" }
        }
      );
      console.log(`Migrated record: ${record.name} -> ${record.name}`);
    }
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrateRecords();
