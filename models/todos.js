var mongoose=require("mongoose");
var todoSchema=new mongoose.Schema({
	description:String
});
module.exports=mongoose.model("Todos",todoSchema);