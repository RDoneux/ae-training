import { Router } from "express";

export interface Controller {
  collection: string;
  path: string;
  router: Router;

  initaliseRoutes(): void;
}