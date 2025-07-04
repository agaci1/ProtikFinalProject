"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import API_BASE from "@/lib/api";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Car {
  id: number;
  brand: string;
  model: string;
  type?: string;
  price: number;
  available: boolean;
  year?: number;
  mileage?: number;
  fuel?: string;
  image?: string;
  forRent: boolean;
}

type FormState = {
  brand: string;
  model: string;
  type: string;
  price: string;
  year: string;
  mileage: string;
  fuel: string;
  available: "true" | "false";
};

export default function ManageRentalsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [form, setForm] = useState<FormState>({
    brand: "",
    model: "",
    type: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    available: "true",
  });

  console.log("API_BASE = ", API_BASE);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/auth/admin-login");
      return;
    }

    fetch(`${API_BASE}/api/cars`)
      .then(r => r.json())
      .then((data: Car[]) =>
        setCars(data.filter(c => c.forRent))
      )
      .catch(err => console.error("GET /api/cars failed:", err));
  }, [router]);

  const resetForm = () =>
    setForm({
      brand: "",
      model: "",
      type: "",
      price: "",
      year: "",
      mileage: "",
      fuel: "",
      available: "true",
    });

  const openAdd = () => {
    setEditingCar(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (car: Car) => {
    setEditingCar(car);
    setForm({
      brand: car.brand,
      model: car.model,
      type: car.type ?? "",
      price: car.price?.toString() ?? "",
      year: car.year?.toString() ?? "",
      mileage: car.mileage?.toString() ?? "",
      fuel: car.fuel ?? "",
      available: car.available ? "true" : "false",
    });
    setDialogOpen(true);
  };

  const deleteCar = async (id: number) => {
    if (!confirm("Delete this car?")) return;
    await fetch(`${API_BASE}/api/cars/${id}`, { method: "DELETE" });
    setCars(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      brand: form.brand,
      model: form.model,
      type: form.type || undefined,
      price: Number(form.price),
      year: form.year ? Number(form.year) : undefined,
      mileage: form.mileage ? Number(form.mileage) : undefined,
      fuel: form.fuel || undefined,
      available: form.available === "true",
      image: "/placeholder.svg",
      forRent: true,
    };

    if (editingCar) {
      const res = await fetch(`${API_BASE}/api/cars/${editingCar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated: Car = await res.json();
      setCars(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    } else {
      const res = await fetch(`${API_BASE}/api/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created: Car = await res.json();
      setCars(prev => [...prev, created]);
    }

    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated isAdmin />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Rental Cars</h1>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCar ? "Edit car" : "Add car"}</DialogTitle>
                <DialogDescription>
                  Fill in the rental-car details
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Brand</Label>
                    <Input
                      value={form.brand}
                      onChange={e => setForm({ ...form, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Model</Label>
                    <Input
                      value={form.model}
                      onChange={e => setForm({ ...form, model: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={v => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price / day ($)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={form.year}
                      onChange={e => setForm({ ...form, year: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Mileage</Label>
                  <Input
                    type="number"
                    value={form.mileage}
                    onChange={e => setForm({ ...form, mileage: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Fuel</Label>
                  <Select
                    value={form.fuel}
                    onValueChange={v => setForm({ ...form, fuel: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Availability</Label>
                  <Select
                    value={form.available}
                    onValueChange={v => setForm({ ...form, available: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCar ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <Card key={car.id} className="overflow-hidden">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>
                    {car.brand} {car.model}
                  </CardTitle>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Available" : "Rented"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {car.type} • {car.year ?? "-"} • {car.fuel ?? "-"}
                </p>
                <p className="text-blue-600 font-bold text-xl">
                  ${car.price}/day
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => openEdit(car)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => deleteCar(car.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
