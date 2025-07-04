"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import API_BASE from "@/lib/api";

type Props = { carId: number; onClose?: () => void };

export default function BookingForm({ carId, onClose }: Props) {
  const router = useRouter();

  /* ───────────── fetch car price once ───────────── */
  const [daily, setDaily] = useState<number | null>(null);
  useEffect(() => {
    fetch(`${API_BASE}/api/cars/${carId}`)
      .then(r => r.json())
      .then(c => setDaily(c.price))
      .catch(err => {
        console.error("GET /cars/{id} failed →", err);
        alert("Could not load car information. Please try again later.");
        onClose?.();
      });
  }, [carId, onClose]);

  /* ───────────── user-entered fields ───────────── */
  const [customerName,  setCustomerName]  = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [startDate,     setStartDate]     = useState("");
  const [endDate,       setEndDate]       = useState("");
  const [receipt,       setReceipt]       = useState<any | null>(null);

  /* ───────────── derived price ───────────── */
  const total =
    daily && startDate && endDate
      ? ((new Date(endDate).valueOf() - new Date(startDate).valueOf()) / 86_400_000 + 1) * daily
      : null;

  /* ───────────── submit handler ───────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ carId, customerName, customerEmail, startDate, endDate })
      });

      if (!res.ok) {
        const text = (await res.text()).toLowerCase();
        if (text.includes("reserved") || text.includes("conflict")) {
          alert("❌ This car is already booked for one or more of the selected dates. Please choose different dates.");
        } else {
          alert("❌ Booking failed. Please check your input or try again later.");
        }
        return;
      }

      const saved = await res.json();
      setReceipt(saved);

      /* ▸ keep user logged-in context for history page */
      localStorage.setItem("userAuth", "true");
      localStorage.setItem("userEmail", customerEmail);
    } catch (err) {
      console.error("POST /reservations failed →", err);
      alert("Network error — please try again in a moment.");
    }
  }

  /* ────────────────────────── UI ────────────────────────── */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">

        {/* ───── receipt view ───── */}
        {receipt ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Booking confirmed!</h2>
            <p className="mb-2">Reservation ID: <b>{receipt.id}</b></p>
            <p className="mb-2">Dates: {receipt.startDate} → {receipt.endDate}</p>
            <p className="mb-2">Total price: <b>${receipt.totalPrice}</b></p>
            <button
              onClick={() => { onClose?.(); router.push("/purchase-history"); }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded w-full"
            >
              Done
            </button>
          </>
        ) : (
        /* ───── form view ───── */
        <>
          <h2 className="text-xl font-semibold mb-4">Book car #{carId}</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="w-full p-2 border rounded"
              placeholder="Full name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
            />
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="Email"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              required
            />

            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 p-2 border rounded"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
              <input
                type="date"
                className="flex-1 p-2 border rounded"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>

            {total !== null && (
              <p className="text-right text-lg font-bold text-blue-600">
                Total: ${total}
              </p>
            )}

            <div className="flex justify-between pt-4">
              <button type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded">
                Confirm Booking
              </button>
              <button type="button" onClick={() => onClose?.()}
                className="underline text-gray-600">
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
