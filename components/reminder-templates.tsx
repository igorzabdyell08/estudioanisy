"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { WhatsAppButton } from "./whatsapp-button"
import { MessageCircle, Clock, Calendar, Star } from "lucide-react"

interface ReminderTemplatesProps {
  client: {
    name: string
    phone: string
  }
  appointment?: {
    service: string
    date: string
    time: string
  }
}

export function ReminderTemplates({ client, appointment }: ReminderTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [customMessage, setCustomMessage] = useState("")

  const templates = {
    confirmation: {
      title: "Confirmação de Agendamento",
      message: `Olá ${client.name}! 😊\n\nSeu agendamento foi confirmado:\n📅 Data: ${appointment?.date || "[DATA]"}\n⏰ Horário: ${appointment?.time || "[HORÁRIO]"}\n💅 Serviço: ${appointment?.service || "[SERVIÇO]"}\n\nEstúdio Anisy Candine - Especialista em Molde F1\n\nQualquer dúvida, estou à disposição! 💖`,
    },
    reminder24h: {
      title: "Lembrete 24h Antes",
      message: `Oi ${client.name}! 😊\n\nLembrando que amanhã você tem agendamento comigo:\n⏰ ${appointment?.time || "[HORÁRIO]"}\n💅 ${appointment?.service || "[SERVIÇO]"}\n\nEstou ansiosa para te atender! Se precisar remarcar, me avise com antecedência.\n\nBeijos! 💖\nAnisy - Molde F1`,
    },
    reminder2h: {
      title: "Lembrete 2h Antes",
      message: `Oi ${client.name}! 😊\n\nSeu horário é daqui a 2 horas:\n⏰ ${appointment?.time || "[HORÁRIO]"}\n💅 ${appointment?.service || "[SERVIÇO]"}\n\nJá estou me preparando para te receber! ✨\n\nTe espero aqui! 💖`,
    },
    followup: {
      title: "Pós-Atendimento",
      message: `Oi ${client.name}! 😊\n\nEspero que tenha gostado do seu ${appointment?.service || "atendimento"}! ✨\n\nSuas unhas ficaram lindas! 💅💖\n\nSe puder, deixe sua avaliação e me marque nas redes sociais. Isso me ajuda muito! 📸\n\nObrigada pela confiança! Volte sempre! 🥰`,
    },
    birthday: {
      title: "Aniversário",
      message: `Parabéns, ${client.name}! 🎉🎂\n\nDesejo um dia repleto de alegria e realizações! ✨\n\nQue tal comemorar com unhas novas? Tenho uma promoção especial para aniversariantes! 💅💖\n\nBeijos e felicidades! 🥰\nAnisy`,
    },
    promotion: {
      title: "Promoção Especial",
      message: `Oi ${client.name}! 😊\n\n🎉 PROMOÇÃO ESPECIAL PARA VOCÊ! 🎉\n\n💅 Molde F1 Completo por apenas R$ 70,00\n✨ Válido até o final do mês\n\nVocê é uma cliente especial e merece esse desconto! 💖\n\nVamos agendar? 📅`,
    },
    return: {
      title: "Retorno de Cliente",
      message: `Oi ${client.name}! 😊\n\nSentimos sua falta aqui no estúdio! 💖\n\nQue tal agendar um novo atendimento? Suas unhas merecem um carinho especial! ✨\n\n💅 Tenho novidades incríveis para te mostrar!\n\nTe espero! Beijos! 🥰`,
    },
  }

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey)
    setCustomMessage(templates[templateKey as keyof typeof templates].message)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
          <MessageCircle className="w-4 h-4 mr-2" />
          Enviar Lembrete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl sm:text-2xl">Lembretes para {client.name}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Escolha um modelo de mensagem ou crie uma personalizada para enviar via WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:gap-6 py-4 sm:py-6">
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Modelos de Mensagem</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(templates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTemplateSelect(key)}
                  className={`justify-start text-left h-auto p-3 text-xs sm:text-sm ${
                    selectedTemplate === key ? "bg-amber-500 hover:bg-amber-600" : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {key === "confirmation" && <Calendar className="w-4 h-4" />}
                    {key === "reminder24h" && <Clock className="w-4 h-4" />}
                    {key === "reminder2h" && <Clock className="w-4 h-4" />}
                    {key === "followup" && <Star className="w-4 h-4" />}
                    {key === "birthday" && <span className="text-sm">🎂</span>}
                    {key === "promotion" && <span className="text-sm">🎉</span>}
                    {key === "return" && <span className="text-sm">💖</span>}
                    <span className="text-xs leading-tight">{template.title}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message" className="text-sm font-semibold">
              Mensagem
            </Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem personalizada..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={8}
              className="resize-none text-base"
            />
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t">
            <div className="text-sm text-gray-500 text-center">
              Para: {client.name} ({client.phone})
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="h-12 text-base">
                Cancelar
              </Button>
              <WhatsAppButton
                phone={client.phone}
                message={customMessage}
                variant="default"
                size="default"
                className="bg-green-600 hover:bg-green-700 text-white h-12 text-base"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
