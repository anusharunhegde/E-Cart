const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
var responseGenerator = require('./libs/responseGenerator');
// module for maintaining sessions================================================================================
const session = require('express-session');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
// path is used the get the path of our files on the computer
const path = require ('path');

app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

// initialization of session middleware 

app.use(session({
  name :'myCustomCookie',
  secret: 'myAppSecret', // encryption key 
  resave: true,
  httpOnly : true,
  saveUninitialized: true,
 
}));


// set the templating engine ================================================================================
app.set('view engine', 'ejs');

//set the views folder
app.set('views',path.join(__dirname + '/app/views'));


//mongodb connections===================================================================================
const dbPath  = "mongodb://localhost/ecomDb";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

  console.log("database connection open success");

});

//const userModel = mongoose.model('User');
// fs module, by default module for file management in nodejs============================================
const fs = require('fs');

// include all our model files
fs.readdirSync('./app/models').forEach(function(file){
	
	if(file.indexOf('.js'))
		
		require('./app/models/'+file);

});// end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
	
		var route = require('./app/controllers/'+file);
		route.controller(app);
	}

});








//index view============================================================================================================
app.get('/',function(req,res){

	res.render('index',{user: req.session.user});
});

//authentication middlewares=============================================================================================
var userModel = mongoose.model('User');

app.use(function(req,res,next){

	if(req.session && req.session.user){

		userModel.findOne({id : req.session.user.id},function(err,currentUser){

			if(currentUser){

				req.session.user = currentUser;
				delete req.session.user.password;

				next();
			}
		
		});
	}
	else{

		next();
	}
});





//app level error handling middlewares

app.use('*',function(req,res,next){
		
	 res.statusCode = 404;
     next("Page not found");
});


app.use(function(err,req,res,next){

	if(res.statusCode == 404){
		var myResponse = responseGenerator.generate(true,"404 Page Not Found,Go Back ",404,null);
        res.send( {
            message: myResponse.message,
            
        });
	}
	else{
		next();
	}
});



//srerver ============================================================================================================
app.listen(4000,function(){

	console.log('App listening at port 4000');
});