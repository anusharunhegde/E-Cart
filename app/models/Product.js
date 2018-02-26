const mongoose = require('mongoose');

const Schema =mongoose.Schema;

const productSchema = new Schema({

	productName   :  {type:String,default:'',required:true},

	description   :  {type:String,default:'',required:true},

	price         :  {type:Number,default:'',required:true}

	
});

mongoose.model('Product',productSchema);

