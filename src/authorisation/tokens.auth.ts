import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { debug } from '../services/debug.service'

export const tokenAuth = (req: Request, res: Response, next: NextFunction) => {
  const header: string = req.headers?.authorization || "";
  const [type, token] = header.split(" ");

  if (!process.env.SIGNATURE) {
    res.status(500).send({
      data: "Cannot verify token as no environmental token signature has been provided. Please see .env.example for information on how to setup a valid .env file",
    });
    return;
  }

  if (type !== "Bearer") {
    debug("info")("Request does not container a bearer token - assigning visitor privilages");
    req["access"] = { role: "visitor", privilages: ["visitor"] };
    next();
    return;
    // res.status(401).send({ data: "Unsupported authorisation type" });
    // return;
  }

  let payload: string | JwtPayload;
  try {
    payload = verify(token, process.env.SIGNATURE);
    if (payload["title"]) req["access"] = payload;
  } catch (error: any) {
    res.status(500).send({ data: error });
    return;
  }

  next();
};
