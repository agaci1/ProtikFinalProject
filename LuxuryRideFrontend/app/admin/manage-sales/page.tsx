"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API_BASE from "@/lib/api";

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
  forSale: boolean;
}

export default function ManageSalesPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isDialogOpen, setOpen] = useState(false);
  const [editingCar, setEditing] = useState<Car | null>(null);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    type: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    available: "true",
  });

  /* -------------------------------- load list -------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cars`);
        const data = (await res.json()) as Car[];
        setCars(data.filter((c) => c.forSale));
      } catch (e) {
        console.error("Error loading cars", e);
      }
    })();
  }, []);

  /* ------------------------------ helpers ------------------------------ */
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
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (car: Car) => {
    setEditing(car);
    setForm({
      brand: car.brand,
      model: car.model,
      type: car.type ?? "",
      price: car.price.toString(),
      year: car.year?.toString() ?? "",
      mileage: car.mileage?.toString() ?? "",
      fuel: car.fuel ?? "",
      available: car.available ? "true" : "false",
    });
    setOpen(true);
  };

  /* -------------------------------- delete -------------------------------- */
  const remove = async (id: number) => {
    if (!confirm("Delete this car?")) return;
    try {
      await fetch(`${API_BASE}/api/cars/${id}`, { method: "DELETE" });
      setCars((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  /* -------------------------------- save -------------------------------- */
  const save = async (e: FormEvent) => {
    e.preventDefault();

    const payload: Partial<Car> = {
      brand: form.brand,
      model: form.model,
      type: form.type,
      price: Number(form.price || 0),
      year: form.year ? Number(form.year) : undefined,
      mileage: form.mileage ? Number(form.mileage) : undefined,
      fuel: form.fuel,
      available: form.available === "true",
      image: "/placeholder.svg",
      forSale: true,
    };

    try {
      if (editingCar) {
        /* UPDATE */
        const res = await fetch(`${API_BASE}/api/cars/${editingCar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        /* CREATE */
        const res = await fetch(`${API_BASE}/api/cars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setCars((prev) => [...prev, created]);
      }
      setOpen(false);
    } catch (err) {
      console.error("Save error", err);
    }
  };

  /* -------------------------------- UI -------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated isAdmin />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Sales Cars</h1>

          <Dialog open={isDialogOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAdd}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCar ? "Edit Car" : "Add New Car"}
                </DialogTitle>
                <DialogDescription>
                  {editingCar
                    ? "Update car details."
                    : "Enter details for the new car."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={save} className="space-y-4">
                {/* Brand / Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <Input
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm({ ...form, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price / Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={form.year}
                      onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Mileage */}
                <div className="space-y-2">
                  <Label>Mileage</Label>
                  <Input
                    type="number"
                    value={form.mileage}
                    onChange={(e) =>
                      setForm({ ...form, mileage: e.target.value })
                    }
                  />
                </div>

                {/* Fuel */}
                <div className="space-y-2">
                  <Label>Fuel</Label>
                  <Select
                    value={form.fuel}
                    onValueChange={(value) =>
                      setForm({ ...form, fuel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select
                    value={form.available}
                    onValueChange={(v) =>
                      setForm({ ...form, available: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {editingCar ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* list */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card
              key={car.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {car.brand} {car.model}
                  </CardTitle>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Available" : "Sold"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-1">
                  {car.type || "Type N/A"} • {car.year ?? "Year N/A"} •{" "}
                  {car.fuel || "Fuel N/A"}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {car.mileage !== undefined
                    ? `${car.mileage.toLocaleString()} miles`
                    : "Mileage N/A"}
                </p>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  ${car.price.toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(car)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => remove(car.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
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
