import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, MessageSquare } from "lucide-react"
import { type Service } from "@/hooks/use-services"

interface ServiceModalProps {
  service: Service
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequestQuote?: () => void
}

const ServiceModal = ({ service, open, onOpenChange, onRequestQuote }: ServiceModalProps) => {
  // Instead of dynamic icon lookup, use MessageSquare as fallback
  const IconComponent = MessageSquare;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <IconComponent className="h-6 w-6 text-i9-blue" />
            <span>{service.title}</span>
          </DialogTitle>
          <DialogDescription>
            Detalhes completos sobre este serviço
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Descrição</h3>
            <p className="text-muted-foreground">{service.detailed_description}</p>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Faixa de Preço</h3>
              <div className="bg-i9-blue/10 dark:bg-i9-blue/20 rounded-lg p-4">
                <p className="text-lg font-medium text-i9-blue">{service.price_range}</p>
                {service.price_type && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Tipo: {service.price_type === 'monthly' ? 'Mensal' : 
                          service.price_type === 'project' ? 'Por Projeto' :
                          service.price_type === 'hourly' ? 'Por Hora' : 'Fixo'}
                  </p>
                )}
              </div>
            </div>

            {service.recommended_for && service.recommended_for.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Recomendado Para</h3>
                <ul className="space-y-2">
                  {service.recommended_for.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <Button 
                className="w-full btn-primary"
                onClick={onRequestQuote}
              >
                Solicitar Proposta
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Recursos Inclusos</h3>
            <ul className="space-y-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceModal