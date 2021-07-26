const mongooose = require("mongoose");

const Schema = mongooose.Schema;

const userSchema = new Schema({
  googleId: String,
  username: String,
  picture: String,
});

mongooose.model("User", userSchema);
