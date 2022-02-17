const routes = require('express').Router();
const uploadControl  = require('./control/upload');
const Control = require('./control/control');
const { Router } = require('express');
const Verify = require('./verify');

routes.get("/connect",Verify,(req,res)=>{
    res.status(200).json({connect:true});
})
routes.post("/upload",Verify,(req,res)=>{
    uploadControl.saveUpload(req,res);
});

routes.post("/getTimeTable",Verify,(req,res)=>{
    Control.getTimeTable(req,res);
})

routes.post("/addWork",Verify,(req,res)=>{
    Control.addWork(req,res);
})

routes.post("/getWork",Verify,(req,res)=>{
    Control.getWork(req,res);
})

routes.post("/deletework",Verify,(req,res)=>{
    Control.deleteWork(req,res);
})

routes.post("/login",(req,res)=>{
    Control.login(req,res);
})

routes.post("/register",(req,res)=>{
    Control.register(req,res);
})

module.exports = routes;