import mongoose from 'mongoose';
const editor_gig_plans = mongoose.Schema({
    email:String,
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
const editor_plans = mongoose.model('editor_gig_plans',editor_gig_plans);
export default editor_plans;
