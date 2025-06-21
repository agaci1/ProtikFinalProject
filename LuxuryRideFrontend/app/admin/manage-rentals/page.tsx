"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"

const initialRentalCars = [
  {
    id: 1,
    name: "BMW X5",
    type: "SUV",
    price: 89,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2023,
    fuel: "Gasoline",
  },
  {
    id: 2,
    name: "Mercedes C-Class",
    type: "Sedan",
    price: 75,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2022,
    fuel: "Gasoline",
  },
  {
    id: 3,
    name: "Audi A4",
    type: "Sedan",
    price: 65,
    image: "/placeholder.svg?height=200&width=300",
    available: false,
    year: 2023,
    fuel: "Gasoline",
  },
  {
    id: 4,
    name: "Toyota Camry",
    type: "Sedan",
    price: 45,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    year: 2022,
    fuel: "Hybrid",
  },
]

export default function ManageRentalsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [cars, setCars] = useState(initialRentalCars)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    year: "",
    fuel: "",
    available: true,
  })
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/auth/admin-login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/")
  }

  const handleAddCar = () => {
    setEditingCar(null)
    setFormData({
      name: "",
      type: "",
      price: "",
      year: "",
      fuel: "",
      available: true,
    })
    setIsDialogOpen(true)
  }

  const handleEditCar = (car: any) => {
    setEditingCar(car)
    setFormData({
      name: car.name,
      type: car.type,
      price: car.price.toString(),
      year: car.year.toString(),
      fuel: car.fuel,
      available: car.available,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteCar = (carId: number) => {
    setCars(cars.filter((car) => car.id !== carId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCar) {
      // Update existing car
      setCars(
        cars.map((car) =>
          car.id === editingCar.id
            ? {
                ...car,
                name: formData.name,
                type: formData.type,
                price: Number.parseInt(formData.price),
                year: Number.parseInt(formData.year),
                fuel: formData.fuel,
                available: formData.available,
              }
            : car,
        ),
      )
    } else {
      // Add new car
      const newCar = {
        id: Math.max(...cars.map((c) => c.id)) + 1,
        name: formData.name,
        type: formData.type,
        price: Number.parseInt(formData.price),
        year: Number.parseInt(formData.year),
        fuel: formData.fuel,
        available: formData.available,
        image: "/placeholder.svg?height=200&width=300",
      }
      setCars([...cars, newCar])
    }

    setIsDialogOpen(false)
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={true} isAdmin={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Rental Cars</h1>
            <p className="text-gray-600 mt-2">Add, edit, or remove rental vehicles</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCar} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
                <DialogDescription>
                  {editingCar ? "Update the car details below." : "Add a new car to the rental fleet."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Car Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., BMW X5"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per day ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="89"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2023"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel">Fuel Type</Label>
                  <Select value={formData.fuel} onValueChange={(value) => setFormData({ ...formData, fuel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available">Availability</Label>
                  <Select
                    value={formData.available.toString()}
                    onValueChange={(value) => setFormData({ ...formData, available: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingCar ? "Update Car" : "Add Car"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={car.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{car.name}</CardTitle>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Available" : "Rented"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  {car.type} • {car.year} • {car.fuel}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-4">${car.price}/day</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditCar(car)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCar(car.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
