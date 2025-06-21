"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("userAuth")
    if (!auth) {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to AutoPrime</h1>
          <p className="text-gray-600 mt-2">Choose from our rental or sales options</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Car Rentals
              </CardTitle>
              <CardDescription>Browse and book rental vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/rentals">View Rental Cars</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                Car Sales
              </CardTitle>
              <CardDescription>Browse and purchase vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/sales">View Cars for Sale</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Cars */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Vehicles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: "BMW X5",
                type: "SUV",
                price: "$89/day",
                salePrice: "$45,000",
                image: "/placeholder.svg?height=200&width=300",
                available: true,
              },
              {
                id: 2,
                name: "Mercedes C-Class",
                type: "Sedan",
                price: "$75/day",
                salePrice: "$38,000",
                image: "/placeholder.svg?height=200&width=300",
                available: true,
              },
              {
                id: 3,
                name: "Audi A4",
                type: "Sedan",
                price: "$65/day",
                salePrice: "$35,000",
                image: "/placeholder.svg?height=200&width=300",
                available: false,
              },
            ].map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{car.name}</h3>
                    <Badge variant={car.available ? "default" : "secondary"}>
                      {car.available ? "Available" : "Rented"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{car.type}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Rent: {car.price}</p>
                      <p className="text-sm text-gray-500">Buy: {car.salePrice}</p>
                    </div>
                    <Button size="sm" disabled={!car.available}>
                      {car.available ? "Book Now" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
