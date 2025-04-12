import { useState, useEffect } from "react"
import { format, isWeekend, isBefore, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useServices } from "@/hooks/use-services"

interface AppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedService?: string
}

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,}$/;
  return phoneRegex.test(phone);
};

// Função para calcular a data do Carnaval
function getCarnavalDates(year: number) {
  // O Carnaval ocorre 47 dias antes da Páscoa
  // Algoritmo de Meeus/Jones/Butcher para calcular a Páscoa
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  // Data da Páscoa
  const easter = new Date(year, month - 1, day)
  
  // Carnaval é 47 dias antes da Páscoa
  const carnaval = new Date(easter)
  carnaval.setDate(easter.getDate() - 47)
  
  // Retorna os dois dias de Carnaval
  const carnavalDay2 = new Date(carnaval)
  carnavalDay2.setDate(carnaval.getDate() + 1)
  
  return [carnaval, carnavalDay2]
}

// Lista de feriados nacionais brasileiros
const getBrazilianHolidays = (year: number) => {
  const carnavalDates = getCarnavalDates(year)
  
  return [
    { date: new Date(year, 0, 1), name: "Confraternização Universal" },
    { date: new Date(year, 0, 25), name: "Aniversário da Cidade de São Paulo" },
    { date: carnavalDates[0], name: "Carnaval" },
    { date: carnavalDates[1], name: "Carnaval" },
    { date: new Date(year, 3, 18), name: "Paixão de Cristo" },
    { date: new Date(year, 3, 21), name: "Tiradentes" },
    { date: new Date(year, 4, 1), name: "Dia Mundial do Trabalho" },
    { date: new Date(year, 6, 9), name: "Revolução Constitucionalista" },
    { date: new Date(year, 5, 19), name: "Corpus Christi" },
    { date: new Date(year, 5, 20), name: "Corpus Christi (continuação)" },
    { date: new Date(year, 8, 7), name: "Independência do Brasil" },
    { date: new Date(year, 9, 12), name: "Nossa Senhora Aparecida" },
    { date: new Date(year, 10, 2), name: "Finados" },
    { date: new Date(year, 10, 15), name: "Proclamação da República" },
    { date: new Date(year, 10, 20), name: "Dia da Consciência Negra" },
    { date: new Date(year, 11, 24), name: "Véspera de Natal" },
    { date: new Date(year, 11, 25), name: "Natal" },
    { date: new Date(year, 11, 26), name: "Recesso Fim de ano" },
    { date: new Date(year, 11, 27), name: "Recesso Fim de ano" },
    { date: new Date(year, 11, 28), name: "Recesso Fim de ano" },
    { date: new Date(year, 11, 29), name: "Recesso Fim de ano" },
    { date: new Date(year, 11, 30), name: "Recesso Fim de ano" },
    { date: new Date(year, 11, 31), name: "Virada de Ano Novo" },
    // Adiciona o recesso até 20 de janeiro do próximo ano
    { date: new Date(year + 1, 0, 1), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 2), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 3), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 4), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 5), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 6), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 7), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 8), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 9), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 10), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 11), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 12), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 13), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 14), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 15), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 16), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 17), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 18), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 19), name: "Recesso Fim de ano" },
    { date: new Date(year + 1, 0, 20), name: "Recesso Fim de ano" },
  ]
}

