"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("userAuth", "true")
        router.push("/dashboard")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1e3d] px-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Car className="h-12 w-12 text-yellow-400" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-yellow-500">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to your LuxuryRide account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/auth/admin-login" className="text-sm text-yellow-400 hover:underline">
              Login as Admin
            </Link>
            <div>
              <Link href="/" className="text-sm text-gray-400 hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
