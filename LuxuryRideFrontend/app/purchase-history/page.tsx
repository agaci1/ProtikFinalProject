"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Navigation } from "@/components/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, DollarSign, X } from "lucide-react"
import API_BASE from "@/lib/api"

type Transaction = {
  id: number
  type: "purchase" | "rental"
  carName: string
  date: string
  endDate?: string
  amount: number
  status: "completed" | "pending"
}

export default function PurchaseHistoryPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [items, setItems] = useState<Transaction[]>([])

  useEffect(() => {
    if (!localStorage.getItem("userAuth")) {
      router.push("/auth/login")
    } else {
      setReady(true)
    }
  }, [router])

  useEffect(() => {
    if (!ready) return

    ;(async () => {
      const email = localStorage.getItem("userEmail")
      if (!email) return

      try {
        const res = await fetch(`${API_BASE}/api/purchases/history/${email}`)
        if (!res.ok) throw new Error(await res.text())

        const payload = await res.json()

        const purchases: Transaction[] = (payload.purchases ?? []).map((p: any) => ({
          id: p.id,
          type: "purchase",
          carName: `${p.car.brand} ${p.car.model}`,
          date: p.purchaseDate,
          amount: p.amount,
          status: "completed",
        }))

        const rentals: Transaction[] = (payload.reservations ?? []).map((r: any) => ({
          id: r.id,
          type: "rental",
          carName: `${r.car.brand} ${r.car.model}`,
          date: r.startDate,
          endDate: r.endDate,
          amount: r.totalPrice,
          status: new Date(r.endDate) < new Date() ? "completed" : "pending",
        }))

        setItems([...purchases, ...rentals].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)))
      } catch (err) {
        console.error("⚠️ Failed to load history:", err)
      }
    })()
  }, [ready])

  const cancelRental = async (id: number) => {
    if (!confirm("Cancel this rental?")) return
    try {
      const res = await fetch(`${API_BASE}/api/reservations/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      setItems(prev => prev.filter(t => t.id !== id))
    } catch {
      alert("Cancel failed — please try again.")
    }
  }

  const logout = () => {
    localStorage.clear()
    router.push("/")
  }

  if (!ready) return null

  const LuxuryRideLogo = () => (
    <h1 className="text-center text-4xl font-extrabold mb-6">
      <span className="text-yellow-500">LUXURY</span>
      <span className="text-red-600 ml-2">RIDE</span>
    </h1>
  )

  return (
    <div className="min-h-screen bg-[#0c1e3d] text-white">
      <Navigation isAuthenticated onLogout={logout} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <LuxuryRideLogo />
        <p className="text-center text-lg text-gray-300 mb-8">
          All your completed and upcoming transactions
        </p>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {items.map(t => (
              <Card
                key={`${t.type}-${t.id}`}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-xl text-white font-semibold">
                      <Car className="h-5 w-5 text-yellow-400" />
                      {t.carName}
                    </CardTitle>
                    <Badge
                      className={`px-3 py-0.5 rounded-full text-xs ${
                        t.status === "completed"
                          ? "bg-green-600"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {t.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="text-gray-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      icon={Calendar}
                      label={`From: ${new Date(t.date).toLocaleDateString()}`}
                      sub={
                        t.endDate
                          ? `To: ${new Date(t.endDate).toLocaleDateString()}`
                          : undefined
                      }
                    />
                    <Field
                      icon={DollarSign}
                      label={`$${t.amount.toLocaleString()}`}
                    />
                  </div>

                  {t.type === "rental" && t.status === "pending" && (
                    <button
                      onClick={() => cancelRental(t.id)}
                      className="mt-4 text-red-500 hover:underline flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Cancel Rental
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  icon: Icon,
  label,
  sub,
}: { icon: any; label: string; sub?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-yellow-400" />}
        <span className="font-medium text-white">{label}</span>
      </div>
      {sub && <span className="text-sm text-gray-400">{sub}</span>}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Car className="h-16 w-16 text-gray-500 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">No history found.</p>
    </div>
  )
}
