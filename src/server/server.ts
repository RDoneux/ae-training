import express from "express";
import https from "http";
import compress from "compression";
import bodyParser from "body-parser";
import { Controller } from "../controllers/controller";
import { connectToDatabase } from '../services/database.service'
import cors from 'cors'
import { corsOptions } from "../services/cors.service";

export class Server {
  private server = express();
  private https: https.Server<typeof https.IncomingMessage, typeof https.ServerResponse> | undefined;

  constructor(port: number, controllers?: Controller[]) {
    this.startServer(port, controllers);
  }

  public close(): void {
    this.https?.close();
    this.https = undefined;
  }

  private startServer(port: number, controllers?: Controller[]): void {
    this.https = https.createServer(this.server).listen(port);
    this.setup(port, controllers);
  }

  private setup(port: number, controllers?: Controller[]) {
    this.initaliseUtilServices();
    this.initaliseAdminServices();
    this.initaliseAuthServices();

    this.initaliseControllers(controllers);
    this.connectToDB(controllers);

    this.initaliseNotFound();
  }

  private initaliseUtilServices(): void {
    this.server.use(compress());
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(bodyParser.json());
  }

  private initaliseAdminServices(): void {}

  private initaliseAuthServices(): void {}

  private initaliseControllers(controllers?: Controller[]): void {
    this.server.use(cors(corsOptions))

    controllers?.forEach((controller: Controller) => {
      controller.initaliseRoutes();
      this.server.use(controller.path, controller.router);
    });
  }

  private connectToDB(controllers?: Controller[]): void {
    connectToDatabase(controllers).catch((error: Error) => {
      console.error(`Database connection failed ${error}`);
    });
  }

  private initaliseNotFound(): void {}
}