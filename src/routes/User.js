const router = require('express').Router();
const controller = require('../controllers/User');

router.post('/register', controller.createUser);
router.post('/login', controller.loginUser);
router.get('/get', controller.readAll);
router.get('/me', controller.readUser);

module.exports = router;
