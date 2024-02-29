// MODULE IMPORT
import express from "express"; // Handle HTTP requests and responses.
import bodyParser from "body-parser"; // Parse incoming request bodies.
import mongoose from "mongoose"; // Allows mongoDB to interact with the database.
import cors from "cors"; // Handles Cross-Origin Resource Sharing.
import helmet from "helmet"; // Secure HTTP headers.
import multer from "multer"; // Handles multipart/form-data.
import dotenv from "dotenv"; // Loads environment variables from a .env file.
import morgan from "morgan"; // Logs HTTP requests.
import path from "path"; // Manipulate file paths.
import { fileURLToPath } from "url"; // Convert file URLs to file paths.
// COMPONENT / FILE IMPORT
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

// CONFIGURATIONS //
// Setting up file and directory paths
const __filename = fileURLToPath(import.meta.url); // Convert file URL of the current module to a file path.
const __dirname = path.dirname(__filename); // Get the directory name of the current module's file.
dotenv.config(); // Load environment variables from .env file into process.env.
const app = express(); // Create an Express application.

// MIDDLEWARE SETUP //
app.use(express.json()) // Parsing incoming JSON requests.
app.use(helmet()); // Setting various HTTP headers for security.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Configuring CORS policy.
app.use(morgan("common")); // Logging HTTP requests using the 'common' format.
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Parsing JSON requests with specified options.
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Parsing URL-encoded requests with specified options.
app.use(cors()); // Enabling Cross-Origin Resource Sharing.
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // Serving static files from the specified directory

// FILE STOREAGE //
// Configure the storage engine using multer.diskStorage
const storage = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: (req, file, cb) => {
    // Set the destination path to "public/assets"
    cb(null, "public/assets");
  },
  // Define the filename for uploaded files
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original filename
  }
});
const upload = multer({ storage }); // Create a multer upload middleware instance

// ROUTES WITH FILES //
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES //
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use('/post', postRoutes);

// MONGOOSE SETUP //
// Set the port for the application, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;
// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {

    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParse: true,  // Ensure compatibility with newer MongoDB connection strings
      useUnifiedTopology: true, // Use the new MongoDB driver topology engine
    });
    console.log("connected to MongoDB...");
    app.listen(PORT, () => {
      console.log(`Connected to DB and listening on Port ${PORT}`)
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); //Exit the process if database connection fails
  }
};
connectDB(); //initiate connection