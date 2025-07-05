"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  MessageCircle,
} from "lucide-react"

export default function ContactPage() {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1e3d] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  const leftCards = [
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <MapPin className="h-6 w-6 text-yellow-400" />
          Visit Our Location
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 flex-grow">
        Rruga Jonianet, Nr. 4<br />
        Sarandë, Albania<br />
        9701
      </CardContent>
    </>,
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Phone className="h-6 w-6 text-red-500" />
          Call Us
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 space-y-1 flex-grow">
        <p><strong>Main:</strong> +355 69 01 01 001</p>
        <p><strong>Sales:</strong> +355 69 11 11 002</p>
        <p><strong>Support:</strong> +355 69 22 22 003</p>
      </CardContent>
    </>,
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Mail className="h-6 w-6 text-yellow-400" />
          Email Us
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 space-y-1 flex-grow">
        <p><strong>General:</strong> info@luxuryride.com</p>
        <p><strong>Sales:</strong> sales@luxuryride.com</p>
        <p><strong>Support:</strong> support@luxuryride.com</p>
      </CardContent>
    </>
  ]

  const rightCards = [
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Clock className="h-6 w-6 text-yellow-300" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 space-y-2 flex-grow">
        <div className="flex justify-between">
          <span>Mon–Fri:</span><span>8:00 AM – 8:00 PM</span>
        </div>
        <div className="flex justify-between">
          <span>Saturday:</span><span>9:00 AM – 6:00 PM</span>
        </div>
        <div className="flex justify-between">
          <span>Sunday:</span><span>10:00 AM – 4:00 PM</span>
        </div>
      </CardContent>
    </>,
    <>
      <CardHeader>
        <CardTitle className="text-xl text-white">Follow Us</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <Button
          className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/10"
          onClick={() => window.open("https://instagram.com/luxuryride.al", "_blank")}
        >
          <Instagram className="h-5 w-5 mr-3 text-pink-500" />
          @luxuryride.al
        </Button>
        <Button
          className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/10"
          onClick={() => window.open("https://wa.me/355690101001", "_blank")}
        >
          <MessageCircle className="h-5 w-5 mr-3 text-green-400" />
          WhatsApp: +355 69 01 01 001
        </Button>
      </CardContent>
    </>,
    <>
      <CardHeader>
        <CardTitle className="text-xl text-red-500">Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300 flex-grow">
        <p className="mb-2">For roadside assistance and emergencies:</p>
        <p className="text-xl font-bold text-red-500">+355 69 99 99 999</p>
        <p className="text-sm text-gray-400 mt-2">Available 24/7 for rental customers</p>
      </CardContent>
    </>
  ]

  return (
    <div className="min-h-screen bg-[#0c1e3d] text-white">
      <Navigation isAuthenticated={true} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <LuxuryRideLogo />
        <p className="text-center text-lg text-gray-300 mb-10">
          Get in touch with our team — we’re here to help 24/7.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {[leftCards, rightCards].map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6">
              {column.map((cardContent, idx) => (
                <Card
                  key={idx}
                  className="flex flex-col justify-between h-full bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl"
                >
                  {cardContent}
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
