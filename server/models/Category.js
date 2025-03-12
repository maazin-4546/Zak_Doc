const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    category: String,
    count: Number,
})

const Category = mongoose.model("Category", CategorySchema)

module.exports = Category;