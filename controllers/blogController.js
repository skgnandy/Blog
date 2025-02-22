const Blog = require('../models/blog');
const Comment = require('../models/comment');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Controller methods
const addNewBlogPage = (req, res) => {
    res.render("addBlog", {
        user: req.user,
    });
};

const getBlogDetails = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
        res.render('blog', {
            user: req.user,
            blog,
            comments,
        });
    } catch (error) {
        res.status(404).send('Blog not found');
    }
};

const createBlog = async (req, res) => {
    const { title, body } = req.body;
    try {
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`
        });
        res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        res.status(400).send('Error creating blog');
    }
};

const postComment = async (req, res) => {
    try {
        await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });
        res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        res.status(400).send('Error posting comment');
    }
};

module.exports = {
    addNewBlogPage,
    getBlogDetails,
    createBlog,
    postComment,
    upload
};