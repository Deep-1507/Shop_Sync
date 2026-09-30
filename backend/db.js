import mongoose from "mongoose";

mongoose.connect("mongodb+srv://admin:deep1507@cluster0.rd0szsg.mongodb.net/Sparkathon");

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, minLength: 3, maxLength: 50 },
    password: { type: String, required: true, minLength: 6 },
    firstName: { type: String, required: true, trim: true, maxLength: 50 },
    lastName: { type: String, required: true, trim: true, maxLength: 50 },
  },
  { collection: "users" }
);

// Product Schema (Online)
const productSchemaOnline = new mongoose.Schema(
  {
    productId: { type: String },
    productQty: { type: Number, required: true, minLength: 1 },
    productPrice: { type: String, required: true, trim: true, minLength: 1 },
    productName: { type: String, required: true, trim: true, minLength: 1 },
    productDescription: { type: String, required: true, trim: true, minLength: 1 },
    mode: { type: String, required: true, default: "online" },
    productImages: { type: [String], required: true },
    category: { type: String },
    brand: { type: String },
    sku: { type: String },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    inStock: { type: Boolean, default: true },
    tags: [{ type: String }],
    warranty: { type: String },
    color: { type: String },
    size: { type: String },
    material: { type: String },
    rating: { type: Number, min: 0, max: 5 },
  },
  { collection: "Products-online" }
);

// Online Cart Schema
const onlineCartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, trim: true, minLength: 1 },
    productId: { type: String, required: true, trim: true, minLength: 1  },
    productQty: { type: Number, required: true, minLength: 1 },
    productPrice: { type: String, required: true, minLength: 1 },
    productName: { type: String, required: true, minLength: 1 },
    productImages: { type: Array, required: true, minLength: 1 },
    brand: { type: String, required: true, minLength: 1 },
    mode: { type: String, required: true, default: "online" },
  },
  { collection: "Online-Cart" }
);

// Store Schema
const storeSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, minLength: 3, maxLength: 50 },
    password: { type: String, required: true, minLength: 6 },
    firstName: { type: String, required: true, trim: true, maxLength: 50 },
    lastName: { type: String, required: true, trim: true, maxLength: 50 },
    city: { type: String, required: true, trim: true, maxLength: 50 },
    state: { type: String, required: true, trim: true, maxLength: 50 },
    country: { type: String, required: true, trim: true, maxLength: 50 },
    locationCoord: { type: Object, required: true, trim: true },
   
  },
  { collection: "stores" }
);

// Product Schema (Offline)
const productSchemaOffline = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    // productId: { type: String },
    productQty: { type: Number, required: true, min: 1 },
    productPrice: { type: String, required: true, trim: true, minLength: 1 },
    productName: { type: String, required: true, trim: true, minLength: 1 },
    productDescription: { type: String, required: true, trim: true, minLength: 1 },
    mode: { type: String, required: true, trim: true, default: "offline" },
    productImages: { type: [String] },
    category: { type: String },
    brand: { type: String },
    sku: { type: String },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    inStock: { type: Boolean, default: true },
    tags: [{ type: String }],
    warranty: { type: String },
    color: { type: String },
    size: { type: String },
    material: { type: String },
    rating: { type: Number, min: 0, max: 5 },
  },
  { collection: "Products-offline" }
);

// Session Details Schema
const sessionDetailsSchema = new mongoose.Schema(
  {
    sessionDate: { type: Date, required: true },
    sessionTime: { type: String, required: true }, // Time stored as string
    storeId: { type: String, required: true, trim: true },
    storeHandlersName: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true, maxLength: 50 },
    customersName: { type: String, required: true, trim: true },
    Items: { type: [Object], required: true }, // Array of objects
    billingAmount: { type: Number, required: true },
  },
  { collection: "Offline-Billing-Sessions" }
);

// Define Models
const User = mongoose.model("User", userSchema);
const OnlineProduct = mongoose.model("OnlineProduct", productSchemaOnline);
const OnlineCart = mongoose.model("OnlineCart", onlineCartSchema);
const Stores = mongoose.model("Stores", storeSchema);
const OfflineProduct = mongoose.model("OfflineProduct", productSchemaOffline);
const SessionDetails = mongoose.model("SessionDetails", sessionDetailsSchema);

// Export Models
export { User, OnlineProduct, OnlineCart, Stores, OfflineProduct, SessionDetails };