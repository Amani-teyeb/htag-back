const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        error: " email doit être unique",
      });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      userName: shortid.generate(),
      role: "admin",
    });

    _user.save((error, user) => {
      if (error) {
        console.log(error);
        return res.status(400).json({
          message: "something went wrong",
        });
      }
      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "admin") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
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

exports.registerTeacher = async (req, res) => {
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
      role = "teacher",
      level,
      moy,
      payMeth,
      profilePicture,
      payPicture,
    } = req.body;

    // Hash the password
    const hash_password = await bcrypt.hash(password, 10);

    const _user = new User({
      firstName,
      lastName,
      email,
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
    });

    // Save the user to the database
    const savedUser = await _user.save();

    if (savedUser) {
      const {
        _id,
        firstName,
        lastName,
        contactNumber,
        advance,
        role,
        moy,
        level,
        payMeth,
        profilePicture,
        payPicture,
      } = savedUser;

      return res.status(201).json({
        user: {
          _id,
          firstName,
          lastName,
          contactNumber,
          advance,
          email,
          role,
          moy,
          level,
          payMeth,
          profilePicture,
          payPicture,
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

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully ...!",
  });
};
