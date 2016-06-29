var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});
var User = module.exports = mongoose.model("User", userSchema);
module.exports.addUser = function(user, callback){
	var newUser = new User();
	newUser.name = user.name;
	newUser.email = user.email;
	newUser.password = user.password;
	newUser.save(callback);
}

