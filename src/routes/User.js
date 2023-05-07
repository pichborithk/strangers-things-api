const router = require('express').Router();
const controller = require('../controllers/User');

router.post('/create', controller.createUser);

module.exports = router;
