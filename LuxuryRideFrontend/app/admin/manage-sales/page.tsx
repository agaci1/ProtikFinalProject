"use client"

import { useEffect, useState, FormEvent } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import API_BASE from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"

/* -------------------------------------------------------------------------- */
/* Types -------------------------------------------------------------------- */
interface Car {
  id: number
  brand: string
  model: string
  type?: string
  price: number
  available: boolean
  year?: number
  mileage?: number
  fuel?: string
  image?: string
  forSale: boolean
}

/* -------------------------------------------------------------------------- */
export default function ManageSalesPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)

  const blankForm = {
    brand: "",
    model: "",
    type: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    available: "true",
    image: "",
  }
  const [form, setForm] = useState({ ...blankForm })

  /* ---------------------------- load list -------------------------------- */
  useEffect(() => {
    ;(async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/cars`)
        const data = (await res.json()) as Car[]
        setCars(data.filter((c) => c.forSale))
      } catch (e) {
        console.error("Error loading cars", e)
      }
    })()
  }, [])

  /* -------------------------- helpers ----------------------------------- */
  const resetForm = () => setForm({ ...blankForm })

  /** open empty form for a brand-new car */
  const openAdd = () => {
    setEditingCar(null)
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (car: Car) => {
    setEditingCar(car)
    setForm({
      brand:   car.brand,
      model:   car.model,
      type:    car.type ?? "",
      price:   car.price.toString(),
      year:    car.year?.toString() ?? "",
      mileage: car.mileage?.toString() ?? "",
      fuel:    car.fuel ?? "",
      available: car.available ? "true" : "false",
      image:   car.image ?? "",
    })
    setDialogOpen(true)
  }

  /* ---------------------------- delete ---------------------------------- */
  const remove = async (id: number) => {
    if (!confirm("Delete this car?")) return
    await fetch(`${API_BASE}/api/cars/${id}`, { method: "DELETE" })
    setCars((prev) => prev.filter((c) => c.id !== id))
  }

  /* ----------------------------- save ----------------------------------- */
  const save = async (e: FormEvent) => {
    e.preventDefault()

    const payload: Partial<Car> = {
      brand: form.brand,
      model: form.model,
      type:  form.type || undefined,
      price: Number(form.price || 0),
      year:  form.year ? Number(form.year) : undefined,
      mileage: form.mileage ? Number(form.mileage) : undefined,
      fuel:  form.fuel || undefined,
      available: form.available === "true",
      image: form.image || "/placeholder.svg",
      forSale: true,
    }

    if (editingCar) {
      const res = await fetch(`${API_BASE}/api/cars/${editingCar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const updated = await res.json()
      setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    } else {
      const res = await fetch(`${API_BASE}/api/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const created = await res.json()
      setCars((prev) => [...prev, created])
    }

    /* close & clear */
    setDialogOpen(false)
    setEditingCar(null)
    resetForm()
  }

  /* ------------------------------ UI ------------------------------------ */
  return (
    <div className="min-h-screen bg-[#0a1f38] text-white">
      <Navigation isAuthenticated isAdmin />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-yellow-500">
            Manage Sales Cars
          </h1>

          {/* ── ADD NEW CAR BUTTON ─────────────────────────────────────── */}
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) {
              setEditingCar(null)
              resetForm()
            }
          }}>
            <DialogTrigger asChild>
              {/* call openAdd so the form is always blank */}
              <Button
                onClick={openAdd}
                className="bg-yellow-500 text-[#0a1f38] hover:bg-yellow-400"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Car
              </Button>
            </DialogTrigger>

            {/* ---------- dialog ---------- */}
            <DialogContent className="sm:max-w-[430px] bg-[#1e355c] text-white">
              <DialogHeader>
                <DialogTitle className="text-yellow-500">
                  {editingCar ? "Edit Car" : "Add New Car"}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {editingCar ? "Update car details." : "Enter details for the new car."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={save} className="space-y-4">
                {/* Brand / Model */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
                  <FormInput label="Model" value={form.model} onChange={(v) => setForm({ ...form, model: v })} />
                </div>

                {/* Image URL */}
                <FormInput
                  label="Image URL"
                  value={form.image}
                  onChange={(v) => setForm({ ...form, image: v })}
                  placeholder="Paste link (Unsplash, etc.)"
                />

                {/* Type */}
                <SelectField
                  label="Type"
                  value={form.type}
                  onChange={(v) => setForm({ ...form, type: v })}
                  options={["Sedan", "SUV", "Hatchback", "Coupe"]}
                />

                {/* Price / Year */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Price ($)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
                  <FormInput label="Year" type="number" value={form.year} onChange={(v) => setForm({ ...form, year: v })} />
                </div>

                {/* Mileage */}
                <FormInput label="Mileage" type="number" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: v })} />

                {/* Fuel */}
                <SelectField
                  label="Fuel"
                  value={form.fuel}
                  onChange={(v) => setForm({ ...form, fuel: v })}
                  options={["Gasoline", "Diesel", "Hybrid", "Electric"]}
                />

                {/* Availability */}
                <SelectField
                  label="Availability"
                  value={form.available}
                  onChange={(v) => setForm({ ...form, available: v })}
                  options={[
                    { label: "Available", value: "true" },
                    { label: "Sold", value: "false" },
                  ]}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-[#0a1f38]"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-yellow-500 text-[#0a1f38] hover:bg-yellow-400">
                    {editingCar ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* ---------- grid ---------- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="bg-[#1e355c] text-white">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-yellow-500">
                    {car.brand} {car.model}
                  </CardTitle>
                  <Badge className={car.available ? "bg-green-600" : "bg-red-600"}>
                    {car.available ? "Available" : "Sold"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-1">
                  {car.type || "Type N/A"} • {car.year ?? "Year N/A"} • {car.fuel || "Fuel N/A"}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  {car.mileage !== undefined ? `${car.mileage.toLocaleString()} miles` : "Mileage N/A"}
                </p>
                <p className="text-2xl font-bold text-yellow-500 mb-4">
                  ${car.price.toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(car)}
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-[#0a1f38]"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(car.id)}
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
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
  )
}

/* ----------------------- helper form components ------------------------- */
function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-yellow-500">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1e355c] text-white placeholder:text-gray-400 border border-gray-600 focus-visible:ring-yellow-500"
        required={["Brand", "Model", "Price ($)"].includes(label)}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[] | { label: string; value: string }[]
}) {
  const opts =
    typeof options[0] === "string"
      ? (options as string[]).map((o) => ({ label: o, value: o }))
      : (options as { label: string; value: string }[])
  return (
    <div className="space-y-2">
      <Label className="text-yellow-500">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#1e355c] text-white border border-gray-600">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-[#1e355c] text-white">
          {opts.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
