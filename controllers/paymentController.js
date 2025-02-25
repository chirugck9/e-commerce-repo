const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
	try {
		const { amount, currency } = req.body;

		if (!amount || !currency) {
			return res
				.status(400)
				.json({ error: "Amount and currency are required." });
		}

		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100, // Convert to cents
			currency,
			automatic_payment_methods: {
				enabled: true,
				allow_redirects: "never", // Disable redirect-based payment methods
			},
		});

		res.status(200).json({
			client_secret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
		});
	} catch (error) {
		console.error("Payment Error:", error);
		res
			.status(500)
			.json({ error: "Payment processing failed", message: error.message });
	}
};

exports.confirmPayment = async (req, res) => {
	try {
		const { payment_intent_id, payment_method } = req.body;

		// Confirm the payment intent
		const paymentIntent = await stripe.paymentIntents.confirm(
			payment_intent_id,
			{
				payment_method: "pm_card_visa",
			}
		);

		res.status(200).json({ paymentIntent });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};
