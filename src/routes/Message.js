const router = require('express').Router();
const controller = require('../controllers/Message');

router.post('/create', controller.createMessage);

module.exports = router;
