const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");
const invoiceRoutes = require("./routes/invoiceRoutes");
const zohoRoutes = require("./routes/zohoRoutes")
const userRoutes = require("./routes/userRoutes")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use(invoiceRoutes);
app.use("/user", userRoutes);
app.use(zohoRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));