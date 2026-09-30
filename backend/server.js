import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import rootRouter from "./router/index.js";
import path from "path";
import { fileURLToPath } from "url";
// import productRoutes from "./routes/productRoutes.js"; // Ensure your routes use ES syntax

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());

// Configure body-parser middleware with increased limit
app.use(bodyParser.json({ limit: "100mb" })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/v1", rootRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});