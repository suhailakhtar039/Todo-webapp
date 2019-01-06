var express 					=require("express"),
	bodyParser 					=require("body-parser"),
	passport 					=require("passport"),
	localStrategy 				=require("passport-local"),
	passportLocalMongoose 		=require("passport-local-mongoose"),
	User 						=require("./models/user"),
	expressSession 				=require("express-session"),
	methodOverride				=require("method-override"),
	mongoose 					=require("mongoose");

//==================basic set-up starts==================//
var app=express();
// mongoose.connect("mongodb://localhost:27017/todoProject",{useNewUrlParser:true});
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
//========authentication setup starts========//
app.use(expressSession({
	secret:"Todo project sample",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//========authentication setup ends========//
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
})
//==================basic set-up ends==================//
//====routes=====//
app.get("/",function(req,res){
	res.render("home");
});
app.get("/login",function(req,res){
	res.render("login");
});
app.get("/register",function(req,res){
	res.render("SignUp");
});
app.post("/register",function(req,res){
	User.register(new User({username:req.body.username,name:req.body.name}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("SignUp");
		}else {
			passport.authenticate("local")(req,res,function(){
				res.redirect("/dashboard");
			})
		}
	})
})
app.post("/login",passport.authenticate("local",{
	successRedirect:"/dashboard",
	failureRedirect:"/login"
}),function(req,res){
})
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
//==main
app.get("/dashboard",isLoggedIn,function(req,res){
	res.render("todos/front");
});
app.post("/dashboard",isLoggedIn,function(req,res){
	req.user.todos.push(req.body.todo);
	req.user.save();
	res.redirect("/dashboard");
})
//=====delete===//
app.delete("/dashboard/delete",function(req,res){
	var todo=req.body.todo;
	for(var i=0;i<req.user.todos.length;i++){
		if(req.user.todos[i]==todo){
			req.user.todos.splice(i,1);
			req.user.save();
			res.redirect("/dashboard");
		}
	}
})
//=====middlewares====//
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
}
app.listen(process.env.PORT||3000,function(){
	console.log("server has started");
});