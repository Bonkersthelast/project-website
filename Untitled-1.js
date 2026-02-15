require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  bio: String,
  level: Number,
  xp: Number,
  currency: Number
});

const User = mongoose.model("User", userSchema);

app.get("/", async (req, res) => {
  const users = await User.find();
  res.render("home", { users });
});

app.get("/profile/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.send("User not found");
  res.render("profile", { user });
});

app.get("/create", (req, res) => {
  res.send(`
    <form method="POST">
      <input name="username" placeholder="Username" required/>
      <input name="bio" placeholder="Bio"/>
      <button>Create Player</button>
    </form>
  `);
});

app.post("/create", async (req, res) => {
  const user = new User({
    username: req.body.username,
    bio: req.body.bio,
    level: 1,
    xp: 0,
    currency: 100
  });

  await user.save();
  res.redirect("/");
});

app.listen(PORT, () => console.log("Server running"));
