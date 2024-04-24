import { TestController } from "./controllers/test/test.controller";
import { Server } from "./server/server";

new Server(3000, [new TestController()])