export const AppointmentModal = ({ open, onOpenChange, selectedService = "" }: AppointmentModalProps) => {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: selectedService,
    message: ""
  })
  const [existingAppointments, setExistingAppointments] = useState<{date: string, time_slot: string}[]>([])
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false)
  
  // Fetch services using the hook
  const { services, isLoading: isLoadingServices } = useServices()
  
  // Update selected service when prop changes
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, service: selectedService }))
    }
  }, [selectedService, open])

  // Fetch existing appointments when date changes
  useEffect(() => {
    const fetchExistingAppointments = async () => {
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd')
        const { data, error } = await supabase
          .from('agendamento_consultoria')
          .select('date, time_slot')
          .eq('date', formattedDate)

        if (!error && data) {
          setExistingAppointments(data)
        }
      }
    }

    fetchExistingAppointments()
  }, [date])
  
  const availableTimes = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ]
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Check if a time slot is already booked
  const isTimeSlotBooked = (time: string) => {
    if (!date) return false
    return existingAppointments.some(appointment => 
      appointment.time_slot === time
    )
  }
  
  // Verifica se a data deve ser desabilitada (fim de semana, data passada ou feriado)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetar horas para comparação apenas de datas
    
    const holidays = getBrazilianHolidays(date.getFullYear())
    const isHoliday = holidays.some(holiday => 
      holiday.date.getDate() === date.getDate() && 
      holiday.date.getMonth() === date.getMonth()
    )
    
    // Check for January dates of the next year
    const isJanuaryRecess = date.getMonth() === 0 && date.getDate() <= 20
    
    return (
      isWeekend(date) || // Desabilitar fins de semana (sábado e domingo)
      isBefore(date, today) || // Desabilitar datas passadas
      isHoliday || // Desabilitar feriados
      isJanuaryRecess // Desabilitar datas até 20 de janeiro
    )
  }

  // Função para obter o nome do feriado
  const getHolidayName = (date: Date) => {
    const holidays = getBrazilianHolidays(date.getFullYear())
    const holiday = holidays.find(h => 
      h.date.getDate() === date.getDate() && 
      h.date.getMonth() === date.getMonth()
    )
    return holiday?.name
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!date || !timeSlot) {
      toast({
        title: "Erro",
        description: "Selecione uma data e horário para o agendamento",
        variant: "destructive"
      });
      return;
    }

    // Check if time slot is already booked
    if (isTimeSlotBooked(timeSlot)) {
      toast({
        title: "Horário Indisponível",
        description: "Este horário já está reservado. Por favor, escolha outro horário.",
        variant: "destructive"
      });
      setTimeSlot(null); // Clear the selected time slot
      setIsSubmitDisabled(true); // Disable submit button
      return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive"
      });
      return;
    }

    // Validate phone format
    if (!isValidPhone(formData.phone)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de telefone válido (mínimo 10 dígitos)",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('agendamento_consultoria')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          date: format(date, 'yyyy-MM-dd'),
          time_slot: timeSlot,
          status: 'pending'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Horário Indisponível",
            description: "Este horário já foi reservado por outro usuário. Por favor, escolha outro horário.",
            variant: "destructive"
          });
          setTimeSlot(null); // Clear the selected time slot
          setIsSubmitDisabled(true); // Disable submit button
          return;
        }
        throw error;
      }

      toast({
        title: "Agendamento realizado!",
        description: `Sua consultoria foi agendada para ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às ${timeSlot}.`,
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
      setDate(undefined);
      setTimeSlot(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast({
        title: "Erro ao realizar agendamento",
        description: "Por favor, verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Consultoria</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para agendar uma consultoria com nossa equipe.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome*
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Seu nome e sobrenome"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  E-mail*
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="seu@email.com"
                  pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                  title="Digite um email válido"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Telefone* (mínimo 10 dígitos - s/ espaço)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(00) 00000-0000"
                  pattern="\+?[0-9]{10,}"
                  title="Digite apenas números, mínimo 10 dígitos"
                />
              </div>
              
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-1">
                  Serviço de Interesse*
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="" disabled>Selecione um serviço</option>
                  {!isLoadingServices && services?.map((service) => (
                    <option key={service.id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mensagem (máx. 1000 caracteres)
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  maxLength={1000}
                  rows={4}
                  placeholder="Descreva brevemente o que você precisa"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.message.length}/1000 caracteres
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Selecione uma data*</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Fins de semana, feriados nacionais e municipais (SP-Capital) não estão disponíveis
                </p>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={isDateDisabled}
                  locale={ptBR}
                  className="border rounded-md p-3 pointer-events-auto"
                  modifiersStyles={{
                    disabled: {
                      cursor: "not-allowed",
                      opacity: 0.5
                    }
                  }}
                  modifiers={{
                    holiday: (date) => !!getHolidayName(date)
                  }}
                  DayComponent={({ date: dayDate, ...props }) => {
                    const holidayName = getHolidayName(dayDate)
                    return (
                      <div
                        title={holidayName}
                        className={`relative group ${holidayName ? 'cursor-help' : ''}`}
                        {...props}
                      >
                        {dayDate.getDate()}
                        {holidayName && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {holidayName}
                          </div>
                        )}
                      </div>
                    )
                  }}
                />
              </div>
              
              {date && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Selecione um horário*</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => {
                      const today = new Date();
                      const selectedDate = new Date(date);
                      const [hours, minutes] = time.split(':').map(Number);
                      selectedDate.setHours(hours, minutes, 0, 0);
                      
                      // Desabilitar horários passados para o dia atual
                      const isPastTime = isBefore(selectedDate, today);
                      const isBooked = isTimeSlotBooked(time);
                      const isDisabled = isPastTime || isBooked;
                      
                      return (
                        <Button
                          key={time}
                          type="button"
                          variant={timeSlot === time ? "default" : "outline"}
                          onClick={() => {
                            if (!isDisabled) {
                              setTimeSlot(time);
                              setIsSubmitDisabled(false);
                            }
                          }}
                          disabled={isDisabled}
                          className={`
                            ${isDisabled ? "opacity-50" : ""} 
                            ${isBooked ? "bg-red-100 hover:bg-red-100 border-red-300 text-red-600 cursor-not-allowed" : ""}
                            ${timeSlot === time && !isBooked ? "bg-green-100 border-green-300 text-green-700" : ""}
                          `}
                          title={isBooked ? "Horário já reservado" : ""}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                  {timeSlot && isTimeSlotBooked(timeSlot) && (
                    <p className="text-red-500 text-sm mt-2">
                      Este horário já está reservado. Por favor, escolha outro horário.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="btn-primary w-full"
            disabled={!date || !timeSlot || isTimeSlotBooked(timeSlot) || isSubmitDisabled}
          >
            Confirmar Agendamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}