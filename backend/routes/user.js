import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Stores } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6),
});

router.post("/signup", async (req, res) => { 
  try {
    const result = signupBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Input specified in incorrect format" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ message: "Existing user" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ message: "Input specified in incorrect format" });
  }

  const testUser = await User.findOne({ username: req.body.username });
  if (!testUser) {
    return res.status(401).json({ message: "Not a registered user" });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, testUser.password);
  if (isPasswordValid) {
    const token = jwt.sign({ userId: testUser._id }, JWT_SECRET);
    return res.status(200).json({
      message: "Welcome user, you are logged in",
      token,
      user: { id: testUser._id, username: testUser.username },
    });
  }

  res.status(401).json({ message: "Password incorrect" });
});

router.get("/details", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.id || req.userId;
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const userPositionIndex = req.query.userPositionIndex;
  const userid = req.query.userid;

  const users = await User.find({
    $and: [
      {
        $or: [
          { firstName: { $regex: filter } },
          { lastName: { $regex: filter } },
        ],
      },
      { positionseniorityindex: { $lte: userPositionIndex } },
      { _id: { $ne: userid } },
    ],
  });

  res.json({ user: users });
});

router.get("/get-store-details", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const stores = await Stores.find({ location: { $regex: filter, $options: "i" } });
    res.json({ user: stores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;