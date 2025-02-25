const express = require("express");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Address = require("../models/address.model");

exports.placeOrder = async (req, res) => {
	try {
		const { user_id, address_id, payment_id } = req.body;

		// Fetch the user's cart
		const cart = await Cart.findOne({ user_id });
		if (!cart) {
			return res.status(404).json({ error: "Cart not found" });
		}

		// Fetch the selected address
		const address = await Address.findById(address_id);
		if (!address) {
			return res.status(404).json({ error: "Address not found" });
		}

		const paymentIntent = await stripe.paymentIntents.retrieve(payment_id);

		if (paymentIntent.status !== "succeeded") {
			return res.status(400).json({ error: "Payment not successful" });
		}
		// Create the order
		const order = new Order({
			user_id,
			items: cart.items,
			price_details: cart.price_details,
			delivery_address: address,
			payment_details: {
				payment_method: "Stripe",
				transaction_id: payment_id,
				amount: cart.price_details.total_amount,
			},
			payment_status: "Success",
		});

		await order.save();

		// Clear the user's cart
		await Cart.deleteOne({ user_id });

		res.status(201).json({ message: "Order placed successfully", order });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

// Fetch all orders for a user
exports.getOrders = async (req, res) => {
	try {
		const { user_id } = req.params;

		const orders = await Order.find({ user_id }).lean();

		res.status(200).json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

// Fetch order details by ID
exports.getOrderDetails = async (req, res) => {
	try {
		const { order_id } = req.params;

		// Fetch the order and populate the delivery address
		const order = await Order.findById(order_id)
			.populate("delivery_address")
			.populate("items.product_id");

		if (!order) {
			return res.status(404).json({ error: "Order not found" });
		}

		res.status(200).json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

exports.updateOrderStatus = async (req, res) => {
	try {
		const { order_id, order_status } = req.body;

		const order = await Order.findByIdAndUpdate(
			order_id,
			{ order_status },
			{ new: true }
		);

		res.status(200).json({ message: "Order status updated", order });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};
