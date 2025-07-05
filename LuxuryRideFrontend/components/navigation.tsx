"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Menu,
  Car,
  Home,
  Info,
  Phone,
  History,
  LogOut,
} from "lucide-react"

interface NavigationProps {
  isAuthenticated?: boolean
  isAdmin?: boolean
  onLogout?: () => void
}

export function Navigation({
  isAuthenticated = false,
  isAdmin = false,
  onLogout,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  /* ---------- MENU ITEMS ---------- */
  const userMenuItems = [
    { href: "/dashboard",          label: "Home",             icon: Home },
    { href: "/about",              label: "About",            icon: Info },
    { href: "/contact",            label: "Contact",          icon: Phone },
    { href: "/purchase-history",   label: "Purchase History", icon: History },
  ]

  const adminMenuItems = [
    { href: "/admin/dashboard",        label: "Dashboard",        icon: Home },
    { href: "/admin/manage-rentals",   label: "Manage Rentals",   icon: Car  },
    { href: "/admin/manage-sales",     label: "Manage Sales",     icon: Car  },
    { href: "/admin/purchase-history", label: "Purchase History", icon: History },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  /* ---------- HANDLERS ---------- */
  const handleLogout = () => {
    localStorage.removeItem("userAuth")     // clear stored auth
    if (onLogout) onLogout()                // run parent callback (if any)
    setIsOpen(false)
    router.push("/")                        // always land on public home page
  }

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  /* ---------- LOGO ---------- */
  const LuxuryRideLogo = () => (
    <div className="flex items-center space-x-2">
      <Car className="h-8 w-8 text-yellow-500" />
      <h1 className="text-xl font-bold">
        <span className="text-yellow-500">LUXURY</span>
        <span className="text-red-600 ml-1">RIDE</span>
      </h1>
    </div>
  )

  /* ---------- RENDER ---------- */
  return (
    <nav className="bg-[#0a1f38] shadow-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href={
              isAuthenticated
                ? isAdmin
                  ? "/admin/dashboard"
                  : "/dashboard"
                : "/"
            }
            className="hover:opacity-80 transition-opacity"
          >
            <LuxuryRideLogo />
          </Link>

          {isAuthenticated && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#132a4d] text-white"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>

              {/* The `flex flex-col` makes the container fill height,
                  `overflow-y-auto` lets content scroll if needed */}
              <SheetContent
                side="right"
                className="w-80 bg-[#0a1f38] text-white flex flex-col overflow-y-auto"
              >
                {/* Header / logo */}
                <SheetHeader>
                  <SheetTitle>
                    <LuxuryRideLogo />
                  </SheetTitle>
                </SheetHeader>

                {/* Main column: menu items (scrollable) + sticky logout */}
                <div className="flex flex-col justify-between flex-1 mt-8">
                  {/* --- links --- */}
                  <div className="space-y-2">
                    {menuItems.map(({ href, label, icon: Icon }) => (
                      <button
                        key={href}
                        onClick={() => handleNavClick(href)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-yellow-500 hover:text-[#0a1f38] transition-colors w-full text-left"
                      >
                        <Icon className="h-5 w-5 text-red-500" />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* --- logout --- */}
                  <div className="border-t border-gray-600 pt-4 mt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-[#1a2b4d]"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  )
}
