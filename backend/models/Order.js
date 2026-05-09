import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: Number

        }
    ],
    address: {
        fullName: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String,
    },
    totalAmount: Number,
    paymentMethod: {
        type: String,
        default: "COD",
    },
    status: {
        type: String,
        default: "placed"
    }
}, { timestamps: true })

export default mongoose.model("Order", OrderSchema);