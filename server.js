require("dotenv").config(); // import once
const express = require("express");

console.log(process.env.PORT, "port")
const PORT = process.env.PORT || 3500;
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const path = require("path");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: "true",
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Allow necessary headers
  })
);



connectDB();
app.use((req, res, next) => {
  res.header({"Access-Control-Allow-Origin": "*"});
  next();
}) 
// lets us to receive json files
app.use(express.json());

// app.set("trust proxy", 1 /* number of proxies between user and server */);
// app.get("/ip", (request, response) => response.send(request.ip));

app.use(cookieParser());

app.use("/", express.static("public")); // css style file
app.use("/", require("./routes/root"));

app.use("/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/notes", require("./routes/notesRoutes"));


app.use("*", (req, res) => {
  res.status(400);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
