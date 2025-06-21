"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, DollarSign } from "lucide-react"

const purchaseHistory = [
  {
    id: 1,
    type: "rental",
    carName: "BMW X5",
    date: "2024-01-15",
    endDate: "2024-01-20",
    amount: 445,
    status: "completed",
  },
  {
    id: 2,
    type: "purchase",
    carName: "Toyota Camry",
    date: "2023-12-10",
    amount: 22000,
    status: "completed",
  },
  {
    id: 3,
    type: "rental",
    carName: "Mercedes C-Class",
    date: "2024-01-25",
    endDate: "2024-01-28",
    amount: 225,
    status: "active",
  },
]

export default function PurchaseHistoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("userAuth")
    if (!auth) {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userAuth")
    router.push("/")
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={true} onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase History</h1>
          <p className="text-gray-600">View your rental and purchase history</p>
        </div>

        <div className="space-y-6">
          {purchaseHistory.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {transaction.carName}
                  </CardTitle>
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                    {transaction.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        transaction.type === "rental" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
                      }
                    >
                      {transaction.type === "rental" ? "Rental" : "Purchase"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                      {transaction.endDate && ` - ${new Date(transaction.endDate).toLocaleDateString()}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">${transaction.amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {purchaseHistory.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No purchase history found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
