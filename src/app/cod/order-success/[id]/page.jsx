"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// MUI Components
import { Card, CardContent, Typography, Button } from "@mui/material";

// MUI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const OrderSuccessPage = () => {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      router.push("/");
    }
  }, [id, router]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">

      {/* ✅ SUCCESS STEPPER WITH MUI ICONS */}
      <ol className="flex items-center w-full max-w-xl text-sm font-medium text-center sm:text-base mb-10">

        {/* ✅ STEP 1 COMPLETED */}
        <li className="flex md:w-full items-center text-green-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:hidden sm:after:inline-block after:mx-6">
          <span className="flex items-center gap-2">
            <CheckCircleIcon fontSize="small" />
            Personal <span className="hidden sm:inline-flex">Info</span>
          </span>
        </li>

        {/* ✅ STEP 2 COMPLETED */}
        <li className="flex md:w-full items-center text-green-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:hidden sm:after:inline-block after:mx-6">
          <span className="flex items-center gap-2">
            <CheckCircleIcon fontSize="small" />
            Account <span className="hidden sm:inline-flex">Info</span>
          </span>
        </li>

        {/* ✅ STEP 3 ACTIVE / COMPLETED */}
        <li className="flex items-center text-green-600 font-semibold gap-2">
          <RadioButtonCheckedIcon fontSize="small" />
          Confirmation
        </li>

      </ol>

      {/* ✅ ORDER SUCCESS CARD */}
      <Card className="max-w-md w-full shadow-2xl rounded-2xl">
        <CardContent className="flex flex-col items-center text-center space-y-4 p-6">

          <CheckCircleIcon className="text-green-600" sx={{ fontSize: 70 }} />

          <Typography variant="h5" className="font-semibold">
            Order Placed Successfully!
          </Typography>

          {id ? (
            <>
              <Typography variant="body1">
                Your order ID:
                <span className="font-bold text-gray-800 ml-1">{id}</span>
              </Typography>

              <Button
                variant="contained"
                color="primary"
                className="w-full rounded-xl py-2"
                onClick={() => router.push(`/my-orders/${id}`)}
              >
                View Order Details
              </Button>
            </>
          ) : (
            <Typography className="text-red-600">
              Order ID not found. Redirecting...
            </Typography>
          )}

          <Button
            variant="outlined"
            color="secondary"
            className="w-full rounded-xl py-2"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>

        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
