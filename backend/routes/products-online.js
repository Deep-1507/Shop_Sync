import express from "express";
import { Router } from "express";
import { OnlineProduct, OnlineCart } from "../db.js";
import { authMiddleware } from "../middleware.js";
import multer from "multer";
import mongoose from "mongoose";
import { object, string, number, boolean, array } from "zod";
import { existsSync, mkdirSync } from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import z from "zod"

const router = Router();
const { connection, Types } = mongoose;
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "http://localhost:3000";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, "../uploads");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/create-product",
  upload.array("productImages"),
  async (req, res) => {
    const productSchema = object({
      productId: string().nonempty(),
      productName: string().nonempty(),
      productQty: number().positive(),
      productPrice: string().nonempty(),
      productDescription: string().nonempty(),
      category: string().nonempty(),
      brand: string().nonempty(),
      sku: string().nonempty(),
      weight: string().nonempty(),
      dimensions: string().nonempty(),
      inStock: boolean(),
      tags: array(string()).optional(),
      warranty: string().nonempty(),
      color: string().nonempty(),
      size: string().nonempty(),
      material: string().nonempty(),
      rating: number().optional(),
      productImages: array(string()).optional(),
    });

    try {
      const parsedBody = {
        ...req.body,
        productQty: Number(req.body.productQty),
        inStock: req.body.inStock === "true",
        tags: req.body.tags ? req.body.tags.split(",") : [],
        rating: req.body.rating ? Number(req.body.rating) : undefined,
        productImages: req.files
          ? req.files.map((file) => `${BASE_URL}/uploads/${file.filename}`)
          : [],
      };

      productSchema.parse(parsedBody);

      const newProduct = new OnlineProduct(parsedBody);
      await newProduct.save();
      res
        .status(201)
        .json({ message: "Product created successfully", newProduct });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: "Error creating product", error: error.message });
    }
  }
);

router.use("/uploads", express.static(join(__dirname, "../uploads")));


const CartBody = z.object({
  productId: z.string().min(1),
  productQty: z.number().min(1),
  productPrice: z.string().min(1),
  productName: z.string().min(1),
  // productImages: z.array().min(1),
  brand: z.string().min(1),
  mode: z.string().min(1),
});

// Add to Offline Cart
router.post("/add-to-cart-online", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const result = CartBody.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: "Invalid input" });

    await OnlineCart.create({ userId, ...req.body });
    res.status(201).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/get-online-products", async (req, res) => {
  try {
    const products = await OnlineProduct.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error during fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-online-product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await OnlineProduct.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getitems-from-onlinecart",authMiddleware, async (req, res) => {
  try {
    const products = await OnlineCart.find({userId:req.userId})
    if (products.length==0) {
      return res.status(404).json({ message: "No Items added to cart" });
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete-item/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const result = await OnlineCart.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item successfully deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
