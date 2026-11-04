// scripts/migrate-visuals.ts
import { toBlocks } from "@/lib/block";
import mongoose from "mongoose";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  await mongoose.connect(uri);
  const col = mongoose.connection.collection("projects");

  let count = 0;
  for await (const doc of col.find({})) {
    await col.updateOne(
      { _id: doc._id },
      {
        $set: {
          personas: toBlocks(doc.personas),
          process: toBlocks(doc.process),
          designSystem: toBlocks(doc.designSystem),
        },
      },
    );
    count++;
  }

  console.log(`Migrated ${count} project(s)`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
