const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");
const invoiceRoutes = require("./routes/invoiceRoutes");
const userRoutes = require("./routes/userRoutes")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend origin
    credentials: true, // Allow cookies & authorization headers
}));
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use(invoiceRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));