const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: String,
    count: Number,
})

const Category = mongoose.model("Category", CategorySchema)

module.exports = Category;