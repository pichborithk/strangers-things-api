const router = require('express').Router();
const controller = require('../controllers/User');

router.post('/create', controller.createUser);
router.post('/login', controller.loginUser);
router.get('/get', controller.readAll);

module.exports = router;
