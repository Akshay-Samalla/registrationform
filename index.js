const mongoose=require('mongoose');
const connect=mongoose.connect("mongodb://localhost:27017/users");
const express= require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get("/",(req,res)=>{
    res.render("index");});
connect.then(()=>{
    console.log("database connected sucessfully");
})
.catch(()=>{ 
    console.log("database cannot be connected");
});

const loginschemafordatabase= new mongoose.Schema({
    name:{
        type:String,
        required:true 
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});
const collection = new mongoose.model("userr",loginschemafordatabase);


app.post("/ok",async (req,res)=>{
    const data={ 
        name:req.body.username,
        password:req.body.password,
        email:req.body.email, 
        passwordok:req.body.passwordok
    } 
    console.log(data); 
    let a=false;  
const existinguser= await collection.findOne({name:data.name});

try{
    if(existinguser){
        res.send("user exists");
    }
    else{
        if(data.passwordok!=data.password){ 
            res.send("passwords do not match");
        }
        else{
             const r=10; 
        const hashedpassword=await bcrypt.hash(data.password,r);
        data.password=hashedpassword;
        const userdata=await collection.insertMany(data);
    console.log(userdata); 
        a=true;
        }      
    } 
    if(a){
        res.send("user created");  
    } 

    }
    catch{

        res.send("fill the details correctly");
     }



     
});
const port=3000;  
app.listen(port,()=>{
    console.log(`server running on port: ${port}`)
});     