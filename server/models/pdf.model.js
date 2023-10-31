const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const PDFModel = mongoose.model('PDF', pdfSchema);

module.exports = PDFModel;
