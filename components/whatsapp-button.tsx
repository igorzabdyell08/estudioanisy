"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phone: string
  message: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function WhatsAppButton({ phone, message, variant = "default", size = "sm", className }: WhatsAppButtonProps) {
  const formatPhoneNumber = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, "")

    // Se não começar com 55 (código do Brasil), adiciona
    if (!cleanPhone.startsWith("55")) {
      return `55${cleanPhone}`
    }

    return cleanPhone
  }

  const handleWhatsAppClick = () => {
    const formattedPhone = formatPhoneNumber(phone)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button variant={variant} size={size} onClick={handleWhatsAppClick} className={className}>
      <MessageCircle className="w-4 h-4 mr-2" />
      WhatsApp
    </Button>
  )
}
