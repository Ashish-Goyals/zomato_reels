const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt'); // Make sure bcrypt is required

const userSchema = new mongoose.Schema (
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

userSchema.pre ('save', async function (next) {
  if (!this.isModified ('password')) {
    return next ();
  }
  const salt = await bcrypt.genSalt (10);
  this.password = await bcrypt.hash (this.password, salt);
  next ();
});

const userModel = mongoose.model ('user', userSchema);

module.exports = userModel;
