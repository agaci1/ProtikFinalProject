"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import API_BASE from "@/lib/api";
import PurchaseForm from "@/components/PurchaseForm";

interface Car {
  id: number;
  brand: string;
  model: string;
  type?: string;
  price: number;
  available: boolean;   // flips to false when bought
  year?: number;
  fuel?: string;
  mileage?: number;
  image?: string;
  forSale: boolean;     // stays true – it’s still a sales item
}

export default function SalesPage() {
  const router = useRouter();

  /* ───────────── auth ───────────── */
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("userAuth")) router.push("/auth/login");
    else setAuth(true);
  }, [router]);

  /* ───────────── data ───────────── */
  const [cars, setCars] = useState<Car[]>([]);
  const [filtered, setFiltered] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then(r => r.json())
      // keep the whole sales catalogue – even already sold ones
      .then((data: Car[]) => {
        setCars(data);          // ⇦ NO .filter(c => c.forSale)
        setFiltered(data);
      })
      .catch(err => console.error("Could not load cars", err));
  }, []);

  /* refilter whenever search / type / cars change */
  useEffect(() => {
    let list = cars.filter(c =>
      [c.brand, c.model, c.type].join(" ").toLowerCase().includes(search.toLowerCase())
    );
    if (filterType !== "all")
      list = list.filter(c => (c.type ?? "").toLowerCase() === filterType);
    setFiltered(list);
  }, [search, filterType, cars]);

  /* ────────── purchase modal ────────── */
  const [open, setOpen]     = useState(false);
  const [current, setCurr]  = useState<number | null>(null);
  const openPurchase = (id: number) => { setCurr(id); setOpen(true); };

  /* ────────── helpers ────────── */
  const logout = () => {
    localStorage.removeItem("userAuth");
    router.push("/");
  };

  if (!auth) return null;

  /* ────────── UI ────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cars&nbsp;for&nbsp;Sale</h1>
          <p className="text-gray-600">Find your perfect car</p>
        </header>

        {/* search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cars…"
              value={search}
              onChange={e => setSearch(e.target.value)}
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
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* catalogue */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(car => (
            <Card key={`sale-${car.id}`} className="overflow-hidden hover:shadow-lg">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-semibold">
                    {car.brand} {car.model}
                  </h3>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Available" : "Sold"}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-1">
                  {car.type ?? "-"} • {car.year ?? "-"} • {car.fuel ?? "-"}
                </p>
                {typeof car.mileage === "number" && (
                  <p className="text-sm text-gray-500 mb-2">
                    {car.mileage.toLocaleString()} miles
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-green-600">
                    ${car.price.toLocaleString()}
                  </p>
                  <Button
                    disabled={!car.available}
                    onClick={() => openPurchase(car.id)}
                    className="bg-green-600 hover:bg-green-700"
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
            <p className="text-gray-500 text-lg">No cars match your criteria.</p>
          </div>
        )}
      </div>

      {open && current !== null && (
        <PurchaseForm carId={current} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
