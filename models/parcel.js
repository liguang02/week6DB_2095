const mongoose = require('mongoose');
const parcelSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto:true},
    sender: {type: String, 
        required: true,
        validate: {validator:function(_sender){
            return(_sender.length>=3)
        },
    message: 'Sender must be at least 3 characters long!!'}
     },
    address: {type: String, 
        required: true,
        validate: {validator:function(_address){
            return(_address.length>=3)
        },
    message: 'Address must be at least 3 characters long!!'}
    },
    weight: {type: Number, 
        validate: {validator:function(_weight){
            return(_weight>=0)
        },
    message: 'No negative weights!!'}
    },
    fragile: {type: Boolean, 
        required: true
     }
});



module.exports = mongoose.model('Parcel', parcelSchema);