const app = require ('./src/app');
const {port} = require ('./src/config/config');

const connectDb = require ('./src/db/db');

connectDb ();

app.listen (port || 4000, () => {
  console.log ('Server is running on port 4000');
});

module.exports = app;
