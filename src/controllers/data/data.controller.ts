import { Router, Request, Response } from "express";
import { Controller } from "../controller";
import { collections } from "../../services/database.service";

export class DataController implements Controller {
  collection: string = "data";
  path: string = "/data";
  router: Router = Router();

  initaliseRoutes(): void {
    // GET
    this.router.get("/", this.getExampleData);

    // POST
    this.router.post("/", this.postExampleData);
  }

  getExampleData = async (request: Request, response: Response) => {
    try {
      const result = await collections[this.collection].find({}).toArray();
      result ? response.status(200).send({ data: result }) : response.status(400).send({ data: "Failed to fetch data" });
    } catch (error: any) {
      response.status(500).send({ data: error.message });
    }
  };

  postExampleData = async (request: Request, response: Response) => {
    try {
      const body = request.body.map((item: any) => ({ updateOne: { filter: { id: item.id }, update: { $set: { checked: item.checked } } } }));
      const result = await collections[this.collection].bulkWrite(body);
      result
        ? response.status(201).send({ data: { itemsModified: result.modifiedCount, itemsFound: result.matchedCount } })
        : response.status(400).send({ data: "Failed to fetch data" });
    } catch (error: any) {
      response.status(500).send({ data: error.message });
    }
  };
}