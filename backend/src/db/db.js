const mongoose = require ('mongoose');
const {mongoUri} = require ('../config/config');
function connectDb () {
  mongoose
    .connect (mongoUri)
    .then (() => {
      console.log ('Connected to MongoDB');
    })
    .catch (err => {
      console.error ('Error connecting to MongoDB', err);
    });
}

module.exports = connectDb;
