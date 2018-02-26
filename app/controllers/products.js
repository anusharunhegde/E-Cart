
const router = require('express').Router();
const mongoose = require('mongoose');

var productModel = mongoose.model('Product');
var cartModel = mongoose.model('Cart');
var userModel = mongoose.model('User');


var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../auth/auth');

module.exports.controller = function(app){

	//rendering pages==================================================================================================================


	
	//display all the products
	router.get('/products',auth.checkLogin,function(req,res){

			productModel.find({},function(err,products){

				if(err) {
					var myResponse = responseGenerator.generate(true,'some error',402,null);
					res.send(myResponse);
				}
				else{
						res.render('products',{user:req.session.user,items:products});
				}
			
			});
			
	});


	//add products
	router.get('/addProducts/screen',function(req,res){

		res.render('addProduct',{user:req.session.user});
	});


	router.post('/addItem',function(req,res){

		var newItem = new productModel({

			productName : req.body.productName,

			description : req.body.description,

			price       : req.body.price
		});

		newItem.save(function(err,newItem){

			if(err){

				var myResponse = responseGenerator.generate(true,"couldn't save data",500,null);
				res.send(myResponse);
			}
			else{

				res.redirect('/big/products');
			}
		});
	});

	//delete item from the list
	router.get('/delete-item/:id',function(req,res){

		productModel.remove({_id:req.params.id},function(err,item){

			if(err) {
				var myResponse = responseGenerator.generate(true,'some error',402,null);
					res.send(myResponse);
			}
			else{

				res.redirect('/big/products');
			}
		});
	});

	//edit product details=====================
	router.post('/editProduct/:id',function(req,res){

		var edit = req.body
		productModel.findOneAndUpdate({_id:req.params.id},edit,function(err,editedItem){

			if(err) {

				var myResponse = responseGenerator.generate(true,'some error',402,null);
					res.send(myResponse);
			}
			else{

				res.redirect('/big/products');
			}
		});
	});
	//====================================================================================================================

//=================================================cart details==============================================================



router.get('/cart',auth.checkLogin,function(req,res){

		
			

		res.render('cartview',{user:req.session.user});
	});

//cart data
router.get('/cart/:id',auth.checkLogin,function(req,res){

	productModel.findOne({_id:req.params.id},function(err,found){

		if(err){

			var myResponse = responseGenerator.generate(true,'some error',500,null);
			res.send(myResponse);

		}
		else{

			var cartitem = new cartModel({

				productName  : found.productName,

				description  : found.description,

      			price        : found.price
			});

		
			cartitem.save(function(err,item){

				if(err){

					var myResponse = responseGenerator.generate(true,'some error',500,null);
					res.send(myResponse);
				}
				else{

					userModel.findByIdAndUpdate(req.session.user._id,{$push:{cart:cartitem}},{new:true},function(err,result){

						req.session.user = result;

						res.redirect('/big/cart');
					});
				}
			});

		}
	});
		
});




//removing AN ITEM FROM THE CART

	router.get('/cartremove/:id',function(req,res){

		userModel.findByIdAndUpdate(req.session.user._id,{$pull :{cart:{_id:req.params.id} }},{new:true},function(err,result){

						req.session.user = result;

						res.redirect('/big/cart');
					});
	});







	app.use('/big',router);
};
