const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Access Denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);        

        const user = await User.findById(decoded.userId).select("-password");        

        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;


