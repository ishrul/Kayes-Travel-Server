const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsezq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Travel_Agent");
    const servicesCollection = database.collection("Services");
    const ordersCollection = database.collection("Orders");

    // POST ORDERS API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      console.log("order hitted", order);
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
    // GET ORDERS API
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET SINGLE ORDER API
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      res.json(result);
    });

    // GET SINGLE SERVICE API
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("post hitted", service);
      const result = await servicesCollection.insertOne(service);

      res.json(result);
    });

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // DELETE API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment 11 is running");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
