import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/product.js";

export const placeOrder = async ( req, res ) => {
    try{
        const { userId, address } = req.body;

        //get cart items
        const cart = await Cart.findOne({userId}).populate('items.productId');
        if(!cart || cart.items.length === 0){
            return res.status(400).json({message: "Cart is empty"});
        }
        // PREPARE ORDER ITEAMS 
       const orderItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.productId.price
       }))

       //Calculate Total Amount
       const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

       //Decuct stock from Products
       for(let item of cart.items){
          await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity }});
       }

        //create order
        const order = await Order.create({
            userId,
            items: orderItems,
            address,
            totalAmount,
            paymentMethod: "COD"
        });
         //Clear Cart
        await Cart.findOneAndUpdate({userId}, { items: [] });

        res.status(201).json({message: "Order placed successfully", order});
    }catch(error){
        res.status(500).json({message: "Failed to place order", error: error.message});
    }
}