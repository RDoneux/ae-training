import { DataController } from "./controllers/data/data.controller";
import { TestController } from "./controllers/test/test.controller";
import { Server } from "./server/server";

new Server(3000, [new TestController(), new DataController()])