import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Users, Award, MapPin, Phone, Instagram, MessageCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">AutoPrime</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Your premier destination for car rentals and sales. Quality vehicles, exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100 font-semibold">
              <Link href="/auth/login">Login as User</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700 border-2 border-red-600 font-semibold"
            >
              <Link href="/auth/admin-login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About AutoPrime</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With over 15 years of experience in the automotive industry, we provide reliable car rental services and
              quality vehicles for sale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Car className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
                <p className="text-gray-600">Over 500 well-maintained vehicles from economy to luxury cars</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">50,000+ Customers</h3>
                <p className="text-gray-600">Trusted by thousands of satisfied customers nationwide</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Award Winning</h3>
                <p className="text-gray-600">Best Car Rental Service 2023 & Top Sales Dealer Award</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Vehicles</h2>
            <p className="text-xl text-gray-600">Discover our most popular cars for rent and sale</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "BMW X5", type: "SUV", price: "$89/day", image: "/placeholder.svg?height=200&width=300" },
              {
                name: "Mercedes C-Class",
                type: "Sedan",
                price: "$75/day",
                image: "/placeholder.svg?height=200&width=300",
              },
              { name: "Audi A4", type: "Sedan", price: "$65/day", image: "/placeholder.svg?height=200&width=300" },
            ].map((car, index) => (
              <Card key={index} className="overflow-hidden">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
                  <p className="text-gray-600 mb-2">{car.type}</p>
                  <p className="text-2xl font-bold text-blue-600">{car.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-4 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Quick Access</h2>
            <p className="text-xl opacity-90">Get started with our services</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-8 text-center">
                <Car className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Car Rentals</h3>
                <p className="mb-6 opacity-90">Browse our extensive fleet of rental vehicles</p>
                <Button asChild className="bg-white text-blue-900 hover:bg-gray-100">
                  <Link href="/auth/login">View Rentals</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Car Sales</h3>
                <p className="mb-6 opacity-90">Find your perfect car from our sales inventory</p>
                <Button asChild className="bg-white text-blue-900 hover:bg-gray-100">
                  <Link href="/auth/login">View Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">Get in touch with our team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600">
                  123 Auto Street
                  <br />
                  Downtown, City 12345
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600">
                  +1 (555) 123-4567
                  <br />
                  24/7 Customer Support
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="flex justify-center gap-4 mb-4">
                  <Instagram className="h-8 w-8 text-blue-600" />
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
                <p className="text-gray-600">
                  @autoprime
                  <br />
                  WhatsApp: +1 (555) 123-4567
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">AutoPrime</span>
              </div>
              <p className="text-gray-300 mb-4">
                Your premier destination for car rentals and sales. Quality vehicles, exceptional service.
              </p>
              <div className="flex space-x-4">
                <Instagram className="h-6 w-6 text-gray-300 hover:text-blue-400 cursor-pointer transition-colors" />
                <MessageCircle className="h-6 w-6 text-gray-300 hover:text-green-400 cursor-pointer transition-colors" />
                <Phone className="h-6 w-6 text-gray-300 hover:text-blue-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                    Car Rentals
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                    Car Sales
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/admin-login" className="text-gray-300 hover:text-white transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Short-term Rentals</li>
                <li>Long-term Rentals</li>
                <li>Car Sales</li>
                <li>Vehicle Financing</li>
                <li>Insurance Services</li>
                <li>24/7 Roadside Assistance</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 mt-0.5 text-blue-400" />
                  <div>
                    <p>123 Auto Street</p>
                    <p>Downtown, City 12345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  <p>WhatsApp: +1 (555) 123-4567</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-pink-400" />
                  <p>@autoprime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 AutoPrime. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
