

var mongoose = require('mongoose');
var userModel = mongoose.model('User');

exports.checkLogin = function(req,res,next){

	if(!req.session.user){

		res.redirect('/big/register');
	}
	else{
		next();
	}
}