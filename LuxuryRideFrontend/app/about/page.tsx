"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Users, Award, Clock, Shield } from "lucide-react"

export default function AboutPage() {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={true} onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About AutoPrime</h1>
          <p className="text-gray-600">Learn more about our company and services</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2008, AutoPrime has been serving customers with reliable car rental services and quality
                vehicles for sale. We started as a small family business with just 10 cars and have grown to become one
                of the most trusted names in the automotive industry with over 500 vehicles in our fleet.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Car className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
                <p className="text-gray-600">Over 500 well-maintained vehicles from economy to luxury cars</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">50,000+ Customers</h3>
                <p className="text-gray-600">Trusted by thousands of satisfied customers nationwide</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Award Winning</h3>
                <p className="text-gray-600">Best Car Rental Service 2023 & Top Sales Dealer Award</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support for all your needs</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At AutoPrime, our mission is to provide exceptional automotive solutions that exceed customer
                expectations. Whether you need a reliable rental car for your business trip or looking to purchase your
                dream car, we are committed to delivering quality service with integrity and transparency.
              </p>
              <div className="flex items-center gap-2 text-blue-600">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Quality • Reliability • Trust</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
