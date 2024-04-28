import { collections } from "../../services/database.service";
import { TestController } from "./test.controller";
import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs";

describe("test.controller.ts", () => {
  var component: TestController;

  const image = fs.createReadStream(
    path.join(__dirname, "./test.controller.ts")
  );

  beforeEach(() => {
    jest.resetAllMocks();
    component = new TestController();
    collections["test"] = undefined;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("GET", () => {
    it("should provide 200 response with given body for all records", async () => {
      const req: any = {};
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      collections["test"] = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockReturnValue([{ message: "test" }]),
      };
      await component.getAllTestData(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ data: [{ message: "test" }] });
    });
    it("should provide 500 response when unable to connect to db for all records", async () => {
      const req: any = {};
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      await component.getAllTestData(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
    it("should provide 200 reponse with given body for specific record", async () => {
      const req: any = { params: { id: "638132d301a49efc7d2f542e" } };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      collections["test"] = {
        findOne: jest.fn().mockReturnValue({ message: "test" }),
      };
      await component.getTestData(req, res);
      expect(collections["test"].findOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ data: { message: "test" } });
    });
    it("should provide 404 reponse with given body for specific record", async () => {
      const req: any = { params: { id: "638132d301a49efc7d2f542e" } };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      collections["test"] = {
        findOne: jest.fn().mockReturnValue(undefined),
      };
      await component.getTestData(req, res);
      expect(collections["test"].findOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        data: `test with id ${req.params.id} not found`,
      });
    });
    it("should provide 500 reponse with given body for specific record", async () => {
      const req: any = { params: { id: "638132d301a49efc7d2f542e" } };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      await component.getTestData(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  describe("POST", () => {
    it("should provide 200 response with given body", async () => {
      const req: any = { body: { test: "body" } };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      collections["test"] = {
        insertOne: jest.fn().mockReturnValue(true),
      };
      await component.postTestData(req, res);
      expect(collections["test"].insertOne).toHaveBeenCalledWith({
        test: "body",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        data: "Successfully inserted new Test",
      });
    });
    it("should provide 400 response when unable to insert item", async () => {
      const req: any = { body: { test: "body" } };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      collections["test"] = {
        insertOne: jest.fn().mockReturnValue(undefined),
      };
      await component.postTestData(req, res);
      expect(collections["test"].insertOne).toHaveBeenCalledWith({
        test: "body",
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        data: "Failed to insert new Test",
      });
    });
    it("should provide 500 response when error", async () => {
      const req: any = { body: { test: "body" } };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      await component.postTestData(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
    // it("should upload selected files for development", () => {
    //   const req: any = {
    //     method: "POST",
    //     on: jest.fn().mockReturnThis(),
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     formData: {
    //       image: image,
    //     },
    //   };
    //   const res: any = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //   };

    //   process.env = { PRODUCTION: "false" };
    //   jest.spyOn(path, "join");
    //   jest.spyOn(fs, "mkdirSync").mockImplementation();
    //   component.uploadTestFile(req, res);

    //   expect(path.join).toHaveBeenCalledWith(
    //     expect.any(String),
    //     "../../../",
    //     "files"
    //   );

    //   process.env = { PRODUCTION: "true" };
    //   component.uploadTestFile(req, res);

    //   expect(path.join).toHaveBeenCalledWith(expect.any(String), "", "files");
    // });
    // it("should create new folder if doesn't exist", () => {
    //   jest.spyOn(fs, "mkdirSync").mockImplementation();

    //   const req: any = {
    //     method: "POST",
    //     on: jest.fn().mockReturnThis(),
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     formData: {
    //       image: image,
    //     },
    //   };
    //   const res: any = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //   };
    //   process.env = { PRODUCTION: "false" };

    //   component.uploadTestFile(req, res);

    //   expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
    // });
  });
  describe("PATCH", () => {
    it("should provide 200 response with given body", async () => {
      const req: any = {
        params: { id: "6381332d9c2e919b443a2239" },
        body: { test: "body" },
      };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      collections["test"] = {
        updateOne: jest.fn().mockReturnValue(true),
      };
      await component.patchTestData(req, res);
      expect(collections["test"].updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { upsert: true }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        data: `Successfully updated test with id: ${req.params.id}`,
      });
    });
    it("should provide 400 response if result is not found", async () => {
      const req: any = {
        params: { id: "6381332d9c2e919b443a2239" },
        body: { test: "body" },
      };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      collections["test"] = {
        updateOne: jest.fn().mockReturnValue(false),
      };
      await component.patchTestData(req, res);
      expect(collections["test"].updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { upsert: true }
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        data: `Failed to update test with id: ${req.params.id}`,
      });
    });
    it("should provide 500 response when error", async () => {
      const req: any = {
        params: { id: "6381332d9c2e919b443a2239" },
        body: { test: "body" },
      };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      await component.patchTestData(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  describe("DELETE", () => {
    it("should provide 202 response with given body", async () => {
      const req: any = {
        params: { id: "6381332d9c2e919b443a2239" },
      };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      collections["test"] = {
        deleteOne: jest.fn().mockReturnValue({ deletedCount: 1 }),
      };
      await component.deleteTestData(req, res);
      expect(collections["test"].deleteOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
      });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.send).toHaveBeenCalledWith({
        data: `Successfully deleted Test with id ${req.params.id}`,
      });
    });
    it("should provide 400 response with given body", async () => {
      const req: any = {
        params: { id: "6381332d9c2e919b443a2239" },
      };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      collections["test"] = {
        deleteOne: jest.fn().mockReturnValue(false),
      };
      await component.deleteTestData(req, res);
      expect(collections["test"].deleteOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        data: `Failed to delete Test with id ${req.params.id}`,
      });
    });
    it("should provide 404 response with given body", async () => {
      const req: any = {
        params: { id: "6381332d9c2e919b443a2239" },
      };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      collections["test"] = {
        deleteOne: jest.fn().mockReturnValue({ deletedCount: 0 }),
      };
      await component.deleteTestData(req, res);
      expect(collections["test"].deleteOne).toHaveBeenCalledWith({
        _id: new ObjectId(req.params.id),
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        data: `Failed to delete Test with id: ${req.params.id} because it doesn't exist  `,
      });
    });
    it("should provide 500 response when error", async () => {
      const req: any = {
        params: { id: "6381332d9c2e919b443a2239" },
      };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      await component.deleteTestData(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});