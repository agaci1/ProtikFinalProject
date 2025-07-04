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
    return <p>Invalid car ID</p>;
  }

  return (
    <BookingForm
      carId={carId}
      onClose={() => router.push("/rentals")} // or redirect to dashboard/home
    />
  );
}
