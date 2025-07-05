"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import API_BASE from "@/lib/api"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface Car {
  id: number
  brand: string
  model: string
  type?: string
  price: number
  year?: number
  fuel?: string
  image?: string
  forRent: boolean
  available: boolean
}

export default function RentalsPage() {
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem("userAuth")) {
      router.push("/auth/login")
    }
  }, [router])

  const [cars, setCars] = useState<Car[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then(r => r.json())
      .then((data: Car[]) => setCars(data.filter(c => c.forRent)))
      .catch(err => console.error("GET /cars failed:", err))
  }, [])

  const visible = cars
    .filter(c =>
      [c.brand, c.model, c.type].join(" ").toLowerCase().includes(search.toLowerCase()),
    )
    .filter(c => (filter === "all" ? true : (c.type ?? "").toLowerCase() === filter))

  const logout = () => {
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  const book = (carId: number) => router.push(`/booking/${carId}`)

  const LuxuryRideLogo = () => (
    <h1 className="text-center text-4xl font-extrabold mb-6">
      <span className="text-yellow-500">LUXURY</span>
      <span className="text-red-600 ml-2">RIDE</span>
    </h1>
  )

  return (
    <div className="min-h-screen bg-[#0c1e3d] text-white">
      <Navigation isAuthenticated onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* header */}
        <LuxuryRideLogo />
        <p className="text-center text-lg text-gray-300 mb-8">
          Find the perfect ride for your journey
        </p>

        {/* search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by brand, model or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-white/10 border border-white/20 text-white placeholder-gray-400"
            />
          </div>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/10 border border-white/20 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0c1e3d] border border-white/10 text-white">
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* catalogue */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map(car => (
            <Card
              key={`rent-${car.id}`}
              className="overflow-hidden bg-white/5 backdrop-blur border border-white/10 rounded-xl"
            >
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1 text-white">
                  {car.brand} {car.model}
                </h3>

                <p className="text-gray-300 mb-3">
                  {car.year ?? "-"} • {car.fuel ?? "-"}
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-red-500">
                      ${car.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">per day</p>
                  </div>

                  <Button
                    onClick={() => book(car.id)}
                    className="bg-red-600 hover:bg-red-700 font-bold"
                  >
                    Book now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No cars match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
