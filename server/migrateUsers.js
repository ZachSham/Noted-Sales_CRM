import db from "./db/connection.js";

async function migrateUsers() {
  try {
    console.log("Starting user migration...");
    
    // Create users collection if it doesn't exist
    const usersCollection = await db.collection("users");
    
    // Check if admin user already exists
    const adminUser = await usersCollection.findOne({ username: "admin" });
    if (!adminUser) {
      // Create default admin user
      const adminDocument = {
        username: "admin",
        password: "admin12345",
        createdAt: new Date(),
      };
      await usersCollection.insertOne(adminDocument);
      console.log("✓ Created admin user");
    } else {
      console.log("✓ Admin user already exists");
    }
    
    // Get admin user ID
    const admin = await usersCollection.findOne({ username: "admin" });
    const adminUserId = admin._id;
    
    // Update existing records to belong to admin user
    const recordsCollection = await db.collection("records");
    const recordsToUpdate = await recordsCollection.find({
      userId: { $exists: false }
    }).toArray();
    
    if (recordsToUpdate.length > 0) {
      console.log(`Found ${recordsToUpdate.length} records to migrate`);
      await recordsCollection.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: adminUserId } }
      );
      console.log("✓ Migrated existing records to admin user");
    } else {
      console.log("✓ No records need migration");
    }
    
    // Update existing tasks to belong to admin user
    const tasksCollection = await db.collection("tasks");
    const tasksToUpdate = await tasksCollection.find({
      userId: { $exists: false }
    }).toArray();
    
    if (tasksToUpdate.length > 0) {
      console.log(`Found ${tasksToUpdate.length} tasks to migrate`);
      await tasksCollection.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: adminUserId } }
      );
      console.log("✓ Migrated existing tasks to admin user");
    } else {
      console.log("✓ No tasks need migration");
    }
    
    // Update existing meetings to belong to admin user
    const meetingsCollection = await db.collection("meetings");
    const meetingsToUpdate = await meetingsCollection.find({
      userId: { $exists: false }
    }).toArray();
    
    if (meetingsToUpdate.length > 0) {
      console.log(`Found ${meetingsToUpdate.length} meetings to migrate`);
      await meetingsCollection.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: adminUserId } }
      );
      console.log("✓ Migrated existing meetings to admin user");
    } else {
      console.log("✓ No meetings need migration");
    }
    
    console.log("User migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrateUsers();
