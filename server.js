require("dotenv").config();
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

let db;

const url = process.env.DB_STRING;
const dbName = "demo";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await db.collection("messages").find().toArray();
    res.render("index.ejs", { messages: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading messages");
  }
});

app.post("/messages", async (req, res) => {
  try {
    await db
      .collection("messages")
      .insertOne({ name: req.body.name, msg: req.body.msg, thumbUp: 0 });
    console.log("saved to database");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving message");
  }
});

app.put("/messages/thumbUp", async (req, res) => {
  try {
    const result = await db
      .collection("messages")
      .findOneAndUpdate(
        { name: req.body.name, msg: req.body.msg },
        { $inc: { thumbUp: 1 } },
        { sort: { _id: -1 }, returnDocument: "after" },
      );
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.put("/messages/thumbDown", async (req, res) => {
  try {
    const result = await db
      .collection("messages")
      .findOneAndUpdate(
        { name: req.body.name, msg: req.body.msg },
        { $inc: { thumbUp: -1 } },
        { sort: { _id: -1 }, returnDocument: "after" },
      );
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.delete("/messages", async (req, res) => {
  try {
    await db
      .collection("messages")
      .findOneAndDelete({ name: req.body.name, msg: req.body.msg });
    res.json("Message deleted!");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

const start = async () => {
  const client = await MongoClient.connect(url);
  db = client.db(dbName);
  console.log(`Connected to ${dbName}!`);
  app.listen(3000, () =>
    console.log("Server running on http://localhost:3000"),
  );
};

start().catch((err) =>
  console.log("Could not connect to MongoDB:", err.message),
);
