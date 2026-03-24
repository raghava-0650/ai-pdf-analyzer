"use client"
import React from 'react';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';

function UpgradePlans() {

  const userUpgradePlan = useMutation(api.user.userUpgradePlan);
  const { user } = useUser();

  // ✅ After successful payment → update DB
  const onPaymentSuccess = async () => {
    const result = await userUpgradePlan({
      userEmail: user?.primaryEmailAddress?.emailAddress
    });
    console.log(result);
    toast('Plan upgraded successfully 🎉');
  };

  // ✅ Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Handle Payment
  const handlePayment = async () => {
    const res = await loadRazorpay();

    if (!res) {
      toast("Razorpay SDK failed to load");
      return;
    }

    // 🔥 Create order from backend
    const orderRes = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: 10 }), // ₹499
    });

    const order = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "AI PDF Note Taker",
      description: "Unlimited Plan",
      order_id: order.id,

      handler: async function (response) {
        // 🔐 Verify payment
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify(response),
        });

        const result = await verifyRes.json();

        if (result.success) {
          await onPaymentSuccess();
        } else {
          toast("Payment verification failed ❌");
        }
      },

      prefill: {
        email: user?.primaryEmailAddress?.emailAddress,
      },

      theme: {
        color: "#6366f1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <h2 className='font-medium text-3xl'>Plans</h2>
      <p>Update your plan to upload multiple PDFs to take notes</p>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">

          {/* FREE PLAN */}
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Free</h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> ₹0 </strong>
                <span className="text-sm font-medium text-gray-700">/month</span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li>✔ 5 PDF Upload</li>
              <li>✔ Unlimited Notes</li>
              <li>✔ Email support</li>
              <li>✔ Help center access</li>
            </ul>

            <button className="mt-8 w-full rounded-full border border-indigo-600 px-6 py-3 text-indigo-600">
              Current Plan
            </button>
          </div>

          {/* PAID PLAN */}
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Unlimited</h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> ₹10 </strong>
                <span className="text-sm font-medium text-gray-700">/one-time</span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li>✔ Unlimited PDF Upload</li>
              <li>✔ Unlimited Notes</li>
              <li>✔ Email support</li>
              <li>✔ Help center access</li>
            </ul>

            {/* 💳 Razorpay Button */}
            <div className='mt-5'>
              <button
                onClick={handlePayment}
                className="w-full rounded-full bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-700"
              >
                Upgrade to Unlimited
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UpgradePlans
