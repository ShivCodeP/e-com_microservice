const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const UserModel = require("./models/user.model");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_ACCESS_KEY || "secret";
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const newToken = (user) => {
  return jwt.sign({ user }, secret);
};

// Routers
app.get("/auth/v1", async (req, res) => {
  return res.status(200).json({ message: "Welcome to auth service" });
});

app.post("/auth/register", async (req, res) => {
  try {
    const userData = req.body;
    console.log(userData);
    if (userData?.password?.length < 8) {
      return res.status(400).json({
        message: "Password length should be greater than equal to 8 character",
      });
    }
    const isUserExist = await UserModel.exists({ email: userData.email });
    if (isUserExist) {
      return res.status(400).json({
        message:
          "User already exist with this email, Please use diffrent email!",
      });
    }
    await UserModel.create(userData);
    return res.status(200).json({ message: "User registered successfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong!" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const userData = req.body;
    const user = await UserModel.findOne({ email: userData?.email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist!" });
    }
    const match = await user.checkpassword(userData.password);
    // if not match then throw an error
    if (!match)
      return res
        .status(400)
        .json({ message: "Please provide correct credentials" });
    // if it matches then create the token
    const token = newToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong!" });
  }
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

const PORT = process.env.PORT_AUTH || 4000;
app.listen(PORT, async () => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Server running on ${PORT}`);
});
