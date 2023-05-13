const router = require('express').Router();
const controller = require('../controllers/Message');

router.post('/create/:receiverId', controller.createMessage);

module.exports = router;
