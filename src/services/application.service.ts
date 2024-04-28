import { debugInit } from "./../services/debug.service";
import dotEnv from "dotenv";

export const applicationInit = () => {
  dotEnv.config();
  debugInit();
};
