import mongoose from "mongoose";
import "dotenv/config";

import logger, { morganMiddleware } from "./src/utils/logger/logs";
import app from "./src/index";

app.use(morganMiddleware);

const port = process.env.PORT || 3000;

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.warn("connected to th db...");
  app.listen(port, () => {
    logger.info(`server listening on port ${port}...`);
  });
})();
