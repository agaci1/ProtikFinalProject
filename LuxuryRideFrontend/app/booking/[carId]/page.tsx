// app/booking/[carId]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { useEffect } from "react";

export default function BookingPage() {
  const params = useParams();
  const carId = parseInt(params.carId as string, 10);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("userAuth");
    if (!isAuth) router.push("/auth/login");
  }, [router]);

  if (isNaN(carId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1e3d] text-white text-xl font-semibold">
        Invalid Car ID
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1e3d] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 text-white">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
          Book Your Luxury Ride
        </h2>
        <BookingForm
          carId={carId}
          onClose={() => router.push("/rentals")}
        />
      </div>
    </div>
  );
}
