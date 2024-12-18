const { MongoClient, ObjectId } = require('mongodb');

async function connectToDatabase() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("travel-web-app");
    console.log("Connected to database:", database.databaseName);
    
    // Create unique index on email field
    await database.collection("users").createIndex({ "email": 1 }, { unique: true });

    // Only try to create the hardcoded user if the collection is empty
    const userCount = await database.collection("users").countDocuments();
    if (userCount === 0) {
      const hardcodedUser = {
        email: "hatemthedev@gmail.com",
        password: "123456789Aa",
        wantToGoList: []
      };

      try {
        await database.collection("users").insertOne(hardcodedUser);
        console.log("Initial user created successfully");
      } catch (error) {
        if (error.code !== 11000) { // Ignore duplicate key errors
          throw error;
        }
      }
    }

    return { client, database };
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

module.exports = connectToDatabase;