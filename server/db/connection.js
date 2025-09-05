import { MongoClient, ServerApiVersion } from "mongodb";

const URI = `mongodb+srv://zachsham:${process.env.MONGOPASSWORD}@cluster0.ir7ale0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (err) {
  console.error(err);
}

let db = client.db("employees");

export default db;