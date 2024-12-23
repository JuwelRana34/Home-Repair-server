const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//  middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://homere-paire.web.app"],
    withCredentials: true,
  })
);
app.use(express.json());
require("dotenv").config();

// database setup
// const uri =`mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Pass}@cluster0.ocbhdf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb://localhost:27017`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("services");
const service = database.collection("service");
const orderedService = database.collection("booked_Service");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await database.command({ ping: 1 });
    console.log("********successfully connected to MongoDB!******");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// routes
app.get("/", async (req, res) => {
  const response = await service.find().toArray();
  res.send(response);
});
app.post("/AddService", async (req, res) => {
  const serviceData = req.body;

  const response = await service.insertOne(serviceData);
  res.send(response);
});
app.get("/AddService/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const response = await service
      .find({ "Provider_info.email": email })
      .toArray();
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});
app.get("/AddService/details/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await service.findOne({ _id: new ObjectId(id) });
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});
app.delete("/AddService/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await service.deleteOne({ _id: new ObjectId(id) });
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

app.patch("/AddService/:id", async (req, res) => {
  const id = req.params.id;
  const serviceData = req.body;
  try {
    const response = await service.updateOne(
      { _id: new ObjectId(id) },
      { $set: serviceData }
    );
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});
app.get("/booked_service/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const response = await orderedService
      .find({
        customer_email: email,
      })
      .toArray();
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});
app.get("/service_To_Do/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const response = await orderedService
      .find({
        Provider_email: email,
      }).toArray();
      
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});
app.patch("/service_To_Do/:status/:id", async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  console.log(status, id);

  try {
    const response = await orderedService.updateOne(
      {
        _id: new ObjectId(id),
      },
      { $set: { status: status } }
    );

    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

app.post("/booked_service", async (req, res) => {
  const booked_Data = req.body;

  try {
    const response = await orderedService.insertOne(booked_Data);
    res.send(response);
  } catch (err) {
    res.send(err);
  }

});

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
