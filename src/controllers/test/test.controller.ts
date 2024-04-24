import { Router, Request, Response } from "express";
import { Controller } from "../controller";
import { collections } from "../../services/database.service";

export class TestController implements Controller {
  collection: string = "test";
  path: string = "/test";
  router: Router = Router();

  initaliseRoutes(): void {
    // GET
    this.router.get("/connection-check", this.connectionCheck);

    // POST
    this.router.post('/test-upload', this.postToDb)
  }

  connectionCheck = async (request: Request, response: Response) => {
    try {
      response.status(200).send({ data: "Successful transaction with webscraper db" });
    } catch (error: any) {
      response.status(500).send({ data: error.message });
    }
  };

  postToDb = async (request: Request, response: Response) => {
    try {
      const result = await collections[this.collection].insertMany(request.body);
      result 
        ? response.status(201).send({ data: "Successfully inserted data" }) 
        : response.status(400).send({ data: "Failed to insert new test" });
    } catch (error: any) {
      response.status(500).send({ data: error.message });
    }
  };
}