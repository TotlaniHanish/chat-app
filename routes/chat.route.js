const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/Chat.Controller');

router.post('/send', ChatController.sendMessage);

module.exports = router;