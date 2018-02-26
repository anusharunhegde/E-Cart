const mongoose = require('mongoose');
const Cart = require('./Cart');
const cartSchema =mongoose.model('Cart').schema;

const Schema =mongoose.Schema;


const userSchema = new Schema({

	firstName      :  {type:String,default:''},

	lastName       :  {type:String,default:''},

	email          :  {type:String,default:''},

	mobileNumber   :  {type:Number,default:''},
	
	password       :  {type:String,default:''},

	cart           : [cartSchema]


});

mongoose.model('User',userSchema);

