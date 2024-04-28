import { Collection, Db, MongoClient } from "mongodb";
import { Controller } from "../controllers/controller";
import { debug } from "./debug.service";

export const collections: { [key: string]: Collection }[] = [];

export async function connectToDatabase(controllers?: Controller[]): Promise<void> {
  const connectionString: string | undefined = process.env.MONGO_URL;
  if (!connectionString) {
    debug("error")("DB connection string could not be found... Have you set the MONGO_URL env");
    return;
  }
  const client: MongoClient = new MongoClient(connectionString);
  const db: Db = client.db("default");

  controllers?.forEach((controller: Controller) => {
    collections[controller.collection] = db.collection(controller.collection);
  });

  for await (const collection of db.listCollections()) {
    debug("info")(`Successfully connected to '${collection.name}' collection`);
  }

  collections["access_keys"] = db.collection("access_keys");
  debug("success")("Database connection successfull");
}
