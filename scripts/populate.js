const { MongoClient } = require("mongodb");
// const { v4: uuidv4 } = require("uuid");

async function populateDB() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("stock_db");
    const collection = database.collection("stock");

    const dummyData = [];
    const warehouseId = "317f7cf7-3ff4-4540-acf3-6b6a053efbaf"; // uuidv4()
    for (let i = 0; i < 20; i++) {
      const now = new Date();
      const document = {
        productId: "6f7a3e2f-b442-4982-9e4a-4d829c11fffd", // uuidv4()
        warehouseId,
        availability: Math.floor(Math.random() * 100) + 1,
        createdAt: now,
        updatedAt: now,
      };
      dummyData.push(document);
    }

    const result = await collection.insertMany(dummyData);
    console.log(`${result.insertedCount} documents inserted.`);
  } finally {
    await client.close();
  }
}

populateDB().catch(console.error);
