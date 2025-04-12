
import { MessageSquare } from "lucide-react"

export const WhatsAppButton = () => {
  const phoneNumber = "5511981977653" // Replace with actual phone number
  const message = "Olá! Gostaria de mais informações sobre os serviços da i9 Agência."
  
  const handleClick = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }
  
  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
      aria-label="Contato via WhatsApp"
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  )
}
