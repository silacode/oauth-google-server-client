//................................................. Imports ...............................................
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

// require internal modules - schema and passport setup
require("./models/user.model");
require("./services/passport");

//............................................... Constant .................................................
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const COOKIE_KEY = process.env.COOKIE_KEY;

//............................................... App Setup ................................................
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// cookie setup
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    name: "session",
    keys: [COOKIE_KEY],
  })
);
// passport initialization and setup for cookie session
app.use(passport.initialize());
app.use(passport.session());

//..............................................  Database  .............................................
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("connected", () => console.log("Connected to mongoDb atlas"));
db.on("error", (err) => console.log("Failed to connect to mongoDb atlas", err));
db.on("disconnected", () => console.log("MongoDB event disconnected"));
process.on("SIGINT", () => {
  db.close(() => {
    console.log(
      "Mongoose connection is disconnected due to application termination"
    );
    process.exit(0);
  });
});

//............................................. routes .................................................
require("./routes/authRoute")(app);
app.get("/", (req, res) => {
  res.send("App working.");
});

//............................................. Listen Port ............................................
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
