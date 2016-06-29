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
app.get("/register", function(req, res){
	res.render("register");
});
app.post("/register", function(req, res){
	User.addUser(req.body, function(err, user){
		if (err){
			console.log(err);
		}else{
			res.json(user);
		}
	});
});
