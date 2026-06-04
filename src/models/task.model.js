const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    dueDate: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: [
        'high',
        'medium',
        'low'
      ],
      default: 'medium',
    },

    status: {
      type: String,
      enum: [
        'todo',
        'inProgress',
        'completed',
      ],
      default: 'todo',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
 
    { timestamps: true, versionKey: false }
);

taskSchema.index(
  {
    project: 1,
    title: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  'Task',
  taskSchema
);