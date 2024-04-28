import dbg from "debug";
import { NextFunction, Request, Response } from "express";

export const debug = (namespace: string) => dbg(`${namespace} | `);

export const debugInit = () => {
  dbg.enable(
    JSON.parse(process.env.DEBUG ?? "[]")
      .map((namespace: string) => `${namespace} | `)
      .join(",")
  );
};

export const expressDebug = (req: Request, res: Response, next: NextFunction) => {
  debug("info")(`${req.method}: \t ${req.url}`);
  next();
};
