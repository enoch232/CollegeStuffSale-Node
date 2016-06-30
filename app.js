var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var csurf = require("csurf");
var sessions = require("client-sessions");
var app = express();
//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(sessions({
	cookieName: "session",
	secret: "asdkfjlk23j4lk2jlekjsdfjaldsfadf",
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
	httpOnly: true,
	secure: true,
	ephemeral: true
}));
app.use(csurf());
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
	res.render("login", { csrfToken: req.csrfToken() }); 
});
//login
app.post("/login", function(req, res){
	User.findOne({email: req.body.email }, function(err, user){
		if (!user){
			console.log("invalid email or password");
			res.render("login", {error: "Invalid email or password."});
		}else{
			if (bcrypt.compareSync(user.password, req.body.password)){
				console.log("logged in!");
				req.session.user = user;
				res.redirect("/dashboard");
			}else{
				console.log("invalid email or password");
				res.render("login", {error: "Invalid email or password."});
			}
		}
	});
});
//dashboard -> after login
app.get("/dashboard", function(req, res){
	if (req.session && req.session.user){
		User.findOne( {email: req.session.user.email }, function(err, user){
			console.log(user);
			if (!user){
				console.log("User not found");
				req.session.reset();
				res.redirect("/login");
			}else{
				console.log("Logged in")
				res.locals.user = user;
				res.render("dashboard");
			}
		});
	}else{
		res.render("login");
	}
});
app.get("/register", function(req, res){
	res.render("register", { csrfToken: req.csrfToken() });
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
