"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Calendar, DollarSign, Settings, TrendingUp, LogOut, Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    name: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
  },
  {
    name: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
  },
  {
    name: "Automação",
    href: "/automacao",
    icon: Settings,
  },
  {
    name: "Marketing",
    href: "/marketing",
    icon: TrendingUp,
  },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image src="/logo-anisy.png" alt="Anisy Candine Studio" fill className="object-cover" priority />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-amber-600">Studio Anisy Candine</h1>
              <p className="text-xs text-gray-500 font-medium">Especialista em Molde F1</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Anisy Candine</p>
                <p className="text-xs text-gray-500">anisy@studio.com</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/logo-anisy.png" />
                <AvatarFallback className="bg-amber-500 text-white text-xs font-semibold">AC</AvatarFallback>
              </Avatar>
            </div>

            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex h-full flex-col">
                {/* Mobile Header */}
                <div className="flex items-center gap-3 p-6 border-b">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                    <Image src="/logo-anisy.png" alt="Logo" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="font-bold text-amber-600">Studio Anisy</h2>
                    <p className="text-xs text-gray-500">Molde F1</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-amber-100 text-amber-700 shadow-soft"
                              : "text-gray-600 hover:bg-gray-50 hover:text-amber-600",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/logo-anisy.png" />
                      <AvatarFallback className="bg-amber-500 text-white">AC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Anisy Candine</p>
                      <p className="text-xs text-gray-500">anisy@studio.com</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block border-t bg-gray-50/50">
          <div className="container px-6">
            <div className="flex">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all",
                      isActive
                        ? "border-amber-500 text-amber-700 bg-amber-50"
                        : "border-transparent text-gray-600 hover:text-amber-600 hover:bg-gray-50",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all",
                  isActive ? "text-amber-600 bg-amber-50" : "text-gray-500 hover:text-amber-600 hover:bg-gray-50",
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
