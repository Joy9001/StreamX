import mongoose from 'mongoose'

const editor_gig_plans = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    basic: {
        price: {
            type: Number,
            default: 0
        },
        desc: {
            type: String,
            default: "-"
        },
        deliveryTime: {
            type: Number,
            default: 0
        },
        services: {
            type: [String],
            default: ["-"]
        },
        ServiceOptions: {
            type: [Number],
        },
    },
    standard: {
        price: {
            type: Number,
            default: 0
        },
        desc: {
            type: String,
            default: "-"
        },
        deliveryTime: {
            type: Number,
            default: 0
        },
        services: {
            type: [String],
            default: ["-"]
        },
        ServiceOptions: {
            type: [Number],
        },
    },
    premium: {
        price: {
            type: Number,
            default: 0
        },
        desc: {
            type: String,
            default: "-"
        },
        deliveryTime: {
            type: Number,
            default: 0
        },
        services: {
            type: [String],
            default: ["-"]
        },
        ServiceOptions: {
            type: [Number],
        },
    }
})

const editor_plans = mongoose.model('editor_gig_plans', editor_gig_plans)
export default editor_plans
