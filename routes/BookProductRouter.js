var express = require('express');
const ESSerializer = require('esserializer');
var ProductDescript = require('../models/ProductDescription');
const { Blacklist,Customer,MongoDB,Store,ProductDescription,Product,PersistenceHandler,PeristenceFactory,Booking } = require('./classes/class');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var Router = express.Router();
Router.route('/verifyCustomer')
    .post(function(req,res,next){
        var handler = new Store();
        handler.init();
        var re = handler.verifyCustomer(req.body.CustomerDetail);
        req.session.handler = ESSerializer.serialize(handler);
        re.isCust.then((response)=>{
            if(response.length==0)
            {
                var register = handler.registerCustomer(req.body.CustomerDetail);
                register.then((customer)=>{
                    req.session.customer = customer;
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({isBlackList:false,isCustomer:true,customer:customer});
                });
            }
            else{
                re.isBlacked.then((black)=>{
                    if(black.length!=0){
                        res.statusCode = 501;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({isBlackList:true,isCustomer:true,customer:response[0]});
                    }
                    else{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({isBlackList:false,isCustomer:true,customer:response[0]});
                    }
                })
            }
        });
    });
Router.route('/initiate')
    .post(function(req,res,next)
    {
        var handler = ESSerializer.deserialize(req.session.handler,[Blacklist,Customer,Booking,Store,ProductDescription,Product,PersistenceHandler,PeristenceFactory,MongoDB]);
        handler.initiateBooking(req.body.customerId);
        req.session.handler = ESSerializer.serialize(handler);
        res.send('Set');
    });
    var Savesession = async function(req,handler){
        req.session.handler = ESSerializer.serialize(handler);
    }
Router.route('/setProduct')
    .post(async function(req,res,next)
    {
        var handler = ESSerializer.deserialize(req.session.handler,[Blacklist,Customer,Booking,Store,ProductDescription,Product,PersistenceHandler,PeristenceFactory,MongoDB]);
        var x = await handler.setBooking(req.body.pid,req.body.quantity,req.body.days);
        await Savesession(req,handler);
       console.log(handler);
        //req.session.handler = ESSerializer.serialize(handler);
        res.send('Hi');
    });
    Router.route('/get')
    .post(function(req,res,next){
        var handler = ESSerializer.deserialize(req.session.handler,[Blacklist,Customer,Booking,Store,ProductDescription,Product,PersistenceHandler,PeristenceFactory,MongoDB]);
        console.log(handler);
        res.send('Hi');
    });
Router.route('/confirm')
    .post(function(req,res,next){
        var handler = ESSerializer.deserialize(req.session.handler,[Blacklist,Customer,Booking,Store,ProductDescription,Product,PersistenceHandler,PeristenceFactory,MongoDB]);
        console.log(handler);
        req.session.handler = ESSerializer.serialize(handler);
        res.send('Hi');
    });
module.exports = Router;