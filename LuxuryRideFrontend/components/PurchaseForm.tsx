"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE from "@/lib/api"; // ← Make sure you have this in lib/api.ts

interface Props {
  carId: number;
  onClose: () => void;
}

export default function PurchaseForm({ carId, onClose }: Props) {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [receipt, setReceipt] = useState<any | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const purchase = {
      carId,
      customerName,
      customerEmail,
      paymentMethod,
    };

    try {
      const res = await fetch(`${API_BASE}/api/purchases/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchase),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Purchase failed");
      }

      const saved = await res.json(); // ← Receive full purchase details
      setReceipt(saved);              // ← Show receipt
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the purchase!");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">

        {/* ✅ RECEIPT VIEW */}
        {receipt ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Purchase Successful!</h2>
            <p className="mb-2">Purchase ID: <b>{receipt.id}</b></p>
            <p className="mb-2">Customer: {receipt.customerName}</p>
            <p className="mb-2">Car ID: {receipt.car.id}</p>
            <p className="mb-2">Payment: {receipt.paymentMethod}</p>
            <p className="mb-2">Total Paid: <b>${receipt.amount}</b></p>
            <button
              onClick={() => {
                onClose();
                router.push("/sales");
              }}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded w-full"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Purchase Car ID: {carId}</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <input
                type="email"
                className="w-full mb-2 p-2 border rounded"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />

              <select
                className="w-full mb-4 p-2 border rounded"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash</option>
              </select>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded"
                >
                  Pay Now
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="underline text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
