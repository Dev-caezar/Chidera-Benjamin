import bcrypt from "bcryptjs";
import mongoose from "mongoose"

async function main() {
    const {MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD} = process.env
    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("Set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD")
    }

    await mongoose.connect(MONGODB_URI)
    const email = ADMIN_EMAIL.toLowerCase();
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12)

    await mongoose.connection
    .collection("users")
    .updateOne({email}, {$set: {email, password: hash}}, {upsert: true})
    console.log("Admin ready:", email);
    await mongoose.disconnect()
}
main()