import crypto from "crypto";
if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve dependencies from admin or backend node_modules
let dotenv, mongoose, bcryptjs;
try {
  dotenv = await import("dotenv");
  mongoose = (await import("mongoose")).default;
  bcryptjs = (await import("bcryptjs")).default;
} catch {
  // Fallback: resolve from backend directory
  const backendRequire = createRequire(path.resolve(__dirname, "../../backend/package.json"));
  dotenv = backendRequire("dotenv");
  mongoose = backendRequire("mongoose");
  bcryptjs = backendRequire("bcryptjs");
}

// Load backend/.env
dotenv.config({ path: path.resolve(__dirname, "../../backend/.env") });
dotenv.config();

import User from "../../backend/src/models/User.js";

const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ Error: MONGO_URI is not set in environment or backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const args = process.argv.slice(2);

    // Option 1: Promote existing user: node createAdmin.js --promote <email>
    if (args[0] === "--promote") {
      const email = args[1];
      if (!email) {
        console.error("Usage: node createAdmin.js --promote <email>");
        process.exit(1);
      }
      const user = await User.findOne({ email });
      if (!user) {
        console.error(`User with email "${email}" not found.`);
        process.exit(1);
      }
      user.role = "admin";
      user.isAdmin = true;
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      console.log(`✅ User ${user.email} successfully promoted to ADMIN!`);
      process.exit(0);
    }

    // Option 2: CLI arguments: node createAdmin.js <email> <password> <name>
    const email = args[0] || "admin@kbnews.com";
    const password = args[1] || "Admin@123456";
    const name = args[2] || "System Admin";

    let user = await User.findOne({ email });
    const hashedPassword = await bcryptjs.hash(password, 10);

    if (user) {
      user.role = "admin";
      user.isAdmin = true;
      user.isVerified = true;
      user.name = name;
      user.password = hashedPassword;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      console.log(`✅ Existing user "${email}" updated to ADMIN!`);
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        isAdmin: true,
        isVerified: true,
      });
      await user.save();
      console.log(`✅ New ADMIN user "${email}" successfully created!`);
    }

    console.log("-----------------------------------------");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     admin (isVerified: true)`);
    console.log("-----------------------------------------");
    console.log("You can now log in at /admin/login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
    process.exit(1);
  }
};

run();
