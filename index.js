const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://job_task_again:ScFC0UHSyRLHKDOc@cluster0.bls3tyg.mongodb.net/bloodDB?retryWrites=true&w=majority&appName=Cluster0";
const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blood-server-six.vercel.app",
      "https://blood-server-kll5ad23k-hamims-projects-5221904d.vercel.app",
     
    ], // Your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, au>cth headers)
  })
);

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
    // await client.close();
    await client.connect();
    // await client.db("admin").command({ /: 1 });
    const database = client.db("bloodDB");
    const usersCollection = database.collection("users");
    const donarCollection = database.collection("donars");

    //ceate new usert and save data base
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);

      const result = await usersCollection.insertOne(user);
      res.status(201).json({ message: "success", result });
    });

    app.post("/blood", async (req, res) => {
      
    })

    // add blood reauest for new donate
    app.post("/donate-request", async (req, res) => {
      const donate = req.body;
      const result = await donarCollection.insertOne(donate);
      res.status(201).json({
        message: "success",
        result,
      });
    });

    //find single user by email
    app.get("/user/:email", async (req, res) => {
      const userEmail = req.params.email;
      console.log(userEmail);
      const options = {};
      const query = { email: userEmail };
      const result = await usersCollection.findOne(query, options);
      res.send(result);
    });

    //find pending donar

    app.get("/donars", async (req, res) => {
      // const query = { status: "pending" };
      const result = await donarCollection.find().toArray();
      res.send(result);
    });

    // my donatae request
    app.get("/donar/:email", async (req, res) => {
      const userEmail = req.params.email;
      console.log(userEmail);
      const options = {};
      const query = { email: userEmail };
      const result = await donarCollection.findOne(query, options);
      res.send(result);
    });

    //update donat

    app.put("/update-donar/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "accept",
        },
      };
      const result = await donarCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //delete donar

    app.delete("/delete-donar/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donarCollection.deleteOne(query);
      res.send(result);
    });

    //donars-blood

    app.get("/donars-blood", async (req, res) => {
      const query = { isDonate: false, status: "accept" };
      const result = await donarCollection.find(query).toArray();
      res.send(result);
    });

    //search donor
    app.get("/search-donor", async (req, res) => {
      const datas = req.query;
      console.log(datas);
      let bloodGroup = datas.bloodGroup;
      bloodGroup = bloodGroup.replace(" ", "+");
      const district = datas.district;
      const donorType = datas.donorType;
      const query = {
        bloodGroup: {
          $regex: bloodGroup,
          $options: "i", // Case-insensitive
        },
        district: {
          $regex: district,
          $options: "i", // Case-insensitive
        },
        donorType: {
          $regex: donorType,
          $options: "i", // Case-insensitive
        },
        status: {
          $regex: 'accept',
        },
        isDonate: false
      };

      const result = await donarCollection.find(query).toArray();
      res.send(result);
    });

    //my donate request
    app.get("/my-donate-request/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await donarCollection.find(query).toArray();
      res.send(result);
    });

    // donate confimr
    app.put("/confirm-donate/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          isDonate: true,
        },
      };
      const result = await donarCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // await client.close();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //  await  client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Blood Server Is Running.......");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
