import morgan from "morgan";
import winston from "winston";
import path from "path";
import chalk from "chalk";

const { format } = winston;
const { combine, timestamp, colorize, printf } = format;

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// console.log("path resolve", path.resolve(), "dir name", __dirname);
// console.log(process.env.NODE_ENV);

const getLogLevel = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  return isDevelopment ? "debug" : "warn";
};

const loggerFile = path.join(path.resolve(), "errorLogs", "error.log");

// const colors = {
//   error: "red",
//   warn: "yellow",
//   info: "green",
//   http: "magenta",
//   debug: "white",
// };

// winston.addColors(colors);

const logFormat = combine(
  timestamp({ format: "YYYY-MM-dd HH:mm:ss" }),
  // colorize({ all: true }),
  printf((info) => `${info.timestamp} ${info.level}:${info.message}`)
);

const logger = winston.createLogger({
  level: getLogLevel(),
  levels: logLevels,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(({ timestamp, level, message }) => {
          let coloredMessage = `${timestamp} [${level}]: ${message}`;
          if (level === "error") {
            coloredMessage = chalk.red(coloredMessage); // Colorize error messages in red
          } else if (level === "warn") {
            coloredMessage = chalk.yellow(coloredMessage); // Colorize warning messages in yellow
          } else if (level === "info") {
            coloredMessage = chalk.green(coloredMessage); // Colorize warning messages in green
          } else if (level === "http") {
            coloredMessage = chalk.magenta(coloredMessage); // Colorize warning messages in magenta
          } else if (level === "debug") {
            coloredMessage = chalk.blueBright(coloredMessage); // Colorize warning messages in blueBright
          }
          return `${coloredMessage}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: loggerFile,
      level: "error",
    }),
  ],
});

export const morganMiddleware = morgan(
  ":method :url :status - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

export default logger;
