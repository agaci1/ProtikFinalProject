"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, Car, Home, Info, Phone, History, LogOut } from "lucide-react"

interface NavigationProps {
  isAuthenticated?: boolean
  isAdmin?: boolean
  onLogout?: () => void
}

export function Navigation({ isAuthenticated = false, isAdmin = false, onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const userMenuItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/purchase-history", label: "Purchase History", icon: History },
  ]

  const adminMenuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/manage-rentals", label: "Manage Rentals", icon: Car },
    { href: "/admin/manage-sales", label: "Manage Sales", icon: Car },
    { href: "/admin/purchase-history", label: "Purchase History", icon: History },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    setIsOpen(false)
  }

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/"}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AutoPrime</span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Car className="h-8 w-8 text-blue-600" />
                      <span className="text-xl font-bold">AutoPrime</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col h-full mt-8">
                    <div className="flex-1 space-y-2">
                      {menuItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => handleNavClick(item.href)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                        >
                          <item.icon className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-700">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
