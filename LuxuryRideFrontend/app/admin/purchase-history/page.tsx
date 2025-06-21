"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Car, DollarSign, User, Search, Filter } from "lucide-react"

const allTransactions = [
  {
    id: 1,
    type: "rental",
    carName: "BMW X5",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    date: "2024-01-15",
    endDate: "2024-01-20",
    amount: 445,
    status: "completed",
  },
  {
    id: 2,
    type: "purchase",
    carName: "Toyota Camry",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    date: "2023-12-10",
    amount: 22000,
    status: "completed",
  },
  {
    id: 3,
    type: "rental",
    carName: "Mercedes C-Class",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    date: "2024-01-25",
    endDate: "2024-01-28",
    amount: 225,
    status: "active",
  },
  {
    id: 4,
    type: "purchase",
    carName: "Honda CR-V",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    date: "2024-01-20",
    amount: 28000,
    status: "completed",
  },
  {
    id: 5,
    type: "rental",
    carName: "Audi A4",
    customerName: "David Brown",
    customerEmail: "david@example.com",
    date: "2024-01-30",
    endDate: "2024-02-05",
    amount: 390,
    status: "active",
  },
]

export default function AdminPurchaseHistoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [transactions, setTransactions] = useState(allTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/auth/admin-login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    let filtered = allTransactions.filter(
      (transaction) =>
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterType !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === filterType)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((transaction) => transaction.status === filterStatus)
    }

    setTransactions(filtered)
  }, [searchTerm, filterType, filterStatus])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/")
  }

  const getTotalRevenue = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0)
  }

  const getCompletedTransactions = () => {
    return transactions.filter((t) => t.status === "completed").length
  }

  const getActiveRentals = () => {
    return transactions.filter((t) => t.type === "rental" && t.status === "active").length
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={true} isAdmin={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase History</h1>
          <p className="text-gray-600">View all customer transactions and rental history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalRevenue().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From all transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedTransactions()}</div>
              <p className="text-xs text-muted-foreground">Completed transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getActiveRentals()}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by customer name, email, or car..."
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
              <SelectItem value="rental">Rentals</SelectItem>
              <SelectItem value="purchase">Purchases</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {transaction.carName}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={
                        transaction.type === "rental" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
                      }
                    >
                      {transaction.type === "rental" ? "Rental" : "Purchase"}
                    </Badge>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{transaction.customerName}</p>
                      <p className="text-sm text-gray-500">{transaction.customerEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                        {transaction.endDate && ` - ${new Date(transaction.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-lg">${transaction.amount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-end">
                    {transaction.status === "active" && transaction.type === "rental" && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Ongoing Rental
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No transactions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
