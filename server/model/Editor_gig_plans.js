import mongoose from 'mongoose';
const editor_gig_plans = mongoose.schema({
    editor_id:Number,
    basic:{
        price:Number,
        desc:String,
        deliveryTime:Number,
        services: {
            type: [String],
        },
        ServiceOptions:{
            type: [Number],
        }
    },
    standard:{
        price:Number,
        desc:String,
        deliveryTime:Number,
        ServiceOptions:{
            type: [Number],
        }
    },
    premium:{
        price:Number,
        desc:String,
        deliveryTime:Number,
        ServiceOptions:{
            type: [Number]
        }
    }  
});
