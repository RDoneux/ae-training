import { TokenController } from "./token.controller";

describe("token.controller.ts", () => {
  var component: TokenController;

  beforeEach(() => {
    jest.resetAllMocks();
    component = new TokenController();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("POST", () => {
    it("should provide 201 response with given body", async () => {
      const req: any = { body: { test: "body" } };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      process.env.SIGNATURE = 'test-signature'

      await component.issueToken(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({data: expect.anything()})
    });
    it("should provide 500 response when SIGNATURE is not defined", async () => {
      const req: any = { body: { test: "body" } };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      process.env = {};

      await component.issueToken(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({data: 'Unable to issue token because a valid SIGNATURE has not been set'})
    });
  });
});
