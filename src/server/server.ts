import express from "express";
import https from "http";
import compress from "compression";
import bodyParser from "body-parser";
import { Controller } from "../controllers/controller";
import { connectToDatabase } from "../services/database.service";
import { debug, expressDebug } from "../services/debug.service";
import { tokenAuth } from "../authorisation/tokens.auth";
import { requireAuth } from "../authorisation/basic.auth";
import { TokenController } from "../controllers/token/token.controller";

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
    this.initaliseAuthServices();
    this.initaliseAdminServices();

    this.initaliseControllers(controllers);
    this.connectToDB(controllers);

    this.initaliseNotFound();
  }

  private initaliseUtilServices(): void {
    this.server.use(expressDebug);
    this.server.use(compress());
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(bodyParser.json());
    debug("info")("Initalised util services");
  }

  private initaliseAdminServices(): void {
    const tokenController: TokenController = new TokenController();
    tokenController.initaliseRoutes();
    this.server.use(tokenController.path, tokenController.router);
    debug("info")("Initalised admin services");
  }

  private initaliseAuthServices(): void {
    this.server.use(tokenAuth);
    this.server.use(requireAuth);
    debug("info")("Initalised auth services");
  }

  private initaliseControllers(controllers?: Controller[]): void {
    controllers?.forEach((controller: Controller) => {
      controller.initaliseRoutes();
      this.server.use(controller.path, controller.router);
    });
    debug("info")("Initalised controllers");
  }

  private connectToDB(controllers?: Controller[]): void {
    connectToDatabase(controllers).catch((error: Error) => {
      debug("error")(`Database connection failed ${error}`);
    });
  }

  private initaliseNotFound(): void {}
}
