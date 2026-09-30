import express from "express";
import mongoose from "mongoose";
import { Router } from "express";
import { z } from "zod"; // ✅ Fix: Properly import Zod
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import { existsSync, mkdirSync } from "fs";
import { User, OnlineProduct, OfflineProduct } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { authMiddleware } from "../middleware.js";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; // ✅ Dynamic base URL

// Multer storage setup
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

const productSchema = z.object({
  // productId: z.string().min(1),
  productName: z.string().min(1),
  productQty: z.number().positive(),
  productPrice: z.string().min(1),
  productDescription: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  sku: z.string().min(1),
  weight: z.string().min(1),
  dimensions: z.string().min(1),
  inStock: z.boolean(),
  tags: z.array(z.string()).optional(),
  warranty: z.string().min(1),
  color: z.string().min(1),
  size: z.string().min(1),
  material: z.string().min(1),
  rating: z.number().optional(),
  productImages: z.array(z.string()).optional(),
});

router.post("/create-product",authMiddleware, upload.array("productImages"), async (req, res) => {
  try {
    const parsedBody = {
      ...req.body,
      storeId:req.userId,
      productQty: Number(req.body.productQty),
      inStock: req.body.inStock === "true",
      tags: req.body.tags ? req.body.tags.split(",") : [],
      rating: req.body.rating ? Number(req.body.rating) : undefined,
      productImages: req.files ? req.files.map((file) => `${BASE_URL}/uploads/${file.filename}`) : [],
    };

    // ✅ Validate with Zod
    productSchema.parse(parsedBody);

    const newProduct = new OfflineProduct(parsedBody);
    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", newProduct });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating product", error: error.errors || error.message });
  }
});

// Query Schema
const querySchema = z.object({ productName: z.string().optional() });

// Get Offline Products for Store Owner
router.get("/get-offline-products", authMiddleware, async (req, res) => {
  try {
    const validatedQuery = querySchema.safeParse(req.query);
    if (!validatedQuery.success) return res.status(400).json({ message: "Invalid query parameters" });

    const { productName } = validatedQuery.data;
    const query = { storeId: req.userId };
    if (productName) query.productName = { $regex: new RegExp(productName, "i") };

    const products = await OfflineProduct.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Offline Products for Users
router.get("/get-offline-products-for-users", async (req, res) => {
  try {
    const { id: storeId, productName } = req.query;
    if (!storeId) return res.status(400).json({ message: "Store ID is required" });

    const query = { storeId };
    if (productName) query.productName = { $regex: new RegExp(productName, "i") };

    const products = await OfflineProduct.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Cart Schema
const CartBody = z.object({
  productId: z.string().nonempty(),
  productQty: z.number().positive(),
  productPrice: z.string().nonempty(),
  productName: z.string().nonempty(),
  productDescription: z.string().nonempty(),
});

// Add to Offline Cart
router.post("/add-to-cart-offline", authMiddleware, async (req, res) => {
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

// Get Items from Online Cart for Billing
router.get("/getitems-from-onlinecart-for-billing", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.id;
    const CartProducts = await OnlineCart.find({ userId });
    res.status(200).json({ CartProducts });
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Items from Online Cart
router.get("/getitems-from-onlinecart", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const CartProducts = await OnlineCart.find({ userId });
    res.status(200).json({ CartProducts });
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getallitems", async (req, res) => {
  try {
    const AllProducts = await OfflineProduct.find();
    res.status(200).json({ AllProducts });
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Item from Cart
router.delete("/delete-item/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID format" });

    const result = await OnlineCart.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item successfully deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;