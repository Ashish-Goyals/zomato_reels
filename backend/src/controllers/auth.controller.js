const userModel = require ('../models/user.model');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const {jwtSecret} = require ('../config/config');
const foodPartnerModel = require ('../models/foodpartner.model');
// Register User
module.exports.register = async (req, res) => {
  try {
    const {fullname, email, password} = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne ({email});
    if (existingUser) {
      return res.status (400).json ({message: 'User already exists'});
    }

    // Create new user
    const newUser = new userModel ({fullname, email, password});
    await newUser.save ();

    // Generate JWT token
    const token = jwt.sign ({userId: newUser._id}, jwtSecret, {
      expiresIn: '1d',
    });
    res.cookie ('token', token);

    res.status (201).json ({
      message: 'User registered successfully',
      newUser: {
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status (500).json ({message: 'Server error', error: error.message});
  }
};

// Login User
module.exports.login = async (req, res) => {
  try {
    const {email, password} = req.body; // Get email and password from request body

    // Check if user exists
    const user = await userModel.findOne ({email});
    if (!user) {
      return res.status (404).json ({message: 'User not found'});
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare (password, user.password);
    if (!isPasswordValid) {
      return res.status (401).json ({message: 'Invalid password'});
    }

    // Generate JWT token
    const token = jwt.sign ({userId: user._id}, jwtSecret, {
      expiresIn: '1d',
    });
    res.cookie ('token', token);

    res.status (200).json ({
      message: 'User logged in successfully',
      user: {
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status (500).json ({message: 'Server error', error: error.message});
  }
};

// Logout User
module.exports.logout = (req, res) => {
  res.clearCookie ('token');
  res.status (200).json ({message: 'User logged out successfully'});
};

// Get User Profile
module.exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status (401)
        .json ({message: 'Unauthorized: No user info found'});
    }

    // req.user is already populated by the middleware
    res.status (200).json ({
      message: 'User profile retrieved successfully',
      user: {
        fullname: req.user.fullname,
        email: req.user.email,
        _id: req.user._id,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (error) {
    res.status (500).json ({message: 'Server error', error: error.message});
  }
};

module.exports.foodPartnerRegister = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    // Check if food partner already exists
    const existingFoodPartner = await foodPartnerModel.findOne ({email});
    if (existingFoodPartner) {
      return res.status (400).json ({message: 'Food Partner already exists'});
    }

    // Create new food partner
    const newFoodPartner = await foodPartnerModel.create ({
      name,
      email,
      password,
    });
    // await newFoodPartner.save ();

    // Generate JWT token
    const token = jwt.sign ({foodPartnerId: newFoodPartner._id}, jwtSecret, {
      expiresIn: '1d',
    });
    res.cookie ('token', token);

    res.status (201).json ({
      message: 'Food Partner registered successfully',
      newFoodPartner: {
        name: newFoodPartner.name,
        email: newFoodPartner.email,
      },
    });
  } catch (error) {
    res.status (500).json ({message: 'Server error', error: error.message});
  }
};

module.exports.foodPartnerLogin = async (req, res) => {
  try {
    const {email, password} = req.body; // Get email and password from request body

    // Check if food partner exists
    const foodPartner = await foodPartnerModel.findOne ({email});
    if (!foodPartner) {
      return res.status (404).json ({message: 'Food Partner not found'});
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare (
      password,
      foodPartner.password
    );
    if (!isPasswordValid) {
      return res.status (401).json ({message: 'Invalid password'});
    }

    // Generate JWT token
    const token = jwt.sign ({foodPartnerId: foodPartner._id}, jwtSecret, {
      expiresIn: '1d',
    });
    res.cookie ('token', token);

    res.status (200).json ({
      message: 'Food Partner logged in successfully',
      foodPartner: {
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    res.status (500).json ({message: 'Server error', error: error.message});
  }
};

module.exports.foodPartnerLogout = (req, res) => {
  res.clearCookie ('token');
  res.status (200).json ({message: 'Food Partner logged out successfully'});
};
module.exports.getFoodPartnerProfile = async (req, res) => {
  try {
    if (!req.foodPartner) {
      return res
        .status (401)
        .json ({message: 'Unauthorized: No food partner info found'});
    }

    // req.foodPartner is already populated by the middleware
    res.status (200).json ({
      message: 'Food Partner profile retrieved successfully',
      foodPartner: {
        name: req.foodPartner.name,
        email: req.foodPartner.email,
        _id: req.foodPartner._id,
        createdAt: req.foodPartner.createdAt,
        updatedAt: req.foodPartner.updatedAt,
      },
    });
  } catch (error) {
    res.status (500).json ({message: 'Server error', error: error.message});
  }
};
