var methodOverride = require("method-override"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	express = require("express"),
	app = express();
	
	app.use(methodOverride("_method"));
	
	mongoose.set('useFindAndModify', false);
	mongoose.set("useUnifiedTopology", true);
	mongoose.set('useNewUrlParser', true);
	mongoose.connect("mongodb://localhost/rest_blog_app");
	
	app.set("view engine","ejs");
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(express.static("public"));

var blogSchema= new mongoose.Schema({
	title:String,
	body: String,
	date:{type:Date , default:Date.now}
	});

	
var Blog = mongoose.model("blog", blogSchema);
	
	// Blog.create({
	// 	title: "first blog",
	// 	img:"https://images.unsplash.com/photo-1586971934493-d6829d89393c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	// 	body:"the image is from unsplash.com for free photos !"
	// });

	app.get("/", function(req, res){
		res.redirect("/blog");
	})
	
	app.get("/blog", function(req, res){
		Blog.find({}, function(err, blogs){
			res.render("index", {blogs:blogs});
		})
	})

	app.get("/blog/new", function(req, res){
		res.render("new");
	})
	
	app.post("/blog", function(req, res){
		Blog.create(req.body.blog, function(err, createdBlog){
			if(err){
				res.render("new");
			}else{
				res.redirect("/blog");
			}
		})
	})
	
	app.get("/blog/:id", function(req, res){
		Blog.findById(req.params.id, function(err, requestedBlog){
			if(err){
				res.redirect("/blog");
			}else{
				res.render("show", {blog: requestedBlog});
			}
		})
	})

	app.get("/blog/:id/edit", function(req, res){
		Blog.findById(req.params.id,function(err, reqBlog){
			if(err){
				res.redirect("/blog");
			}else {
				res.render("edit", {blog: reqBlog});
			}
		})
	})

	app.put("/blog/:id", function(req, res){
		Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
			if(err){
				res.redirect("/blog");
			}else{
				res.redirect("/blog/"+req.params.id);
			}
		})
	})
	
	app.delete("/blog/:id", function(req, res){
		Blog.findByIdAndRemove(req.params.id, function(err){
			if(err){
				res.redirect("/blog");
			}else{
				res.redirect("/blog");
			}
			
		})
		
		
	})


	app.listen(3000, function(){
		console.log("the server is one !!");
	});