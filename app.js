//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app=express();

app.set('view engine','ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const Userschema=new mongoose.Schema({
	email:String,
	password:String
});

const User=mongoose.model("User",Userschema);
Userschema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});

app.get("/",function(req,res){
	res.render("home");
})
app.get("/register",function(req,res){
	res.render("register");

})
app.get("/login",function(req,res){
	res.render("login");
})
app.get("/logout",function(req,res){
	res.render("home");

})
app.get("/submit",function(req,res){
	res.render("submit");
})
app.post("/register",function(req,res){
		const new_user=new User({
		email:req.body.username,
		password:req.body.password
	});
	new_user.save(function(err){
		if(err){
			res.send(err);
		}else{
			res.render("secrets");
		}
	})
})
app.post("/login",function(req,res){

    User.findOne({email:req.body.username},function(err,results){
    	if(err){
    		res.send(err);
    	}else{
    		if(results.password == req.body.password){
    			res.render("secrets");
    		}
    		else{
    			res.send("rong password");
    		}
    	}
    })

})




app.listen(3000,function(res){
	console.log("server running at port 3000");
})