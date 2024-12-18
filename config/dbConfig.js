const { MongoClient, ObjectId } = require('mongodb');

async function connectToDatabase() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Select the database and collection
    const database = client.db("travel-web-app");
    console.log("Connected to database:", database.databaseName);
    const usersCollection = database.collection("users");

    // Hard-coded user document
    const hardcodedUser = {
      "_id": new ObjectId(), // Generate a new ObjectId
      "email": "hatemthedev@gmail.com",
      "password": "123456789Aa",
      "wantToGoList": []
    };

    // Query to check if the user already exists in the collection
    const existingUser = await usersCollection.findOne({ email: hardcodedUser.email });

    // Check if user already exists to avoid duplicates
    if (!existingUser) {
      console.log("Inserting hardcoded user:", hardcodedUser);
      const result = await usersCollection.insertOne(hardcodedUser);
      console.log(`Hardcoded user inserted with ID: ${result.insertedId}`);
    } else {
      console.log("Hardcoded user already exists:", existingUser);
    }

    return client;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

module.exports = connectToDatabase;