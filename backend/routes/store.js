import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User, Stores, SessionDetails } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

const signupBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  try {
    const result = signupBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Input specified in incorrect format" });
    }

    const existingUser = await Stores.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ message: "Existing user" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await Stores.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      locationCoord: req.body.locationCoord,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id,username: user.username,city:user.city,state:user.state,country:user.country }, JWT_SECRET);

    res.status(201).json({
      message: "Store created successfully",
      token,
      user: { id: user._id, username: user.username, },
    });
  } catch (error) {
    console.error("Error during Store signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const signinBody = z.object({
  uid: z.string(),
  username: z.string().email(),
  password: z.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Input specified in incorrect format" });
  }

  const user = await Stores.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ message: "Not a registered Store" });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Password incorrect" });
  }

  const token = jwt.sign({ userId: user._id,username: user.username,city:user.city,state:user.state,country:user.country }, JWT_SECRET);
  res.status(200).json({
    message: "Welcome Store, you are logged in",
    token,
    user: { id: user._id, username: user.username },
  });
});

router.get("/get-users-details", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({ username: { $regex: filter, $options: "i" } });
    res.json({
      user: users.map(({ username, firstName, lastName, _id }) => ({
        username,
        firstName,
        lastName,
        _id,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/details", authMiddleware, async (req, res) => {
  try {
    const storeDetails = await Stores.findById(req.userId);
    if (!storeDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      store: {
        username: storeDetails.username,
        firstName: storeDetails.firstName,
        lastName: storeDetails.lastName,
        _id: storeDetails._id,
        location: storeDetails.location,
      },
    });
  } catch (error) {
    console.error("Error fetching store details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create-session", async (req, res) => {
  try {
    const { sessionDate, sessionTime, storeId, userId, Items, billingAmount, storeHandlersName, customersName } = req.body;

    if (!sessionDate || !sessionTime || !storeId || !userId || !Items || !billingAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSession = new SessionDetails({ sessionDate, sessionTime, storeId, userId, Items, billingAmount, storeHandlersName, customersName });
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const { filter = "", userPositionIndex, userid } = req.query;
    const users = await User.find({
      $and: [
        { $or: [{ firstName: { $regex: filter } }, { lastName: { $regex: filter } }] },
        { positionseniorityindex: { $lte: userPositionIndex } },
        { _id: { $ne: userid } },
      ],
    });
    res.json({
      user: users.map(({ username, firstName, lastName, _id, position, positionseniorityindex }) => ({
        username,
        firstName,
        lastName,
        _id,
        position,
        positionseniorityindex,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;