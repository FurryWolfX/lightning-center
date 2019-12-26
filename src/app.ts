import * as cluster from "cluster";
import "source-map-support/register";
import logger from "./utils/logger";
import startServer from "./server";
import initServiceOnlineTimer from "./timer";

const processNumber = 1;

if (cluster.isMaster) {
  initServiceOnlineTimer(); // 检测服务是否存活
  for (let i = 0; i < processNumber; i++) {
    cluster.fork();
  }
  cluster.on("death", worker => {
    logger.error(`[Worker:${worker.pid}] died`);
    cluster.fork();
  });
  logger.info(`[Master Process:${process.pid}] started`);
} else {
  startServer(3000);
  logger.info(`[Worker Process:${process.pid}] started`);
}

// error handler
process.on("unhandledRejection", (error: Error) => {
  logger.error(error.stack);
});
