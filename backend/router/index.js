import express from "express";
import userRouter from "../routes/user.js";
import StoreRouter from "../routes/store.js";
import ProductRouterOnline from "../routes/products-online.js";
import ProductRouterOffline from "../routes/products-offline.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/stores", StoreRouter);
router.use("/online-products", ProductRouterOnline);
router.use("/offline-products", ProductRouterOffline);

export default router;