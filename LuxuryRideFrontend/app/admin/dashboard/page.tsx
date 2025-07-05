"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Car,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react"

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1f38] text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1f38] text-white">
      <Navigation isAuthenticated={true} isAdmin={true} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-yellow-500">Admin Dashboard</h1>
          <p className="text-gray-300 mt-2">
            Manage your car rental and sales business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#132a4d] text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <Car className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-gray-400">+12 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#132a4d] text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Calendar className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-gray-400">+3 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-[#132a4d] text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-gray-400">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#132a4d] text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-gray-400">+15 new this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-[#1e355c] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-6 w-6 text-blue-400" />
                Manage Rentals
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add, edit, or remove rental vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-400 text-[#0a1f38]">
                <Link href="/admin/manage-rentals">Manage Rental Cars</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1e355c] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-400" />
                Manage Sales
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add, edit, or remove cars for sale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-400 text-[#0a1f38]">
                <Link href="/admin/manage-sales">Manage Sales Cars</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1e355c] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-400" />
                Purchase History
              </CardTitle>
              <CardDescription className="text-gray-400">
                View all customer transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-400 text-[#0a1f38]">
                <Link href="/admin/purchase-history">View All Transactions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
