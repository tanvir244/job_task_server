const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://job-task-scic-a998d.web.app'
    ]
}));
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9nu6wnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Database collections 
    const newUserCollection = client.db('scicJobTask').collection('newUser');
    const newProductCollection = client.db('scicJobTask').collection('newProduct');

    // API routes
    app.post('/new_user', async(req, res) => {
        const user = req.body;
        try {
            const result = await newUserCollection.insertOne(user);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Failed to create new user', error });
        }
    });

    app.post('/new_product', async(req, res) => {
      const product = req.body;
      try {
          const result = await newProductCollection.insertOne(product);
          res.send(result);
      } catch (error) {
          res.status(500).send({ message: 'Failed to create new product', error });
      }
    });

    app.get('/all_products', async(req, res) => {
      try {
          const result = await newProductCollection.find().toArray();
          res.send(result);
      } catch (error) {
          res.status(500).send({ message: 'Failed to fetch products', error });
      }
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } 
}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
    res.send('my Server is running');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
