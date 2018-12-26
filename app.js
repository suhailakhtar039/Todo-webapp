var express=require("express");
var app=express();

app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",function(req,res){
	res.render("home");
});
app.get("/login",function(req,res){
	res.render("login");
});
app.get("/signup",function(req,res){
	res.render("SignUp");
});




app.listen(3000,function(){
	console.log("server has started");
});