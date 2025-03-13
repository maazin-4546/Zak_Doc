const fs = require("fs");

const imageToBase64 = (imagePath) => {
  return fs.readFileSync(imagePath).toString("base64");
};

module.exports = { imageToBase64 };