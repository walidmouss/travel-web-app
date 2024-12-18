const { MongoClient, ObjectId } = require('mongodb');

async function connectToDatabase() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Select the database and collection
    const database = client.db("travel-web-app"); // Replace with your actual database name
    const usersCollection = database.collection("users");

    // Hard-coded user document
    const hardcodedUser = {
      "_id": new ObjectId(), // Generate a new ObjectId
      "username": "h4temsoliman",
      "email": "hatemthedev@gmail.com",
      "password": "123456789Aa", // Note: In a real app, NEVER store plain text passwords
      "wantToGoList": []
    };

    // Check if user already exists to avoid duplicates
    const existingUser = await usersCollection.findOne({ email: hardcodedUser.email });
    if (!existingUser) {
      // Insert the hard-coded user
      const result = await usersCollection.insertOne(hardcodedUser);
      console.log(`Hard-coded user inserted with ID: ${result.insertedId}`);
    } else {
      console.log("Hard-coded user already exists");
    }

    return client;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

module.exports = connectToDatabase;