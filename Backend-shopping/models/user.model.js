import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    orderItems: [cartItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    paymentId: { type: String }, // e.g., eSewa payment ID or transaction reference
    transactionUUID: { type: String }, // Unique transaction identifier
    paymentMethod: { type: String, enum: ["stripe", "Cash on Delivery", "Other"], required: true }, // Payment method (you can add more)
    paymentDate: { type: Date }, // Timestamp when the payment was made
    paymentDetails: { type: mongoose.Schema.Types.Mixed }, // Store additional payment response details, e.g., eSewa response

    address: { type: String, required: true }, // Delivery address
    contactNumber: { type: String, required: true }, // Contact number
    deliveryStatus: {
        type: String,
        enum: ["Pending", "Packed", "Dispatched", "Delivered"],
        default: "Pending"
    }, // Delivery status
    createdAt: { type: Date, default: Date.now },
});



const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        lastLogin: { type: Date, default: Date.now },
        isVerified: { type: Boolean, default: false },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date,
        cart: [cartItemSchema], // User cart
        orders: [orderSchema], // User orders
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
