var express = require('express');
const ESSerializer = require('esserializer');
const {ProductCatalogue,Return,RentReceipt,ReturnReceipt,Rent,PaymentReceipt,Ledger,Payment,ComplaintReceipt,Complaint,Receipt,BookingReceipt,BookingChallan,Challan,FineChallan,Blacklist,Customer,MongoDB,Store,ProductDescription,Product,PersistenceHandler,PersistenceFactory,Booking } = require('./classes/class');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var Router = express.Router();
Router.route('/verify')
    .post(async function(req,res,next){
        if(req.session.login=='LOGGED IN' & req.session.access=='Cashier')
        {
            var handler = ESSerializer.deserialize(req.session.handler,[ProductCatalogue,Return,RentReceipt,ReturnReceipt,Rent,PaymentReceipt,Ledger,Payment,ComplaintReceipt,Complaint,Receipt,BookingReceipt,BookingChallan,Challan,FineChallan,Blacklist,Customer,MongoDB,Store,ProductDescription,Product,PersistenceHandler,PersistenceFactory,Booking]);
            var response = await handler.verifyChallan(req.body.id);
            req.session.verifiedChallan = response.challan;
            req.session.handler = ESSerializer.serialize(handler);
            res.json(response.challan);
        }
        else
        {
            res.statusCode=401;
            res.json({status:false,error:'unauthorized'});
        }
    });
Router.route('/initiate')
    .post(function(req,res,next)
    {
        if(req.session.login=='LOGGED IN' & req.session.access=='Cashier')
        {
            var handler = ESSerializer.deserialize(req.session.handler,[ProductCatalogue,Return,RentReceipt,ReturnReceipt,Rent,PaymentReceipt,Ledger,Payment,ComplaintReceipt,Complaint,Receipt,BookingReceipt,BookingChallan,Challan,FineChallan,Blacklist,Customer,MongoDB,Store,ProductDescription,Product,PersistenceHandler,PersistenceFactory,Booking]);
            if(req.session.verifiedChallan.Status=='ISSUED'){
                if(req.session.verifiedChallan.Type=='BOOKING')
                {
                    var status = handler.initiateNewPayment(String(req.session.verifiedChallan._id),'BOOKING',req.session.verifiedChallan.BookingID,req.session.verifiedChallan.total);
                    req.session.handler = ESSerializer.serialize(handler);
                    res.json({status})
                }
                else{
                    var status = handler.initiateNewPayment(String(req.session.verifiedChallan._id),'RETURN',req.session.verifiedChallan.ReturnID,req.session.verifiedChallan.total);
                    req.session.handler = ESSerializer.serialize(handler);
                    res.json(status);
                }
            }
            else
            {
                req.session.handler = ESSerializer.serialize(handler);
                res.json({status:false,error:'ALREADY PAID'})
            }
        }
        else
        {
            res.statusCode=401;
            res.json({status:false,error:'unauthorized'});
        }
    });
Router.route('/set')
    .post(function(req,res,next){
        if(req.session.login=='LOGGED IN' & req.session.access=='Cashier')
        {
            var handler = ESSerializer.deserialize(req.session.handler,[ProductCatalogue,Return,RentReceipt,ReturnReceipt,Rent,PaymentReceipt,Ledger,Payment,ComplaintReceipt,Complaint,Receipt,BookingReceipt,BookingChallan,Challan,FineChallan,Blacklist,Customer,MongoDB,Store,ProductDescription,Product,PersistenceHandler,PersistenceFactory,Booking]);
            var response = handler.setAmountPaid(req.body.amount);
            req.session.handler = ESSerializer.serialize(handler);
            res.json(response);
        }
        else
        {
            res.statusCode=401;
            res.json({status:false,error:'unauthorized'});
        }
    });
Router.route('/confirm')
    .post(async function(req,res,next){
        if(req.session.login=='LOGGED IN' & req.session.access=='Cashier')
        {
            var handler = ESSerializer.deserialize(req.session.handler,[ProductCatalogue,Return,RentReceipt,ReturnReceipt,Rent,PaymentReceipt,Ledger,Payment,ComplaintReceipt,Complaint,Receipt,BookingReceipt,BookingChallan,Challan,FineChallan,Blacklist,Customer,MongoDB,Store,ProductDescription,Product,PersistenceHandler,PersistenceFactory,Booking]);
            var response = await handler.confirmNewPayment();
            req.session.handler = ESSerializer.serialize(handler);
            res.json(response);
        }
        else
        {
            res.statusCode=401;
            res.json({status:false,error:'unauthorized'});
        }
    });
Router.route('/generateReceipt')
    .post(function(req,res,next){
        var handler = ESSerializer.deserialize(req.session.handler,[ProductCatalogue,Return,RentReceipt,ReturnReceipt,Rent,PaymentReceipt,Ledger,Payment,ComplaintReceipt,Complaint,Receipt,BookingReceipt,BookingChallan,Challan,FineChallan,Blacklist,Customer,MongoDB,Store,ProductDescription,Product,PersistenceHandler,PersistenceFactory,Booking]);
        var response = handler.generatePaymentReceipt();
        req.session.handler = ESSerializer.serialize(handler);
        res.json(response);
    });
module.exports = Router;