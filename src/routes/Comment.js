const router = require('express').Router();
const controller = require('../controllers/Comment');

router.post('/create/:postId', controller.createComment);
router.get('/get', controller.readAll);
router.delete('/delete/:postId', controller.deleteComment);

module.exports = router;
