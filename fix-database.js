import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully");

    const db = mongoose.connection.db;
    const collection = db.collection("urls");

    // Drop the old shortCode index if it exists
    try {
      await collection.dropIndex("shortCode_1");
      console.log("✓ Dropped old shortCode_1 index");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ shortCode_1 index doesn't exist (already fixed)");
      } else {
        console.log("Note:", err.message);
      }
    }

    // Ensure the correct index exists
    await collection.createIndex({ shortId: 1 }, { unique: true });
    console.log("✓ Created shortId_1 index");

    console.log("\n✅ Database fixed successfully!");
    console.log("You can now run the server with: npm run dev");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing database:", error.message);
    process.exit(1);
  }
};

fixDatabase();
