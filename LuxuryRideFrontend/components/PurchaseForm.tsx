"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE from "@/lib/api";

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

      const saved = await res.json();
      setReceipt(saved);
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the purchase!");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#112446] text-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-yellow-500">

        {/* ✅ RECEIPT VIEW */}
        {receipt ? (
          <>
            <h2 className="text-2xl font-bold text-green-500 mb-4">Purchase Successful!</h2>
            <p className="mb-1"><b>Purchase ID:</b> #{receipt.id}</p>
            <p className="mb-1"><b>Customer:</b> {receipt.customerName}</p>
            <p className="mb-1"><b>Car ID:</b> {receipt.car.id}</p>
            <p className="mb-1"><b>Payment:</b> {receipt.paymentMethod}</p>
            <p className="mb-4"><b>Total Paid:</b> <span className="text-yellow-400">${receipt.amount}</span></p>

            <button
              onClick={() => {
                onClose();
                router.push("/sales");
              }}
              className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-[#112446] px-4 py-2 rounded-xl w-full font-medium"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Purchase Car <span className="text-yellow-400">#{carId}</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full p-3 bg-[#1a2e50] text-white border border-yellow-400 rounded-xl placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <input
                type="email"
                className="w-full p-3 bg-[#1a2e50] text-white border border-yellow-400 rounded-xl placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />

              <select
                className="w-full p-3 bg-[#1a2e50] text-yellow-400 border border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash</option>
              </select>

              <div className="flex justify-between gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex-1 font-semibold"
                >
                  Pay Now
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-300 underline flex-1 text-center hover:text-yellow-500"
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
