import express from "express";
import "express-async-errors";
import fileUpload from "express-fileupload";
import errorHandler from "./middlewares/errorHandler";
import userRoutes from "./routers/user";
import cartRoutes from "./routers/cartItems";
import productRoutes from "./routers/products";
import authenticateUser from "./middlewares/auth";
// import orderRoutes from "./routers/order";

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cartItems", authenticateUser, cartRoutes);
// app.use("/api/orders/", orderRoutes);

// app.use(authenticateUser);

app.use(errorHandler);

export default app;
