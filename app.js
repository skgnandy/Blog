require("dotenv").config();
const path = require('path');
const express = require("express");
const { connectToMongoDB } = require('./connect');
const cookieParser = require("cookie-parser");
const Blog = require('./models/blog')
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT;

connectToMongoDB(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    });

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({ extended: false })); // To parse URL-encoded data
app.use(express.json());  // To parse JSON data
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")));

app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render("home", { user: req.user, blogs: allBlogs });
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
