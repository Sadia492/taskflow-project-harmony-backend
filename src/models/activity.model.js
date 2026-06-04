const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    action: String,
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Activity', activitySchema);