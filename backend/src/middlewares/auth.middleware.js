const userModel = require ('../models/user.model');
const foodPartnerModel = require ('../models/foodpartner.model');
const {jwtSecret} = require ('../config/config');
const jwt = require ('jsonwebtoken');

async function authMiddleware (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status (401)
      .json ({message: 'authorization denied Login First'});
  }

  try {
    const decoded = jwt.verify (token, jwtSecret);

    if (decoded.userId) {
      req.user = await userModel
        .findById (decoded.userId || decoded.id || decoded._id)
        .select ('-password');
      if (!req.user) {
        return res
          .status (401)
          .json ({message: 'Authorization denied, user not found'});
      }
    } else if (decoded.foodPartnerId) {
      req.foodPartner = await foodPartnerModel
        .findById (decoded.foodPartnerId)
        .select ('-password');
      if (!req.foodPartner) {
        return res
          .status (401)
          .json ({message: 'Authorization denied, food partner not found'});
      }
    } else {
      return res.status (401).json ({message: 'Invalid token payload'});
    }

    next ();
  } catch (err) {
    res.status (401).json ({message: 'Token is not valid'});
  }
}

module.exports = authMiddleware;
