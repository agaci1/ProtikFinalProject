"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react"

export default function ContactPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">Get in touch with our team</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Visit Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  123 Auto Street
                  <br />
                  Downtown, City 12345
                  <br />
                  United States
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  <strong>Main Line:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Sales:</strong> +1 (555) 123-4568
                </p>
                <p className="text-gray-600">
                  <strong>Support:</strong> +1 (555) 123-4569
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  <strong>General:</strong> info@autoprime.com
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Sales:</strong> sales@autoprime.com
                </p>
                <p className="text-gray-600">
                  <strong>Support:</strong> support@autoprime.com
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open("https://instagram.com/autoprime", "_blank")}
                  >
                    <Instagram className="h-5 w-5 mr-3 text-pink-600" />
                    @autoprime
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open("https://wa.me/15551234567", "_blank")}
                  >
                    <MessageCircle className="h-5 w-5 mr-3 text-green-600" />
                    WhatsApp: +1 (555) 123-4567
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">For roadside assistance and emergencies:</p>
                <p className="text-lg font-semibold text-red-600">+1 (555) 911-HELP</p>
                <p className="text-sm text-gray-500 mt-2">Available 24/7 for rental customers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
