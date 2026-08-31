const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


async function signUp(req, res) {
  try {
    const { username, password, email, role } = req.body;

    // Validation
    if (!username || !password || !email) return res.status(400).json({ message: "Username, password and email are required.", });
    if (password.length < 8) return res.status(400).json({ message: "Password must be 8 characters or more", });
    if (username.length < 3) return res.status(400).json({ message: "Username must be 3 characters or more", });
    if (username.length > 45) return res.status(400).json({ message: "Username must be shorter", });

    const user = await User.create({
      username,
      hashedPassword: await bcrypt.hash(password, 12),
      email: email.toLowerCase(),

    });

    const { _id, createdAt, updatedAt } = user;

    res
      .status(201)
      .json({ username: user.username, _id, createdAt, updatedAt });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }




    // Construct the payload
    const payload = { username: user.username, _id: user._id, role: user.role };


    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function verifyUser(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      role:user.role
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}



module.exports = {
  signUp,
  signIn,
  verifyUser,
};
