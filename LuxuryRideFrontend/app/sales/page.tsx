"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

const salesCars = [
  {
    id: 1,
    name: "BMW X5",
    type: "SUV",
    price: 45000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2021,
    mileage: 25000,
    fuel: "Gasoline",
  },
  {
    id: 2,
    name: "Mercedes C-Class",
    type: "Sedan",
    price: 38000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2020,
    mileage: 32000,
    fuel: "Gasoline",
  },
  {
    id: 3,
    name: "Audi A4",
    type: "Sedan",
    price: 35000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2021,
    mileage: 28000,
    fuel: "Gasoline",
  },
  {
    id: 4,
    name: "Toyota Camry",
    type: "Sedan",
    price: 22000,
    image: "/placeholder.svg?height=200&width=300",
    available: false,
    year: 2019,
    mileage: 45000,
    fuel: "Hybrid",
  },
  {
    id: 5,
    name: "Honda CR-V",
    type: "SUV",
    price: 28000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2020,
    mileage: 35000,
    fuel: "Gasoline",
  },
  {
    id: 6,
    name: "Tesla Model 3",
    type: "Sedan",
    price: 42000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2022,
    mileage: 15000,
    fuel: "Electric",
  },
]

export default function SalesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filteredCars, setFilteredCars] = useState(salesCars)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("userAuth")
    if (!auth) {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    let filtered = salesCars.filter(
      (car) =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterType !== "all") {
      filtered = filtered.filter((car) => car.type.toLowerCase() === filterType.toLowerCase())
    }

    setFilteredCars(filtered)
  }, [searchTerm, filterType])

  const handleLogout = () => {
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  const handleBuyCar = (carId: number) => {
    // For now, show an alert. Later this can navigate to purchase page
    alert(`Purchasing car with ID: ${carId}. This will be connected to your purchase system.`)
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cars for Sale</h1>
          <p className="text-gray-600">Find your perfect car from our sales inventory</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={car.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{car.name}</h3>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Available" : "Sold"}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">
                  {car.type} • {car.year}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {car.mileage.toLocaleString()} miles • {car.fuel}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">${car.price.toLocaleString()}</p>
                  </div>
                  <Button
                    onClick={() => handleBuyCar(car.id)}
                    disabled={!car.available}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {car.available ? "Buy Now" : "Sold"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
