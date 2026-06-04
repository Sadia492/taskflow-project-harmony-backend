const express = require('express');
const auth = require('../middleware/auth');
const { attachmentController } = require('../controllers');
const { upload } = require('../utils/fileUploader');

const router = express.Router();

router.post(
  '/upload',
  auth('manageTasks'),
  upload.single('file'),
  attachmentController.uploadAttachment
);

router.get(
  '/:taskId',
  auth('getTasks'),
  attachmentController.getAttachments
);

module.exports = router;
