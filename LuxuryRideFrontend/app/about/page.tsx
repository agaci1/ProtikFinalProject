"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Shield, Phone, Mail, Instagram } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import "@/styles/about.css"

const AboutPage = () => {
  const router = useRouter()
  const [isAuth, setAuth] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const quotes = [
    "Unleash power, style, and status behind every turn of the wheel.",
    "Luxury isn’t a feature, it’s a feeling.",
    "Crafted to thrill, designed to impress."
  ]

  useEffect(() => {
    const auth = localStorage.getItem("userAuth")
    if (!auth) router.push("/auth/login")
    else setAuth(true)
  }, [router])

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const logout = () => {
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  const TypewriterText = dynamic(() => import("@/components/TypewriterText"), { ssr: false })

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-yellow-400" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-white bg-blue-950">
      {/* ── HERO VIDEO ───────────────────────────────────── */}
      <div className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videomakina.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/30 to-blue-950/80 z-0" />

        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
          <h1 className="text-7xl sm:text-9xl font-extrabold text-yellow-400 animate-glow">
            Drive your dream.
          </h1>
          <p className="text-xl sm:text-2xl mt-6 glow-red transition-opacity duration-1000 animate-appear">
            {quotes[quoteIndex]}
          </p>
        </div>
      </div>

      <Navigation isAuthenticated onLogout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-32">
        <TypewriterText words={["Drive your dream.", "Luxury is a choice.", "Experience the elite ride."]} />

        <section className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 clip-left-triangle shadow-2xl overflow-hidden">
            <Image
              src="/audir8picture.webp"
              alt="Audi R8"
              width={700}
              height={500}
              priority
              className="object-cover"
            />
          </div>
          <p className="w-full md:w-1/2 text-lg leading-relaxed">
            At <strong>LUXURYRIDE</strong>, we curate a stable of adrenaline‑fueled masterpieces. Each
            vehicle is vetted for performance, provenance, and pure emotional appeal — ensuring your drive
            is nothing short of legendary.
          </p>
        </section>

        <section className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="w-full md:w-1/2 clip-right-triangle shadow-2xl overflow-hidden">
            <Image
              src="/Ferrari-SF90-XX-Stradale-4K-Wallpaper-1081x608.jpg"
              alt="Ferrari SF90 XX Stradale"
              width={700}
              height={500}
              className="object-cover"
            />
          </div>
          <p className="w-full md:w-1/2 text-lg leading-relaxed">
            From concierge booking to white‑glove delivery, our team orchestrates every detail. We believe
            true luxury is seamless — that’s why we handle logistics while you savour the thrill.
          </p>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 clip-left-triangle shadow-2xl overflow-hidden">
            <Image
              src="/koenigsegg.jpg"
              alt="Koenigsegg Jesko"
              width={700}
              height={500}
              className="object-cover"
            />
          </div>
          <p className="w-full md:w-1/2 text-lg leading-relaxed">
            With decades of expertise and a global network of collectors, <strong>LUXURYRIDE</strong> secures
            rare supercars you won’t find anywhere else. Rarity, exclusivity, and excellence — delivered.
          </p>
        </section>

        <section className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-3xl font-bold animate-bounce text-yellow-300">Our Mission</h2>
          <p>
            We exist to elevate journeys. Whether you’re renting for a once‑in‑a‑lifetime weekend or
            acquiring a crown‑jewel for your collection, our purpose is to ignite passion on every road.
          </p>
          <div className="flex items-center gap-3 text-yellow-400 font-semibold">
            <Shield className="h-6 w-6" /> Prestige • Power • Perfection
          </div>
        </section>

        <section className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl grid sm:grid-cols-3 gap-6">
          <ContactChip icon={<Phone />} text="+355&nbsp;69&nbsp;01&nbsp;01&nbsp;001" />
          <ContactChip icon={<Mail />} text="info@luxuryride.com" />
          <ContactChip icon={<Instagram />} text="@luxuryride.al" />
        </section>
      </main>
    </div>
  )
}

function ContactChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#1a2e50] px-6 py-4 rounded-xl shadow-lg backdrop-blur-md">
      <span className="text-yellow-400">{icon}</span>
      <span className="text-gray-200" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  )
}

export default AboutPage
