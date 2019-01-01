var mongoose=require("mongoose");
var localStrategyMongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
	name:String,
	username:String,
	password:String,
	todos:[
		String
	]
});
userSchema.plugin(localStrategyMongoose);
module.exports=mongoose.model("User",userSchema);