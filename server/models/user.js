const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: false },
    profileImage: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    provider: { type: String, enum: ["local", "google", "facebook"], default: "local" },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    token: { type: String, default: "" }, 
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
