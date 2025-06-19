"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Search, UserPlus, Edit, Calendar, Star, Users, Clock, Trash2, Gift } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReminderTemplates } from "@/components/reminder-templates"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const { toast } = useToast()

  // Usar o store global em vez do estado local
  const { clients, addClient, updateClient, deleteClient } = useStore()

  const [existingAppointments, setExistingAppointments] = useState([
    {
      id: 1,
      clientName: "Maria Silva",
      date: "2025-06-20",
      time: "09:00",
      service: "Molde F1 Completo",
    },
    {
      id: 2,
      clientName: "Ana Pereira",
      date: "2025-06-20",
      time: "14:00",
      service: "Manicure",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    notes: "",
    rating: 5,
    referredBy: "",
  })

  const [scheduleData, setScheduleData] = useState({
    datetime: "",
    service: "",
    value: "",
    duration: "",
    observations: "",
  })

  const services = [
    { name: "Molde F1 Completo", price: 80.0, duration: 60 },
    { name: "Unhas em Gel", price: 45.0, duration: 90 },
    { name: "Manicure", price: 25.0, duration: 45 },
    { name: "Pedicure", price: 30.0, duration: 60 },
    { name: "Escova", price: 35.0, duration: 30 },
  ]

  const handleAddClient = () => {
    if (formData.name && formData.phone) {
      const newClient = {
        name: formData.name,
        phone: formData.phone,
        birthDate: formData.birthDate,
        notes: formData.notes,
        rating: formData.rating,
        referredBy: formData.referredBy,
        lastAppointment: null,
        nextAppointment: null,
        totalAppointments: 0,
        totalSpent: 0,
      }
      addClient(newClient)
      setFormData({ name: "", phone: "", birthDate: "", notes: "", rating: 5, referredBy: "" })
      setIsAddDialogOpen(false)
      toast({
        title: "Cliente cadastrado!",
        description: `${formData.name} foi adicionado com sucesso.`,
      })
    }
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setFormData({
      name: client.name,
      phone: client.phone,
      birthDate: client.birthDate,
      notes: client.notes,
      rating: client.rating,
      referredBy: client.referredBy,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateClient = () => {
    if (selectedClient && formData.name && formData.phone) {
      updateClient(selectedClient.id, formData)
      setIsEditDialogOpen(false)
      setSelectedClient(null)
      setFormData({ name: "", phone: "", birthDate: "", notes: "", rating: 5, referredBy: "" })
      toast({
        title: "Cliente atualizado!",
        description: "As informações foram salvas com sucesso.",
      })
    }
  }

  const handleDeleteClient = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId)

    // Remove o cliente do store
    deleteClient(clientId)

    // Remove todos os agendamentos do cliente
    setExistingAppointments(existingAppointments.filter((apt) => apt.clientName !== client?.name))

    toast({
      title: "Cliente excluído!",
      description: `${client?.name} e todos os seus agendamentos foram removidos definitivamente do sistema.`,
      variant: "destructive",
    })
  }

  const handleScheduleClient = (client: any) => {
    setSelectedClient(client)
    const now = new Date()
    const defaultDateTime = now.toISOString().slice(0, 16)
    setScheduleData({
      datetime: defaultDateTime,
      service: "",
      value: "",
      duration: "",
      observations: "",
    })
    setIsScheduleDialogOpen(true)
  }

  const handleServiceChange = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName)
    if (service) {
      setScheduleData({
        ...scheduleData,
        service: serviceName,
        value: service.price.toFixed(2),
        duration: service.duration.toString(),
      })
    }
  }

  const checkTimeConflict = (datetime: string) => {
    const appointmentDate = new Date(datetime)
    const dateStr = appointmentDate.toLocaleDateString("pt-BR")
    const timeStr = appointmentDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

    return existingAppointments.some((apt) => apt.date === dateStr && apt.time === timeStr)
  }

  const handleScheduleAppointment = () => {
    if (scheduleData.datetime && scheduleData.service && selectedClient) {
      if (checkTimeConflict(scheduleData.datetime)) {
        toast({
          title: "Conflito de horário!",
          description: "Já existe um agendamento neste horário. Escolha outro horário.",
          variant: "destructive",
        })
        return
      }

      const appointmentDate = new Date(scheduleData.datetime)
      const newAppointment = {
        service: scheduleData.service,
        date: appointmentDate.toLocaleDateString("pt-BR"),
        time: appointmentDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }

      // Adicionar à lista de agendamentos existentes
      const newExistingAppointment = {
        id: existingAppointments.length + 1,
        clientName: selectedClient.name,
        date: newAppointment.date,
        time: newAppointment.time,
        service: scheduleData.service,
      }
      setExistingAppointments([...existingAppointments, newExistingAppointment])

      // Atualizar o cliente no store
      updateClient(selectedClient.id, { nextAppointment: newAppointment })

      setIsScheduleDialogOpen(false)
      setSelectedClient(null)
      setScheduleData({
        datetime: "",
        service: "",
        value: "",
        duration: "",
        observations: "",
      })

      toast({
        title: "Agendamento confirmado!",
        description: `${selectedClient.name} foi agendado para ${newAppointment.date} às ${newAppointment.time}.`,
      })
    }
  }

  const filteredClients = clients.filter(
    (client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.phone.includes(searchTerm),
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
    ))
  }

  const getClientStatus = (client: any) => {
    if (client.nextAppointment) return { label: "Agendado", color: "bg-blue-100 text-blue-800 border-blue-200" }
    if (client.totalAppointments > 10) return { label: "VIP", color: "bg-purple-100 text-purple-800 border-purple-200" }
    if (client.totalAppointments > 5)
      return { label: "Frequente", color: "bg-green-100 text-green-800 border-green-200" }
    if (client.totalAppointments > 0) return { label: "Ativo", color: "bg-amber-100 text-amber-800 border-amber-200" }
    return { label: "Novo", color: "bg-gray-100 text-gray-800 border-gray-200" }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-red-500 to-red-600",
    ]
    return colors[id % colors.length]
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const isBirthday = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container px-6 py-8 pb-24 md:pb-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
              <p className="text-gray-700 text-lg">Gerencie seus clientes e relacionamentos</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg font-semibold px-6 py-3">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Cliente
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
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Digite o nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">
                      Telefone *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-900">
                      Data de Nascimento
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
                          onClick={() => setFormData({ ...formData, rating: index + 1 })}
                          className="focus:outline-none transition-colors p-1"
                        >
                          <Star
                            className={`w-8 h-8 sm:w-6 sm:h-6 ${
                              index < formData.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 hover:text-amber-300"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referredBy" className="text-sm font-semibold text-gray-900">
                      Indicado por
                    </Label>
                    <Select
                      value={formData.referredBy}
                      onValueChange={(value) => setFormData({ ...formData, referredBy: value })}
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
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-900">
                      Observações
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Preferências, alergias, observações..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
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
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-white shadow-sm border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{clients.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">VIP</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {clients.filter((c) => c.totalAppointments > 10).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agendados</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {clients.filter((c) => c.nextAppointment).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aniversariantes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {clients.filter((c) => c.birthDate && isBirthday(c.birthDate)).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-pink-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const status = getClientStatus(client)
            const isClientBirthday = client.birthDate && isBirthday(client.birthDate)
            return (
              <Card
                key={client.id}
                className={cn(
                  "border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group bg-white",
                  isClientBirthday && "ring-2 ring-pink-300 bg-pink-50",
                )}
              >
                <CardContent className="p-6">
                  {/* Birthday Badge */}
                  {isClientBirthday && (
                    <div className="mb-4 flex items-center gap-2 bg-pink-100 text-pink-800 px-3 py-2 rounded-lg text-sm font-medium">
                      <Gift className="h-4 w-4" />
                      Aniversariante hoje! 🎉
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
                        getAvatarColor(client.id),
                      )}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 truncate text-lg">{client.name}</h3>
                        <Badge className={cn("text-xs px-2 py-1 font-medium border", status.color)}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(client.rating)}
                        <span className="text-xs text-gray-600 ml-1 font-medium">({client.rating}/5)</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">{client.phone}</span>
                    </div>
                    {client.birthDate && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <Gift className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">
                          {calculateAge(client.birthDate)} anos •{" "}
                          {new Date(client.birthDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    )}
                    {client.referredBy && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Indicado por {client.referredBy}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <p className="text-xl font-bold text-gray-900">{client.totalAppointments}</p>
                      <p className="text-xs text-gray-600 mt-1 font-medium">Atendimentos</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <p className="text-xl font-bold text-green-700">R$ {client.totalSpent}</p>
                      <p className="text-xs text-gray-600 mt-1 font-medium">Total Gasto</p>
                    </div>
                  </div>

                  {/* Next Appointment */}
                  {client.nextAppointment && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-700" />
                        <p className="text-sm font-semibold text-blue-900">Próximo Agendamento</p>
                      </div>
                      <p className="text-sm font-medium text-blue-800">{client.nextAppointment.service}</p>
                      <p className="text-sm text-blue-700">
                        {client.nextAppointment.date} às {client.nextAppointment.time}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {client.notes && (
                    <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
                      <p className="text-sm font-semibold text-amber-900 mb-1">Observações</p>
                      <p className="text-sm text-amber-800 leading-relaxed">{client.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                        className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleScheduleClient(client)}
                        className="h-10 bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Agendar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir <strong>{client.name}</strong>? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteClient(client.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <ReminderTemplates client={client} appointment={client.nextAppointment} />
                      <WhatsAppButton
                        phone={client.phone}
                        message={`Olá ${client.name}! Como você está? 😊\n\nEstúdio Anisy Candine - Especialista em Molde F1\n\nQualquer dúvida, estou à disposição! 💖`}
                        variant="outline"
                        className="bg-green-50 border-green-300 text-green-800 hover:bg-green-100 h-10 font-medium"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-700 mb-8 max-w-sm mx-auto">
              {searchTerm
                ? "Tente ajustar sua busca ou adicione um novo cliente"
                : "Comece adicionando seu primeiro cliente"}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Cliente
            </Button>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
            <DialogHeader className="space-y-3 pb-4 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Editar Cliente</DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-700">
                Altere as informações do cliente conforme necessário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:gap-6 py-4 sm:py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-900">
                  Nome Completo *
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-sm font-semibold text-gray-900">
                  Telefone *
                </Label>
                <Input
                  id="edit-phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-birthDate" className="text-sm font-semibold text-gray-900">
                  Data de Nascimento
                </Label>
                <Input
                  id="edit-birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
                      onClick={() => setFormData({ ...formData, rating: index + 1 })}
                      className="focus:outline-none transition-colors p-1"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-6 sm:h-6 ${
                          index < formData.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 hover:text-amber-300"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-referredBy" className="text-sm font-semibold text-gray-900">
                  Indicado por
                </Label>
                <Select
                  value={formData.referredBy}
                  onValueChange={(value) => setFormData({ ...formData, referredBy: value })}
                >
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                    <SelectValue placeholder="Selecione quem indicou" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base py-3">
                      Nenhuma indicação
                    </SelectItem>
                    {clients
                      .filter((c) => c.id !== selectedClient?.id)
                      .map((client) => (
                        <SelectItem key={client.id} value={client.name} className="text-base py-3">
                          {client.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="text-sm font-semibold text-gray-900">
                  Observações
                </Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Preferências, alergias, observações..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-gray-300 text-gray-700 h-12 text-base order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateClient}
                className="bg-amber-600 hover:bg-amber-700 text-white h-12 text-base order-1 sm:order-2"
              >
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Modal */}
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
            <DialogHeader className="space-y-3 pb-4 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Agendar para {selectedClient?.name}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-700">
                Preencha os detalhes do agendamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:gap-6 py-4 sm:py-6">
              <div className="space-y-2">
                <Label htmlFor="datetime" className="text-sm font-semibold text-gray-900">
                  Data & Hora *
                </Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={scheduleData.datetime}
                  onChange={(e) => setScheduleData({ ...scheduleData, datetime: e.target.value })}
                  className="h-12 text-base border-2 border-amber-300 focus:border-amber-500"
                />
                {scheduleData.datetime && checkTimeConflict(scheduleData.datetime) && (
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ Já existe um agendamento neste horário. Escolha outro horário.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-semibold text-gray-900">
                  Serviço *
                </Label>
                <Select value={scheduleData.service} onValueChange={handleServiceChange}>
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

              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-semibold text-gray-900">
                  Valor do Serviço *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium text-base">
                    R$
                  </span>
                  <Input
                    id="value"
                    placeholder="80,00"
                    value={scheduleData.value}
                    onChange={(e) => setScheduleData({ ...scheduleData, value: e.target.value })}
                    className="pl-8 h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                {scheduleData.service && (
                  <p className="text-sm text-gray-600">
                    Preço padrão: R$ {services.find((s) => s.name === scheduleData.service)?.price.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-semibold text-gray-900">
                  Duração *
                </Label>
                <Select
                  value={scheduleData.duration}
                  onValueChange={(value) => setScheduleData({ ...scheduleData, duration: value })}
                >
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30" className="text-base py-3">
                      30 minutos
                    </SelectItem>
                    <SelectItem value="45" className="text-base py-3">
                      45 minutos
                    </SelectItem>
                    <SelectItem value="60" className="text-base py-3">
                      60 minutos
                    </SelectItem>
                    <SelectItem value="90" className="text-base py-3">
                      90 minutos
                    </SelectItem>
                    <SelectItem value="120" className="text-base py-3">
                      120 minutos
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations" className="text-sm font-semibold text-gray-900">
                  Observações
                </Label>
                <Textarea
                  id="observations"
                  placeholder="Observações adicionais sobre este agendamento..."
                  value={scheduleData.observations}
                  onChange={(e) => setScheduleData({ ...scheduleData, observations: e.target.value })}
                  rows={3}
                  className="text-base border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
                className="border-gray-300 text-gray-700 h-12 text-base order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleScheduleAppointment}
                disabled={scheduleData.datetime && checkTimeConflict(scheduleData.datetime)}
                className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base order-1 sm:order-2"
              >
                Confirmar Agendamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
