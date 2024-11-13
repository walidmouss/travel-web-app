var express = require("express");
var path = require("path");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("login");
});

const { MongoClient } = require("mongodb");

async function main() {
  const uri = "mongodb://localhost:27017"; // Replace with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("destinations");
    const collection = database.collection("cities");

    const doc = { name: "Istanbul", price: "15000" };
    const result = await collection.insertOne(doc);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

app.listen(3000);
