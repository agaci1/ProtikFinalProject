"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("userAuth")
    if (!auth) router.push("/auth/login")
    else setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  const LuxuryRideLogo = () => (
    <h1 className="text-center text-4xl font-extrabold mb-6">
      <span className="text-yellow-500">LUXURY</span>
      <span className="text-red-600 ml-2">RIDE</span>
    </h1>
  )

  if (!isAuthenticated) return <div className="min-h-screen bg-[#0c1e3d]" />

  return (
    <div className="min-h-screen bg-[#0c1e3d] text-white">
      <Navigation isAuthenticated onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <LuxuryRideLogo />
        <p className="text-center text-lg text-gray-300 mb-10">
          Choose from our Rental or Sales options
        </p>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {/* Rentals */}
          <Card className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-xl hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400 text-xl">
                <Calendar className="h-6 w-6" />
                Car Rentals
              </CardTitle>
              <CardDescription className="text-gray-300">
                Browse and book rental vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-red-600 hover:bg-red-700 font-bold"
              >
                <Link href="/rentals">View Rental Cars</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Sales */}
          <Card className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-xl hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400 text-xl">
                <DollarSign className="h-6 w-6" />
                Car Sales
              </CardTitle>
              <CardDescription className="text-gray-300">
                Browse and purchase vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-red-600 hover:bg-red-700 font-bold"
              >
                <Link href="/sales">View Cars for Sale</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FEATURED CARS */}
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">
          Featured Vehicles
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
        {[
  {
    id: 1,
    name: "BMW X5 (2025)",
    type: "SUV",
    price: "$89 / day",
    salePrice: "$45,000",
    image: "/bmwx5picture.avif",
    available: true,
  },
  {
    id: 2,
    name: "Mercedes Benz C-Class (2025)",
    type: "Sedan",
    price: "$75 / day",
    salePrice: "$38,000",
    image: "/benzcpicture.jpg",
    available: true,
  },
  {
    id: 3,
    name: "Audi R8 (2025)",
    type: "Coupe",
    price: "$150 / day",
    salePrice: "$90,000",
    image: "/audir8picture.webp",
    available: false,
  },
].map((car) => (
  <Card
    key={car.id}
    className="overflow-hidden bg-white/5 backdrop-blur border border-white/10 rounded-xl"
  >
    <Image
      src={car.image}
      alt={car.name}
      width={300}
      height={200}
      className="w-full h-48 object-cover"
    />
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white">{car.name}</h3>
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            car.available
              ? "bg-green-600 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {car.available ? "Available" : "Rented"}
        </span>
      </div>
      <p className="text-sm text-gray-300 mb-2">{car.type}</p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <p>Rent: {car.price}</p>
          <p>Buy: {car.salePrice}</p>
        </div>
        <Button
          size="sm"
          className={`font-bold ${
            car.available
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-900 text-white hover:bg-red-800"
          }`}
          disabled={!car.available}
        >
          {car.available ? "Book Now" : "Unavailable"}
        </Button>
      </div>
    </CardContent>
  </Card>
))}
        </div>
      </div>
    </div>
  )
}
