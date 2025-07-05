"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Calendar,
  Car,
  DollarSign,
  Search,
  User,
} from "lucide-react"
import API_BASE from "@/lib/api"

/* -------------------------------------------------------------------------- */
/* Types -------------------------------------------------------------------- */
interface TransactionDTO {
  id: number
  type: "rental" | "purchase"
  carName: string
  customerName: string
  customerEmail: string
  date: string
  endDate?: string
  amount: number
  status: "pending" | "active" | "completed"
}

/* -------------------------------------------------------------------------- */
/* Page --------------------------------------------------------------------- */
export default function AdminPurchaseHistoryPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  /* auth gate -------------------------------------------------------------- */
  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/auth/admin-login")
    } else {
      setReady(true)
    }
  }, [router])

  /* data/state ------------------------------------------------------------- */
  const [all,     setAll]     = useState<TransactionDTO[]>([])
  const [visible, setVisible] = useState<TransactionDTO[]>([])
  const [search,  setSearch]  = useState("")
  const [filterType,   setType]   = useState<"all"|"rental"|"purchase">("all")
  const [filterStatus, setStatus] = useState<"all"|"pending"|"completed">("all")

  useEffect(() => {
    if (!ready) return
    async function load() {
      try {
        const [rRes, pRes] = await Promise.all([
          fetch(`${API_BASE}/api/reservations`),
          fetch(`${API_BASE}/api/purchases`),
        ])
        const rentalsRaw   = await rRes.json()
        const purchasesRaw = await pRes.json()

        const rentals: TransactionDTO[] = rentalsRaw.map((r: any) => ({
          id: r.id,
          type: "rental",
          carName: `${r.car.brand} ${r.car.model}`,
          customerName: r.customerName,
          customerEmail: r.customerEmail,
          date: r.startDate,
          endDate: r.endDate,
          amount: r.totalPrice,
          status: new Date(r.endDate) < new Date() ? "completed" : "pending",
        }))

        const purchases: TransactionDTO[] = purchasesRaw.map((p: any) => ({
          id: p.id + 100_000,
          type: "purchase",
          carName: `${p.car.brand} ${p.car.model}`,
          customerName: p.customerName,
          customerEmail: p.customerEmail,
          date: p.purchaseDate,
          amount: p.amount,
          status: "completed",
        }))

        const combined = [...rentals, ...purchases].sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        )
        setAll(combined)
        setVisible(combined)
      } catch (err) {
        console.error("⚠️ Failed loading transactions:", err)
      }
    }
    load()
  }, [ready])

  /* filtering -------------------------------------------------------------- */
  useEffect(() => {
    let list = [...all]
    if (filterType   !== "all") list = list.filter(t => t.type   === filterType)
    if (filterStatus !== "all") list = list.filter(t => t.status === filterStatus)

    if (search.trim() !== "") {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.customerName.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q) ||
        t.carName.toLowerCase().includes(q)
      )
    }
    setVisible(list)
  }, [search, filterType, filterStatus, all])

  /* derived stats ---------------------------------------------------------- */
  const totalRevenue  = visible.reduce((sum, t) => sum + t.amount, 0)
  const completedCnt  = visible.filter(t => t.status === "completed").length
  const activeRentals = visible.filter(
    t => t.type === "rental" && t.status === "pending"
  ).length

  if (!ready) return null

  /* ------------------------------------------------------------------------ */
  /* UI --------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0a1f38] text-white">
      <Navigation
        isAuthenticated
        isAdmin
        onLogout={() => {
          localStorage.removeItem("adminAuth")
          router.push("/")
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2 text-yellow-500">
          Admin Transaction History
        </h1>
        <p className="text-white mb-6">
          Review and filter all rentals and sales
        </p>

        {/* stats ------------------------------------------------------------ */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Revenue"   icon={DollarSign} value={`$${totalRevenue.toLocaleString()}`} />
          <StatCard title="Completed"       icon={Calendar}   value={completedCnt} />
          <StatCard title="Active Rentals"  icon={Car}        value={activeRentals} />
        </div>

        {/* search / filters ------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchInput value={search} onChange={setSearch} />
          <TypeSelect   value={filterType}   onChange={setType} />
          <StatusSelect value={filterStatus} onChange={setStatus} />
        </div>

        {/* list ------------------------------------------------------------- */}
        {visible.length === 0
          ? <EmptyState msg="No transactions match your criteria." />
          : <TransactionList transactions={visible} />}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Reusable components ------------------------------------------------------ */
function StatCard({ title, icon: Icon, value }: { title: string; icon: any; value: any }) {
  return (
    <Card className="bg-[#132a4d]">
      <CardHeader className="flex justify-between items-center pb-2 text-white">
        <CardTitle className="text-sm font-bold text-red-500">{title}</CardTitle>
        <Icon className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-yellow-500">{value}</div>
      </CardContent>
    </Card>
  )
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 flex-grow bg-[#1e355c] px-3 py-1 rounded">
      <Search className="h-5 w-5 text-yellow-500" />
      <Input
        placeholder="Search customer, email, or car"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-400"
      />
    </div>
  )
}

/* --- filter selects ------------------------------------------------------ */
function TypeSelect({
  value,
  onChange,
}: {
  value: "all" | "rental" | "purchase"
  onChange: (v: "all" | "rental" | "purchase") => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-40 bg-[#1e355c] border border-yellow-500 text-yellow-500">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent className="bg-[#1e355c] text-yellow-500 border border-yellow-500">
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="rental">Rentals</SelectItem>
        <SelectItem value="purchase">Purchases</SelectItem>
      </SelectContent>
    </Select>
  )
}

function StatusSelect({
  value,
  onChange,
}: {
  value: "all" | "pending" | "completed"
  onChange: (v: "all" | "pending" | "completed") => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-40 bg-[#1e355c] border border-yellow-500 text-yellow-500">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent className="bg-[#1e355c] text-yellow-500 border border-yellow-500">
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  )
}

/* --- transaction list --------------------------------------------------- */
function TransactionList({ transactions }: { transactions: TransactionDTO[] }) {
  return (
    <div className="space-y-4">
      {transactions.map((t) => (
        <Card key={`${t.type}-${t.id}`} className="bg-[#1e355c] hover:shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <Car className="h-5 w-5" />
                {t.carName}
              </CardTitle>
              <Badge className={`text-white ${t.status === "completed" ? "bg-green-600" : "bg-red-600"}`}>
                {t.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Field icon={User} label={t.customerName} sub={t.customerEmail} />
              <Field
                icon={Calendar}
                label={new Date(t.date).toLocaleDateString()}
                sub={t.endDate ? new Date(t.endDate).toLocaleDateString() : undefined}
              />
              <Field icon={DollarSign} label={`$${t.amount.toLocaleString()}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Field({ icon: Icon, label, sub }: { icon: any; label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-yellow-500" />
      <span className="font-medium">{label}</span>
      {sub && <span className="text-sm text-red-500">— {sub}</span>}
    </div>
  )
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="text-center py-12">
      <Car className="h-16 w-16 text-gray-500 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">{msg}</p>
    </div>
  )
}
