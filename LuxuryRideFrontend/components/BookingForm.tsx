"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE from "@/lib/api";

interface Props {
  carId: number;
  onClose: () => void;
  /** readable name shown on receipt; if not provided we fall back to carId */
  carName?: string;
  /** daily price in your currency; if not provided we fall back to 50 */
  dailyPrice?: number;
}

export default function BookingForm({ carId, onClose, carName, dailyPrice }: Props) {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [receipt, setReceipt] = useState<any | null>(null);

  /* ---------------- helpers ---------------- */
  const effectiveDaily = Number(dailyPrice) > 0 ? Number(dailyPrice) : 50; // fallback to 50

  function calcDays(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / 86_400_000));
  }

  /* ---------------- submit ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const days = calcDays(startDate, endDate);
    const total = parseFloat((effectiveDaily * days).toFixed(2));

    const payload = {
      carId,
      customerName: fullName,
      customerEmail: email,
      startDate,
      endDate,
      amount: total,
    };

    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();

      /* merge client‑side extras into receipt */
      setReceipt({ ...saved, displayName: carName || `#${carId}`, days, total });
    } catch (err) {
      console.error(err);
      alert("Booking failed – please try again.");
    }
  }

  /* ---------------- ui ---------------- */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-lg text-black">
        {receipt ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-700">Booking Confirmed</h2>
            <p><strong>Customer:</strong> {receipt.customerName}</p>
            <p><strong>Email:</strong> {receipt.customerEmail}</p>
            <p><strong>Car:</strong> {receipt.displayName}</p>
            <p><strong>Rental Days:</strong> {receipt.days}</p>
            <p><strong>Total Paid:</strong> ${receipt.total.toFixed(2)}</p>
            <button
              className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded"
              onClick={() => {
                onClose();
                router.push("/purchase-history"); // take user to history
              }}
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Book This Car</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  className="w-full px-4 py-2 border rounded-md text-black"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-md text-black"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-md text-black"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-md"
                >
                  Book
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-red-600 hover:underline"
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
