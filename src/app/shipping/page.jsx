"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../../redux/slices/shippingSlice";

const initialShipping = {
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
  phoneNo: "",
};

const formFields = [
  { name: "address", label: "Address", type: "text", placeholder: "Enter your address" },
  { name: "city", label: "City", type: "text", placeholder: "Enter your city" },
  { name: "state", label: "State", type: "text", placeholder: "Enter your state" },
  { name: "country", label: "Country", type: "text", placeholder: "Enter your country" },
  { name: "pinCode", label: "Pin Code", type: "text", placeholder: "Enter your pin code" },
  { name: "phoneNo", label: "Phone Number", type: "tel", placeholder: "Enter 10-digit phone number", maxLength: 10 },
];

const ShippingPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const savedShipping = useSelector((state) => state.shipping.shippingInfo);

  const [shippingInfo, setShippingInfo] = useState(savedShipping || initialShipping);

  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);
  const isFormValid = () => {
    const allFilled = Object.values(shippingInfo).every((val) => val.trim() !== "");
    return allFilled && isPhoneValid(shippingInfo.phoneNo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNo" && !/^\d*$/.test(value)) return;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = (type) => {
    if (!isFormValid()) {
      toast.error("❌ Please fill all fields correctly.");
      return;
    }
    dispatch(saveShippingInfo(shippingInfo));
    router.push(type === "payment" ? "/payment" : "/cod");
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-xl bg-neutral-primary-soft shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>

        <form className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block mb-2.5 text-sm font-medium text-heading">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={shippingInfo[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                maxLength={field.maxLength || undefined}
                className={`bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2 shadow-xs placeholder:text-body ${
                  field.name === "phoneNo" && shippingInfo.phoneNo && !isPhoneValid(shippingInfo.phoneNo)
                    ? "border-red-500"
                    : ""
                }`}
                required
              />
              {field.name === "phoneNo" && shippingInfo.phoneNo && !isPhoneValid(shippingInfo.phoneNo) && (
                <p className="text-red-500 text-sm mt-1">Phone number must be 10 digits</p>
              )}
            </div>
          ))}
        </form>

        <div className="flex gap-4 mt-6">
          <button
            className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={cartItems.length === 0 || !isFormValid()}
            onClick={() => handleProceed("payment")}
          >
            Proceed to Payment
          </button>

          <button
            className="w-full py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            disabled={cartItems.length === 0 || !isFormValid()}
            onClick={() => handleProceed("cod")}
          >
            Cash on Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
