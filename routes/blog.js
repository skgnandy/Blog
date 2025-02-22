const { Router } = require('express');
const blogController = require('../controllers/blogController');

const router = Router();

router.get("/add-new", blogController.addNewBlogPage);
router.get('/:id', blogController.getBlogDetails);
router.post("/", blogController.upload.single('coverImage'), blogController.createBlog);
router.post('/comment/:blogId', blogController.postComment);

module.exports = router;
