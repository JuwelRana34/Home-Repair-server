const express = require("express");
const app = express();
const cors = require("cors");
let jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//  middleware
app.use(
  cors({
    origin: [
      "https://homere-paire.web.app",
      "https://home-repairbd.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
require("dotenv").config();

// database setup
const uri = `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Pass}@cluster0.ocbhdf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // console.log("********successfully connected to MongoDB!******");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// routes

app.post("/jwt", (req, res) => {
  const playload = req.body;
  let token = jwt.sign(playload, process.env.jwt_secret, { expiresIn: "1d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.send({ success: true });
});

const verifyToken = (req, res, next) => {
  let token = req.cookies?.token;
  if (!token) {
    return res.status(403).send({ message: " unauthorized access" });
  }
  jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: " unauthorized access" });
    }

    req.email = decoded.email;
    next();
  });
};

app.post("/logOut", (req, res) => {
  res
    .clearCookie("token", {
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});

app.get("/services/popular", async (req, res) => {
  const response = await service.find().sort({ price: -1 }).limit(6).toArray();
  res.send(response);
});
app.get("/", async (req, res) => {
  const searchText = req.query.filter;
  let { sort } = req.query;

  let filter = {};
  if (searchText) {
    filter.Service_Name = { $regex: searchText, $options: "i" };
  }
  let sortbyprice = {};
  if (sort) {
    sortbyprice = { price: sort === "asc" ? 1 : -1 };
  }

  const response = await service.find(filter).sort(sortbyprice).toArray();
  res.send(response);
});

app.post("/AddService", verifyToken, async (req, res) => {
  if (!req.email) {
    return res.status(403).send({ message: "unauthorized access" });
  }
  const serviceData = req.body;

  const response = await service.insertOne(serviceData);
  res.send(response);
});
app.get("/AddService/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  if (req.email !== email) {
    return res.status(403).send({ message: "unauthorized access" });
  }
  try {
    const response = await service
      .find({ "Provider_info.email": email })
      .toArray();
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});
app.get("/AddService/details/:id", verifyToken, async (req, res) => {
  if (!req.email) {
    return res.status(403).send({ message: "unauthorized access" });
  }
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
app.get("/booked_service/:email", verifyToken, async (req, res) => {
  const email = req.params.email;

  if (req.email !== email) {
    return res.status(403).send({ message: "unauthorized access" });
  }

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
app.get("/service_To_Do/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  if (req.email !== email) {
    return res.status(403).send({ message: "unauthorized access" });
  }

  try {
    const response = await orderedService
      .find({
        Provider_email: email,
      })
      .toArray();

    res.send(response);
  } catch (err) {
    res.send(err);
  }
});
app.patch("/service_To_Do/:status/:id", async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

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
