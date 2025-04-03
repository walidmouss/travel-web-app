# “المنتقمون: فرع شبكات مصر”

Table of Contents

    •	Project Overview
    •	Features
    •	Project Structure
    •	Installation
    •	Configuration
    •	Usage
    •	Technologies Used
    •	Contributing
    •	License

Project Overview

This is a web application developed using the MERN stack without React (MERN without the “R”). The project leverages HTML, CSS, JavaScript, Node.js, Express, and MongoDB Atlas. It demonstrates a well-structured web application with server-side rendering using EJS (Embedded JavaScript Templates). The project is designed to showcase core web development concepts and integrate MongoDB Atlas for backend data storage without using an ODM like Mongoose.

Features

    •	Server-Side Rendering with EJS for dynamic content.
    •	RESTful API endpoints for backend communication.
    •	MongoDB Atlas Integration for database management.
    •	Express.js routing and middleware configuration.
    •	Static Assets served from the public folder.
    •	Basic CRUD Operations implemented for data handling.
    •	Responsive Design using HTML, CSS, and JavaScript.

Project Structure

your-project/
├── public/ # Static assets (CSS, JS, images)
├── views/ # EJS templates for server-side rendering
├── routes/ # Route handlers for different endpoints
│ └── index.js # Main route file
├── config/ # Configuration files (e.g., dbConfig.js)
├── .env # Environment variables
├── app.js # Main application file
├── package.json # Project metadata and dependencies
└── README.md # Project documentation

Installation

To set up the project locally, follow these steps:

Prerequisites

Ensure you have the following installed:
• Node.js (v14+)
• npm
• MongoDB Atlas account

Steps to Install

    1.	Clone the Repository:

git clone https://github.com/youremail/your-project.git
cd your-project

    2.	Install Dependencies:

Run the following command to install all required npm packages:

npm install

    3.	Set Up Environment Variables:

Create a .env file in the root directory with the following content:

MONGO_URI=mongodb+srv://<email>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
PORT=3000

    •	Replace <email>, <password>, and <database> with your MongoDB Atlas credentials.

    4.	Start the Application:

Run the project in development mode:

npm run dev

Or in production mode:

npm start

    5.	Verify:

Open your browser and go to http://localhost:3000 to see the application in action.

Configuration

Ensure your MongoDB Atlas cluster is set up with a database and collection to match your application’s needs.

MongoDB Connection

The config/dbConfig.js file contains the connection logic using the MongoDB native driver.

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDatabase() {
try {
await client.connect();
console.log('Connected to MongoDB Atlas');
db = client.db('<database>'); // Replace <database> with your actual database name
} catch (error) {
console.error('Error connecting to MongoDB:', error);
}
}

function getDb() {
if (!db) {
throw new Error('Database not connected. Call connectToDatabase first.');
}
return db;
}

module.exports = { connectToDatabase, getDb };

Usage

    •	Running the server: npm run dev
    •	Navigating the app: Open http://localhost:3000

Technologies Used

    •	HTML, CSS, JavaScript: Frontend structure and design.
    •	Node.js: JavaScript runtime for backend.
    •	Express.js: Web framework for routing and middleware.
    •	EJS: Templating engine for server-side rendering.
    •	MongoDB Atlas: Cloud database service for backend storage.
    •	dotenv: Managing environment variables securely.

Contributing

Contributions are welcome! Please fork this repository and submit a pull request.

License

This project is licensed under the MIT License.

Feel free to modify any sections or add additional details specific to your project!
