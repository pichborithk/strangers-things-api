const router = require('express').Router();
const controller = require('../controllers/Post');

router.post('/create', controller.createPost);
router.get('/get', controller.readAll);

module.exports = router;
