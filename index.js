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
    const UsersTestCollection = database.collection("Medical-Test");
    const userReview = database.collection("Reviews");
    const AppointBooking = database.collection("Appoints");
    const userCollection= database.collection('users')
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
      const email = req.query.email;
      const query = { email: email };
      console.log(query);
      const cursor = AppointBooking.find(query);
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
    // adding medical test
    app.post("/add-test", async (req, res) => {
      const add = req.body;
      const getMedicalTest = await UsersTestCollection.insertOne(add);
      console.log("getting a Doctor", getMedicalTest);
      res.json(getMedicalTest);
      console.log(getMedicalTest);
    });
    app.get("/all-test", async (req, res) => {
      const cursor = UsersTestCollection.find({});
      const getDoctor = await cursor.toArray();
      res.send(getDoctor);
      console.log(getDoctor);
    });
    app.get("/lab-test/:serviceId", async (req, res) => {
      const docId = req.params.serviceId;
      const query = { _id: ObjectId(docId) };
      const getLabTest = await UsersTestCollection.findOne(query);
      console.log("getting test", getLabTest);
      res.send(getLabTest);
    });
    app.post('/users', async(req, res)=>{
      const user= req.body;
      const getUser= await userCollection.insertOne(user)
      res.json(getUser)
      console.log(getUser)
    })
    // for google sign in if user registred or not. 
    // (jodi user first time google sign in kore tahole database e add hobe..
    //    ar jodi same user abar login kore tahole database e add hobe na)
    app.put('/users', async(req, res)=>{
      const user= req.body;
      const filter= {email:user.email};
      const options = {upsert: true};
      const updateDoc= {$set:user}
      const result= await userCollection.updateOne(filter, updateDoc, options);
      res.json(result)
    })
    app.put('/users/admin', async(req, res)=>{
      const user= req.body;
      console.log(user)
      const filter={email: user.email};
      const updateDoc= {$set:{role:'admin'}}
      const result= await userCollection.updateOne(filter, updateDoc);
      res.json(result)
    })
    //verifying user is admin or just user
    app.get("/users/:email", async(req, res)=>{
      const email= req.params.email;
      const query= {email:email};
      const user= await userCollection.findOne(query);
      let isAdmin= false
      if(user?.role==='admin'){
        isAdmin= true
      }
      res.json({admin: isAdmin})
   
    })

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
