var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Booking = new Schema({
    CustomerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer'
    },
    ProductID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    BookingDate:{
        type:Date,
        default:Date.now()
    },
    TotalRent:{
       type:Number
    },
    Status:{
        type:String,
        default:'BOOKED'
    },
    Days:{
        type:Number
    },
    Quantity:{
        type:Number
    }
});

module.exports = mongoose.model('Booking', Booking);