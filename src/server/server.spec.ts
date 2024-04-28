import { TestController } from "../controllers/test/test.controller";
import { Server } from "./server";

describe("server", () => {
  var component: Server;
  var testController: TestController;

  beforeEach(() => {
    jest.resetAllMocks();

    testController = new TestController();
    jest.spyOn(testController, "initaliseRoutes");

    component = new Server(3000, [testController]);
  });

  afterEach(() => {
    component.close();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
