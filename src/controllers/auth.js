const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email must be unique",
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      advance,
      role,
      level,
      moy,
      payMeth,
      parentName,
      profilePicture,
      payPicture,
      verified,
      payPeriode,
    } = req.body;

    // Hash the password
    const hash_password = await bcrypt.hash(password, 10);

    const _user = new User({
      firstName,
      lastName,
      email,
      parentName,
      moy,
      advance,
      contactNumber,
      hash_password,
      userName: shortid.generate(),
      role,
      level,
      payMeth,
      profilePicture,
      payPicture,
      verified,
      payPeriode,
    });

    // Save the user to the database
    const savedUser = await _user.save();

    if (savedUser) {
      const {
        _id,
        firstName,
        lastName,
        parentName,
        contactNumber,
        advance,
        role,
        moy,
        level,
        payMeth,
        profilePicture,
        payPicture,
        verified,
        payPeriode,
      } = savedUser;

      // Generate a JWT token for the newly registered user
      const token = generateJwtToken(_id, role);

      return res.status(201).json({
        token, // Include the generated token in the response
        user: {
          _id,
          firstName,
          lastName,
          parentName,
          contactNumber,
          advance,
          email,
          role,
          moy,
          level,
          payMeth,
          profilePicture,
          payPicture,
          verified,
          payPeriode,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if ((isPassword && user.role === "student") || user.role === "teacher") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role);
        const {
          _id,
          firstName,
          lastName,
          email,
          role,
          fullName,
          advance,
          level,
          amount,
          moy,
          profilePicture,
          payPicture,
          verified,
          payPeriode,
        } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            advance,
            fullName,
            level,
            amount,
            moy,
            profilePicture,
            payPicture,
            verified,
            payPeriode,
          },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully ...!",
  });
};
// exports.getUsers = (req, res) => {
//   User.find({ role: "student" }).exec((error, users) => {
//     if (error) return res.status(400).json({ error });
//     if (users) return res.status(200).json({ users });
//   });
// };
exports.getTeachers = (req, res) => {
  User.find({ role: "teacher" }).exec((error, teachers) => {
    if (error) return res.status(400).json({ error });
    if (teachers) return res.status(200).json({ teachers });
  });
};

exports.editUser = async (req, res) => {
  const password = req.body.password;
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.body._id },
    {
      firstName: req?.body?.firstName,
      email: req?.body?.email,
      lastName: req?.body?.lastName,
      level: req?.body?.level,
      moy: req?.body?.moy,
      advance: req?.body?.advance,
      contactNumber: req?.body?.contactNumber,
      verified: req?.body?.verified,
      payPeriode: req?.body?.payPeriode,
      payMeth: req?.body?.payMeth,
      group: req?.body?.group,
      hash_password: password && (await bcrypt.hash(password, 10)),
    },
    { new: true }
  );
  if (updatedUser) {
    res.status(201).json({ message: "User Updated", updatedUser });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};

exports.payPicUpdate = async (req, res) => {
  const date = new Date();

  const nowDate = `${date.getMonth() + 1}_${date.getFullYear()}`;
  const updatedPayPic = await User.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        dateUpdatePic: nowDate,
        payPeriode: req?.body?.payPeriode,
        payPicture: process.env.API + "/public/" + req.file.filename,
      },
    },
    { new: true }
  );
  if (updatedPayPic) {
    res.status(201).json({ message: "User Updated", updatedPayPic });
    console.log(nowDate);
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};

exports.allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json({ users });
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body;

  const deleteUser = await User.findOneAndDelete({ _id: userId });
  if (deleteUser) {
    res.status(201).json({ message: "User removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};

exports.getWishlist = async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wichlist");
    res.status(201).json(findUser);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).populate("wichlist");
    res.status(201).json(users);
  } catch (error) {
    throw new Error(error);
  }
};
