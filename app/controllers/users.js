
const router = require('express').Router();
const mongoose = require('mongoose');

var userModel = mongoose.model('User');
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../auth/auth');

module.exports.controller = function(app){

	//rendering pages==================================================================================================================
	router.get('/register',function(req,res){

		res.render('signup');
	});



	
	router.get('/home',auth.checkLogin,function(req,res){

		res.render('home',{user:req.session.user});
	});

	router.get('/logout',function(req,res){

		req.session.destroy(function(err){

			res.redirect('/');
		});
	});


	//user signup =======================================================================================================================
	router.post('/signup',function(req,res){

		if(req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.email!=undefined && req.body.password!=undefined){

			var newUser = new userModel({
	
				firstName  : req.body.firstName,
				lastName   : req.body.lastName,
				email	   : req.body.email,
				mobileNumber  : req.body.mobileNumber,
				password   : req.body.password

			});

			//check whether user already exist in the databaase
			userModel.findOne({email:req.body.email}).then(function(currentUser){

				if(currentUser){

					res.send('Alrady have an account Login');
				}
				else{

					newUser.save(function(err){
				if(err){

					var myResponse = responseGenerator.generate(true,"couldn't save data",500,null);
					res.send(myResponse);
				}

				else{

					var myResponse = responseGenerator.generate(false,"user successfully signed up",200,newUser);
					//res.send(myResponse);
					
					req.session.user = newUser;
					delete req.session.user.password;

					res.redirect('/big/home');
				}

			});//end of new user save


				}
			});
			
		}//end of if
		else{

				var myResponse = {

					error   : true,
					message : 'some body parameter is missing',
					status  : 403,
					data    :null

				}

				res.send(myResponse);

		}//end of else

	});//end of signup
	
	//user login =================================================================================================================
	router.post('/login',function(req,res){

			//res.send('logged in successfully');
			userModel.findOne({$and : [{'email':req.body.email},{'password':req.body.password}] },function(err,foundUser){

				if(err) {
					
					var myResponse = responseGenerator.generate(true,'some error',402,null);
					res.send(myResponse);
				}
				else if(foundUser==undefined || foundUser ==null || foundUser.id== undefined ){

					var myResponse = responseGenerator.generate(true,'user not found',500,null);
					res.send(myResponse); 	
				}
				else{

						req.session.user = foundUser;
						delete req.session.user.password;
						res.redirect('/big/home');
						
				}
				
			});//end of find

	});//end of login

	//forgot password
	router.get('/forgotPassword',function(req,res){

		res.render('forgotPassword');
	});

	router.post('/checkPassword',function(req,res){

		userModel.findOne({email:req.body.email},function(err,foundUser){

			if(err){

				var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
             	res.send(myResponse);
			}
			else if(foundUser==null || foundUser==undefined || foundUser.email==undefined){

				var myResponse = responseGenerator.generate(true,"this email has not registered!!"+err,500,null);
             	res.send(myResponse);
			}
			else{

				req.session.user = foundUser;
				res.send('your password is :' + req.session.user.password);
			}
		});
	});




	app.use('/big',router);
};
