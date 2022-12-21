const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.set("strictQuery", true);

mongoose.connect('mongodb+srv://irakli9823:lqdzVA6ZOUped0HA@cluster0.f09shhc.mongodb.net/postsDB', {useNewUrlParser: true, 
useUnifiedTopology: true })

// mongoose.connect('mongodb://127.0.0.1:27017/postsDB', {useNewUrlParser: true, 
// useUnifiedTopology: true })
.then(() => {
    console.log("Connected to Mongo");
})
.catch((err) => {
    console.log("Mongo Connection Error");
    console.log(err);
});

const postsSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post", postsSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    Post.find((err, posts) => {
        if(!err){
            console.log("Posts Found");
            res.render("home", {
                homeStartingContent: homeStartingContent,
                posts: posts
            });
        }
    });
});

app.get("/about", function(req, res){
    res.render("about", {
        aboutContent: aboutContent
    });
});

app.get("/contact", function(req, res){
    res.render("contact", {
        contactContent: contactContent
    });
});

app.get("/compose", function(req, res){
    res.render("compose", {

    });
});

app.get("/posts/:postID", function(req, res){
    const postID = req.params.postID;
    Post.findOne({_id: postID}, (err, posts) => {
        if(!err){
            res.render("post", {
                title: posts.title,
                content: posts.content,
                id: posts._id
            });
        }
    });
});


app.post("/compose", function(req, res){
    const postTitle = req.body.postTitle;
    const postContent = req.body.postBody;
    const post = new Post({
        title: postTitle,
        content: postContent
    })
    post.save((err) => {
        if(!err){
            res.redirect("/");
        }
    });
});

app.post("/delete", function(req, res){
    const deletePostID = req.body.deletePost;

    Post.findByIdAndRemove(deletePostID, function(err, deletedPost){
        if(!err){
            console.log("Succesfully deleted post");
            res.redirect("/");
        }
    });
});



app.listen(3000, () => {
    console.log("The server started on port 3000");
});