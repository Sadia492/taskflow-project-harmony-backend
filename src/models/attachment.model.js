const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileName: String,
    fileUrl: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Attachment', attachmentSchema);