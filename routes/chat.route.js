const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/Chat.Controller');

router.get('/', (req, res, error) => {
    console.log(req.io);
    res.send({});
});
router.post('/send', (ChatController.sendMessage));

module.exports = router;