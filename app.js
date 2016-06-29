var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/auth");
var port = process.env.PORT || 3000;
app.set("view engine", "ejs");
User = require("./models/user");
console.log("Server is now running at port "+port);
app.listen(port);
app.get("/", function(req, res){
	res.render("index");
});
app.get("/login", function(req, res){
	res.render("login");
});
app.post("/login", function(req, res){
	User.findOne({email: req.body.email }, function(err, user){
		if (!user){
			res.render("login", {error: "Invalid email or password."});
		}else{
			if (user.password === req.body.password){
				res.redirect("dashboard");
			}else{
				res.render("login", {error: "Invalid email or password."});
			}
		}
	});
});
app.get("/dashboard", function(req, res){
	res.render("dashboard");
});
app.get("/register", function(req, res){
	res.render("register", {error: null});
});
app.post("/register", function(req, res){
	User.addUser(req.body, function(err, user){
		if (err){
			
			if (err.code == 11000){
				err = "That Email has already been taken."
			}
			res.render("register", {error: err});
		}else{
			res.json(user);
		}
	});
});
