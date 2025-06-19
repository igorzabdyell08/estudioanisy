"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, Users, TrendingUp, Clock, Plus, ArrowRight, Star } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5))
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false)
  const { toast } = useToast()

  // Estados para formulários
  const [clientFormData, setClientFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    notes: "",
    rating: 5,
    referredBy: "",
  })

  const [appointmentFormData, setAppointmentFormData] = useState({
    client: "",
    datetime: "",
    service: "",
    value: "",
    duration: "",
    observations: "",
  })

  const [showClientSuggestions, setShowClientSuggestions] = useState(false)

  // Dados mockados
  const [clients, setClients] = useState([
    { id: 1, name: "Maria Silva" },
    { id: 2, name: "Ana Pereira" },
    { id: 3, name: "João Santos" },
    { id: 4, name: "Carolina Mendes" },
  ])

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      service: "Molde F1 Completo",
      client: "Maria Silva",
      time: "09:00",
      duration: "90 min",
      value: 80,
      status: "Confirmado",
    },
    {
      id: 2,
      service: "Manicure",
      client: "Ana Pereira",
      time: "14:00",
      duration: "45 min",
      value: 25,
      status: "Pendente",
    },
    {
      id: 3,
      service: "Pedicure",
      client: "Carolina Mendes",
      time: "16:00",
      duration: "60 min",
      value: 30,
      status: "Confirmado",
    },
  ])

  const services = [
    { name: "Molde F1 Completo", price: 80.0, duration: 90 },
    { name: "Unhas em Gel", price: 45.0, duration: 90 },
    { name: "Manicure", price: 25.0, duration: 45 },
    { name: "Pedicure", price: 30.0, duration: 60 },
    { name: "Escova", price: 35.0, duration: 30 },
  ]

  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  // Funções para lidar com formulários
  const handleAddClient = () => {
    if (clientFormData.name && clientFormData.phone) {
      const newClient = {
        id: clients.length + 1,
        name: clientFormData.name,
        phone: clientFormData.phone,
        birthDate: clientFormData.birthDate,
        notes: clientFormData.notes,
        rating: clientFormData.rating,
        referredBy: clientFormData.referredBy,
      }
      setClients([...clients, newClient])
      setClientFormData({ name: "", phone: "", birthDate: "", notes: "", rating: 5, referredBy: "" })
      setIsNewClientDialogOpen(false)
      toast({
        title: "Cliente cadastrado!",
        description: `${clientFormData.name} foi adicionado com sucesso.`,
      })
    }
  }

  const handleServiceChange = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName)
    if (service) {
      setAppointmentFormData({
        ...appointmentFormData,
        service: serviceName,
        value: service.price.toFixed(2),
        duration: service.duration.toString(),
      })
    }
  }

  const handleAddAppointment = () => {
    if (appointmentFormData.client && appointmentFormData.datetime && appointmentFormData.service) {
      const appointmentDate = new Date(appointmentFormData.datetime)
      const newAppointment = {
        id: appointments.length + 1,
        service: appointmentFormData.service,
        client: appointmentFormData.client,
        time: appointmentDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        duration: `${appointmentFormData.duration} min`,
        value: Number.parseFloat(appointmentFormData.value),
        status: "Agendado",
      }
      setAppointments([...appointments, newAppointment])
      setAppointmentFormData({
        client: "",
        datetime: "",
        service: "",
        value: "",
        duration: "",
        observations: "",
      })
      setIsNewAppointmentDialogOpen(false)
      toast({
        title: "Agendamento criado!",
        description: `${appointmentFormData.service} agendado para ${appointmentFormData.client}.`,
      })
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate.getDate(), isCurrentMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: day, isCurrentMonth: true, isToday: day === 18 })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: day, isCurrentMonth: false })
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen surface">
      <Header />

      <main className="container px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bem-vinda, Anisy!</h1>
              <p className="text-gray-600 text-sm md:text-base">Aqui está um resumo do seu dia</p>
            </div>
            <Dialog open={isNewAppointmentDialogOpen} onOpenChange={setIsNewAppointmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary shadow-elevated text-white w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2 sm:mx-4"
                onClick={() => setShowClientSuggestions(false)}
              >
                <DialogHeader className="space-y-3 pb-4 border-b">
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Novo Agendamento</DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-700">
                    Preencha as informações para criar um novo agendamento.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:gap-6 py-4 sm:py-6">
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-semibold text-gray-900">
                      Cliente *
                    </Label>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <Input
                        id="client"
                        placeholder="Digite o nome do cliente..."
                        value={appointmentFormData.client}
                        onChange={(e) => {
                          setAppointmentFormData({ ...appointmentFormData, client: e.target.value })
                          setShowClientSuggestions(true)
                        }}
                        onFocus={() => setShowClientSuggestions(true)}
                        className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      />
                      {showClientSuggestions && appointmentFormData.client && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {clients
                            .filter((client) =>
                              client.name.toLowerCase().includes(appointmentFormData.client.toLowerCase()),
                            )
                            .map((client) => (
                              <button
                                key={client.id}
                                type="button"
                                className="w-full px-3 py-3 text-left text-base hover:bg-amber-50 focus:bg-amber-50 focus:outline-none"
                                onClick={() => {
                                  setAppointmentFormData({ ...appointmentFormData, client: client.name })
                                  setShowClientSuggestions(false)
                                }}
                              >
                                {client.name}
                              </button>
                            ))}
                          {clients.filter((client) =>
                            client.name.toLowerCase().includes(appointmentFormData.client.toLowerCase()),
                          ).length === 0 && (
                            <div className="px-3 py-3 text-gray-500 text-base">Nenhum cliente encontrado</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="datetime" className="text-sm font-semibold text-gray-900">
                      Data & Hora *
                    </Label>
                    <Input
                      id="datetime"
                      type="datetime-local"
                      value={appointmentFormData.datetime}
                      onChange={(e) => setAppointmentFormData({ ...appointmentFormData, datetime: e.target.value })}
                      className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-sm font-semibold text-gray-900">
                      Serviço *
                    </Label>
                    <Select value={appointmentFormData.service} onValueChange={handleServiceChange}>
                      <SelectTrigger className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.name} value={service.name} className="text-base py-3">
                            {service.name} - R$ {service.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="value" className="text-sm font-semibold text-gray-900">
                        Valor *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium text-base">
                          R$
                        </span>
                        <Input
                          id="value"
                          placeholder="80,00"
                          value={appointmentFormData.value}
                          onChange={(e) => setAppointmentFormData({ ...appointmentFormData, value: e.target.value })}
                          className="pl-8 h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-sm font-semibold text-gray-900">
                        Duração *
                      </Label>
                      <Select
                        value={appointmentFormData.duration}
                        onValueChange={(value) => setAppointmentFormData({ ...appointmentFormData, duration: value })}
                      >
                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                          <SelectValue placeholder="Duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30" className="text-base py-3">
                            30 min
                          </SelectItem>
                          <SelectItem value="45" className="text-base py-3">
                            45 min
                          </SelectItem>
                          <SelectItem value="60" className="text-base py-3">
                            60 min
                          </SelectItem>
                          <SelectItem value="90" className="text-base py-3">
                            90 min
                          </SelectItem>
                          <SelectItem value="120" className="text-base py-3">
                            120 min
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observations" className="text-sm font-semibold text-gray-900">
                      Observações
                    </Label>
                    <Textarea
                      id="observations"
                      placeholder="Observações adicionais..."
                      value={appointmentFormData.observations}
                      onChange={(e) => setAppointmentFormData({ ...appointmentFormData, observations: e.target.value })}
                      rows={3}
                      className="text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewAppointmentDialogOpen(false)}
                    className="border-gray-300 text-gray-700 h-12 text-base order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddAppointment}
                    className="bg-amber-600 hover:bg-amber-700 text-white h-12 text-base order-1 sm:order-2"
                  >
                    Criar Agendamento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="border-0 shadow-soft hover:shadow-elevated transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">Hoje</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-gray-600 mt-1">agendamentos</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft hover:shadow-elevated transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">Esta Semana</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-600 mt-1">agendamentos</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft hover:shadow-elevated transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">Receita Hoje</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">R$ 240</p>
                  <p className="text-xs text-green-600 mt-1">+15% vs ontem</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft hover:shadow-elevated transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">Novos Clientes</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-gray-600 mt-1">este mês</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
            {/* Today's Appointments */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">Agendamentos de Hoje</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs md:text-sm">
                    Ver todos <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm md:text-base text-amber-700 mb-1 truncate">
                        {appointment.service}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {appointment.client} • {appointment.time} - {appointment.duration}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm md:text-base text-gray-900">
                        R$ {appointment.value.toFixed(2).replace(".", ",")}
                      </p>
                      <p
                        className={`text-xs ${
                          appointment.status === "Confirmado" ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {appointment.status}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">{appointments.length} agendamentos hoje</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-16 md:h-20 flex-col gap-2 hover:bg-amber-50 hover:border-amber-200 w-full"
                      >
                        <Users className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="text-sm md:text-base">Novo Cliente</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
                      <DialogHeader className="space-y-3 pb-4 border-b">
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Novo Cliente</DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-gray-700">
                          Preencha as informações para cadastrar um novo cliente.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 sm:gap-6 py-4 sm:py-6">
                        <div className="space-y-2">
                          <Label htmlFor="client-name" className="text-sm font-semibold text-gray-900">
                            Nome Completo *
                          </Label>
                          <Input
                            id="client-name"
                            placeholder="Digite o nome completo"
                            value={clientFormData.name}
                            onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                            className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-phone" className="text-sm font-semibold text-gray-900">
                            Telefone *
                          </Label>
                          <Input
                            id="client-phone"
                            placeholder="(11) 99999-9999"
                            value={clientFormData.phone}
                            onChange={(e) => setClientFormData({ ...clientFormData, phone: e.target.value })}
                            className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-birthDate" className="text-sm font-semibold text-gray-900">
                            Data de Nascimento
                          </Label>
                          <Input
                            id="client-birthDate"
                            type="date"
                            value={clientFormData.birthDate}
                            onChange={(e) => setClientFormData({ ...clientFormData, birthDate: e.target.value })}
                            className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-900">Avaliação</Label>
                          <div className="flex gap-2 justify-center sm:justify-start">
                            {Array.from({ length: 5 }, (_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setClientFormData({ ...clientFormData, rating: index + 1 })}
                                className="focus:outline-none transition-colors p-1"
                              >
                                <Star
                                  className={`w-8 h-8 sm:w-6 sm:h-6 ${
                                    index < clientFormData.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300 hover:text-amber-300"
                                  } transition-colors`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-referredBy" className="text-sm font-semibold text-gray-900">
                            Indicado por
                          </Label>
                          <Select
                            value={clientFormData.referredBy}
                            onValueChange={(value) => setClientFormData({ ...clientFormData, referredBy: value })}
                          >
                            <SelectTrigger className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                              <SelectValue placeholder="Selecione quem indicou" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none" className="text-base py-3">
                                Nenhuma indicação
                              </SelectItem>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.name} className="text-base py-3">
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-notes" className="text-sm font-semibold text-gray-900">
                            Observações
                          </Label>
                          <Textarea
                            id="client-notes"
                            placeholder="Preferências, alergias, observações..."
                            value={clientFormData.notes}
                            onChange={(e) => setClientFormData({ ...clientFormData, notes: e.target.value })}
                            rows={3}
                            className="text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsNewClientDialogOpen(false)}
                          className="border-gray-300 text-gray-700 h-12 text-base order-2 sm:order-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleAddClient}
                          className="bg-amber-600 hover:bg-amber-700 text-white h-12 text-base order-1 sm:order-2"
                        >
                          Cadastrar Cliente
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isNewAppointmentDialogOpen} onOpenChange={setIsNewAppointmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-16 md:h-20 flex-col gap-2 hover:bg-amber-50 hover:border-amber-200 w-full"
                      >
                        <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="text-sm md:text-base">Agendar</span>
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Calendar */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Calendário</CardTitle>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-gray-900 capitalize text-sm md:text-base">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <button
                      key={index}
                      className={cn(
                        "aspect-square flex items-center justify-center text-xs md:text-sm rounded-lg transition-all hover:bg-gray-100",
                        day.isCurrentMonth
                          ? day.isToday
                            ? "bg-amber-500 text-white font-semibold shadow-soft"
                            : "text-gray-900 hover:bg-amber-50"
                          : "text-gray-400",
                      )}
                    >
                      {day.date}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Clients */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Top Clientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                    MS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">Maria Silva</p>
                    <p className="text-xs text-gray-600 mt-1">15 atendimentos</p>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-green-600">R$ 1.200</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                    AP
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">Ana Pereira</p>
                    <p className="text-xs text-gray-600 mt-1">12 atendimentos</p>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-green-600">R$ 960</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                    CM
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">Carolina Mendes</p>
                    <p className="text-xs text-gray-600 mt-1">8 atendimentos</p>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-green-600">R$ 640</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
