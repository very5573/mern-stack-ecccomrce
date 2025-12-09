"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

// ✅ MUI
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";

// ✅ MUI Icons
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = ["Personal Info", "Shipping", "Payment"];

const OrderSuccessPage = () => {
  const { id } = useParams();
  const router = useRouter();

  return (
    <Box className="flex justify-center mt-12 px-4">
      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl">
        <CardContent className="p-10">

          {/* ✅ TOP STEPPER (AMAZON STYLE) */}
          <Box className="mb-10">
            <Stepper activeStep={2} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* ✅ SUCCESS CONTENT */}
          <Box className="flex flex-col items-center gap-4 text-center p-6">

            <CheckCircleIcon
              className="text-green-600"
              sx={{ fontSize: 80 }}
            />

            <Typography variant="h4" className="font-bold text-green-600">
              Order Placed Successfully
            </Typography>

            <Typography className="text-gray-600 max-w-md">
              Thank you for your order. Your payment was successful, and your
              order is now being processed.
            </Typography>

            <Divider className="my-4 w-full max-w-sm" />

            <Typography className="text-sm text-gray-500">
              Order ID: <span className="font-semibold">{id}</span>
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant="contained"
                className="flex-1"
                onClick={() => router.push(`/my-orders/${id}`)}
              >
                View Order Details
              </Button>

              <Button
                variant="outlined"
                className="flex-1"
                onClick={() => router.push("/")}
              >
                Continue Shopping
              </Button>
            </div>

          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderSuccessPage;
