import { Collection, Db, MongoClient } from "mongodb";
import { Controller } from "../controllers/controller";
import dotEnv from 'dotenv'

export const collections: { [key: string]: Collection }[] = [];

export async function connectToDatabase(controllers?: Controller[]): Promise<void> {

  dotEnv.config();

  const connectionString: string | undefined = process.env.MONGO_URL;
  if (!connectionString) {
    console.error(`DB connection string could not be found...`);
    return;
  }
  const client: MongoClient = new MongoClient(connectionString);
  const db: Db = client.db("products");

  controllers?.forEach((controller: Controller) => {
    collections[controller.collection] = db.collection(controller.collection);
  });

  for await (const collection of db.listCollections()) {
    console.log(` | Successfully connected to '${collection.name}' collection`);
  }

  collections["access_keys"] = db.collection("access_keys");
  console.log("Database connection successfull");
}