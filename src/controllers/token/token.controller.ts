import { Request, Response, Router } from "express";
import { Controller } from "../controller";
import { checkAuth } from "../../authorisation/basic.auth";
import { debug } from "../../services/debug.service";
import { sign } from "jsonwebtoken";

export class TokenController implements Controller {
  collection: string = "token";
  path: string = "/token";
  router: Router = Router();

  initaliseRoutes(): void {
    //authorisation required for all actions below
    this.router.use(checkAuth(["admin"]));

    this.router.post("/", this.issueToken);
  }

  issueToken = async (request: Request, response: Response) => {
    try {
      const signature = process.env.SIGNATURE;
      const exparationInDays = process.env.TOKEN_EXARATION ?? 1;
      if (!signature) throw new Error("Unable to issue token because a valid SIGNATURE has not been set");
      const token = this.createToken(signature, request.body, +exparationInDays);

      token ? response.status(201).send({ data: token }) : response.status(400).send({ data: "unable to generate token" });
    } catch (error: any) {
      debug("error")(error);
      response.status(500).send({ data: error.message });
    }
  };

  private createToken(signature: string, content: object, exparationInDays?: number): string {
    return sign(
      content,
      signature,
      exparationInDays
        ? {
            expiresIn: `${exparationInDays}d`,
          }
        : {}
    );
  }
}
