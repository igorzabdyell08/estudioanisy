"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AutomacaoPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-amber-700 mb-2">Automação</h1>
          <p className="text-gray-600">Funcionalidades de automação em desenvolvimento</p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-amber-700">Em Breve</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Esta seção estará disponível em breve com funcionalidades de automação para seu negócio.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
