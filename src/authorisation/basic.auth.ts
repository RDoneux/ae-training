import { NextFunction, Request, Response } from "express";
import { debug } from "../services/debug.service";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req["access"]) {
    next();
  } else {
    debug("error")("Request didn't contain an access paramater");
    res.status(401).send({ data: "Not Authorised" });
  }
};

export const checkAuth = (authLevel: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const auth = authLevel.filter((value) => req["access"].privilages.includes(value));
  if (auth.length) {
    next();
  } else {
    debug("error")("Request privilages did not match the endpoint privilage requirement");
    res.status(401).send({ data: "Not Authorised" });
  }
};
