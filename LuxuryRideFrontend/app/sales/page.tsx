"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import API_BASE from "@/lib/api"
import PurchaseForm from "@/components/PurchaseForm"

interface Car {
  id: number
  brand: string
  model: string
  type?: string
  price: number
  available: boolean
  year?: number
  fuel?: string
  mileage?: number
  image?: string
  forSale: boolean
}

export default function SalesPage() {
  const router = useRouter()

  const [auth, setAuth] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem("userAuth")) router.push("/auth/login")
    else setAuth(true)
  }, [router])

  const [cars, setCars] = useState<Car[]>([])
  const [filtered, setFiltered] = useState<Car[]>([])
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then(r => r.json())
      .then((data: Car[]) => {
        const forSaleCars = data.filter(c => c.forSale)
        setCars(forSaleCars)
        setFiltered(forSaleCars)
      })
      .catch(err => console.error("Could not load cars", err))
  }, [])

  useEffect(() => {
    let list = cars.filter(c =>
      [c.brand, c.model, c.type].join(" ").toLowerCase().includes(search.toLowerCase())
    )
    if (filterType !== "all")
      list = list.filter(c => (c.type ?? "").toLowerCase() === filterType)
    setFiltered(list)
  }, [search, filterType, cars])

  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<number | null>(null)
  const openPurchase = (id: number) => {
    setCurrent(id)
    setOpen(true)
  }

  const logout = () => {
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  if (!auth) return null

  return (
    <div className="min-h-screen bg-[#0a1f38] text-white">
      <Navigation isAuthenticated onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-yellow-500">
            LUXURY <span className="text-red-600">RIDE</span>
          </h1>
          <p className="text-gray-300">Find your perfect car</p>
        </header>

        {/* search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-500" />
            <Input
              placeholder="Search by brand, model or type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-md bg-[#1a2e50] text-white border border-yellow-500 placeholder:text-gray-400 focus-visible:ring-yellow-500"
            />
          </div>

          {/* filter select */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48 rounded-md bg-[#1a2e50] border border-yellow-500 text-yellow-500">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2e50] text-yellow-500 border border-yellow-500">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* catalogue */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(car => (
            <Card key={car.id} className="bg-[#112446] rounded-xl border border-yellow-500 shadow-md overflow-hidden">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6 text-white">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-semibold text-yellow-400 capitalize">
                    {car.brand} {car.model}
                  </h3>
                  <Badge className={car.available ? "bg-green-600" : "bg-red-600"}>
                    {car.available ? "Available" : "Sold"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-400 mb-1">
                  {car.type ?? "-"} • {car.year ?? "-"} • {car.fuel ?? "-"}
                </p>
                {typeof car.mileage === "number" && (
                  <p className="text-sm text-gray-500">{car.mileage.toLocaleString()} miles</p>
                )}

                <div className="flex justify-between items-center mt-4">
                  <p className="text-2xl font-bold text-yellow-500">
                    ${car.price.toLocaleString()}
                  </p>
                  <Button
                    disabled={!car.available}
                    onClick={() => openPurchase(car.id)}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      car.available
                        ? "bg-yellow-500 text-[#112446] hover:bg-yellow-400"
                        : "bg-gray-600 text-white opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {car.available ? "Buy now" : "Sold"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No cars match your criteria.</p>
          </div>
        )}
      </div>

      {open && current !== null && (
        <PurchaseForm carId={current} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
