const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const amqp = require("amqplib");
const ProductModel = require("./models/product.model");
const authenticated = require("../middlewares/authenticated");
const CartModel = require("./models/cart.model");
var channel, connection;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// Routers
app.get("/shop/v1", authenticated, async (req, res) => {
  return res.status(200).json({ message: "Welcome to shop service" });
});

app.get("/shop/list", authenticated, async (req, res) => {
  try {
    const filter = req.body.filter || {};
    // pagination can be added
    const products = await ProductModel.find(filter).lean();
    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Something went wrong!" });
  }
});

app.post("/shop/createProduct", authenticated, async (req, res) => {
  try {
    const product = req.body;
    if (!product) {
      res.status(400).json({ message: "Not able to create a product!" });
    }
    const newProduct = await ProductModel.create(product);
    return res.status(200).send({ product: newProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Something went wrong!" });
  }
});

app.post("/shop/addtocart", authenticated, async (req, res) => {
  try {
    const productData = req.body;
    const userData = req.currentUser?.user;
    const product = await ProductModel.findById(productData._id);
    if (!product) {
      return res
        .status(400)
        .send({ message: "Product not found!", success: false });
    }
    const isInCart = await CartModel.findOne({
      productId: product?._id,
      userId: userData?._id,
      status: "IN_CART",
    });

    if (isInCart) {
      await CartModel.findByIdAndUpdate(isInCart?._id, {
        $set: {
          quantity: (isInCart?.quantity || 0) + (productData?.quantity || 1),
        },
      });
    } else {
      const cartData = {
        productId: product._id,
        userId: userData._id,
        quantity: productData.quantity || 1,
      };

      await CartModel.create(cartData);
    }
    return res.status(200).json({ message: "Added to the cart!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Something went wrong!" });
  }
});

app.post("/shop/buyProduct", authenticated, async (req, res) => {
  try {
    const { _id } = req.body;
    const userData = req.currentUser?.user;
    const product = await ProductModel.findById(_id);
    if (!product) {
      return res.status(500).json({ message: "Product not found!" });
    }
    let order;
    channel.sendToQueue(
      "ORDER",
      Buffer.from(
        JSON.stringify({
          type: "createOrder",
          payload: {
            product,
            userId: userData?._id,
          },
        })
      )
    );
    channel.consume("SHOP", (data) => {
      console.log("Consuming the SHOP queue!");
      order = JSON.parse(data.content);
      channel.ack(data);
      return res.status(200).json(order);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message || "Something went wrong!" });
  }
});

// RabbitMq connection
async function connectAmqp() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("SHOP");
}
connectAmqp();

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

const PORT = process.env.PORT_AUTH || 5000;
app.listen(PORT, async () => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Server running on ${PORT}`);
});
