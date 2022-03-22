const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyhry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("PadmaDiagonsotic");
    const DoctorsList = database.collection("Doctors");
    const userReview = database.collection("Reviews");
    const AppointBooking = database.collection("Appoints");
    // creating add doctors bio
    app.post("/add-doctors", async (req, res) => {
      const add = req.body;
      const doctorsBio = await DoctorsList.insertOne(add);
      console.log("getting a Doctor", doctorsBio);
      res.json(doctorsBio);
      console.log(doctorsBio);
    });
    app.get("/doctors", async (req, res) => {
      const cursor = DoctorsList.find({});
      const getDoctor = await cursor.toArray();
      res.send(getDoctor);
      console.log(getDoctor);
    });

    app.get("/doctors/:serviceId", async (req, res) => {
      const docId = req.params.serviceId;
      const query = { _id: ObjectId(docId) };
      const getDoctor = await DoctorsList.findOne(query);
      console.log("getting single Doctor", getDoctor);
      res.send(getDoctor);
    });
    // working on appointments
    app.post("/appoints", async (req, res) => {
      const order = req.body;
      const confirmAppoints = await AppointBooking.insertOne(order);
      res.json(confirmAppoints);
    });

    app.get("/my-appoints", async (req, res) => {
      const cursor = AppointBooking.find({});
      const getBooking = await cursor.toArray();
      res.send(getBooking);
      console.log(getBooking);
    });
    // delete product from manage products

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await DoctorsList.deleteOne(query);
      console.log("deleting product", result);
      res.json(result);
    });
    // creating user Review
    app.post("/get-review", async (req, res) => {
      const add = req.body;
      const doctorsReview = await userReview.insertOne(add);
      console.log("getting a Doctor", doctorsReview);
      res.json(doctorsReview);
      console.log(doctorsReview);
    });
    app.get("/my-review", async (req, res) => {
      const cursor = userReview.find({});
      const getDoctorReview = await cursor.toArray();
      res.send(getDoctorReview);
      console.log(getDoctorReview);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Project Server Is Running");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
