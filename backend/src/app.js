const express = require ('express');
const app = express ();
const cookieParser = require ('cookie-parser');
const cors = require ('cors');

app.use (
  cors ({
    origin: '*',
    credentials: true,
  })
);
app.use (cookieParser ());
app.use (express.json ());
// app.use(express.json());
// app.use (express.urlencoded ({extended: true}));

const authRoutes = require ('./routes/auth.routes');
const foodRoutes = require ('./routes/food.routes');
app.use ('/api/auth', authRoutes);
app.use ('/api/food', foodRoutes);

module.exports = app;
