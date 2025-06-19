"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Appointment {
  id: number
  service: string
  client: string
  date: string
  time: string
  duration: string
  status: string
  value?: number
}

interface Expense {
  id: number
  name: string
  category: string
  date: string
  supplier: string
  value: number
}

interface Revenue {
  id: number
  appointmentId: number
  service: string
  client: string
  date: string
  value: number
  createdAt: string
}

interface Client {
  id: number
  name: string
  phone: string
  birthDate: string
  notes: string
  rating: number
  referredBy: string
  lastAppointment: string | null
  nextAppointment: {
    service: string
    date: string
    time: string
  } | null
  totalAppointments: number
  totalSpent: number
}

interface Store {
  appointments: Appointment[]
  expenses: Expense[]
  revenues: Revenue[]
  clients: Client[]

  // Appointments
  setAppointments: (appointments: Appointment[]) => void
  updateAppointmentStatus: (id: number, status: string, value?: number) => void
  deleteAppointment: (id: number) => void

  // Expenses
  setExpenses: (expenses: Expense[]) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: number) => void

  // Revenues
  addRevenue: (revenue: Omit<Revenue, "id">) => void
  deleteRevenue: (id: number) => void

  // Clients - Adicionar estas funções
  addClient: (client: Omit<Client, "id">) => void
  updateClient: (id: number, client: Partial<Client>) => void
  deleteClient: (id: number) => void

  // Financial calculations
  getTotalRevenue: () => number
  getTotalExpenses: () => number
  getNetProfit: () => number
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      appointments: [
        {
          id: 1,
          service: "Unhas em Gel",
          client: "João Santos",
          date: "15 de maio de 2025",
          time: "11:00",
          duration: "90 min",
          status: "Agendado",
          value: 45,
        },
        {
          id: 2,
          service: "Molde F1",
          client: "Carolina Mendes",
          date: "15 de maio de 2025",
          time: "11:00",
          duration: "120 min",
          status: "Agendado",
          value: 80,
        },
        {
          id: 3,
          service: "Pedicure",
          client: "Maria Silva",
          date: "10 de maio de 2025",
          time: "14:00",
          duration: "60 min",
          status: "Concluído",
          value: 30,
        },
        {
          id: 4,
          service: "Manicure",
          client: "Ana Pereira",
          date: "08 de maio de 2025",
          time: "16:00",
          duration: "45 min",
          status: "Concluído",
          value: 25,
        },
      ],
      expenses: [
        {
          id: 1,
          name: "maquina de lichar",
          category: "Equipamentos",
          date: "18 de julho de 2025",
          supplier: "Fornecedor: loja para profissionais",
          value: 100.0,
        },
        {
          id: 2,
          name: "polideira",
          category: "Equipamentos",
          date: "18 de julho de 2025",
          supplier: "Fornecedor: loja para profissionais",
          value: 150.0,
        },
        {
          id: 3,
          name: "Licha elétrica",
          category: "Equipamentos",
          date: "18 de julho de 2025",
          supplier: "Fornecedor: MM Cosméticos",
          value: 200.0,
        },
      ],
      revenues: [
        {
          id: 1,
          appointmentId: 3,
          service: "Pedicure",
          client: "Maria Silva",
          date: "10 de maio de 2025",
          value: 30,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          appointmentId: 4,
          service: "Manicure",
          client: "Ana Pereira",
          date: "08 de maio de 2025",
          value: 25,
          createdAt: new Date().toISOString(),
        },
      ],
      clients: [
        {
          id: 1,
          name: "Maria Silva",
          phone: "(11) 99876-5432",
          birthDate: "1985-03-15",
          notes: "Prefere designs naturais e cores neutras",
          rating: 5,
          referredBy: "",
          lastAppointment: "2024-01-10",
          nextAppointment: null,
          totalAppointments: 15,
          totalSpent: 1200,
        },
        {
          id: 2,
          name: "Ana Pereira",
          phone: "(11) 98765-4321",
          birthDate: "1990-07-22",
          notes: "Alérgica a alguns esmaltes - verificar sempre",
          rating: 4,
          referredBy: "Maria Silva",
          lastAppointment: "2024-01-08",
          nextAppointment: {
            service: "Molde F1 Completo",
            date: "2025-06-20",
            time: "14:00",
          },
          totalAppointments: 12,
          totalSpent: 960,
        },
        {
          id: 3,
          name: "João Santos",
          phone: "(11) 97654-3210",
          birthDate: "1988-11-10",
          notes: "",
          rating: 3,
          referredBy: "",
          lastAppointment: null,
          nextAppointment: null,
          totalAppointments: 0,
          totalSpent: 0,
        },
        {
          id: 4,
          name: "Carolina Mendes",
          phone: "(11) 96543-2109",
          birthDate: "1992-05-08",
          notes: "Cliente VIP - sempre pontual e educada",
          rating: 5,
          referredBy: "Ana Pereira",
          lastAppointment: "2024-01-05",
          nextAppointment: null,
          totalAppointments: 8,
          totalSpent: 640,
        },
      ],

      setAppointments: (appointments) => set({ appointments }),

      updateAppointmentStatus: (id, status, value) =>
        set((state) => {
          const updatedAppointments = state.appointments.map((apt) => {
            if (apt.id === id) {
              const updatedApt = { ...apt, status }
              if (value !== undefined) {
                updatedApt.value = value
              }
              return updatedApt
            }
            return apt
          })

          // Se o status for "Concluído", adicionar à receita
          if (status === "Concluído") {
            const appointment = state.appointments.find((apt) => apt.id === id)
            if (appointment && !state.revenues.find((rev) => rev.appointmentId === id)) {
              const newRevenue = {
                id: state.revenues.length + 1,
                appointmentId: id,
                service: appointment.service,
                client: appointment.client,
                date: appointment.date,
                value: value || appointment.value || 0,
                createdAt: new Date().toISOString(),
              }
              return {
                appointments: updatedAppointments,
                revenues: [...state.revenues, newRevenue],
              }
            }
          }

          // Se o status mudou de "Concluído" para outro, remover da receita
          if (status !== "Concluído") {
            const filteredRevenues = state.revenues.filter((rev) => rev.appointmentId !== id)
            return {
              appointments: updatedAppointments,
              revenues: filteredRevenues,
            }
          }

          return { appointments: updatedAppointments }
        }),

      deleteAppointment: (id) =>
        set((state) => {
          // Remove o agendamento
          const updatedAppointments = state.appointments.filter((apt) => apt.id !== id)

          // Remove a receita associada se existir
          const filteredRevenues = state.revenues.filter((rev) => rev.appointmentId !== id)

          return {
            appointments: updatedAppointments,
            revenues: filteredRevenues,
          }
        }),

      setExpenses: (expenses) => set({ expenses }),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [{ ...expense, id: state.expenses.length + 1 }, ...state.expenses],
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      addRevenue: (revenue) =>
        set((state) => ({
          revenues: [...state.revenues, { ...revenue, id: state.revenues.length + 1 }],
        })),

      deleteRevenue: (id) =>
        set((state) => ({
          revenues: state.revenues.filter((revenue) => revenue.id !== id),
        })),

      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, { ...client, id: state.clients.length + 1 }],
        })),

      updateClient: (id, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((client) => (client.id === id ? { ...client, ...updatedClient } : client)),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        })),

      getTotalRevenue: () => {
        const { revenues } = get()
        return revenues.reduce((total, revenue) => total + revenue.value, 0)
      },

      getTotalExpenses: () => {
        const { expenses } = get()
        return expenses.reduce((total, expense) => total + expense.value, 0)
      },

      getNetProfit: () => {
        const { getTotalRevenue, getTotalExpenses } = get()
        return getTotalRevenue() - getTotalExpenses()
      },
    }),
    {
      name: "agendamento-storage",
    },
  ),
)
