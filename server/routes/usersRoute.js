const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

//new user registration
router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("User already exists");
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedpassword;

    //save user
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//user login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User not found");
    }

    // if user is active
    if(user.status !== "active"){
      throw new Error("User Account Is Blocked, Please Contact Admin")
    }

    //compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      throw new Error("Invalid Password");
    }

    //create and assign token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    //send response
    res.send({
      success: true,
      message: "User Logged In Successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "User Fetched Successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all users
router.get("/get-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success : true,
      message : "Users fetched successfully",
      data : users
    })
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//update user status
router.put("/update-user-status/:id", authMiddleware, async(req, res)=>{
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success : true,
      message : "User Status Updated Successfully"
    })
  } catch (error) {
    res.send({
      success : false,
      message : error.message
    })
  }
})

module.exports = router;
