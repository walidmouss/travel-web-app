/**
 * This file is responsible for connecting to the MongoDB database.
 * It also creates a unique index on the email field of the users collection.
 * If the collection is empty, it creates a hardcoded user with the email "
 * 
 * @module config/dbConfig
 * @requires mongodb
 * @requires bcrypt
 * @requires constants/index
 * @returns {Object} The MongoDB client and database objects
 * @throws {Error} If the connection to MongoDB fails
 * @throws {Error} If the hardcoded user cannot be created
 * --------------------------------------------------------------
 * Hardcoded user email: hatemthedev@gmail.com
 * Hardcoded user password: 123456789Aa
 * --------------------------------------------------------------
 */


const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

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
      const hashedPassword = await bcrypt.hash("123456789Aa", 10); // Hash the password
      const hardcodedUser = {
        email: "hatemthedev@gmail.com",
        password: hashedPassword,
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