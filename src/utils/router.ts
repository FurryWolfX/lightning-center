import Lightning from "@wolfx/lightning";
import logger from "./logger";
import { LRequest, LResponse } from "./types";

const { app } = Lightning.core.getState();
const projectName = "";
type NextFunction = () => void;

type Fn = (req: LRequest, res: LResponse, next: NextFunction) => void;

function handler(method: "get" | "post" | "all", url: string, fn: Fn) {
  console.log(method, projectName + url);
  app[method](projectName + url, async (req: LRequest, res: LResponse, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      logger.error(e.stack);
      res.send({
        msg: "server internal error",
        success: false,
        errorMsg: e.stack
      });
    }
  });
}

export function get(url: string, fn: Fn) {
  handler("get", url, fn);
}

export function post(url: string, fn: Fn) {
  handler("post", url, fn);
}

export function all(url: string, fn: Fn) {
  handler("all", url, fn);
}
