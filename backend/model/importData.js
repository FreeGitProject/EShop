const mongoose = require('mongoose');

const importDataSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  by: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  shopId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  count: {
    type: Number,
    required: true
  }
});

const ImportData = mongoose.model('ImportData', importDataSchema);

module.exports = ImportData;
