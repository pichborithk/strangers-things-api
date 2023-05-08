const router = require('express').Router();
const controller = require('../controllers/Comment');

router.post('/create', controller.createComment);
router.get('/get', controller.readAll);

module.exports = router;
