var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
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
	newUser.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
	newUser.save(callback);
}

