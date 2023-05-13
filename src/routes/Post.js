const router = require('express').Router();
const controller = require('../controllers/Post');

router.post('/create', controller.createPost);
router.get('/', controller.readAll);
router.patch('/:postId', controller.updatePost);
router.delete('/:postId', controller.deletePost);

module.exports = router;
