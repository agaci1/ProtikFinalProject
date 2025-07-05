"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Car, Users, Award, MapPin, Phone,
  Instagram, MessageCircle, ChevronDown
} from "lucide-react"

/* ----- palette helpers ----- */
const gold   = "text-yellow-500"
const red    = "text-red-600"
const navyBg = "bg-[#0c1e3d]"

/* ----- hero ----- */
const Hero = () => (
  <section className="relative h-screen flex items-center justify-center">
    <Image
      src="/gclasspicture.avif"
      alt="Mercedes G-Class"
      fill
      priority
      className="object-cover object-center"
    />
    {/* slightly lighter overlay (40 % opacity) */}
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 text-center text-white px-4">
      <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
        <span className={gold}>LUXURY</span>
        <span className={`${red} ml-2`}>RIDE</span>
      </h1>

      <p className="text-2xl mb-8 max-w-2xl mx-auto">
        Premium car rentals &amp; sales in Albania.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
        <Button
          asChild
          size="lg"
          className="bg-white text-black hover:bg-gray-100 font-semibold shadow"
        >
          <Link href="/auth/login">Login as User</Link>
        </Button>
        <Button
          asChild
          size="lg"
          className={`bg-${red} text-white hover:bg-red-700 font-semibold`}
        >
          <Link href="/auth/admin-login">Admin Login</Link>
        </Button>
      </div>

      <p className={`text-2xl font-bold ${gold}`}>Learn about us</p>
      <ChevronDown className={`h-10 w-10 mx-auto mt-2 animate-bounce ${red}`} />
    </div>
  </section>
)

/* ----- featured cars ----- */
const featured = [
  { name: "BMW X5 (2025)",          type: "SUV",   price: "$89 / day",  img: "/bmwx5picture.avif" },
  { name: "Mercedes Benz C-Class (2025)", type: "Sedan", price: "$75 / day",  img: "/benzcpicture.jpg" },
  { name: "Audi R8 (2025)",         type: "Coupe", price: "$150 / day", img: "/audir8picture.webp" },
]

export default function HomePage () {
  return (
    <div className="min-h-screen scroll-smooth">

      {/* HERO */}
      <Hero />
{/* ABOUT */}
<section className="py-20 px-4 bg-white">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-bold mb-4">
      <span className="text-yellow-500">LUXURY</span>
      <span className="text-red-600">RIDE</span>
    </h2>

    <p className="text-xl text-gray-600 mb-6">
      With 15+ years of excellence, we deliver unforgettable driving experiences.
    </p>

    <p className="text-lg text-gray-500 max-w-3xl mx-auto">
      Whether you're exploring the Albanian Riviera or attending a special event,
      we offer a hand-picked selection of premium vehicles to make every journey exceptional.
    </p>
  </div>
</section>


      {/* TOP CARS */}
      <section className={`${navyBg} py-20 px-4 text-white`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">Our Top Cars</h2>
            <p className="text-xl text-gray-300">Hand-picked 2025 models</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((c,i) => (
              <Card key={i} className="overflow-hidden bg-white text-black hover:shadow-xl">
                <Image src={c.img} alt={c.name} width={300} height={200} className="w-full h-48 object-cover"/>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{c.name}</h3>
                  <p className="text-gray-600 mb-2">{c.type}</p>
                  <p className="text-2xl font-bold text-red-600">{c.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={`${navyBg} py-20 px-4 text-white`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-xl text-gray-300 mb-12">We’re here 24/7</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className={`${red} h-12 w-12 mx-auto mb-4`}/>,
                title: "Visit Us",
                text: "Rruga Jonianet, Sarandë",
              },
              {
                icon: <Phone className={`${red} h-12 w-12 mx-auto mb-4`}/>,
                title: "Call Us",
                text: "+355 69 01 01 001",
              },
              {
                icon: (
                  <div className="flex justify-center gap-4 mb-4">
                    <Instagram className="h-8 w-8 text-red-600" />
                    <MessageCircle className="h-8 w-8 text-red-600" />
                  </div>
                ),
                title: "Follow Us",
                text: "@luxuryride.al",
              },
            ].map(({icon,title,text},i)=>(
              <Card key={i} className="bg-white/5 backdrop-blur-sm p-6 text-center border border-white/20">
                <CardContent className="pt-4">
                  {icon}
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-300">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
<footer className="bg-[#06162f] py-10 px-4 text-gray-300">
  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm text-left">
    
    {/* Location */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-2">Visit Us</h4>
      <p>Rruga Jonianet,<br />Sarandë, Albania</p>
    </div>

    {/* Contact */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-2">Call or Email</h4>
      <p>Phone: +355 69 01 01 001<br />Email: info@luxuryride.al</p>
    </div>

    {/* Social */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-2">Follow Us</h4>
      <p>Instagram: @luxuryride.al<br />WhatsApp: +355 69 01 01 001</p>
    </div>
  </div>

  {/* Bottom copyright */}
  <div className="mt-10 text-center text-xs text-gray-500">
    © 2024 LUXURYRIDE — All rights reserved.
  </div>
</footer>

    </div>
  )
}
