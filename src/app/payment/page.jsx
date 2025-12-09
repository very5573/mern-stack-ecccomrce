"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";

// ✅ MUI Components
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

const steps = ["Personal Info", "Shipping", "Payment"];

// ============================
// ✅ AMAZON STYLE CHECKOUT FORM
// ============================
const CheckoutForm = ({ orderSummary }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items) || [];
  const shippingInfo =
    useSelector((state) => state.shipping.shippingInfo) || {};

  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ GET CLIENT SECRET
  useEffect(() => {
    const getClientSecret = async () => {
      if (!cartItems.length) return;
      setLoading(true);

      try {
        const { data } = await API.post("/payment/process", {
          items: cartItems.map((item) => ({
            price: item.product?.price,
            quantity: item.quantity,
          })),
          shippingFee:
            cartItems.reduce(
              (acc, item) =>
                acc + item.product?.price * item.quantity,
              0
            ) > 500
              ? 0
              : 50,
        });

        setClientSecret(data.client_secret);
      } catch (error) {
        toast.error("Failed to create payment intent");
      } finally {
        setLoading(false);
      }
    };

    getClientSecret();
  }, [cartItems]);

  // ✅ SUBMIT PAYMENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaymentError("");
    setLoading(true);

    const card = elements.getElement(CardNumberElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setPaymentError(result.error.message);
        toast.error(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        const paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        const orderData = {
          shippingInfo,
          orderItems: cartItems.map((item) => ({
            name: item.product?.name,
            quantity: item.quantity,
            image: item.product?.images?.[0]?.url,
            price: item.product?.price,
            product: item.product?._id,
          })),
          paymentInfo,
          itemsPrice: orderSummary?.itemsPrice || 0,
          taxPrice: orderSummary?.taxPrice || 0,
          shippingPrice: orderSummary?.shippingFee || 0,
          totalPrice: orderSummary?.totalPrice || 0,
        };

        const { data } = await API.post("/order/new", orderData);

        toast.success("Payment successful & order placed");
        router.push(`/payment/order-success/${data.order._id}`);
      }
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {loading && (
        <div className="flex items-center gap-3">
          <CircularProgress size={20} />
          <Typography>Processing...</Typography>
        </div>
      )}

      {/* ✅ CARD NUMBER */}
      <div className="w-full p-4 border rounded-lg">
        <Typography variant="subtitle2" className="mb-1 text-gray-600">
          Card Number
        </Typography>
        <CardNumberElement
          options={{ style: { base: { fontSize: "16px" } } }}
        />
      </div>

      {/* ✅ EXPIRY & CVC (SIDE BY SIDE LIKE AMAZON) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <Typography variant="subtitle2" className="mb-1 text-gray-600">
            Expiry Date
          </Typography>
          <CardExpiryElement
            options={{ style: { base: { fontSize: "16px" } } }}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <Typography variant="subtitle2" className="mb-1 text-gray-600">
            CVC
          </Typography>
          <CardCvcElement
            options={{ style: { base: { fontSize: "16px" } } }}
          />
        </div>
      </div>

      {paymentError && <Typography color="error">{paymentError}</Typography>}

      {/* ✅ BUTTONS */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading || !clientSecret}
          className="flex-1 py-3"
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>

        <Button variant="outlined" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ============================
// ✅ PAYMENT PAGE
// ============================
const PaymentPage = () => {
  const cartItems = useSelector((state) => state.cart.items) || [];
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    if (!cartItems.length) return;

    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + item.product?.price * item.quantity,
      0
    );

    const shippingFee = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Math.round(itemsPrice * 0.05);
    const totalPrice = itemsPrice + taxPrice + shippingFee;

    setOrderSummary({
      itemsPrice,
      shippingFee,
      taxPrice,
      totalPrice,
    });
  }, [cartItems]);

  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-6xl mx-auto px-4 mt-10">

        <Box className="mb-10">
          <Stepper activeStep={2} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ✅ LEFT */}
          <Card className="shadow-xl rounded-2xl">
            <CardContent className="p-8">
              <Typography variant="h5" className="font-bold mb-6 text-center">
                Secure Card Payment
              </Typography>

              <CheckoutForm orderSummary={orderSummary} />
            </CardContent>
          </Card>

          {/* ✅ RIGHT */}
          <Card className="shadow-xl rounded-2xl">
            <CardContent className="p-8">
              <Typography variant="h5" className="font-bold mb-6">
                Order Summary
              </Typography>

              {cartItems.map((item) => (
                <div
                  key={item.product?._id}
                  className="flex justify-between mb-2 text-sm"
                >
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>₹{item.product?.price * item.quantity}</span>
                </div>
              ))}

              <Divider className="my-4" />

              <div className="flex justify-between mb-2">
                <span>Items:</span>
                <span>₹{orderSummary?.itemsPrice || 0}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>₹{orderSummary?.taxPrice || 0}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>₹{orderSummary?.shippingFee || 0}</span>
              </div>

              <Divider className="my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{orderSummary?.totalPrice || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;
