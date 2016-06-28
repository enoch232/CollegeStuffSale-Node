var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
app.set("view engine", "ejs");
console.log("Server is now running at port "+port);
app.listen(port);
app.get("/", function(req, res){
	res.render("index");
});
