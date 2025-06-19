"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Plus, Calendar, CheckCircle, Trash2 } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/lib/store"
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
import { toast } from "sonner"

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState("despesas")
  // const { toast } = useToast()

  const {
    expenses,
    revenues,
    addExpense,
    getTotalRevenue,
    getTotalExpenses,
    getNetProfit,
    deleteExpense,
    deleteRevenue,
  } = useStore()

  const [expenseForm, setExpenseForm] = useState({
    category: "",
    value: "",
    date: "2025-07-18",
    description: "",
    supplier: "",
    observations: "",
  })

  const handleAddExpense = () => {
    if (!expenseForm.category || !expenseForm.value || !expenseForm.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha categoria, valor e descrição.",
        variant: "destructive",
      })
      return
    }

    const newExpense = {
      name: expenseForm.description,
      category: expenseForm.category,
      date: new Date(expenseForm.date).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      supplier: expenseForm.supplier ? `Fornecedor: ${expenseForm.supplier}` : "Fornecedor não informado",
      value: Number.parseFloat(expenseForm.value.replace(",", ".")),
    }

    addExpense(newExpense)
    setExpenseForm({
      category: "",
      value: "",
      date: "2025-07-18",
      description: "",
      supplier: "",
      observations: "",
    })

    toast.success("Despesa adicionada com sucesso!")
  }

  const stats = {
    receita: getTotalRevenue(),
    despesas: getTotalExpenses(),
    lucro: getNetProfit(),
  }

  const handleDeleteExpense = (id: number) => {
    const expense = expenses.find((exp) => exp.id === id)
    deleteExpense(id)
    toast.error(`${expense?.name} foi removida definitivamente.`)
  }

  const handleDeleteRevenue = (id: number) => {
    const revenue = revenues.find((rev) => rev.id === id)
    deleteRevenue(id)
    toast({
      title: "Receita excluída!",
      description: `${revenue?.service} foi removida definitivamente.`,
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="p-4 md:p-6 pb-20 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-amber-700 mb-2">Controle Financeiro</h1>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>18 de julho de 2025</span>
          </div>
        </div>

        {/* Cards de resumo financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Receita Total</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                R$ {stats.receita.toFixed(2).replace(".", ",")}
              </div>
              <p className="text-xs text-gray-500">este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Despesas Totais</span>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600 mb-1">
                R$ {stats.despesas.toFixed(2).replace(".", ",")}
              </div>
              <p className="text-xs text-gray-500">este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Lucro Líquido</span>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className={`text-2xl font-bold mb-1 ${stats.lucro >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {stats.lucro.toFixed(2).replace(".", ",")}
              </div>
              <p className="text-xs text-gray-500">este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === "despesas" ? "default" : "ghost"}
            onClick={() => setActiveTab("despesas")}
            className={`${activeTab === "despesas" ? "bg-amber-500 hover:bg-amber-600" : ""} whitespace-nowrap`}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Despesas
          </Button>
          <Button
            variant={activeTab === "receitas" ? "default" : "ghost"}
            onClick={() => setActiveTab("receitas")}
            className={`${activeTab === "receitas" ? "bg-amber-500 hover:bg-amber-600" : ""} whitespace-nowrap`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Receitas
          </Button>
          <Button
            variant={activeTab === "transacoes" ? "default" : "ghost"}
            onClick={() => setActiveTab("transacoes")}
            className={`${activeTab === "transacoes" ? "bg-amber-500 hover:bg-amber-600" : ""} whitespace-nowrap`}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Transações
          </Button>
        </div>

        {activeTab === "despesas" && (
          <div className="space-y-6">
            {/* Formulário Nova Despesa */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-amber-700">Nova Despesa</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                        <SelectItem value="Materiais">Materiais</SelectItem>
                        <SelectItem value="Aluguel">Aluguel</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">Valor *</Label>
                      <Input
                        id="value"
                        placeholder="0,00"
                        value={expenseForm.value}
                        onChange={(e) => setExpenseForm({ ...expenseForm, value: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Input
                      id="description"
                      placeholder="Descrição da despesa"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="supplier">Fornecedor</Label>
                    <Input
                      id="supplier"
                      placeholder="Nome do fornecedor"
                      value={expenseForm.supplier}
                      onChange={(e) => setExpenseForm({ ...expenseForm, supplier: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    placeholder="Observações adicionais..."
                    value={expenseForm.observations}
                    onChange={(e) => setExpenseForm({ ...expenseForm, observations: e.target.value })}
                  />
                </div>

                <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleAddExpense}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Despesa
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Despesas Recentes */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-amber-700">Despesas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{expense.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{expense.date}</span>
                          </div>
                          <span>{expense.supplier}</span>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {expense.category}
                        </Badge>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-semibold text-red-600">
                          -R$ {expense.value.toFixed(2).replace(".", ",")}
                        </span>
                        <div className="mt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a despesa <strong>{expense.name}</strong>? Esta ação
                                  não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteExpense(expense.id)}
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "receitas" && (
          <div className="space-y-6">
            {/* Lista de Receitas */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-amber-700 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Receitas de Agendamentos Concluídos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenues.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma receita registrada ainda. Complete alguns agendamentos para ver as receitas aqui.
                    </p>
                  ) : (
                    revenues.map((revenue) => (
                      <div
                        key={revenue.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{revenue.service}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{revenue.date}</span>
                            </div>
                            <span>Cliente: {revenue.client}</span>
                          </div>
                          <Badge variant="outline" className="mt-2 bg-green-100 text-green-800">
                            Agendamento Concluído
                          </Badge>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-semibold text-green-600">
                            +R$ {revenue.value.toFixed(2).replace(".", ",")}
                          </span>
                          <div className="mt-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a receita de <strong>{revenue.service}</strong>? Esta
                                    ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRevenue(revenue.id)}
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
