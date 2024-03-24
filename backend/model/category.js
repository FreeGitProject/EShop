const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Category name!"],
  },
  code: {
    type: String,
    required: [true, "Please enter your  category code!"],
  },
  shopId:{
    type: String,
    required: true,
   },
  image: 
    {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Category", categorySchema);
