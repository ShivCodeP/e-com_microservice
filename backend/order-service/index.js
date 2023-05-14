const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const authenticated = require("../middlewares/authenticated");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const callbacks = require("./callbacks");
var channel, connection;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Routers
app.get("/order/v1", authenticated, async (req, res) => {
  return res.status(200).json({ message: "Welcome to order service" });
});

// RabbitMq connection
async function connectAmqp() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}

connectAmqp().then(() => {
  channel.consume("ORDER", async (data) => {
    console.log("Consuming the ORDER queue!");
    const parsedData = JSON.parse(data.content);
    // create the order and payment related stuff
    const response = await callbacks[parsedData.type](parsedData.payload);
    channel.ack(data);
    channel.sendToQueue("SHOP", Buffer.from(JSON.stringify(response)));
  });
});

const uri =
  "mongodb+srv://shivampractice:SKKR6JDQ7IzQSRLC@cluster0.u9tan.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const PORT = process.env.PORT_AUTH || 7000;
app.listen(PORT, async () => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Server running on ${PORT}`);
});
