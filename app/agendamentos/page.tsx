"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, User, Clock, X, Check, Trash2 } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
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

export default function AgendamentosPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5)) // Junho 2025
  const [filter, setFilter] = useState("todos")

  const { appointments, updateAppointmentStatus, deleteAppointment } = useStore()

  const handleCancelAppointment = (id: number) => {
    updateAppointmentStatus(id, "Cancelado")
  }

  const handleCompleteAppointment = (id: number) => {
    const appointment = appointments.find((apt) => apt.id === id)
    if (appointment) {
      updateAppointmentStatus(id, "Concluído", appointment.value)
    }
  }

  const handleDeleteAppointment = (id: number) => {
    const appointment = appointments.find((apt) => apt.id === id)
    deleteAppointment(id)
    toast({
      title: "Agendamento excluído!",
      description: `${appointment?.service} foi removido definitivamente.`,
      variant: "destructive",
    })
  }

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

  const weekDays = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"]

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "todos") return true
    if (filter === "agendados") return apt.status === "Agendado"
    if (filter === "concluidos") return apt.status === "Concluído"
    if (filter === "cancelados") return apt.status === "Cancelado"
    return true
  })

  const stats = {
    total: appointments.length,
    agendados: appointments.filter((apt) => apt.status === "Agendado").length,
    concluidos: appointments.filter((apt) => apt.status === "Concluído").length,
    cancelados: appointments.filter((apt) => apt.status === "Cancelado").length,
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate.getDate(), isCurrentMonth: false })
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: day, isCurrentMonth: true, isToday: day === 18 })
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: day, isCurrentMonth: false })
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="p-4 md:p-6 pb-20 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-amber-700 mb-2">Agendamentos</h1>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-amber-700">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-amber-600 mr-1" />
                <p className="text-sm text-gray-600">Agendados</p>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.agendados}</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <Check className="w-4 h-4 text-green-600 mr-1" />
                <p className="text-sm text-gray-600">Concluídos</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <X className="w-4 h-4 text-red-600 mr-1" />
                <p className="text-sm text-gray-600">Cancelados</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.cancelados}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* Lista de agendamentos */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-amber-700">Lista de Agendamentos</h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="Todos os..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os...</SelectItem>
                  <SelectItem value="agendados">Agendados</SelectItem>
                  <SelectItem value="concluidos">Concluídos</SelectItem>
                  <SelectItem value="cancelados">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-amber-700 mb-2">
                          {appointment.service}
                        </h3>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{appointment.client}</span>
                          </div>

                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{appointment.date}</span>
                          </div>

                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>
                              {appointment.time} ({appointment.duration})
                            </span>
                          </div>

                          {appointment.value && (
                            <div className="flex items-center">
                              <span className="text-green-600 font-medium">
                                R$ {appointment.value.toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 sm:items-end">
                        <Badge
                          className={
                            appointment.status === "Agendado"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : appointment.status === "Concluído"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {appointment.status}
                        </Badge>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                          {appointment.status === "Agendado" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                                onClick={() => handleCompleteAppointment(appointment.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Concluir
                              </Button>
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o agendamento <strong>{appointment.service}</strong> de{" "}
                                  <strong>{appointment.client}</strong>? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Calendário */}
          <div className="order-1 lg:order-2">
            <Card className="bg-white">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-700">Calendário de Agendamentos</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-gray-700">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
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
                      className={`
                        aspect-square flex items-center justify-center text-sm rounded-md transition-colors
                        ${
                          day.isCurrentMonth
                            ? day.isToday
                              ? "bg-amber-500 text-white font-medium"
                              : "text-gray-700 hover:bg-amber-100"
                            : "text-gray-300"
                        }
                      `}
                    >
                      {day.date}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-amber-700">Agendamentos para 18 de junho de 2025</p>
                  <p className="text-sm text-gray-500 mt-1">Nenhum agendamento para este dia.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
