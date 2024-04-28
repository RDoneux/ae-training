import { Router, Request, Response } from "express";
import { collections } from "../../services/database.service";
import { Controller } from "../controller";
import { ObjectId } from "mongodb";
import { ITest } from "../../models/test.model";
import { debug } from "../../services/debug.service";
import { checkAuth } from "../../authorisation/basic.auth";

export class TestController implements Controller {
  collection: string = "test";
  path: string = "/test";
  router: Router = Router();

  initaliseRoutes(): void {
    // GET
    this.router.get("/", this.getAllTestData);
    this.router.get("/:id", this.getTestData);

    // authorisation required for all actions below
    this.router.use(checkAuth(["admin"]));
    // POST
    this.router.post("/", this.postTestData);
    // this.router.post("/upload", this.uploadTestFile);
    // PATCH
    this.router.patch("/:id", this.patchTestData);
    // DELETE
    this.router.delete("/:id", this.deleteTestData);
  }

  getAllTestData = async (request: Request, response: Response) => {
    try {
      const tests = (await collections[this.collection].find({}).toArray()) as ITest[];
      response.status(200).send({ data: tests });
    } catch (error: any) {
      debug("error")(error);
      response.status(500).send({ data: error.message });
    }
  };

  getTestData = async (request: Request, response: Response) => {
    const id = request.params.id;
    try {
      const test = (await collections[this.collection].findOne({
        _id: new ObjectId(id),
      })) as ITest;
      test ? response.status(200).send({ data: test }) : response.status(404).send({ data: `test with id ${id} not found` });
    } catch (error: any) {
      debug("error")(error);
      response.status(500).send({ data: error.message });
    }
  };

  postTestData = async (request: Request, response: Response) => {
    try {
      const result = await collections[this.collection].insertOne(request.body as ITest);
      result ? response.status(201).send({ data: "Successfully inserted new Test" }) : response.status(400).send({ data: "Failed to insert new Test" });
    } catch (error: any) {
      debug("error")(error);
      response.status(500).send({ data: error.message });
    }
  };

  // uploadTestFile = async (request: Request, response: Response) => {
  //   const uploadFolder = path.join(
  //     __dirname,
  //     `${process.env.PRODUCTION === "true" ? "" : "../../../"}`,
  //     "files"
  //   );
  //   if (!fs.existsSync(uploadFolder)) {
  //     fs.mkdirSync(uploadFolder, { recursive: true });
  //   }
  //   const form = formidable({ multiples: true, uploadDir: uploadFolder });

  //   /* istanbul ignore next */
  //   form.parse(request, async (err, fields, files) => {
  //     if (err) {
  //       return response.status(400).send({
  //         data: "There was an error parsing upload files",
  //       });
  //     }
  //     const uploadedFiles: string[] = [];
  //     for (const key in files) {
  //       const file: typeof formidable.PersistentFile = files[
  //         key
  //       ] as unknown as typeof formidable.PersistentFile;
  //       fs.renameSync(file["filepath"], path.join(uploadFolder, key));
  //       uploadedFiles.push(key);
  //     }
  //     response.status(200).send({
  //       data: {
  //         message:
  //           "Files successfully uploaded. They can be found at backend/files",
  //         filesUploaded: uploadedFiles,
  //       },
  //     });
  //   });
  // };

  patchTestData = async (request: Request, response: Response) => {
    const id = request.params.id;
    try {
      const result = await collections[this.collection].updateOne({ _id: new ObjectId(id) }, { $set: request.body as ITest }, { upsert: true });
      result
        ? response.status(201).send({ data: `Successfully updated test with id: ${id}` })
        : response.status(400).send({ data: `Failed to update test with id: ${id}` });
    } catch (error: any) {
      debug("error")(error);
      response.status(500).send({ data: error.message });
    }
  };

  deleteTestData = async (request: Request, response: Response) => {
    const id = request.params.id;
    try {
      const result = await collections[this.collection].deleteOne({
        _id: new ObjectId(id),
      });
      if (result && result.deletedCount) {
        response.status(202).send({ data: `Successfully deleted Test with id ${id}` });
      } else if (!result) {
        response.status(400).send({ data: `Failed to delete Test with id ${id}` });
      } else if (!result.deletedCount) {
        response.status(404).send({
          data: `Failed to delete Test with id: ${id} because it doesn't exist  `,
        });
      }
    } catch (error: any) {
      debug("error")(error);
      response.status(500).send({ data: error.message });
    }
  };
}
