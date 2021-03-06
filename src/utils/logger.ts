// 日志模块
// https://log4js-node.github.io/log4js-node/index.html
import * as log4js from "log4js";

log4js.configure({
  appenders: {
    file: {
      type: "dateFile",
      filename: "./log/lightning",
      alwaysIncludePattern: true,
      pattern: "yyyy-MM-dd.log"
    },
    console: { type: "console" }
  },
  categories: { default: { appenders: ["file", "console"], level: "info" } },
  disableClustering: true
});

const logger = log4js.getLogger("Lightning");
// logger.trace("Entering cheese testing");
// logger.debug("Got cheese.");
// logger.info("Cheese is Comté.");
// logger.warn("Cheese is quite smelly.");
// logger.error("Cheese is too ripe!");
// logger.fatal("Cheese was breeding ground for listeria.");

export default logger;
