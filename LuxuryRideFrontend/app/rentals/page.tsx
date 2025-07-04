"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Navigation }   from "@/components/navigation";
import { Button }       from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input }        from "@/components/ui/input";
import API_BASE         from "@/lib/api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface Car {
  id:       number;
  brand:    string;
  model:    string;
  type?:    string;
  price:    number;
  year?:    number;
  fuel?:    string;
  image?:   string;

  /* ↓ categorisation flags coming from backend */
  forRent:  boolean;
  available:boolean;        // we _ignore_ this for rentals – server will decide on conflict
}

export default function RentalsPage() {
  const router = useRouter();

  /* ───────────────────────── auth gate ───────────────────────── */
  useEffect(() => {
    if (!localStorage.getItem("userAuth")) {
      router.push("/auth/login");
    }
  }, [router]);

  /* ───────────────────────── state ───────────────────────── */
  const [cars,   setCars]   = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ─────────────────────── initial fetch ─────────────────────── */
  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then(r => r.json())
      .then((data: Car[]) =>
        setCars(data.filter(c => c.forRent))               // only rentals
      )
      .catch(err => console.error("GET /cars failed:", err));
  }, []);

  /* ─────────────────────── derived list ─────────────────────── */
  const visible = cars
    .filter(c =>
      [c.brand, c.model, c.type].join(" ").toLowerCase().includes(search.toLowerCase())
    )
    .filter(c => (filter === "all" ? true : (c.type ?? "").toLowerCase() === filter));

  /* ───────────────────────── helpers ───────────────────────── */
  const logout = () => {
    localStorage.removeItem("userAuth");
    router.push("/");
  };

  const book = (carId: number) => {
    router.push(`/booking/${carId}`);
  };

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Car&nbsp;Rentals</h1>
          <p className="text-gray-600">Find the perfect ride</p>
        </header>

        {/* search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cars..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
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
            <Card key={`rent-${car.id}`} className="overflow-hidden hover:shadow-lg">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1">
                  {car.brand} {car.model}
                </h3>

                <p className="text-gray-600 mb-2">
                  {car.year ?? "-"} • {car.fuel ?? "-"}
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      ${car.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">per day</p>
                  </div>

                  {/* 🚗 ALWAYS allow booking – backend will reject conflicting dates */}
                  <Button onClick={() => book(car.id)}>
                    Book now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cars match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
