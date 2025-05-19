const express = require("express");
const cors = require("cors");
const path = require('path');

const app = express();
require("dotenv").config();


global.__basedir = __dirname;

const db = require("./models/index.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const commonRoutes = require("./routes/common.routes");

app.get('/', (req, res) => res.send('Welcome to GlobeTrader API server'));
app.use('/images', express.static(path.join(__dirname, 'media', 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/common", commonRoutes);

// db.sequelize.sync({force:true}).then(() => { // to update the existing table with new column changes 
db.sequelize.sync().then(() => {
  console.log("Database synced.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});